import React, { useState } from 'react';
import { 
  Clock, 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Search,
  Filter,
  Calendar,
  Download,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface CallRecord {
  id: string;
  number: string;
  name?: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  time: string;
  date: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  recording?: boolean;
  transcribed?: boolean;
}

const ProfessionalCallHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

  const [callHistory] = useState<CallRecord[]>([
    {
      id: '1',
      number: '+1-555-0123',
      name: 'John Doe',
      type: 'incoming',
      duration: '5:23',
      time: '2:30 PM',
      date: 'Today',
      risk: 'low',
      recording: true,
      transcribed: true
    },
    {
      id: '2',
      number: '+1-900-7890',
      name: 'Unknown',
      type: 'missed',
      duration: '0:00',
      time: '11:45 AM',
      date: 'Today',
      risk: 'high',
      recording: false,
      transcribed: false
    },
    {
      id: '3',
      number: '+1-800-555-0456',
      name: 'Bank Support',
      type: 'outgoing',
      duration: '12:15',
      time: '9:30 AM',
      date: 'Today',
      risk: 'low',
      recording: true,
      transcribed: true
    },
    {
      id: '4',
      number: '+1-555-0456',
      name: 'Jane Smith',
      type: 'incoming',
      duration: '8:45',
      time: '3:20 PM',
      date: 'Yesterday',
      risk: 'medium',
      recording: true,
      transcribed: false
    },
    {
      id: '5',
      number: '+1-888-999-0000',
      name: 'IRS Scammer',
      type: 'missed',
      duration: '0:00',
      time: '1:15 PM',
      date: 'Yesterday',
      risk: 'critical',
      recording: false,
      transcribed: false
    }
  ]);

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <PhoneIncoming className="w-4 h-4 text-green-500" />;
      case 'outgoing': return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
      case 'missed': return <PhoneMissed className="w-4 h-4 text-red-500" />;
      default: return <Phone className="w-4 h-4 text-gray-500" />;
    }
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

  const filteredCalls = callHistory.filter(call => {
    const matchesSearch = call.number.includes(searchQuery) || 
                         (call.name && call.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || call.type === filterType;
    const matchesRisk = filterRisk === 'all' || call.risk === filterRisk;
    
    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Call History</h1>
          <p className="text-gray-400">View and manage your call records with risk analysis</p>
        </div>

        {/* Search and Filters */}
        <div className="professional-card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search calls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="professional-input pl-10 w-full"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="professional-input"
              >
                <option value="all">All Calls</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
                <option value="missed">Missed</option>
              </select>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as any)}
                className="professional-input"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
              </select>

              <button className="professional-btn">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Call History List */}
        <div className="professional-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Risk</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Features</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{call.name || 'Unknown'}</p>
                        <p className="text-gray-400 text-sm">{call.number}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getCallIcon(call.type)}
                        <span className="text-gray-300 capitalize">{call.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{call.duration}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-300">{call.date}</p>
                        <p className="text-gray-400 text-sm">{call.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(call.risk)}`}>
                        {call.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {call.recording && (
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                            Recording
                          </span>
                        )}
                        {call.transcribed && (
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                            Transcribed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="professional-btn success py-1 px-2">
                          <Phone className="w-3 h-3" />
                        </button>
                        {call.recording && (
                          <button className="professional-btn secondary py-1 px-2">
                            <Clock className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCalls.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No call history found</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="professional-grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-white mb-1">{callHistory.length}</div>
            <p className="text-gray-400 text-sm">Total Calls</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {callHistory.filter(c => c.type === 'incoming').length}
            </div>
            <p className="text-gray-400 text-sm">Incoming</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {callHistory.filter(c => c.type === 'outgoing').length}
            </div>
            <p className="text-gray-400 text-sm">Outgoing</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">
              {callHistory.filter(c => c.type === 'missed').length}
            </div>
            <p className="text-gray-400 text-sm">Missed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCallHistory;
