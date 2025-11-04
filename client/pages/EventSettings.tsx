import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Settings,
  ChevronRight,
  Check,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EventSettings() {
  const { selectedEvent, availableEvents, selectEvent, clearEvent } = useEvent();
  const [tempSelectedEventId, setTempSelectedEventId] = useState(selectedEvent?.id || '');
  const navigate = useNavigate();

  const handleSwitchEvent = () => {
    if (tempSelectedEventId && tempSelectedEventId !== selectedEvent?.id) {
      selectEvent(tempSelectedEventId);
      navigate('/');
    }
  };

  const handleLogOut = () => {
    clearEvent();
    navigate('/event-selection');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'upcoming': return 'bg-blue-500';
      case 'registration': return 'bg-green-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      case 'registration': return 'Registration Open';
      case 'ended': return 'Ended';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Settings</h1>
            <p className="text-muted-foreground">Manage your event selection and branding</p>
          </div>
        </div>

        {/* Current Event */}
        {selectedEvent && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Current Event</h2>
            <div className="flex items-start space-x-4">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-foreground">{selectedEvent.name}</h3>
                  <span className={cn(
                    "text-white text-xs px-2 py-1 rounded-full",
                    getStatusColor(selectedEvent.status)
                  )}>
                    {getStatusLabel(selectedEvent.status)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{selectedEvent.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {selectedEvent.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedEvent.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {selectedEvent.attendees.toLocaleString()} attendees
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Branding Preview */}
        {selectedEvent && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Event Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-foreground mb-3">Color Scheme</h3>
                <div className="flex space-x-3">
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-lg border border-border"
                      style={{ backgroundColor: selectedEvent.branding.primaryColor }}
                    ></div>
                    <p className="text-xs text-muted-foreground mt-1">Primary</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-lg border border-border"
                      style={{ backgroundColor: selectedEvent.branding.secondaryColor }}
                    ></div>
                    <p className="text-xs text-muted-foreground mt-1">Secondary</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-lg border border-border"
                      style={{ backgroundColor: selectedEvent.branding.accentColor }}
                    ></div>
                    <p className="text-xs text-muted-foreground mt-1">Accent</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-3">Organizer</h3>
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedEvent.organizer.logo} 
                    alt={selectedEvent.organizer.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{selectedEvent.organizer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.organizer.contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Switch Event */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Switch Event</h2>
          <p className="text-muted-foreground mb-6">
            Choose a different event to attend. This will update your branding and available content.
          </p>
          
          <div className="space-y-3 mb-6">
            {availableEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setTempSelectedEventId(event.id)}
                className={cn(
                  "w-full text-left bg-muted/50 rounded-lg border-2 p-4 transition-all",
                  tempSelectedEventId === event.id 
                    ? "border-primary shadow-md" 
                    : "border-transparent hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={event.image} 
                      alt={event.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground">{event.name}</h3>
                        <span className={cn(
                          "text-white text-xs px-2 py-1 rounded-full",
                          getStatusColor(event.status)
                        )}>
                          {getStatusLabel(event.status)}
                        </span>
                        {event.id === selectedEvent?.id && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />{event.date}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />{event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {tempSelectedEventId === event.id && (
                      <Check className="w-5 h-5 text-primary mr-2" />
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSwitchEvent}
              disabled={!tempSelectedEventId || tempSelectedEventId === selectedEvent?.id}
              className={cn(
                "flex-1 px-6 py-3 rounded-lg font-semibold transition-all",
                tempSelectedEventId && tempSelectedEventId !== selectedEvent?.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Switch to Selected Event
            </button>
            
            <button
              onClick={handleLogOut}
              className="px-6 py-3 rounded-lg font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
            >
              Exit Event
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-1">Event Switching</h3>
              <p className="text-sm text-muted-foreground">
                When you switch events, your branding, agenda, and available content will update immediately. 
                Your personal data and bookmarks are preserved across all events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
