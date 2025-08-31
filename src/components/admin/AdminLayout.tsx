'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Tag,
  Megaphone,
  BarChart3,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customization, setCustomization] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status
    checkAuth();
    fetchCustomization();
  }, []);

  // Listen for customization updates
  useEffect(() => {
    const handleCustomizationUpdate = () => {
      fetchCustomization();
    };

    window.addEventListener('customizationUpdated', handleCustomizationUpdate);
    return () => {
      window.removeEventListener('customizationUpdated', handleCustomizationUpdate);
    };
  }, []);

  const fetchCustomization = async () => {
    try {
      const response = await fetch(`/api/admin/customization?t=${Date.now()}`, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomization(data.customization);
      }
    } catch (error) {
      console.error('Error fetching customization:', error);
    }
  };

  const checkAuth = async () => {
    try {
      console.log('AdminLayout: Checking authentication...');
      const response = await fetch('/api/admin/me', {
        credentials: 'include', // Ensure cookies are sent
      });
      console.log('AdminLayout: Auth response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('AdminLayout: User authenticated:', data.user.username);
        setUser(data.user);
      } else {
        console.log('AdminLayout: Authentication failed, redirecting to login');
        router.push('/admin');
      }
    } catch (error) {
      console.error('AdminLayout: Auth check error:', error);
      router.push('/admin');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin');
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Blog Posts',
      href: '/admin/posts',
      icon: FileText,
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Tag,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      name: 'Media Gallery',
      href: '/admin/media',
      icon: ImageIcon,
    },
    {
      name: 'Leads',
      href: '/admin/leads',
      icon: Users,
    },
    {
      name: 'Announcements',
      href: '/admin/announcements',
      icon: Megaphone,
    },
    {
      name: 'Site Customization',
      href: '/admin/customize',
      icon: Palette,
    },
    {
      name: 'Profile & Security',
      href: '/admin/profile',
      icon: Settings,
    },
    {
      name: 'Site Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-ice-black">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-ice-black/95 backdrop-blur-sm border-r border-ice-yellow/20 transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-ice-yellow/20">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <img 
              src="/uploads/17565382966621ufr247zf-1756538296661-logo.png"
              alt="ICE SUPER Logo"
              className="h-8 w-auto"
              onError={(e) => {
                console.error('Admin logo image failed to load');
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="text-xl font-bold text-ice-yellow hidden">
              ICE SUPER
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-ice-white hover:text-ice-yellow transition-colors duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-ice-white hover:bg-ice-yellow/10 hover:text-ice-yellow transition-all duration-300 group"
              >
                <IconComponent size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-ice-yellow/20">
          {user && (
            <div className="mb-4">
              <p className="text-ice-white font-medium">{user.username}</p>
              <p className="text-ice-white/60 text-sm">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-3 py-2 text-ice-white hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-ice-black/95 backdrop-blur-sm border-b border-ice-yellow/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-ice-white hover:text-ice-yellow transition-colors duration-300"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-ice-yellow hover:text-ice-gold text-sm transition-colors duration-300"
              >
                View Site →
              </Link>
              <Link
                href="/admin/leads"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/leads'
                    ? 'bg-ice-yellow text-ice-black'
                    : 'text-ice-white hover:bg-ice-yellow/10 hover:text-ice-yellow'
                }`}
              >
                <Users size={20} />
                <span>Leads</span>
              </Link>
              <Link
                href="/admin/announcements"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/announcements'
                    ? 'bg-ice-yellow text-ice-black'
                    : 'text-ice-white hover:bg-ice-yellow/10 hover:text-ice-yellow'
                }`}
              >
                <Megaphone size={20} />
                <span>Announcements</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
