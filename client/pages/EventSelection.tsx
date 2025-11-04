import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight,
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EventSelection() {
  const { availableEvents, selectEvent } = useEvent();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleContinue = () => {
    if (selectedEventId) {
      selectEvent(selectedEventId);
      navigate('/');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border p-2">
            <img src={availableEvents[0]?.branding?.logo ?? '/placeholder.svg'} alt={availableEvents[0]?.shortName ?? 'Event'} className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to The Stitch Festival March 2026</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select an event to access your personalized conference experience
          </p>
        </div>

        {/* Event Cards - Mobile Optimized */}
        <div className="space-y-4 mb-8">
          {availableEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventSelect(event.id)}
              className={cn(
                "w-full text-left bg-card rounded-2xl border-2 p-4 transition-all duration-300 active:scale-[0.98]",
                selectedEventId === event.id 
                  ? "border-primary shadow-lg ring-2 ring-primary/20" 
                  : "border-border active:border-primary/50"
              )}
            >
              {/* Event Image & Status */}
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Status Badge */}
                <div className={cn(
                  "absolute top-3 left-3 text-white text-xs px-3 py-1.5 rounded-full flex items-center font-medium",
                  getStatusColor(event.status)
                )}>
                  {event.status === 'live' && (
                    <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></div>
                  )}
                  {getStatusLabel(event.status)}
                </div>

                {/* Selection Indicator */}
                {selectedEventId === event.id && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1.5 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}

                {/* Event Title Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {event.name}
                  </h3>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                
                {/* Event Meta - Mobile Stack */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      <span>{event.attendees.toLocaleString()} attendees</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1 text-primary" />
                      <span>{event.sessions} sessions</span>
                    </div>
                  </div>
                </div>

                {/* Live Sessions Indicator */}
                {event.status === 'live' && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center text-sm text-success">
                      <Zap className="w-4 h-4 mr-1" />
                      <span className="font-medium">3 sessions live now</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-success" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button - Mobile Optimized */}
        <div className="space-y-4">
          <button
            onClick={handleContinue}
            disabled={!selectedEventId}
            className={cn(
              "w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 active:scale-[0.98]",
              selectedEventId
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 active:shadow-primary/40"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>{selectedEventId ? 'Enter Event' : 'Select an Event to Continue'}</span>
              {selectedEventId && <ArrowRight className="w-5 h-5" />}
            </div>
          </button>
          
          {selectedEventId && (
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              You can change events anytime from your profile settings
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            The Stitch Festival March 2026
          </p>
        </div>
      </div>
    </div>
  );
}
