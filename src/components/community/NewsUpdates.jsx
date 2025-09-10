import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Newspaper, MapPin, Calendar } from 'lucide-react';
import { Tr } from '../ui/SimpleTranslation';

// Dummy data - in a real app, this would come from an API
const dummyNewsData = {
  'New York': [
    {
      id: 1,
      title: 'Wheat Prices Surge Due to Weather Concerns',
      summary: 'Recent weather patterns have caused concerns about wheat production, leading to price increases.',
      date: '2025-09-08',
      category: 'wheat',
      source: 'AgriNews'
    },
    {
      id: 2,
      title: 'New Corn Variety Shows Promise',
      summary: 'Researchers announce breakthrough in drought-resistant corn varieties.',
      date: '2025-09-07',
      category: 'corn',
      source: 'Farm Journal'
    }
  ],
  'Mumbai': [
    {
      id: 3,
      title: 'Rice Export Ban Extended',
      summary: 'Government extends rice export restrictions to stabilize domestic prices.',
      date: '2025-09-08',
      category: 'rice',
      source: 'Economic Times'
    },
    {
      id: 4,
      title: 'Cotton Production Hits Record High',
      summary: 'This season\'s cotton yield exceeds expectations across major growing regions.',
      date: '2025-09-06',
      category: 'cotton',
      source: 'Agri Business'
    }
  ],
  'London': [
    {
      id: 5,
      title: 'EU Agricultural Policy Changes',
      summary: 'New regulations affect subsidy programs for wheat and barley farmers.',
      date: '2025-09-08',
      category: 'wheat',
      source: 'Farming UK'
    },
    {
      id: 6,
      title: 'Climate Change Impact on Barley',
      summary: 'Study shows changing weather patterns affecting barley yields in northern regions.',
      date: '2025-09-05',
      category: 'barley',
      source: 'Climate Agriculture'
    }
  ]
};

const NewsUpdates = () => {
  const [location, setLocation] = useState('New York');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data based on location and crop filter
    setLoading(true);
    setTimeout(() => {
      let locationNews = dummyNewsData[location] || [];
      if (selectedCrop !== 'all') {
        locationNews = locationNews.filter(item => item.category === selectedCrop);
      }
      setNews(locationNews);
      setLoading(false);
    }, 1000);
  }, [location, selectedCrop]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCropOptions = () => {
    const crops = new Set();
    Object.values(dummyNewsData).forEach(locationNews => {
      locationNews.forEach(item => crops.add(item.category));
    });
    return Array.from(crops);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span><Tr>Agricultural News</Tr></span>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center text-text-secondary">
              <MapPin size={14} className="mr-1" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none focus:ring-0"
              >
                {Object.keys(dummyNewsData).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center text-text-secondary">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-transparent border-none focus:ring-0"
              >
                <option value="all"><Tr>All Crops</Tr></option>
                {getCropOptions().map(crop => (
                  <option key={crop} value={crop}><Tr>{crop}</Tr></option>
                ))}
              </select>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-text-secondary">
            <Tr>Loading news...</Tr>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-text-secondary">
            <Tr>No news available for the selected filters</Tr>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-background-card/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-text-primary text-sm">{item.title}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    <Tr>{item.category}</Tr>
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-3">{item.summary}</p>
                <div className="flex justify-between items-center text-xs text-text-secondary">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(item.date)}
                  </div>
                  <span>{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsUpdates;
