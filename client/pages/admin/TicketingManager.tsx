import { useState } from 'react';
import { 
  Ticket,
  QrCode,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  MoreVertical,
  Users,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Scan,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketType {
  id: string;
  name: string;
  event: string;
  price: number;
  currency: string;
  sold: number;
  available: number;
  status: 'active' | 'paused' | 'sold_out' | 'ended';
  validFrom: string;
  validUntil: string;
}

interface QRScan {
  id: string;
  ticketId: string;
  attendeeName: string;
  scanTime: string;
  location: string;
  scanner: string;
  status: 'valid' | 'invalid' | 'already_used' | 'expired';
}

const mockTicketTypes: TicketType[] = [
  {
    id: '1',
    name: 'VIP Pass',
    event: 'The Stitch Festival March 2026',
    price: 299,
    currency: 'GBP',
    sold: 45,
    available: 5,
    status: 'active',
    validFrom: '2025-10-09T08:00:00Z',
    validUntil: '2025-10-09T18:00:00Z'
  },
  {
    id: '2',
    name: 'Standard Access',
    event: 'The Stitch Festival March 2026',
    price: 199,
    currency: 'GBP',
    sold: 387,
    available: 13,
    status: 'active',
    validFrom: '2025-10-09T09:00:00Z',
    validUntil: '2025-10-09T17:00:00Z'
  },
  {
    id: '3',
    name: 'Festival Gala Dinner',
    event: 'The Stitch Festival March 2026',
    price: 149,
    currency: 'GBP',
    sold: 298,
    available: 102,
    status: 'active',
    validFrom: '2025-11-19T18:00:00Z',
    validUntil: '2025-11-19T23:00:00Z'
  }
];

const mockQRScans: QRScan[] = [
  {
    id: '1',
    ticketId: 'TKT-001',
    attendeeName: 'Sarah Johnson',
    scanTime: '2024-01-15T09:15:00Z',
    location: 'Main Entrance',
    scanner: 'Gate Scanner 1',
    status: 'valid'
  },
  {
    id: '2',
    ticketId: 'TKT-002',
    attendeeName: 'Michael Chen',
    scanTime: '2024-01-15T09:18:00Z',
    location: 'VIP Entrance',
    scanner: 'Gate Scanner 2',
    status: 'valid'
  },
  {
    id: '3',
    ticketId: 'TKT-003',
    attendeeName: 'Emma Wilson',
    scanTime: '2024-01-15T09:22:00Z',
    location: 'Main Entrance',
    scanner: 'Gate Scanner 1',
    status: 'already_used'
  }
];

export default function TicketingManager() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'scans' | 'analytics'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'paused': return 'text-yellow-600 bg-yellow-50';
      case 'sold_out': return 'text-red-600 bg-red-50';
      case 'ended': return 'text-gray-600 bg-gray-50';
      case 'valid': return 'text-green-600 bg-green-50';
      case 'invalid': return 'text-red-600 bg-red-50';
      case 'already_used': return 'text-yellow-600 bg-yellow-50';
      case 'expired': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'sold_out': return 'Sold Out';
      case 'ended': return 'Ended';
      case 'valid': return 'Valid';
      case 'invalid': return 'Invalid';
      case 'already_used': return 'Already Used';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const tabs = [
    { id: 'tickets', label: 'Ticket Types', icon: Ticket },
    { id: 'scans', label: 'QR Scans', icon: QrCode },
    { id: 'analytics', label: 'Analytics', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ticketing & QR Management</h1>
          <p className="text-muted-foreground">Manage ticket types, QR code scanning, and access control</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Ticket Type</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tickets Sold</p>
              <p className="text-2xl font-bold text-foreground">730</p>
            </div>
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
            <span>+12%</span>
            <span>vs last event</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">QR Scans Today</p>
              <p className="text-2xl font-bold text-foreground">423</p>
            </div>
            <Scan className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600">
            <span>Live tracking</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-foreground">£156,240</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
            <span>+8%</span>
            <span>vs target</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Scanners</p>
              <p className="text-2xl font-bold text-foreground">8</p>
            </div>
            <QrCode className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-purple-600">
            <CheckCircle className="w-4 h-4" />
            <span>All online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search ticket types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Ticket Types Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Ticket Type</th>
                    <th className="text-left p-4 font-medium text-foreground">Event</th>
                    <th className="text-left p-4 font-medium text-foreground">Price</th>
                    <th className="text-left p-4 font-medium text-foreground">Sold/Available</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Valid Period</th>
                    <th className="text-left p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTicketTypes.map((ticket) => (
                    <tr key={ticket.id} className="border-t border-border">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{ticket.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">{ticket.event}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">
                          {ticket.currency} {ticket.price}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <span className="font-medium text-foreground">{ticket.sold}</span>
                          <span className="text-muted-foreground"> / {ticket.available}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(ticket.sold / (ticket.sold + ticket.available)) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusColor(ticket.status)
                        )}>
                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          <div>{new Date(ticket.validFrom).toLocaleDateString()}</div>
                          <div>{new Date(ticket.validUntil).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-muted rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg">
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scans' && (
        <div className="space-y-6">
          {/* Scanner Status */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Scanner Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Gate Scanner 1', 'Gate Scanner 2', 'VIP Entrance', 'Session Hall A'].map((scanner, index) => (
                <div key={scanner} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{scanner}</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Scans */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Recent QR Scans</h3>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Ticket ID</th>
                    <th className="text-left p-4 font-medium text-foreground">Attendee</th>
                    <th className="text-left p-4 font-medium text-foreground">Scan Time</th>
                    <th className="text-left p-4 font-medium text-foreground">Location</th>
                    <th className="text-left p-4 font-medium text-foreground">Scanner</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockQRScans.map((scan) => (
                    <tr key={scan.id} className="border-t border-border">
                      <td className="p-4">
                        <div className="font-mono text-sm">{scan.ticketId}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">{scan.attendeeName}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(scan.scanTime).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">{scan.location}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">{scan.scanner}</div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusColor(scan.status)
                        )}>
                          {getStatusLabel(scan.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Chart Placeholder */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Ticket Sales Over Time</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>

            {/* Scan Frequency */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Scan Frequency</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Top Performing Tickets */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Ticket Types</h3>
            <div className="space-y-4">
              {mockTicketTypes.map((ticket, index) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{ticket.name}</p>
                      <p className="text-sm text-muted-foreground">{ticket.event}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{ticket.sold} sold</p>
                    <p className="text-sm text-muted-foreground">£{(ticket.sold * ticket.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
