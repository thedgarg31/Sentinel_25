import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Shield, 
  AlertTriangle, 
  Activity,
  Clock,
  MessageSquare,
  Square,
  Pause,
  Play,
  User,
  MapPin,
  Flag
} from 'lucide-react';

interface CallData {
  id: string;
  number: string;
  name?: string;
  type: 'incoming' | 'outgoing';
  status: 'ringing' | 'connected' | 'ended';
  duration: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  indicators: string[];
  recommendation: string;
  location?: string;
  carrier?: string;
  reports?: number;
}

const EnhancedCallScreen: React.FC = () => {
  const [callData, setCallData] = useState<CallData>({
    id: '1',
    number: '+1-900-7890',
    name: 'Unknown Scammer',
    type: 'incoming',
    status: 'connected',
    duration: 0,
    risk: 'critical',
    confidence: 95,
    indicators: [
      'Premium rate number detected',
      'Known scam pattern',
      'Multiple user reports',
      'IRS impersonation attempt'
    ],
    recommendation: 'IMMEDIATE ACTION REQUIRED: This is a high-risk scam call. End call immediately and block number.',
    location: 'Unknown Location',
    carrier: 'Premium Rate Carrier',
    reports: 247
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [transcription, setTranscription] = useState([
    { speaker: 'system', text: 'Call connected', time: '00:00' },
    { speaker: 'ai', text: '⚠️ CRITICAL RISK DETECTED - IRS SCAM IDENTIFIED', time: '00:01' },
    { speaker: 'caller', text: 'Hello, this is Officer John from the IRS Tax Department.', time: '00:03' },
    { speaker: 'ai', text: '⚠️ SCAM ALERT: IRS never calls demanding immediate payment', time: '00:05' },
    { speaker: 'caller', text: 'We have detected suspicious activity on your tax return and you need to pay $5,000 immediately.', time: '00:08' },
    { speaker: 'ai', text: '🚨 HIGH CONFIDENCE SCAM: Classic IRS impersonation with payment demand', time: '00:10' }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callData.status === 'connected' && !isPaused) {
      interval = setInterval(() => {
        setCallData(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callData.status, isPaused]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallData(prev => ({ ...prev, status: 'ended' }));
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
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
      case 'critical': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'high': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'low': return <Shield className="w-6 h-6 text-green-600" />;
      default: return <Shield className="w-6 h-6 text-gray-600" />;
    }
  };

  if (callData.status === 'ended') {
    return (
      <div className="min-h-screen professional-bg flex items-center justify-center">
        <div className="professional-card max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <PhoneOff className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Call Ended</h2>
          <p className="text-gray-400 mb-6">Duration: {formatDuration(callData.duration)}</p>
          <div className="space-y-3">
            <button className="professional-btn w-full">
              <Phone className="w-4 h-4 mr-2" />
              Call Back
            </button>
            <button className="professional-btn danger w-full">
              <Shield className="w-4 h-4 mr-2" />
              Block Number
            </button>
            <button className="professional-btn secondary w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Report Scam
            </button>
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
          <h1 className="text-3xl font-bold text-white mb-2">Active Call Screen</h1>
          <p className="text-gray-400">Real-time call monitoring with AI protection</p>
        </div>

        <div className="professional-grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Call Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Caller Info */}
            <div className="professional-card">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{callData.name || 'Unknown Caller'}</h2>
                <p className="text-xl text-gray-300 mb-4">{callData.number}</p>
                
                {/* Risk Alert */}
                <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 ${getRiskColor(callData.risk)} mb-4`}>
                  {getRiskIcon(callData.risk)}
                  <div className="text-left">
                    <div className="font-bold text-lg">{callData.risk.toUpperCase()} RISK</div>
                    <div className="text-sm font-medium">{callData.confidence}% Confidence</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{formatDuration(callData.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium capitalize">{callData.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Controls */}
            <div className="professional-card">
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleMute}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isMuted 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </button>
                <button
                  onClick={handleEndCall}
                  className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={handleSpeaker}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isSpeakerOn 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Additional Controls */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRecording}
                  className={`professional-btn ${isRecording ? 'danger' : 'secondary'}`}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  {isRecording ? 'Recording' : 'Record'}
                </button>
                <button
                  onClick={handlePause}
                  className={`professional-btn ${isPaused ? 'success' : 'secondary'}`}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              </div>
            </div>

            {/* Live Transcription */}
            <div className="professional-card">
              <h3 className="text-xl font-bold text-white mb-4">Live Transcription & Analysis</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {transcription.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400 text-sm font-medium mt-1 min-w-[50px]">{entry.time}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${
                          entry.speaker === 'caller' ? 'text-blue-400' :
                          entry.speaker === 'user' ? 'text-green-400' :
                          entry.speaker === 'ai' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {entry.speaker === 'caller' ? 'CALLER' :
                           entry.speaker === 'user' ? 'YOU' :
                           entry.speaker === 'ai' ? 'AI ASSISTANT' : 'SYSTEM'}
                        </span>
                      </div>
                      <p className="text-gray-200 font-medium">{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* AI Analysis */}
            <div className="professional-card">
              <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
              <div className={`p-4 rounded-lg border-2 ${getRiskColor(callData.risk)} mb-4`}>
                <h4 className="font-bold text-lg mb-2">Immediate Action Required</h4>
                <p className="font-medium">{callData.recommendation}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-white mb-2">Detected Indicators:</h4>
                  <ul className="space-y-2">
                    {callData.indicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Caller Information */}
            <div className="professional-card">
              <h3 className="text-xl font-bold text-white mb-4">Caller Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm font-medium">Number:</span>
                  <p className="text-white font-semibold">{callData.number}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium">Carrier:</span>
                  <p className="text-gray-300">{callData.carrier}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium">Location:</span>
                  <p className="text-gray-300">{callData.location}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium">Reports:</span>
                  <p className="text-red-400 font-semibold">{callData.reports} users reported</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="professional-card">
              <h3 className="text-xl font-bold text-white mb-4">Emergency Actions</h3>
              <div className="space-y-3">
                <button className="professional-btn danger w-full">
                  <Shield className="w-4 h-4" />
                  Block & Report Now
                </button>
                <button className="professional-btn secondary w-full">
                  <Flag className="w-4 h-4" />
                  Report to Authorities
                </button>
                <button className="professional-btn secondary w-full">
                  <MessageSquare className="w-4 h-4" />
                  Add Warning Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCallScreen;
