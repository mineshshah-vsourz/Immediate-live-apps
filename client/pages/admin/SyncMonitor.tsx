import { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Download,
  Filter,
  Search,
  Calendar,
  Users,
  Building2,
  FileText,
  Database,
  Zap,
  Activity,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncJob {
  id: string;
  objectType: 'agenda' | 'speakers' | 'exhibitors' | 'users' | 'content';
  status: 'pending' | 'running' | 'success' | 'failed' | 'retry';
  source: 'wordpress' | 'manual' | 'scheduled';
  startTime: string;
  endTime?: string;
  duration?: number;
  recordsProcessed: number;
  recordsTotal: number;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

interface SyncLog {
  id: string;
  jobId: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: any;
}

const mockSyncJobs: SyncJob[] = [
  {
    id: 'job-1',
    objectType: 'agenda',
    status: 'success',
    source: 'wordpress',
    startTime: '2024-03-15T10:30:00Z',
    endTime: '2024-03-15T10:32:15Z',
    duration: 135,
    recordsProcessed: 48,
    recordsTotal: 48,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'job-2',
    objectType: 'speakers',
    status: 'failed',
    source: 'scheduled',
    startTime: '2024-03-15T10:15:00Z',
    endTime: '2024-03-15T10:16:30Z',
    duration: 90,
    recordsProcessed: 12,
    recordsTotal: 45,
    errorMessage: 'API rate limit exceeded',
    retryCount: 2,
    maxRetries: 3
  },
  {
    id: 'job-3',
    objectType: 'exhibitors',
    status: 'running',
    source: 'manual',
    startTime: '2024-03-15T10:35:00Z',
    recordsProcessed: 15,
    recordsTotal: 42,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'job-4',
    objectType: 'users',
    status: 'pending',
    source: 'wordpress',
    startTime: '2024-03-15T10:40:00Z',
    recordsProcessed: 0,
    recordsTotal: 1247,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'job-5',
    objectType: 'content',
    status: 'retry',
    source: 'scheduled',
    startTime: '2024-03-15T10:20:00Z',
    endTime: '2024-03-15T10:21:45Z',
    duration: 105,
    recordsProcessed: 8,
    recordsTotal: 25,
    errorMessage: 'Connection timeout',
    retryCount: 1,
    maxRetries: 3
  }
];

const mockSyncLogs: SyncLog[] = [
  {
    id: 'log-1',
    jobId: 'job-1',
    timestamp: '2024-03-15T10:30:15Z',
    level: 'info',
    message: 'Starting agenda sync from WordPress',
    details: { endpoint: '/wp-json/wp/v2/sessions', method: 'GET' }
  },
  {
    id: 'log-2',
    jobId: 'job-1',
    timestamp: '2024-03-15T10:31:00Z',
    level: 'info',
    message: 'Processing 48 session records',
  },
  {
    id: 'log-3',
    jobId: 'job-1',
    timestamp: '2024-03-15T10:32:15Z',
    level: 'info',
    message: 'Agenda sync completed successfully',
    details: { recordsUpdated: 12, recordsCreated: 3, recordsSkipped: 33 }
  },
  {
    id: 'log-4',
    jobId: 'job-2',
    timestamp: '2024-03-15T10:15:30Z',
    level: 'error',
    message: 'API rate limit exceeded',
    details: { rateLimitReset: '2024-03-15T10:20:00Z', statusCode: 429 }
  },
  {
    id: 'log-5',
    jobId: 'job-3',
    timestamp: '2024-03-15T10:35:15Z',
    level: 'info',
    message: 'Manual exhibitor sync initiated by admin user',
  }
];

const objectTypeIcons = {
  agenda: Calendar,
  speakers: Users,
  exhibitors: Building2,
  users: Users,
  content: FileText
};

const objectTypeLabels = {
  agenda: 'Agenda & Sessions',
  speakers: 'Speakers',
  exhibitors: 'Exhibitors',
  users: 'Users',
  content: 'Content Pages'
};

export default function SyncMonitor() {
  const [syncJobs, setSyncJobs] = useState(mockSyncJobs);
  const [syncLogs, setSyncLogs] = useState(mockSyncLogs);
  const [selectedJob, setSelectedJob] = useState<SyncJob | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Update running jobs
      setSyncJobs(prev => 
        prev.map(job => {
          if (job.status === 'running') {
            const progress = Math.min(job.recordsProcessed + Math.floor(Math.random() * 3), job.recordsTotal);
            return { ...job, recordsProcessed: progress };
          }
          return job;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const triggerManualSync = (objectType: string) => {
    const newJob: SyncJob = {
      id: `job-${Date.now()}`,
      objectType: objectType as any,
      status: 'pending',
      source: 'manual',
      startTime: new Date().toISOString(),
      recordsProcessed: 0,
      recordsTotal: Math.floor(Math.random() * 100) + 10,
      retryCount: 0,
      maxRetries: 3
    };

    setSyncJobs(prev => [newJob, ...prev]);

    // Simulate job progression
    setTimeout(() => {
      setSyncJobs(prev => 
        prev.map(job => 
          job.id === newJob.id ? { ...job, status: 'running' } : job
        )
      );
    }, 1000);
  };

  const retryJob = (jobId: string) => {
    setSyncJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              status: 'pending',
              retryCount: job.retryCount + 1,
              startTime: new Date().toISOString(),
              recordsProcessed: 0
            } 
          : job
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'retry':
        return <RotateCcw className="w-5 h-5 text-warning" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'failed':
        return 'text-destructive';
      case 'running':
        return 'text-blue-500';
      case 'retry':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredJobs = syncJobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesType = filterType === 'all' || job.objectType === filterType;
    const matchesSearch = searchQuery === '' || 
      objectTypeLabels[job.objectType].toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const jobLogs = selectedJob ? syncLogs.filter(log => log.jobId === selectedJob.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sync Engine Monitor</h1>
          <p className="text-muted-foreground">Monitor WordPress integration and data synchronization</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors",
              autoRefresh 
                ? "bg-primary text-primary-foreground border-primary" 
                : "border-border text-foreground hover:bg-muted"
            )}
          >
            {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoRefresh ? 'Pause' : 'Resume'} Auto-refresh</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* Sync Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['success', 'failed', 'running', 'pending', 'retry'].map(status => {
          const count = syncJobs.filter(job => job.status === status).length;
          return (
            <div key={status} className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status)}
                <div>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className={cn("text-sm capitalize", getStatusColor(status))}>{status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Sync Triggers */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Manual Sync Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Object.entries(objectTypeLabels).map(([type, label]) => {
            const Icon = objectTypeIcons[type as keyof typeof objectTypeIcons];
            const isRunning = syncJobs.some(job => job.objectType === type && job.status === 'running');
            
            return (
              <button
                key={type}
                onClick={() => triggerManualSync(type)}
                disabled={isRunning}
                className={cn(
                  "flex flex-col items-center space-y-2 p-4 rounded-lg border border-border transition-colors",
                  isRunning 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <Icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-foreground">{label}</span>
                {isRunning && (
                  <span className="text-xs text-blue-500">Syncing...</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sync Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Sync Queue</h2>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {syncJobs.filter(job => job.status === 'running').length} running
                  </span>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search sync jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="running">Running</option>
                  <option value="pending">Pending</option>
                  <option value="retry">Retry</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {Object.entries(objectTypeLabels).map(([type, label]) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredJobs.map(job => {
                const Icon = objectTypeIcons[job.objectType];
                const progress = job.recordsTotal > 0 ? (job.recordsProcessed / job.recordsTotal) * 100 : 0;
                
                return (
                  <div
                    key={job.id}
                    className="p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Icon className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-foreground">
                              {objectTypeLabels[job.objectType]}
                            </h3>
                            <span className={cn("text-xs px-2 py-1 rounded-full", 
                              job.source === 'manual' ? "bg-blue-100 text-blue-800" :
                              job.source === 'scheduled' ? "bg-green-100 text-green-800" :
                              "bg-purple-100 text-purple-800"
                            )}>
                              {job.source}
                            </span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-2">
                            Started: {formatTimestamp(job.startTime)}
                            {job.duration && (
                              <span> • Duration: {formatDuration(job.duration)}</span>
                            )}
                          </div>
                          
                          {job.status === 'running' && (
                            <div className="mb-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{job.recordsProcessed}/{job.recordsTotal}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {job.errorMessage && (
                            <p className="text-sm text-destructive">{job.errorMessage}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        {job.status === 'failed' && job.retryCount < job.maxRetries && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              retryJob(job.id);
                            }}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="Retry"
                          >
                            <RotateCcw className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                          }}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sync Job Details */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedJob ? 'Job Details' : 'Select a Job'}
            </h2>
          </div>
          
          {selectedJob ? (
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedJob.status)}
                    <span className={cn("text-sm capitalize", getStatusColor(selectedJob.status))}>
                      {selectedJob.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Object Type</span>
                  <span className="text-sm text-foreground">{objectTypeLabels[selectedJob.objectType]}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="text-sm text-foreground capitalize">{selectedJob.source}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Records</span>
                  <span className="text-sm text-foreground">
                    {selectedJob.recordsProcessed}/{selectedJob.recordsTotal}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Retries</span>
                  <span className="text-sm text-foreground">
                    {selectedJob.retryCount}/{selectedJob.maxRetries}
                  </span>
                </div>
                
                {selectedJob.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm text-foreground">
                      {formatDuration(selectedJob.duration)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Logs */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Logs</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {jobLogs.map(log => (
                    <div key={log.id} className="text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className={cn("uppercase font-medium", getLogLevelColor(log.level))}>
                          {log.level}
                        </span>
                      </div>
                      <p className="text-foreground mt-1">{log.message}</p>
                      {log.details && (
                        <pre className="text-muted-foreground mt-1 bg-muted/50 p-1 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Select a sync job from the queue to view details and logs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
