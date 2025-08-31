'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, Megaphone } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isActive: boolean;
  createdAt: string;
}

export default function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [showNewsletter, setShowNewsletter] = useState(true);
  const pathname = usePathname();

  // Check if we're on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Don't show banner on admin pages
    if (isAdminPage) {
      setIsVisible(false);
      return;
    }

    // Only show banner on homepage
    if (pathname !== '/') {
      setIsVisible(false);
      return;
    }

    // Fetch active announcement
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch('/api/announcements/active');
        if (response.ok) {
          const data = await response.json();
          if (data.announcement) {
            setAnnouncement(data.announcement);
            setShowNewsletter(false);
            setIsVisible(true);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
      
      // Show newsletter if no announcement
      setShowNewsletter(true);
      setIsVisible(true);
    };

    fetchAnnouncement();
  }, [isAdminPage, pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remove session storage so banner shows on every page load
    // sessionStorage.setItem('newsletter-banner-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        // Auto-dismiss after success
        setTimeout(() => {
          handleDismiss();
        }, 3000);
      } else {
        const data = await response.json();
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`fixed top-0 left-0 right-0 z-[9999] shadow-lg ${
            announcement && !showNewsletter 
              ? announcement.type === 'warning' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                : announcement.type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : 'newsletter-banner'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {showNewsletter ? (
                  <Mail className="text-ice-black" size={24} />
                ) : (
                  <Megaphone className={`${
                    announcement?.type === 'warning' ? 'text-white' :
                    announcement?.type === 'success' ? 'text-white' :
                    announcement?.type === 'info' ? 'text-white' : 'text-ice-black'
                  }`} size={24} />
                )}
                <div className="flex-1">
                  {showNewsletter ? (
                    // Newsletter Section
                    isSubscribed ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="font-semibold">
                          Thank you for subscribing! You'll receive our latest iGaming insights.
                        </span>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 pr-12 sm:pr-0">
                        <div className="flex-1">
                          <span className="font-bold text-lg">Stay Updated!</span>
                          <span className="ml-2 text-sm block sm:inline">
                            Get the latest iGaming insights and industry analysis delivered to your inbox.
                          </span>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="px-3 py-2 bg-white border border-ice-black/20 rounded-lg text-ice-black placeholder-ice-black/60 focus:outline-none focus:border-ice-black w-full sm:min-w-[200px]"
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-ice-black text-ice-yellow rounded-lg font-semibold transition-all duration-300 hover:bg-ice-black/80 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
                          >
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                          </button>
                        </form>
                      </div>
                    )
                  ) : (
                    // Announcement Section
                    announcement && (
                      <div className="flex items-center space-x-3">
                        <div>
                          <span className="font-bold text-lg">Announcement</span>
                          <span className="ml-2 text-sm">
                            {announcement.message}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className={`absolute top-3 right-4 sm:relative sm:top-auto sm:right-auto sm:ml-4 p-1 rounded-full transition-colors duration-200 ${
                  announcement && !showNewsletter
                    ? 'hover:bg-white/10 text-white'
                    : 'hover:bg-ice-black/10 text-ice-black'
                } z-10`}
                aria-label="Dismiss banner"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
