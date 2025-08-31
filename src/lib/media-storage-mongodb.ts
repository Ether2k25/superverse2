import connectDB from './mongodb';
import MediaFile from '@/models/MediaFile';

export interface MediaFileType {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  alt?: string;
  caption?: string;
}

// Get all media files
export async function getAllMediaFiles(): Promise<MediaFileType[]> {
  await connectDB();
  const files = await MediaFile.find({}).sort({ uploadedAt: -1 }).lean();
  return files.map(file => ({
    ...file,
    id: file._id.toString(),
    _id: undefined,
    uploadedAt: file.uploadedAt.toISOString()
  })) as MediaFileType[];
}

// Get media file by ID
export async function getMediaFileById(id: string): Promise<MediaFileType | null> {
  await connectDB();
  const file = await MediaFile.findById(id).lean();
  if (!file) return null;
  
  return {
    ...file,
    id: file._id.toString(),
    _id: undefined,
    uploadedAt: file.uploadedAt.toISOString()
  } as MediaFileType;
}

// Save media file
export async function saveMediaFile(fileData: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  alt?: string;
  caption?: string;
}): Promise<MediaFileType> {
  await connectDB();
  
  const file = await MediaFile.create(fileData);
  
  return {
    ...file.toObject(),
    id: file._id.toString(),
    _id: undefined,
    uploadedAt: file.uploadedAt.toISOString()
  } as MediaFileType;
}

// Delete media file
export async function deleteMediaFile(id: string): Promise<boolean> {
  await connectDB();
  const result = await MediaFile.findByIdAndDelete(id);
  return !!result;
}

// Search media files
export async function searchMediaFiles(query: string = ''): Promise<MediaFileType[]> {
  await connectDB();
  
  let searchQuery = {};
  
  if (query) {
    searchQuery = {
      $or: [
        { originalName: { $regex: query, $options: 'i' } },
        { filename: { $regex: query, $options: 'i' } },
        { alt: { $regex: query, $options: 'i' } },
        { caption: { $regex: query, $options: 'i' } }
      ]
    };
  }
  
  const files = await MediaFile.find(searchQuery)
    .sort({ uploadedAt: -1 })
    .lean();
  
  return files.map(file => ({
    ...file,
    id: file._id.toString(),
    _id: undefined,
    uploadedAt: file.uploadedAt.toISOString()
  })) as MediaFileType[];
}
