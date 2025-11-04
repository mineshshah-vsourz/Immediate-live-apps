import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import * as LucideIcons from 'lucide-react';

// Expose lucide-react icons on window so components that accidentally omitted imports
// (e.g., Clock) won't throw ReferenceError in the browser at runtime.
if (typeof window !== 'undefined') {
  try {
    Object.assign(window as any, LucideIcons);
  } catch (e) {
    // ignore in SSR or restricted environments
  }
}
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EventProvider, useEvent } from "@/contexts/EventContext";

import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import GDPRConsent from "./pages/GDPRConsent";
import Agenda from "./pages/Agenda";
import SessionDetail from "./pages/SessionDetail";
import Speakers from "./pages/Speakers";
import Exhibitors from "./pages/Exhibitors";
import FloorPlan from "./pages/FloorPlan";
import Messages from "./pages/Messages";
import MySchedule from "./pages/MySchedule";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import SyncMonitor from "./pages/admin/SyncMonitor";
import ContentOverride from "./pages/admin/ContentOverride";
import MessagingManager from "./pages/admin/MessagingManager";
import ExhibitorAdmin from "./pages/admin/ExhibitorAdmin";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import GDPRCenter from "./pages/admin/GDPRCenter";
import TicketingManager from "./pages/admin/TicketingManager";
import EventManagement from "./pages/admin/EventManagement";
import LiveEventMonitor from "./pages/admin/LiveEventMonitor";
import EventSelection from "./pages/EventSelection";
import EventSettings from "./pages/EventSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component that checks for event selection
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isEventSelected } = useEvent();

  // Allow admin routes without event selection
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/admin')) {
    return <>{children}</>;
  }

  if (!isEventSelected) {
    return <Navigate to="/event-selection" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/event-selection" element={<EventSelection />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gdpr-consent" element={<GDPRConsent />} />

      {/* Protected Admin routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute><AdminLayout><EventManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/live" element={<ProtectedRoute><AdminLayout><LiveEventMonitor /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminLayout><UserManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/sync" element={<ProtectedRoute><AdminLayout><SyncMonitor /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/content" element={<ProtectedRoute><AdminLayout><ContentOverride /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/messaging" element={<ProtectedRoute><AdminLayout><MessagingManager /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/exhibitors" element={<ProtectedRoute><AdminLayout><ExhibitorAdmin /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><AdminLayout><AnalyticsDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/gdpr" element={<ProtectedRoute><AdminLayout><GDPRCenter /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/tickets" element={<ProtectedRoute><AdminLayout><TicketingManager /></AdminLayout></ProtectedRoute>} />

      {/* Protected Main app routes */}
      <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/agenda" element={<ProtectedRoute><Layout><Agenda /></Layout></ProtectedRoute>} />
      <Route path="/session/:sessionId" element={<ProtectedRoute><Layout><SessionDetail /></Layout></ProtectedRoute>} />
      <Route path="/speakers" element={<ProtectedRoute><Layout><Speakers /></Layout></ProtectedRoute>} />
      <Route path="/exhibitors" element={<ProtectedRoute><Layout><Exhibitors /></Layout></ProtectedRoute>} />
      <Route path="/floor-plan" element={<ProtectedRoute><Layout><FloorPlan /></Layout></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
      <Route path="/my-schedule" element={<ProtectedRoute><Layout><MySchedule /></Layout></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><Layout><Tickets /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
      <Route path="/event-settings" element={<ProtectedRoute><EventSettings /></ProtectedRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<ProtectedRoute><Layout><NotFound /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EventProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
