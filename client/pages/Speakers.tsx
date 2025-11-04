import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Star,
  Grid3x3,
  List,
  ExternalLink,
  MapPin,
  Calendar,
  ChevronRight,
  User,
  Building2,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  fullBio: string;
  image: string;
  topic: string;
  track: string;
  expertise: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  sessions: {
    id: string;
    title: string;
    date: string;
    time: string;
    room: string;
  }[];
  rating: number;
  totalRatings: number;
  isKeynote: boolean;
  featured: boolean;
}

const mockSpeakers: Speaker[] = [
  {
    id: 'speaker-1',
    name: 'Angela Daymond',
    role: 'Hand-stitching Specialist & Author',
    company: 'The Stitch Festival',
    bio: 'Expert in slow stitching and hand-technique with decades of experience teaching textile arts.',
    fullBio: 'Angela Daymond is a renowned hand-stitching specialist and author known for her work in "slow stitching" techniques. With decades of experience in textile arts and craft education, she has pioneered contemporary approaches to centuries-old hand-stitching methods. Angela is passionate about sharing traditional techniques with modern makers and continues to inspire crafters worldwide through her workshops, lectures, and published works.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=200&h=200&fit=crop',
    topic: 'Hand Stitching',
    track: 'Techniques & Skills',
    expertise: ['Hand Stitching', 'Slow Stitching', 'Textile Arts', 'Craft Education'],
    social: {
      website: 'https://www.thestitchfestival.co.uk'
    },
    sessions: [
      {
        id: '1',
        title: 'Slow Stitching: Rediscovering Hand-Technique',
        date: '2026-03-15',
        time: '09:00 - 10:30',
        room: 'Main Studio'
      },
      {
        id: '7',
        title: 'Beginners\' Craft Starter: Make Your First Macramé Wall-Hanging',
        date: '2026-03-16',
        time: '14:30 - 15:30',
        room: 'Craft Essentials Room'
      }
    ],
    rating: 4.9,
    totalRatings: 156,
    isKeynote: true,
    featured: true
  },
  {
    id: 'speaker-2',
    name: 'Claire Tyler',
    role: 'Dressmaking Tutor & Sewing School Owner',
    company: 'West Sussex Sewing School',
    bio: 'Couture expert and owner of a prestigious sewing school specializing in tailored garments.',
    fullBio: 'Claire Tyler is a accomplished dressmaking tutor and founder of her own sewing school in West Sussex. With expertise spanning from classic tailoring to modern couture techniques, she has trained hundreds of students in the art of creating beautifully tailored garments. Claire brings both technical mastery and a passion for helping sewists discover their creative potential.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    topic: 'Dressmaking',
    track: 'Techniques & Skills',
    expertise: ['Couture', 'Tailoring', 'Dressmaking', 'Garment Construction'],
    social: {
      website: 'https://www.thestitchfestival.co.uk'
    },
    sessions: [
      {
        id: '2',
        title: 'Couture Tailoring for the Home Sewist',
        date: '2026-03-15',
        time: '11:00 - 12:30',
        room: 'Studio B'
      }
    ],
    rating: 4.8,
    totalRatings: 124,
    isKeynote: false,
    featured: true
  },
  {
    id: 'speaker-3',
    name: 'Bridgitte Garnett',
    role: 'Craft Tutor & Design Expert',
    company: 'The Stitch Festival',
    bio: 'Multi-disciplinary craft tutor covering sewing, fabrics, accessories, and broader craft techniques.',
    fullBio: 'Bridgitte Garnett is a versatile craft tutor with expertise across multiple disciplines including sewing, fabric selection, accessory design, and various textile techniques. Her approachable teaching style and creative projects have inspired countless makers. Bridgitte believes in making craft accessible to everyone, from beginners to advanced artisans.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    topic: 'Accessories & Design',
    track: 'Hands-On Projects',
    expertise: ['Accessory Design', 'Fabric Selection', 'Quick Projects', 'Craft Techniques'],
    social: {
      website: 'https://www.thestitchfestival.co.uk'
    },
    sessions: [
      {
        id: '3',
        title: 'From Fabric to Finish: Quick Project Workshop',
        date: '2026-03-15',
        time: '14:00 - 15:00',
        room: 'Workshop Studio'
      }
    ],
    rating: 4.7,
    totalRatings: 89,
    isKeynote: false,
    featured: true
  },
  {
    id: 'speaker-4',
    name: 'Debbie Harris',
    role: 'TV Sewing Star & Craft Tutor',
    company: 'The Stitch Festival',
    bio: 'Award-winning sewing television personality now teaching sewing, crochet, and knitting with enthusiasm and expertise.',
    fullBio: 'Debbie Harris is a celebrated television personality in the sewing world and accomplished tutor. Her vibrant energy and clear teaching style have made her a favorite among crafters of all levels. Debbie specializes in combining multiple craft techniques to create unique mixed-media projects, proving that the boundaries between different crafts can be beautifully blurred.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    topic: 'Mixed Media Crafts',
    track: 'Creative Combinations',
    expertise: ['Sewing', 'Knitting', 'Crochet', 'Mixed-Media Projects'],
    social: {
      website: 'https://www.thestitchfestival.co.uk'
    },
    sessions: [
      {
        id: '4',
        title: 'Sew, Crochet & Knit: Mixed-Media Makers',
        date: '2026-03-15',
        time: '15:30 - 17:00',
        room: 'Main Studio'
      }
    ],
    rating: 4.9,
    totalRatings: 142,
    isKeynote: true,
    featured: true
  },
  {
    id: 'speaker-5',
    name: 'Elspeth Jackson',
    role: 'Rag-Rug Specialist & Textile Author',
    company: 'The Stitch Festival',
    bio: 'Renowned textile expert specializing in rag-rugs, sustainable crafting, and contemporary textile design.',
    fullBio: 'Elspeth Jackson is a highly respected textile specialist with a particular passion for rag-rug techniques and sustainable craft practices. As an author and educator, Elspeth has been instrumental in reviving interest in traditional textile methods while promoting environmental responsibility. Her work demonstrates how traditional crafts can be reimagined for the contemporary maker.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=200&h=200&fit=crop',
    topic: 'Textiles & Sustainability',
    track: 'Sustainable Crafts',
    expertise: ['Rag-Rug Techniques', 'Textile Design', 'Upcycling', 'Sustainable Practices'],
    social: {
      website: 'https://www.thestitchfestival.co.uk'
    },
    sessions: [
      {
        id: '5',
        title: 'Modern Rag-Rug Techniques & Upcycling',
        date: '2026-03-16',
        time: '10:00 - 11:30',
        room: 'Textile Studio'
      }
    ],
    rating: 4.8,
    totalRatings: 118,
    isKeynote: false,
    featured: false
  }
];

const topics = ['All', 'Hand Stitching', 'Dressmaking', 'Accessories & Design', 'Textiles & Sustainability', 'Mixed Media Crafts'];
const tracks = ['All', 'Techniques & Skills', 'Hands-On Projects', 'Creative Combinations', 'Sustainable Crafts', 'Beginner Friendly'];
const sortOptions = ['A-Z', 'Z-A', 'Rating', 'Most Sessions'];

export default function Speakers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [sortBy, setSortBy] = useState('A-Z');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const filteredAndSortedSpeakers = useMemo(() => {
    let filtered = mockSpeakers.filter(speaker => {
      const matchesSearch = speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           speaker.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           speaker.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           speaker.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTopic = selectedTopic === 'All' || speaker.topic === selectedTopic;
      const matchesTrack = selectedTrack === 'All' || speaker.track === selectedTrack;

      return matchesSearch && matchesTopic && matchesTrack;
    });

    // Sort speakers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Z-A':
          return b.name.localeCompare(a.name);
        case 'Rating':
          return b.rating - a.rating;
        case 'Most Sessions':
          return b.sessions.length - a.sessions.length;
        default: // A-Z
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, selectedTopic, selectedTrack, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Festival Tutors & Speakers</h1>
          <p className="text-primary-foreground/80">Meet our expert craft tutors and inspiring leaders</p>
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {filteredAndSortedSpeakers.length} Tutors
            </span>
            <span className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              {mockSpeakers.filter(s => s.isKeynote).length} Featured
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
              placeholder="Search tutors, expertise, or workshops..."
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
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
                <h3 className="font-medium text-foreground mb-2">Topic</h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm border transition-colors",
                        selectedTopic === topic
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {topic}
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
            </div>
          )}
        </div>

        {/* Speakers Grid/List */}
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredAndSortedSpeakers.map(speaker => (
            <div
              key={speaker.id}
              className={cn(
                "bg-card rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer",
                viewMode === 'list' ? "p-6 flex items-start space-x-6" : "p-4"
              )}
              onClick={() => setSelectedSpeaker(speaker)}
            >
              <div className={cn(
                "flex flex-col items-center text-center",
                viewMode === 'list' && "flex-row items-start text-left flex-1"
              )}>
                <div className={cn(
                  "relative mb-4",
                  viewMode === 'list' && "mb-0 mr-4 flex-shrink-0"
                )}>
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                    className={cn(
                      "rounded-full object-cover",
                      viewMode === 'grid' ? "w-20 h-20" : "w-16 h-16"
                    )}
                  />
                  {speaker.isKeynote && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className={cn("flex-1", viewMode === 'list' && "min-w-0")}>
                  <div className={cn(
                    "space-y-2 mb-4",
                    viewMode === 'list' && "mb-3"
                  )}>
                    <h3 className="font-semibold text-foreground">{speaker.name}</h3>
                    <p className="text-sm text-muted-foreground">{speaker.role}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {speaker.company}
                    </p>
                  </div>

                  <p className={cn(
                    "text-sm text-muted-foreground mb-4",
                    viewMode === 'grid' ? "line-clamp-3" : "line-clamp-2"
                  )}>
                    {speaker.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {speaker.expertise.slice(0, 3).map(exp => (
                      <span
                        key={exp}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                      >
                        {exp}
                      </span>
                    ))}
                    {speaker.expertise.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{speaker.expertise.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Rating and Sessions */}
                  <div className={cn(
                    "flex items-center justify-between text-sm",
                    viewMode === 'list' && "flex-col items-start space-y-2"
                  )}>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span>{speaker.rating}</span>
                      <span className="text-muted-foreground">({speaker.totalRatings})</span>
                    </div>
                    <span className="text-muted-foreground">
                      {speaker.sessions.length} session{speaker.sessions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {viewMode === 'list' && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedSpeakers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tutors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find tutors.
            </p>
          </div>
        )}
      </div>

      {/* Speaker Detail Modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Speaker Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={selectedSpeaker.image}
                      alt={selectedSpeaker.name}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    {selectedSpeaker.isKeynote && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">{selectedSpeaker.name}</h2>
                    <p className="text-muted-foreground mb-2">{selectedSpeaker.role}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {selectedSpeaker.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSpeaker(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Biography</h3>
                <p className="text-muted-foreground">{selectedSpeaker.fullBio}</p>
              </div>

              {/* Expertise */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSpeaker.expertise.map(exp => (
                    <span
                      key={exp}
                      className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              {(selectedSpeaker.social.linkedin || selectedSpeaker.social.twitter || selectedSpeaker.social.website) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Connect</h3>
                  <div className="flex items-center space-x-4">
                    {selectedSpeaker.social.linkedin && (
                      <a
                        href={selectedSpeaker.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedSpeaker.social.twitter && (
                      <a
                        href={selectedSpeaker.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {selectedSpeaker.social.website && (
                      <a
                        href={selectedSpeaker.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Sessions */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Workshops</h3>
                <div className="space-y-3">
                  {selectedSpeaker.sessions.map(session => (
                    <div key={session.id} className="bg-muted/50 rounded-lg p-3">
                      <h4 className="font-medium text-foreground mb-2">{session.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {session.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {session.room}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <NavLink
                  to="/messages"
                  className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg text-center font-medium hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </NavLink>
                <NavLink
                  to="/agenda"
                  className="flex-1 border border-border text-foreground py-3 px-4 rounded-lg text-center font-medium hover:bg-muted transition-colors"
                >
                  View Workshops
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
