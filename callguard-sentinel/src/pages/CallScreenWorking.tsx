import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Shield, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Clock, 
  Users, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Settings, 
  Send, 
  Bot, 
  Brain, 
  Activity, 
  Zap,
  Ban,
  CheckCircle,
  X
} from 'lucide-react';
import { GlassCard, NeonButton, AnimatedNumber } from '../components/ui/NeonButton';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import { formatPhoneNumber, getTimeAgo, getRiskLevel, getRiskColor } from '../lib/utils';

const CallScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const phoneNumber = searchParams.get('number') || '';
  const callerName = searchParams.get('name') || 'Unknown Caller';
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [fraudScore, setFraudScore] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate call connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      callIntervalRef.current = timer;
    }

    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
    };
  }, [isConnected]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true, 
          noiseSuppression: true 
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudioRecording(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Add AI suggestions
      setAiSuggestions([
        "Ask for official verification",
        "Never share personal information",
        "Request callback number"
      ]);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const processAudioRecording = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Send to backend for analysis
      const formData = new FormData();
      formData.append('file', audioBlob, 'call_recording.webm');
      formData.append('transcript', transcription);
      
      const response = await fetch('http://localhost:8003/analyze/advanced/', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result.result);
        setThreatLevel(result.result.risk_level);
        setFraudScore(result.result.overall_fraud_score);
        
        // Update AI suggestions based on analysis
        if (result.result.explanations) {
          setAiSuggestions(result.result.explanations.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Mock result for demo
      setAnalysisResult({
        overall_fraud_score: Math.random() * 0.8 + 0.1,
        risk_level: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'high' : 'medium',
        explanations: [
          "High urgency language detected",
          "Authority impersonation suspected",
          "Request for sensitive information"
        ],
        recommendations: [
          "Block this number immediately",
          "Report to authorities",
          "Do not engage further"
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const endCall = () => {
    // Stop recording if active
    stopRecording();
    
    // Stop call timer
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current);
    }
    
    setIsConnected(false);
    
    // Navigate back to dialer after a short delay
    setTimeout(() => {
      navigate('/dialer');
    }, 2000);
  };

  const blockNumber = () => {
    // Mock block functionality
    alert('Number blocked successfully');
    endCall();
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'critical': return 'from-red-500 to-red-700';
      case 'high': return 'from-orange-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      default: return 'from-green-500 to-emerald-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/20" />
        <div className="absolute inset-0">
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 20}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col h-screen">
        {/* Call Header */}
        <div className="bg-black/50 backdrop-blur-md p-4 border-b border-gray-700">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Active Call</h2>
                <p className="text-gray-400 text-sm">{formatPhoneNumber(phoneNumber)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-400 text-sm">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-gray-400 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                {formatCallDuration(callDuration)}
              </div>
              
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
                <span className="text-sm">{showAdvancedOptions ? 'Hide' : 'Show'} Advanced</span>
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Main Call Interface */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Caller Information */}
            <GlassCard className="mb-6 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    <span className="text-2xl font-bold">
                      {callerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">{formatPhoneNumber(phoneNumber)}</p>
                    <RiskIndicator
                      level={threatLevel}
                      score={fraudScore}
                    />
                  </div>
                </div>
                
                <button
                  onClick={blockNumber}
                  className="p-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Block Number
                </button>
              </div>
            </div>
            </GlassCard>

            {/* Transcription */}
            <div className="mb-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <h4 className="text-white font-medium">Live Transcription</h4>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-4 min-h-32">
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {transcription || "Transcription will appear here..."}
                  </div>
                </div>
            </div>
            </GlassCard>

            {/* Call Controls */}
            <div className="mb-6 backdrop-blur-xl">
              <div className="grid grid-cols-3 gap-4">
                <NeonButton
                  onClick={isRecording ? stopRecording : startCall}
                  variant={isRecording ? 'danger' : 'primary'}
                  className="py-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isRecording ? <MicOff className="w-6 h-6 text-red-400" /> : <Mic className="w-6 h-6" />}
                      <span>{isRecording ? `Recording (${recordingTime}s)` : 'Start Recording'}</span>
                    </div>
                  </NeonButton>
                  
                  <NeonButton
                    onClick={endCall}
                    variant="danger"
                    className="py-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <PhoneOff className="w-6 h-6" />
                      <span>End Call</span>
                    </div>
                  </NeonButton>
                  
                  <NeonButton
                    onClick={() => setIsMuted(!isMuted)}
                    variant="secondary"
                    className="py-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                    </div>
                  </NeonButton>
                  
                  <NeonButton
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    variant="secondary"
                    className="py-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      <span>{isSpeakerOn ? 'Speaker' : 'Earpiece'}</span>
                    </div>
                  </NeonButton>
                </div>
              </div>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="col-span-3">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Bot className="w-5 h-5 text-purple-400" />
                      <h4 className="text-white font-medium">AI Suggestions</h4>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                            <span className="text-purple-300 text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            {isAnalyzing && (
              <div className="mb-6 backdrop-blur-xl">
                <div className="flex items-center justify-center gap-4">
                  <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                  <span className="text-blue-400 font-medium">Analyzing call...</span>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-4">
                <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Analysis Results</h3>
                    <div className="flex items-center gap-2">
                      <RiskIndicator
                        level={analysisResult.risk_level}
                        score={analysisResult.overall_fraud_score}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-gray-400 text-sm mb-2">Fraud Score</h4>
                      <div className="text-3xl font-bold text-white">
                        {Math.round(analysisResult.overall_fraud_score * 100)}%
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-gray-400 text-sm mb-2">Risk Level</h4>
                      <div className={`px-4 py-2 rounded-lg text-white font-bold text-sm ${getThreatColor()}`}>
                        {analysisResult.risk_level.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {analysisResult.explanations && analysisResult.explanations.length > 0 && (
                  <div className="bg-red-500/10 border-red-500/30 rounded-xl p-4">
                    <h4 className="text-red-400 font-medium mb-2">Threat Indicators</h4>
                    <div className="space-y-2">
                      {analysisResult.explanations.map((explanation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-500/10 border-red-500/30 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                          <span className="text-red-300 text-sm">{explanation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div className="bg-yellow-500/10 border-yellow-500/30 rounded-xl p-4">
                    <h4 className="text-yellow-400 font-medium mb-2">Recommendations</h4>
                    <div className="space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 border-yellow-500/30 rounded-lg">
                          <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
                          <span className="text-yellow-300 text-sm">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallScreen;
