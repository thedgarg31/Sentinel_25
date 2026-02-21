import React, { useState } from 'react';
import { 
  Phone, 
  Delete, 
  Search, 
  User, 
  AlertTriangle, 
  Shield,
  Mic,
  MicOff,
  Volume2,
  Settings
} from 'lucide-react';

const ProfessionalDialer: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const handleDigitClick = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  const handleCall = () => {
    if (phoneNumber) {
      alert(`Calling ${phoneNumber}...`);
      // In a real app, this would initiate a call
    }
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const getRiskLevel = (number: string) => {
    // Mock risk assessment
    if (number.includes('900') || number.includes('976')) return 'high';
    if (number.includes('800')) return 'medium';
    return 'low';
  };

  const riskLevel = getRiskLevel(phoneNumber);

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Phone Dialer</h1>
          <p className="text-gray-400">Make calls with real-time risk assessment</p>
        </div>

        <div className="professional-grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dialer Section */}
          <div className="professional-card">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-400 text-sm">Phone Number</label>
                <div className="flex items-center gap-2">
                  {phoneNumber && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      riskLevel === 'high' ? 'risk-high' : 
                      riskLevel === 'medium' ? 'risk-medium' : 'risk-low'
                    }`}>
                      {riskLevel.toUpperCase()} RISK
                    </span>
                  )}
                </div>
              </div>
              <div className="professional-input text-2xl text-center py-4 mb-4">
                {formatPhoneNumber(phoneNumber) || 'Enter number'}
              </div>
            </div>

            {/* Dial Pad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitClick(digit)}
                  className="professional-card hover:border-blue-500 transition-all duration-200 py-4 text-xl font-semibold text-white hover:bg-gray-700"
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCall}
                disabled={!phoneNumber}
                className="professional-btn success flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-5 h-5" />
                Call
              </button>
              <button
                onClick={handleDelete}
                disabled={!phoneNumber}
                className="professional-btn secondary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Delete className="w-5 h-5" />
              </button>
              <button
                onClick={handleClear}
                disabled={!phoneNumber}
                className="professional-btn danger py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Call Controls Section */}
          <div className="space-y-6">
            {/* Call Controls */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Call Controls</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`professional-btn ${isRecording ? 'danger' : 'secondary'} justify-start`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`professional-btn ${isMuted ? 'danger' : 'secondary'} justify-start`}
                >
                  <Mic className="w-4 h-4" />
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`professional-btn ${isSpeakerOn ? 'success' : 'secondary'} justify-start`}
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
                </button>
                <button className="professional-btn secondary justify-start">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>

            {/* Recent Contacts */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Contacts</h2>
              <div className="space-y-3">
                {[
                  { name: 'John Doe', number: '+1-555-0123', risk: 'low' },
                  { name: 'Jane Smith', number: '+1-555-0456', risk: 'medium' },
                  { name: 'Unknown', number: '+1-900-7890', risk: 'high' },
                ].map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">{contact.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        contact.risk === 'high' ? 'risk-high' : 
                        contact.risk === 'medium' ? 'risk-medium' : 'risk-low'
                      }`}>
                        {contact.risk.toUpperCase()}
                      </span>
                      <button
                        onClick={() => setPhoneNumber(contact.number.replace(/[^\d+]/g, ''))}
                        className="professional-btn success py-1 px-3"
                      >
                        <Phone className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Safety Tips</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Verify Unknown Numbers</p>
                    <p className="text-gray-400 text-xs">Always verify the identity of unknown callers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Watch for Red Flags</p>
                    <p className="text-gray-400 text-xs">Be cautious of urgent requests or threats</p>
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

export default ProfessionalDialer;
