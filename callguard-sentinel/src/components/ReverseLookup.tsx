import React, { useState, useEffect } from 'react';
import { Search, Phone, MapPin, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { CallerDatabaseService, CallerRecord } from '../data/callerDatabase';
import { formatPhoneNumber, getTimeAgo } from '../lib/utils';
import { RiskIndicator, CallerRiskCard } from './ui/RiskIndicator';
import { GlassCard, NeonButton } from './ui/NeonButton';

export const ReverseLookup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CallerRecord[]>([]);
  const [selectedCaller, setSelectedCaller] = useState<CallerRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const callerService = CallerDatabaseService.getInstance();

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('lookupHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await callerService.search(searchQuery);
      setSearchResults(results);
      
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('lookupHistory', JSON.stringify(newHistory));
      
      // Auto-select first result if only one
      if (results.length === 1) {
        setSelectedCaller(results[0]);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportCaller = async (phoneNumber: string) => {
    const reportType = prompt('Report type:', 'scam');
    const description = prompt('Description:', 'Suspicious call');
    
    if (reportType && description) {
      try {
        const updatedCaller = await callerService.reportCaller(
          phoneNumber,
          reportType as any,
          description,
          'current_user'
        );
        
        // Update the caller in results
        setSearchResults(prev => 
          prev.map(caller => 
            caller.phoneNumber === phoneNumber ? updatedCaller : caller
          )
        );
        
        if (selectedCaller?.phoneNumber === phoneNumber) {
          setSelectedCaller(updatedCaller);
        }
        
        alert('Report submitted successfully!');
      } catch (error) {
        console.error('Report failed:', error);
        alert('Failed to submit report');
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Animated Background */}
      <div className="animated-bg" />
      <div className="particles">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Reverse Number Lookup
          </h1>
          <p className="text-gray-400 text-lg">
            Search any phone number to reveal caller identity and risk assessment
          </p>
        </div>

        {/* Search Bar */}
        <GlassCard className="p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter phone number or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <NeonButton
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search'}
            </NeonButton>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Recent Searches:</p>
              <div className="flex gap-2 flex-wrap">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(query)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-gray-300 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Search Results ({searchResults.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {searchResults.map((caller) => (
                <CallerRiskCard
                  key={caller.id}
                  {...caller}
                  onClick={() => setSelectedCaller(caller)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </div>
        )}

        {/* Detailed Caller Information */}
        {selectedCaller && (
          <GlassCard className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {selectedCaller.name ? selectedCaller.name.charAt(0).toUpperCase() : selectedCaller.phoneNumber.slice(-2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCaller.name || 'Unknown Caller'}
                  </h3>
                  <p className="text-gray-400">{formatPhoneNumber(selectedCaller.phoneNumber)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <RiskIndicator
                      level={selectedCaller.riskLevel}
                      score={selectedCaller.riskScore}
                      showDetails
                    />
                    {selectedCaller.verifiedBusiness && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Verified Business</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <NeonButton
                variant="warning"
                size="sm"
                onClick={() => handleReportCaller(selectedCaller.phoneNumber)}
              >
                Report Caller
              </NeonButton>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Caller Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Caller Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Caller Type</p>
                      <p className="text-white capitalize">{selectedCaller.type}</p>
                    </div>
                  </div>
                  
                  {selectedCaller.businessCategory && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Business Category</p>
                        <p className="text-white">{selectedCaller.businessCategory}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedCaller.scamType && (
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Scam Type</p>
                        <p className="text-red-400">{selectedCaller.scamType}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedCaller.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-white">
                          {selectedCaller.location.city && `${selectedCaller.location.city}, `}
                          {selectedCaller.location.state && `${selectedCaller.location.state}, `}
                          {selectedCaller.location.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Report Statistics */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Report Statistics</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Total Reports</p>
                      <p className="text-white font-bold">{selectedCaller.reportCount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Last Reported</p>
                      <p className="text-white">
                        {selectedCaller.lastReported 
                          ? getTimeAgo(selectedCaller.lastReported)
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {selectedCaller.associatedNumbers && selectedCaller.associatedNumbers.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Associated Numbers</p>
                      <div className="space-y-1">
                        {selectedCaller.associatedNumbers.map((number, index) => (
                          <p key={index} className="text-white text-sm">
                            {formatPhoneNumber(number)}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            {selectedCaller.reports.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Reports</h4>
                <div className="space-y-3">
                  {selectedCaller.reports.slice(0, 3).map((report) => (
                    <div key={report.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium capitalize">
                            {report.reportType}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {report.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">
                            {getTimeAgo(report.timestamp)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Confidence: {Math.round(report.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default ReverseLookup;
