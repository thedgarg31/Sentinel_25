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
  Zap
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
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Command Center',
    icon: Home,
    path: '/',
    description: 'Advanced threat intelligence dashboard',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'dialer',
    label: 'Phone Dialer',
    icon: Phone,
    path: '/dialer',
    description: 'Make calls with real-time protection',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'lookup',
    label: 'Reverse Lookup',
    icon: Search,
    path: '/lookup',
    description: 'Search caller information',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: Brain,
    path: '/ai-assistant',
    description: 'Real-time transcription and guidance',
    badge: 'NEW',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'emergency',
    label: 'Emergency System',
    icon: Shield,
    path: '/emergency',
    description: 'SOS alerts and OTP protection',
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: Users,
    path: '/contacts',
    description: 'Manage contact list with risk scores',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'history',
    label: 'Call History',
    icon: Clock,
    path: '/history',
    description: 'View call records and analysis',
    color: 'from-gray-500 to-gray-600'
  }
];

export const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cybercup25</h1>
                <p className="text-gray-400 text-sm">Advanced Caller Protection</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">System Active</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    group relative p-4 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-white/10 border border-white/20' 
                      : 'hover:bg-white/5 hover:scale-105'
                    }
                  `}
                >
                  {item.badge && (
                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full font-bold">
                      {item.badge}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center mb-3
                      bg-gradient-to-br ${item.color}
                      ${isActive ? 'ring-2 ring-white/50' : ''}
                    `}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {item.label}
                    </h3>
                    
                    <p className="text-gray-400 text-xs leading-tight">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </GlassCard>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        <GlassCard className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Cybercup25</h1>
                <p className="text-gray-400 text-xs">Advanced Protection</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </GlassCard>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden">
            <div className="fixed inset-x-4 top-4 bottom-4 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Navigation</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePath(item.path);
                    
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                          ${isActive 
                            ? 'bg-white/10 border border-white/20' 
                            : 'hover:bg-white/5'
                          }
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          bg-gradient-to-br ${item.color}
                        `}>
                          <Icon className="w-5 h-5 text-white" />
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

                {/* System Status */}
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-400 font-medium">System Active</p>
                      <p className="text-gray-400 text-sm">All protection systems online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
