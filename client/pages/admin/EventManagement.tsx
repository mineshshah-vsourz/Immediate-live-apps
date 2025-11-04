import { useState } from 'react';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import {
  Calendar,
  MapPin,
  Users,
  Settings,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  Upload,
  Share2,
  Copy,
  ExternalLink,
  Clock,
  Building2,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Palette,
  Image,
  Globe,
  Mail,
  Phone,
  MoreVertical,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventStats {
  registrations: number;
  sessions: number;
  speakers: number;
  exhibitors: number;
  tickets_sold: number;
  revenue: number;
  check_ins: number;
  engagement_rate: number;
}

export default function EventManagement() {
  const { selectedEvent, availableEvents } = useEvent();
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'settings' | 'analytics'>('overview');
  const [showEventModal, setShowEventModal] = useState(false);

  const mockEventStats: { [key: string]: EventStats } = {
    'the-stitch-festival': {
      registrations: 1000,
      sessions: 50,
      speakers: 5,
      exhibitors: 5,
      tickets_sold: 1000,
      revenue: 156240,
      check_ins: 420,
      engagement_rate: 72
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-600 bg-green-50 border-green-200';
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'registration': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ended': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      case 'registration': return 'Registration Open';
      case 'ended': return 'Ended';
      default: return status;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Manage events, branding, and configurations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button 
            onClick={() => setShowEventModal(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Current Event Overview */}
      {selectedEvent && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-bold text-foreground">{selectedEvent.name}</h2>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(selectedEvent.status)
                  )}>
                    {getStatusLabel(selectedEvent.status)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{selectedEvent.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {selectedEvent.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {selectedEvent.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {selectedEvent.attendees.toLocaleString()} expected
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-muted rounded-lg">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg">
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          {selectedEvent.id in mockEventStats && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Primary KPIs */}
                {['registrations','tickets_sold','revenue','check_ins'].map((k) => {
                  const v = (mockEventStats[selectedEvent.id] as any)[k];
                  return (
                    <div key={k} className="bg-background p-4 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-1 uppercase">{k.replace('_',' ')}</div>
                      <div className="text-3xl font-extrabold text-foreground">{k === 'revenue' ? `£${v.toLocaleString()}` : v.toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>

              {/* Secondary stats */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                <div className="text-center p-2">
                  <div className="font-semibold text-foreground">{mockEventStats[selectedEvent.id].sessions}</div>
                  <div>Sessions</div>
                </div>
                <div className="text-center p-2">
                  <div className="font-semibold text-foreground">{mockEventStats[selectedEvent.id].speakers}</div>
                  <div>Speakers</div>
                </div>
                <div className="text-center p-2">
                  <div className="font-semibold text-foreground">{mockEventStats[selectedEvent.id].exhibitors}</div>
                  <div>Exhibitors</div>
                </div>
                <div className="text-center p-2">
                  <div className="font-semibold text-foreground">{mockEventStats[selectedEvent.id].engagement_rate}%</div>
                  <div>Engagement</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* All Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableEvents.map((event) => {
              const stats = mockEventStats[event.id];
              return (
                <div key={event.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        getStatusColor(event.status)
                      )}>
                        {getStatusLabel(event.status)}
                      </span>
                    </div>
                    {selectedEvent?.id === event.id && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1.5 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-2">{event.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    {stats && (
                      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">{stats.registrations}</div>
                          <div className="text-muted-foreground">Registered</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">£{stats.revenue.toLocaleString()}</div>
                          <div className="text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <NavLink to={`/admin/events`} className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm hover:bg-primary/90 text-center">
                        Manage
                      </NavLink>
                      <NavLink to={`/admin/speakers`} className="bg-card border border-border px-3 py-2 rounded-lg text-sm hover:bg-muted flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Speakers</span>
                      </NavLink>
                      <button className="p-2 hover:bg-muted rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'branding' && selectedEvent && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Scheme */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Color Scheme</h3>
              <div className="space-y-4">
                {[
                  { label: 'Primary Color', value: selectedEvent.branding.primaryColor, key: 'primaryColor' },
                  { label: 'Secondary Color', value: selectedEvent.branding.secondaryColor, key: 'secondaryColor' },
                  { label: 'Accent Color', value: selectedEvent.branding.accentColor, key: 'accentColor' }
                ].map((color) => (
                  <div key={color.key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">{color.label}</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <input
                        type="text"
                        value={color.value}
                        className="w-24 px-2 py-1 text-xs border border-border rounded font-mono"
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                Update Colors
              </button>
            </div>

            {/* Logo & Assets */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Logo & Assets</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Event Logo</label>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedEvent.branding.logo} 
                      alt="Event Logo"
                      className="w-16 h-16 rounded-lg border border-border object-cover"
                    />
                    <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload New</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hero Image</label>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedEvent.branding.heroImage} 
                      alt="Hero Image"
                      className="w-16 h-10 rounded-lg border border-border object-cover"
                    />
                    <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload New</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Organizer Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={selectedEvent.organizer.name}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={selectedEvent.organizer.contact}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    readOnly
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedEvent.organizer.logo} 
                    alt="Organizer Logo"
                    className="w-12 h-12 rounded border border-border object-cover"
                  />
                  <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Update Logo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Branding Preview</h3>
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-lg text-white"
                  style={{ backgroundColor: selectedEvent.branding.primaryColor }}
                >
                  <h4 className="font-bold">{selectedEvent.name}</h4>
                  <p className="text-sm opacity-90">{selectedEvent.location}</p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: selectedEvent.branding.secondaryColor }}
                  ></div>
                  <div>
                    <p className="font-medium text-foreground">Secondary elements</p>
                    <p className="text-sm text-muted-foreground">Navigation, buttons</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: selectedEvent.branding.accentColor }}
                  ></div>
                  <div>
                    <p className="font-medium text-foreground">Accent elements</p>
                    <p className="text-sm text-muted-foreground">Highlights, badges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && selectedEvent && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Event Name</label>
                  <input
                    type="text"
                    value={selectedEvent.name}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={selectedEvent.description}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                    <input
                      type="text"
                      value={selectedEvent.date}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <input
                      type="text"
                      value={selectedEvent.location}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Settings */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Registration Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Registration Open</label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Require Approval</label>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Send Welcome Email</label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Max Attendees</label>
                  <input
                    type="number"
                    value={selectedEvent.attendees}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/80">
              Cancel
            </button>
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && selectedEvent && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {selectedEvent.id in mockEventStats && Object.entries(mockEventStats[selectedEvent.id]).map(([key, value]) => (
              <div key={key} className="bg-card rounded-xl border border-border p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {key === 'revenue' ? `£${value.toLocaleString()}` : value.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace('_', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Registration Trend</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Metrics</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
