import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import {
  Home,
  Calendar,
  Users,
  Building2,
  Map,
  User,
  MessageCircle,
  Ticket,
  Bell,
  Menu,
  X,
  Settings,
  Shield,
  BarChart3,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/agenda', label: 'Agenda', icon: Calendar },
  { to: '/speakers', label: 'Speakers', icon: Users },
  { to: '/exhibitors', label: 'Exhibitors', icon: Building2 },
  { to: '/floor-plan', label: 'Floor Plan', icon: Map },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/my-schedule', label: 'My Schedule', icon: Calendar },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminNavigationItems = [
  { to: '/admin', label: 'Admin Dashboard', icon: BarChart3 },
  { to: '/admin/events', label: 'Event Management', icon: Calendar },
  { to: '/admin/live', label: 'Live Monitor', icon: Activity },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/tickets', label: 'Ticketing', icon: Ticket },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { selectedEvent } = useEvent();

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center border border-border p-1">
              {selectedEvent?.branding.logo ? (
                <img src={selectedEvent.branding.logo} alt={selectedEvent.shortName} className="w-full h-full object-contain" />
              ) : (
                <span className="text-foreground font-bold text-sm">
                  {selectedEvent?.shortName || 'NM'}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-semibold text-foreground">
                {selectedEvent?.shortName || 'The Stitch Festival'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {selectedEvent?.location || 'Events Platform'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-muted relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed top-16 inset-x-0 bottom-0 bg-card border-t border-border">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
              <div className="pt-4 border-t border-border">
                <div className="mb-3">
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</span>
                  </div>
                  {adminNavigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
                <NavLink
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-card md:border-r md:border-border">
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-border">
          <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-border p-1">
            {selectedEvent?.branding.logo ? (
              <img src={selectedEvent.branding.logo} alt={selectedEvent.shortName} className="w-full h-full object-contain" />
            ) : (
              <span className="text-foreground font-bold">
                {selectedEvent?.shortName || 'NM'}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">
              {selectedEvent?.name || 'The Stitch Festival'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedEvent?.location || 'Events Platform'}
            </p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4">
            <div className="flex items-center space-x-2 px-4 py-2 mb-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</span>
            </div>
            {adminNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors mb-1",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
          <NavLink
            to="/settings"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export function BottomNav() {
  const location = useLocation();
  
  const quickNavItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/agenda', label: 'Agenda', icon: Calendar },
    { to: '/speakers', label: 'Speakers', icon: Users },
    { to: '/messages', label: 'Messages', icon: MessageCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {quickNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
