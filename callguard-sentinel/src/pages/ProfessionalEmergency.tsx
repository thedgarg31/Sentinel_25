import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  MapPin, 
  Users, 
  Volume2,
  Bell,
  Lock,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';

const ProfessionalEmergency: React.FC = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: '1', name: 'John Doe', phone: '+1-555-0123', relation: 'Spouse' },
    { id: '2', name: 'Jane Smith', phone: '+1-555-0456', relation: 'Friend' },
    { id: '3', name: 'Emergency Services', phone: '911', relation: 'Emergency' }
  ]);

  const [recentAlerts] = useState([
    {
      id: '1',
      type: 'SOS Activated',
      time: '2 minutes ago',
      location: 'Home',
      contacts: ['John Doe', 'Jane Smith'],
      resolved: false
    },
    {
      id: '2',
      type: 'Suspicious Call Detected',
      time: '1 hour ago',
      location: 'Office',
      contacts: [],
      resolved: true
    }
  ]);

  const handleSOS = () => {
    setIsSOSActive(!isSOSActive);
    if (!isSOSActive) {
      // In a real app, this would trigger emergency protocols
      alert('SOS ACTIVATED! Emergency contacts have been notified.');
    }
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Emergency System</h1>
          <p className="text-gray-400">Advanced emergency protection and alert system</p>
        </div>

        <div className="professional-grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Controls */}
          <div className="space-y-6">
            {/* SOS Button */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Emergency SOS</h2>
              <div className="text-center">
                <button
                  onClick={handleSOS}
                  className={`w-32 h-32 rounded-full mx-auto mb-4 transition-all duration-300 ${
                    isSOSActive 
                      ? 'bg-red-600 animate-pulse' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  <AlertTriangle className="w-16 h-16 text-white mx-auto" />
                </button>
                <p className="text-white font-semibold mb-2">
                  {isSOSActive ? 'SOS ACTIVE' : 'Press for Emergency'}
                </p>
                <p className="text-gray-400 text-sm">
                  {isSOSActive 
                    ? 'Emergency contacts have been notified' 
                    : 'Hold for 3 seconds to activate emergency services'
                  }
                </p>
              </div>
            </div>

            {/* Emergency Features */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Emergency Features</h2>
              <div className="space-y-3">
                <button
                  onClick={handleRecording}
                  className={`professional-btn w-full justify-start ${
                    isRecording ? 'danger' : 'secondary'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  {isRecording ? 'Stop Emergency Recording' : 'Start Emergency Recording'}
                </button>
                <button className="professional-btn secondary w-full justify-start">
                  <MapPin className="w-4 h-4" />
                  Share Location
                </button>
                <button className="professional-btn secondary w-full justify-start">
                  <Bell className="w-4 h-4" />
                  Sound Emergency Alarm
                </button>
                <button className="professional-btn secondary w-full justify-start">
                  <Lock className="w-4 h-4" />
                  Lock Device
                </button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Emergency Contacts</h2>
              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">{contact.relation} • {contact.phone}</p>
                      </div>
                    </div>
                    <button className="professional-btn success py-1 px-3">
                      <Phone className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button className="professional-btn w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Add Emergency Contact
                </button>
              </div>
            </div>
          </div>

          {/* Status and Alerts */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Location Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 text-sm">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Emergency Recording</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${isRecording ? 'bg-red-500' : 'bg-gray-500'} rounded-full`}></div>
                    <span className={`${isRecording ? 'text-red-500' : 'text-gray-500'} text-sm`}>
                      {isRecording ? 'Recording' : 'Standby'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Network Connection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 text-sm">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Battery Level</span>
                  <span className="text-gray-300 text-sm">87%</span>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Emergency Alerts</h2>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${alert.resolved ? 'text-gray-500' : 'text-red-500'}`} />
                        <span className="text-white font-medium">{alert.type}</span>
                      </div>
                      {alert.resolved && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{alert.time}</p>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.location}</span>
                    </div>
                    {alert.contacts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-400 text-xs mb-1">Notified:</p>
                        <div className="flex flex-wrap gap-1">
                          {alert.contacts.map((contact, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                              {contact}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Emergency Tips</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Keep Emergency Contacts Updated</p>
                    <p className="text-gray-400 text-xs">Regularly verify contact information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Test Emergency Features</p>
                    <p className="text-gray-400 text-xs">Practice using SOS features regularly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Share Your Location</p>
                    <p className="text-gray-400 text-xs">Enable location sharing for emergencies</p>
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

export default ProfessionalEmergency;
