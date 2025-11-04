import { useEffect, useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SplashProps {
  eventName?: string;
  sponsorLogo?: string;
  backgroundImage?: string;
}

export default function Splash({ 
  eventName = "The Stitch Festival March 2026",
  sponsorLogo,
  backgroundImage = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop"
}: SplashProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate app initialization complete
          setTimeout(() => {
            setIsLoading(false);
            // Check if user is logged in (simulate)
            const isLoggedIn = localStorage.getItem('userToken');
            navigate(isLoggedIn ? '/' : '/login');
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(37, 0, 102, 0.8), rgba(37, 0, 102, 0.9)), url(${backgroundImage})`
      }}
    >
      {/* Sponsor Logo (top-right) */}
      {sponsorLogo && (
        <div className="absolute top-6 right-6">
          <img 
            src={sponsorLogo} 
            alt="Sponsor" 
            className="h-12 w-auto opacity-80"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center space-y-8 text-center text-white px-6">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
          <img src="https://www.thestitchfestival.co.uk/wp-content/uploads/2019/09/logo.svg" alt="The Stitch Festival" className="max-h-12" />
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">The Stitch Festival</h1>
          <p className="text-white/80 text-lg">March 2026</p>
        </div>

        {/* Event Overlay */}
        {eventName && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
            <p className="text-white/90 font-medium">{eventName}</p>
          </div>
        )}

        {/* Loading Progress */}
        <div className="w-64 space-y-3">
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-white/60 text-sm">Loading your event experience...</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-white/60 text-xs">
        <p>The Stitch Festival March 2026</p>
      </div>
    </div>
  );
}
