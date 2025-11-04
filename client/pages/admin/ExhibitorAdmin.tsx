import { useState } from 'react';
import { 
  Building2,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Gift,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Calendar,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Exhibitor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  boothNumber: string;
  status: 'active' | 'inactive' | 'pending';
  contactInfo: {
    website?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
  };
  engagementScore: number;
  stats: {
    profileViews: number;
    boothVisits: number;
    messagesSent: number;
    offersRedeemed: number;
    documentsDownloaded: number;
  };
  offers: ExhibitorOffer[];
  documents: ExhibitorDocument[];
  createdAt: string;
  lastActive: string;
}

interface ExhibitorOffer {
  id: string;
  title: string;
  description: string;
  image?: string;
  discount?: string;
  code: string;
  validUntil: string;
  redemptions: number;
  maxRedemptions?: number;
  isActive: boolean;
}

interface ExhibitorDocument {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'video' | 'link';
  url: string;
  size?: string;
  uploadedAt: string;
  downloads: number;
}

const mockExhibitors: Exhibitor[] = [
  {
    id: 'exhibitor-1',
    name: 'Fabric Godmother',
    tagline: 'Premium Dressmaking Fabrics & Patterns',
    description: 'Premium provider of dressmaking fabrics, patterns, and notions for seamstresses and textile enthusiasts of all skill levels.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    tier: 'Platinum',
    boothNumber: '23',
    status: 'active',
    contactInfo: {
      website: 'https://fabricgodmother.com',
      email: 'info@fabricgodmother.com',
      phone: '+44 (20) 7123 4567',
      linkedIn: 'https://linkedin.com/company/fabric-godmother'
    },
    engagementScore: 94,
    stats: {
      profileViews: 1247,
      boothVisits: 892,
      messagesSent: 156,
      offersRedeemed: 67,
      documentsDownloaded: 234
    },
    offers: [
      {
        id: 'offer-1',
        title: '20% Off Fabric Bundle',
        description: 'Get 20% discount on any fabric bundle purchase at our booth',
        discount: '20%',
        code: 'STITCH20',
        validUntil: '2024-04-30',
        redemptions: 45,
        maxRedemptions: 100,
        isActive: true
      }
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'Spring Fabric Collection Lookbook',
        type: 'pdf',
        url: '#',
        size: '2.4 MB',
        uploadedAt: '2024-03-10T10:00:00Z',
        downloads: 156
      },
      {
        id: 'doc-2',
        title: 'Dressmaking Techniques Guide',
        type: 'video',
        url: '#',
        size: '45.2 MB',
        uploadedAt: '2024-03-08T14:30:00Z',
        downloads: 89
      }
    ],
    createdAt: '2024-02-15T09:00:00Z',
    lastActive: '2024-03-15T11:30:00Z'
  },
  {
    id: 'exhibitor-2',
    name: 'Higgs & Higgs',
    tagline: 'Craft Essentials & Quality Accessories',
    description: 'Complete craft essentials and quality accessories for stitching, sewing, and textile arts including notions, threads, and trimmings.',
    logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&h=100&fit=crop',
    tier: 'Gold',
    boothNumber: '15',
    status: 'active',
    contactInfo: {
      website: 'https://higgshiggs.co.uk',
      email: 'sales@higgshiggs.co.uk'
    },
    engagementScore: 78,
    stats: {
      profileViews: 856,
      boothVisits: 423,
      messagesSent: 89,
      offersRedeemed: 23,
      documentsDownloaded: 145
    },
    offers: [],
    documents: [
      {
        id: 'doc-3',
        title: 'Notions & Accessories Catalog',
        type: 'pdf',
        url: '#',
        size: '1.8 MB',
        uploadedAt: '2024-03-12T16:00:00Z',
        downloads: 67
      }
    ],
    createdAt: '2024-02-20T11:00:00Z',
    lastActive: '2024-03-15T09:45:00Z'
  }
];

export default function ExhibitorAdmin() {
  const [exhibitors, setExhibitors] = useState(mockExhibitors);
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'offers' | 'documents' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [exhibitorForm, setExhibitorForm] = useState({
    name: '',
    tagline: '',
    description: '',
    tier: 'Silver' as Exhibitor['tier'],
    boothNumber: '',
    contactInfo: {
      website: '',
      email: '',
      phone: '',
      linkedIn: ''
    }
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    code: '',
    validUntil: '',
    maxRedemptions: ''
  });

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exhibitor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || exhibitor.tier === filterTier;
    const matchesStatus = filterStatus === 'all' || exhibitor.status === filterStatus;
    
    return matchesSearch && matchesTier && matchesStatus;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'pending':
        return 'bg-yellow-500 text-yellow-900';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'video':
        return <ExternalLink className="w-4 h-4 text-blue-500" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-green-500" />;
      default:
        return <ExternalLink className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleSaveExhibitor = () => {
    if (selectedExhibitor) {
      setExhibitors(prev => 
        prev.map(exhibitor => 
          exhibitor.id === selectedExhibitor.id 
            ? { 
                ...exhibitor, 
                ...exhibitorForm,
                lastActive: new Date().toISOString()
              }
            : exhibitor
        )
      );
    } else {
      const newExhibitor: Exhibitor = {
        id: `exhibitor-${Date.now()}`,
        ...exhibitorForm,
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        status: 'active',
        engagementScore: 0,
        stats: {
          profileViews: 0,
          boothVisits: 0,
          messagesSent: 0,
          offersRedeemed: 0,
          documentsDownloaded: 0
        },
        offers: [],
        documents: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      setExhibitors(prev => [newExhibitor, ...prev]);
    }
    setShowCreateModal(false);
    setSelectedExhibitor(null);
  };

  const handleAddOffer = () => {
    if (!selectedExhibitor) return;

    const newOffer: ExhibitorOffer = {
      id: `offer-${Date.now()}`,
      ...offerForm,
      maxRedemptions: offerForm.maxRedemptions ? parseInt(offerForm.maxRedemptions) : undefined,
      redemptions: 0,
      isActive: true
    };

    setExhibitors(prev => 
      prev.map(exhibitor => 
        exhibitor.id === selectedExhibitor.id 
          ? { ...exhibitor, offers: [...exhibitor.offers, newOffer] }
          : exhibitor
      )
    );

    setShowOfferModal(false);
    setOfferForm({
      title: '',
      description: '',
      discount: '',
      code: '',
      validUntil: '',
      maxRedemptions: ''
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalStats = () => {
    return exhibitors.reduce((acc, exhibitor) => ({
      profileViews: acc.profileViews + exhibitor.stats.profileViews,
      boothVisits: acc.boothVisits + exhibitor.stats.boothVisits,
      messagesSent: acc.messagesSent + exhibitor.stats.messagesSent,
      offersRedeemed: acc.offersRedeemed + exhibitor.stats.offersRedeemed
    }), { profileViews: 0, boothVisits: 0, messagesSent: 0, offersRedeemed: 0 });
  };

  const totalStats = calculateTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exhibitor Management</h1>
          <p className="text-muted-foreground">Manage exhibitor profiles, offers, and engagement</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exhibitor</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{exhibitors.length}</p>
              <p className="text-sm text-muted-foreground">Total Exhibitors</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStats.profileViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Profile Views</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStats.messagesSent}</p>
              <p className="text-sm text-muted-foreground">Messages Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Gift className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStats.offersRedeemed}</p>
              <p className="text-sm text-muted-foreground">Offers Redeemed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exhibitors List */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search exhibitors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Tiers</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredExhibitors.map(exhibitor => (
              <div
                key={exhibitor.id}
                className={cn(
                  "p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer",
                  selectedExhibitor?.id === exhibitor.id && "bg-muted"
                )}
                onClick={() => setSelectedExhibitor(exhibitor)}
              >
                <div className="flex items-start space-x-4">
                  <img 
                    src={exhibitor.logo} 
                    alt={exhibitor.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground">{exhibitor.name}</h3>
                      <span className={cn("text-xs px-2 py-1 rounded-full", getTierColor(exhibitor.tier))}>
                        {exhibitor.tier}
                      </span>
                      <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(exhibitor.status))}>
                        {exhibitor.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exhibitor.tagline}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Booth #{exhibitor.boothNumber}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {exhibitor.engagementScore}% engagement
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {exhibitor.stats.profileViews} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exhibitor Details */}
        <div className="bg-card rounded-lg border border-border">
          {selectedExhibitor ? (
            <div className="p-4">
              {/* Tabs */}
              <div className="flex space-x-1 mb-4">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'offers', label: 'Offers' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'analytics', label: 'Analytics' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-3 py-1 text-xs rounded transition-colors",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedExhibitor.logo} 
                      alt={selectedExhibitor.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedExhibitor.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedExhibitor.tagline}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-background p-3 rounded">
                      <p className="text-muted-foreground">Profile Views</p>
                      <p className="font-semibold">{selectedExhibitor.stats.profileViews}</p>
                    </div>
                    <div className="bg-background p-3 rounded">
                      <p className="text-muted-foreground">Booth Visits</p>
                      <p className="font-semibold">{selectedExhibitor.stats.boothVisits}</p>
                    </div>
                    <div className="bg-background p-3 rounded">
                      <p className="text-muted-foreground">Messages</p>
                      <p className="font-semibold">{selectedExhibitor.stats.messagesSent}</p>
                    </div>
                    <div className="bg-background p-3 rounded">
                      <p className="text-muted-foreground">Offers Redeemed</p>
                      <p className="font-semibold">{selectedExhibitor.stats.offersRedeemed}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground">Last Active</p>
                    <p>{formatDate(selectedExhibitor.lastActive)}</p>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Profile Information</h4>
                    <button
                      onClick={() => {
                        setExhibitorForm({
                          name: selectedExhibitor.name,
                          tagline: selectedExhibitor.tagline,
                          description: selectedExhibitor.description,
                          tier: selectedExhibitor.tier,
                          boothNumber: selectedExhibitor.boothNumber,
                          contactInfo: selectedExhibitor.contactInfo
                        });
                        setShowCreateModal(true);
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Description</p>
                      <p>{selectedExhibitor.description}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tier</p>
                      <span className={cn("text-xs px-2 py-1 rounded-full", getTierColor(selectedExhibitor.tier))}>
                        {selectedExhibitor.tier}
                      </span>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Booth Number</p>
                      <p>#{selectedExhibitor.boothNumber}</p>
                    </div>
                    {selectedExhibitor.contactInfo.website && (
                      <div>
                        <p className="text-muted-foreground">Website</p>
                        <a href={selectedExhibitor.contactInfo.website} className="text-primary hover:underline">
                          {selectedExhibitor.contactInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'offers' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Offers ({selectedExhibitor.offers.length})</h4>
                    <button
                      onClick={() => setShowOfferModal(true)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedExhibitor.offers.map(offer => (
                      <div key={offer.id} className="bg-background p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-sm">{offer.title}</h5>
                          <div className="flex items-center space-x-1">
                            {offer.discount && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {offer.discount} OFF
                              </span>
                            )}
                            <span className={cn(
                              "text-xs px-2 py-1 rounded",
                              offer.isActive ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              {offer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{offer.description}</p>
                        <div className="flex justify-between text-xs">
                          <span>Code: {offer.code}</span>
                          <span>{offer.redemptions}/{offer.maxRedemptions || '∞'} used</span>
                        </div>
                      </div>
                    ))}
                    
                    {selectedExhibitor.offers.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No offers created yet
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Documents ({selectedExhibitor.documents.length})</h4>
                    <button className="text-primary hover:text-primary/80">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedExhibitor.documents.map(doc => (
                      <div key={doc.id} className="bg-background p-3 rounded">
                        <div className="flex items-start space-x-3">
                          {getDocumentIcon(doc.type)}
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{doc.title}</h5>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{doc.size}</span>
                              <span>{doc.downloads} downloads</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {selectedExhibitor.documents.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No documents uploaded yet
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Engagement Analytics</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-background p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Engagement Score</span>
                        <span className="font-semibold">{selectedExhibitor.engagementScore}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${selectedExhibitor.engagementScore}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-background p-2 rounded text-center">
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-semibold">{selectedExhibitor.stats.profileViews}</p>
                      </div>
                      <div className="bg-background p-2 rounded text-center">
                        <p className="text-muted-foreground">Visits</p>
                        <p className="font-semibold">{selectedExhibitor.stats.boothVisits}</p>
                      </div>
                      <div className="bg-background p-2 rounded text-center">
                        <p className="text-muted-foreground">Messages</p>
                        <p className="font-semibold">{selectedExhibitor.stats.messagesSent}</p>
                      </div>
                      <div className="bg-background p-2 rounded text-center">
                        <p className="text-muted-foreground">Downloads</p>
                        <p className="font-semibold">{selectedExhibitor.stats.documentsDownloaded}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Select an exhibitor to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Exhibitor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedExhibitor ? 'Edit Exhibitor' : 'Add New Exhibitor'}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
                    <input
                      type="text"
                      value={exhibitorForm.name}
                      onChange={(e) => setExhibitorForm({...exhibitorForm, name: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Booth Number</label>
                    <input
                      type="text"
                      value={exhibitorForm.boothNumber}
                      onChange={(e) => setExhibitorForm({...exhibitorForm, boothNumber: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tagline</label>
                  <input
                    type="text"
                    value={exhibitorForm.tagline}
                    onChange={(e) => setExhibitorForm({...exhibitorForm, tagline: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    value={exhibitorForm.description}
                    onChange={(e) => setExhibitorForm({...exhibitorForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Sponsorship Tier</label>
                  <select
                    value={exhibitorForm.tier}
                    onChange={(e) => setExhibitorForm({...exhibitorForm, tier: e.target.value as any})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Website</label>
                    <input
                      type="url"
                      value={exhibitorForm.contactInfo.website}
                      onChange={(e) => setExhibitorForm({
                        ...exhibitorForm, 
                        contactInfo: {...exhibitorForm.contactInfo, website: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={exhibitorForm.contactInfo.email}
                      onChange={(e) => setExhibitorForm({
                        ...exhibitorForm, 
                        contactInfo: {...exhibitorForm.contactInfo, email: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExhibitor}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {selectedExhibitor ? 'Update' : 'Create'} Exhibitor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Add New Offer</h3>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Discount</label>
                    <input
                      type="text"
                      value={offerForm.discount}
                      onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})}
                      placeholder="50%"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Promo Code</label>
                    <input
                      type="text"
                      value={offerForm.code}
                      onChange={(e) => setOfferForm({...offerForm, code: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Valid Until</label>
                    <input
                      type="date"
                      value={offerForm.validUntil}
                      onChange={(e) => setOfferForm({...offerForm, validUntil: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Max Uses</label>
                    <input
                      type="number"
                      value={offerForm.maxRedemptions}
                      onChange={(e) => setOfferForm({...offerForm, maxRedemptions: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOffer}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
