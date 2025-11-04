import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  HelpCircle,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  X,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { selectedEvent } = useEvent();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingsCategories = [
    {
      id: 'event',
      title: 'Event Settings',
      description: 'Switch events and manage event-specific preferences',
      icon: Calendar,
      to: '/event-settings',
      highlight: true
    },
    {
      id: 'profile',
      title: 'Profile & Account',
      description: 'Manage your personal information and account settings',
      icon: User,
      action: () => setActiveSection('profile')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure push notifications and email preferences',
      icon: Bell,
      action: () => setActiveSection('notifications')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your data sharing and security settings',
      icon: Shield,
      action: () => setActiveSection('privacy')
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize theme and display preferences',
      icon: Palette,
      action: () => setActiveSection('appearance')
    },
    {
      id: 'language',
      title: 'Language & Region',
      description: 'Set your preferred language and regional settings',
      icon: Globe,
      action: () => setActiveSection('language')
    },
    {
      id: 'admin',
      title: 'Admin Panel',
      description: 'Access admin dashboard and management tools',
      icon: SettingsIcon,
      to: '/admin',
      highlight: true
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help, report issues, and contact support',
      icon: HelpCircle,
      action: () => setActiveSection('help')
    }
  ];

  const ProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Profile & Account</h2>
        <button 
          onClick={() => setActiveSection(null)}
          className="p-2 rounded-lg hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Camera className="w-3 h-3 text-primary-foreground" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">John Doe</h3>
            <p className="text-muted-foreground">john.doe@example.com</p>
            <p className="text-sm text-muted-foreground">Craft Enthusiast</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input 
              type="text" 
              defaultValue="John Doe"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
            <input 
              type="text" 
              defaultValue="Craft Enthusiast"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Company</label>
            <input 
              type="text" 
              defaultValue="Stitch Festival Attendee"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
            <input 
              type="tel" 
              defaultValue="+44 20 7123 4567"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  if (activeSection === 'profile') {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <ProfileSection />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, preferences, and event settings
          </p>
        </div>

        {/* Current Event Info */}
        {selectedEvent && (
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-semibold text-foreground">{selectedEvent.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                </div>
              </div>
              <NavLink 
                to="/event-settings" 
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Switch Event
              </NavLink>
            </div>
          </div>
        )}

        {/* Settings Categories */}
        <div className="space-y-3">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            const isEventSettings = category.id === 'event';
            
            if (category.to) {
              return (
                <NavLink
                  key={category.id}
                  to={category.to}
                  className={cn(
                    "block bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all group",
                    isEventSettings && "ring-2 ring-primary/20 border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        isEventSettings ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </NavLink>
              );
            }

            return (
              <button
                key={category.id}
                onClick={category.action}
                className="w-full text-left bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Contact Support</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">View Help Center</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">The Stitch Festival March 2026</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0 • Built with ❤️ for our community</p>
        </div>
      </div>
    </div>
  );
}
