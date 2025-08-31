import fs from 'fs/promises';
import path from 'path';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
}

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Load categories from file
async function loadCategories(): Promise<Category[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist, return default categories
    const defaultCategories: Category[] = [
      {
        id: '1',
        name: 'General',
        slug: 'general',
        description: 'General blog posts',
        color: '#6366f1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Technology',
        slug: 'technology',
        description: 'Tech-related articles',
        color: '#06b6d4',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming and casino content',
        color: '#10b981',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    await saveCategories(defaultCategories);
    return defaultCategories;
  }
}

// Save categories to file
async function saveCategories(categories: Category[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error('Error saving categories:', error);
    throw error;
  }
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  return await loadCategories();
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await loadCategories();
  return categories.find(category => category.id === id) || null;
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await loadCategories();
  return categories.find(category => category.slug === slug) || null;
}

// Create new category
export async function createCategory(data: {
  name: string;
  description?: string;
  color?: string;
}): Promise<Category> {
  const categories = await loadCategories();
  
  const slug = generateSlug(data.name);
  
  // Check if slug already exists
  const existingCategory = categories.find(cat => cat.slug === slug);
  if (existingCategory) {
    throw new Error('A category with this name already exists');
  }

  const newCategory: Category = {
    id: generateId(),
    name: data.name,
    slug,
    description: data.description || '',
    color: data.color || '#6366f1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  await saveCategories(categories);
  
  return newCategory;
}

// Update category
export async function updateCategory(id: string, updateData: {
  name?: string;
  description?: string;
  color?: string;
}): Promise<Category | null> {
  const categories = await loadCategories();
  const categoryIndex = categories.findIndex(cat => cat.id === id);
  
  if (categoryIndex === -1) {
    return null;
  }

  // Check if name change would create duplicate slug
  if (updateData.name) {
    const newSlug = generateSlug(updateData.name);
    const existingCategory = categories.find(cat => cat.slug === newSlug && cat.id !== id);
    if (existingCategory) {
      throw new Error('A category with this name already exists');
    }
    updateData.name && (categories[categoryIndex].slug = newSlug);
  }

  const updatedCategory: Category = {
    ...categories[categoryIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  categories[categoryIndex] = updatedCategory;
  await saveCategories(categories);
  
  return updatedCategory;
}

// Delete category
export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await loadCategories();
  const categoryIndex = categories.findIndex(cat => cat.id === id);
  
  if (categoryIndex === -1) {
    return false;
  }

  // Don't allow deleting if it's the last category
  if (categories.length === 1) {
    throw new Error('Cannot delete the last category');
  }

  categories.splice(categoryIndex, 1);
  await saveCategories(categories);
  
  return true;
}

// Search categories
export async function searchCategories(query: string = ''): Promise<Category[]> {
  const categories = await loadCategories();
  
  if (!query) {
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  const searchTerm = query.toLowerCase();
  return categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm) ||
      category.description?.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}
