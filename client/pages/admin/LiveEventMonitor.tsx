import { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { useEvent } from '@/contexts/EventContext';
import { 
  Activity,
  Users,
  Zap,
  MessageCircle,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Settings,
  Eye,
  UserCheck,
  Ticket,
  QrCode,
  TrendingUp,
  TrendingDown,
  Monitor,
  Wifi,
  WifiOff,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveSession {
  id: string;
  title: string;
  speaker: string;
  room: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'live' | 'ended' | 'delayed';
  attendees: number;
  maxCapacity: number;
  hasIssues: boolean;
}

interface SystemStatus {
  component: string;
  status: 'online' | 'warning' | 'offline';
  lastChecked: string;
  responseTime?: number;
}

const mockLiveSessions: LiveSession[] = [
  {
    id: '1',
    title: 'Hand-Stitching Techniques: The Fundamentals',
    speaker: 'Angela Daymond',
    room: 'Main Auditorium',
    startTime: '14:30',
    endTime: '15:30',
    status: 'live',
    attendees: 287,
    maxCapacity: 300,
    hasIssues: false
  },
  {
    id: '2',
    title: 'Textile Design Workshop: Color Theory & Patterns',
    speaker: 'Bridgitte Garnett',
    room: 'Studio Hall B',
    startTime: '14:30',
    endTime: '15:30',
    status: 'live',
    attendees: 156,
    maxCapacity: 200,
    hasIssues: true
  },
  {
    id: '3',
    title: 'Dressmaking for Beginners: Pattern to Perfect Fit',
    speaker: 'Claire Tyler',
    room: 'Conference Room A',
    startTime: '15:45',
    endTime: '16:45',
    status: 'scheduled',
    attendees: 0,
    maxCapacity: 150,
    hasIssues: false
  }
];

const mockSystemStatus: SystemStatus[] = [
  {
    component: 'Main Registration System',
    status: 'online',
    lastChecked: '2 minutes ago',
    responseTime: 143
  },
  {
    component: 'QR Code Scanners',
    status: 'online',
    lastChecked: '1 minute ago'
  },
  {
    component: 'Live Streaming Service',
    status: 'warning',
    lastChecked: '30 seconds ago',
    responseTime: 2341
  },
  {
    component: 'Mobile App API',
    status: 'online',
    lastChecked: '15 seconds ago',
    responseTime: 89
  },
  {
    component: 'Payment Gateway',
    status: 'online',
    lastChecked: '1 minute ago',
    responseTime: 234
  },
  {
    component: 'Email Service',
    status: 'offline',
    lastChecked: '5 minutes ago'
  }
];

export default function LiveEventMonitor() {
  const { selectedEvent } = useEvent();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-red-600 bg-red-50 border-red-200';
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ended': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'delayed': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'online': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'offline': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Zap className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'ended': return <Square className="w-4 h-4" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4" />;
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalAttendees = mockLiveSessions.reduce((sum, session) => sum + session.attendees, 0);
  const liveSessions = mockLiveSessions.filter(s => s.status === 'live').length;
  const criticalIssues = mockSystemStatus.filter(s => s.status === 'offline').length;
  const warnings = mockSystemStatus.filter(s => s.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Event Monitor</h1>
          <p className="text-muted-foreground">
            Real-time monitoring for {selectedEvent?.name || 'Current Event'} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={cn(
              "p-2 rounded-lg border",
              alertsEnabled ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
            )}
          >
            {alertsEnabled ? <Bell className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "px-4 py-2 rounded-lg border flex items-center space-x-2",
              autoRefresh ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
            )}
          >
            <RefreshCw className={cn("w-4 h-4", autoRefresh && "animate-spin")} />
            <span>Auto Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Live Sessions</p>
              <p className="text-3xl font-bold text-foreground">{liveSessions}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span>Broadcasting now</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Attendees</p>
              <p className="text-3xl font-bold text-foreground">{totalAttendees}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs last hour</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Health</p>
              <p className="text-3xl font-bold text-foreground">{6 - criticalIssues - warnings}/6</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>All critical systems online</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">QR Scans/min</p>
              <p className="text-3xl font-bold text-foreground">47</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-purple-600">
            <Activity className="w-4 h-4" />
            <span>Real-time activity</span>
          </div>
        </div>
      </div>

      {/* Live Sessions */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Live Sessions</h2>
        </div>
        <div className="p-6 space-y-4">
          {mockLiveSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(session.status)}
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(session.status)
                  )}>
                    {session.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.speaker} • {session.room} • {session.startTime} - {session.endTime}
                  </p>
                </div>
                {session.hasIssues && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {session.attendees}/{session.maxCapacity}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((session.attendees / session.maxCapacity) * 100)}% full
                  </div>
                </div>
                <div className="w-20 bg-border rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full",
                      session.attendees / session.maxCapacity > 0.9 ? "bg-red-500" : 
                      session.attendees / session.maxCapacity > 0.7 ? "bg-yellow-500" : "bg-green-500"
                    )}
                    style={{ width: `${(session.attendees / session.maxCapacity) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-background rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-background rounded-lg">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">System Status</h2>
          </div>
          <div className="p-6 space-y-3">
            {mockSystemStatus.map((system, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(system.status)}
                  <div>
                    <p className="font-medium text-foreground">{system.component}</p>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {system.lastChecked}
                      {system.responseTime && ` • ${system.responseTime}ms`}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  getStatusColor(system.status)
                )}>
                  {system.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="p-6 space-y-3">
            {[
              { time: '14:32', event: 'Workshop "Hand-Stitching Techniques" started', type: 'info' },
              { time: '14:30', event: 'Tutor check-in completed for Main Hall', type: 'success' },
              { time: '14:28', event: 'Audio issue reported in Tech Hall B', type: 'warning' },
              { time: '14:25', event: 'Batch registration: 15 new attendees', type: 'info' },
              { time: '14:23', event: 'QR scanner offline: VIP Entrance', type: 'error' },
              { time: '14:20', event: 'Live stream started for all sessions', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <span className="text-muted-foreground font-mono">{activity.time}</span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                )} />
                <span className="text-foreground">{activity.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
