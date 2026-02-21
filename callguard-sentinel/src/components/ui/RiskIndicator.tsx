import React from 'react';
import { Shield, AlertTriangle, X, CheckCircle } from 'lucide-react';

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  showDetails?: boolean;
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  score,
  showDetails = false,
  className = ''
}) => {
  const getRiskConfig = () => {
    switch (level) {
      case 'low':
        return {
          color: 'from-green-500 to-emerald-600',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/50',
          icon: CheckCircle,
          label: 'LOW RISK',
          description: 'Caller appears legitimate'
        };
      case 'medium':
        return {
          color: 'from-yellow-500 to-orange-600',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
          icon: AlertTriangle,
          label: 'MEDIUM RISK',
          description: 'Exercise caution'
        };
      case 'high':
        return {
          color: 'from-red-500 to-pink-600',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
          icon: Shield,
          label: 'HIGH RISK',
          description: 'Likely scam or fraud'
        };
      case 'critical':
        return {
          color: 'from-red-600 to-red-800',
          bgColor: 'bg-red-600/20',
          borderColor: 'border-red-600/50',
          icon: X,
          label: 'CRITICAL THREAT',
          description: 'Dangerous scam detected'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/50',
          icon: Shield,
          label: 'UNKNOWN',
          description: 'Risk assessment unavailable'
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className={`relative ${className}`}>
      {/* Main Risk Badge */}
      <div className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full
        bg-gradient-to-r ${config.color}
        text-white text-sm font-bold
        shadow-lg ${level === 'high' || level === 'critical' ? 'animate-pulse' : ''}
        transition-all duration-300 hover:scale-105
      `}>
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
        <span className="text-xs opacity-90">({Math.round(score * 100)}%)</span>
      </div>

      {/* Risk Score Bar */}
      <div className="mt-2 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`
            h-full bg-gradient-to-r ${config.color}
            transition-all duration-1000 ease-out
          `}
          style={{ width: `${score * 100}%` }}
        />
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className={`
          absolute top-full left-0 mt-2 p-3 rounded-lg
          ${config.bgColor} ${config.borderColor} border
          backdrop-blur-sm shadow-xl z-50
          min-w-64 animate-fadeIn
        `}>
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-white mt-0.5" />
            <div className="text-white">
              <p className="font-semibold text-sm">{config.label}</p>
              <p className="text-xs opacity-90 mt-1">{config.description}</p>
              <div className="mt-2 text-xs">
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span>{Math.round(score * 100)}%</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Threat Level:</span>
                  <span className="capitalize">{level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface CallerRiskCardProps {
  phoneNumber: string;
  callerName?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  reportCount: number;
  scamType?: string;
  lastReported?: string;
  verified?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CallerRiskCard: React.FC<CallerRiskCardProps> = ({
  phoneNumber,
  callerName,
  riskLevel,
  riskScore,
  reportCount,
  scamType,
  lastReported,
  verified = false,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`glass-card p-4 hover:scale-102 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {callerName ? callerName.charAt(0).toUpperCase() : phoneNumber.slice(-2)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">
                {callerName || 'Unknown Caller'}
              </h3>
              {verified && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm">{phoneNumber}</p>
          </div>
        </div>
        <RiskIndicator level={riskLevel} score={riskScore} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Reports</p>
          <p className="text-white font-bold">{reportCount}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Risk Score</p>
          <p className="text-white font-bold">{Math.round(riskScore * 100)}%</p>
        </div>
      </div>

      {/* Additional Info */}
      {scamType && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 mb-2">
          <p className="text-red-400 text-xs font-semibold">Likely Scam Type:</p>
          <p className="text-red-300 text-sm">{scamType}</p>
        </div>
      )}

      {lastReported && (
        <p className="text-gray-500 text-xs">
          Last reported: {new Date(lastReported).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
