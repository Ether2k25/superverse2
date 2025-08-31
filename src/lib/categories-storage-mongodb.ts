import connectDB from './mongodb';
import Category from '@/models/Category';
import { Category as CategoryType } from './categories-storage';

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

// Get all categories
export async function getAllCategories(): Promise<CategoryType[]> {
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  return categories.map(category => ({
    ...category,
    id: category._id.toString(),
    _id: undefined,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  })) as CategoryType[];
}

// Get category by ID
export async function getCategoryById(id: string): Promise<CategoryType | null> {
  await connectDB();
  const category = await Category.findById(id).lean();
  if (!category) return null;
  
  return {
    ...category,
    id: category._id.toString(),
    _id: undefined,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  } as CategoryType;
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<CategoryType | null> {
  await connectDB();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;
  
  return {
    ...category,
    id: category._id.toString(),
    _id: undefined,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  } as CategoryType;
}

// Create new category
export async function createCategory(data: {
  name: string;
  description?: string;
  color?: string;
}): Promise<CategoryType> {
  await connectDB();
  
  const slug = generateSlug(data.name);
  
  // Check if slug already exists
  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    throw new Error('A category with this name already exists');
  }

  const categoryData = {
    name: data.name,
    slug,
    description: data.description || '',
    color: data.color || '#6366f1',
  };

  const category = await Category.create(categoryData);
  
  return {
    ...category.toObject(),
    id: category._id.toString(),
    _id: undefined,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  } as CategoryType;
}

// Update category
export async function updateCategory(id: string, updateData: {
  name?: string;
  description?: string;
  color?: string;
}): Promise<CategoryType | null> {
  await connectDB();
  
  // Check if name change would create duplicate slug
  if (updateData.name) {
    const newSlug = generateSlug(updateData.name);
    const existingCategory = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existingCategory) {
      throw new Error('A category with this name already exists');
    }
    (updateData as any).slug = newSlug;
  }

  const category = await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).lean();
  
  if (!category) return null;
  
  return {
    ...category,
    id: category._id.toString(),
    _id: undefined,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  } as CategoryType;
}

// Delete category
export async function deleteCategory(id: string): Promise<boolean> {
  await connectDB();
  
  // Don't allow deleting if it's the last category
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 1) {
    throw new Error('Cannot delete the last category');
  }

  const result = await Category.findByIdAndDelete(id);
  return !!result;
}

// Search categories
export async function searchCategories(query: string = ''): Promise<CategoryType[]> {
  await connectDB();
  
  let searchQuery = {};
  
  if (query) {
    searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };
  }
  
  const categories = await Category.find(searchQuery)
    .sort({ name: 1 })
    .lean();
  
  return categories.map(category => ({
    ...category,
    id: category._id.toString(),
    _id: undefined,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  })) as CategoryType[];
}
