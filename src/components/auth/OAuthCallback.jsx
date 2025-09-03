import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const OAuthCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                const user = urlParams.get('user');
                const errorParam = urlParams.get('error');

                console.log('🔍 OAuth callback - Token:', token ? 'Present' : 'Missing');
                console.log('🔍 OAuth callback - User param:', user ? 'Present' : 'Missing');
                console.log('🔍 OAuth callback - Error param:', errorParam);

                // Check for error parameter first
                if (errorParam) {
                    throw new Error(`OAuth error: ${errorParam}`);
                }

                // Validate required parameters
                if (!token) {
                    throw new Error('No authentication token received');
                }

                if (!user) {
                    throw new Error('No user data received');
                }

                // Parse and validate user data
                let parsedUser;
                try {
                    parsedUser = JSON.parse(decodeURIComponent(user));
                    console.log('👤 Parsed user data:', parsedUser);
                } catch (parseError) {
                    console.error('❌ Failed to parse user data:', parseError);
                    throw new Error('Invalid user data format');
                }

                // Validate user data structure
                if (!parsedUser.id && !parsedUser._id) {
                    throw new Error('User data missing required ID');
                }

                if (!parsedUser.email) {
                    throw new Error('User data missing required email');
                }

                // Store authentication data
                console.log('💾 Storing authentication data...');
                const loginSuccess = login(token, parsedUser);
                
                if (!loginSuccess) {
                    throw new Error('Failed to store authentication data');
                }
                
                console.log('✅ OAuth authentication successful');
                
                // Redirect to dashboard after successful authentication
                navigate('/dashboard', { replace: true });
                
            } catch (error) {
                console.error('❌ OAuth callback error:', error);
                setError(error.message);
                
                // Redirect to login page with error after delay
                setTimeout(() => {
                    navigate('/login?error=oauth_failed', { replace: true });
                }, 3000);
            } finally {
                setIsProcessing(false);
            }
        };

        handleOAuthCallback();
    }, [navigate, login]);

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-2xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {isProcessing ? 'Completing Sign In...' : 'Success!'}
                </h1>
                <p className="text-gray-600">
                    {isProcessing 
                        ? 'Please wait while we set up your account...' 
                        : 'Redirecting to dashboard...'
                    }
                </p>
            </div>
        </div>
    );
};

export default OAuthCallback
