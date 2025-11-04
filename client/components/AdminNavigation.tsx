import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  RefreshCw,
  Edit3,
  MessageSquare,
  Building2,
  TrendingUp,
  Shield,
  Ticket,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Activity,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: BarChart3,
    description: 'Overview and metrics'
  },
  {
    to: '/admin/events',
    label: 'Event Management',
    icon: Calendar,
    description: 'Manage events & branding'
  },
  {
    to: '/admin/live',
    label: 'Live Monitor',
    icon: Activity,
    description: 'Real-time event monitoring'
  },
  { 
    to: '/admin/users', 
    label: 'User Management', 
    icon: Users,
    description: 'Authentication & roles'
  },
  { 
    to: '/admin/sync', 
    label: 'Sync Monitor', 
    icon: RefreshCw,
    description: 'WordPress sync status'
  },
  { 
    to: '/admin/content', 
    label: 'Content Override', 
    icon: Edit3,
    description: 'Emergency CMS editor'
  },
  { 
    to: '/admin/messaging', 
    label: 'Messaging', 
    icon: MessageSquare,
    description: 'Push notifications'
  },
  { 
    to: '/admin/exhibitors', 
    label: 'Exhibitors', 
    icon: Building2,
    description: 'Sponsor management'
  },
  { 
    to: '/admin/analytics', 
    label: 'Analytics', 
    icon: TrendingUp,
    description: 'Usage insights'
  },
  { 
    to: '/admin/gdpr', 
    label: 'GDPR Center', 
    icon: Shield,
    description: 'Consent & exports'
  },
  { 
    to: '/admin/tickets', 
    label: 'Ticketing', 
    icon: Ticket,
    description: 'QR management'
  },
];

export function AdminNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center border border-border p-1">
              <img src="/placeholder.svg" alt="Admin" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">The Stitch Festival</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-muted relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
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
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <p className="text-xs opacity-80">{item.description}</p>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-72 md:bg-card md:border-r md:border-border">
        {/* Header */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-border p-1">
              <img src="/placeholder.svg" alt="Admin" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">The Stitch Festival</p>
            </div>
          </div>
          <NavLink
            to="/"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to App</span>
          </NavLink>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  <p className="text-xs opacity-80 group-hover:opacity-100">{item.description}</p>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-border">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center border border-border">
                <span className="text-foreground text-sm font-medium">AD</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@thestitchfestival.com</p>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                showUserMenu && "rotate-180"
              )} />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-lg">
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
                    <Activity className="w-4 h-4" />
                    <span>Activity Log</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
