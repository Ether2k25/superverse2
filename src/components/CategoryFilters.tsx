'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface CategoryFiltersProps {
  tags: string[];
  selectedTags: string[];
  searchQuery: string;
  onTagSelect: (tag: string) => void;
  onSearchChange: (query: string) => void;
  customization?: any;
}

const CategoryFilters = ({
  tags,
  selectedTags,
  searchQuery,
  onTagSelect,
  onSearchChange,
  customization,
}: CategoryFiltersProps) => {
  // Extract colors from customization
  const primaryColor = customization?.branding?.primaryColor || '#FFC300';
  const backgroundColor = customization?.branding?.backgroundColor || '#0f0f0f';
  const textColor = customization?.branding?.textColor || '#ffffff';
  return (
    <section className="py-12 bg-ice-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search blog posts..."
              className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
              style={{
                backgroundColor: backgroundColor + 'cc', // 80% opacity
                color: textColor,
                borderColor: primaryColor + '4d', // 30% opacity
                '--tw-ring-color': primaryColor,
              } as React.CSSProperties}
            />
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {/* All Posts Filter */}
          <button
            onClick={() => onTagSelect('all')}
            className="px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80"
            style={{
              border: `1px solid ${primaryColor}`,
              backgroundColor: selectedTags.length === 0 ? primaryColor : 'transparent',
              color: selectedTags.length === 0 ? backgroundColor : textColor,
            }}
          >
            All Posts
          </button>

          {/* Tag Filters */}
          {tags.map((tag, index) => (
            <motion.button
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={() => onTagSelect(tag)}
              className="px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80"
              style={{
                border: `1px solid ${primaryColor}`,
                backgroundColor: selectedTags.includes(tag) ? primaryColor : 'transparent',
                color: selectedTags.includes(tag) ? backgroundColor : textColor,
              }}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Active Filters Display */}
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <span className="text-ice-white/60 text-sm">
              Filtering by:{' '}
              <span className="text-ice-yellow font-semibold">
                {selectedTags.join(', ')}
              </span>
            </span>
            <button
              onClick={() => onTagSelect('all')}
              className="ml-3 text-ice-yellow hover:text-ice-gold text-sm underline transition-colors duration-300"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryFilters;
