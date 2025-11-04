import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Building2, 
  Map,
  MessageCircle,
  Ticket,
  Bell,
  Play,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Zap,
  ChevronRight,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quickLinks = [
  { to: '/agenda', label: 'Event Agenda', icon: Calendar, description: 'View all sessions and schedule', color: 'bg-blue-500' },
  { to: '/speakers', label: 'Speakers', icon: Users, description: 'Browse speaker profiles', color: 'bg-green-500' },
  { to: '/exhibitors', label: 'Exhibitors', icon: Building2, description: 'Explore exhibitor booths', color: 'bg-purple-500' },
  { to: '/floor-plan', label: 'Floor Plan', icon: Map, description: 'Interactive venue map', color: 'bg-orange-500' },
  { to: '/messages', label: 'Messages', icon: MessageCircle, description: 'Chat with attendees', color: 'bg-pink-500' },
  { to: '/tickets', label: 'My Tickets', icon: Ticket, description: 'View your event passes', color: 'bg-indigo-500' },
];

const notifications = [
  {
    id: 1,
    type: 'session',
    title: 'Workshop starting in 15 minutes',
    message: 'Hand-Stitching Techniques - Main Studio',
    time: '2 min ago',
    urgent: true
  },
  {
    id: 2,
    type: 'message',
    title: 'New message from Attendee',
    message: 'Thanks for connecting! Looking forward to our chat.',
    time: '10 min ago',
    urgent: false
  },
  {
    id: 3,
    type: 'exhibitor',
    title: 'Fabric Godmother booth update',
    message: 'New fabric samples available at booth #23',
    time: '1 hour ago',
    urgent: false
  }
];

const upcomingSessions = [
  {
    id: 1,
    title: 'Hand-Stitching Techniques: The Fundamentals',
    speaker: 'Angela Daymond',
    time: '14:30 - 15:30',
    room: 'Main Studio',
    inSchedule: true,
    isNext: true
  },
  {
    id: 2,
    title: 'Textile Design Workshop: Color Theory & Patterns',
    speaker: 'Bridgitte Garnett',
    time: '16:00 - 17:00',
    room: 'Studio Hall B',
    inSchedule: false,
    isNext: false
  },
  {
    id: 3,
    title: 'Dressmaking for Beginners: Pattern to Perfect Fit',
    speaker: 'Claire Tyler',
    time: '17:30 - 18:30',
    room: 'Studio Room A',
    inSchedule: true,
    isNext: false
  }
];

const sponsors = [
  {
    id: 1,
    name: 'Fabric Godmother',
    logo: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=80&h=80&fit=crop',
    tier: 'Platinum',
    booth: '23',
    featured: true
  },
  {
    id: 2,
    name: 'Higgs & Higgs',
    logo: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=80&h=80&fit=crop',
    tier: 'Gold',
    booth: '15',
    featured: false
  },
  {
    id: 3,
    name: 'Lili Fabrics',
    logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=80&h=80&fit=crop',
    tier: 'Silver',
    booth: '08',
    featured: false
  }
];


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Event Dashboard</h1>
          <p className="text-primary-foreground/80">The Stitch Festival March 2026 • Day 2 of 3</p>
        </div>

        {/* Quick Links Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", link.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {link.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Key Notifications</h2>
            <button className="text-sm text-primary hover:text-primary/80">View All</button>
          </div>
          
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "bg-card rounded-xl border p-4",
                  notification.urgent ? "border-destructive bg-destructive/5" : "border-border"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    notification.urgent ? "bg-destructive" : "bg-muted-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Upcoming Sessions</h2>
            <NavLink to="/my-schedule" className="text-sm text-primary hover:text-primary/80">My Schedule</NavLink>
          </div>
          
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground">{session.title}</h3>
                      {session.isNext && (
                        <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">Next</span>
                      )}
                      {session.inSchedule && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">by {session.speaker}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{session.time}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{session.room}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm hover:bg-primary/90">
                      Join
                    </button>
                    {!session.inSchedule && (
                      <button className="border border-border text-foreground px-3 py-1 rounded-lg text-sm hover:bg-muted">
                        Add to Schedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsor Spotlights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Sponsor Spotlights</h2>
            <NavLink to="/exhibitors" className="text-sm text-primary hover:text-primary/80">View All</NavLink>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{sponsor.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        sponsor.tier === 'Platinum' ? "bg-gray-200 text-gray-800" :
                        sponsor.tier === 'Gold' ? "bg-yellow-200 text-yellow-800" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        {sponsor.tier}
                      </span>
                      <span className="text-xs text-muted-foreground">Booth #{sponsor.booth}</span>
                    </div>
                  </div>
                  {sponsor.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm hover:bg-primary/90">
                    Visit Booth
                  </button>
                  <button className="border border-border text-foreground px-3 py-2 rounded-lg text-sm hover:bg-muted">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-sm text-muted-foreground">Sessions Attended</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <User className="w-8 h-8 text-info mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">8</div>
            <div className="text-sm text-muted-foreground">New Connections</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Building2 className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">5</div>
            <div className="text-sm text-muted-foreground">Booths Visited</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">15</div>
            <div className="text-sm text-muted-foreground">Engagement Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
