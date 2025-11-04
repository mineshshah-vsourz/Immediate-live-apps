import { useState } from 'react';
import {
  MessageCircle,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  Calendar,
  Clock,
  User,
  Building2,
  Plus,
  Check,
  CheckCheck,
  Dot,
  MoreVertical,
  X,
  CalendarDays,
  MapPin,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface Conversation {
  id: string;
  type: 'individual' | 'group';
  participantId: string;
  participantName: string;
  participantImage: string;
  participantRole: string;
  participantCompany?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

interface MeetingRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserImage: string;
  fromUserCompany: string;
  toUserId: string;
  title: string;
  description: string;
  proposedDate: string;
  proposedTime: string;
  duration: number;
  location: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  agenda?: string;
}

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'individual',
    participantId: 'user-2',
    participantName: 'Participant 1',
    participantImage: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=50&h=50&fit=crop',
    participantRole: 'Master Tutor',
    participantCompany: 'Stitch Show',
    lastMessage: 'Thanks for your question about hand-stitching techniques! I\'d be happy to discuss this further.',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'John Doe',
        senderImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
        content: 'Hi Angela, great workshop on hand-stitching techniques! I had a question about the stitching materials you recommended.',
        timestamp: '10:15 AM',
        isRead: true
      },
      {
        id: 'msg-2',
        senderId: 'user-2',
        senderName: 'Participant 1',
        senderImage: 'https://images.unsplash.com/photo-1494790108755-2616b69b1e0e?w=50&h=50&fit=crop',
        content: 'Thanks for your question about hand-stitching techniques! I\'d be happy to discuss this further.',
        timestamp: '10:30 AM',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-2',
    type: 'individual',
    participantId: 'user-3',
    participantName: 'Participant 2',
    participantImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop',
    participantRole: 'Vendor',
    participantCompany: 'Stitch Show',
    lastMessage: 'Our booth demo is scheduled for tomorrow at 2 PM. Looking forward to showing you our new collection!',
    lastMessageTime: '2:45 PM',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'msg-3',
        senderId: 'user-3',
        senderName: 'Participant 2',
        senderImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop',
        content: 'Our booth demo is scheduled for tomorrow at 2 PM. Looking forward to showing you our new collection!',
        timestamp: '2:45 PM',
        isRead: true
      }
    ]
  }
];

const mockMeetingRequests: MeetingRequest[] = [
  {
    id: 'meeting-1',
    fromUserId: 'user-4',
    fromUserName: 'Participant 3',
    fromUserImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
    fromUserCompany: 'Stitch Show',
    toUserId: 'user-1',
    title: 'Dressmaking Techniques Discussion',
    description: 'Would like to discuss pattern fitting and alterations for beginners.',
    proposedDate: '2024-03-16',
    proposedTime: '15:00',
    duration: 30,
    location: 'Studio Room B',
    status: 'pending',
    createdAt: '2024-03-15T09:00:00Z',
    agenda: 'Pattern fitting basics, Alteration techniques, Fabric selection, Q&A session'
  },
  {
    id: 'meeting-2',
    fromUserId: 'user-5',
    fromUserName: 'Participant 4',
    fromUserImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    fromUserCompany: 'Stitch Show',
    toUserId: 'user-1',
    title: 'Advanced Textile Design Workshop',
    description: 'Discussion about textile printing and dyeing techniques for festival attendees.',
    proposedDate: '2024-03-17',
    proposedTime: '11:00',
    duration: 45,
    location: 'Virtual Meeting',
    status: 'accepted',
    createdAt: '2024-03-14T14:30:00Z'
  }
];

export default function Messages() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'meetings'>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [conversations, setConversations] = useState(mockConversations);
  const [meetingRequests, setMeetingRequests] = useState(mockMeetingRequests);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeetingRequest, setSelectedMeetingRequest] = useState<MeetingRequest | null>(null);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && conv.unreadCount > 0);
    return matchesSearch && matchesTab;
  });

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      senderName: 'John Doe',
      senderImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: message.timestamp
            }
          : conv
      )
    );

    setSelectedConversation(prev =>
      prev ? {
        ...prev,
        messages: [...prev.messages, message],
        lastMessage: newMessage,
        lastMessageTime: message.timestamp
      } : null
    );

    setNewMessage('');
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const respondToMeeting = (meetingId: string, response: 'accepted' | 'declined') => {
    setMeetingRequests(prev =>
      prev.map(meeting =>
        meeting.id === meetingId
          ? { ...meeting, status: response }
          : meeting
      )
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Messages & Meetings</h1>
          <p className="text-primary-foreground/80">Connect with attendees and schedule meetings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations Sidebar */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              {/* Tabs */}
              <div className="flex space-x-1 mb-4">
                {[
                  { id: 'all', label: 'All', count: conversations.length },
                  { id: 'unread', label: 'Unread', count: conversations.filter(c => c.unreadCount > 0).length },
                  { id: 'meetings', label: 'Meetings', count: meetingRequests.filter(m => m.status === 'pending').length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        activeTab === tab.id
                          ? "bg-primary-foreground text-primary"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              {activeTab !== 'meetings' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="overflow-y-auto">
              {activeTab === 'meetings' ? (
                <div className="p-4 space-y-3">
                  {meetingRequests.map(meeting => (
                    <div key={meeting.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <img
                          src={meeting.fromUserImage}
                          alt={meeting.fromUserName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-foreground truncate">{meeting.fromUserName}</h4>
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              meeting.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                              meeting.status === 'accepted' ? "bg-green-100 text-green-800" :
                              meeting.status === 'declined' ? "bg-red-100 text-red-800" :
                              "bg-blue-100 text-blue-800"
                            )}>
                              {meeting.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{meeting.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(meeting.proposedDate)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(meeting.proposedTime)}
                            </span>
                          </div>
                          {meeting.status === 'pending' && (
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => respondToMeeting(meeting.id, 'accepted')}
                                className="flex-1 bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => respondToMeeting(meeting.id, 'declined')}
                                className="flex-1 border border-border text-foreground px-3 py-1 rounded text-xs hover:bg-muted transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {meetingRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No meeting requests</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        markAsRead(conversation.id);
                      }}
                      className={cn(
                        "w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors",
                        selectedConversation?.id === conversation.id && "bg-muted"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.participantImage}
                            alt={conversation.participantName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-foreground truncate">{conversation.participantName}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conversation.participantRole} • {conversation.participantCompany}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {filteredConversations.length === 0 && (
                    <div className="p-8 text-center">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No conversations found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={selectedConversation.participantImage}
                        alt={selectedConversation.participantName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedConversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{selectedConversation.participantName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.participantRole} • {selectedConversation.participantCompany}
                        {selectedConversation.isOnline && <span className="text-green-600 ml-2">��� Online</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Video className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setShowMeetingModal(true)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map(message => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.senderId === 'user-1' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "flex items-end space-x-2 max-w-[70%]",
                        message.senderId === 'user-1' ? "flex-row-reverse space-x-reverse" : "flex-row"
                      )}>
                        <img
                          src={message.senderImage}
                          alt={message.senderName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className={cn(
                          "px-4 py-2 rounded-2xl",
                          message.senderId === 'user-1'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        newMessage.trim()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meeting Scheduling Modal */}
        {showMeetingModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl border border-border max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Schedule Meeting</h3>
                  <button
                    onClick={() => setShowMeetingModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Meeting Title</label>
                    <input
                      type="text"
                      placeholder="Enter meeting title"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="Meeting room or virtual link"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Agenda (Optional)</label>
                    <textarea
                      placeholder="Meeting agenda or notes"
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowMeetingModal(false)}
                    className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowMeetingModal(false)}
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
