import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Phone, 
  Search, 
  Shield, 
  Brain, 
  AlertTriangle, 
  Users, 
  Clock, 
  Mic, 
  Activity,
  Menu,
  X,
  Zap,
  Settings,
  BarChart3,
  Eye,
  EyeOff,
  Bell,
  LogOut
} from 'lucide-react';
import { GlassCard, NeonButton } from './ui/NeonButton';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  description: string;
  badge?: string;
  color: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Command Center',
    icon: BarChart3,
    path: '/',
    description: 'Advanced threat intelligence dashboard',
    color: 'from-blue-500 to-purple-600',
    riskLevel: 'low'
  },
  {
    id: 'dialer',
    label: 'Phone Dialer',
    icon: Phone,
    path: '/dialer',
    description: 'Make calls with real-time protection',
    color: 'from-green-500 to-emerald-600',
    riskLevel: 'low'
  },
  {
    id: 'lookup',
    label: 'Reverse Lookup',
    icon: Search,
    path: '/lookup',
    description: 'Search caller information',
    color: 'from-purple-500 to-pink-600',
    riskLevel: 'medium'
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: Brain,
    path: '/ai-assistant',
    description: 'Real-time transcription and guidance',
    badge: 'NEW',
    color: 'from-cyan-500 to-blue-600',
    riskLevel: 'medium'
  },
  {
    id: 'emergency',
    label: 'Emergency System',
    icon: Shield,
    path: '/emergency',
    description: 'SOS alerts and OTP protection',
    color: 'from-red-500 to-orange-600',
    riskLevel: 'high'
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: Users,
    path: '/contacts',
    description: 'Manage contact list with risk scores',
    color: 'from-indigo-500 to-purple-600',
    riskLevel: 'low'
  },
  {
    id: 'history',
    label: 'Call History',
    icon: Clock,
    path: '/history',
    description: 'View call records and analysis',
    color: 'from-gray-500 to-gray-600',
    riskLevel: 'low'
  }
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    isOnline: true,
    threatsBlocked: 1247,
    activeAlerts: 23,
    lastScan: '2 minutes ago'
  });
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'from-red-500 to-red-700';
      case 'high': return 'from-orange-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      default: return 'from-green-500 to-emerald-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 20}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <GlassCard className="m-4 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Zap className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg">
                  Cybercup25
                </h1>
                <p className="text-gray-300 text-sm font-medium">Advanced Caller Protection</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* System Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">System Active</span>
              </div>
              
              {/* Threat Counter */}
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm font-medium">{systemStatus.threatsBlocked} Blocked</span>
              </div>
              
              {/* Alert Counter */}
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">{systemStatus.activeAlerts} Alerts</span>
              </div>
              
              {/* Settings */}
              <button
                onClick={() => setShowSensitive(!showSensitive)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  showSensitive 
                    ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' 
                    : 'bg-gray-500/20 border border-gray-500/50 text-gray-400 hover:bg-gray-500/30'
                }`}
              >
                {showSensitive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              const riskColor = getRiskColor(item.riskLevel);
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105
                    ${isActive 
                      ? 'ring-2 ring-white/20 shadow-2xl shadow-white/10' 
                      : 'hover:ring-1 hover:ring-white/10'
                    }
                  `}
                >
                  {/* Background Gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${item.color} opacity-90
                    transition-opacity duration-500
                    ${isActive ? 'opacity-100' : 'group-hover:opacity-100 opacity-70'}
                  `} />
                  
                  {/* Content */}
                  <div className="relative p-6 z-10">
                    {/* Badge */}
                    {item.badge && (
                      <div className="absolute -top-2 -right-2 z-20">
                        <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full font-bold shadow-lg animate-pulse">
                          {item.badge}
                        </div>
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg
                      bg-gradient-to-br ${riskColor}
                      transition-transform duration-300
                      ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                    `}>
                      <Icon className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                    
                    {/* Text */}
                    <div className="text-center">
                      <h3 className="text-white font-bold text-lg mb-2 drop-shadow">
                        {item.label}
                      </h3>
                      <p className="text-gray-200 text-sm leading-relaxed opacity-90">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Risk Indicator for high-risk items */}
                    {item.riskLevel && item.riskLevel !== 'low' && (
                      <div className="mt-3 flex justify-center">
                        <div className={`
                          px-3 py-1 rounded-full text-xs font-bold
                          ${item.riskLevel === 'critical' ? 'bg-red-500 text-white' : 
                            item.riskLevel === 'high' ? 'bg-orange-500 text-white' : 
                            'bg-yellow-500 text-black'}
                        `}>
                          {item.riskLevel.toUpperCase()} RISK
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-4 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Live Status</span>
              </div>
              <p className="text-2xl font-bold text-white">{systemStatus.isOnline ? 'Online' : 'Offline'}</p>
              <p className="text-gray-400 text-xs">Last scan: {systemStatus.lastScan}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Protection</span>
              </div>
              <p className="text-2xl font-bold text-white">{systemStatus.threatsBlocked}</p>
              <p className="text-gray-400 text-xs">Threats Blocked</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 p-4 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Alerts</span>
              </div>
              <p className="text-2xl font-bold text-white">{systemStatus.activeAlerts}</p>
              <p className="text-gray-400 text-xs">Active Alerts</p>
            </div>
          </div>
        </GlassCard>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        <GlassCard className="m-4 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CallGuard Sentinel</h1>
                <p className="text-gray-400 text-xs">Protection</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden">
              <div className="fixed inset-x-4 top-20 bottom-4 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Navigation</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.path);
                      const riskColor = getRiskColor(item.riskLevel);
                      
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                            ${isActive 
                              ? 'bg-white/20 border border-white/30' 
                              : 'hover:bg-white/10'
                            }
                          `}
                        >
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center
                            bg-gradient-to-br ${riskColor}
                          `}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-semibold">
                                {item.label}
                              </h3>
                              {item.badge && (
                                <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile Status */}
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">System Active</span>
                    </div>
                    <p className="text-white text-lg font-bold">{systemStatus.isOnline ? 'Online' : 'Offline'}</p>
                    <p className="text-gray-400 text-sm">Last scan: {systemStatus.lastScan}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-4">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
