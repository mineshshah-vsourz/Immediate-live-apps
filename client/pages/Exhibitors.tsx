import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  Filter,
  Building2,
  Star,
  Grid3x3,
  List,
  ExternalLink,
  MapPin,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Gift,
  Phone,
  Mail,
  Download,
  Calendar,
  Tag,
  Award,
  Users,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Offer {
  id: string;
  title: string;
  description: string;
  image?: string;
  code: string;
  expiry: string;
  discount?: string;
  terms?: string;
  isRedeemed: boolean;
}

interface Exhibitor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  sector: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  boothNumber: string;
  contactInfo: {
    website?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  resources: {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link';
    url: string;
    size?: string;
  }[];
  offers: Offer[];
  isBookmarked: boolean;
  isFeatured: boolean;
  rating: number;
  totalRatings: number;
  meetings?: {
    available: boolean;
    slots: string[];
  };
}

const mockExhibitors: Exhibitor[] = [
  {
    id: 'exhibitor-1',
    name: 'Fabric Godmother',
    tagline: 'Dressmaking Fabrics & Sewing Patterns',
    description: 'Your destination for premium dressmaking fabrics and exclusive sewing patterns. Fabric Godmother specializes in curated collections of high-quality materials perfect for couture projects, everyday wear, and creative experimentation. Browse thousands of patterns and find expert advice from experienced staff.',
    logo: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=100&h=100&fit=crop',
    sector: 'Fabrics',
    tier: 'Platinum',
    boothNumber: '12',
    contactInfo: {
      website: 'https://www.thestitchfestival.co.uk',
      email: 'info@fabricgodmother.com',
      phone: '+44 (0) 1234 567 890'
    },
    resources: [
      {
        id: 'res-1',
        title: 'Spring 2026 Fabric Collection',
        type: 'pdf',
        url: '#',
        size: '3.1 MB'
      },
      {
        id: 'res-2',
        title: 'Pattern Catalog & Guide',
        type: 'pdf',
        url: '#',
        size: '2.8 MB'
      }
    ],
    offers: [
      {
        id: 'offer-1',
        title: '25% Off Festival Purchases',
        description: 'Get 25% discount on all fabrics and patterns purchased at our booth.',
        code: 'STITCHFAB25',
        expiry: '2026-03-31',
        discount: '25%',
        terms: 'Valid during festival only. Cannot be combined with other offers.',
        isRedeemed: false
      },
      {
        id: 'offer-2',
        title: 'Free Pattern with Purchase',
        description: 'Receive a free exclusive Stitch Festival pattern with any fabric purchase over £20.',
        code: 'FREEPATTERN',
        expiry: '2026-03-31',
        isRedeemed: false
      }
    ],
    isBookmarked: true,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 203,
    meetings: {
      available: true,
      slots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    }
  },
  {
    id: 'exhibitor-2',
    name: 'Higgs & Higgs',
    tagline: 'Craft Essentials & Accessories',
    description: 'A featured exhibitor bringing quality craft essentials, notions, and accessories to The Stitch Festival. Higgs & Higgs stocks everything from thread and needles to buttons, zippers, elastic, and specialty findings. Your one-stop shop for finishing touches on any project.',
    logo: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100&h=100&fit=crop',
    sector: 'Notions & Accessories',
    tier: 'Gold',
    boothNumber: '08',
    contactInfo: {
      website: 'https://www.thestitchfestival.co.uk',
      email: 'sales@higgshiggs.com',
      phone: '+44 (0) 1234 567 891'
    },
    resources: [
      {
        id: 'res-3',
        title: 'Complete Notions Guide',
        type: 'pdf',
        url: '#',
        size: '1.5 MB'
      }
    ],
    offers: [
      {
        id: 'offer-3',
        title: 'Bundle Deals on Notions',
        description: 'Save up to 20% on mixed bundles of threads, buttons, and fasteners.',
        code: 'BUNDLESAVE20',
        expiry: '2026-03-31',
        discount: '20%',
        terms: 'Minimum purchase of £15 required.',
        isRedeemed: false
      }
    ],
    isBookmarked: false,
    isFeatured: true,
    rating: 4.7,
    totalRatings: 156,
    meetings: {
      available: true,
      slots: ['10:30', '12:00', '14:00', '15:30']
    }
  },
  {
    id: 'exhibitor-3',
    name: 'Lili Fabrics',
    tagline: 'Premium Fabrics & Craft Materials',
    description: 'Lili Fabrics is a premier fabric and craft supplier featuring luxury materials for every project. From silk and linen blends to innovative sustainable fabrics, Lili offers carefully selected collections curated for the discerning maker. Expect quality, variety, and expert guidance.',
    logo: 'https://images.unsplash.com/photo-1556821552-f0bac65937c7?w=100&h=100&fit=crop',
    sector: 'Fabrics',
    tier: 'Gold',
    boothNumber: '15',
    contactInfo: {
      website: 'https://www.thestitchfestival.co.uk',
      email: 'hello@lilifabrics.com',
      phone: '+44 (0) 1234 567 892'
    },
    resources: [
      {
        id: 'res-4',
        title: 'Sustainable Fabrics Lookbook',
        type: 'pdf',
        url: '#',
        size: '2.2 MB'
      },
      {
        id: 'res-5',
        title: 'Care & Maintenance Guide',
        type: 'pdf',
        url: '#',
        size: '1.1 MB'
      }
    ],
    offers: [
      {
        id: 'offer-4',
        title: '£5 Off Premium Collections',
        description: 'Receive £5 off when you spend £30 or more on Lili premium fabric collections.',
        code: 'LILIPREM5',
        expiry: '2026-03-31',
        discount: '£5 off',
        terms: 'Minimum spend of £30 required. One coupon per customer.',
        isRedeemed: false
      }
    ],
    isBookmarked: false,
    isFeatured: true,
    rating: 4.8,
    totalRatings: 124,
    meetings: {
      available: true,
      slots: ['11:00', '13:00', '15:00', '16:30']
    }
  },
  {
    id: 'exhibitor-4',
    name: 'TOFT',
    tagline: 'Timber-Craft & Textile Innovation',
    description: 'TOFT brings together heritage craftsmanship and contemporary design. Specializing in wooden craft tools, textile supplies, and innovative materials that bridge traditional and modern making. Discover quality tools and materials that inspire creative projects.',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    sector: 'Tools & Materials',
    tier: 'Silver',
    boothNumber: '20',
    contactInfo: {
      website: 'https://www.thestitchfestival.co.uk',
      email: 'info@toft.com',
      phone: '+44 (0) 1234 567 893'
    },
    resources: [
      {
        id: 'res-6',
        title: 'Tool Care & Maintenance',
        type: 'pdf',
        url: '#',
        size: '0.9 MB'
      }
    ],
    offers: [
      {
        id: 'offer-5',
        title: 'Free Tool Sharpening Service',
        description: 'Bring your tools to our booth for a complimentary sharpening and maintenance session.',
        code: 'TOOLCARE',
        expiry: '2026-03-31',
        isRedeemed: false
      }
    ],
    isBookmarked: false,
    isFeatured: false,
    rating: 4.6,
    totalRatings: 92,
    meetings: {
      available: true,
      slots: ['09:00', '12:30', '16:00']
    }
  },
  {
    id: 'exhibitor-5',
    name: 'Barnyarns',
    tagline: 'Quality Yarns & Fiber Crafts',
    description: 'Barnyarns is your premium destination for hand-dyed and specialty yarns. Featuring natural fibers, contemporary blends, and sustainable options perfect for knitting, crochet, and fiber arts. Expert staff available for fiber advice and project consultation.',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    sector: 'Yarn & Fiber',
    tier: 'Silver',
    boothNumber: '18',
    contactInfo: {
      website: 'https://www.thestitchfestival.co.uk',
      email: 'info@barnyarns.com',
      phone: '+44 (0) 1234 567 894'
    },
    resources: [
      {
        id: 'res-7',
        title: 'Yarn Care Instructions',
        type: 'pdf',
        url: '#',
        size: '0.8 MB'
      }
    ],
    offers: [
      {
        id: 'offer-6',
        title: 'Free Yarn Sample Pack',
        description: 'Take home a free sample pack of our latest hand-dyed colors and fiber blends.',
        code: 'YARNSAMPLES',
        expiry: '2026-03-31',
        isRedeemed: false
      }
    ],
    isBookmarked: false,
    isFeatured: false,
    rating: 4.5,
    totalRatings: 78,
    meetings: {
      available: false,
      slots: []
    }
  }
];

const sectors = ['All', 'Fabrics', 'Yarn & Fiber', 'Notions & Accessories', 'Tools & Materials'];
const tiers = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];

export default function Exhibitors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null);
  const [exhibitors, setExhibitors] = useState(mockExhibitors);

  const filteredExhibitors = useMemo(() => {
    return exhibitors.filter(exhibitor => {
      const matchesSearch = exhibitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exhibitor.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exhibitor.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || exhibitor.sector === selectedSector;
      const matchesTier = selectedTier === 'All' || exhibitor.tier === selectedTier;

      return matchesSearch && matchesSector && matchesTier;
    });
  }, [exhibitors, searchQuery, selectedSector, selectedTier]);

  const toggleBookmark = (exhibitorId: string) => {
    setExhibitors(prev =>
      prev.map(exhibitor =>
        exhibitor.id === exhibitorId
          ? { ...exhibitor, isBookmarked: !exhibitor.isBookmarked }
          : exhibitor
      )
    );
  };

  const redeemOffer = (exhibitorId: string, offerId: string) => {
    setExhibitors(prev =>
      prev.map(exhibitor =>
        exhibitor.id === exhibitorId
          ? {
              ...exhibitor,
              offers: exhibitor.offers.map(offer =>
                offer.id === offerId ? { ...offer, isRedeemed: true } : offer
              )
            }
          : exhibitor
      )
    );
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-gray-200 text-gray-800';
      case 'Gold':
        return 'bg-yellow-200 text-yellow-800';
      case 'Silver':
        return 'bg-gray-100 text-gray-600';
      case 'Bronze':
        return 'bg-orange-200 text-orange-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Festival Exhibitors</h1>
          <p className="text-primary-foreground/80">Discover premium fabrics, yarns, tools, and craft supplies with exclusive festival offers</p>
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <span className="flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              {filteredExhibitors.length} Exhibitors
            </span>
            <span className="flex items-center">
              <Gift className="w-4 h-4 mr-1" />
              {exhibitors.reduce((acc, ex) => acc + ex.offers.length, 0)} Offers
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
              placeholder="Search exhibitors, fabrics, yarns, or booth numbers..."
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
                <h3 className="font-medium text-foreground mb-2">Sector</h3>
                <div className="flex flex-wrap gap-2">
                  {sectors.map(sector => (
                    <button
                      key={sector}
                      onClick={() => setSelectedSector(sector)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm border transition-colors",
                        selectedSector === sector
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Sponsorship Tier</h3>
                <div className="flex flex-wrap gap-2">
                  {tiers.map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm border transition-colors",
                        selectedTier === tier
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exhibitors Grid/List */}
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredExhibitors.map(exhibitor => (
            <div
              key={exhibitor.id}
              className={cn(
                "bg-card rounded-xl border border-border hover:border-primary/50 transition-all",
                viewMode === 'list' ? "flex items-center space-x-6 p-4" : "p-6 flex flex-col items-center text-center"
              )}
            >
              {viewMode === 'grid' ? (
                <>
                  <img
                    src={exhibitor.logo}
                    alt={exhibitor.name}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                    className="w-20 h-20 rounded-lg object-cover mb-3"
                  />

                  <div className="w-full">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground">{exhibitor.name}</h3>
                      {exhibitor.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{exhibitor.tagline}</p>

                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full", getTierColor(exhibitor.tier))}>
                        {exhibitor.tier}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        Booth #{exhibitor.boothNumber}
                      </span>
                      {exhibitor.offers.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <Gift className="w-3 h-3 mr-1" />
                          {exhibitor.offers.length} offer{exhibitor.offers.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{exhibitor.description}</p>

                    <div className={cn(
                      "flex items-center",
                      viewMode === 'grid' ? 'flex-col justify-center gap-3' : 'justify-between'
                    )}>
                      {viewMode === 'grid' ? (
                        <>
                          <div className="flex items-center space-x-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{exhibitor.rating}</span>
                            <span className="text-muted-foreground">({exhibitor.totalRatings} reviews)</span>
                          </div>

                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setSelectedExhibitor(exhibitor)}
                              className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm hover:bg-primary/90 transition-colors min-w-[72px]"
                            >
                              View
                            </button>
                            <NavLink
                              to="/messages"
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </NavLink>
                            <NavLink
                              to="/floor-plan"
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                            >
                              <MapPin className="w-4 h-4" />
                            </NavLink>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{exhibitor.rating}</span>
                            <span className="text-muted-foreground">({exhibitor.totalRatings} reviews)</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedExhibitor(exhibitor)}
                              className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm hover:bg-primary/90 transition-colors min-w-[72px]"
                            >
                              View
                            </button>
                            <NavLink
                              to="/messages"
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </NavLink>
                            <NavLink
                              to="/floor-plan"
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                            >
                              <MapPin className="w-4 h-4" />
                            </NavLink>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0">
                    <img
                      src={exhibitor.logo}
                      alt={exhibitor.name}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground truncate">{exhibitor.name}</h3>
                      {exhibitor.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{exhibitor.tagline}</p>

                    <div className="flex items-center space-x-3 mt-2">
                      <span className={cn("text-xs px-2 py-1 rounded-full", getTierColor(exhibitor.tier))}>
                        {exhibitor.tier}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        Booth #{exhibitor.boothNumber}
                      </span>
                      {exhibitor.offers.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <Gift className="w-3 h-3 mr-1" />
                          {exhibitor.offers.length} offer{exhibitor.offers.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{exhibitor.description}</p>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => toggleBookmark(exhibitor.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        exhibitor.isBookmarked
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {exhibitor.isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredExhibitors.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No exhibitors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find exhibitors.
            </p>
          </div>
        )}
      </div>

      {/* Exhibitor Detail Modal */}
      {selectedExhibitor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Exhibitor Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedExhibitor.logo}
                    alt={selectedExhibitor.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">{selectedExhibitor.name}</h2>
                      {selectedExhibitor.isFeatured && (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{selectedExhibitor.tagline}</p>
                    <div className="flex items-center space-x-2">
                      <span className={cn("text-sm px-3 py-1 rounded-full", getTierColor(selectedExhibitor.tier))}>
                        {selectedExhibitor.tier} Sponsor
                      </span>
                      <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                        Booth #{selectedExhibitor.boothNumber}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExhibitor(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">About</h3>
                    <p className="text-muted-foreground">{selectedExhibitor.description}</p>
                  </div>

                  {/* Offers */}
                  {selectedExhibitor.offers.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Exclusive Offers</h3>
                      <div className="space-y-4">
                        {selectedExhibitor.offers.map(offer => (
                          <div key={offer.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-foreground mb-1">{offer.title}</h4>
                                <p className="text-sm text-muted-foreground">{offer.description}</p>
                              </div>
                              {offer.discount && (
                                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                                  {offer.discount} OFF
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Tag className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-mono bg-muted px-2 py-1 rounded">{offer.code}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>Expires: {new Date(offer.expiry).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => redeemOffer(selectedExhibitor.id, offer.id)}
                                disabled={offer.isRedeemed}
                                className={cn(
                                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                  offer.isRedeemed
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                              >
                                {offer.isRedeemed ? 'Redeemed' : 'Redeem Offer'}
                              </button>
                            </div>

                            {offer.terms && (
                              <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">
                                {offer.terms}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {selectedExhibitor.resources.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Resources</h3>
                      <div className="space-y-3">
                        {selectedExhibitor.resources.map(resource => (
                          <div key={resource.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Download className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium text-foreground">{resource.title}</h4>
                                {resource.size && (
                                  <span className="text-xs text-muted-foreground">{resource.size}</span>
                                )}
                              </div>
                            </div>
                            <button className="text-primary hover:text-primary/80 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Contact</h3>
                    <div className="space-y-3">
                      {selectedExhibitor.contactInfo.website && (
                        <a
                          href={selectedExhibitor.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                      {selectedExhibitor.contactInfo.email && (
                        <a
                          href={`mailto:${selectedExhibitor.contactInfo.email}`}
                          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </a>
                      )}
                      {selectedExhibitor.contactInfo.phone && (
                        <a
                          href={`tel:${selectedExhibitor.contactInfo.phone}`}
                          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Meeting Booking */}
                  {selectedExhibitor.meetings?.available && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Book a Meeting</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-3">
                          Available time slots:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedExhibitor.meetings.slots.map(slot => (
                            <button
                              key={slot}
                              className="bg-primary text-primary-foreground py-2 px-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleBookmark(selectedExhibitor.id)}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2",
                        selectedExhibitor.isBookmarked
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-card border border-border text-foreground hover:bg-muted"
                      )}
                    >
                      {selectedExhibitor.isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                      <span>{selectedExhibitor.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>

                    <NavLink
                      to="/messages"
                      className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Send Message</span>
                    </NavLink>

                    <NavLink
                      to="/floor-plan"
                      className="w-full bg-card border border-border text-foreground py-3 px-4 rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center space-x-2"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>View on Map</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
