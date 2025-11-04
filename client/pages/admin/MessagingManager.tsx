import { useState } from 'react';
import { 
  MessageSquare,
  Send,
  Clock,
  Users,
  TrendingUp,
  Eye,
  Plus,
  Filter,
  Search,
  Calendar,
  Bell,
  Target,
  BarChart3,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all' | 'delegates' | 'exhibitors' | 'speakers' | 'custom';
  customSegment?: string;
  deliveryType: 'push' | 'inbox' | 'both';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledDate?: string;
  sentDate?: string;
  createdBy: string;
  createdAt: string;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
  cta?: {
    text: string;
    url: string;
  };
  priority: 'low' | 'normal' | 'high';
}

interface NotificationTemplate {
  id: string;
  name: string;
  category: 'session_reminder' | 'schedule_update' | 'networking' | 'emergency' | 'general';
  title: string;
  body: string;
  defaultAudience: string;
  usageCount: number;
}

const mockNotifications: PushNotification[] = [
  {
    id: 'notif-1',
    title: 'Workshop Starting Soon',
    body: 'Hand-Stitching Techniques workshop starts in 15 minutes in Main Hall',
    targetAudience: 'delegates',
    deliveryType: 'push',
    status: 'sent',
    sentDate: '2024-03-15T09:45:00Z',
    createdBy: 'System',
    createdAt: '2024-03-15T09:30:00Z',
    stats: {
      sent: 847,
      delivered: 832,
      opened: 456,
      clicked: 123
    },
    cta: {
      text: 'View Workshop',
      url: '/workshop/hand-stitching'
    },
    priority: 'high'
  },
  {
    id: 'notif-2',
    title: 'Networking Reception Tonight',
    body: 'Join us for an exclusive VIP networking reception at 6 PM. Light refreshments will be provided.',
    targetAudience: 'all',
    deliveryType: 'both',
    status: 'scheduled',
    scheduledDate: '2024-03-15T15:00:00Z',
    createdBy: 'Marketing Team',
    createdAt: '2024-03-15T08:20:00Z',
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    },
    cta: {
      text: 'RSVP Now',
      url: '/networking-rsvp'
    },
    priority: 'normal'
  },
  {
    id: 'notif-3',
    title: 'Schedule Update',
    body: 'Due to high demand, the Dressmaking for Beginners workshop has been moved to Studio Hall A.',
    targetAudience: 'delegates',
    deliveryType: 'inbox',
    status: 'sent',
    sentDate: '2024-03-15T08:15:00Z',
    createdBy: 'Event Team',
    createdAt: '2024-03-15T08:10:00Z',
    stats: {
      sent: 1247,
      delivered: 1247,
      opened: 892,
      clicked: 234
    },
    priority: 'high'
  },
  {
    id: 'notif-4',
    title: 'Welcome to The Stitch Festival',
    body: 'Welcome! Download the app to access your schedule, connect with fellow craft enthusiasts, and more.',
    targetAudience: 'all',
    deliveryType: 'push',
    status: 'failed',
    createdBy: 'Admin',
    createdAt: '2024-03-14T18:00:00Z',
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    },
    priority: 'normal'
  }
];

const mockTemplates: NotificationTemplate[] = [
  {
    id: 'template-1',
    name: 'Workshop Reminder',
    category: 'session_reminder',
    title: 'Workshop Starting Soon',
    body: '{session_title} starts in {time_remaining} in {location}',
    defaultAudience: 'delegates',
    usageCount: 45
  },
  {
    id: 'template-2',
    name: 'Schedule Change',
    category: 'schedule_update',
    title: 'Schedule Update',
    body: 'Important change to your schedule: {change_details}',
    defaultAudience: 'all',
    usageCount: 12
  },
  {
    id: 'template-3',
    name: 'Networking Event',
    category: 'networking',
    title: 'Networking Opportunity',
    body: 'Join us for {event_name} at {time}. {additional_details}',
    defaultAudience: 'delegates',
    usageCount: 8
  },
  {
    id: 'template-4',
    name: 'Emergency Alert',
    category: 'emergency',
    title: 'Emergency Notice',
    body: 'URGENT: {emergency_details}. Please follow instructions from event staff.',
    defaultAudience: 'all',
    usageCount: 1
  }
];

export default function MessagingManager() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [templates] = useState(mockTemplates);
  const [selectedNotification, setSelectedNotification] = useState<PushNotification | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'analytics'>('notifications');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAudience, setFilterAudience] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    targetAudience: 'all' as PushNotification['targetAudience'],
    deliveryType: 'push' as PushNotification['deliveryType'],
    priority: 'normal' as PushNotification['priority'],
    scheduledDate: '',
    cta: { text: '', url: '' }
  });

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || notif.status === filterStatus;
    const matchesAudience = filterAudience === 'all' || notif.targetAudience === filterAudience;
    
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-success text-success-foreground';
      case 'scheduled':
        return 'bg-blue-500 text-white';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-yellow-500 text-yellow-900';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryTypeIcon = (type: string) => {
    switch (type) {
      case 'push':
        return <Bell className="w-4 h-4" />;
      case 'inbox':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  const handleSendNotification = () => {
    const newNotification: PushNotification = {
      id: `notif-${Date.now()}`,
      title: formData.title,
      body: formData.body,
      targetAudience: formData.targetAudience,
      deliveryType: formData.deliveryType,
      status: formData.scheduledDate ? 'scheduled' : 'sent',
      scheduledDate: formData.scheduledDate || undefined,
      sentDate: formData.scheduledDate ? undefined : new Date().toISOString(),
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      stats: {
        sent: formData.scheduledDate ? 0 : Math.floor(Math.random() * 1000) + 500,
        delivered: 0,
        opened: 0,
        clicked: 0
      },
      cta: formData.cta.text ? formData.cta : undefined,
      priority: formData.priority
    };

    setNotifications(prev => [newNotification, ...prev]);
    setShowCreateModal(false);
    setFormData({
      title: '',
      body: '',
      targetAudience: 'all',
      deliveryType: 'push',
      priority: 'normal',
      scheduledDate: '',
      cta: { text: '', url: '' }
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

  const calculateOpenRate = (stats: PushNotification['stats']) => {
    if (stats.delivered === 0) return 0;
    return Math.round((stats.opened / stats.delivered) * 100);
  };

  const calculateClickRate = (stats: PushNotification['stats']) => {
    if (stats.opened === 0) return 0;
    return Math.round((stats.clicked / stats.opened) * 100);
  };

  const loadTemplate = (template: NotificationTemplate) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      body: template.body,
      targetAudience: template.defaultAudience as any
    }));
  };

  // Calculate total stats
  const totalStats = notifications.reduce((acc, notif) => ({
    sent: acc.sent + notif.stats.sent,
    delivered: acc.delivered + notif.stats.delivered,
    opened: acc.opened + notif.stats.opened,
    clicked: acc.clicked + notif.stats.clicked
  }), { sent: 0, delivered: 0, opened: 0, clicked: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messaging & Notifications</h1>
          <p className="text-muted-foreground">Manage push notifications and in-app messages</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Send className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStats.sent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStats.delivered.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStats.opened.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Opened</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalStats.delivered > 0 ? Math.round((totalStats.opened / totalStats.delivered) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Open Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-border">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'templates', label: 'Templates', icon: Copy },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
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
                  <option value="sent">Sent</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="failed">Failed</option>
                </select>
                
                <select
                  value={filterAudience}
                  onChange={(e) => setFilterAudience(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Audiences</option>
                  <option value="delegates">Delegates</option>
                  <option value="exhibitors">Exhibitors</option>
                  <option value="speakers">Speakers</option>
                </select>
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {filteredNotifications.map(notification => (
                  <div key={notification.id} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{notification.title}</h3>
                          <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(notification.status))}>
                            {notification.status}
                          </span>
                          <span className={cn("text-xs px-2 py-1 rounded-full", getPriorityColor(notification.priority))}>
                            {notification.priority}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getDeliveryTypeIcon(notification.deliveryType)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {notification.deliveryType}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{notification.body}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span>Target: {notification.targetAudience}</span>
                          <span>By: {notification.createdBy}</span>
                          {notification.sentDate && (
                            <span>Sent: {formatDateTime(notification.sentDate)}</span>
                          )}
                          {notification.scheduledDate && (
                            <span>Scheduled: {formatDateTime(notification.scheduledDate)}</span>
                          )}
                        </div>
                        
                        {notification.status === 'sent' && notification.stats.sent > 0 && (
                          <div className="flex items-center space-x-6 mt-2 text-sm">
                            <span className="text-muted-foreground">
                              Sent: <span className="font-medium text-foreground">{notification.stats.sent}</span>
                            </span>
                            <span className="text-muted-foreground">
                              Opened: <span className="font-medium text-foreground">{notification.stats.opened}</span>
                              <span className="text-success ml-1">({calculateOpenRate(notification.stats)}%)</span>
                            </span>
                            {notification.stats.clicked > 0 && (
                              <span className="text-muted-foreground">
                                Clicked: <span className="font-medium text-foreground">{notification.stats.clicked}</span>
                                <span className="text-success ml-1">({calculateClickRate(notification.stats)}%)</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedNotification(notification)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {notification.status === 'scheduled' && (
                          <button
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                        <button
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Notification Templates</h3>
                <button className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create Template</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div key={template.id} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{template.name}</h4>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full capitalize">
                          {template.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Used {template.usageCount} times
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-foreground">{template.title}</p>
                      <p className="text-sm text-muted-foreground">{template.body}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          loadTemplate(template);
                          setShowCreateModal(true);
                        }}
                        className="flex-1 bg-primary text-primary-foreground py-2 px-3 rounded text-sm hover:bg-primary/90 transition-colors"
                      >
                        Use Template
                      </button>
                      <button className="p-2 rounded hover:bg-muted transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Notification Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-4">Performance by Type</h4>
                  <div className="space-y-3">
                    {['push', 'inbox', 'both'].map(type => {
                      const typeNotifs = notifications.filter(n => n.deliveryType === type);
                      const typeStats = typeNotifs.reduce((acc, n) => ({
                        sent: acc.sent + n.stats.sent,
                        opened: acc.opened + n.stats.opened
                      }), { sent: 0, opened: 0 });
                      const openRate = typeStats.sent > 0 ? Math.round((typeStats.opened / typeStats.sent) * 100) : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getDeliveryTypeIcon(type)}
                            <span className="capitalize">{type}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{openRate}%</p>
                            <p className="text-xs text-muted-foreground">{typeStats.sent} sent</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map(notification => (
                      <div key={notification.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {notification.sentDate ? formatDateTime(notification.sentDate) : 'Scheduled'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{notification.stats.opened}</p>
                          <p className="text-xs text-muted-foreground">opens</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Create Notification</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Notification title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Body</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({...formData, body: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Notification message"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Target Audience</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value as any})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="delegates">Delegates</option>
                      <option value="exhibitors">Exhibitors</option>
                      <option value="speakers">Speakers</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Delivery Type</label>
                    <select
                      value={formData.deliveryType}
                      onChange={(e) => setFormData({...formData, deliveryType: e.target.value as any})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="push">Push Only</option>
                      <option value="inbox">Inbox Only</option>
                      <option value="both">Push + Inbox</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Schedule (Optional)</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">CTA Text (Optional)</label>
                    <input
                      type="text"
                      value={formData.cta.text}
                      onChange={(e) => setFormData({
                        ...formData, 
                        cta: {...formData.cta, text: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Button text"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">CTA URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.cta.url}
                      onChange={(e) => setFormData({
                        ...formData, 
                        cta: {...formData.cta, url: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{formData.scheduledDate ? 'Schedule' : 'Send'} Notification</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
