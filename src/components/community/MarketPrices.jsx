import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MapPin, DollarSign } from 'lucide-react';
import { Tr } from '../ui/SimpleTranslation';

// Dummy data - in a real app, this would come from an API
const dummyMarketData = {
  'New York': {
    wheat: 6.50,
    corn: 4.20,
    soybeans: 13.00,
  },
  'Mumbai': {
    wheat: 20.00, // INR
    corn: 18.50, // INR
    soybeans: 45.00, // INR
  },
  'London': {
    wheat: 5.80, // GBP
    corn: 3.90, // GBP
    soybeans: 12.50, // GBP
  }
};

const MarketPrices = () => {
  const [location, setLocation] = useState('New York');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data based on location
    setLoading(true);
    setTimeout(() => {
      setPrices(dummyMarketData[location]);
      setLoading(false);
    }, 1000);
  }, [location]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span><Tr>Live Market Prices</Tr></span>
          <div className="flex items-center text-sm text-text-secondary">
            <MapPin size={14} className="mr-1" />
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-none focus:ring-0"
            >
              {Object.keys(dummyMarketData).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-text-secondary">
            <Tr>Loading prices...</Tr>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(prices).map(([crop, price]) => (
              <div key={crop} className="flex justify-between items-center p-3 bg-background-card rounded-lg">
                <span className="capitalize font-medium text-text-primary"><Tr>{crop}</Tr></span>
                <span className="text-primary font-semibold flex items-center">
                  <DollarSign size={14} className="mr-1" />
                  {price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketPrices;
