import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Phone, 
  Search, 
  Users, 
  Clock, 
  AlertTriangle, 
  Brain, 
  Menu, 
  X, 
  Activity,
  Settings,
  LogOut
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  description: string;
}

const ProfessionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavItem[] = [
    {
      name: 'Command Center',
      path: '/dashboard',
      icon: Shield,
      description: 'Threat intelligence overview'
    },
    {
      name: 'Phone Dialer',
      path: '/dialer',
      icon: Phone,
      description: 'Make calls with risk assessment'
    },
    {
      name: 'Call Screen',
      path: '/call',
      icon: Activity,
      description: 'Active call management'
    },
    {
      name: 'Contacts',
      path: '/contacts',
      icon: Users,
      description: 'Manage contact list'
    },
    {
      name: 'Call History',
      path: '/history',
      icon: Clock,
      description: 'View call records'
    },
    {
      name: 'Reverse Lookup',
      path: '/lookup',
      icon: Search,
      description: 'Number lookup service'
    },
    {
      name: 'Emergency System',
      path: '/emergency',
      icon: AlertTriangle,
      description: 'Emergency protection'
    },
    {
      name: 'AI Assistant',
      path: '/ai-assistant',
      icon: Brain,
      description: 'AI-powered guidance'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'App preferences'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className="professional-bg">
      {/* Desktop Navigation */}
      <nav className="professional-nav hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CallGuard Sentinel</h1>
                  <p className="text-gray-400 text-xs">Advanced Protection</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`professional-nav-item ${isActive(item.path) ? 'active' : ''}`}
                      title={item.description}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button className="professional-nav-item">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        <div className="professional-nav">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CallGuard Sentinel</h1>
                <p className="text-gray-400 text-xs">Protection</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full text-left professional-nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default ProfessionalLayout;
