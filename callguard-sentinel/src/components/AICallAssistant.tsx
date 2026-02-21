import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Brain, AlertTriangle, Shield, MessageSquare, Send, Bot } from 'lucide-react';
import { GlassCard, NeonButton } from './ui/NeonButton';
import { RiskIndicator } from './ui/RiskIndicator';

interface TranscriptionSegment {
  id: string;
  text: string;
  timestamp: string;
  speaker: 'user' | 'caller';
  confidence: number;
  riskScore?: number;
}

interface AIResponse {
  id: string;
  text: string;
  type: 'warning' | 'suggestion' | 'information' | 'alert';
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface CallAnalysis {
  overallRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedPatterns: string[];
  recommendations: string[];
  realTimeScore: number;
}

export const AICallAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis>({
    overallRisk: 0,
    riskLevel: 'low',
    detectedPatterns: [],
    recommendations: [],
    realTimeScore: 0
  });
  const [volumeEnabled, setVolumeEnabled] = useState(true);
  const [autoRespond, setAutoRespond] = useState(false);
  const [language, setLanguage] = useState('en-US');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      stopListening();
    };
  }, []);

  useEffect(() => {
    // Start real-time analysis when listening
    if (isListening) {
      analysisIntervalRef.current = setInterval(() => {
        performRealTimeAnalysis();
      }, 3000); // Analyze every 3 seconds
    } else {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    }
  }, [isListening, transcription]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await processAudioChunk(blob);
      };
      
      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsListening(true);
      
      // Add initial message
      addAIResponse({
        text: "AI Call Assistant activated. I'm monitoring for scam patterns and will provide real-time guidance.",
        type: 'information',
        priority: 'low'
      });
      
    } catch (error) {
      console.error('Failed to start listening:', error);
      addAIResponse({
        text: "Failed to access microphone. Please check permissions.",
        type: 'alert',
        priority: 'high'
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const processAudioChunk = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Send to backend for transcription and analysis
      const formData = new FormData();
      formData.append('file', audioBlob, 'chunk.webm');
      
      const response = await fetch('http://localhost:8003/analyze/text/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: "Mock transcription from audio chunk", // In real implementation, this would be actual transcription
          language: language
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Add transcription segment
        const segment: TranscriptionSegment = {
          id: Date.now().toString(),
          text: result.result?.explanations?.[0] || "Transcribed text from audio",
          timestamp: new Date().toISOString(),
          speaker: 'caller',
          confidence: 0.85,
          riskScore: result.result?.fraud_score || 0
        };
        
        setTranscription(prev => [...prev.slice(-10), segment]); // Keep last 10 segments
        
        // Generate AI response based on analysis
        generateAIResponse(result.result);
      }
    } catch (error) {
      console.error('Failed to process audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = (analysisResult: any) => {
    const fraudScore = analysisResult.fraud_score || 0;
    const riskLevel = analysisResult.risk_level || 'low';
    
    let response: AIResponse = {
      id: Date.now().toString(),
      text: '',
      type: 'information',
      timestamp: new Date().toISOString(),
      priority: 'low'
    };
    
    // Generate contextual responses based on risk level
    if (fraudScore > 0.8) {
      response = {
        ...response,
        text: "🚨 CRITICAL: High-risk scam detected! Do not share any personal information. Consider ending the call.",
        type: 'alert',
        priority: 'critical'
      };
    } else if (fraudScore > 0.6) {
      response = {
        ...response,
        text: "⚠️ WARNING: Suspicious activity detected. Be cautious and verify caller identity.",
        type: 'warning',
        priority: 'high'
      };
    } else if (fraudScore > 0.3) {
      response = {
        ...response,
        text: "💡 Suggestion: Ask for official verification and call back on known numbers.",
        type: 'suggestion',
        priority: 'medium'
      };
    } else {
      response = {
        ...response,
        text: "✅ Call appears normal. Continue monitoring.",
        type: 'information',
        priority: 'low'
      };
    }
    
    setAiResponses(prev => [...prev.slice(-5), response]); // Keep last 5 responses
    
    // Auto-respond if enabled and high risk
    if (autoRespond && response.priority === 'critical') {
      generateAutoResponse(response);
    }
  };

  const generateAutoResponse = (aiResponse: AIResponse) => {
    // In a real implementation, this would use text-to-speech
    if (volumeEnabled) {
      console.log('Auto-response (TTS):', aiResponse.text);
      // Here you would implement text-to-speech
    }
  };

  const performRealTimeAnalysis = () => {
    if (transcription.length === 0) return;
    
    // Analyze recent transcription for patterns
    const recentText = transcription.slice(-3).map(s => s.text).join(' ');
    const riskScore = calculateRealTimeRisk(recentText);
    
    setCallAnalysis(prev => ({
      ...prev,
      realTimeScore: riskScore,
      overallRisk: Math.max(prev.overallRisk, riskScore * 0.7), // Weight recent analysis more
      riskLevel: getRiskLevel(Math.max(prev.overallRisk, riskScore * 0.7))
    }));
  };

  const calculateRealTimeRisk = (text: string): number => {
    const scamKeywords = [
      'urgent', 'immediately', 'account', 'suspend', 'arrest', 'police',
      'irs', 'fbi', 'government', 'court', 'legal', 'owe', 'debt',
      'prize', 'winner', 'lottery', 'free', 'bonus', 'otp', 'password',
      'verify', 'confirm', 'security', 'social security'
    ];
    
    const lowerText = text.toLowerCase();
    let riskScore = 0;
    
    scamKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        riskScore += 0.1;
      }
    });
    
    // Check for urgency patterns
    if (lowerText.includes('right now') || lowerText.includes('immediately')) {
      riskScore += 0.2;
    }
    
    // Check for threats
    if (lowerText.includes('arrest') || lowerText.includes('sued') || lowerText.includes('jail')) {
      riskScore += 0.3;
    }
    
    return Math.min(riskScore, 1.0);
  };

  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score < 0.3) return 'low';
    if (score < 0.6) return 'medium';
    if (score < 0.8) return 'high';
    return 'critical';
  };

  const addAIResponse = (response: Partial<AIResponse>) => {
    const fullResponse: AIResponse = {
      id: Date.now().toString(),
      text: response.text || '',
      type: response.type || 'information',
      timestamp: new Date().toISOString(),
      priority: response.priority || 'low'
    };
    
    setAiResponses(prev => [...prev, fullResponse]);
  };

  const sendCustomMessage = () => {
    const message = prompt("Enter custom message for AI analysis:");
    if (message) {
      const analysis = calculateRealTimeRisk(message);
      generateAIResponse({
        fraud_score: analysis,
        risk_level: getRiskLevel(analysis)
      });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="animated-bg" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Call Assistant
          </h1>
          <p className="text-gray-400 text-lg">
            Real-time transcription and scam detection with AI-powered guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Assistant Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Transcription */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Live Transcription</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAutoRespond(!autoRespond)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      autoRespond 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                    }`}
                  >
                    Auto-Respond: {autoRespond ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setVolumeEnabled(!volumeEnabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      volumeEnabled 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {volumeEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Transcription Display */}
              <div className="bg-black/30 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                {transcription.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MicOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start listening to see real-time transcription</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transcription.map((segment) => (
                      <div key={segment.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          segment.speaker === 'caller' ? 'bg-blue-400' : 'bg-green-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white text-sm">{segment.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-500 text-xs">
                              {new Date(segment.timestamp).toLocaleTimeString()}
                            </span>
                            {segment.riskScore && segment.riskScore > 0.5 && (
                              <RiskIndicator
                                level={getRiskLevel(segment.riskScore)}
                                score={segment.riskScore}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                <NeonButton
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  variant={isListening ? 'danger' : 'primary'}
                  className="flex items-center gap-2"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Listening
                    </>
                  )}
                </NeonButton>
                
                <NeonButton
                  onClick={sendCustomMessage}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Test Analysis
                </NeonButton>
              </div>
            </GlassCard>

            {/* AI Responses */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bot className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">AI Guidance</h2>
              </div>

              <div className="space-y-4">
                {aiResponses.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>AI responses will appear here during calls</p>
                  </div>
                ) : (
                  aiResponses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        response.type === 'alert' 
                          ? 'bg-red-500/10 border-red-500'
                          : response.type === 'warning'
                          ? 'bg-yellow-500/10 border-yellow-500'
                          : response.type === 'suggestion'
                          ? 'bg-blue-500/10 border-blue-500'
                          : 'bg-green-500/10 border-green-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-white text-sm flex-1">{response.text}</p>
                        <RiskIndicator
                          level={response.priority === 'critical' ? 'critical' : 
                                response.priority === 'high' ? 'high' : 
                                response.priority === 'medium' ? 'medium' : 'low'}
                          score={response.priority === 'critical' ? 0.9 : 
                                response.priority === 'high' ? 0.7 : 
                                response.priority === 'medium' ? 0.5 : 0.3}
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(response.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Real-time Risk Analysis */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Risk Analysis</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Real-time Risk</span>
                    <RiskIndicator
                      level={callAnalysis.riskLevel}
                      score={callAnalysis.realTimeScore}
                    />
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        callAnalysis.realTimeScore < 0.3 ? 'bg-green-500' :
                        callAnalysis.realTimeScore < 0.6 ? 'bg-yellow-500' :
                        callAnalysis.realTimeScore < 0.8 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${callAnalysis.realTimeScore * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Overall Risk</span>
                    <RiskIndicator
                      level={callAnalysis.riskLevel}
                      score={callAnalysis.overallRisk}
                    />
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        callAnalysis.overallRisk < 0.3 ? 'bg-green-500' :
                        callAnalysis.overallRisk < 0.6 ? 'bg-yellow-500' :
                        callAnalysis.overallRisk < 0.8 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${callAnalysis.overallRisk * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Detected Patterns */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Detected Patterns</h2>
              </div>

              <div className="space-y-2">
                {callAnalysis.detectedPatterns.length === 0 ? (
                  <p className="text-gray-500 text-sm">No patterns detected yet</p>
                ) : (
                  callAnalysis.detectedPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span className="text-gray-300 text-sm">{pattern}</span>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>

            {/* Recommendations */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recommendations</h2>
              
              <div className="space-y-3">
                {callAnalysis.recommendations.length === 0 ? (
                  <p className="text-gray-500 text-sm">Continue monitoring</p>
                ) : (
                  callAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                      <p className="text-blue-300 text-sm">{rec}</p>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICallAssistant;
