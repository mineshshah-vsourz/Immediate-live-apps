import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { 
  Calendar, 
  Users, 
  Building2, 
  Play, 
  Star,
  ChevronRight,
  MapPin,
  Clock,
  Ticket,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const events = [
  {
    id: 1,
    name: "The Stitch Festival March 2026",
    date: "March 20-22, 2026",
    location: "London Convention Centre",
    status: "live",
    attendees: 1000,
    sessions: 50,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Craft Expo Spring 2026",
    date: "March 21, 2026",
    location: "Manchester Arena",
    status: "upcoming",
    attendees: 850,
    sessions: 30,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Textile Symposium 2026",
    date: "May 22-24, 2026",
    location: "Birmingham ICC",
    status: "registration",
    attendees: 650,
    sessions: 28,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop"
  }
];

const quickActions = [
  { label: "Dashboard", icon: Zap, to: "/dashboard", color: "bg-primary" },
  { label: "My Agenda", icon: Calendar, to: "/agenda", color: "bg-blue-500" },
  { label: "Speakers", icon: Users, to: "/speakers", color: "bg-green-500" },
  { label: "Exhibitors", icon: Building2, to: "/exhibitors", color: "bg-purple-500" },
];

const featuredSessions = [
  {
    id: 1,
    title: "Hand-Stitching Techniques: The Fundamentals",
    speaker: "Angela Daymond",
    time: "14:30 - 15:30",
    room: "Main Studio",
    attendees: 340,
    featured: true
  },
  {
    id: 2,
    title: "Textile Design Workshop: Color Theory & Patterns",
    speaker: "Bridgitte Garnett",
    time: "16:00 - 17:00",
    room: "Studio Hall B",
    attendees: 220,
    featured: false
  },
  {
    id: 3,
    title: "Dressmaking for Beginners: Pattern to Perfect Fit",
    speaker: "Claire Tyler",
    time: "10:00 - 11:00",
    room: "Studio Room A",
    attendees: 180,
    featured: false
  }
];

export default function Index() {
  const { selectedEvent } = useEvent();

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Event Selected</h1>
          <p className="text-muted-foreground mb-6">Please select an event to continue.</p>
          <NavLink
            to="/event-selection"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            Select Event
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Welcome Section - Mobile Optimized */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-2xl text-primary-foreground p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">Welcome Back!</h1>
              <p className="text-primary-foreground/80 text-sm">Ready for today's sessions?</p>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80">Live Now</div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs opacity-80">Sessions</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="text-center bg-primary-foreground/10 rounded-lg p-3">
              <div className="text-lg font-bold">{selectedEvent.attendees}</div>
              <div className="text-xs opacity-80">Attendees</div>
            </div>
            <div className="text-center bg-primary-foreground/10 rounded-lg p-3">
              <div className="text-lg font-bold">{selectedEvent.sessions}</div>
              <div className="text-xs opacity-80">Sessions</div>
            </div>
            <div className="text-center bg-primary-foreground/10 rounded-lg p-3">
              <div className="text-lg font-bold">12</div>
              <div className="text-xs opacity-80">Exhibitors</div>
            </div>
          </div>
        </div>

        {/* Current Event Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Current Event</h2>
            <NavLink to="/event-selection" className="text-sm text-primary hover:text-primary/80">Change Event</NavLink>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start space-x-4">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{selectedEvent.name}</h3>
                  {selectedEvent.status === 'live' && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                      Live
                    </span>
                  )}
                  {selectedEvent.status === 'upcoming' && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Upcoming</span>
                  )}
                  {selectedEvent.status === 'registration' && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Open</span>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{selectedEvent.date}</span>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{selectedEvent.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <NavLink
                  key={action.label}
                  to={action.to}
                  className="bg-card rounded-xl p-4 border border-border active:scale-95 transition-all group"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", action.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-foreground text-sm group-active:text-primary transition-colors">{action.label}</h3>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Featured Sessions - Mobile Optimized */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Featured Sessions</h2>
            <NavLink to="/agenda" className="text-sm text-primary font-medium">View All</NavLink>
          </div>

          <div className="space-y-3">
            {featuredSessions.map((session) => (
              <div key={session.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <div className="flex items-start space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground text-sm leading-tight flex-1">{session.title}</h3>
                      {session.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">by {session.speaker}</p>

                    {/* Session Details - Mobile Stack */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1.5" />{session.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1.5" />{session.room}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1.5" />{session.attendees} attending
                      </div>
                    </div>
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium active:scale-95 transition-transform">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Ticket className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">2</div>
            <div className="text-xs text-muted-foreground">My Tickets</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Award className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">3</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
}
