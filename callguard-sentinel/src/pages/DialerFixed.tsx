import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Mic, 
  MicOff, 
  Shield, 
  Search, 
  Users, 
  Clock, 
  AlertTriangle,
  Volume2,
  VolumeX,
  MoreVertical,
  PhoneOff,
  PhoneCall,
  User
} from 'lucide-react';
import { GlassCard, NeonButton } from '../components/ui/NeonButton';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import { formatPhoneNumber, getRiskLevel, getRiskColor } from '../lib/utils';

const Dialer: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [showKeypad, setShowKeypad] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [riskScore, setRiskScore] = useState(0);
  const [callHistory, setCallHistory] = useState<any[]>([]);

  const navigate = useNavigate();

  // Mock contacts with risk scores
  const mockContacts = [
    { id: '1', name: 'John Smith', phone: '+1-555-0123', riskScore: 0.15, avatar: '👤' },
    { id: '2', name: 'Sarah Johnson', phone: '+1-555-0456', riskScore: 0.05, avatar: '👩' },
    { id: '3', name: 'Unknown', phone: '+1-555-0789', riskScore: 0.95, avatar: '⚠️' },
    { id: '4', name: 'Bank Support', phone: '+1-800-1234', riskScore: 0.45, avatar: '🏦' },
    { id: '5', name: 'Mom', phone: '+1-555-0111', riskScore: 0.05, avatar: '❤️' },
    { id: '6', name: 'Office', phone: '+1-555-0222', riskScore: 0.25, avatar: '🏢' },
  ];

  const mockCallHistory = [
    { id: '1', name: 'Unknown', phone: '+1-555-0789', duration: '2:34', time: '10:30 AM', type: 'missed', riskScore: 0.95 },
    { id: '2', name: 'John Smith', phone: '+1-555-0123', duration: '5:12', time: '9:15 AM', type: 'incoming', riskScore: 0.15 },
    { id: '3', name: 'Sarah Johnson', phone: '+1-555-0456', duration: '1:45', time: '8:30 AM', type: 'outgoing', riskScore: 0.05 },
    { id: '4', name: 'Unknown', phone: '+1-555-0999', duration: '0:00', time: 'Yesterday', type: 'blocked', riskScore: 0.85 },
  ];

  useEffect(() => {
    setCallHistory(mockCallHistory);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = mockContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Calculate risk score for current number
    if (phoneNumber.length >= 10) {
      const contact = mockContacts.find(c => c.phone === phoneNumber);
      setRiskScore(contact ? contact.riskScore : Math.random() * 0.8);
    } else {
      setRiskScore(0);
    }
  }, [phoneNumber]);

  const handleCall = async () => {
    if (phoneNumber.length === 0) return;
    
    setIsCallActive(true);
    setCallDuration(0);
    
    // Add to call history
    const newCall = {
      id: Date.now().toString(),
      name: selectedContact?.name || 'Unknown',
      phone: phoneNumber,
      duration: '0:00',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'outgoing',
      riskScore: riskScore
    };
    
    setCallHistory(prev => [newCall, ...prev]);
    
    // Navigate to call screen
    setTimeout(() => {
      navigate(`/call?number=${phoneNumber}&name=${selectedContact?.name || 'Unknown'}`);
    }, 500);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setPhoneNumber('');
    setSelectedContact(null);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'clear') {
      setPhoneNumber('');
      setSelectedContact(null);
    } else if (key === 'delete') {
      setPhoneNumber(prev => prev.slice(0, -1));
      if (phoneNumber.length <= 1) {
        setSelectedContact(null);
      }
    } else {
      setPhoneNumber(prev => prev + key);
    }
  };

  const handleContactSelect = (contact: any) => {
    setPhoneNumber(contact.phone);
    setSelectedContact(contact);
    setSearchQuery('');
    setFilteredContacts([]);
  };

  const getCallButtonColor = () => {
    if (phoneNumber.length < 10) return 'from-gray-500 to-gray-600';
    if (riskScore > 0.8) return 'from-red-500 to-red-700';
    if (riskScore > 0.6) return 'from-orange-500 to-orange-600';
    if (riskScore > 0.3) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-emerald-600';
  };

  const getCallButtonText = () => {
    if (phoneNumber.length < 10) return 'Enter Number';
    if (riskScore > 0.8) return 'High Risk - Call Anyway';
    if (riskScore > 0.6) return 'Caution - Call';
    return 'Call';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/20" />
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${20 + Math.random() * 15}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Dialer */}
        <div className="flex-1 p-4 lg:p-6">
          <GlassCard className="h-full max-w-md mx-auto backdrop-blur-xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Phone Dialer</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowKeypad(!showKeypad)}
                    className={`p-2 rounded-lg transition-colors ${
                      showKeypad 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contact Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/20 transition-all"
                  />
                </div>
                
                {/* Search Results */}
                {filteredContacts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl z-50 max-h-60 overflow-y-auto">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleContactSelect(contact)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-700 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                          {contact.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-medium">{contact.name}</p>
                          <p className="text-gray-400 text-sm">{contact.phone}</p>
                        </div>
                        <RiskIndicator
                          level={getRiskLevel(contact.riskScore)}
                          score={contact.riskScore}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

              {/* Selected Contact */}
              {selectedContact && (
                <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      {selectedContact.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-lg">{selectedContact.name}</p>
                      <p className="text-gray-400 text-sm">{selectedContact.phone}</p>
                      <RiskIndicator
                        level={getRiskLevel(selectedContact.riskScore)}
                        score={selectedContact.riskScore}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Number Display */}
              <div className="mb-6">
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Number to Call</h3>
                    <div className="flex items-center gap-2">
                      {phoneNumber && (
                        <RiskIndicator
                          level={getRiskLevel(riskScore)}
                          score={riskScore}
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white text-center tracking-wider">
                    {formatPhoneNumber(phoneNumber) || 'Enter Number'}
                  </div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="mb-6">
                <NeonButton
                  onClick={handleCall}
                  disabled={phoneNumber.length < 10 || isCallActive}
                  variant={phoneNumber.length < 10 ? 'secondary' : riskScore > 0.6 ? 'warning' : 'primary'}
                  className={`w-full py-4 text-lg font-bold transition-all duration-300 ${
                    phoneNumber.length >= 10 && !isCallActive ? 'hover:scale-105' : ''
                  }`}
                  style={{
                    background: phoneNumber.length >= 10 && !isCallActive 
                      ? `linear-gradient(135deg, ${getCallButtonColor()})`
                      : undefined
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isCallActive ? (
                      <>
                        <PhoneOff className="w-6 h-6" />
                        <span>End Call</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-6 h-6" />
                        <span>{getCallButtonText()}</span>
                      </>
                    )}
                  </div>
                </NeonButton>
              </div>

              {/* Keypad */}
              {showKeypad && (
                <div className="grid grid-cols-3 gap-3">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', 'clear', 'delete'].map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className={`p-4 bg-white/10 border border-white/20 rounded-xl text-white font-bold text-xl hover:bg-white/20 transition-all duration-200 ${
                        key === 'clear' || key === 'delete' ? 'col-span-2' : ''
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <NeonButton
                  variant="secondary"
                  className="flex items-center justify-center gap-2 py-3"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span className="text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
                </NeonButton>
                
                <NeonButton
                  variant="secondary"
                  className="flex items-center justify-center gap-2 py-3"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">{isSpeakerOn ? 'Speaker' : 'Earpiece'}</span>
                </NeonButton>
                
                <NeonButton
                  variant="secondary"
                  className="flex items-center justify-center gap-2 py-3"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5" />}
                  <span className="text-sm">{isRecording ? 'Stop' : 'Record'}</span>
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Calls */}
        <div className="hidden lg:block lg:w-96 p-6 border-l border-gray-700">
          <GlassCard className="backdrop-blur-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Calls</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {callHistory.map((call) => (
                  <div
                    key={call.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      call.type === 'missed' ? 'bg-gray-800/50 border-gray-700' :
                      call.type === 'blocked' ? 'bg-red-800/50 border-red-700' :
                      call.riskScore > 0.6 ? 'bg-orange-800/50 border-orange-700' :
                      'bg-green-800/50 border-green-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          {call.type === 'missed' ? <PhoneOff className="w-5 h-5" /> :
                           call.type === 'blocked' ? <Shield className="w-5 h-5" /> :
                           <PhoneCall className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{call.name}</p>
                          <p className="text-gray-400 text-sm">{call.phone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-500 text-xs">{call.time}</span>
                            <span className="text-gray-500 text-xs">{call.duration}</span>
                            {call.riskScore > 0 && (
                              <RiskIndicator
                                level={getRiskLevel(call.riskScore)}
                                score={call.riskScore}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                          call.type === 'missed' ? 'bg-gray-600 text-gray-300' :
                          call.type === 'blocked' ? 'bg-red-600 text-red-300' :
                          call.riskScore > 0.6 ? 'bg-orange-600 text-orange-300' :
                          'bg-green-600 text-green-300'
                        }`}>
                          {call.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dialer;
