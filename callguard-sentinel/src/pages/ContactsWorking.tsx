import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Phone, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Plus, 
  Filter,
  Download,
  Upload,
  UserCheck,
  Ban,
  Star
} from 'lucide-react';
import { GlassCard, NeonButton } from '../components/ui/NeonButton';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import { formatPhoneNumber, getTimeAgo, getRiskLevel, getRiskColor } from '../lib/utils';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  avatar?: string;
  notes?: string;
  lastContact?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  tags: string[];
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'date'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'blocked' | 'verified'>('all');
  const [showSensitive, setShowSensitive] = useState(false);

  // Mock contacts with risk scores
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'John Smith',
      phone: '+1-555-0123',
      email: 'john.smith@email.com',
      riskScore: 0.15,
      riskLevel: 'low',
      avatar: '👤',
      isVerified: true,
      tags: ['family', 'work'],
      lastContact: '2 days ago',
      notes: 'Met at conference'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+1-555-0456',
      email: 'sarah.johnson@email.com',
      riskScore: 0.05,
      riskLevel: 'low',
      avatar: '👩',
      isVerified: true,
      tags: ['family', 'friends'],
      lastContact: '1 week ago',
      notes: 'Birthday party'
    },
    {
      id: '3',
      name: 'Unknown Caller',
      phone: '+1-555-0789',
      riskScore: 0.95,
      riskLevel: 'critical',
      avatar: '⚠️',
      isVerified: false,
      isBlocked: true,
      tags: ['scam', 'fraud'],
      lastContact: 'Just now',
      notes: 'IRS impersonation scam'
    },
    {
      id: '4',
      name: 'Bank Support',
      phone: '+1-800-1234',
      riskScore: 0.45,
      riskLevel: 'medium',
      avatar: '🏦',
      isVerified: true,
      tags: ['business', 'verified'],
      lastContact: '3 days ago',
      notes: 'Legitimate banking inquiry'
    },
    {
      id: '5',
      name: 'Tech Support',
      phone: '+1-555-0999',
      riskScore: 0.85,
      riskLevel: 'high',
      avatar: '🔧',
      isVerified: false,
      tags: ['scam', 'tech', 'suspicious'],
      lastContact: '2 hours ago',
      notes: 'Fake Microsoft support scam'
    },
    {
      id: '6',
      name: 'Mom',
      phone: '+1-555-0111',
      email: 'mom@email.com',
      riskScore: 0.05,
      riskLevel: 'low',
      avatar: '❤️',
      isVerified: true,
      tags: ['family', 'trusted'],
      lastContact: 'Yesterday',
      notes: 'Family contact'
    },
    {
      id: '7',
      name: 'Office',
      phone: '+1-555-0222',
      email: 'office@company.com',
      riskScore: 0.25,
      riskLevel: 'low',
      avatar: '🏢',
      isVerified: true,
      tags: ['business', 'work'],
      lastContact: '1 month ago',
      notes: 'Office main line'
    }
  ];

  useEffect(() => {
    setContacts(mockContacts);
  }, []);

  useEffect(() => {
    let filtered = mockContacts;
    
    // Apply search filter
    if (searchQuery) {
      filtered = mockContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterBy === 'blocked') {
      filtered = filtered.filter(contact => contact.isBlocked);
    } else if (filterBy === 'verified') {
      filtered = filtered.filter(contact => contact.isVerified);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'risk') {
        return b.riskScore - a.riskScore;
      } else if (sortBy === 'date') {
        return new Date(b.lastContact || '0').getTime() - new Date(a.lastContact || '0').getTime();
      }
      return 0;
    });
    
    setFilteredContacts(filtered);
  }, [searchQuery, sortBy, filterBy]);

  const handleAddContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      riskLevel: getRiskLevel(contact.riskScore || 0),
      isVerified: contact.isVerified || false
    };
    
    setContacts(prev => [...prev, newContact]);
    setShowAddModal(false);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    if (editingContact) {
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id ? { ...editingContact, ...c } : c
      ));
      setEditingContact(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  const handleBlockContact = (id: string) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, isBlocked: true } : c
    ));
  };

  const handleUnblockContact = (id: string) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, isBlocked: false } : c
    ));
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const getContactStats = () => {
    const total = contacts.length;
    const blocked = contacts.filter(c => c.isBlocked).length;
    const verified = contacts.filter(c => c.isVerified).length;
    const highRisk = contacts.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length;
    
    return { total, blocked, verified, highRisk };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/20" />
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${20 + Math.random() * 15}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Contacts</h1>
              <p className="text-gray-400 text-lg">Manage your contact list with risk scoring</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-medium">
                  {getContactStats().total} Contacts
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">{getContactStats().blocked} Blocked</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">{getContactStats().verified} Verified</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className={`p-2 rounded-lg transition-colors ${
                showSensitive 
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' 
                  : 'bg-gray-500/20 border border-gray-500/50 text-gray-400 hover:bg-gray-500/30'
              }`}
            >
              {showSensitive ? <Users className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              <span className="text-sm">{showSensitive ? 'Hide' : 'Show'} Sensitive</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/20 transition-all"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="name">Sort by Name</option>
                <option value="risk">Sort by Risk</option>
                <option value="date">Sort by Date</option>
              </select>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">All Contacts</option>
                <option value="blocked">Blocked</option>
                <option value="verified">Verified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Contact Button */}
        <div className="mb-6">
          <NeonButton
            onClick={() => setShowAddModal(true)}
            className="w-full justify-start"
          >
            <Plus className="w-5 h-5" />
            Add New Contact
          </NeonButton>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 ${
                contact.isBlocked ? 'opacity-60' : ''
              }`}
            >
              {/* Background */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${
                  contact.riskLevel === 'critical' ? 'from-red-500 to-red-700' :
                  contact.riskLevel === 'high' ? 'from-orange-500 to-red-600' :
                  contact.riskLevel === 'medium' ? 'from-yellow-500 to-orange-600' :
                  'from-green-500 to-emerald-600'
                } opacity-90
              `} />
              
              {/* Content */}
              <div className="relative p-6 z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                      <span className="text-xl">
                        {contact.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">{contact.name}</h3>
                        {contact.isVerified && (
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {contact.isBlocked && (
                          <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                            <Ban className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <RiskIndicator
                        level={contact.riskLevel}
                        score={contact.riskScore}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    {formatPhoneNumber(contact.phone)}
                  </div>
                  <div className="flex items-center gap-2">
                    {contact.lastContact && (
                      <Clock className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-gray-500 text-sm">
                      {contact.lastContact ? getTimeAgo(contact.lastContact) : 'Never'}
                    </span>
                  </div>
                </div>
                
                {contact.email && (
                  <div className="text-gray-400 text-sm mt-1">
                    {contact.email}
                  </div>
                )}
                
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {contact.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {contact.notes && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-300 text-sm">{contact.notes}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleSelectContact(contact)}
                  className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  View
                </button>
                
                <button
                  onClick={() => handleEditContact(contact)}
                  className="p-2 bg-gray-500/20 border border-gray-500/50 rounded-lg text-gray-400 hover:bg-gray-500/30 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                
                <button
                  onClick={() => contact.isBlocked ? handleUnblockContact(contact.id) : handleBlockContact(contact.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    contact.isBlocked 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30' 
                      : 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {contact.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                  <span>{contact.isBlocked ? 'Unblock' : 'Block'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
