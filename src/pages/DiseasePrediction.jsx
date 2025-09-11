import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X, AlertCircle, CheckCircle, Loader, Leaf, Trash2, Activity } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Tr } from '../components/ui/SimpleTranslation';
import { useUnifiedTranslation } from '../hooks/useUnifiedTranslation';
import { predictionAPI } from '../utils/api';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
    }`}
  >
    {children}
  </button>
);

const DiseasePrediction = () => {
  const { user } = useAuth();
  const { t } = useUnifiedTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [serviceHealth, setServiceHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError(t('Please select a valid image file (JPG, PNG, WebP).'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('Image size should be less than 5MB.'));
      return;
    }
    setSelectedImage(file);
    setError(null);
    setPrediction(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleDragEvent = (e, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const checkServiceHealth = async () => {
    setCheckingHealth(true);
    try {
      const result = await predictionAPI.checkDiseaseServiceHealth();
      setServiceHealth(result.success ? result.data : { status: 'unhealthy', error: result.error });
    } catch (err) {
      setServiceHealth({ status: 'unhealthy', error: t('Failed to check service health') });
    } finally {
      setCheckingHealth(false);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await predictionAPI.predictDisease(selectedImage);
      if (result.success) {
        const apiData = result.data.data || result.data;
        setPrediction({
          crop: apiData.crop || t('Unknown'),
          disease: apiData.diseaseName || apiData.status || t('No disease detected'),
          status: apiData.status || t('unknown'),
          confidence: (apiData.confidence * 100) || 0,
          severity: apiData.severity || t('Unknown'),
          description: getDescriptionForDisease(apiData.diseaseName || apiData.status, apiData.status),
          treatment: getTreatmentForDisease(apiData.diseaseName || apiData.status, apiData.status),
          prevention: getPreventionForDisease(apiData.diseaseName || apiData.status, apiData.status),
          uploadedImageUrl: apiData.uploadedImageUrl,
          annotatedImageUrl: apiData.annotatedImageUrl
        });
        setActiveTab('description');
      } else {
        setError(result.error || t('Failed to analyze image. Please try again.'));
      }
    } catch (err) {
      console.error('Disease prediction error:', err);
      setError(t('An unexpected error occurred. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const getDescriptionForDisease = (disease, status) => {
    if (status === 'healthy') return t('The plant appears to be healthy. Continue with regular care.');
    if (!disease || disease === 'No disease detected') return t('No specific disease could be identified. Monitor the plant for any changes.');
    return t(`${disease} has been detected. This condition may affect plant health and productivity.`);
  };

  const getTreatmentForDisease = (disease, status) => {
    if (status === 'healthy') return [
      t('Continue regular watering and fertilization.'),
      t('Monitor for any changes.'),
      t('Ensure adequate sunlight.')
    ];
    return [
      t('Remove affected leaves immediately.'),
      t('Apply appropriate fungicide or pesticide.'),
      t('Improve air circulation.'),
      t('Adjust watering practices.')
    ];
  };

  const getPreventionForDisease = (disease, status) => {
    return [
      t('Plant disease-resistant varieties.'),
      t('Maintain proper spacing.'),
      t('Regular monitoring.'),
      t('Practice crop rotation.'),
      t('Maintain optimal soil health.')
    ];
  };

  const renderContent = () => {
    if (!prediction) {
      return (
        <div className="text-center py-16">
          <Leaf className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2"><Tr>Analysis Results Appear Here</Tr></h3>
          <p className="text-text-secondary max-w-xs mx-auto"><Tr>Upload an image to get AI-powered disease detection and treatment recommendations.</Tr></p>
        </div>
      );
    }

    const TABS = {
      description: (
        <div className="space-y-4">
          <p className="text-text-secondary"><Tr>{prediction.description}</Tr></p>
          {prediction.annotatedImageUrl && (
            <div>
              <h4 className="font-medium text-text-primary mb-2"><Tr>Analysis Visualization</Tr></h4>
              <img src={prediction.annotatedImageUrl} alt={t('Analysis visualization')} className="w-full h-auto rounded-lg border border-border" onError={(e) => e.target.style.display = 'none'} />
              <p className="text-xs text-text-secondary mt-2"><Tr>Highlighted areas show detected symptoms.</Tr></p>
            </div>
          )}
        </div>
      ),
      treatment: (
        <ul className="space-y-3">
      {prediction.treatment.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-px">{index + 1}</span>
        <span className="text-text-secondary"><Tr>{step}</Tr></span>
            </li>
          ))}
        </ul>
      ),
      prevention: (
        <ul className="space-y-3">
      {prediction.prevention.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-px" />
        <span className="text-text-secondary"><Tr>{tip}</Tr></span>
            </li>
          ))}
        </ul>
      )
    };

    return (
      <div className="bg-background-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${prediction.status === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {prediction.status === 'healthy' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">{prediction.status === 'healthy' ? <Tr>Plant is Healthy</Tr> : <Tr>Disease Detected</Tr>}</h3>
            <p className="text-text-secondary text-sm"><Tr>AI Analysis Results</Tr></p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-baseline">
            <h4 className="font-medium text-text-primary">{prediction.status === 'healthy' ? <Tr>Status</Tr> : <Tr>Disease Name</Tr>}</h4>
            <p className={`text-xl font-semibold ${prediction.status === 'healthy' ? 'text-status-success' : 'text-primary'}`}>{prediction.disease}</p>
          </div>
          <div className="flex justify-between items-baseline">
            <h4 className="font-medium text-text-primary"><Tr>Confidence</Tr></h4>
            <p className="text-lg font-semibold text-status-success">{prediction.confidence.toFixed(1)}%</p>
          </div>
          {prediction.severity && prediction.status !== 'healthy' && (
            <div className="flex justify-between items-baseline">
              <h4 className="font-medium text-text-primary"><Tr>Severity</Tr></h4>
              <p className={`text-lg font-semibold ${prediction.severity === 'Severe' ? 'text-status-error' : prediction.severity === 'Moderate' ? 'text-status-warning' : 'text-status-success'}`}>{t(prediction.severity)}</p>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 mb-4">
            <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}><Tr>Description</Tr></TabButton>
            <TabButton active={activeTab === 'treatment'} onClick={() => setActiveTab('treatment')}><Tr>Treatment</Tr></TabButton>
            <TabButton active={activeTab === 'prevention'} onClick={() => setActiveTab('prevention')}><Tr>Prevention</Tr></TabButton>
          </div>
          <div>{TABS[activeTab]}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary"><Tr>AI Disease Prediction</Tr></h1>
          </div>
          <p className="text-text-secondary max-w-2xl mx-auto"><Tr>Upload a plant image for instant disease detection and care recommendations.</Tr></p>
        </header>

        <div className="space-y-8">
          <div className="bg-background-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-1"><Tr>Upload Plant Image</Tr></h2>
              <p className="text-text-secondary text-sm"><Tr>For the best results, use a clear, well-lit photo of the affected plant area.</Tr></p>
            </div>

            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt={t('Plant preview')} className="w-full h-auto max-h-80 object-contain rounded-lg border border-border" />
                <button onClick={clearImage} className="absolute top-2 right-2 p-1.5 bg-background/70 backdrop-blur-sm hover:bg-background rounded-full transition-colors">
                  <X className="w-4 h-4 text-text-primary" />
                </button>
              </div>
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                onDrop={handleDrop}
                onDragOver={(e) => handleDragEvent(e, true)}
                onDragLeave={(e) => handleDragEvent(e, false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-10 h-10 text-text-secondary mb-3" />
                  <p className="text-text-primary font-medium"><Tr>Drag & drop or click to upload</Tr></p>
                  <p className="text-text-secondary text-sm mt-1"><Tr>Supports JPG, PNG, WebP (max 5MB)</Tr></p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 mr-2" /><Tr>Browse Files</Tr></Button>
              <Button variant="outline" className="flex-1" onClick={() => cameraInputRef.current?.click()}><Camera className="w-4 h-4 mr-2" /><Tr>Use Camera</Tr></Button>
            </div>

            {selectedImage && !prediction && (
              <Button size="lg" className="w-full" onClick={analyzeImage} disabled={isLoading}>
                {isLoading ? <><Loader className="w-5 h-5 mr-2 animate-spin" /> <Tr>Analyzing...</Tr></> : <><Leaf className="w-5 h-5 mr-2" /> <Tr>Analyze Plant</Tr></>}
              </Button>
            )}

            {error && (
              <div className="p-3 bg-status-error/10 border border-status-error/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0" />
                <p className="text-status-error text-sm">{error}</p>
              </div>
            )}
          </div>

          {renderContent()}
        </div>

        <footer className="text-center mt-8">
          <button onClick={checkServiceHealth} disabled={checkingHealth} className="flex items-center gap-2 mx-auto px-3 py-1.5 rounded-full bg-background-card border border-border hover:bg-surface-hover transition-colors text-xs text-text-secondary">
            <Activity className={`w-3 h-3 ${checkingHealth ? 'animate-spin' : ''}`} />
            {checkingHealth ? <Tr>Checking...</Tr> : <Tr>Check Service Health</Tr>}
            {serviceHealth && <div className={`w-2 h-2 rounded-full ${serviceHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />}
          </button>
        </footer>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInputChange} className="hidden" />
      </div>
    </div>
  );
};

export default DiseasePrediction;
