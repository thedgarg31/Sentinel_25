import React, { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Phone, 
  Users, 
  Lock, 
  Eye, 
  Volume2,
  Globe,
  Smartphone,
  Database,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface SettingSection {
  title: string;
  icon: React.ElementType;
  items: SettingItem[];
}

interface SettingItem {
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input';
  value?: any;
  options?: string[];
}

const ProfessionalSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Call Protection
    autoBlockScamCalls: true,
    showRiskIndicators: true,
    recordAllCalls: false,
    transcribeCalls: true,
    
    // Notifications
    callAlerts: true,
    scamWarnings: true,
    emergencyAlerts: true,
    weeklyReports: false,
    
    // Privacy
    shareAnonymousData: false,
    locationTracking: true,
    contactSync: true,
    
    // Audio
    callVolume: 80,
    notificationVolume: 70,
    vibrate: true,
    
    // Appearance
    darkMode: false,
    compactView: false,
    showAvatars: true,
    
    // Advanced
    developerMode: false,
    betaFeatures: true,
    debugLogging: false
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelect = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Call Protection',
      icon: Shield,
      items: [
        {
          label: 'Auto-Block Scam Calls',
          description: 'Automatically block calls identified as scams',
          type: 'toggle',
          value: settings.autoBlockScamCalls
        },
        {
          label: 'Show Risk Indicators',
          description: 'Display risk level for incoming calls',
          type: 'toggle',
          value: settings.showRiskIndicators
        },
        {
          label: 'Record All Calls',
          description: 'Automatically record all incoming and outgoing calls',
          type: 'toggle',
          value: settings.recordAllCalls
        },
        {
          label: 'Transcribe Calls',
          description: 'Convert speech to text for call analysis',
          type: 'toggle',
          value: settings.transcribeCalls
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Call Alerts',
          description: 'Get notified about incoming calls',
          type: 'toggle',
          value: settings.callAlerts
        },
        {
          label: 'Scam Warnings',
          description: 'Receive alerts for potential scam calls',
          type: 'toggle',
          value: settings.scamWarnings
        },
        {
          label: 'Emergency Alerts',
          description: 'Critical emergency notifications',
          type: 'toggle',
          value: settings.emergencyAlerts
        },
        {
          label: 'Weekly Reports',
          description: 'Receive weekly protection summary',
          type: 'toggle',
          value: settings.weeklyReports
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      items: [
        {
          label: 'Share Anonymous Data',
          description: 'Help improve scam detection by sharing anonymous data',
          type: 'toggle',
          value: settings.shareAnonymousData
        },
        {
          label: 'Location Tracking',
          description: 'Use location for emergency services',
          type: 'toggle',
          value: settings.locationTracking
        },
        {
          label: 'Contact Sync',
          description: 'Sync contacts for better caller identification',
          type: 'toggle',
          value: settings.contactSync
        }
      ]
    },
    {
      title: 'Audio Settings',
      icon: Volume2,
      items: [
        {
          label: 'Call Volume',
          description: 'Adjust call volume level',
          type: 'select',
          value: settings.callVolume,
          options: ['0', '25', '50', '75', '100']
        },
        {
          label: 'Notification Volume',
          description: 'Adjust notification volume',
          type: 'select',
          value: settings.notificationVolume,
          options: ['0', '25', '50', '75', '100']
        },
        {
          label: 'Vibrate',
          description: 'Vibrate on incoming calls',
          type: 'toggle',
          value: settings.vibrate
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Eye,
      items: [
        {
          label: 'Dark Mode',
          description: 'Use dark theme for the interface',
          type: 'toggle',
          value: settings.darkMode
        },
        {
          label: 'Compact View',
          description: 'Show more content in less space',
          type: 'toggle',
          value: settings.compactView
        },
        {
          label: 'Show Avatars',
          description: 'Display contact avatars in lists',
          type: 'toggle',
          value: settings.showAvatars
        }
      ]
    },
    {
      title: 'Advanced',
      icon: Database,
      items: [
        {
          label: 'Developer Mode',
          description: 'Enable advanced debugging features',
          type: 'toggle',
          value: settings.developerMode
        },
        {
          label: 'Beta Features',
          description: 'Try new features before they\'re released',
          type: 'toggle',
          value: settings.betaFeatures
        },
        {
          label: 'Debug Logging',
          description: 'Enable detailed logging for troubleshooting',
          type: 'toggle',
          value: settings.debugLogging
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    const settingKey = item.label.toLowerCase().replace(/\s+/g, '_');
    
    switch (item.type) {
      case 'toggle':
        return (
          <button
            onClick={() => handleToggle(settingKey)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              item.value ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                item.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        );
      
      case 'select':
        return (
          <select
            value={item.value}
            onChange={(e) => handleSelect(settingKey, e.target.value)}
            className="professional-input w-32"
          >
            {item.options?.map(option => (
              <option key={option} value={option}>{option}%</option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your CallGuard Sentinel preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="professional-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-medium">{item.label}</h3>
                        <p className="text-gray-500 text-sm">{item.description}</p>
                      </div>
                      <div className="ml-4">
                        {renderSettingItem(item)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Options */}
        <div className="professional-card mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">More Options</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">Help & Support</p>
                  <p className="text-gray-500 text-sm">Get help with CallGuard Sentinel</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">Export Data</p>
                  <p className="text-gray-500 text-sm">Download your call history and settings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">Privacy Policy</p>
                  <p className="text-gray-500 text-sm">Learn how we protect your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button className="professional-btn py-3 px-8">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSettings;
