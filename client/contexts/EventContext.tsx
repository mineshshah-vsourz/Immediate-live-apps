import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Event {
  id: string;
  name: string;
  shortName: string;
  date: string;
  location: string;
  status: 'live' | 'upcoming' | 'registration' | 'ended';
  attendees: number;
  sessions: number;
  image: string;
  description: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: string;
    heroImage: string;
    theme: 'light' | 'dark';
  };
  organizer: {
    name: string;
    logo: string;
    contact: string;
  };
}

const mockEvents: Event[] = [
  {
    id: 'the-stitch-festival',
    name: 'The Stitch Festival',
    shortName: 'TSF',
    date: 'March 2026',
    location: 'Online',
    status: 'registration',
    attendees: 1000,
    sessions: 50,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
    description: 'An exclusive online celebration bringing together the community for inspiring sessions and connections.',
    branding: {
      primaryColor: '#ff6c7c', // Vibrant Pink/Coral
      secondaryColor: '#5b9192', // Teal/Steel Blue
      accentColor: '#000000', // Black
      logo: 'https://www.thestitchfestival.co.uk/wp-content/uploads/2019/09/logo.svg',
      heroImage: 'https://www.thestitchfestival.co.uk/hero.jpg',
      theme: 'light'
    },
    organizer: {
      name: 'The Stitch Festival',
      logo: 'https://www.thestitchfestival.co.uk/wp-content/uploads/2019/09/logo.svg',
      contact: 'info@thestitchfestival.com'
    }
  }
];

interface EventContextType {
  selectedEvent: Event | null;
  availableEvents: Event[];
  selectEvent: (eventId: string) => void;
  clearEvent: () => void;
  isEventSelected: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(() => {
    try {
      const savedEventId = typeof window !== 'undefined' ? localStorage.getItem('selectedEventId') : null;
      if (savedEventId) {
        const event = mockEvents.find(e => e.id === savedEventId);
        if (event) return event;
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return mockEvents[0] ?? null;
  });

  // Apply branding whenever selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      applyEventBranding(selectedEvent);
    }
  }, [selectedEvent]);

  const selectEvent = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      localStorage.setItem('selectedEventId', eventId);
      applyEventBranding(event);
    }
  };

  const clearEvent = () => {
    setSelectedEvent(null);
    localStorage.removeItem('selectedEventId');
    removeEventBranding();
  };

  const applyEventBranding = (event: Event) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(event.branding.primaryColor));
    root.style.setProperty('--primary-foreground', '220 20% 98%');
    root.style.setProperty('--accent', hexToHsl(event.branding.accentColor));
    root.style.setProperty('--accent-foreground', '220 16% 9%');
  };

  const removeEventBranding = () => {
    const root = document.documentElement;
    // Reset to default colors
    root.style.setProperty('--primary', '257 89% 37%');
    root.style.setProperty('--primary-foreground', '220 20% 98%');
    root.style.setProperty('--accent', '192 89% 89%');
    root.style.setProperty('--accent-foreground', '220 16% 9%');
  };

  const hexToHsl = (hex: string): string => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l: number;

    l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  };

  return (
    <EventContext.Provider value={{
      selectedEvent,
      availableEvents: mockEvents,
      selectEvent,
      clearEvent,
      isEventSelected: !!selectedEvent
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
