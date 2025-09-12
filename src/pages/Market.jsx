import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, TrendingUp, TrendingDown, MapPin, Calendar, RefreshCw, 
  BarChart3, DollarSign, Star, Eye, AlertCircle, 
  ChevronDown, ChevronUp, Activity, Globe, Zap, Target, ArrowUpRight,
  ArrowDownRight, Minus, Plus, X, CheckCircle, Clock, Users, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { Tr } from '../components/ui/SimpleTranslation';
import { useUnifiedTranslation } from '../hooks/useUnifiedTranslation';
import { marketAPI } from '../utils/api';

const Market = () => {
  const { language } = useUnifiedTranslation();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid', 'chart'
  const [sortBy, setSortBy] = useState('price'); // 'price', 'trend', 'volume', 'location'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [favorites, setFavorites] = useState(new Set());
  const [marketData, setMarketData] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // Standard 10 records per page
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalRecords: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  const [marketStats, setMarketStats] = useState({
    totalMarkets: 1247,
    activeCrops: 156,
    avgPriceChange: '+2.4%',
    lastUpdated: '2 min ago',
    topGainers: 23,
    topLosers: 8,
    totalVolume: '15.2M',
    avgPrice: '₹2,450'
  });
  const [availableCrops, setAvailableCrops] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [error, setError] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('marketFavorites');
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites);
        setFavorites(new Set(favoritesArray));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('marketFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Fetch initial page of data on mount
  useEffect(() => {
    fetchMarketData(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch static data like stats, crops, and states on mount
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [statsResult, cropsResult, statesResult] = await Promise.all([
          marketAPI.getMarketStats(language).catch(err => {
            console.warn('Failed to fetch market stats:', err);
            return { data: marketStats }; // Use initial state as fallback
          }),
          marketAPI.getAvailableCrops(language).catch(err => {
            console.warn('Failed to fetch crops:', err);
            return { data: [] };
          }),
          marketAPI.getAvailableStates(language).catch(err => {
            console.warn('Failed to fetch states:', err);
            return { data: [] };
          })
        ]);

        setMarketStats(statsResult.data);
        setAvailableCrops(cropsResult.data);
        setAvailableStates(statesResult.data);
      } catch (error) {
        console.error('Error fetching static data:', error);
      }
    };
    fetchStaticData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Re-fetch market data when language changes  
  useEffect(() => {
    console.log('🌐 Language changed to:', language);
    console.log('📊 Current market data length:', marketData.length);
    
    // Always refetch data when language changes
    setMarketData([]);
    setCurrentPage(1);
    
    // Add small delay to ensure state is updated
    const timer = setTimeout(() => {
      console.log('🔄 Refetching market data for language:', language);
      fetchMarketData(1);
    }, 100);
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Fetch districts when selected state changes
  useEffect(() => {
    const fetchDistrictsForState = async () => {
      if (selectedState) {
        try {
          console.log('🏙️ Fetching districts for state:', selectedState, 'in language:', language);
          const result = await marketAPI.getAvailableDistricts(selectedState, language);
          if (result.success) {
            setAvailableDistricts(result.data);
            console.log('✅ Districts loaded:', result.data.length, 'language:', result.language);
          }
        } catch (error) {
          console.error('❌ Error fetching districts:', error);
          setAvailableDistricts([]);
        }
      } else {
        // Clear districts when no state is selected
        setAvailableDistricts([]);
        setSelectedDistrict(''); // Also clear selected district
      }
    };

    fetchDistrictsForState();
  }, [selectedState, language]);

  // Only fetch initial data on component mount (no automatic filtering)

  // Process and sort market data with favorites at top
  const processedMarketData = useMemo(() => {
    let data = [...marketData];
    
    // Separate favorites and non-favorites
    const favoriteItems = data.filter(item => favorites.has(item.id));
    const nonFavoriteItems = data.filter(item => !favorites.has(item.id));
    
    // Sort each group
    const sortItems = (items) => {
      return items.sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case 'price':
            aValue = a.modalPrice;
            bValue = b.modalPrice;
            break;
          case 'trend':
            aValue = parseFloat(a.change.replace(/[+%]/g, ''));
            bValue = parseFloat(b.change.replace(/[+%]/g, ''));
            break;
          case 'volume':
            aValue = parseInt(a.volume.replace(/[,\s]/g, ''));
            bValue = parseInt(b.volume.replace(/[,\s]/g, ''));
            break;
          case 'location':
            aValue = `${a.state} ${a.district}`.toLowerCase();
            bValue = `${b.state} ${b.district}`.toLowerCase();
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    };
    
    // Return favorites first, then non-favorites
    return [...sortItems(favoriteItems), ...sortItems(nonFavoriteItems)];
  }, [marketData, sortBy, sortOrder, favorites]);

  // Get top gainers and losers
  const topGainers = useMemo(() => {
    return marketData
      .filter(item => item.trend === 'up')
      .sort((a, b) => parseFloat(b.change.replace(/[+%]/g, '')) - parseFloat(a.change.replace(/[+%]/g, '')))
      .slice(0, 5);
  }, [marketData]);

  const topLosers = useMemo(() => {
    return marketData
      .filter(item => item.trend === 'down')
      .sort((a, b) => parseFloat(a.change.replace(/[+%]/g, '')) - parseFloat(b.change.replace(/[+%]/g, '')))
      .slice(0, 5);
  }, [marketData]);

  const fetchMarketData = async (page = currentPage) => {
    try {
      setError(null);
      setLoading(true);
      
      // Clear any cached data when fetching
      if (page === 1) {
        setMarketData([]);
      }
      
      const filters = {};
      if (selectedCrop) filters.crop = selectedCrop;
      if (selectedState) filters.state = selectedState;
      if (selectedDistrict) filters.district = selectedDistrict;

      // Always add pagination parameters and language
      const params = {
        ...filters,
        page,
        limit: recordsPerPage,
        language: language // Ensure we always use current language
      };

      console.log('🚀 Frontend: Calling marketAPI.getMarketPrices with params:', params);
      console.log('🌐 Frontend: Current language state:', language);
      
      const result = await marketAPI.getMarketPrices(params);
      
      console.log('📥 Frontend: Received result:', result);
      console.log('📥 Frontend: Result data length:', result.data?.length);
      console.log('🌐 Frontend: Language used:', language);
      console.log('🔍 Frontend: First item data:', result.data?.[0]);
      console.log('📄 Frontend: Pagination info:', result.pagination);
      
      if (result.success) {
        console.log('📥 Frontend: Successfully received data in language:', language);
        console.log('🔍 Frontend: First item verification:', {
          crop: result.data?.[0]?.crop,
          state: result.data?.[0]?.state,
          district: result.data?.[0]?.district,
          language: language
        });
        
        setMarketData(result.data || []);
        
        // Update pagination state
        if (result.pagination) {
          console.log('🔧 Frontend: Setting pagination state:', result.pagination);
          setPagination({
            totalPages: result.pagination.totalPages,
            totalRecords: result.pagination.totalRecords,
            hasNextPage: result.pagination.hasNextPage,
            hasPreviousPage: result.pagination.hasPreviousPage
          });
          setCurrentPage(result.pagination.currentPage);
          console.log('🔧 Frontend: Pagination UI should show:', result.pagination.totalPages > 1);
        }
        
        console.log('✅ Frontend: Market data updated:', result.data?.length, 'records');
        console.log('📄 Frontend: Page', result.pagination?.currentPage, 'of', result.pagination?.totalPages);
        
        // Handle case when no live data is available
        if (result.source === 'no-data') {
          setError('No live market data available from government sources. Please try different filters or check back later.');
        }
      } else {
        throw new Error(result.message || 'Failed to fetch market data');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError(`Failed to load market prices: ${error.message}. Please try again or contact support.`);
      
      // No fallback data - let backend handle comprehensive mock data
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  };

  // New function to handle filter application
  const handleApplyFilters = async () => {
    console.log('🔍 Apply Filters clicked');
    console.log('🔍 Current filter state:', { selectedCrop, selectedState, selectedDistrict });
    
    // Clear any existing data to show loading state
    setMarketData([]);
    setError(null);
    setCurrentPage(1); // Reset to first page when applying filters
    
    await fetchMarketData(1);
  };

  // Function to handle clearing filters
  const handleClearFilters = async () => {
    setSelectedCrop('');
    setSelectedState('');
    setSelectedDistrict('');
    setCurrentPage(1); // Reset to first page when clearing filters
    await fetchMarketData(1);
  };

  const handleRefresh = async () => {
    setCurrentPage(1); // Reset to first page when refreshing
    await fetchMarketData(1);
  };

  // Removed handleSearchChange function as search functionality is no longer needed



  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-status-success" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-status-error" />;
    return <Minus className="w-4 h-4 text-text-secondary" />;
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High': return 'text-red-400';
      case 'High': return 'text-orange-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-text-secondary';
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Premium': return 'text-purple-400';
      case 'A+': return 'text-green-400';
      case 'A': return 'text-blue-400';
      case 'B+': return 'text-yellow-400';
      default: return 'text-text-secondary';
    }
  };

  // Removed exportData function as export functionality is no longer needed

  // Pagination functions
  const handlePageChange = async (page) => {
    if (page < 1 || page > pagination.totalPages || loading) return;
    
    setCurrentPage(page);
    await fetchMarketData(page);
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      handlePageChange(currentPage - 1);
    }
  };

  // Removed handleRecordsPerPageChange function as records per page is now fixed at 10

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = currentPage;
    
    // Always show first page
    if (totalPages > 0) pages.push(1);
    
    // Add ellipsis and current page area
    if (current > 3) pages.push('...');
    
    // Add pages around current page
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    
    // Add ellipsis and last page
    if (current < totalPages - 2) pages.push('...');
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
    
    return pages;
  };

  // Show preview modal
  const showPreview = (item) => {
    setPreviewItem(item);
    setShowPreviewModal(true);
  };

  // Close preview modal
  const closePreview = () => {
    setShowPreviewModal(false);
    setPreviewItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-card">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent">
                  <Tr>Market Intelligence</Tr>
                </h1>
              </div>
              <p className="text-text-secondary text-lg">
                <Tr>Real-time crop prices, trends & insights across Indian markets</Tr>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-primary/25"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="font-medium"><Tr>Refresh Data</Tr></span>
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm font-medium"><Tr>Total Markets</Tr></p>
                  <p className="text-3xl font-bold text-text-primary">{marketStats.totalMarkets}</p>
                </div>
              </div>
              <div className="flex items-center text-status-success text-sm">
                <Activity className="w-4 h-4 mr-1" />
                <span><Tr>+12% this month</Tr></span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-status-success/10 rounded-xl group-hover:bg-status-success/20 transition-colors">
                  <DollarSign className="w-6 h-6 text-status-success" />
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm font-medium"><Tr>Active Crops</Tr></p>
                  <p className="text-3xl font-bold text-text-primary">{marketStats.activeCrops}</p>
                </div>
              </div>
              <div className="flex items-center text-status-success text-sm">
                <TrendingUpIcon className="w-4 h-4 mr-1" />
                <span><Tr>+5 new this week</Tr></span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-status-success/10 rounded-xl group-hover:bg-status-success/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-status-success" />
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm font-medium"><Tr>Avg Price Change</Tr></p>
                  <p className="text-3xl font-bold text-status-success">{marketStats.avgPriceChange}</p>
                </div>
              </div>
              <div className="flex items-center text-status-success text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span><Tr>Market bullish</Tr></span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm font-medium"><Tr>lastUpdated</Tr></p>
                  <p className="text-3xl font-bold text-text-primary"><Tr>justNow</Tr></p>
                </div>
              </div>
              <div className="flex items-center text-text-secondary text-sm">
                <Zap className="w-4 h-4 mr-1" />
                <span><Tr>Live updates</Tr></span>
              </div>
            </div>
          </div>

          {/* Top Gainers & Losers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                  <TrendingUp className="w-5 h-5 text-status-success mr-2" />
                  <Tr>Top Gainers</Tr>
                </h3>
                <span className="text-sm text-text-secondary">{topGainers.length} <Tr>items</Tr></span>
              </div>
              <div className="space-y-3">
                {topGainers.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-status-success/10 rounded-full flex items-center justify-center">
                        <span className="text-status-success font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{item.crop}</p>
                        <p className="text-sm text-text-secondary">{item.market}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-status-success">{item.change}</p>
                      <p className="text-sm text-text-secondary">₹{item.modalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                  <TrendingDown className="w-5 h-5 text-status-error mr-2" />
                  <Tr>Top Losers</Tr>
                </h3>
                <span className="text-sm text-text-secondary">{topLosers.length} <Tr>items</Tr></span>
              </div>
              <div className="space-y-3">
                {topLosers.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-status-error/10 rounded-full flex items-center justify-center">
                        <span className="text-status-error font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{item.crop}</p>
                        <p className="text-sm text-text-secondary">{item.market}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-status-error">{item.change}</p>
                      <p className="text-sm text-text-secondary">₹{item.modalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-status-error/10 border border-status-error/20 rounded-xl p-4 mb-6 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-status-error" />
              <p className="text-status-error text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-gradient-to-r from-background-card to-background-card/50 border border-border rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-background rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Target className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Enhanced Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-background border border-border px-6 py-4 rounded-xl hover:border-primary hover:bg-background/50 transition-all duration-200 group"
            >
              <Filter className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="font-medium"><Tr>Filters</Tr></span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Enhanced Filters */}
          {showFilters && (
            <div className="space-y-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    <Tr>Crop Type</Tr>
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  >
                    <option value=""><Tr>All Crops</Tr></option>
                    {availableCrops.map(crop => (
                      <option key={crop.value || crop} value={crop.value || crop}>
                        {crop.label || crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    <Tr>State</Tr>
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  >
                    <option value=""><Tr>All States</Tr></option>
                    {availableStates.map(state => (
                      <option key={state.value || state} value={state.value || state}>
                        {state.label || state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    <Tr>District</Tr>
                  </label>
                  {selectedState && availableDistricts.length > 0 ? (
                    // Show dropdown when state is selected and districts are available
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    >
                      <option value=""><Tr>All Districts</Tr></option>
                      {availableDistricts.map(district => (
                        <option 
                          key={typeof district === 'string' ? district : district.value} 
                          value={typeof district === 'string' ? district : district.value}
                        >
                          {typeof district === 'string' ? district : district.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    // Show search input when no state is selected or no districts available
                    <input
                      type="text"
                      placeholder={selectedState ? 
                        (language === 'hi' ? "जिले लोड हो रहे हैं..." : "Loading districts...") : 
                        (language === 'hi' ? "जिले का नाम दर्ज करें..." : "Enter district name...")
                      }
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={selectedState && availableDistricts.length === 0}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
                    />
                  )}
                </div>
              </div>

              {/* Filter Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                <div className="flex gap-3">
                  <button
                    onClick={handleApplyFilters}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-primary/25"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">
                      {loading ? <><Tr>Applying...</Tr></> : <><Tr>Apply Filters</Tr></>}
                    </span>
                  </button>
                  <button
                    onClick={handleClearFilters}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-background border border-border text-text-primary px-6 py-3 rounded-xl hover:border-primary hover:bg-background/50 transition-all duration-200 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span className="font-medium"><Tr>Clear All</Tr></span>
                  </button>
                </div>
                
                {/* Filter Status */}
                {(selectedCrop || selectedState || selectedDistrict) && (
                  <div className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {[selectedCrop, selectedState, selectedDistrict].filter(Boolean).length} <Tr>filter(s) selected</Tr>
                    </span>
                  </div>
                )}
              </div>

              {/* Sorting Options */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-text-primary"><Tr>Sort by:</Tr></span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'price', label: <Tr>Price</Tr> },
                    { key: 'trend', label: <Tr>Trend</Tr> },
                    { key: 'volume', label: <Tr>Volume</Tr> },
                    { key: 'location', label: <Tr>Location</Tr> }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSort(option.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        sortBy === option.key
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-background border border-border text-text-secondary hover:text-text-primary hover:border-primary'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.key && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleClearFilters}
                  disabled={loading}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                >
                  <Tr>Reset Sorting</Tr>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Market Data Display */}
        <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-6 border-b border-border bg-gradient-to-r from-background to-background/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary flex items-center">
                  <BarChart3 className="w-6 h-6 text-primary mr-3" />
                  <Tr>Market Prices</Tr>
                </h2>
                <p className="text-text-secondary mt-1">
                  <Tr>Live market data</Tr> • 
                  {pagination.showingAll ? (
                    <span><Tr>Showing all</Tr> {pagination.totalRecords} <Tr>records</Tr></span>
                  ) : (
                    <span><Tr>Page</Tr> {currentPage} <Tr>of</Tr> {pagination.totalPages || 1} • {pagination.totalRecords || marketData.length} <Tr>total records</Tr></span>
                  )}
                  {favorites.size > 0 && (
                    <span className="ml-2 text-primary font-medium">
                      • {favorites.size} <Tr>favorites at top</Tr>
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-text-secondary">
                  <Users className="w-4 h-4" />
                  <span><Tr>Active traders</Tr></span>
                </div>
                <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary"><Tr>Loading market data...</Tr></h3>
                <p className="text-text-secondary"><Tr>Fetching latest prices and trends</Tr></p>
              </div>
            </div>
          ) : processedMarketData.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-text-secondary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary"><Tr>No data found</Tr></h3>
                <p className="text-text-secondary"><Tr>Try adjusting your filters</Tr></p>
              </div>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background/50">
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <Tr>Crop Name</Tr>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <Tr>Location</Tr>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <Tr>Price Range</Tr>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <Tr>Modal Price</Tr>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <Tr>Trend</Tr>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <Tr>Quality & Demand</Tr>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <Tr>Actions</Tr>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {processedMarketData.map((item) => (
                    <tr key={item.id} className={`hover:bg-background/30 transition-all duration-200 group ${
                      favorites.has(item.id) ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="text-primary font-bold text-sm">{item.crop.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary">{item.crop}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-text-secondary" />
                          <div>
                            <div className="font-medium text-text-primary">{item.market}</div>
                            <div className="text-sm text-text-secondary">{item.district}, {item.state}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm text-text-primary">
                          ₹{item.minPrice.toLocaleString()} - ₹{item.maxPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-text-secondary"><Tr>per quintal</Tr></div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-xl font-bold text-text-primary">
                          ₹{item.modalPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(item.trend)}
                          <span className={`font-semibold ${
                            item.trend === 'up' ? 'text-status-success' : 
                            item.trend === 'down' ? 'text-status-error' : 'text-text-secondary'
                          }`}>
                            {item.change}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className={`text-sm font-medium ${getQualityColor(item.quality)}`}>
                            {item.quality}
                          </div>
                          <div className={`text-xs ${getDemandColor(item.demand)}`}>
                            {item.demand} <Tr>demand</Tr>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              favorites.has(item.id) 
                                ? 'text-yellow-400 bg-yellow-400/10' 
                                : 'text-text-secondary hover:text-yellow-400 hover:bg-yellow-400/10'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => showPreview(item)}
                            className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedMarketData.map((item) => (
                  <div key={item.id} className={`bg-background/50 border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group ${
                    favorites.has(item.id) 
                      ? 'border-primary/50 bg-primary/5 border-l-4 border-l-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-primary font-bold text-lg">{item.crop.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary">{item.crop}</h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            favorites.has(item.id) 
                              ? 'text-yellow-400 bg-yellow-400/10' 
                              : 'text-text-secondary hover:text-yellow-400 hover:bg-yellow-400/10'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => showPreview(item)}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span>{item.market}, {item.district}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-text-primary">₹{item.modalPrice.toLocaleString()}</div>
                          <div className="text-sm text-text-secondary">₹{item.minPrice.toLocaleString()} - ₹{item.maxPrice.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center space-x-1 font-semibold ${
                            item.trend === 'up' ? 'text-status-success' : 
                            item.trend === 'down' ? 'text-status-error' : 'text-text-secondary'
                          }`}>
                            {getTrendIcon(item.trend)}
                            <span>{item.change}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className={`${getQualityColor(item.quality)} font-medium`}>
                          {item.quality}
                        </div>
                        <div className={`${getDemandColor(item.demand)}`}>
                          {item.demand} <Tr>demand</Tr>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                          <span>{item.volume}</span>
                          <span>{item.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls - Always show when there are multiple pages */}
        {(pagination.totalPages > 1) && (
          <div className="mt-6 bg-gradient-to-r from-background-card to-background-card/50 border border-border rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              {/* Pagination Info */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-text-secondary">
                  <Tr>Showing</Tr> {((currentPage - 1) * recordsPerPage) + 1} - {Math.min(currentPage * recordsPerPage, pagination.totalRecords)} <Tr>of</Tr> {pagination.totalRecords} <Tr>records</Tr>
                </div>
                <div className="text-sm text-text-secondary">
                  {recordsPerPage} <Tr>records per page</Tr>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPreviousPage || loading}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  <span className="hidden sm:inline"><Tr>Previous</Tr></span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                      disabled={page === '...' || loading}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        page === currentPage
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : page === '...'
                          ? 'text-text-secondary cursor-default'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background/50 border border-transparent hover:border-border'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage || loading}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <span className="hidden sm:inline"><Tr>Next</Tr></span>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>

            {/* Loading Indicator for Pagination */}
            {loading && (
              <div className="mt-4 flex items-center justify-center py-4">
                <div className="flex items-center space-x-2 text-primary">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm"><Tr>Loading page</Tr> {currentPage}...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Market Insights Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Tips */}
          <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <Target className="w-6 h-6 text-primary mr-3" />
              <Tr>Market Insights</Tr>
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors">
                <div className="p-2 bg-status-success/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-status-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2"><Tr>Best Selling Time</Tr></h4>
                  <p className="text-sm text-text-secondary"><Tr>Monitor price trends and sell when prices are trending upward. Peak selling hours are usually 10 AM - 2 PM.</Tr></p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2"><Tr>Compare Markets</Tr></h4>
                  <p className="text-sm text-text-secondary"><Tr>Check prices in nearby districts to find the best rates. Transportation costs should be factored in.</Tr></p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors">
                <div className="p-2 bg-status-warning/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-status-warning" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2"><Tr>Quality Matters</Tr></h4>
                  <p className="text-sm text-text-secondary"><Tr>Higher quality crops command premium prices. Invest in proper storage and handling.</Tr></p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Statistics */}
          <div className="bg-gradient-to-br from-background-card to-background-card/50 border border-border rounded-2xl p-6">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 text-primary mr-3" />
              <Tr>Market Statistics</Tr>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-status-success/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-status-success" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary"><Tr>Average Price</Tr></p>
                    <p className="font-bold text-text-primary">{marketStats.avgPrice}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-status-success font-semibold"><Tr>+12% this month</Tr></p>
                  <p className="text-xs text-text-secondary"><Tr>vs last week</Tr></p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary"><Tr>Total Volume</Tr></p>
                    <p className="font-bold text-text-primary">{marketStats.totalVolume}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-status-success font-semibold"><Tr>+5 new this week</Tr></p>
                  <p className="text-xs text-text-secondary"><Tr>vs last month</Tr></p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-status-warning/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-status-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary"><Tr>Market Activity</Tr></p>
                    <p className="font-bold text-text-primary"><Tr>Market bullish</Tr></p>
                  </div>
                </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
                      <p className="text-xs text-text-secondary"><Tr>Live updates</Tr></p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end gap-4 p-6 bg-gradient-to-r from-background-card to-background-card/50 border border-border rounded-2xl">
          <div className="text-sm text-text-secondary">
            <Tr>Last updated:</Tr> {new Date().toLocaleString()}
          </div>
        </div>

        {/* Preview Modal */}
        {showPreviewModal && previewItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-text-primary flex items-center">
                    <BarChart3 className="w-6 h-6 text-primary mr-3" />
                    <Tr>Market Details</Tr>
                  </h3>
                  <button
                    onClick={closePreview}
                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-background/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Header Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="text-primary font-bold text-2xl">{previewItem.crop.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-text-primary">{previewItem.crop}</h4>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="w-4 h-4 text-text-secondary" />
                      <span className="text-text-secondary">{previewItem.market}, {previewItem.district}, {previewItem.state}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-text-primary">₹{previewItem.modalPrice.toLocaleString()}</div>
                    <div className="text-sm text-text-secondary"><Tr>per quintal</Tr></div>
                  </div>
                </div>

                {/* Price Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background/30 rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-1"><Tr>Minimum Price</Tr></div>
                    <div className="text-xl font-bold text-text-primary">₹{previewItem.minPrice.toLocaleString()}</div>
                  </div>
                  <div className="bg-background/30 rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-1"><Tr>Maximum Price</Tr></div>
                    <div className="text-xl font-bold text-text-primary">₹{previewItem.maxPrice.toLocaleString()}</div>
                  </div>
                  <div className="bg-background/30 rounded-xl p-4">
                    <div className="text-sm text-text-secondary mb-1"><Tr>Price Range</Tr></div>
                    <div className="text-xl font-bold text-text-primary">
                      ₹{previewItem.maxPrice - previewItem.minPrice}
                    </div>
                  </div>
                </div>

                {/* Market Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-text-primary"><Tr>Market Information</Tr></h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>Market Name:</Tr></span>
                        <span className="text-text-primary font-medium">{previewItem.market}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>District:</Tr></span>
                        <span className="text-text-primary font-medium">{previewItem.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>State:</Tr></span>
                        <span className="text-text-primary font-medium">{previewItem.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>Volume:</Tr></span>
                        <span className="text-text-primary font-medium">{previewItem.volume}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-text-primary"><Tr>Quality & Trends</Tr></h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>Quality:</Tr></span>
                        <span className={`font-medium ${getQualityColor(previewItem.quality)}`}>
                          {previewItem.quality}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>Demand:</Tr></span>
                        <span className={`font-medium ${getDemandColor(previewItem.demand)}`}>
                          {previewItem.demand}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>Trend:</Tr></span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(previewItem.trend)}
                          <span className={`font-medium ${
                            previewItem.trend === 'up' ? 'text-status-success' : 
                            previewItem.trend === 'down' ? 'text-status-error' : 'text-text-secondary'
                          }`}>
                            {previewItem.change}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary"><Tr>Last Updated:</Tr></span>
                        <span className="text-text-primary font-medium">{previewItem.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleFavorite(previewItem.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        favorites.has(previewItem.id) 
                          ? 'text-yellow-400 bg-yellow-400/10' 
                          : 'text-text-secondary hover:text-yellow-400 hover:bg-yellow-400/10'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${favorites.has(previewItem.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">
                        {favorites.has(previewItem.id) ? <Tr>Remove from Favorites</Tr> : <Tr>Add to Favorites</Tr>}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={closePreview}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Tr>Close</Tr>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;

