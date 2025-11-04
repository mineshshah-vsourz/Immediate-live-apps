import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Star,
  Play,
  MessageCircle,
  Download,
  ExternalLink,
  Share2,
  Plus,
  Check,
  StarIcon,
  Users,
  Video,
  FileText,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  size?: string;
  description?: string;
}

interface SessionDetail {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  speaker: {
    id: string;
    name: string;
    role: string;
    company: string;
    bio: string;
    image: string;
    social: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
  };
  startTime: string;
  endTime: string;
  date: string;
  room: string;
  category: string;
  track: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  capacity: number;
  registered: number;
  isLive: boolean;
  isBookmarked: boolean;
  isRegistered: boolean;
  materials: SessionMaterial[];
  relatedSessions: string[];
  tags: string[];
  rating: number;
  totalRatings: number;
}

// Mock session data - in real app this would come from API
const mockSession: SessionDetail = {
  id: '1',
  title: 'Hand-Stitching Techniques: The Fundamentals',
  description: 'A hands-on workshop exploring essential hand-stitching methods and practical tips for garment finishing and decorative stitching.',
  fullDescription: `Join us for a practical, hands-on workshop that covers the fundamentals of hand-stitching. Through live demonstrations and guided practice, you'll learn essential stitches, finishing techniques, and ways to incorporate hand-stitching into your projects.

This session is suitable for beginners and intermediate crafters alike. Bring basic tools: needles, thread, small scissors, and a piece of fabric to practice on.

Key topics include:
• Running stitch, backstitch, and whipstitch
• Neat seam finishes and hemming
• Decorative stitches for embellishment
• Troubleshooting tension and thread choice
• Simple repairs and alterations`,
  speaker: {
    id: 'speaker-1',
    name: 'Angela Daymond',
    role: 'Hand-Stitching Specialist',
    company: 'The Stitch Festival',
    bio: 'Angela Daymond is an experienced hand-stitching tutor and author who specialises in slow stitching and traditional techniques. She teaches workshops across the UK and publishes accessible guides for makers of all levels.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=200&h=200&fit=crop',
    social: {
      linkedin: 'https://linkedin.com/in/angeladaymond',
      twitter: 'https://twitter.com/angeladay_stitch',
      website: 'https://angeladaymond.com'
    }
  },
  startTime: '14:30',
  endTime: '15:30',
  date: '2026-03-20',
  room: 'Main Studio',
  category: 'Craft',
  track: 'Handwork',
  difficulty: 'Beginner',
  capacity: 40,
  registered: 28,
  isLive: true,
  isBookmarked: true,
  isRegistered: true,
  materials: [
    {
      id: 'mat-1',
      title: 'Hand-Stitching - Workshop Handout',
      type: 'pdf',
      url: '#',
      size: '1.2 MB',
      description: 'Step-by-step handout covering stitches and practice exercises'
    },
    {
      id: 'mat-2',
      title: 'Pattern Basics & Marking Guide',
      type: 'pdf',
      url: '#',
      size: '0.8 MB',
      description: 'Quick guide to pattern marking and basic alterations'
    },
    {
      id: 'mat-3',
      title: 'Recommended Tools & Materials',
      type: 'document',
      url: '#',
      description: 'List of recommended needles, threads and fabrics for beginners'
    },
    {
      id: 'mat-4',
      title: 'Related Resources',
      type: 'link',
      url: '#',
      description: 'Links to tutorials and supplier recommendations'
    }
  ],
  relatedSessions: ['2', '3'],
  tags: ['Hand-stitching', 'Dressmaking', 'Textile Crafts', 'Beginner'],
  rating: 4.9,
  totalRatings: 34
};

export default function SessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session] = useState<SessionDetail>(mockSession);
  const [isBookmarked, setIsBookmarked] = useState(session.isBookmarked);
  const [isRegistered, setIsRegistered] = useState(session.isRegistered);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In real app, would call API
  };

  const toggleRegistration = () => {
    setIsRegistered(!isRegistered);
    // In real app, would call API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: session.title,
        text: session.description,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddToCalendar = () => {
    // Generate calendar event
    const startDateTime = new Date(`${session.date}T${session.startTime}:00`);
    const endDateTime = new Date(`${session.date}T${session.endTime}:00`);
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(session.title)}&dates=${startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(session.description)}&location=${encodeURIComponent(session.room)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'link':
        return <ExternalLink className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Session Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleBookmark}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isBookmarked 
                  ? "text-yellow-500 hover:text-yellow-600" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Star className={cn("w-5 h-5", isBookmarked && "fill-current")} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Badge */}
        {session.isLive && (
          <div className="bg-red-500 text-white rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <div>
                <h3 className="font-semibold">Session is Live Now!</h3>
                <p className="text-red-100 text-sm">Join the live stream to participate</p>
              </div>
            </div>
            <button className="bg-white text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Join Live</span>
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Session Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    session.difficulty === 'Beginner' ? "bg-green-100 text-green-800" :
                    session.difficulty === 'Intermediate' ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  )}>
                    {session.difficulty}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {session.category}
                  </span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    {session.track}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{session.title}</h1>
                <p className="text-muted-foreground">{session.description}</p>
              </div>
            </div>

            {/* Session Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{session.startTime} - {session.endTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{session.room}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{session.registered}/{session.capacity} registered</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= Math.floor(session.rating) 
                          ? "text-yellow-500 fill-current" 
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {session.rating} ({session.totalRatings} ratings)
                </span>
              </div>
            </div>
          </div>

          {/* Speaker Info */}
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Speaker</h2>
            <div className="flex items-start space-x-4">
              <img 
                src={session.speaker.image} 
                alt={session.speaker.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{session.speaker.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {session.speaker.role} at {session.speaker.company}
                </p>
                <p className="text-sm text-muted-foreground mb-3">{session.speaker.bio}</p>
                <div className="flex items-center space-x-3">
                  {session.speaker.social.linkedin && (
                    <a 
                      href={session.speaker.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {session.speaker.social.twitter && (
                    <a 
                      href={session.speaker.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {session.speaker.social.website && (
                    <a 
                      href={session.speaker.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">About This Session</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {showFullDescription ? (
                <div className="whitespace-pre-line">{session.fullDescription}</div>
              ) : (
                <div>
                  <p className="line-clamp-3">{session.fullDescription}</p>
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="text-primary hover:text-primary/80 transition-colors mt-2"
                  >
                    Read more...
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {session.tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Materials */}
          {session.materials.length > 0 && (
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Session Materials</h2>
              <div className="space-y-3">
                {session.materials.map(material => (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(material.type)}
                      <div>
                        <h4 className="font-medium text-foreground">{material.title}</h4>
                        {material.description && (
                          <p className="text-sm text-muted-foreground">{material.description}</p>
                        )}
                        {material.size && (
                          <span className="text-xs text-muted-foreground">{material.size}</span>
                        )}
                      </div>
                    </div>
                    <button className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <button
            onClick={toggleRegistration}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2",
              isRegistered 
                ? "bg-success text-success-foreground hover:bg-success/90" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isRegistered ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{isRegistered ? 'Added to Schedule' : 'Add to My Schedule'}</span>
          </button>
          
          <button
            onClick={handleAddToCalendar}
            className="md:flex-initial bg-card border border-border text-foreground py-3 px-4 rounded-xl font-medium hover:bg-muted transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Add to Calendar</span>
          </button>

          <button className="md:flex-initial bg-card border border-border text-foreground py-3 px-4 rounded-xl font-medium hover:bg-muted transition-colors flex items-center justify-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Ask Question</span>
          </button>
        </div>
      </div>
    </div>
  );
}
