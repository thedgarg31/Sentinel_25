export interface CallerRecord {
  id: string;
  phoneNumber: string;
  name?: string;
  type: 'individual' | 'business' | 'scam' | 'telemarketer' | 'unknown';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  reportCount: number;
  verifiedBusiness?: boolean;
  businessCategory?: string;
  scamType?: string;
  lastReported?: string;
  reports: {
    id: string;
    userId: string;
    timestamp: string;
    reportType: 'spam' | 'scam' | 'fraud' | 'harassment' | 'telemarketer';
    description: string;
    confidence: number;
  }[];
  voiceFingerprint?: string;
  associatedNumbers?: string[];
  location?: {
    country: string;
    state?: string;
    city?: string;
  };
}

// Mock global caller database
export const mockCallerDatabase: CallerRecord[] = [
  {
    id: '1',
    phoneNumber: '+1-555-0123',
    name: 'John Smith',
    type: 'individual',
    riskLevel: 'low',
    riskScore: 0.15,
    reportCount: 0,
    verifiedBusiness: false,
    location: { country: 'US', state: 'CA', city: 'Los Angeles' },
    reports: []
  },
  {
    id: '2',
    phoneNumber: '+1-555-0456',
    name: 'Bank of America',
    type: 'business',
    riskLevel: 'low',
    riskScore: 0.05,
    reportCount: 2,
    verifiedBusiness: true,
    businessCategory: 'Banking',
    location: { country: 'US', state: 'NC', city: 'Charlotte' },
    reports: [
      {
        id: 'r1',
        userId: 'user1',
        timestamp: '2024-01-15T10:30:00Z',
        reportType: 'telemarketer',
        description: 'Marketing call about credit card',
        confidence: 0.3
      }
    ]
  },
  {
    id: '3',
    phoneNumber: '+1-555-0789',
    name: 'IRS Scam',
    type: 'scam',
    riskLevel: 'critical',
    riskScore: 0.95,
    reportCount: 342,
    scamType: 'Tax Authority Impersonation',
    lastReported: '2024-02-20T14:22:00Z',
    voiceFingerprint: 'fp_12345',
    associatedNumbers: ['+1-555-0790', '+1-555-0791', '+1-555-0792'],
    location: { country: 'US' },
    reports: [
      {
        id: 'r2',
        userId: 'user2',
        timestamp: '2024-02-20T14:22:00Z',
        reportType: 'scam',
        description: 'Claimed I owed back taxes and threatened arrest',
        confidence: 0.95
      },
      {
        id: 'r3',
        userId: 'user3',
        timestamp: '2024-02-19T16:45:00Z',
        reportType: 'fraud',
        description: 'Asked for payment via gift cards',
        confidence: 0.9
      }
    ]
  },
  {
    id: '4',
    phoneNumber: '+1-555-0999',
    name: 'Microsoft Support',
    type: 'scam',
    riskLevel: 'high',
    riskScore: 0.85,
    reportCount: 156,
    scamType: 'Tech Support Scam',
    lastReported: '2024-02-19T11:30:00Z',
    voiceFingerprint: 'fp_67890',
    associatedNumbers: ['+1-555-0998', '+1-555-0997'],
    location: { country: 'US' },
    reports: [
      {
        id: 'r4',
        userId: 'user4',
        timestamp: '2024-02-19T11:30:00Z',
        reportType: 'scam',
        description: 'Fake virus alert and remote access request',
        confidence: 0.85
      }
    ]
  },
  {
    id: '5',
    phoneNumber: '+1-800-123-4567',
    name: 'Amazon Customer Service',
    type: 'business',
    riskLevel: 'medium',
    riskScore: 0.45,
    reportCount: 23,
    verifiedBusiness: true,
    businessCategory: 'E-commerce',
    location: { country: 'US', state: 'WA', city: 'Seattle' },
    reports: [
      {
        id: 'r5',
        userId: 'user5',
        timestamp: '2024-02-18T09:15:00Z',
        reportType: 'telemarketer',
        description: 'Legitimate customer service call',
        confidence: 0.1
      }
    ]
  },
  {
    id: '6',
    phoneNumber: '+1-555-8888',
    name: 'Political Campaign',
    type: 'telemarketer',
    riskLevel: 'medium',
    riskScore: 0.6,
    reportCount: 45,
    lastReported: '2024-02-17T18:00:00Z',
    location: { country: 'US' },
    reports: [
      {
        id: 'r6',
        userId: 'user6',
        timestamp: '2024-02-17T18:00:00Z',
        reportType: 'telemarketer',
        description: 'Automated political campaign message',
        confidence: 0.7
      }
    ]
  },
  {
    id: '7',
    phoneNumber: '+1-555-9999',
    name: 'Unknown Caller',
    type: 'unknown',
    riskLevel: 'medium',
    riskScore: 0.5,
    reportCount: 12,
    lastReported: '2024-02-16T12:30:00Z',
    location: { country: 'US' },
    reports: [
      {
        id: 'r7',
        userId: 'user7',
        timestamp: '2024-02-16T12:30:00Z',
        reportType: 'spam',
        description: 'Repeated calls with no message',
        confidence: 0.4
      }
    ]
  },
  {
    id: '8',
    phoneNumber: '+1-800-555-0199',
    name: 'Social Security Administration',
    type: 'scam',
    riskLevel: 'critical',
    riskScore: 0.92,
    reportCount: 289,
    scamType: 'Government Impersonation',
    lastReported: '2024-02-20T16:45:00Z',
    voiceFingerprint: 'fp_11111',
    associatedNumbers: ['+1-800-555-0198', '+1-800-555-0197'],
    location: { country: 'US' },
    reports: [
      {
        id: 'r8',
        userId: 'user8',
        timestamp: '2024-02-20T16:45:00Z',
        reportType: 'fraud',
        description: 'SSN suspension threat and request for payment',
        confidence: 0.92
      }
    ]
  }
];

export class CallerDatabaseService {
  private static instance: CallerDatabaseService;
  private callers: Map<string, CallerRecord> = new Map();

  constructor() {
    // Initialize with mock data
    mockCallerDatabase.forEach(caller => {
      this.callers.set(caller.phoneNumber, caller);
    });
  }

  static getInstance(): CallerDatabaseService {
    if (!CallerDatabaseService.instance) {
      CallerDatabaseService.instance = new CallerDatabaseService();
    }
    return CallerDatabaseService.instance;
  }

  // Search for caller by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<CallerRecord | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const normalizedNumber = this.normalizePhoneNumber(phoneNumber);
    return this.callers.get(normalizedNumber) || null;
  }

  // Search callers by name or partial number
  async search(query: string): Promise<CallerRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const results: CallerRecord[] = [];
    const lowerQuery = query.toLowerCase();
    
    for (const caller of this.callers.values()) {
      if (
        caller.name?.toLowerCase().includes(lowerQuery) ||
        caller.phoneNumber.includes(query) ||
        caller.scamType?.toLowerCase().includes(lowerQuery)
      ) {
        results.push(caller);
      }
    }
    
    return results;
  }

  // Report a caller
  async reportCaller(
    phoneNumber: string,
    reportType: 'spam' | 'scam' | 'fraud' | 'harassment' | 'telemarketer',
    description: string,
    userId: string
  ): Promise<CallerRecord> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const normalizedNumber = this.normalizePhoneNumber(phoneNumber);
    let caller = this.callers.get(normalizedNumber);
    
    if (!caller) {
      // Create new caller record
      caller = {
        id: generateId(),
        phoneNumber: normalizedNumber,
        type: 'unknown',
        riskLevel: 'medium',
        riskScore: 0.5,
        reportCount: 0,
        reports: []
      };
      this.callers.set(normalizedNumber, caller);
    }
    
    // Add new report
    const newReport = {
      id: generateId(),
      userId,
      timestamp: new Date().toISOString(),
      reportType,
      description,
      confidence: 0.7
    };
    
    caller.reports.push(newReport);
    caller.reportCount++;
    caller.lastReported = newReport.timestamp;
    
    // Update risk assessment
    this.updateRiskAssessment(caller);
    
    return caller;
  }

  // Get top spam numbers
  async getTopSpamNumbers(limit: number = 10): Promise<CallerRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return Array.from(this.callers.values())
      .sort((a, b) => b.reportCount - a.reportCount)
      .slice(0, limit);
  }

  // Get scam statistics
  async getScamStatistics(): Promise<{
    totalReports: number;
    scamTypes: Record<string, number>;
    riskDistribution: Record<string, number>;
    recentTrends: Array<{ date: string; count: number }>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const callers = Array.from(this.callers.values());
    const totalReports = callers.reduce((sum, caller) => sum + caller.reportCount, 0);
    
    const scamTypes: Record<string, number> = {};
    const riskDistribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    callers.forEach(caller => {
      if (caller.scamType) {
        scamTypes[caller.scamType] = (scamTypes[caller.scamType] || 0) + 1;
      }
      riskDistribution[caller.riskLevel]++;
    });
    
    // Generate mock recent trends
    const recentTrends = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 20
    })).reverse();
    
    return {
      totalReports,
      scamTypes,
      riskDistribution,
      recentTrends
    };
  }

  private normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '').replace(/^1/, '+1-');
  }

  private updateRiskAssessment(caller: CallerRecord): void {
    // Calculate risk score based on reports
    const scamReports = caller.reports.filter(r => 
      r.reportType === 'scam' || r.reportType === 'fraud'
    ).length;
    
    const totalReports = caller.reports.length;
    
    if (totalReports === 0) {
      caller.riskScore = 0.1;
      caller.riskLevel = 'low';
    } else {
      caller.riskScore = Math.min(0.95, (scamReports / totalReports) * 0.8 + (totalReports / 100) * 0.2);
      
      if (caller.riskScore < 0.3) {
        caller.riskLevel = 'low';
      } else if (caller.riskScore < 0.6) {
        caller.riskLevel = 'medium';
      } else if (caller.riskScore < 0.8) {
        caller.riskLevel = 'high';
      } else {
        caller.riskLevel = 'critical';
      }
    }
    
    // Update caller type based on reports
    if (scamReports > 0) {
      caller.type = 'scam';
    } else if (caller.reports.some(r => r.reportType === 'telemarketer')) {
      caller.type = 'telemarketer';
    }
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
