// Community Page Component
// Contains: Market Prices, News Updates, and Community Stats
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import MarketPrices from '../components/community/MarketPrices';
import NewsUpdates from '../components/community/NewsUpdates';
import { Users, Newspaper } from 'lucide-react';
import { Tr } from '../components/ui/SimpleTranslation';

function Community() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="bg-background-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              <Tr>Agricultural Community</Tr>
            </h1>
            <p className="text-text-secondary">
              <Tr>Stay updated with market prices and agricultural news</Tr>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - News Updates */}
          <div className="lg:col-span-2 space-y-6">
            {/* News Updates Section */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Newspaper className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-text-primary">
                  <Tr>Latest Agricultural News</Tr>
                </h2>
              </div>
              <NewsUpdates />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users size={20} className="text-primary" />
                  <span><Tr>Community Stats</Tr></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary"><Tr>Active Farmers</Tr></span>
                    <span className="font-semibold text-text-primary">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary"><Tr>Posts Today</Tr></span>
                    <span className="font-semibold text-text-primary">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary"><Tr>Countries</Tr></span>
                    <span className="font-semibold text-text-primary">47</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Prices */}
            <MarketPrices />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;