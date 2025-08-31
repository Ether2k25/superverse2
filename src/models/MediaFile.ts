import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaFile extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  alt?: string;
  caption?: string;
}

const MediaFileSchema: Schema = new Schema({
  filename: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: String, required: true },
  alt: { type: String },
  caption: { type: String }
}, {
  timestamps: true
});

// Create indexes
MediaFileSchema.index({ filename: 1 });
MediaFileSchema.index({ uploadedAt: -1 });
MediaFileSchema.index({ mimeType: 1 });

export default mongoose.models.MediaFile || mongoose.model<IMediaFile>('MediaFile', MediaFileSchema);
