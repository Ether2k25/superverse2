import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { AdminUser, AdminSession } from '@/types/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin-users.json');
const ADMIN_PASSWORDS_FILE = path.join(DATA_DIR, 'admin-passwords.json');

// Default admin user (change these credentials!)
const DEFAULT_ADMIN: AdminUser = {
  id: '1',
  username: 'admin',
  email: 'admin@icesuper.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const DEFAULT_PASSWORD = 'admin123'; // Change this immediately!

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load admin users from file
async function loadAdminUsers(): Promise<AdminUser[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ADMIN_USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist, return default admin
    const defaultUsers = [DEFAULT_ADMIN];
    await saveAdminUsers(defaultUsers);
    return defaultUsers;
  }
}

// Save admin users to file
async function saveAdminUsers(users: AdminUser[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(ADMIN_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving admin users:', error);
  }
}

// Load admin passwords from file
async function loadAdminPasswords(): Promise<{ [userId: string]: string }> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ADMIN_PASSWORDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist, return empty object
    return {};
  }
}

// Save admin passwords to file
async function saveAdminPasswords(passwords: { [userId: string]: string }): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(ADMIN_PASSWORDS_FILE, JSON.stringify(passwords, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving admin passwords:', error);
  }
}

// Initialize default admin password if it doesn't exist
async function initializeDefaultAdmin(): Promise<void> {
  const passwords = await loadAdminPasswords();
  
  if (!passwords[DEFAULT_ADMIN.id]) {
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    passwords[DEFAULT_ADMIN.id] = hash;
    await saveAdminPasswords(passwords);
  }
}



export async function authenticateAdmin(username: string, password: string): Promise<AdminSession | null> {
  try {
    // Ensure default admin is initialized
    await initializeDefaultAdmin();
    
    const adminUsers = await loadAdminUsers();
    const userPasswords = await loadAdminPasswords();
    
    const user = adminUsers.find(u => u.username === username || u.email === username);
    if (!user) {
      return null;
    }

    const hashedPassword = userPasswords[user.id];
    if (!hashedPassword) {
      return null;
    }

    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      return null;
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const adminUsers = await loadAdminUsers();
    const user = adminUsers.find(u => u.id === decoded.userId);
    return user || null;
  } catch {
    return null;
  }
}

export async function createAdminUser(userData: {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
}): Promise<AdminUser | null> {
  try {
    const adminUsers = await loadAdminUsers();
    const userPasswords = await loadAdminPasswords();
    
    // Check if username or email already exists
    const existingUser = adminUsers.find(
      u => u.username === userData.username || u.email === userData.email
    );
    
    if (existingUser) {
      return null; // User already exists
    }

    // Create new user
    const newUser: AdminUser = {
      id: (adminUsers.length + 1).toString(),
      username: userData.username,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Add to arrays and save
    adminUsers.push(newUser);
    userPasswords[newUser.id] = hashedPassword;
    
    await saveAdminUsers(adminUsers);
    await saveAdminPasswords(userPasswords);

    return newUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  }
}

export async function changeAdminPassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
  try {
    const adminUsers = await loadAdminUsers();
    const userPasswords = await loadAdminPasswords();
    
    const user = adminUsers.find(u => u.id === userId);
    if (!user) {
      return false;
    }

    const currentHash = userPasswords[userId];
    if (!currentHash) {
      return false;
    }

    const isValidOldPassword = await bcrypt.compare(oldPassword, currentHash);
    if (!isValidOldPassword) {
      return false;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    userPasswords[userId] = newHash;
    
    // Save the updated passwords to file
    await saveAdminPasswords(userPasswords);

    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  return await loadAdminUsers();
}

export async function deleteAdminUser(userId: string): Promise<boolean> {
  try {
    const adminUsers = await loadAdminUsers();
    const userPasswords = await loadAdminPasswords();
    
    const userIndex = adminUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return false;
    }
    
    adminUsers.splice(userIndex, 1);
    delete userPasswords[userId];
    
    await saveAdminUsers(adminUsers);
    await saveAdminPasswords(userPasswords);
    
    return true;
  } catch {
    return false;
  }
}
