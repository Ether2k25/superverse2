import fs from 'fs';
import path from 'path';

const ANNOUNCEMENTS_FILE = path.join(process.cwd(), 'data', 'announcements.json');

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(ANNOUNCEMENTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load announcements from file
function loadAnnouncements(): Announcement[] {
  ensureDataDirectory();
  
  if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading announcements:', error);
    return [];
  }
}

// Save announcements to file
function saveAnnouncements(announcements: Announcement[]) {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2));
  } catch (error) {
    console.error('Error saving announcements:', error);
    throw error;
  }
}

// Get all announcements
export function getAllAnnouncements(): Announcement[] {
  return loadAnnouncements();
}

// Get active announcement
export function getActiveAnnouncement(): Announcement | null {
  const announcements = loadAnnouncements();
  return announcements.find(a => a.isActive) || null;
}

// Create new announcement
export function createAnnouncement(data: {
  message: string;
  type: 'info' | 'warning' | 'success';
}): Announcement {
  const announcements = loadAnnouncements();
  
  const newAnnouncement: Announcement = {
    id: Date.now().toString(),
    message: data.message,
    type: data.type,
    isActive: false, // New announcements start as inactive
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  announcements.push(newAnnouncement);
  saveAnnouncements(announcements);
  
  return newAnnouncement;
}

// Update announcement
export function updateAnnouncement(id: string, data: {
  message?: string;
  type?: 'info' | 'warning' | 'success';
  isActive?: boolean;
}): Announcement | null {
  const announcements = loadAnnouncements();
  const index = announcements.findIndex(a => a.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // If setting this announcement as active, deactivate others
  if (data.isActive === true) {
    announcements.forEach(a => a.isActive = false);
  }
  
  announcements[index] = {
    ...announcements[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  saveAnnouncements(announcements);
  return announcements[index];
}

// Delete announcement
export function deleteAnnouncement(id: string): boolean {
  const announcements = loadAnnouncements();
  const index = announcements.findIndex(a => a.id === id);
  
  if (index === -1) {
    return false;
  }
  
  announcements.splice(index, 1);
  saveAnnouncements(announcements);
  return true;
}
