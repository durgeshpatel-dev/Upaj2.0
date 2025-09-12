import React, { useState, useEffect } from 'react';
import { Tr } from '../ui/SimpleTranslation';
import { diseaseAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

// Disease image component with circular display
const DiseaseImage = ({ imageUrl, crop, disease }) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback to crop icon if image fails to load
  const CropIcon = ({ crop, disease }) => {
    const getIconStyle = (crop, disease) => {
      // Color based on disease severity
      if (disease?.toLowerCase().includes('blight') || disease?.toLowerCase().includes('bacterial')) {
        return 'bg-red-500';
      } else if (disease?.toLowerCase().includes('healthy')) {
        return 'bg-green-500';
      } else {
        return 'bg-yellow-500';
      }
    };

    const getIconContent = (crop) => {
      // Simple crop icons using emojis or first letter
      const cropIcons = {
        'tomato': '🍅',
        'potato': '🥔',
        'bell pepper': '🫑',
        'pepper': '🌶️',
        'wheat': '🌾',
        'corn': '🌽',
        'rice': '🌾',
        'default': crop?.charAt(0)?.toUpperCase() || '🌱'
      };
      
      return cropIcons[crop?.toLowerCase()] || cropIcons.default;
    };

    return (
      <div className={`w-10 h-10 rounded-full ${getIconStyle(crop, disease)} flex items-center justify-center text-white text-sm font-medium`}>
        {getIconContent(crop)}
      </div>
    );
  };

  if (!imageUrl || imageError) {
    return <CropIcon crop={crop} disease={disease} />;
  }

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
      <img 
        src={imageUrl} 
        alt={`${crop} - ${disease}`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

const RecentDiseasePredictions = ({ predictions = [], loading = false, onView }) => {
  const { user, isAuthenticated } = useAuth();
  const [diseaseData, setDiseaseData] = useState([]);
  const [diseaseLoading, setDiseaseLoading] = useState(false);
  const [diseaseError, setDiseaseError] = useState(null);

  // Fetch disease predictions from API
  useEffect(() => {
    const fetchDiseaseData = async () => {
      console.log('🦠 RecentDiseasePredictions: Starting disease data fetch...');
      console.log('🦠 RecentDiseasePredictions: Auth status:', { isAuthenticated });
      console.log('🦠 RecentDiseasePredictions: User data:', { user, userId: user?.id || user?._id });

      if (!isAuthenticated) {
        console.log('🚫 RecentDiseasePredictions: User not authenticated, skipping disease fetch');
        setDiseaseData([]);
        setDiseaseLoading(false);
        return;
      }

      if (!(user?.id || user?._id)) {
        console.log('🚫 RecentDiseasePredictions: No user ID available, skipping disease fetch');
        setDiseaseData([]);
        setDiseaseLoading(false);
        return;
      }

      console.log('✅ RecentDiseasePredictions: All conditions met, proceeding with disease fetch');
      setDiseaseLoading(true);
      setDiseaseError(null);
      
      try {
        const userId = user.id || user._id;
        console.log('📤 RecentDiseasePredictions: Calling getRecentDiseasePredictions with userId:', userId);
        
        const result = await diseaseAPI.getRecentDiseasePredictions(userId, 5);
        
        console.log('📥 RecentDiseasePredictions: API response received:', result);
        console.log('📥 RecentDiseasePredictions: Response success:', result.success);
        console.log('📥 RecentDiseasePredictions: Response data:', result.data);
        
        if (result.success) {
          const diseaseArray = Array.isArray(result.data) ? result.data : [];
          console.log('📊 RecentDiseasePredictions: Normalized disease array:', diseaseArray);
          console.log('📊 RecentDiseasePredictions: Array length:', diseaseArray.length);
          setDiseaseData(diseaseArray);
          console.log('✅ RecentDiseasePredictions: Disease data set successfully:', diseaseArray.length, 'items');
        } else {
          console.log('❌ RecentDiseasePredictions: API call failed:', result.error);
          setDiseaseError(result.error);
          setDiseaseData([]);
        }
      } catch (error) {
        console.error('❌ RecentDiseasePredictions: Unexpected error fetching disease data:', error);
        console.error('❌ RecentDiseasePredictions: Error name:', error.name);
        console.error('❌ RecentDiseasePredictions: Error message:', error.message);
        console.error('❌ RecentDiseasePredictions: Error stack:', error.stack);
        setDiseaseError(error.message || 'Failed to fetch disease data');
        setDiseaseData([]);
      } finally {
        setDiseaseLoading(false);
        console.log('🔄 RecentDiseasePredictions: Disease fetch completed');
      }
    };

    fetchDiseaseData();
  }, [user, isAuthenticated]);

  // Transform predictions to match disease prediction format (fallback for existing predictions)
  const diseaseFromPredictions = predictions.map(p => {
    // Handle location - it might be an object with coordinates, state, district
    let locationString = 'Punjab, Amritsar'; // default
    if (p.location) {
      if (typeof p.location === 'string') {
        locationString = p.location;
      } else if (p.location.state && p.location.district) {
        locationString = `${p.location.district}, ${p.location.state}`;
      } else if (p.location.district) {
        locationString = p.location.district;
      } else if (p.location.state) {
        locationString = p.location.state;
      }
    }

    return {
      id: p.id,
      image: p.crop,
      crop: p.crop || 'Unknown',
      date: new Date(p.createdAt || p.date || Date.now()).toLocaleDateString(),
      disease: p.predictedDisease || p.disease || 'Unknown Disease',
      location: locationString,
      imageUrl: p.imageUrl
    };
  });

  // Show sample data if no real data available
  const sampleData = [
    {
      id: 'sample-1',
      image: 'tomato',
      crop: 'Tomato',
      date: '9/10/2025',
      disease: 'Late Blight',
      location: 'Punjab, Amritsar',
      imageUrl: null
    },
    {
      id: 'sample-2', 
      image: 'potato',
      crop: 'Potato',
      date: '9/9/2025',
      disease: 'Healthy',
      location: 'Punjab, Amritsar',
      imageUrl: null
    },
    {
      id: 'sample-3',
      image: 'bell pepper',
      crop: 'Bell Pepper', 
      date: '9/9/2025',
      disease: 'Bacterial Spot',
      location: 'Punjab, Amritsar',
      imageUrl: null
    }
  ];

  // Priority: API disease data > predictions data > sample data
  let displayData = [];
  let isLoading = loading || diseaseLoading;
  
  if (diseaseData.length > 0) {
    // Use API disease data if available
    displayData = diseaseData.map(item => ({
      id: item.id,
      image: item.crop,
      crop: item.crop,
      date: new Date(item.date).toLocaleDateString(),
      disease: item.disease,
      location: item.location,
      imageUrl: item.imageUrl
    }));
  } else if (diseaseFromPredictions.length > 0) {
    // Fallback to predictions data
    displayData = diseaseFromPredictions;
  } else if (!isAuthenticated) {
    // Show sample data for non-authenticated users
    displayData = sampleData;
  } else {
    // Show empty state for authenticated users with no data
    displayData = [];
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-background-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          <Tr>Recent Disease Predictions</Tr>
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-background rounded animate-pulse">
              <div className="w-10 h-10 bg-border rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-border rounded w-1/4"></div>
                <div className="h-3 bg-border rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (diseaseError && isAuthenticated) {
    return (
      <div className="rounded-lg border border-border bg-background-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          <Tr>Recent Disease Predictions</Tr>
        </h3>
        <div className="text-center py-8">
          <div className="text-status-error mb-2">⚠️</div>
          <p className="text-text-secondary text-sm mb-2">
            <Tr>Unable to load disease predictions</Tr>
          </p>
          <p className="text-text-secondary text-xs">{diseaseError}</p>
        </div>
      </div>
    );
  }

  // Show empty state for authenticated users with no data
  if (displayData.length === 0 && isAuthenticated) {
    return (
      <div className="rounded-lg border border-border bg-background-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          <Tr>Recent Disease Predictions</Tr>
        </h3>
        <div className="text-center py-8">
          <div className="text-text-secondary mb-2">🌱</div>
          <p className="text-text-secondary text-sm">
            <Tr>No disease predictions yet</Tr>
          </p>
          <p className="text-text-secondary text-xs mt-1">
            <Tr>Upload plant images to get disease predictions</Tr>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        <Tr>Recent Disease Predictions</Tr>
      </h3>
      
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-text-secondary text-sm">
              <th className="text-left pb-3 font-medium"><Tr>Image</Tr></th>
              <th className="text-left pb-3 font-medium"><Tr>Crop</Tr></th>
              <th className="text-left pb-3 font-medium"><Tr>Date</Tr></th>
              <th className="text-left pb-3 font-medium"><Tr>Disease</Tr></th>
              <th className="text-left pb-3 font-medium"><Tr>View</Tr></th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {displayData.map((item, index) => (
              <tr key={item.id} className="border-b border-border last:border-b-0">
                <td className="py-3">
                  <DiseaseImage 
                    imageUrl={item.imageUrl} 
                    crop={item.crop} 
                    disease={item.disease} 
                  />
                </td>
                <td className="py-3">
                  <div className="text-text-primary font-medium">{item.crop}</div>
                  <div className="text-text-secondary text-sm">{item.location}</div>
                </td>
                <td className="py-3 text-text-secondary text-sm">{item.date}</td>
                <td className="py-3">
                  <span className={`font-medium ${
                    item.disease.toLowerCase().includes('healthy') 
                      ? 'text-status-success' 
                      : item.disease.toLowerCase().includes('blight') || item.disease.toLowerCase().includes('bacterial')
                      ? 'text-status-error'
                      : 'text-status-warning'
                  }`}>
                    {item.disease}
                  </span>
                </td>
                <td className="py-3">
                  <button 
                    onClick={() => onView?.(item.id)}
                    className="text-primary hover:text-primary/80 transition-colors"
                    aria-label={`View prediction for ${item.crop}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDiseasePredictions;
