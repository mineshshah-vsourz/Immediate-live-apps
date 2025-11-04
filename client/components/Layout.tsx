import { ReactNode } from 'react';
import React, { ReactNode, useEffect } from 'react';
import { MobileNav, BottomNav } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    const setUpImg = (img: HTMLImageElement) => {
      try {
        if (!img.loading) img.loading = 'lazy';
        const onError = () => { if (img.src !== '/placeholder.svg') img.src = '/placeholder.svg'; };
        img.addEventListener('error', onError);
        // store handler to dataset so we can remove if needed
        (img as any).__onPlaceholder = onError;
      } catch (e) {
        // ignore
      }
    };

    // Initialize existing images
    Array.from(document.images).forEach(i => setUpImg(i as HTMLImageElement));

    // Helper to remove stats cards that match labels
    const removeStatsByLabel = (label: string) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>('*'));
      for (const el of elements) {
        try {
          if (el.textContent && el.textContent.trim() === label) {
            const card = el.closest('.bg-card');
            if (card && card.parentElement) card.parentElement.removeChild(card);
          }
        } catch (e) {
          // ignore
        }
      }
    };

    // Run once on mount
    removeStatsByLabel('Bookmarked');
    removeStatsByLabel('Connections');

    // Watch for future nodes and remove if they appear
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (node instanceof HTMLImageElement) setUpImg(node as HTMLImageElement);
          else if (node instanceof HTMLElement) {
            node.querySelectorAll('img').forEach((img) => setUpImg(img as HTMLImageElement));
            // remove labels inside the added subtree using a tree walker
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null);
            let current: Node | null = walker.nextNode();
            while (current) {
              const n = current as HTMLElement;
              const txt = n.textContent?.trim();
              if (txt === 'Bookmarked' || txt === 'Connections') {
                const card = n.closest('.bg-card');
                if (card && card.parentElement) card.parentElement.removeChild(card);
              }
              current = walker.nextNode();
            }
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      Array.from(document.images).forEach(img => {
        const h = (img as any).__onPlaceholder;
        if (h) img.removeEventListener('error', h);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />

      <div className="md:ml-64">
        <main className="pb-20 md:pb-0 md:p-6">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
