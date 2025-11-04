import { useState } from 'react';
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Link,
  Twitter,
  Linkedin,
  Check,
  AlertCircle,
  Settings,
  Bell,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  bio: string;
  location: string;
  website: string;
  linkedin: string;
  twitter: string;
  profileImage: string;
  role: 'delegate' | 'exhibitor' | 'speaker' | 'admin';
  interests: string[];
  visibility: 'public' | 'private';
  joinDate: string;
}

interface NotificationPreferences {
  emailUpdates: boolean;
  sessionReminders: boolean;
  networkingRequests: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts-only';
  showEmail: boolean;
  showPhone: boolean;
  showCompany: boolean;
  allowMessages: boolean;
  allowMeetingRequests: boolean;
}

const mockProfile: UserProfile = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  title: 'Craft Enthusiast',
  company: 'Stitch Festival Attendee',
  bio: 'Enthusiastic maker with a passion for textiles, hand-stitching, and sustainable craft. Interested in learning new techniques and meeting fellow crafters.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.craft',
  linkedin: 'https://linkedin.com/in/johndoe',
  twitter: 'https://twitter.com/johndoe_craft',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  role: 'delegate',
  interests: ['Hand-stitching', 'Dressmaking', 'Textile Design', 'Yarn & Fiber'],
  visibility: 'public',
  joinDate: '2024-01-15'
};

const mockNotificationPrefs: NotificationPreferences = {
  emailUpdates: true,
  sessionReminders: true,
  networkingRequests: true,
  marketingEmails: false,
  pushNotifications: true
};

const mockPrivacySettings: PrivacySettings = {
  profileVisibility: 'public',
  showEmail: false,
  showPhone: false,
  showCompany: true,
  allowMessages: true,
  allowMeetingRequests: true
};

const availableInterests = [
  'Hand-stitching', 'Dressmaking', 'Textile Design', 'Yarn & Fiber',
  'Knitting', 'Crochet', 'Macramé', 'Embroidery',
  'Sustainable Textiles', 'Pattern Making', 'Notions & Accessories', 'Sewing Tools',
  'Accessory Making', 'Fabric Dyeing', 'Workshops & Tutorials'
];

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(mockNotificationPrefs);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(mockPrivacySettings);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form would go here in a real app
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const updateNotificationPref = (key: keyof NotificationPreferences, value: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));
  };

  const updatePrivacySetting = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-primary-foreground/80">Manage your information and preferences</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Member since</div>
              <div className="font-semibold">{formatDate(profile.joinDate)}</div>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={cn(
            "flex items-center space-x-2 p-4 rounded-xl",
            saveMessage.type === 'success'
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          )}>
            {saveMessage.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{saveMessage.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex border-b border-border">
            {[
              { id: 'profile', label: 'Profile Information', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy & Visibility', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      {isEditing && (
                        <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                          <Camera className="w-6 h-6" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-foreground">
                          {profile.firstName} {profile.lastName}
                        </h2>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          profile.role === 'delegate' ? "bg-blue-100 text-blue-800" :
                          profile.role === 'exhibitor' ? "bg-green-100 text-green-800" :
                          profile.role === 'speaker' ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {profile.role}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{profile.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {profile.company}
                      </p>
                      <div className="flex items-center space-x-2">
                        {profile.visibility === 'public' ? (
                          <Globe className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-orange-600" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {profile.visibility === 'public' ? 'Public Profile' : 'Private Profile'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                      isEditing
                        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Basic Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <p className="py-2 text-foreground">{profile.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <p className="py-2 text-foreground">{profile.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Job Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.title}
                          onChange={(e) => setProfile({...profile, title: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground">{profile.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.company}
                          onChange={(e) => setProfile({...profile, company: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground">{profile.company}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profile.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Contact Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {profile.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {profile.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Website</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground flex items-center">
                          <Link className="w-4 h-4 mr-1" />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {profile.website}
                          </a>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">LinkedIn</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profile.linkedin}
                          onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground flex items-center">
                          <Linkedin className="w-4 h-4 mr-1" />
                          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            LinkedIn Profile
                          </a>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Twitter</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profile.twitter}
                          onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="py-2 text-foreground flex items-center">
                          <Twitter className="w-4 h-4 mr-1" />
                          <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Twitter Profile
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell others about yourself and your professional background..."
                    />
                  ) : (
                    <p className="py-2 text-foreground">{profile.bio}</p>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Professional Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      availableInterests.map(interest => (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={cn(
                            "px-3 py-1 rounded-full text-sm border transition-colors",
                            profile.interests.includes(interest)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {interest}
                        </button>
                      ))
                    ) : (
                      profile.interests.map(interest => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={cn(
                        "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors flex items-center space-x-2",
                        isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                      )}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose what notifications you'd like to receive to stay informed about your events.
                  </p>

                  <div className="space-y-4">
                    {Object.entries(notificationPrefs).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">
                            {key === 'emailUpdates' && 'Email Updates'}
                            {key === 'sessionReminders' && 'Session Reminders'}
                            {key === 'networkingRequests' && 'Networking Requests'}
                            {key === 'marketingEmails' && 'Marketing Emails'}
                            {key === 'pushNotifications' && 'Push Notifications'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {key === 'emailUpdates' && 'Receive important event updates and announcements'}
                            {key === 'sessionReminders' && 'Get reminders before your scheduled sessions'}
                            {key === 'networkingRequests' && 'Notifications when someone wants to connect'}
                            {key === 'marketingEmails' && 'Promotional content and future event information'}
                            {key === 'pushNotifications' && 'Real-time notifications on your device'}
                          </p>
                        </div>
                        <button
                          onClick={() => updateNotificationPref(key as keyof NotificationPreferences, !value)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-colors relative",
                            value ? "bg-primary" : "bg-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                              value ? "translate-x-6" : "translate-x-0.5"
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Privacy & Visibility Settings</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Control who can see your information and interact with you.
                  </p>

                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-3">Profile Visibility</h4>
                      <div className="space-y-2">
                        {[
                          { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
                          { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
                          { value: 'contacts-only', label: 'Contacts Only', desc: 'Only your connections can see your profile' }
                        ].map(option => (
                          <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option.value}
                              checked={privacySettings.profileVisibility === option.value}
                              onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                              className="text-primary focus:ring-primary"
                            />
                            <div>
                              <div className="font-medium text-foreground">{option.label}</div>
                              <div className="text-sm text-muted-foreground">{option.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Contact Information Visibility */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'showEmail', label: 'Show Email Address', desc: 'Allow others to see your email' },
                          { key: 'showPhone', label: 'Show Phone Number', desc: 'Allow others to see your phone number' },
                          { key: 'showCompany', label: 'Show Company Information', desc: 'Display your company and title' }
                        ].map(setting => (
                          <div key={setting.key} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">{setting.label}</div>
                              <div className="text-sm text-muted-foreground">{setting.desc}</div>
                            </div>
                            <button
                              onClick={() => updatePrivacySetting(setting.key as keyof PrivacySettings, !privacySettings[setting.key as keyof PrivacySettings])}
                              className={cn(
                                "w-12 h-6 rounded-full transition-colors relative",
                                privacySettings[setting.key as keyof PrivacySettings] ? "bg-primary" : "bg-muted"
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                                  privacySettings[setting.key as keyof PrivacySettings] ? "translate-x-6" : "translate-x-0.5"
                                )}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Communication Settings */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-3">Communication</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'allowMessages', label: 'Allow Messages', desc: 'Let other attendees send you messages' },
                          { key: 'allowMeetingRequests', label: 'Allow Meeting Requests', desc: 'Let others request meetings with you' }
                        ].map(setting => (
                          <div key={setting.key} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">{setting.label}</div>
                              <div className="text-sm text-muted-foreground">{setting.desc}</div>
                            </div>
                            <button
                              onClick={() => updatePrivacySetting(setting.key as keyof PrivacySettings, !privacySettings[setting.key as keyof PrivacySettings])}
                              className={cn(
                                "w-12 h-6 rounded-full transition-colors relative",
                                privacySettings[setting.key as keyof PrivacySettings] ? "bg-primary" : "bg-muted"
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                                  privacySettings[setting.key as keyof PrivacySettings] ? "translate-x-6" : "translate-x-0.5"
                                )}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
