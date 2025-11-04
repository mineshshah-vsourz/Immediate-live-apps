import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentCategory {
  id: string;
  title: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

interface GDPRConsentProps {
  title?: string;
  privacyPolicyUrl?: string;
  skipOption?: boolean;
  interestTags?: string[];
}

export default function GDPRConsent({
  title = "Manage Your Preferences",
  privacyPolicyUrl = "/privacy-policy",
  skipOption = false,
  interestTags = [
    "Hand-stitching", "Dressmaking", "Textile Design",
    "Yarn & Fiber", "Knitting & Crochet", "Sustainable Textiles",
    "Pattern Making", "Notions & Accessories", "Workshops & Tutorials"
  ]
}: GDPRConsentProps) {
  const [consentCategories, setConsentCategories] = useState<ConsentCategory[]>([
    {
      id: 'essential',
      title: 'Essential Services',
      description: 'Necessary for the app to function properly and provide core event services.',
      required: true,
      enabled: true
    },
    {
      id: 'email_updates',
      title: 'Email Updates',
      description: 'Receive important event updates, session reminders, and announcements.',
      required: false,
      enabled: true
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Get information about future events, special offers, and industry insights.',
      required: false,
      enabled: false
    },
    {
      id: 'partner_offers',
      title: 'Partner Offers',
      description: 'Receive promotional content and offers from our trusted event partners.',
      required: false,
      enabled: false
    },
    {
      id: 'analytics',
      title: 'Analytics & Personalization',
      description: 'Help us improve your experience with personalized content and recommendations.',
      required: false,
      enabled: true
    }
  ]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleConsent = (categoryId: string) => {
    setConsentCategories(prev => 
      prev.map(category => 
        category.id === categoryId && !category.required
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    
    // Simulate saving preferences
    const preferences = {
      consent: consentCategories,
      interests: selectedInterests,
      timestamp: new Date().toISOString(),
      policyVersion: '2024.1'
    };
    
    console.log('Saving GDPR preferences:', preferences);
    
    // Store in localStorage (in real app, this would be sent to API)
    localStorage.setItem('gdprConsent', JSON.stringify(preferences));
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  const handleSkip = () => {
    // Save minimal required consent only
    const minimalConsent = {
      consent: consentCategories.filter(c => c.required),
      interests: [],
      timestamp: new Date().toISOString(),
      policyVersion: '2024.1'
    };
    localStorage.setItem('gdprConsent', JSON.stringify(minimalConsent));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">
            We respect your privacy. Please review and customize your preferences below.
          </p>
        </div>

        {/* Consent Categories */}
        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Privacy Preferences</h2>
          
          <div className="space-y-4">
            {consentCategories.map((category) => (
              <div key={category.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-foreground">{category.title}</h3>
                      {category.required && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleConsent(category.id)}
                    disabled={category.required}
                    className={cn(
                      "ml-4 w-12 h-6 rounded-full transition-colors relative flex-shrink-0",
                      category.enabled 
                        ? "bg-primary" 
                        : "bg-muted",
                      category.required && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                        category.enabled ? "translate-x-6" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interest Selection */}
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your Interests</h2>
            <p className="text-sm text-muted-foreground">
              Select topics you're interested in to personalize your experience (optional).
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestTags.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "p-3 rounded-lg border text-sm font-medium transition-all",
                  selectedInterests.includes(interest)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Policy Link */}
        <div className="bg-muted/50 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground mb-1">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">
                Learn more about how we handle your data
              </p>
            </div>
            <a 
              href={privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
            >
              <span className="text-sm font-medium">Read Policy</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium transition-colors",
              isLoading 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-primary/90"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Preferences...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Confirm Preferences</span>
              </div>
            )}
          </button>

          {skipOption && (
            <button
              onClick={handleSkip}
              className="w-full border border-border text-foreground py-4 rounded-xl font-medium hover:bg-muted transition-colors"
            >
              Continue with Essential Only
            </button>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            You can change these preferences anytime in your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
