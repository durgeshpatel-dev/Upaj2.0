import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AlertBanner from '../components/dashboard/AlertBanner';
import WeatherCard from '../components/dashboard/WeatherCard';
import SoilCard from '../components/dashboard/SoilCard';
import FarmMap from '../components/dashboard/FarmMap';
import PastPredictionsTable from '../components/dashboard/PastPredictionsTable';
import PredictionSummary from '../components/dashboard/PredictionSummary';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {isAuthenticated 
              ? `Welcome back, ${user?.name || 'User'}! Here's your farm's overview.`
              : 'Welcome to AgriVision Dashboard! This is a demo preview.'
            }
          </p>
        </header>

        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary font-medium">Demo Mode</h3>
                <p className="text-sm text-text-secondary">You're viewing a demo version. Sign up to access full features!</p>
              </div>
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <AlertBanner>
          Heads up! A frost is predicted for tonight. Consider taking preventive measures for sensitive crops.
        </AlertBanner>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <PredictionSummary />
          <WeatherCard />
          <SoilCard />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PastPredictionsTable />
          <FarmMap />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
