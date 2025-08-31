'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryFilters from '@/components/CategoryFilters';
import BlogGrid from '@/components/BlogGrid';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';
import { BlogPost } from '@/types/blog';
// Removed Notion imports - now using unified admin data source

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | undefined>(undefined);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customization, setCustomization] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load from unified admin-managed data source including customization
        const [postsResponse, featuredResponse, tagsResponse, customizationResponse] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/posts?featured=true'),
          fetch('/api/tags'),
          fetch(`/api/customization?t=${Date.now()}`, { cache: 'no-store' }),
        ]);

        const [postsData, featuredData, tagsData, customizationData] = await Promise.all([
          postsResponse.json(),
          featuredResponse.json(),
          tagsResponse.json(),
          customizationResponse.json(),
        ]);

        const posts = postsData.posts || [];
        const featured = featuredData.post || (posts.length > 0 ? posts[0] : undefined);
        const tags = tagsData.tags || [];
        const customizationSettings = customizationData.customization || {};

        console.log('Homepage customization loaded:', customizationSettings);
        console.log('Homepage navbar data:', customizationSettings?.navbar);

        setAllPosts(posts);
        setPosts(posts);
        setFeaturedPost(featured);
        setTags(tags);
        setCustomization(customizationSettings);
      } catch (error) {
        console.error('Error loading blog data:', error);
        // Fallback to empty state - admin can add posts
        setAllPosts([]);
        setPosts([]);
        setFeaturedPost(undefined);
        setTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Listen for customization updates
  useEffect(() => {
    const handleCustomizationUpdate = async () => {
      try {
        const response = await fetch(`/api/customization?t=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          console.log('Refreshed customization data:', data.customization);
          setCustomization(data.customization);
        }
      } catch (error) {
        console.error('Error refreshing customization:', error);
      }
    };

    window.addEventListener('customizationUpdated', handleCustomizationUpdate);
    return () => {
      window.removeEventListener('customizationUpdated', handleCustomizationUpdate);
    };
  }, []);

  useEffect(() => {
    // Filter posts based on search query and selected tags
    let filteredPosts = allPosts;

    // Filter by search query
    if (searchQuery.trim()) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filteredPosts = filteredPosts.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    setPosts(filteredPosts);
  }, [searchQuery, selectedTags, allPosts]);

  const handleTagSelect = (tag: string) => {
    if (tag === 'all') {
      setSelectedTags([]);
    } else {
      setSelectedTags((prev) =>
        prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag]
      );
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Don't render until customization data is loaded
  if (isLoading || !customization) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#FFC300' }}></div>
          <p style={{ color: '#ffffff', opacity: 0.6 }}>Loading ICE SUPER Blog...</p>
        </div>
      </div>
    );
  }

  // Extract colors from customization
  const backgroundColor = customization?.branding?.backgroundColor || '#0f0f0f';
  const textColor = customization?.branding?.textColor || '#ffffff';
  const primaryColor = customization?.branding?.primaryColor || '#FFC300';
  const secondaryColor = customization?.branding?.secondaryColor || '#FFD700';
  const accentColor = customization?.branding?.accentColor || '#FFC300';

  return (
    <div className="min-h-screen" style={{ backgroundColor, color: textColor }}>
      <Navbar customization={customization} />
      <main>
        <HeroSection featuredPost={featuredPost} customization={customization} />
        <CategoryFilters 
          tags={tags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          customization={customization}
        />
        <BlogGrid posts={posts} isLoading={false} customization={customization} />
        <CTABanner customization={customization} />
      </main>
      <Footer customization={customization} />
    </div>
  );
}
