import React, { useState } from 'react';
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
  Square
} from 'lucide-react';

const ProfessionalCallScreen: React.FC = () => {
  const [isInCall, setIsInCall] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState('02:34');
  const [transcription, setTranscription] = useState([
    { speaker: 'caller', text: 'Hello, this is John from the IRS department.', time: '00:05' },
    { speaker: 'user', text: 'Hi, I wasn\'t expecting a call from the IRS.', time: '00:12' },
    { speaker: 'caller', text: 'We have detected suspicious activity on your tax return and you need to pay immediately.', time: '00:18' },
    { speaker: 'ai', text: '⚠️ WARNING: This is a classic IRS scam. The IRS never calls demanding immediate payment.', time: '00:20' }
  ]);

  const [aiAnalysis] = useState({
    risk: 'critical',
    confidence: 95,
    indicators: [
      'IRS impersonation attempt',
      'Demand for immediate payment',
      'Threatening language detected',
      'Unusual call pattern'
    ],
    recommendation: 'End call immediately and report to authorities'
  });

  const handleEndCall = () => {
    setIsInCall(false);
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'risk-critical';
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-low';
    }
  };

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Call Screen</h1>
          <p className="text-gray-400">Active call management with real-time AI analysis</p>
        </div>

        {isInCall ? (
          <div className="professional-grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Call Interface */}
            <div className="lg:col-span-2 space-y-6">
              {/* Caller Info */}
              <div className="professional-card">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Unknown Caller</h2>
                  <p className="text-xl text-gray-300 mb-2">+1-888-999-0000</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">{callDuration}</span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRiskColor(aiAnalysis.risk)}`}>
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">{aiAnalysis.risk.toUpperCase()} RISK</span>
                    <span className="text-sm">({aiAnalysis.confidence}% confidence)</span>
                  </div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="professional-card">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleMute}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isMuted 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <PhoneOff className="w-8 h-8 text-white" />
                  </button>
                  <button
                    onClick={handleSpeaker}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isSpeakerOn 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
                  </button>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleRecording}
                    className={`professional-btn ${isRecording ? 'danger' : 'secondary'}`}
                  >
                    {isRecording ? <Square className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                </div>
              </div>

              {/* Live Transcription */}
              <div className="professional-card">
                <h3 className="text-xl font-semibold text-white mb-4">Live Transcription</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {transcription.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-gray-400 text-sm mt-1">{entry.time}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            entry.speaker === 'caller' ? 'text-blue-400' :
                            entry.speaker === 'user' ? 'text-green-400' :
                            'text-yellow-400'
                          }`}>
                            {entry.speaker === 'caller' ? 'Caller' :
                             entry.speaker === 'user' ? 'You' : 'AI Assistant'}
                          </span>
                        </div>
                        <p className="text-gray-300">{entry.text}</p>
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
                <h3 className="text-xl font-semibold text-white mb-4">AI Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(aiAnalysis.risk)}`}>
                        {aiAnalysis.risk.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${aiAnalysis.confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{aiAnalysis.confidence}% confidence</p>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Detected Indicators:</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.indicators.map((indicator, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-3 rounded-lg ${getRiskColor(aiAnalysis.risk)}`}>
                    <h4 className="font-medium mb-1">Recommendation:</h4>
                    <p className="text-sm">{aiAnalysis.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="professional-card">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="professional-btn danger w-full">
                    <Shield className="w-4 h-4" />
                    Block Number
                  </button>
                  <button className="professional-btn secondary w-full">
                    <MessageSquare className="w-4 h-4" />
                    Report Spam
                  </button>
                  <button className="professional-btn secondary w-full">
                    <AlertTriangle className="w-4 h-4" />
                    Emergency Alert
                  </button>
                </div>
              </div>

              {/* Call History */}
              <div className="professional-card">
                <h3 className="text-xl font-semibold text-white mb-4">Previous Interactions</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-800 rounded">
                    <p className="text-white text-sm">IRS Scam Attempt</p>
                    <p className="text-gray-400 text-xs">2 days ago • Blocked</p>
                  </div>
                  <div className="p-2 bg-gray-800 rounded">
                    <p className="text-white text-sm">Tech Support Fraud</p>
                    <p className="text-gray-400 text-xs">1 week ago • Reported</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Call Ended Screen */
          <div className="professional-card text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <PhoneOff className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Call Ended</h2>
            <p className="text-gray-400 mb-6">Duration: {callDuration}</p>
            <div className="flex justify-center gap-4">
              <button className="professional-btn">
                <Phone className="w-4 h-4 mr-2" />
                Call Back
              </button>
              <button className="professional-btn secondary">
                <Shield className="w-4 h-4 mr-2" />
                Block Number
              </button>
              <button className="professional-btn secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalCallScreen;
