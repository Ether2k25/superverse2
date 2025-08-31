import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  postCount?: number;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#6366f1' },
  postCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Create indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ name: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
