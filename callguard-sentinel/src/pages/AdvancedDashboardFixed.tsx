import React, { useState, useEffect } from 'react';
import { Phone, Shield, AlertTriangle, TrendingUp, Users, Globe, Activity, Zap, Eye, EyeOff, Bell, Settings, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { GlassCard, NeonButton, AnimatedNumber } from '../components/ui/NeonButton';
import { RiskIndicator, CallerRiskCard } from '../components/ui/RiskIndicator';
import { CallerDatabaseService } from '../data/callerDatabase';
import { formatPhoneNumber, getTimeAgo } from '../lib/utils';

interface ThreatData {
  totalCalls: number;
  scamsDetected: number;
  threatsBlocked: number;
  activeAlerts: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  topScamTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  regionalThreats: Array<{
    region: string;
    threatLevel: string;
    activeScams: number;
  }>;
  recentTrends: Array<{
    date: string;
    scamAttempts: number;
    blocked: number;
  }>;
}

const AdvancedDashboard: React.FC = () => {
  const [threatData, setThreatData] = useState<ThreatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [showSensitive, setShowSensitive] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [topThreats, setTopThreats] = useState<any[]>([]);

  const callerService = CallerDatabaseService.getInstance();

  useEffect(() => {
    loadDashboardData();
    if (realTimeMode) {
      const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [realTimeMode, selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load threat intelligence from backend
      const threatResponse = await fetch('http://localhost:8003/stats/threat-intelligence');
      const threatData = await threatResponse.json();
      
      // Load top spam numbers
      const topSpam = await callerService.getTopSpamNumbers(5);
      
      // Generate mock recent alerts
      const mockAlerts = [
        {
          id: '1',
          type: 'critical',
          message: 'IRS scam detected from +1-555-0123',
          timestamp: new Date().toISOString(),
          phoneNumber: '+1-555-0123',
          riskScore: 0.95
        },
        {
          id: '2',
          type: 'high',
          message: 'Tech support scam pattern identified',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          phoneNumber: '+1-555-0456',
          riskScore: 0.82
        },
        {
          id: '3',
          type: 'medium',
          message: 'Suspicious calling pattern detected',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          phoneNumber: '+1-555-0789',
          riskScore: 0.67
        }
      ];
      
      setThreatData(threatData.global_stats);
      setRecentAlerts(mockAlerts);
      setTopThreats(topSpam);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Use mock data as fallback
      setThreatData({
        totalCalls: 154789,
        scamsDetected: 12456,
        threatsBlocked: 8921,
        activeAlerts: 342,
        riskDistribution: { low: 45, medium: 30, high: 20, critical: 5 },
        topScamTypes: [],
        regionalThreats: [],
        recentTrends: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockNumber = async (phoneNumber: string) => {
    try {
      await callerService.reportCaller(phoneNumber, 'scam', 'Blocked from dashboard', 'admin');
      loadDashboardData();
    } catch (error) {
      console.error('Failed to block number:', error);
    }
  };

  if (loading && !threatData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-sm font-medium">+12.5%</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Calls Analyzed</h3>
          <p className="text-3xl font-bold text-white">
            <AnimatedNumber value={threatData?.totalCalls || 0} />
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-red-400 text-sm font-medium">+8.3%</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Scams Detected</h3>
          <p className="text-3xl font-bold text-white">
            <AnimatedNumber value={threatData?.scamsDetected || 0} />
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-sm font-medium">+15.7%</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Threats Blocked</h3>
          <p className="text-3xl font-bold text-white">
            <AnimatedNumber value={threatData?.threatsBlocked || 0} />
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <span className="text-yellow-400 text-sm font-medium">Active Now</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Active Alerts</h3>
          <p className="text-3xl font-bold text-white">
            <AnimatedNumber value={threatData?.activeAlerts || 0} />
          </p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Alerts */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Real-time Threat Alerts</h2>
              <NeonButton size="sm" variant="secondary">
                <Filter className="w-4 h-4" />
              </NeonButton>
            </div>
            
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'critical' 
                      ? 'bg-red-500/10 border-red-500'
                      : alert.type === 'high'
                      ? 'bg-orange-500/10 border-orange-500'
                      : 'bg-yellow-500/10 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <RiskIndicator
                          level={alert.type === 'critical' ? 'critical' : alert.type === 'high' ? 'high' : 'medium'}
                          score={alert.riskScore}
                        />
                        <span className="text-gray-400 text-sm">
                          {getTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-1">{alert.message}</p>
                      <p className="text-gray-400 text-sm">
                        Number: {showSensitive ? formatPhoneNumber(alert.phoneNumber) : '***-***-****'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <NeonButton
                        size="sm"
                        variant="danger"
                        onClick={() => handleBlockNumber(alert.phoneNumber)}
                      >
                        Block
                      </NeonButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Top Threats */}
        <div>
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Top Threat Numbers</h2>
            
            <div className="space-y-4">
              {topThreats.map((threat, index) => (
                <div key={threat.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {threat.name || 'Unknown Caller'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {showSensitive ? formatPhoneNumber(threat.phoneNumber) : '***-***-****'}
                    </p>
                  </div>
                  <RiskIndicator
                    level={threat.riskLevel}
                    score={threat.riskScore}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-3">
              <NeonButton className="w-full justify-start" variant="primary">
                <Zap className="w-4 h-4" />
                Run Full System Scan
              </NeonButton>
              <NeonButton className="w-full justify-start" variant="secondary">
                <Download className="w-4 h-4" />
                Export Threat Report
              </NeonButton>
              <NeonButton className="w-full justify-start" variant="secondary">
                <Settings className="w-4 h-4" />
                System Settings
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Global Threat Map */}
      <GlassCard className="p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Global Threat Intelligence</h2>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-sm">Live Global Data</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm mb-2">North America</h3>
            <p className="text-2xl font-bold text-red-400">HIGH</p>
            <p className="text-gray-500 text-sm">145 active threats</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm mb-2">Europe</h3>
            <p className="text-2xl font-bold text-yellow-400">MEDIUM</p>
            <p className="text-gray-500 text-sm">89 active threats</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm mb-2">Asia</h3>
            <p className="text-2xl font-bold text-red-400">HIGH</p>
            <p className="text-gray-500 text-sm">167 active threats</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm mb-2">Africa</h3>
            <p className="text-2xl font-bold text-yellow-400">MEDIUM</p>
            <p className="text-gray-500 text-sm">45 active threats</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdvancedDashboard;
