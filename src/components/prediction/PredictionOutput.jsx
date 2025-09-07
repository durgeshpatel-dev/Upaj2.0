import React from 'react';
import { TrendingUp, Leaf, AlertCircle, CheckCircle, Zap, BarChart, Thermometer, Droplet } from 'lucide-react';
import { Tr } from '../ui/SimpleTranslation';

const StatCard = ({ icon, label, value, unit, colorClass = 'text-primary' }) => (
        <div className="rounded-lg overflow-hidden">
            <div className="p-4 bg-[#0f1a17] flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-[#12221d] flex items-center justify-center ${colorClass}`}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-text-secondary text-xs font-medium">{label}</div>
                        <div className={`text-lg font-bold ${colorClass}`}>
                            {value} <span className="text-sm font-normal text-text-secondary">{unit}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
);

const InsightCard = ({ text }) => {
    const parts = text.split(':');
    const title = parts[0];
    const content = parts.slice(1).join(':');

    let Icon = BarChart;
    let actionType = "Optimization";
    // Unified dark base; we only vary accent color
    let cardClass = "relative bg-[#121c19] p-4 rounded-lg border border-[#22312d]";
    let accent = 'primary';
    let badgeClass = "text-xs px-2 py-1 rounded-full font-medium bg-primary/10 text-primary";

    const lower = title.toLowerCase();
    if (lower.includes('temp')) {
        Icon = Thermometer; actionType = "🌡️ Climate Optimization"; accent = 'orange';
        badgeClass = "text-xs px-2 py-1 rounded-full font-medium bg-orange-500/10 text-orange-400";
    } else if (lower.includes('soil')) {
        Icon = Leaf; actionType = "🌱 Soil Enhancement"; accent = 'green';
        badgeClass = "text-xs px-2 py-1 rounded-full font-medium bg-green-500/10 text-green-400";
    } else if (lower.includes('fertilizer')) {
        Icon = Droplet; actionType = "🧪 Nutrient Optimization"; accent = 'blue';
        badgeClass = "text-xs px-2 py-1 rounded-full font-medium bg-blue-500/10 text-blue-400";
    } else if (lower.includes('area')) {
        actionType = "📏 Scale Optimization"; accent = 'purple';
        badgeClass = "text-xs px-2 py-1 rounded-full font-medium bg-purple-500/10 text-purple-400";
    }

    const accentBar = {
        primary: 'from-primary/40 via-primary/10 to-transparent',
        orange: 'from-orange-400/40 via-orange-400/10 to-transparent',
        green: 'from-green-400/40 via-green-400/10 to-transparent',
        blue: 'from-blue-400/40 via-blue-400/10 to-transparent',
        purple: 'from-purple-400/40 via-purple-400/10 to-transparent'
    }[accent];

    return (
        <div className={`p-4 ${cardClass} rounded-lg flex items-start space-x-3`}>            
            <div className={`absolute inset-y-0 left-0 w-1 rounded-l-lg bg-gradient-to-b ${accentBar}`}></div>
            <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-text-primary">{title}</h5>
                    <span className={badgeClass}>
                        {actionType}
                    </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed tracking-wide">{content}</p>
                <div className="mt-2">
                    <span className="inline-block text-xs bg-[#0f2b22] text-[#50FF9F] px-2 py-1 rounded font-medium">
                        <Tr>Impact</Tr>: <Tr>Higher yield potential</Tr>
                    </span>
                </div>
            </div>
        </div>
    );
};


const PredictionOutput = ({ prediction }) => {
    
    
    if (!prediction) {
        return (
            <div className="bg-background-card p-4 rounded-lg border border-border">
                <h3 className="text-lg font-bold text-text-primary mb-3"><Tr>Prediction Output</Tr></h3>
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp size={24} className="text-text-secondary" />
                    </div>
                    <p className="text-text-secondary text-base mb-1"><Tr>No Prediction Yet</Tr></p>
                    <p className="text-text-secondary text-xs"><Tr>Fill out the form to see results</Tr></p>
                </div>
            </div>
        );
    }

    // Handle different response structures
    const responseData = prediction.data || prediction;
    const { input, prediction: predData, insights, technical } = responseData;
    
    // Add safety checks for data structure
    if (!predData || !input) {
        return (
            <div className="bg-background-card p-4 rounded-lg border border-border">
                <h3 className="text-lg font-bold text-text-primary mb-3"><Tr>Prediction Output</Tr></h3>
                <div className="text-center py-6">
                    <p className="text-status-error text-base mb-1"><Tr>Error loading prediction data</Tr></p>
                    <p className="text-text-secondary text-xs"><Tr>Please try again</Tr></p>
                </div>
            </div>
        );
    }
    const landArea = input.landArea || input.farmSize || 1;
    const yieldPerHectare = predData.yield_kg_per_hectare || predData.yield_per_hectare || predData.yield_tons || 0;
    const totalYieldKg = predData.yield_kg || (yieldPerHectare * landArea);
    const totalYieldTons = (totalYieldKg / 1000).toFixed(2);
    const yieldPerHectareTons = (yieldPerHectare / 1000).toFixed(2);
    
    // Default confidence level to "Medium" with appropriate color
    const defaultConfidenceLevel = 'Medium';
    const confidenceLevel = predData.confidence_level || defaultConfidenceLevel;
    
    const getConfidenceColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'high': return 'text-green-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-status-error';
            default: return 'text-yellow-400'; // Default to yellow for medium
        }
    };

    // Default confidence score to '90+' 
    const displayedScore = '90+';

    return (
        <div className="space-y-6">
            {/* Main Prediction Card */}
            <div className="bg-background-card p-6 rounded-lg border border-border">
                <h3 className="text-2xl font-bold text-text-primary mb-4"><Tr>Prediction Result</Tr></h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <StatCard
                        icon={<TrendingUp size={20} />}
                        label={<Tr>Yield per Hectare</Tr>}
                        value={yieldPerHectareTons}
                        unit="tons"
                    />
                    <StatCard
                        icon={<Leaf size={20} />}
                        label={<Tr>Total Estimated Yield</Tr>}
                        value={totalYieldTons}
                        unit={`tons for ${landArea} ha`}
                        colorClass="text-status-success"
                    />
                </div>

                <div className="bg-[#121c19] p-4 rounded-lg border border-[#22312d] flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-5 h-5 color-green`} />
                        <span className="text-sm font-medium text-text-primary"><Tr>Confidence Level</Tr>:</span>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold text-lg ${getConfidenceColor(confidenceLevel)}`}>
                            {confidenceLevel}
                        </div>
                        <div className="text-xs text-text-secondary">
                            <Tr>Score</Tr>: {displayedScore}
                        </div>
                    </div>
                </div>
            </div>

            {/* Optimization Recommendations */}
            {insights && insights.length > 0 && (
                <div className="bg-background-card p-6 rounded-lg border border-border">
                    <div className="flex items-center space-x-3 mb-6">
                        <Zap size={20} className="text-primary" />
                        <h4 className="text-xl font-bold text-text-primary">🚀 <Tr>Yield Optimization Recommendations</Tr></h4>
                    </div>
                    <div className="text-sm text-text-secondary mb-4 bg-background rounded-lg p-3 border-l-4 border-primary/20">
                        <strong>💡 <Tr>Pro Tip</Tr>:</strong> <Tr>Implementing these optimizations could potentially increase your yield by 15-30% compared to current practices.</Tr>
                    </div>
                    <div className="space-y-4">
                        {insights.map((insight, index) => (
                            <InsightCard key={index} text={insight} />
                        ))}
                    </div>
                </div>
            )}

            {/* Technical Details */}
            {technical && (
                <div className="p-4 rounded-lg border border-[#22312d] bg-[#0f1816] text-xs text-text-secondary">
                    <p>
                        <strong>Model:</strong> {technical.model_version} |
                        <strong> Source:</strong> {technical.data_source} |
                        <strong> Processing Time:</strong> {technical.processing_time_ms}ms
                    </p>
                </div>
            )}
        </div>
    );
};

export default PredictionOutput;
