import React, { useState } from 'react';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Bot,
  User,
  Clock,
  Activity
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  risk?: 'low' | 'medium' | 'high' | 'critical';
}

const ProfessionalAIAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Call Assistant. I can help you identify potential scams, analyze suspicious calls, and provide real-time guidance during conversations. How can I assist you today?',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      type: 'user',
      content: 'I received a call from someone claiming to be from the IRS',
      timestamp: '10:32 AM'
    },
    {
      id: '3',
      type: 'ai',
      content: 'This is a common scam! The IRS will never call you demanding immediate payment or threaten you with arrest. Here are the red flags:\n\n1. IRS contacts people by mail first\n2. They never demand specific payment methods\n3. They never threaten arrest or deportation\n\nPlease hang up and report this number. Would you like me to help you report this scam?',
      timestamp: '10:32 AM',
      risk: 'high'
    }
  ]);

  const [suggestions] = useState([
    'Is this call a scam?',
    'What should I say to this caller?',
    'Analyze this phone number',
    'Help me report fraud',
    'Emergency assistance needed'
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsAnalyzing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I\'m analyzing your request. Based on the information provided, I recommend being cautious with unknown callers. Always verify the identity of anyone asking for personal or financial information.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk: 'medium'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'critical': return 'risk-critical';
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Call Assistant</h1>
          <p className="text-gray-400">Real-time AI guidance for call protection and fraud detection</p>
        </div>

        <div className="professional-grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="professional-card h-[600px] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === 'ai' ? (
                          <Bot className="w-4 h-4 text-blue-500" />
                        ) : (
                          <User className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-gray-400 text-xs">{message.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-200'
                        } ${getRiskColor(message.risk)}`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-400 text-xs">Analyzing...</span>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message or ask for help..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="professional-input flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isAnalyzing}
                    className="professional-btn py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Suggestions */}
                <div className="mt-3">
                  <p className="text-gray-400 text-xs mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestion(suggestion)}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Voice Controls */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Voice Controls</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`professional-btn w-full justify-start ${
                    isListening ? 'danger' : 'secondary'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? 'Stop Listening' : 'Start Voice Input'}
                </button>
                <button
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  className={`professional-btn w-full justify-start ${
                    isSpeaking ? 'danger' : 'secondary'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeaking ? 'Stop Speaking' : 'Enable Voice Output'}
                </button>
              </div>

              {isListening && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-sm">Listening...</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Status */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">AI Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">AI Engine</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 text-sm">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Fraud Detection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 text-sm">Enabled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Voice Analysis</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 text-sm">Ready</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-gray-300 text-sm">&lt; 1s</span>
                </div>
              </div>
            </div>

            {/* Recent Analysis */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Analysis</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">IRS Scam Detected</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">Legitimate Bank Call</p>
                    <p className="text-gray-400 text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">Suspicious Telemarketer</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="professional-card">
              <h2 className="text-xl font-semibold text-white mb-4">AI Features</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">Real-time Analysis</p>
                    <p className="text-gray-400 text-xs">Live call monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">Pattern Recognition</p>
                    <p className="text-gray-400 text-xs">Scam pattern detection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">Proactive Protection</p>
                    <p className="text-gray-400 text-xs">Early warning system</p>
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

export default ProfessionalAIAssistant;
