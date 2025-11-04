import { Construction, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon = Construction 
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This page is coming soon. Continue exploring other features of the Netlaw Media platform.
            </p>
            
            <div className="flex flex-col space-y-2">
              <NavLink 
                to="/" 
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </NavLink>
              
              <NavLink 
                to="/dashboard" 
                className="inline-flex items-center justify-center border border-border text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                View Dashboard
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
