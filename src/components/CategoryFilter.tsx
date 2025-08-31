'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface CategoryFilterProps {
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
}

export default function CategoryFilter({ selectedCategoryId, onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      onCategoryChange(undefined); // Deselect if already selected
    } else {
      onCategoryChange(categoryId);
    }
  };

  const clearFilter = () => {
    onCategoryChange(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <div className="animate-pulse bg-ice-white/10 h-8 w-20 rounded-full"></div>
        <div className="animate-pulse bg-ice-white/10 h-8 w-24 rounded-full"></div>
        <div className="animate-pulse bg-ice-white/10 h-8 w-16 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Tag className="text-ice-yellow" size={20} />
        <h3 className="text-ice-white font-semibold">Filter by Category</h3>
        {selectedCategoryId && (
          <button
            onClick={clearFilter}
            className="flex items-center gap-1 text-sm text-ice-white/60 hover:text-ice-white transition-colors duration-300"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategoryId === category.id
                ? 'bg-ice-yellow text-ice-black shadow-lg'
                : 'bg-ice-black/60 text-ice-white border border-ice-yellow/30 hover:border-ice-yellow/50 hover:bg-ice-yellow/10'
            }`}
            style={{
              backgroundColor: selectedCategoryId === category.id 
                ? category.color || '#f59e0b' 
                : undefined,
              borderColor: selectedCategoryId !== category.id 
                ? (category.color || '#f59e0b') + '50' 
                : undefined
            }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
