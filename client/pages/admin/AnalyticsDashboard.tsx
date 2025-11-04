import { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Building2,
  Activity,
  Clock,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  dailyUsers: { date: string; users: number; }[];
  sessionViews: { session: string; views: number; }[];
  exhibitorClicks: { exhibitor: string; clicks: number; }[];
  deviceTypes: { device: string; count: number; percentage: number; }[];
  topContent: { title: string; type: string; views: number; engagement: number; }[];
}

const mockAnalytics: AnalyticsData = {
  dailyUsers: [
    { date: '2024-03-10', users: 234 },
    { date: '2024-03-11', users: 456 },
    { date: '2024-03-12', users: 789 },
    { date: '2024-03-13', users: 892 },
    { date: '2024-03-14', users: 1123 },
    { date: '2024-03-15', users: 1247 },
    { date: '2024-03-16', users: 983 }
  ],
  sessionViews: [
    { session: 'Slow Stitching: Hand-Technique', views: 1247 },
    { session: 'Couture Tailoring Workshop', views: 892 },
    { session: 'Quick Project Workshop', views: 756 },
    { session: 'Mixed-Media Makers', views: 634 },
    { session: 'Rag-Rug Techniques', views: 523 }
  ],
  exhibitorClicks: [
    { exhibitor: 'Fabric Godmother', clicks: 456 },
    { exhibitor: 'Higgs & Higgs', clicks: 234 },
    { exhibitor: 'Lili Fabrics', clicks: 189 },
    { exhibitor: 'TOFT', clicks: 167 },
    { exhibitor: 'Barnyarns', clicks: 145 }
  ],
  deviceTypes: [
    { device: 'Mobile', count: 847, percentage: 68 },
    { device: 'Desktop', count: 278, percentage: 22 },
    { device: 'Tablet', count: 122, percentage: 10 }
  ],
  topContent: [
    { title: 'Event Schedule', type: 'page', views: 2345, engagement: 85 },
    { title: 'Speaker Profiles', type: 'page', views: 1892, engagement: 72 },
    { title: 'Exhibitor Directory', type: 'page', views: 1567, engagement: 68 },
    { title: 'My Schedule', type: 'feature', views: 1234, engagement: 91 },
    { title: 'Networking', type: 'feature', views: 987, engagement: 76 }
  ]
};

export default function AnalyticsDashboard() {
  const [analytics] = useState(mockAnalytics);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedEvent, setSelectedEvent] = useState('the-stitch-festival');
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalUsers = () => analytics.dailyUsers.reduce((sum, day) => sum + day.users, 0);
  const getAverageUsers = () => Math.round(getTotalUsers() / analytics.dailyUsers.length);
  const getUserGrowth = () => {
    const recent = analytics.dailyUsers.slice(-3).reduce((sum, day) => sum + day.users, 0) / 3;
    const previous = analytics.dailyUsers.slice(-6, -3).reduce((sum, day) => sum + day.users, 0) / 3;
    return Math.round(((recent - previous) / previous) * 100);
  };

  const maxUsers = Math.max(...analytics.dailyUsers.map(d => d.users));
  const maxViews = Math.max(...analytics.sessionViews.map(s => s.views));
  const maxClicks = Math.max(...analytics.exhibitorClicks.map(e => e.clicks));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">App usage analytics and engagement insights</p>
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
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
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
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{getTotalUsers().toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-success">+{getUserGrowth()}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{analytics.sessionViews.reduce((sum, s) => sum + s.views, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Session Views</p>
              <p className="text-xs text-muted-foreground">{getAverageUsers()} avg/day</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{analytics.exhibitorClicks.reduce((sum, e) => sum + e.clicks, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Exhibitor Clicks</p>
              <p className="text-xs text-muted-foreground">5 active booths</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">78%</p>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-success">+5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Users Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Daily Active Users</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last 7 days</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {analytics.dailyUsers.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-muted-foreground">
                  {formatDate(day.date)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{day.users} users</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((day.users / maxUsers) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(day.users / maxUsers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Device Types</h2>
          
          <div className="space-y-4">
            {analytics.deviceTypes.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    index === 0 ? "bg-blue-500" :
                    index === 1 ? "bg-green-500" : "bg-purple-500"
                  )} />
                  <span className="text-sm font-medium">{device.device}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{device.count}</p>
                  <p className="text-xs text-muted-foreground">{device.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-2">
            {analytics.deviceTypes.map((device, index) => (
              <div key={device.device} className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      index === 0 ? "bg-blue-500" :
                      index === 1 ? "bg-green-500" : "bg-purple-500"
                    )}
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8">
                  {device.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sessions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Top Sessions</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {analytics.sessionViews.map((session, index) => (
              <div key={session.session} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.session}</p>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-muted rounded-full h-1 mr-2">
                      <div 
                        className="bg-primary h-1 rounded-full"
                        style={{ width: `${(session.views / maxViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{session.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Exhibitors */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Top Exhibitors</h2>
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {analytics.exhibitorClicks.map((exhibitor, index) => (
              <div key={exhibitor.exhibitor} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-green-100 text-green-800 text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{exhibitor.exhibitor}</p>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-muted rounded-full h-1 mr-2">
                      <div 
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: `${(exhibitor.clicks / maxClicks) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{exhibitor.clicks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Content */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Top Content</h2>
            <Eye className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {analytics.topContent.map((content, index) => (
              <div key={content.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      content.type === 'page' ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                    )}>
                      {content.type}
                    </span>
                    <p className="text-sm font-medium">{content.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{content.views}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-1">
                    <div 
                      className="bg-orange-500 h-1 rounded-full"
                      style={{ width: `${content.engagement}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{content.engagement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Detailed Analytics</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Page/Feature</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Views</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Unique Users</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Avg. Time</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Bounce Rate</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { page: 'Home Screen', views: 2847, users: 1247, time: '2:34', bounce: '23%', engagement: 85 },
                { page: 'Agenda', views: 2345, users: 1156, time: '3:45', bounce: '18%', engagement: 78 },
                { page: 'Speakers', views: 1892, users: 934, time: '2:12', bounce: '34%', engagement: 72 },
                { page: 'Exhibitors', views: 1567, users: 823, time: '1:56', bounce: '28%', engagement: 68 },
                { page: 'My Schedule', views: 1234, users: 756, time: '4:23', bounce: '12%', engagement: 91 },
                { page: 'Messages', views: 987, users: 456, time: '3:12', bounce: '15%', engagement: 76 },
                { page: 'Floor Plan', views: 834, users: 623, time: '1:34', bounce: '42%', engagement: 64 }
              ].map((item, index) => (
                <tr key={item.page} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{item.page}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.users.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.time}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.bounce}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full",
                            item.engagement >= 80 ? "bg-success" :
                            item.engagement >= 60 ? "bg-warning" : "bg-destructive"
                          )}
                          style={{ width: `${item.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground">{item.engagement}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
