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
  Clock
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

const EnhancedProfessionalDialer: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis | null>(null);
  const [transcription, setTranscription] = useState<Array<{speaker: string, text: string, time: string}>>([]);

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
    // Simulate API call to analyze phone number
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock analysis based on number patterns
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
    
    // Add initial transcription
    setTranscription([
      { speaker: 'system', text: `Call initiated to ${phoneNumber}`, time: '00:00' },
      { speaker: 'ai', text: `Risk Level: ${analysis.risk.toUpperCase()} - ${analysis.recommendation}`, time: '00:01' }
    ]);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration('00:00');
    setTranscription([]);
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'risk-critical';
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-low';
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

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Phone Dialer</h1>
          <p className="text-gray-600">Make calls with real-time risk detection and analysis</p>
        </div>

        {isInCall ? (
          /* Call Screen */
          <div className="professional-grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Active Call Interface */}
              <div className="professional-card">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-12 h-12 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {callAnalysis?.callerInfo?.name || 'Unknown Caller'}
                  </h2>
                  <p className="text-xl text-gray-700 mb-2">{formatPhoneNumber(phoneNumber)}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{callDuration}</span>
                  </div>
                  {callAnalysis && (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRiskColor(callAnalysis.risk)}`}>
                      {getRiskIcon(callAnalysis.risk)}
                      <span className="font-semibold">{callAnalysis.risk.toUpperCase()} RISK</span>
                      <span className="text-sm">({callAnalysis.confidence}% confidence)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Call Controls */}
              <div className="professional-card">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isMuted 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-gray-700" />}
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-8 h-8 text-white transform rotate-135" />
                  </button>
                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isSpeakerOn 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <Volume2 className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Live Analysis */}
              <div className="professional-card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Call Analysis</h3>
                {callAnalysis && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${getRiskColor(callAnalysis.risk)}`}>
                      <h4 className="font-semibold mb-2">AI Recommendation:</h4>
                      <p>{callAnalysis.recommendation}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Detected Indicators:</h4>
                      <ul className="space-y-1">
                        {callAnalysis.indicators.map((indicator, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <Activity className="w-3 h-3 text-blue-500" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Caller Information */}
              <div className="professional-card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Caller Information</h3>
                {callAnalysis?.callerInfo && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-sm">Name:</span>
                      <p className="text-gray-900 font-medium">{callAnalysis.callerInfo.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Type:</span>
                      <p className="text-gray-900">{callAnalysis.callerInfo.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Location:</span>
                      <p className="text-gray-900">{callAnalysis.callerInfo.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Reports:</span>
                      <p className="text-gray-900">{callAnalysis.callerInfo.reports}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="professional-card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="professional-btn danger w-full">
                    <Shield className="w-4 h-4" />
                    Block Number
                  </button>
                  <button className="professional-btn secondary w-full">
                    <AlertTriangle className="w-4 h-4" />
                    Report Spam
                  </button>
                  <button className="professional-btn w-full">
                    <User className="w-4 h-4" />
                    Add to Contacts
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Dialer Screen */
          <div className="professional-grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dialer Section */}
            <div className="professional-card">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-gray-600 text-sm">Phone Number</label>
                  {isAnalyzing && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-600 text-sm">Analyzing...</span>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 text-2xl text-center py-4 mb-4 rounded-lg border border-gray-200">
                  {formatPhoneNumber(phoneNumber) || 'Enter number'}
                </div>
                {callAnalysis && (
                  <div className={`p-3 rounded-lg mb-4 ${getRiskColor(callAnalysis.risk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getRiskIcon(callAnalysis.risk)}
                      <span className="font-semibold">{callAnalysis.risk.toUpperCase()} RISK</span>
                      <span className="text-sm">({callAnalysis.confidence}% confidence)</span>
                    </div>
                    <p className="text-sm">{callAnalysis.recommendation}</p>
                  </div>
                )}
              </div>

              {/* Dial Pad */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleDigitClick(digit)}
                    className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg py-4 text-xl font-semibold text-gray-900 hover:border-gray-400 transition-all duration-200"
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

            {/* Call Controls Section */}
            <div className="space-y-6">
              {/* Call Controls */}
              <div className="professional-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Call Controls</h2>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Contacts</h2>
                <div className="space-y-3">
                  {[
                    { name: 'John Doe', number: '+1-555-0123', risk: 'low' },
                    { name: 'Jane Smith', number: '+1-555-0456', risk: 'medium' },
                    { name: 'Unknown', number: '+1-900-7890', risk: 'high' },
                  ].map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{contact.name}</p>
                          <p className="text-gray-600 text-sm">{contact.number}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(contact.risk)}`}>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedProfessionalDialer;
