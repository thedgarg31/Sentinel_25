import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Phone, 
  AlertTriangle, 
  Activity, 
  Users, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Eye,
  Target
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface ThreatAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  time: string;
  phone: string;
}

const ProfessionalDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = () => {
      const mockStats: StatCard[] = [
        {
          title: 'Total Calls Protected',
          value: '12,543',
          change: 12.5,
          icon: Shield,
          color: 'text-blue-500'
        },
        {
          title: 'Threats Blocked',
          value: '1,234',
          change: 8.2,
          icon: AlertTriangle,
          color: 'text-red-500'
        },
        {
          title: 'Active Users',
          value: '8,901',
          change: 15.3,
          icon: Users,
          color: 'text-green-500'
        },
        {
          title: 'Success Rate',
          value: '98.7%',
          change: 2.1,
          icon: Target,
          color: 'text-purple-500'
        }
      ];

      const mockAlerts: ThreatAlert[] = [
        {
          id: '1',
          type: 'IRS Impersonation',
          severity: 'critical',
          description: 'High-volume IRS scam detected in Northeast region',
          time: '2 minutes ago',
          phone: '+1-800-429-XXXX'
        },
        {
          id: '2',
          type: 'Tech Support Fraud',
          severity: 'high',
          description: 'Microsoft tech support scam targeting elderly users',
          time: '15 minutes ago',
          phone: '+1-888-XXX-XXXX'
        },
        {
          id: '3',
          type: 'Bank Phishing',
          severity: 'medium',
          description: 'Bank verification requests from unknown numbers',
          time: '1 hour ago',
          phone: '+1-555-XXX-XXXX'
        },
        {
          id: '4',
          type: 'Insurance Scam',
          severity: 'low',
          description: 'Suspicious insurance sales calls reported',
          time: '3 hours ago',
          phone: '+1-777-XXX-XXXX'
        }
      ];

      setStats(mockStats);
      setAlerts(mockAlerts);
      setIsLoading(false);
    };

    setTimeout(loadData, 1000);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'risk-critical';
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-low';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen professional-bg flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
          <p className="text-gray-400">Real-time threat intelligence and protection overview</p>
        </div>

        {/* Stats Grid */}
        <div className="professional-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="professional-card fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="professional-grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <div className="professional-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Threat Alerts</h2>
                <button className="professional-btn secondary">
                  <Eye className="w-4 h-4" />
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <h3 className="text-white font-medium">{alert.type}</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{alert.time}</span>
                          <span>{alert.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="professional-btn w-full justify-start">
                  <Shield className="w-4 h-4" />
                  Run System Scan
                </button>
                <button className="professional-btn secondary w-full justify-start">
                  <AlertTriangle className="w-4 h-4" />
                  Update Threat Database
                </button>
                <button className="professional-btn success w-full justify-start">
                  <Users className="w-4 h-4" />
                  Manage Users
                </button>
              </div>
            </div>

            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Protection Service</span>
                  <div className="flex items-center gap-2">
                    <div className="status-indicator status-online"></div>
                    <span className="text-green-500 text-sm">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">AI Analysis</span>
                  <div className="flex items-center gap-2">
                    <div className="status-indicator status-online"></div>
                    <span className="text-green-500 text-sm">Running</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Database Sync</span>
                  <div className="flex items-center gap-2">
                    <div className="status-indicator status-warning"></div>
                    <span className="text-yellow-500 text-sm">Syncing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
