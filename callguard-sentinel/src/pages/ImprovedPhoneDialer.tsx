import React, { useState, useEffect } from 'react';
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
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  PhoneOff
} from 'lucide-react';

interface CallAnalysis {
  risk: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  indicators: string[];
  recommendation: string;
  callerInfo?: {
    name?: string;
    type?: string;
    location?: string;
    reports?: number;
  };
}

interface Contact {
  id: string;
  name: string;
  number: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  lastCall?: string;
}

const ImprovedPhoneDialer: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContacts, setShowContacts] = useState(false);

  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'John Doe', number: '+1-555-0123', risk: 'low', lastCall: '2 hours ago' },
    { id: '2', name: 'Jane Smith', number: '+1-555-0456', risk: 'medium', lastCall: '1 day ago' },
    { id: '3', name: 'Unknown Scammer', number: '+1-900-7890', risk: 'high', lastCall: '3 days ago' },
    { id: '4', name: 'Bank Support', number: '+1-800-555-0123', risk: 'low', lastCall: '1 week ago' },
    { id: '5', name: 'IRS Scammer', number: '+1-888-999-0000', risk: 'critical', lastCall: '2 weeks ago' }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => {
          const [minutes, seconds] = prev.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds + 1;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSeconds = totalSeconds % 60;
          return `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const analyzePhoneNumber = async (number: string): Promise<CallAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (number.includes('900') || number.includes('976')) {
      return {
        risk: 'critical',
        confidence: 95,
        indicators: ['Premium rate number', 'Known scam pattern', 'Multiple reports'],
        recommendation: 'BLOCK - This is a known scam number',
        callerInfo: {
          name: 'Scam Operation',
          type: 'Premium Rate Scam',
          location: 'Unknown',
          reports: 247
        }
      };
    } else if (number.includes('800')) {
      return {
        risk: 'low',
        confidence: 85,
        indicators: ['Toll-free number', 'Registered business'],
        recommendation: 'Safe to answer - legitimate business number',
        callerInfo: {
          name: 'Business Number',
          type: 'Toll-Free',
          location: 'United States',
          reports: 0
        }
      };
    } else if (number.includes('555')) {
      return {
        risk: 'low',
        confidence: 90,
        indicators: ['Standard number', 'No reports'],
        recommendation: 'Appears to be safe - proceed with caution',
        callerInfo: {
          name: 'Private Number',
          type: 'Mobile/Landline',
          location: 'United States',
          reports: 0
        }
      };
    } else {
      return {
        risk: 'medium',
        confidence: 70,
        indicators: ['Unknown number', 'Limited data available'],
        recommendation: 'Answer with caution - verify caller identity',
        callerInfo: {
          name: 'Unknown',
          type: 'Unknown',
          location: 'Unknown',
          reports: 0
        }
      };
    }
  };

  const handleDigitClick = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
    setCallAnalysis(null);
  };

  const handleCall = async () => {
    if (!phoneNumber) return;

    setIsAnalyzing(true);
    const analysis = await analyzePhoneNumber(phoneNumber);
    setCallAnalysis(analysis);
    setIsAnalyzing(false);
    setIsInCall(true);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration('00:00');
  };

  const handleContactSelect = (contact: Contact) => {
    setPhoneNumber(contact.number.replace(/[^\d+]/g, ''));
    setShowContacts(false);
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-900/50 border-red-700 text-red-200';
      case 'high': return 'bg-red-900/30 border-red-700 text-red-300';
      case 'medium': return 'bg-yellow-900/30 border-yellow-700 text-yellow-300';
      case 'low': return 'bg-green-900/30 border-green-700 text-green-300';
      default: return 'bg-gray-800/50 border-gray-600 text-gray-300';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.includes(searchQuery)
  );

  if (isInCall) {
    return (
      <div className="min-h-screen professional-bg flex items-center justify-center">
        <div className="professional-card max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {callAnalysis?.callerInfo?.name || 'Unknown Caller'}
            </h2>
            <p className="text-xl text-gray-300 mb-4">{formatPhoneNumber(phoneNumber)}</p>
            
            {callAnalysis && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRiskColor(callAnalysis.risk)} mb-4`}>
                {getRiskIcon(callAnalysis.risk)}
                <span className="font-semibold">{callAnalysis.risk.toUpperCase()} RISK</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">{callDuration}</span>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isMuted ? 'bg-red-600' : 'bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
              </button>
              <button
                onClick={handleEndCall}
                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isSpeakerOn ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>
            </div>

            {callAnalysis && (
              <div className={`p-4 rounded-lg ${getRiskColor(callAnalysis.risk)} mb-4`}>
                <h4 className="font-semibold mb-2">AI Analysis:</h4>
                <p className="text-sm">{callAnalysis.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Smart Phone Dialer</h1>
          <p className="text-gray-400">Make calls with real-time risk detection and analysis</p>
        </div>

        <div className="professional-grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dialer Section */}
          <div className="space-y-6">
            {/* Phone Number Display */}
            <div className="professional-card">
              <div className="mb-4">
                <label className="text-gray-400 text-sm font-medium">Phone Number</label>
                <div className="bg-gray-800 text-2xl text-center py-4 mt-2 rounded-lg border border-gray-700 font-mono">
                  {formatPhoneNumber(phoneNumber) || 'Enter number'}
                </div>
                {isAnalyzing && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-400 text-sm">Analyzing number...</span>
                  </div>
                )}
                {callAnalysis && (
                  <div className={`p-3 rounded-lg mt-3 ${getRiskColor(callAnalysis.risk)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getRiskIcon(callAnalysis.risk)}
                      <span className="font-semibold">{callAnalysis.risk.toUpperCase()} RISK</span>
                      <span className="text-sm">({callAnalysis.confidence}% confidence)</span>
                    </div>
                    <p className="text-sm">{callAnalysis.recommendation}</p>
                  </div>
                )}
              </div>

              {/* Dial Pad */}
              <div className="grid grid-cols-3 gap-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleDigitClick(digit)}
                    className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg py-4 text-xl font-semibold text-white transition-all duration-200 active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCall}
                  disabled={!phoneNumber || isAnalyzing}
                  className="professional-btn success flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Call
                    </>
                  )}
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
          </div>

          {/* Contacts Section */}
          <div className="space-y-6">
            {/* Contact Search */}
            <div className="professional-card">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowContacts(true)}
                  className="professional-input flex-1"
                />
              </div>
            </div>

            {/* Recent Contacts */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Contacts</h2>
              <div className="space-y-3">
                {filteredContacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">{contact.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(contact.risk)}`}>
                        {contact.risk.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleContactSelect(contact)}
                        className="professional-btn success py-1 px-3"
                      >
                        <Phone className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
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
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Use Smart Dialer</p>
                    <p className="text-gray-400 text-xs">Let AI analyze numbers before calling</p>
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

export default ImprovedPhoneDialer;
