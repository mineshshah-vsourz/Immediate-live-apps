import { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Ticket,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  ExternalLink,
  Calendar,
  Building2,
  Eye,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  dismissed: boolean;
  action?: {
    label: string;
    link: string;
  };
}

interface QuickLink {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  badge?: string;
}

const mockMetrics: MetricCard[] = [
  {
    id: 'active-users',
    title: 'Active Users Today',
    value: 1247,
    change: 12.5,
    changeType: 'increase',
    icon: Users,
    description: 'Users active in last 24h',
    color: 'bg-blue-500'
  },
  {
    id: 'ticket-scans',
    title: 'Ticket Scans',
    value: 892,
    change: -3.2,
    changeType: 'decrease',
    icon: Ticket,
    description: 'Scanned today',
    color: 'bg-purple-500'
  },
  {
    id: 'notifications',
    title: 'Push Notifications',
    value: 15,
    change: 25.0,
    changeType: 'increase',
    icon: MessageSquare,
    description: 'Sent in last hour',
    color: 'bg-orange-500'
  },
  {
    id: 'sessions',
    title: 'Live Sessions',
    value: 3,
    change: 0,
    changeType: 'neutral',
    icon: Activity,
    description: 'Currently streaming',
    color: 'bg-red-500'
  },
  {
    id: 'exhibitors',
    title: 'Exhibitor Booths',
    value: 42,
    change: 5.0,
    changeType: 'increase',
    icon: Building2,
    description: 'Active booths',
    color: 'bg-indigo-500'
  }
];

const mockAlerts: Alert[] = [
  {
    id: 'alert-2',
    type: 'error',
    title: 'Push Notification Failed',
    message: 'Session reminder notification failed to send to 23 users.',
    timestamp: '12 minutes ago',
    dismissed: false,
    action: {
      label: 'Retry Send',
      link: '/admin/messaging'
    }
  },
  {
    id: 'alert-3',
    type: 'info',
    title: 'High Traffic Detected',
    message: 'App usage is 180% above normal. Consider scaling resources.',
    timestamp: '1 hour ago',
    dismissed: false
  },
  {
    id: 'alert-4',
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily backup of user data completed successfully.',
    timestamp: '2 hours ago',
    dismissed: true
  }
];

const mockQuickLinks: QuickLink[] = [
  {
    id: 'event-management',
    title: 'Event Management',
    description: 'Create and manage events',
    icon: Calendar,
    link: '/admin/events'
  },
  {
    id: 'exhibitor-management',
    title: 'Exhibitor Management',
    description: 'Manage exhibitors and booths',
    icon: Building2,
    link: '/admin/exhibitors'
  },
  {
    id: 'speaker-management',
    title: 'Speaker Management',
    description: 'Manage speakers and profiles',
    icon: Users,
    link: '/admin/speakers'
  }
];

export default function AdminDashboard() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedEvent, setSelectedEvent] = useState('the-stitch-festival');
  const [refreshing, setRefreshing] = useState(false);

  const [recentActivities, setRecentActivities] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/admin/recent-activity');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setRecentActivities(data.activities || []);
        } else {
          setRecentActivities(null);
        }
      } catch (e) {
        setRecentActivities(null);
      }
    };
    fetchRecent();
    return () => { mounted = false; };
  }, []);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-destructive bg-destructive/10 text-destructive';
      case 'warning':
        return 'border-warning bg-warning/10 text-warning';
      case 'success':
        return 'border-success bg-success/10 text-success';
      default:
        return 'border-info bg-info/10 text-info';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor platform activity and system health</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="the-stitch-festival">The Stitch Festival March 2026</option>
            <option value="craft-expo-2026">Craft Expo Spring 2026</option>
            <option value="textile-fair">Textile Fair 2026</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={refreshing}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
              refreshing && "opacity-50 cursor-not-allowed"
            )}
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          {activeAlerts.slice(0, 3).map(alert => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div key={alert.id} className={cn("border rounded-lg p-4", getAlertColor(alert.type))}>
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <span className="text-xs opacity-75">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm opacity-90">{alert.message}</p>
                    {alert.action && (
                      <NavLink
                        to={alert.action.link}
                        className="inline-flex items-center space-x-1 text-sm font-medium mt-2 hover:underline"
                      >
                        <span>{alert.action.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </NavLink>
                    )}
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-xs px-2 py-1 rounded hover:bg-black/10 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", metric.color)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  {metric.changeType !== 'neutral' && (
                    <div className={cn(
                      "flex items-center space-x-1 text-sm",
                      metric.changeType === 'increase' ? "text-success" : "text-destructive"
                    )}>
                      {metric.changeType === 'increase' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{metric.title}</h3>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockQuickLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.id}
                to={link.link}
                className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">System Status</h2>
          <div className="space-y-4">
            {[
              { name: 'API Gateway', status: 'operational', uptime: '99.9%' },
              { name: 'Database', status: 'operational', uptime: '99.8%' },
              { name: 'Push Service', status: 'degraded', uptime: '97.2%' },
              { name: 'File Storage', status: 'operational', uptime: '100%' },
              { name: 'WordPress Sync', status: 'operational', uptime: '98.9%' }
            ].map(service => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    service.status === 'operational' ? "bg-success" :
                    service.status === 'degraded' ? "bg-warning" : "bg-destructive"
                  )} />
                  <span className="text-foreground">{service.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">{service.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            <NavLink to="/admin/users" className="text-sm text-primary hover:underline">
              View All
            </NavLink>
          </div>
          <div className="space-y-3">
            {(recentActivities && recentActivities.length > 0 ? recentActivities : [
              {
                action: 'User registered',
                details: 'jane.smith@email.com joined The Stitch Festival',
                time: '2 minutes ago',
                icon: Users
              },
              {
                action: 'Content updated',
                details: 'Workshop "Slow Stitching: Hand-Technique" updated',
                time: '15 minutes ago',
                icon: Calendar
              },
              {
                action: 'Ticket scanned',
                details: 'VIP ticket validated at registration',
                time: '23 minutes ago',
                icon: Ticket
              }
            ]).map((event: any, index: number) => {
              const Icon = event.icon || Users;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{event.action}</p>
                    <p className="text-xs text-muted-foreground">{event.details}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
