import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Phone, 
  Shield, 
  AlertTriangle, 
  Filter,
  Plus,
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'verified' | 'blocked' | 'unknown';
  lastCall?: string;
  notes?: string;
}

const ProfessionalContacts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'blocked' | 'unknown'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'date'>('name');

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      risk: 'low',
      status: 'verified',
      lastCall: '2 hours ago',
      notes: 'Family friend'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+1-555-0456',
      email: 'jane.smith@email.com',
      risk: 'medium',
      status: 'verified',
      lastCall: '1 day ago',
      notes: 'Work colleague'
    },
    {
      id: '3',
      name: 'Unknown Caller',
      phone: '+1-900-7890',
      risk: 'high',
      status: 'blocked',
      lastCall: '3 days ago',
      notes: 'Suspicious telemarketer'
    },
    {
      id: '4',
      name: 'Bank Support',
      phone: '+1-800-555-0123',
      email: 'support@bank.com',
      risk: 'low',
      status: 'verified',
      lastCall: '1 week ago',
      notes: 'Official bank number'
    },
    {
      id: '5',
      name: 'IRS Scammer',
      phone: '+1-888-999-0000',
      risk: 'critical',
      status: 'blocked',
      lastCall: '2 weeks ago',
      notes: 'IRS impersonation scam'
    },
    {
      id: '6',
      name: 'Tech Support',
      phone: '+1-877-555-0456',
      risk: 'medium',
      status: 'unknown',
      lastCall: '1 month ago',
      notes: 'Unknown tech support'
    }
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'risk-critical';
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-low';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'blocked': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || contact.risk === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'risk':
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return riskOrder[a.risk] - riskOrder[b.risk];
      case 'date':
        return 0; // Would need actual date sorting
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
          <p className="text-gray-400">Manage your contact list with risk assessment</p>
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
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="professional-input pl-10 w-full"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="professional-input"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="blocked">Blocked</option>
                <option value="unknown">Unknown</option>
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="professional-input"
              >
                <option value="name">Sort by Name</option>
                <option value="risk">Sort by Risk</option>
                <option value="date">Sort by Date</option>
              </select>

              <button className="professional-btn">
                <Plus className="w-4 h-4" />
                Add Contact
              </button>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="professional-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Risk Level</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Call</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{contact.name}</p>
                          {contact.email && (
                            <p className="text-gray-400 text-sm">{contact.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{contact.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(contact.risk)}`}>
                        {contact.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(contact.status)}
                        <span className="text-gray-300 capitalize">{contact.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-400 text-sm">{contact.lastCall}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="professional-btn success py-1 px-2">
                          <Phone className="w-3 h-3" />
                        </button>
                        <button className="professional-btn secondary py-1 px-2">
                          <MoreVertical className="w-3 h-3" />
                        </button>
                        {contact.status !== 'blocked' && (
                          <button className="professional-btn danger py-1 px-2">
                            <Ban className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedContacts.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No contacts found</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="professional-grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-white mb-1">{contacts.length}</div>
            <p className="text-gray-400 text-sm">Total Contacts</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {contacts.filter(c => c.status === 'verified').length}
            </div>
            <p className="text-gray-400 text-sm">Verified</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">
              {contacts.filter(c => c.status === 'blocked').length}
            </div>
            <p className="text-gray-400 text-sm">Blocked</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {contacts.filter(c => c.risk === 'high' || c.risk === 'critical').length}
            </div>
            <p className="text-gray-400 text-sm">High Risk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalContacts;
