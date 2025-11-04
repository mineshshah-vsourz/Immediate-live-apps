import { useState } from 'react';
import { 
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Phone,
  Building2,
  MoreVertical,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'exhibitor' | 'delegate' | 'speaker' | 'staff';
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  registrationDate: string;
  company?: string;
  phone?: string;
  eventAccess: string[];
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'delegate',
    status: 'active',
    lastLogin: '2024-03-15T10:30:00Z',
    registrationDate: '2024-02-20T09:00:00Z',
    company: 'Tech Innovations Inc.',
    phone: '+1 (555) 123-4567',
    eventAccess: ['the-stitch-festival'],
    permissions: ['view_agenda', 'book_meetings', 'message_attendees']
  },
  {
    id: 'user-2',
    name: 'Angela Daymond',
    email: 'angela@thestitchfestival.com',
    role: 'speaker',
    status: 'active',
    lastLogin: '2024-03-15T08:15:00Z',
    registrationDate: '2024-01-15T14:30:00Z',
    company: 'The Stitch Festival',
    eventAccess: ['the-stitch-festival'],
    permissions: ['view_agenda', 'manage_sessions', 'message_attendees', 'speaker_tools']
  },
  {
    id: 'user-3',
    name: 'Sophie Richardson',
    email: 'sophie@fabricgodmother.com',
    role: 'exhibitor',
    status: 'active',
    lastLogin: '2024-03-15T09:45:00Z',
    registrationDate: '2024-02-01T11:20:00Z',
    company: 'Fabric Godmother',
    eventAccess: ['the-stitch-festival'],
    permissions: ['view_agenda', 'manage_booth', 'message_attendees', 'create_offers']
  },
  {
    id: 'user-4',
    name: 'Admin User',
    email: 'admin@thestitchfestival.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-15T11:00:00Z',
    registrationDate: '2024-01-01T00:00:00Z',
    company: 'The Stitch Festival',
    eventAccess: ['the-stitch-festival'],
    permissions: ['full_access']
  },
  {
    id: 'user-5',
    name: 'Claire Tyler',
    email: 'claire@sewingschool.co.uk',
    role: 'speaker',
    status: 'active',
    lastLogin: '2024-03-10T16:20:00Z',
    registrationDate: '2024-02-05T13:45:00Z',
    company: 'West Sussex Sewing School',
    eventAccess: ['the-stitch-festival'],
    permissions: ['view_agenda', 'manage_sessions']
  }
];

const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and management capabilities',
    permissions: ['full_access'],
    userCount: 3
  },
  {
    id: 'exhibitor',
    name: 'Exhibitor',
    description: 'Booth management and attendee interaction',
    permissions: ['view_agenda', 'manage_booth', 'message_attendees', 'create_offers'],
    userCount: 28
  },
  {
    id: 'speaker',
    name: 'Speaker',
    description: 'Session management and attendee interaction',
    permissions: ['view_agenda', 'manage_sessions', 'message_attendees', 'speaker_tools'],
    userCount: 45
  },
  {
    id: 'delegate',
    name: 'Delegate',
    description: 'Standard attendee access',
    permissions: ['view_agenda', 'book_meetings', 'message_attendees'],
    userCount: 1247
  },
  {
    id: 'staff',
    name: 'Event Staff',
    description: 'Limited operational access',
    permissions: ['view_agenda', 'scan_tickets', 'check_in_attendees'],
    userCount: 12
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [roles] = useState(mockRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status } : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'speaker':
        return 'bg-purple-100 text-purple-800';
      case 'exhibitor':
        return 'bg-green-100 text-green-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLastLogin = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return formatDate(dateStr);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage authentication, roles, and access control</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Manage Roles</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <UserX className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'suspended').length}</p>
              <p className="text-sm text-muted-foreground">Suspended</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">23</p>
              <p className="text-sm text-muted-foreground">New Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">User</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Role</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Last Login</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Registered</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.company && (
                          <p className="text-xs text-muted-foreground">{user.company}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full", getRoleColor(user.role))}>
                      {roles.find(r => r.id === user.role)?.name || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(user.status))}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatLastLogin(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(user.registrationDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                      >
                        {user.status === 'active' ? (
                          <UserX className="w-4 h-4 text-destructive" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-success" />
                        )}
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Reset Password"
                      >
                        <RotateCcw className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Delete User"
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xl font-medium">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground">{selectedUser.name}</h4>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={cn("text-xs px-2 py-1 rounded-full", getRoleColor(selectedUser.role))}>
                        {roles.find(r => r.id === selectedUser.role)?.name}
                      </span>
                      <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(selectedUser.status))}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Contact Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.company && (
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedUser.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Account Information</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Registered:</span>
                        <span className="ml-2">{formatDate(selectedUser.registrationDate)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Login:</span>
                        <span className="ml-2">{formatLastLogin(selectedUser.lastLogin)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Event Access:</span>
                        <span className="ml-2">{selectedUser.eventAccess.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-foreground mb-2">Permissions</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map(permission => (
                      <span key={permission} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                  Edit User
                </button>
                <button className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Create New User</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Event Access</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" defaultChecked />
                      <span className="text-sm">The Stitch Festival March 2026</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm">Annual Textile Arts Expo</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
