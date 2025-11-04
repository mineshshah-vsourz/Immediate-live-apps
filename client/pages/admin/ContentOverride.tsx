import { useState } from 'react';
import { 
  Edit3,
  Eye,
  Save,
  Plus,
  Trash2,
  Clock,
  Globe,
  Lock,
  Code,
  Type,
  Image,
  Link2,
  AlertTriangle,
  CheckCircle,
  History,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentOverride {
  id: string;
  title: string;
  type: 'banner' | 'message' | 'update' | 'page' | 'popup';
  status: 'draft' | 'active' | 'expired' | 'scheduled';
  content: {
    title: string;
    body: string;
    cta?: {
      text: string;
      url: string;
    };
    image?: string;
  };
  target: 'all' | 'delegates' | 'exhibitors' | 'speakers';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishDate?: string;
  expiryDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  content: any;
  createdBy: string;
  createdAt: string;
  comment: string;
}

const mockContent: ContentOverride[] = [
  {
    id: 'content-1',
    title: 'Event Schedule Update',
    type: 'banner',
    status: 'active',
    content: {
      title: 'Schedule Change Notice',
      body: 'Please note that the Hand-Stitching Techniques workshop has been moved to Room B due to high demand.',
      cta: {
        text: 'View Updated Schedule',
        url: '/agenda'
      }
    },
    target: 'all',
    priority: 'high',
    publishDate: '2024-03-15T09:00:00Z',
    expiryDate: '2024-03-15T18:00:00Z',
    createdBy: 'Admin User',
    createdAt: '2024-03-15T08:30:00Z',
    updatedAt: '2024-03-15T08:45:00Z',
    version: 2
  },
  {
    id: 'content-2',
    title: 'Networking Reception',
    type: 'popup',
    status: 'scheduled',
    content: {
      title: 'VIP Networking Reception',
      body: 'Join us for an exclusive networking reception with industry leaders tonight at 6 PM.',
      cta: {
        text: 'RSVP Now',
        url: '/networking-rsvp'
      },
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    },
    target: 'delegates',
    priority: 'medium',
    publishDate: '2024-03-15T16:00:00Z',
    expiryDate: '2024-03-15T20:00:00Z',
    createdBy: 'Marketing Team',
    createdAt: '2024-03-14T15:20:00Z',
    updatedAt: '2024-03-14T15:20:00Z',
    version: 1
  },
  {
    id: 'content-3',
    title: 'Emergency Contact Info',
    type: 'message',
    status: 'draft',
    content: {
      title: 'Emergency Procedures',
      body: 'In case of emergency, please contact venue security at extension 911 or proceed to the nearest exit.',
    },
    target: 'all',
    priority: 'urgent',
    createdBy: 'Safety Team',
    createdAt: '2024-03-15T07:15:00Z',
    updatedAt: '2024-03-15T07:15:00Z',
    version: 1
  }
];

const mockVersions: ContentVersion[] = [
  {
    id: 'version-1',
    contentId: 'content-1',
    version: 1,
    content: { title: 'Schedule Update', body: 'Session time changed.' },
    createdBy: 'Admin User',
    createdAt: '2024-03-15T08:30:00Z',
    comment: 'Initial version'
  },
  {
    id: 'version-2',
    contentId: 'content-1',
    version: 2,
    content: { title: 'Schedule Change Notice', body: 'Please note that the Hand-Stitching Techniques workshop has been moved to Room B due to high demand.' },
    createdBy: 'Admin User',
    createdAt: '2024-03-15T08:45:00Z',
    comment: 'Added more details and room change'
  }
];

const contentTemplates = [
  {
    id: 'banner-template',
    name: 'Event Banner',
    type: 'banner',
    template: {
      title: 'Important Announcement',
      body: 'Your announcement message here...',
      cta: { text: 'Learn More', url: '' }
    }
  },
  {
    id: 'update-template',
    name: 'Schedule Update',
    type: 'update',
    template: {
      title: 'Schedule Change',
      body: 'Please note the following schedule change...'
    }
  },
  {
    id: 'emergency-template',
    name: 'Emergency Message',
    type: 'message',
    template: {
      title: 'Emergency Notice',
      body: 'Emergency information and instructions...'
    }
  }
];

export default function ContentOverride() {
  const [content, setContent] = useState(mockContent);
  const [selectedContent, setSelectedContent] = useState<ContentOverride | null>(null);
  const [editMode, setEditMode] = useState<'visual' | 'json'>('visual');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'banner' as ContentOverride['type'],
    target: 'all' as ContentOverride['target'],
    priority: 'medium' as ContentOverride['priority'],
    content: {
      title: '',
      body: '',
      cta: { text: '', url: '' },
      image: ''
    },
    publishDate: '',
    expiryDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'scheduled':
        return 'bg-blue-500 text-white';
      case 'expired':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-yellow-500 text-yellow-900';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return <Type className="w-4 h-4" />;
      case 'popup':
        return <Globe className="w-4 h-4" />;
      case 'message':
        return <AlertTriangle className="w-4 h-4" />;
      case 'update':
        return <Clock className="w-4 h-4" />;
      default:
        return <Edit3 className="w-4 h-4" />;
    }
  };

  const handleSave = () => {
    if (selectedContent) {
      setContent(prev => 
        prev.map(item => 
          item.id === selectedContent.id 
            ? { 
                ...item, 
                content: formData.content,
                updatedAt: new Date().toISOString(),
                version: item.version + 1
              }
            : item
        )
      );
    } else {
      const newContent: ContentOverride = {
        id: `content-${Date.now()}`,
        title: formData.title,
        type: formData.type,
        status: 'draft',
        content: formData.content,
        target: formData.target,
        priority: formData.priority,
        publishDate: formData.publishDate,
        expiryDate: formData.expiryDate,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      setContent(prev => [newContent, ...prev]);
    }
    setSelectedContent(null);
    setShowCreateModal(false);
  };

  const handlePublish = (contentId: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'active' as const }
          : item
      )
    );
  };

  const handleDelete = (contentId: string) => {
    setContent(prev => prev.filter(item => item.id !== contentId));
  };

  const loadTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      type: template.type,
      content: { ...prev.content, ...template.template }
    }));
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Override</h1>
          <p className="text-muted-foreground">Emergency CMS for live content updates</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Override</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['active', 'scheduled', 'draft', 'expired'].map(status => {
          const count = content.filter(item => item.status === status).length;
          return (
            <div key={status} className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                </div>
                <div className={cn("w-3 h-3 rounded-full", 
                  status === 'active' ? 'bg-success' :
                  status === 'scheduled' ? 'bg-blue-500' :
                  status === 'draft' ? 'bg-yellow-500' : 'bg-muted'
                )} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Content Overrides</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Content</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Target</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Priority</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Schedule</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {content.map(item => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.content.body}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        v{item.version} • {item.createdBy}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm capitalize">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(item.status))}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm capitalize">{item.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full", getPriorityColor(item.priority))}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.publishDate && (
                      <div>Publish: {formatDateTime(item.publishDate)}</div>
                    )}
                    {item.expiryDate && (
                      <div>Expire: {formatDateTime(item.expiryDate)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedContent(item);
                          setFormData({
                            title: item.title,
                            type: item.type,
                            target: item.target,
                            priority: item.priority,
                            content: item.content,
                            publishDate: item.publishDate || '',
                            expiryDate: item.expiryDate || ''
                          });
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setPreviewMode(true)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {item.status === 'draft' && (
                        <button
                          onClick={() => handlePublish(item.id)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Publish"
                        >
                          <CheckCircle className="w-4 h-4 text-success" />
                        </button>
                      )}
                      <button
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Version History"
                      >
                        <History className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || selectedContent) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedContent ? 'Edit Content Override' : 'Create Content Override'}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setEditMode('visual')}
                      className={cn(
                        "px-3 py-1 rounded text-sm transition-colors",
                        editMode === 'visual' ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Type className="w-4 h-4 mr-1 inline" />
                      Visual
                    </button>
                    <button
                      onClick={() => setEditMode('json')}
                      className={cn(
                        "px-3 py-1 rounded text-sm transition-colors",
                        editMode === 'json' ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Code className="w-4 h-4 mr-1 inline" />
                      JSON
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedContent(null);
                      setShowCreateModal(false);
                    }}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Templates */}
              {!selectedContent && (
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Quick Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {contentTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => loadTemplate(template)}
                        className="p-3 text-left border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {getTypeIcon(template.type)}
                          <span className="font-medium text-foreground">{template.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {template.template.body.substring(0, 50)}...
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Content title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="banner">Banner</option>
                        <option value="popup">Popup</option>
                        <option value="message">Message</option>
                        <option value="update">Update</option>
                        <option value="page">Page</option>
                      </select>
                    </div>
                  </div>

                  {editMode === 'visual' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Content Title</label>
                        <input
                          type="text"
                          value={formData.content.title}
                          onChange={(e) => setFormData({
                            ...formData, 
                            content: {...formData.content, title: e.target.value}
                          })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Display title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Body Content</label>
                        <textarea
                          value={formData.content.body}
                          onChange={(e) => setFormData({
                            ...formData, 
                            content: {...formData.content, body: e.target.value}
                          })}
                          rows={4}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Content body text"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">CTA Text</label>
                          <input
                            type="text"
                            value={formData.content.cta?.text || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              content: {
                                ...formData.content, 
                                cta: {...formData.content.cta, text: e.target.value}
                              }
                            })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Button text"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">CTA URL</label>
                          <input
                            type="url"
                            value={formData.content.cta?.url || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              content: {
                                ...formData.content, 
                                cta: {...formData.content.cta, url: e.target.value}
                              }
                            })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">JSON Content</label>
                      <textarea
                        value={JSON.stringify(formData.content, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setFormData({...formData, content: parsed});
                          } catch (error) {
                            // Invalid JSON, don't update
                          }
                        }}
                        rows={10}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Target Audience</label>
                      <select
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: e.target.value as any})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="all">All Users</option>
                        <option value="delegates">Delegates</option>
                        <option value="exhibitors">Exhibitors</option>
                        <option value="speakers">Speakers</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Publish Date</label>
                      <input
                        type="datetime-local"
                        value={formData.publishDate}
                        onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Expiry Date</label>
                      <input
                        type="datetime-local"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Preview</h4>
                  <div className="border border-border rounded-lg p-4 bg-background">
                    {formData.type === 'banner' && (
                      <div className="bg-primary text-primary-foreground p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">{formData.content.title}</h3>
                        <p className="text-sm mb-3">{formData.content.body}</p>
                        {formData.content.cta?.text && (
                          <button className="bg-white text-primary px-3 py-1 rounded text-sm">
                            {formData.content.cta.text}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {formData.type === 'popup' && (
                      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
                        {formData.content.image && (
                          <img 
                            src={formData.content.image} 
                            alt="Content" 
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-foreground mb-2">{formData.content.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{formData.content.body}</p>
                        {formData.content.cta?.text && (
                          <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm">
                            {formData.content.cta.text}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {formData.type === 'message' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-yellow-800 mb-1">{formData.content.title}</h3>
                            <p className="text-sm text-yellow-700">{formData.content.body}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => {
                    setSelectedContent(null);
                    setShowCreateModal(false);
                  }}
                  className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save {selectedContent ? 'Changes' : 'Override'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
