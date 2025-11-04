import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  Grid3x3,
  List,
  Plus,
  Check,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  title: string;
  description: string;
  speaker: string;
  speakerRole: string;
  speakerImage: string;
  startTime: string;
  endTime: string;
  date: string;
  room: string;
  category: string;
  track: string;
  capacity: number;
  registered: number;
  isLive: boolean;
  isBookmarked: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Slow Stitching: Rediscovering Hand-Technique',
    description: 'Dive into centuries-old hand-stitching methods and learn how to apply them in modern craft.',
    speaker: 'Angela Daymond',
    speakerRole: 'Hand-stitching Specialist & Author',
    speakerImage: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=100&h=100&fit=crop',
    startTime: '09:00',
    endTime: '10:30',
    date: '2026-03-15',
    room: 'Main Studio',
    category: 'Hand Stitching',
    track: 'Techniques & Skills',
    capacity: 50,
    registered: 45,
    isLive: true,
    isBookmarked: true,
    difficulty: 'All Levels'
  },
  {
    id: '2',
    title: 'Couture Tailoring for the Home Sewist',
    description: 'Learn key tailoring techniques (e.g., jacket construction) from a couture tutor; includes practical tips and one small project.',
    speaker: 'Claire Tyler',
    speakerRole: 'Dressmaking Tutor & Sewing School Owner',
    speakerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    startTime: '11:00',
    endTime: '12:30',
    date: '2026-03-15',
    room: 'Studio B',
    category: 'Dressmaking',
    track: 'Techniques & Skills',
    capacity: 40,
    registered: 38,
    isLive: false,
    isBookmarked: false,
    difficulty: 'Intermediate/Advanced'
  },
  {
    id: '3',
    title: 'From Fabric to Finish: Quick Project Workshop',
    description: 'A fun, hands-on session to complete a fabric-based accessory in under an hour.',
    speaker: 'Bridgitte Garnett',
    speakerRole: 'Craft Tutor & Design Expert',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    startTime: '14:00',
    endTime: '15:00',
    date: '2026-03-15',
    room: 'Workshop Studio',
    category: 'Accessories',
    track: 'Hands-On Projects',
    capacity: 60,
    registered: 58,
    isLive: false,
    isBookmarked: true,
    difficulty: 'Beginner/All'
  },
  {
    id: '4',
    title: 'Sew, Crochet & Knit: Mixed-Media Makers',
    description: 'Combining sewing, knitting and crochet in fun hybrid craft projects; tutor guides multi-technique creation.',
    speaker: 'Debbie Harris',
    speakerRole: 'TV Sewing Star & Craft Tutor',
    speakerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    startTime: '15:30',
    endTime: '17:00',
    date: '2026-03-15',
    room: 'Main Studio',
    category: 'Mixed Media',
    track: 'Creative Combinations',
    capacity: 45,
    registered: 42,
    isLive: false,
    isBookmarked: false,
    difficulty: 'Beginner/Intermediate'
  },
  {
    id: '5',
    title: 'Modern Rag-Rug Techniques & Upcycling',
    description: 'Explore rag-rug techniques, material reuse and create a contemporary textile piece with tutor guidance.',
    speaker: 'Elspeth Jackson',
    speakerRole: 'Rag-Rug Specialist & Textile Author',
    speakerImage: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=100&h=100&fit=crop',
    startTime: '10:00',
    endTime: '11:30',
    date: '2026-03-16',
    room: 'Textile Studio',
    category: 'Textiles',
    track: 'Sustainable Crafts',
    capacity: 35,
    registered: 32,
    isLive: false,
    isBookmarked: false,
    difficulty: 'All Levels'
  },
  {
    id: '6',
    title: 'Interactive Q&A with Sewing TV Stars',
    description: 'Live chat session with well-known craft celebrities. Ask your burning questions about techniques, materials, and creative projects.',
    speaker: 'Featured Tutors',
    speakerRole: 'The Stitch Festival Panel',
    speakerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    startTime: '12:00',
    endTime: '13:00',
    date: '2026-03-16',
    room: 'Main Auditorium',
    category: 'Panel Discussion',
    track: 'Community',
    capacity: 100,
    registered: 95,
    isLive: false,
    isBookmarked: false,
    difficulty: 'All Levels'
  },
  {
    id: '7',
    title: 'Beginners\' Craft Starter: Make Your First Macramé Wall-Hanging',
    description: 'Short tutorial-style session perfect for complete beginners. Learn macramé basics and create a beautiful wall decoration.',
    speaker: 'Angela Daymond',
    speakerRole: 'Hand-stitching Specialist',
    speakerImage: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=100&h=100&fit=crop',
    startTime: '14:30',
    endTime: '15:30',
    date: '2026-03-16',
    room: 'Craft Essentials Room',
    category: 'Macramé',
    track: 'Beginner Friendly',
    capacity: 70,
    registered: 65,
    isLive: false,
    isBookmarked: false,
    difficulty: 'Beginner'
  }
];

const categories = ['All', 'Hand Stitching', 'Dressmaking', 'Accessories', 'Textiles', 'Mixed Media', 'Panel Discussion', 'Macramé'];
const tracks = ['All', 'Techniques & Skills', 'Hands-On Projects', 'Creative Combinations', 'Sustainable Crafts', 'Community', 'Beginner Friendly'];
const dates = ['All', '2026-03-15', '2026-03-16'];

export default function Agenda() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sessions, setSessions] = useState(mockSessions);

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           session.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory;
      const matchesTrack = selectedTrack === 'All' || session.track === selectedTrack;
      const matchesDate = selectedDate === 'All' || session.date === selectedDate;

      return matchesSearch && matchesCategory && matchesTrack && matchesDate;
    });
  }, [sessions, searchQuery, selectedCategory, selectedTrack, selectedDate]);

  const toggleBookmark = (sessionId: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, isBookmarked: !session.isBookmarked }
          : session
      )
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Festival Schedule</h1>
          <p className="text-primary-foreground/80">Browse workshops and build your schedule</p>
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {filteredSessions.length} Sessions
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              {sessions.filter(s => s.isBookmarked).length} Bookmarked
            </span>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workshops, tutors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Controls Row */}
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
                <span>Filters</span>
              </button>

              {(selectedCategory !== 'All' || selectedTrack !== 'All' || selectedDate !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTrack('All');
                    setSelectedDate('All');
                  }}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
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
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg",
                  viewMode === 'grid'
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          {showFilters && (
            <div className="space-y-4 bg-card rounded-xl border border-border p-4">
              <div>
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

              <div>
                <h3 className="font-medium text-foreground mb-2">Track</h3>
                <div className="flex flex-wrap gap-2">
                  {tracks.map(track => (
                    <button
                      key={track}
                      onClick={() => setSelectedTrack(track)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm border transition-colors",
                        selectedTrack === track
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Date</h3>
                <div className="flex flex-wrap gap-2">
                  {dates.map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm border transition-colors",
                        selectedDate === date
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {date === 'All' ? 'All Days' : formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sessions List/Grid */}
        <div className={cn(
          "space-y-4",
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0"
        )}>
          {filteredSessions.map(session => (
            <div key={session.id} className={cn(
              "bg-card rounded-xl border border-border hover:border-primary/50 transition-all",
              viewMode === 'list' ? "p-4" : "p-6 min-h-[180px]"
            )}>
              <div className={cn("mb-3", viewMode === 'list' ? "flex items-start justify-between" : "flex flex-col")}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-foreground truncate">{session.title}</h3>
                    {session.isLive && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                        Live
                      </span>
                    )}
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      session.difficulty === 'Beginner' ? "bg-green-100 text-green-800" :
                      session.difficulty === 'Beginner/All' ? "bg-green-100 text-green-800" :
                      session.difficulty.includes('Intermediate') ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {session.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <img
                    src={session.speakerImage}
                    alt={session.speaker}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                    <span className="text-sm text-muted-foreground">
                      {session.speaker} • {session.speakerRole}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {session.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.startTime} - {session.endTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {session.room}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {session.registered}/{session.capacity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <NavLink
                    to={`/session/${session.id}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </NavLink>
                  {session.isLive && (
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>Join Live</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => toggleBookmark(session.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    session.isBookmarked
                      ? "text-primary hover:text-primary/80"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {session.isBookmarked ? (
                    <Star className="w-5 h-5 fill-current" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find workshops.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
