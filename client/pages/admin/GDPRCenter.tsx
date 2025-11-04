import { useState } from 'react';
import { 
  Shield,
  Download,
  FileText,
  Users,
  Calendar,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Upload,
  Server,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  consentCategories: {
    category: string;
    granted: boolean;
    timestamp: string;
  }[];
  ipAddress: string;
  userAgent: string;
  source: 'registration' | 'app' | 'website' | 'email';
  policyVersion: string;
  timestamp: string;
  lastUpdated: string;
}

interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
}

interface ExportJob {
  id: string;
  type: 'consent_records' | 'user_data' | 'analytics' | 'full_export';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'csv' | 'json' | 'xml';
  filters: {
    dateFrom: string;
    dateTo: string;
    categories?: string[];
    users?: string[];
  };
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  fileUrl?: string;
  fileSize?: string;
  recordCount?: number;
}

const mockConsentRecords: ConsentRecord[] = [
  {
    id: 'consent-1',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    consentCategories: [
      { category: 'essential', granted: true, timestamp: '2024-03-15T09:00:00Z' },
      { category: 'marketing', granted: false, timestamp: '2024-03-15T09:00:00Z' },
      { category: 'analytics', granted: true, timestamp: '2024-03-15T09:00:00Z' },
      { category: 'third_party', granted: false, timestamp: '2024-03-15T09:00:00Z' }
    ],
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    source: 'app',
    policyVersion: '2024.1',
    timestamp: '2024-03-15T09:00:00Z',
    lastUpdated: '2024-03-15T09:00:00Z'
  },
  {
    id: 'consent-2',
    userId: 'user-2',
    userName: 'Angela Daymond',
    userEmail: 'angela@stitchfestival.com',
    consentCategories: [
      { category: 'essential', granted: true, timestamp: '2024-03-14T14:30:00Z' },
      { category: 'marketing', granted: true, timestamp: '2024-03-14T14:30:00Z' },
      { category: 'analytics', granted: true, timestamp: '2024-03-14T14:30:00Z' },
      { category: 'third_party', granted: false, timestamp: '2024-03-14T14:30:00Z' }
    ],
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    source: 'registration',
    policyVersion: '2024.1',
    timestamp: '2024-03-14T14:30:00Z',
    lastUpdated: '2024-03-14T14:30:00Z'
  },
  {
    id: 'consent-3',
    userId: 'user-3',
    userName: 'Mike Wilson',
    userEmail: 'mike@stitchfestival.com',
    consentCategories: [
      { category: 'essential', granted: true, timestamp: '2024-03-13T11:20:00Z' },
      { category: 'marketing', granted: true, timestamp: '2024-03-13T11:20:00Z' },
      { category: 'analytics', granted: false, timestamp: '2024-03-13T11:20:00Z' },
      { category: 'third_party', granted: true, timestamp: '2024-03-13T11:20:00Z' }
    ],
    ipAddress: '172.16.0.25',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    source: 'website',
    policyVersion: '2024.1',
    timestamp: '2024-03-13T11:20:00Z',
    lastUpdated: '2024-03-13T11:20:00Z'
  }
];

const mockConsentCategories: ConsentCategory[] = [
  {
    id: 'essential',
    name: 'Essential Services',
    description: 'Necessary for the app to function properly and provide core event services.',
    required: true,
    enabled: true,
    version: '2024.1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'marketing',
    name: 'Marketing Communications',
    description: 'Receive promotional content, event updates, and marketing materials.',
    required: false,
    enabled: true,
    version: '2024.1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'analytics',
    name: 'Analytics & Personalization',
    description: 'Help us improve your experience with personalized content and recommendations.',
    required: false,
    enabled: true,
    version: '2024.1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'third_party',
    name: 'Third-party Sharing',
    description: 'Share your data with trusted partners for enhanced services.',
    required: false,
    enabled: false,
    version: '2024.1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-01T16:45:00Z'
  }
];

const mockExportJobs: ExportJob[] = [
  {
    id: 'export-1',
    type: 'consent_records',
    status: 'completed',
    format: 'csv',
    filters: {
      dateFrom: '2024-03-01',
      dateTo: '2024-03-15',
      categories: ['marketing', 'analytics']
    },
    createdBy: 'Admin User',
    createdAt: '2024-03-15T10:00:00Z',
    completedAt: '2024-03-15T10:05:00Z',
    fileUrl: '/exports/consent_records_20240315.csv',
    fileSize: '2.4 MB',
    recordCount: 1247
  },
  {
    id: 'export-2',
    type: 'full_export',
    status: 'processing',
    format: 'json',
    filters: {
      dateFrom: '2024-01-01',
      dateTo: '2024-03-15'
    },
    createdBy: 'Data Protection Officer',
    createdAt: '2024-03-15T11:30:00Z'
  },
  {
    id: 'export-3',
    type: 'user_data',
    status: 'failed',
    format: 'csv',
    filters: {
      dateFrom: '2024-03-10',
      dateTo: '2024-03-15',
      users: ['user-1', 'user-2']
    },
    createdBy: 'Stitch Festival Team',
    createdAt: '2024-03-15T08:15:00Z'
  }
];

export default function GDPRCenter() {
  const [consentRecords] = useState(mockConsentRecords);
  const [consentCategories, setConsentCategories] = useState(mockConsentCategories);
  const [exportJobs, setExportJobs] = useState(mockExportJobs);
  const [activeTab, setActiveTab] = useState<'records' | 'categories' | 'exports' | 'reports'>('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [exportForm, setExportForm] = useState({
    type: 'consent_records' as ExportJob['type'],
    format: 'csv' as ExportJob['format'],
    dateFrom: '2024-03-01',
    dateTo: '2024-03-15',
    categories: [] as string[],
    includePersonalData: false,
    destination: 'download' as 'download' | 'sftp' | 'email'
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    required: false,
    enabled: true
  });

  const filteredRecords = consentRecords.filter(record => {
    const matchesSearch = record.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
      record.consentCategories.some(cat => cat.category === filterCategory);
    const matchesSource = filterSource === 'all' || record.source === filterSource;
    
    return matchesSearch && matchesCategory && matchesSource;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getConsentStats = () => {
    const stats = { granted: 0, denied: 0, total: 0 };
    consentRecords.forEach(record => {
      record.consentCategories.forEach(category => {
        if (!category.category.includes('essential')) {
          stats.total++;
          if (category.granted) stats.granted++;
          else stats.denied++;
        }
      });
    });
    return stats;
  };

  const handleExport = () => {
    const newExport: ExportJob = {
      id: `export-${Date.now()}`,
      ...exportForm,
      status: 'pending',
      filters: {
        dateFrom: exportForm.dateFrom,
        dateTo: exportForm.dateTo,
        categories: exportForm.categories.length > 0 ? exportForm.categories : undefined
      },
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };

    setExportJobs(prev => [newExport, ...prev]);
    setShowExportModal(false);

    // Simulate processing
    setTimeout(() => {
      setExportJobs(prev => 
        prev.map(job => 
          job.id === newExport.id 
            ? { 
                ...job, 
                status: 'processing' as const,
              }
            : job
        )
      );
    }, 1000);

    setTimeout(() => {
      setExportJobs(prev => 
        prev.map(job => 
          job.id === newExport.id 
            ? { 
                ...job, 
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                fileUrl: `/exports/${exportForm.type}_${Date.now()}.${exportForm.format}`,
                fileSize: '1.2 MB',
                recordCount: Math.floor(Math.random() * 1000) + 100
              }
            : job
        )
      );
    }, 5000);
  };

  const handleAddCategory = () => {
    const newCategory: ConsentCategory = {
      id: `category-${Date.now()}`,
      ...categoryForm,
      version: '2024.1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setConsentCategories(prev => [...prev, newCategory]);
    setShowCategoryModal(false);
    setCategoryForm({
      name: '',
      description: '',
      required: false,
      enabled: true
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const consentStats = getConsentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">GDPR & Consent Center</h1>
          <p className="text-muted-foreground">Manage consent records and data protection compliance</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{consentRecords.length}</p>
              <p className="text-sm text-muted-foreground">Consent Records</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">{consentStats.granted}</p>
              <p className="text-sm text-muted-foreground">Consents Granted</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">{consentStats.denied}</p>
              <p className="text-sm text-muted-foreground">Consents Denied</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{exportJobs.filter(j => j.status === 'completed').length}</p>
              <p className="text-sm text-muted-foreground">Exports Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-border">
          {[
            { id: 'records', label: 'Consent Records', icon: Users },
            { id: 'categories', label: 'Consent Categories', icon: Shield },
            { id: 'exports', label: 'Data Exports', icon: Download },
            { id: 'reports', label: 'Compliance Reports', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Consent Records Tab */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {consentCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Sources</option>
                  <option value="app">Mobile App</option>
                  <option value="website">Website</option>
                  <option value="registration">Registration</option>
                  <option value="email">Email</option>
                </select>
              </div>

              {/* Records Table */}
              <div className="bg-background border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left px-6 py-3 text-sm font-medium text-foreground">User</th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Consent Status</th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Source</th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Policy Version</th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Date</th>
                        <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRecords.map(record => (
                        <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{record.userName}</p>
                              <p className="text-sm text-muted-foreground">{record.userEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {record.consentCategories.map(category => (
                                <span
                                  key={category.category}
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-full",
                                    category.granted 
                                      ? "bg-success text-success-foreground" 
                                      : "bg-destructive text-destructive-foreground"
                                  )}
                                >
                                  {category.category}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm capitalize">{record.source}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm">{record.policyVersion}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(record.timestamp)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <Download className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Consent Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consentCategories.map(category => (
                  <div key={category.id} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {category.required && (
                            <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">
                              Required
                            </span>
                          )}
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            category.enabled ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {category.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <span className="text-xs text-muted-foreground">v{category.version}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <p>Created: {formatDateTime(category.createdAt)}</p>
                      <p>Updated: {formatDateTime(category.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Exports Tab */}
          {activeTab === 'exports' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {exportJobs.map(job => (
                  <div key={job.id} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(job.status)}
                          <h3 className="font-semibold text-foreground capitalize">
                            {job.type.replace('_', ' ')} Export
                          </h3>
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full uppercase">
                            {job.format}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span>Created by: {job.createdBy}</span>
                          </div>
                          <div>
                            <span>Date range: {job.filters.dateFrom} to {job.filters.dateTo}</span>
                          </div>
                          <div>
                            <span>Created: {formatDateTime(job.createdAt)}</span>
                          </div>
                        </div>
                        
                        {job.status === 'completed' && (
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-success">✓ {job.recordCount} records</span>
                            <span className="text-muted-foreground">{job.fileSize}</span>
                            <span className="text-muted-foreground">
                              Completed: {formatDateTime(job.completedAt!)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {job.status === 'completed' && (
                          <button className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">Consent Overview</h3>
                  <div className="space-y-3">
                    {consentCategories.map(category => {
                      const categoryRecords = consentRecords.flatMap(record => 
                        record.consentCategories.filter(cat => cat.category === category.id)
                      );
                      const granted = categoryRecords.filter(cat => cat.granted).length;
                      const total = categoryRecords.length;
                      const percentage = total > 0 ? Math.round((granted / total) * 100) : 0;
                      
                      return (
                        <div key={category.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{category.name}</span>
                            <span>{percentage}% ({granted}/{total})</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">Data Processing Activities</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>User Registration</span>
                      <span className="text-success">Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing Communications</span>
                      <span className="text-success">Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analytics Processing</span>
                      <span className="text-success">Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Third-party Sharing</span>
                      <span className="text-warning">Review Required</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4">Compliance Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Generate Compliance Report</h4>
                        <p className="text-sm text-muted-foreground">Full GDPR compliance assessment</p>
                      </div>
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Data Audit Trail</h4>
                        <p className="text-sm text-muted-foreground">Review all data processing activities</p>
                      </div>
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Data Retention Review</h4>
                        <p className="text-sm text-muted-foreground">Check data retention policies</p>
                      </div>
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Export Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Export Type</label>
                  <select
                    value={exportForm.type}
                    onChange={(e) => setExportForm({...exportForm, type: e.target.value as any})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="consent_records">Consent Records</option>
                    <option value="user_data">User Data</option>
                    <option value="analytics">Analytics Data</option>
                    <option value="full_export">Full Export</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Format</label>
                    <select
                      value={exportForm.format}
                      onChange={(e) => setExportForm({...exportForm, format: e.target.value as any})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                      <option value="xml">XML</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Destination</label>
                    <select
                      value={exportForm.destination}
                      onChange={(e) => setExportForm({...exportForm, destination: e.target.value as any})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="download">Download</option>
                      <option value="email">Email</option>
                      <option value="sftp">SFTP</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">From Date</label>
                    <input
                      type="date"
                      value={exportForm.dateFrom}
                      onChange={(e) => setExportForm({...exportForm, dateFrom: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">To Date</label>
                    <input
                      type="date"
                      value={exportForm.dateTo}
                      onChange={(e) => setExportForm({...exportForm, dateTo: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Categories (Optional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {consentCategories.map(category => (
                      <label key={category.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportForm.categories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExportForm({...exportForm, categories: [...exportForm.categories, category.id]});
                            } else {
                              setExportForm({...exportForm, categories: exportForm.categories.filter(c => c !== category.id)});
                            }
                          }}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Data Protection Notice</p>
                      <p className="text-muted-foreground">
                        This export may contain personal data. Ensure you have legal basis for processing and handling this data according to GDPR requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Start Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Add Consent Category</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Category name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe what this consent category covers"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={categoryForm.required}
                      onChange={(e) => setCategoryForm({...categoryForm, required: e.target.checked})}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Required consent (cannot be opted out)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={categoryForm.enabled}
                      onChange={(e) => setCategoryForm({...categoryForm, enabled: e.target.checked})}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Enabled (show to users)</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
