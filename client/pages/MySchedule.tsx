import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  Share2,
  Edit3,
  Trash2,
  Plus,
  CalendarDays,
  Filter,
  Grid3x3,
  List,
  VideoIcon,
  Users,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleItem {
  id: string;
  type: 'session' | 'meeting' | 'break' | 'networking';
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  speaker?: string;
  speakerImage?: string;
  attendees?: string[];
  category: string;
  track?: string;
  isConflict: boolean;
  isLive: boolean;
  meetingWith?: string;
  notes?: string;
  color?: string;
}

const mockScheduleItems: ScheduleItem[] = [
  {
    id: 'sched-1',
    type: 'session',
    title: 'Slow Stitching: Rediscovering Hand-Technique',
    description: 'Dive into centuries-old hand-stitching methods and learn how to apply them in modern craft.',
    startTime: '09:00',
    endTime: '10:30',
    date: '2026-03-15',
    location: 'Main Studio',
    speaker: 'Angela Daymond',
    speakerImage: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=50&h=50&fit=crop',
    category: 'Hand Stitching',
    track: 'Techniques & Skills',
    isConflict: false,
    isLive: true,
    color: '#ff6c7c'
  },
  {
    id: 'sched-2',
    type: 'break',
    title: 'Coffee Break & Studio Showcase',
    startTime: '10:30',
    endTime: '11:00',
    date: '2026-03-15',
    location: 'Main Foyer',
    category: 'Break',
    isConflict: false,
    isLive: false,
    color: '#F59E0B'
  },
  {
    id: 'sched-3',
    type: 'session',
    title: 'Couture Tailoring for the Home Sewist',
    description: 'Learn key tailoring techniques from a couture tutor; includes practical tips and a small project.',
    startTime: '11:00',
    endTime: '12:30',
    date: '2026-03-15',
    location: 'Studio B',
    speaker: 'Claire Tyler',
    speakerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
    category: 'Dressmaking',
    track: 'Techniques & Skills',
    isConflict: false,
    isLive: false,
    color: '#5b9192'
  },
  {
    id: 'sched-4',
    type: 'session',
    title: 'From Fabric to Finish: Quick Project Workshop',
    description: 'Complete a fabric-based accessory in under an hour with hands-on guidance.',
    startTime: '14:00',
    endTime: '15:00',
    date: '2026-03-15',
    location: 'Workshop Studio',
    speaker: 'Bridgitte Garnett',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
    category: 'Accessories',
    track: 'Hands-On Projects',
    isConflict: false,
    isLive: false,
    color: '#10B981'
  },
  {
    id: 'sched-5',
    type: 'session',
    title: 'Sew, Crochet & Knit: Mixed-Media Makers',
    description: 'Combine multiple techniques to create unique hybrid craft projects.',
    startTime: '15:30',
    endTime: '17:00',
    date: '2026-03-15',
    location: 'Main Studio',
    speaker: 'Debbie Harris',
    speakerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    category: 'Mixed Media',
    track: 'Creative Combinations',
    isConflict: false,
    isLive: false,
    color: '#8B5CF6'
  },
  {
    id: 'sched-6',
    type: 'networking',
    title: 'Evening Reception & Craft Showcase',
    startTime: '18:00',
    endTime: '20:00',
    date: '2026-03-15',
    location: 'Main Gallery',
    attendees: ['Angela Daymond', 'Claire Tyler', 'Debbie Harris', 'Bridgitte Garnett'],
    category: 'Networking',
    isConflict: false,
    isLive: false,
    color: '#EC4899'
  }
];

const dates = ['2026-03-15', '2026-03-16'];
const categories = ['All', 'Hand Stitching', 'Dressmaking', 'Accessories', 'Mixed Media', 'Textiles', 'Break', 'Networking'];

export default function MySchedule() {
  const [scheduleItems, setScheduleItems] = useState(mockScheduleItems);
  const [selectedDate, setSelectedDate] = useState('2026-03-15');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return scheduleItems.filter(item => {
      const matchesDate = item.date === selectedDate;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesDate && matchesCategory;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [scheduleItems, selectedDate, selectedCategory]);

  const conflicts = filteredItems.filter(item => item.isConflict);

  const removeItem = (itemId: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== itemId));
  };

  const exportToCalendar = () => {
    // Generate calendar file
    const calendarData = scheduleItems.map(item => {
      const startDateTime = new Date(`${item.date}T${item.startTime}:00`);
      const endDateTime = new Date(`${item.date}T${item.endTime}:00`);

      return {
        title: item.title,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        location: item.location,
        description: item.description || ''
      };
    });

    // In a real app, this would generate an .ics file
    console.log('Exporting calendar:', calendarData);

    // Simulate download
    const element = document.createElement('a');
    element.href = 'data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//The Stitch Festival//Events//EN\nEND:VCALENDAR';
    element.download = 'my-schedule.ics';
    element.click();
  };

  const shareSchedule = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Stitch Festival Schedule',
        text: `Check out my schedule for The Stitch Festival March 2026`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimelinePosition = (time: string) => {
    // Convert time to minutes from 8:00 AM (start of day)
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - 8) * 60 + minutes;
    return Math.max(0, totalMinutes * 2); // 2px per minute
  };

  const getDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const start = startHours * 60 + startMinutes;
    const end = endHours * 60 + endMinutes;

    return (end - start) * 2; // 2px per minute
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Schedule</h1>
          <p className="text-primary-foreground/80">Your personal workshop timeline and bookmarked sessions</p>
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {filteredItems.length} Items
            </span>
            {conflicts.length > 0 && (
              <span className="flex items-center text-red-200">
                <AlertCircle className="w-4 h-4 mr-1" />
                {conflicts.length} Conflict{conflicts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Conflicts Alert */}
        {conflicts.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-medium text-destructive mb-1">Schedule Conflicts Detected</h3>
                <p className="text-sm text-destructive/80">
                  You have {conflicts.length} overlapping workshop{conflicts.length !== 1 ? 's' : ''} on {formatDate(selectedDate)}.
                  Consider removing some items to resolve conflicts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          {/* Date Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {dates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedDate === date
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-primary/50"
                )}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>

          {/* Filter and View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors",
                  showFilters
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('timeline')}
                className={cn(
                  "p-2 rounded-lg",
                  viewMode === 'timeline'
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg",
                  viewMode === 'list'
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Categories */}
          {showFilters && (
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-medium text-foreground mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm border transition-colors",
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportToCalendar}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export to Calendar</span>
          </button>

          <button
            onClick={shareSchedule}
            className="flex items-center space-x-2 bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Schedule</span>
          </button>

          <NavLink
            to="/agenda"
            className="flex items-center space-x-2 bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Workshops</span>
          </NavLink>
        </div>

        {/* Schedule Display */}
        {viewMode === 'timeline' ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Timeline View - {formatDate(selectedDate)}
              </h3>

              {filteredItems.length > 0 ? (
                <div className="relative">
                  {/* Time Grid */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-border">
                    {Array.from({ length: 13 }, (_, i) => {
                      const hour = 8 + i;
                      return (
                        <div
                          key={hour}
                          className="absolute text-xs text-muted-foreground"
                          style={{ top: `${i * 120}px` }}
                        >
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                      );
                    })}
                  </div>

                  {/* Timeline Items */}
                  <div className="ml-20 relative" style={{ height: '1440px' }}>
                    {/* Hour Grid Lines */}
                    {Array.from({ length: 13 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 border-t border-border/30"
                        style={{ top: `${i * 120}px` }}
                      />
                    ))}

                    {/* Schedule Items */}
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        className={cn(
                          "absolute left-0 right-0 p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all",
                          item.isConflict ? "bg-destructive/10 border-destructive" : "bg-muted/50"
                        )}
                        style={{
                          top: `${getTimelinePosition(item.startTime)}px`,
                          height: `${getDuration(item.startTime, item.endTime)}px`,
                          borderLeftColor: item.color || '#6B7280'
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                              {item.isLive && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Live</span>
                              )}
                              {item.isConflict && (
                                <AlertCircle className="w-4 h-4 text-destructive" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {item.startTime} - {item.endTime}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {item.location}
                              </span>
                            </div>
                            {item.speaker && (
                              <div className="flex items-center space-x-2 mt-1">
                                <img
                                  src={item.speakerImage}
                                  alt={item.speaker}
                                  className="w-4 h-4 rounded-full"
                                />
                                <span className="text-sm text-muted-foreground">{item.speaker}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No items scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added anything to your schedule for this day yet.
                  </p>
                  <NavLink
                    to="/agenda"
                    className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Browse Workshops</span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    "bg-card rounded-xl border p-4 hover:border-primary/50 transition-colors",
                    item.isConflict && "border-destructive bg-destructive/5"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className="w-1 h-16 rounded-full"
                        style={{ backgroundColor: item.color || '#6B7280' }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          {item.isLive && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                              Live
                            </span>
                          )}
                          {item.isConflict && (
                            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                              Conflict
                            </span>
                          )}
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            item.type === 'session' ? "bg-blue-100 text-blue-800" :
                            item.type === 'meeting' ? "bg-green-100 text-green-800" :
                            item.type === 'break' ? "bg-yellow-100 text-yellow-800" :
                            "bg-purple-100 text-purple-800"
                          )}>
                            {item.type}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {item.startTime} - {item.endTime}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {item.location}
                          </span>
                        </div>

                        {item.speaker && (
                          <div className="flex items-center space-x-2 mt-2">
                            <img
                              src={item.speakerImage}
                              alt={item.speaker}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-muted-foreground">{item.speaker}</span>
                          </div>
                        )}

                        {item.meetingWith && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Meeting with: {item.meetingWith}
                          </p>
                        )}

                        {item.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            Notes: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.type === 'session' && (
                        <NavLink
                          to={`/session/${item.id}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-muted-foreground" />
                        </NavLink>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No items scheduled</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't added anything to your schedule for {formatDate(selectedDate)} yet.
                </p>
                <NavLink
                  to="/agenda"
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Browse Workshops</span>
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
