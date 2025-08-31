import fs from 'fs/promises';
import path from 'path';

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  alt?: string;
  caption?: string;
}

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const MEDIA_FILES_FILE = path.join(DATA_DIR, 'media-files.json');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Load media files from JSON
async function loadMediaFiles(): Promise<MediaFile[]> {
  try {
    await ensureDirectories();
    const data = await fs.readFile(MEDIA_FILES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist, return empty array
    return [];
  }
}

// Save media files to JSON
async function saveMediaFiles(files: MediaFile[]): Promise<void> {
  try {
    await ensureDirectories();
    await fs.writeFile(MEDIA_FILES_FILE, JSON.stringify(files, null, 2));
  } catch (error) {
    console.error('Error saving media files:', error);
    throw error;
  }
}

// Get all media files
export async function getAllMediaFiles(): Promise<MediaFile[]> {
  return await loadMediaFiles();
}

// Get media file by ID
export async function getMediaFileById(id: string): Promise<MediaFile | null> {
  const files = await loadMediaFiles();
  return files.find(file => file.id === id) || null;
}

// Upload media file
export async function uploadMediaFile(data: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
  uploadedBy: string;
  alt?: string;
  caption?: string;
}): Promise<MediaFile> {
  await ensureDirectories();
  
  const id = generateId();
  const filename = `${id}-${data.filename}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  
  // Save file to disk
  await fs.writeFile(filePath, data.buffer);
  
  // Create media file record
  const mediaFile: MediaFile = {
    id,
    filename,
    originalName: data.originalName,
    mimeType: data.mimeType,
    size: data.size,
    url: `/uploads/${filename}`,
    uploadedBy: data.uploadedBy,
    uploadedAt: new Date().toISOString(),
    alt: data.alt,
    caption: data.caption,
  };
  
  // Save to JSON database
  const files = await loadMediaFiles();
  files.push(mediaFile);
  await saveMediaFiles(files);
  
  return mediaFile;
}

// Update media file metadata
export async function updateMediaFile(id: string, updates: {
  alt?: string;
  caption?: string;
}): Promise<MediaFile | null> {
  const files = await loadMediaFiles();
  const fileIndex = files.findIndex(file => file.id === id);
  
  if (fileIndex === -1) {
    return null;
  }
  
  files[fileIndex] = {
    ...files[fileIndex],
    ...updates,
  };
  
  await saveMediaFiles(files);
  return files[fileIndex];
}

// Delete media file
export async function deleteMediaFile(id: string): Promise<boolean> {
  const files = await loadMediaFiles();
  const fileIndex = files.findIndex(file => file.id === id);
  
  if (fileIndex === -1) {
    return false;
  }
  
  const file = files[fileIndex];
  
  try {
    // Delete physical file
    const filePath = path.join(UPLOADS_DIR, file.filename);
    await fs.unlink(filePath);
  } catch (error) {
    console.warn('Could not delete physical file:', error);
    // Continue with database removal even if file deletion fails
  }
  
  // Remove from database
  files.splice(fileIndex, 1);
  await saveMediaFiles(files);
  
  return true;
}

// Search media files
export async function searchMediaFiles(query: string = ''): Promise<MediaFile[]> {
  const files = await loadMediaFiles();
  
  if (!query) {
    return files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  
  const searchTerm = query.toLowerCase();
  return files
    .filter(file => 
      file.originalName.toLowerCase().includes(searchTerm) ||
      file.alt?.toLowerCase().includes(searchTerm) ||
      file.caption?.toLowerCase().includes(searchTerm) ||
      file.mimeType.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

// Get media files by type
export async function getMediaFilesByType(type: 'image' | 'video' | 'audio' | 'document'): Promise<MediaFile[]> {
  const files = await loadMediaFiles();
  
  const typeMap = {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
    document: ['application/pdf', 'text/plain', 'application/msword']
  };
  
  return files
    .filter(file => typeMap[type].some(mimeType => file.mimeType.startsWith(mimeType.split('/')[0])))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

// Clean up orphaned files (files on disk but not in database)
export async function cleanupOrphanedFiles(): Promise<number> {
  await ensureDirectories();
  
  const files = await loadMediaFiles();
  const dbFilenames = new Set(files.map(file => file.filename));
  
  try {
    const diskFiles = await fs.readdir(UPLOADS_DIR);
    let cleanedCount = 0;
    
    for (const diskFile of diskFiles) {
      if (!dbFilenames.has(diskFile)) {
        try {
          await fs.unlink(path.join(UPLOADS_DIR, diskFile));
          cleanedCount++;
        } catch (error) {
          console.warn(`Could not delete orphaned file ${diskFile}:`, error);
        }
      }
    }
    
    return cleanedCount;
  } catch (error) {
    console.error('Error during cleanup:', error);
    return 0;
  }
}
