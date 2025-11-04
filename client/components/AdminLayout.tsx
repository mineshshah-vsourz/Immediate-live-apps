import { ReactNode } from 'react';
import { AdminNavigation } from './AdminNavigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      <div className="md:ml-72">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
