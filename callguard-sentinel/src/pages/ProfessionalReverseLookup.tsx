import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Shield, 
  AlertTriangle, 
  Clock,
  MapPin,
  User,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface LookupResult {
  phone: string;
  name?: string;
  location?: string;
  carrier?: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  reports: number;
  lastReport?: string;
  description?: string;
  categories?: string[];
}

const ProfessionalReverseLookup: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    '+1-555-0123',
    '+1-800-555-0456',
    '+1-900-7890'
  ]);

  const [lookupResults, setLookupResults] = useState<LookupResult[]>([
    {
      phone: '+1-555-0123',
      name: 'John Doe',
      location: 'New York, NY',
      carrier: 'Verizon',
      risk: 'low',
      reports: 0,
      lastReport: 'Never',
      description: 'Legitimate personal number',
      categories: ['Personal', 'Verified']
    },
    {
      phone: '+1-800-555-0456',
      name: 'Bank of America',
      location: 'Charlotte, NC',
      carrier: 'AT&T',
      risk: 'low',
      reports: 0,
      lastReport: 'Never',
      description: 'Official bank customer service',
      categories: ['Banking', 'Business', 'Verified']
    },
    {
      phone: '+1-900-7890',
      name: 'Unknown',
      location: 'Unknown',
      carrier: 'Unknown',
      risk: 'high',
      reports: 127,
      lastReport: '2 hours ago',
      description: 'Premium rate number with multiple spam reports',
      categories: ['Spam', 'Scam', 'Premium Rate']
    }
  ]);

  const handleSearch = () => {
    if (!phoneNumber.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult: LookupResult = {
        phone: phoneNumber,
        name: phoneNumber.includes('800') ? 'Business Number' : 'Unknown',
        location: 'Unknown',
        carrier: 'Unknown',
        risk: phoneNumber.includes('900') ? 'high' : phoneNumber.includes('800') ? 'low' : 'medium',
        reports: Math.floor(Math.random() * 100),
        lastReport: 'Recently',
        description: 'Number lookup completed',
        categories: phoneNumber.includes('900') ? ['Spam', 'Scam'] : ['Unknown']
      };

      setLookupResults([mockResult, ...lookupResults]);
      
      if (!searchHistory.includes(phoneNumber)) {
        setSearchHistory([phoneNumber, ...searchHistory.slice(0, 4)]);
      }
      
      setIsSearching(false);
    }, 1500);
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
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen professional-bg">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reverse Number Lookup</h1>
          <p className="text-gray-400">Identify unknown callers and assess potential risks</p>
        </div>

        {/* Search Section */}
        <div className="professional-card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter phone number (e.g., +1-555-0123)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="professional-input pl-10 w-full text-lg"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!phoneNumber.trim() || isSearching}
              className="professional-btn py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Lookup Number
                </>
              )}
            </button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Recent Searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((number, index) => (
                  <button
                    key={index}
                    onClick={() => setPhoneNumber(number)}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {lookupResults.map((result, index) => (
            <div key={index} className="professional-card">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-xl font-semibold text-white">{result.phone}</span>
                        {getRiskIcon(result.risk)}
                      </div>
                      {result.name && (
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{result.name}</span>
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getRiskColor(result.risk)}`}>
                      {result.risk.toUpperCase()} RISK
                    </span>
                  </div>

                  {result.description && (
                    <p className="text-gray-300 mb-4">{result.description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{result.location}</span>
                      </div>
                    )}
                    {result.carrier && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{result.carrier}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{result.reports} reports</span>
                    </div>
                    {result.lastReport && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">Last: {result.lastReport}</span>
                      </div>
                    )}
                  </div>

                  {result.categories && result.categories.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {result.categories.map((category, catIndex) => (
                          <span
                            key={catIndex}
                            className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:w-48">
                  <div className="space-y-3">
                    <button className="professional-btn success w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Number
                    </button>
                    <button className="professional-btn secondary w-full">
                      <Flag className="w-4 h-4 mr-2" />
                      Report Number
                    </button>
                    <button className="professional-btn w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Block Number
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="professional-grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-white mb-1">{lookupResults.length}</div>
            <p className="text-gray-400 text-sm">Total Lookups</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {lookupResults.filter(r => r.risk === 'low').length}
            </div>
            <p className="text-gray-400 text-sm">Safe Numbers</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {lookupResults.filter(r => r.risk === 'medium').length}
            </div>
            <p className="text-gray-400 text-sm">Suspicious</p>
          </div>
          <div className="professional-card text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">
              {lookupResults.filter(r => r.risk === 'high' || r.risk === 'critical').length}
            </div>
            <p className="text-gray-400 text-sm">Dangerous</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReverseLookup;
