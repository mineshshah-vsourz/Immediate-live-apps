import { useState } from 'react';
import {
  QrCode,
  Share2,
  Download,
  Calendar,
  MapPin,
  Clock,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Wifi,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventTicket {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketType: string;
  accessLevel: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketNumber: string;
  qrCodeData: string;
  isValid: boolean;
  checkInTime?: string;
  seatNumber?: string;
  specialAccess?: string[];
}

const mockTickets: EventTicket[] = [
  {
    id: 'ticket-1',
    eventName: 'The Stitch Festival March 2026',
    eventDate: '2026-03-20',
    eventTime: '09:00 - 18:00',
    venue: 'London Convention Centre',
    ticketType: 'Full Festival Pass',
    accessLevel: 'VIP',
    attendeeName: 'John Doe',
    attendeeEmail: 'john.doe@example.com',
    ticketNumber: 'TSF2026-VIP-001234',
    qrCodeData: 'TSF2026VIP001234JOHNDOE20260320',
    isValid: true,
    seatNumber: 'A-15',
    specialAccess: ['VIP Lounge', 'Tutor Meet & Greet', 'Premium Networking']
  },
  {
    id: 'ticket-2',
    eventName: 'Craft Expo Spring 2026',
    eventDate: '2026-03-21',
    eventTime: '09:30 - 17:30',
    venue: 'Manchester Arena',
    ticketType: 'Standard Pass',
    accessLevel: 'Standard',
    attendeeName: 'John Doe',
    attendeeEmail: 'john.doe@example.com',
    ticketNumber: 'CES2026-STD-005678',
    qrCodeData: 'CES2026STD005678JOHNDOE20260321',
    isValid: true
  }
];

export default function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);
  const [showQRFullscreen, setShowQRFullscreen] = useState(false);
  const [brightness, setBrightness] = useState(100);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedTicket.eventName} - Ticket`,
        text: `My ticket for ${selectedTicket.eventName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(selectedTicket.ticketNumber);
    }
  };

  const handleDownload = () => {
    // Generate and download ticket PDF
    console.log('Downloading ticket PDF for:', selectedTicket.ticketNumber);
  };

  const copyTicketNumber = () => {
    navigator.clipboard.writeText(selectedTicket.ticketNumber);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate QR Code SVG (simplified representation)
  const generateQRCode = (data: string) => {
    // In a real app, you'd use a QR code library like qrcode.js
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <g fill="black">
          <rect x="20" y="20" width="10" height="10"/>
          <rect x="40" y="20" width="10" height="10"/>
          <rect x="60" y="20" width="10" height="10"/>
          <rect x="20" y="40" width="10" height="10"/>
          <rect x="60" y="40" width="10" height="10"/>
          <rect x="20" y="60" width="10" height="10"/>
          <rect x="40" y="60" width="10" height="10"/>
          <rect x="60" y="60" width="10" height="10"/>
          <!-- More QR pattern elements would go here -->
        </g>
        <text x="100" y="100" text-anchor="middle" font-size="8" fill="gray">${data.slice(0, 8)}</text>
      </svg>
    `)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-0 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl md:rounded-none text-primary-foreground p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-primary-foreground/80">Your digital event passes and QR codes</p>
        </div>

        {/* Ticket Selector */}
        {mockTickets.length > 1 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">Select Ticket</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockTickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={cn(
                    "text-left p-4 rounded-xl border-2 transition-all",
                    selectedTicket.id === ticket.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{ticket.eventName}</h3>
                    {ticket.isValid ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(ticket.eventDate)}</p>
                  <p className="text-xs text-muted-foreground">{ticket.ticketType}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Ticket Display */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedTicket.eventName}</h2>
                <p className="text-primary-foreground/80">{selectedTicket.ticketType}</p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                selectedTicket.accessLevel === 'VIP'
                  ? "bg-yellow-500 text-yellow-900"
                  : "bg-white/20 text-white"
              )}>
                {selectedTicket.accessLevel}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedTicket.eventDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{selectedTicket.eventTime}</span>
              </div>
              <div className="flex items-center space-x-2 col-span-2">
                <MapPin className="w-4 h-4" />
                <span>{selectedTicket.venue}</span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-6 text-center border-b border-border">
            <h3 className="font-semibold text-foreground mb-4">Entry QR Code</h3>
            <div className="inline-block p-4 bg-white rounded-xl border border-border">
              <img
                src={generateQRCode(selectedTicket.qrCodeData)}
                alt="Ticket QR Code"
                className="w-48 h-48 mx-auto"
                style={{ filter: `brightness(${brightness}%)` }}
              />
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Show this QR code at the venue entrance
              </p>

              {/* Brightness Control */}
              <div className="flex items-center justify-center space-x-3">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">Brightness</span>
              </div>

              <button
                onClick={() => setShowQRFullscreen(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                View Fullscreen
              </button>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Ticket Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Attendee Name:</span>
                <p className="font-medium">{selectedTicket.attendeeName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{selectedTicket.attendeeEmail}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Ticket Number:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {selectedTicket.ticketNumber}
                  </p>
                  <button
                    onClick={copyTicketNumber}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {selectedTicket.seatNumber && (
                <div>
                  <span className="text-muted-foreground">Seat Number:</span>
                  <p className="font-medium">{selectedTicket.seatNumber}</p>
                </div>
              )}

              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center space-x-2 mt-1">
                  {selectedTicket.isValid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-success font-medium">Valid</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-destructive font-medium">Invalid</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Special Access */}
            {selectedTicket.specialAccess && (
              <div>
                <span className="text-muted-foreground">Special Access:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTicket.specialAccess.map(access => (
                    <span
                      key={access}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {access}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Check-in Status */}
            {selectedTicket.checkInTime && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-success font-medium">Checked In</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTicket.checkInTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 bg-card border border-border text-foreground py-3 rounded-xl hover:bg-muted transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Ticket</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 bg-card border border-border text-foreground py-3 rounded-xl hover:bg-muted transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>

          <a
            href="/terms"
            className="flex items-center justify-center space-x-2 bg-card border border-border text-foreground py-3 rounded-xl hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Terms & Conditions</span>
          </a>
        </div>

        {/* Offline Instructions */}
        <div className="bg-info/10 border border-info/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Wifi className="w-5 h-5 text-info mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-1">Offline Access</h3>
              <p className="text-sm text-muted-foreground">
                Your ticket is cached locally and can be scanned even without internet connection.
                Keep your screen brightness high for better scanning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen QR Modal */}
      {showQRFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="bg-white p-8 rounded-2xl mb-4">
              <img
                src={generateQRCode(selectedTicket.qrCodeData)}
                alt="Ticket QR Code"
                className="w-80 h-80 mx-auto"
                style={{ filter: `brightness(${brightness}%)` }}
              />
            </div>
            <p className="text-white mb-4">
              {selectedTicket.ticketNumber}
            </p>
            <button
              onClick={() => setShowQRFullscreen(false)}
              className="bg-white text-black px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
