import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AlertBanner from '../components/dashboard/AlertBanner';
import WeatherCard from '../components/dashboard/WeatherCard';
import SoilCard from '../components/dashboard/SoilCard';
import FarmMap from '../components/dashboard/FarmMap';
import PastPredictionsTable from '../components/dashboard/PastPredictionsTable';
import PredictionSummary from '../components/dashboard/PredictionSummary';
import BackendStatusCard from '../components/ui/BackendStatusCard';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { predictionAPI } from '../utils/api';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  // Fetch predictions once at dashboard level
  useEffect(() => {
    const fetchPredictions = async () => {
      console.log('🔄 Dashboard: Starting prediction fetch...');
      console.log('🔄 Dashboard: Auth status:', { isAuthenticated });
      console.log('🔄 Dashboard: User data:', { user, userId: user?.id || user?._id });

      if (!isAuthenticated) {
        console.log('🚫 Dashboard: User not authenticated, skipping prediction fetch');
        setPredictions([]);
        setLoadingPredictions(false);
        return;
      }

      // if (!backendAvailable) {
      //   console.log('🚫 Dashboard: Backend not available, skipping prediction fetch');
      //   setPredictions([]);
      //   setLoadingPredictions(false);
      //   return;
      // }

      if (!(user?.id || user?._id)) {
        console.log('🚫 Dashboard: No user ID available, skipping prediction fetch');
        setPredictions([]);
        setLoadingPredictions(false);
        return;
      }

      console.log('✅ Dashboard: All conditions met, proceeding with fetch');
      setLoadingPredictions(true);
      
      try {
        const userId = user.id || user._id;
        console.log('📤 Dashboard: Calling getUserPredictions with userId:', userId);
        
        const result = await predictionAPI.getUserPredictions(userId);
        
        console.log('📥 Dashboard: API response received:', result);
        console.log('📥 Dashboard: Response success:', result.success);
        console.log('📥 Dashboard: Response data:', result.data);
        
        if (result.success) {
          const predictionsArray = Array.isArray(result.data) ? result.data : [];
          console.log('📊 Dashboard: Normalized predictions array:', predictionsArray);
          console.log('📊 Dashboard: Array length:', predictionsArray.length);
          setPredictions(predictionsArray);
          console.log('✅ Dashboard: Predictions set successfully:', predictionsArray.length, 'items');
        } else {
          console.log('❌ Dashboard: API call failed:', result.error);
          setPredictions([]);
        }
      } catch (error) {
        console.error('❌ Dashboard: Unexpected error fetching predictions:', error);
        console.error('❌ Dashboard: Error name:', error.name);
        console.error('❌ Dashboard: Error message:', error.message);
        console.error('❌ Dashboard: Error stack:', error.stack);
        setPredictions([]);
      } finally {
        setLoadingPredictions(false);
        console.log('🔄 Dashboard: Prediction fetch completed');
      }
    };

    fetchPredictions();
  }, [user, isAuthenticated]);
  
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
          <PredictionSummary predictions={predictions} loading={loadingPredictions} />
          <WeatherCard />
          <SoilCard />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PastPredictionsTable predictions={predictions} loading={loadingPredictions} />
          <FarmMap />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
