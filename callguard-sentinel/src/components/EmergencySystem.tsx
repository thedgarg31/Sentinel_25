import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Phone, MapPin, Users, Bell, Send, Lock, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import { GlassCard, NeonButton } from './ui/NeonButton';
import { RiskIndicator } from './ui/RiskIndicator';

interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  isPrimary: boolean;
}

interface EmergencyAlert {
  id: string;
  type: 'distress' | 'otp_request' | 'high_risk' | 'scam_detected';
  message: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  audioRecording?: string;
  resolved: boolean;
}

interface OTPProtection {
  enabled: boolean;
  alertLevel: 'warning' | 'critical';
  blockedAttempts: number;
  lastBlocked?: string;
}

export const EmergencySystem: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phoneNumber: '+1-555-0001',
      relationship: 'Spouse',
      isPrimary: true
    },
    {
      id: '2',
      name: 'John Smith',
      phoneNumber: '+1-555-0002',
      relationship: 'Brother',
      isPrimary: false
    }
  ]);

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [otpProtection, setOtpProtection] = useState<OTPProtection>({
    enabled: true,
    alertLevel: 'critical',
    blockedAttempts: 0
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location access denied:', error)
      );
    }

    // Load saved emergency contacts
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const triggerEmergencyAlert = async (type: EmergencyAlert['type'], message: string) => {
    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      location: currentLocation ? {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        address: 'Current Location'
      } : undefined,
      resolved: false
    };

    setEmergencyAlerts(prev => [newAlert, ...prev]);

    // Send alerts to emergency contacts
    await sendEmergencyAlerts(newAlert);

    // Play alert sound if enabled
    if (soundEnabled) {
      playAlertSound();
    }
  };

  const sendEmergencyAlerts = async (alert: EmergencyAlert) => {
    const primaryContacts = emergencyContacts.filter(c => c.isPrimary);
    
    for (const contact of primaryContacts) {
      // In a real app, this would send SMS/email
      console.log(`Emergency alert sent to ${contact.name}:`, {
        message: alert.message,
        location: alert.location,
        timestamp: alert.timestamp
      });
    }
  };

  const playAlertSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  };

  const startEmergencyRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        // Add to latest alert
        setEmergencyAlerts(prev => prev.map(alert => 
          alert.id === emergencyAlerts[0]?.id 
            ? { ...alert, audioRecording: audioUrl }
            : alert
        ));
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopEmergencyRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const detectDistressKeywords = (transcript: string) => {
    const distressKeywords = [
      'help', 'emergency', 'danger', 'scam', 'fraud', 'police',
      'threat', 'hurt', 'afraid', 'trapped', 'urgent'
    ];
    
    const lowerTranscript = transcript.toLowerCase();
    const foundKeywords = distressKeywords.filter(keyword => 
      lowerTranscript.includes(keyword)
    );
    
    if (foundKeywords.length > 0) {
      triggerEmergencyAlert('distress', 
        `Distress keywords detected: ${foundKeywords.join(', ')}`
      );
    }
  };

  const detectOTPRequest = (transcript: string) => {
    const otpKeywords = [
      'otp', 'one time password', 'verification code', 'confirm',
      'verify', 'security code', 'authentication'
    ];
    
    const lowerTranscript = transcript.toLowerCase();
    const foundKeywords = otpKeywords.filter(keyword => 
      lowerTranscript.includes(keyword)
    );
    
    if (foundKeywords.length > 0 && otpProtection.enabled) {
      triggerEmergencyAlert('otp_request', 
        'OTP or verification code request detected'
      );
      
      setOtpProtection(prev => ({
        ...prev,
        blockedAttempts: prev.blockedAttempts + 1,
        lastBlocked: new Date().toISOString()
      }));
    }
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = { ...contact, id: Date.now().toString() };
    const updatedContacts = [...emergencyContacts, newContact];
    setEmergencyContacts(updatedContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
  };

  const removeEmergencyContact = (id: string) => {
    const updatedContacts = emergencyContacts.filter(c => c.id !== id);
    setEmergencyContacts(updatedContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="animated-bg" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Emergency Protection System
          </h1>
          <p className="text-gray-400 text-lg">
            Advanced safety features with automatic threat detection and emergency alerts
          </p>
        </div>

        {/* Main Emergency Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Emergency SOS Button */}
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                   onClick={() => triggerEmergencyAlert('distress', 'Manual SOS activated')}>
                <Shield className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency SOS</h3>
              <p className="text-gray-400 text-sm mb-4">
                Press and hold to activate emergency alert
              </p>
              <NeonButton 
                variant="danger" 
                className="w-full"
                onClick={() => triggerEmergencyAlert('distress', 'Manual SOS activated')}
              >
                Activate SOS
              </NeonButton>
            </div>
          </GlassCard>

          {/* Emergency Recording */}
          <GlassCard className="p-6">
            <div className="text-center">
              <div className={`w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110'
              }`}
                   onClick={isRecording ? stopEmergencyRecording : startEmergencyRecording}>
                <div className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${
                    isRecording ? 'bg-white' : 'bg-white/80'
                  }`} />
                  <span className="text-white font-bold">
                    {isRecording ? formatRecordingTime(recordingTime) : 'REC'}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Recording</h3>
              <p className="text-gray-400 text-sm mb-4">
                Record evidence during emergency situations
              </p>
              <NeonButton 
                variant={isRecording ? 'danger' : 'primary'} 
                className="w-full"
                onClick={isRecording ? stopEmergencyRecording : startEmergencyRecording}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </NeonButton>
            </div>
          </GlassCard>

          {/* System Status */}
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                {isMonitoring ? (
                  <Bell className="w-16 h-16 text-white animate-pulse" />
                ) : (
                  <Shield className="w-16 h-16 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isMonitoring ? 'Monitoring Active' : 'System Standby'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Automatic threat detection and alerts
              </p>
              <NeonButton 
                variant={isMonitoring ? 'success' : 'secondary'} 
                className="w-full"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? 'Monitoring On' : 'Start Monitoring'}
              </NeonButton>
            </div>
          </GlassCard>
        </div>

        {/* OTP Protection */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">OTP Protection System</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  soundEnabled 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                className={`p-2 rounded-lg transition-colors ${
                  showSensitiveInfo 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {showSensitiveInfo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Protection Status</span>
                <div className={`w-3 h-3 rounded-full ${
                  otpProtection.enabled ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <p className="text-white font-bold">
                {otpProtection.enabled ? 'Active' : 'Disabled'}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Alert Level</span>
                <RiskIndicator 
                  level={otpProtection.alertLevel === 'critical' ? 'critical' : 'medium'}
                  score={otpProtection.alertLevel === 'critical' ? 0.9 : 0.6}
                />
              </div>
              <p className="text-white font-bold capitalize">
                {otpProtection.alertLevel}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Blocked Attempts</span>
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-white font-bold">{otpProtection.blockedAttempts}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-400 text-sm font-medium mb-2">
              ⚠️ OTP Protection Active
            </p>
            <p className="text-gray-300 text-sm">
              System will automatically detect and block OTP requests from unknown numbers. 
              Emergency alerts will be sent to your contacts if suspicious activity is detected.
            </p>
          </div>
        </GlassCard>

        {/* Emergency Contacts */}
        <GlassCard className="p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Emergency Contacts</h2>
          
          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-gray-400 text-sm">
                      {showSensitiveInfo ? contact.phoneNumber : '***-***-****'}
                    </p>
                    <p className="text-gray-500 text-xs">{contact.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {contact.isPrimary && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Primary
                    </span>
                  )}
                  <NeonButton
                    size="sm"
                    variant="secondary"
                    onClick={() => removeEmergencyContact(contact.id)}
                  >
                    Remove
                  </NeonButton>
                </div>
              </div>
            ))}
          </div>
          
          <NeonButton className="w-full mt-4" variant="secondary">
            <Users className="w-4 h-4" />
            Add Emergency Contact
          </NeonButton>
        </GlassCard>

        {/* Recent Emergency Alerts */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Emergency Alerts</h2>
          
          {emergencyAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No emergency alerts recorded</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emergencyAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <RiskIndicator
                          level={alert.type === 'distress' ? 'critical' : 'high'}
                          score={0.8}
                        />
                        <span className="text-gray-400 text-sm">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-2">{alert.message}</p>
                      
                      {alert.location && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location.address}</span>
                        </div>
                      )}
                      
                      {alert.audioRecording && (
                        <div className="mt-2">
                          <audio controls className="w-full" src={alert.audioRecording}>
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <NeonButton
                        size="sm"
                        variant={alert.resolved ? 'success' : 'warning'}
                      >
                        {alert.resolved ? 'Resolved' : 'Active'}
                      </NeonButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default EmergencySystem;
