import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser, AdminSession } from '@/types/admin';
import fs from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 10;

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin-users.json');
const ADMIN_PASSWORDS_FILE = path.join(DATA_DIR, 'admin-passwords.json');

// Default admin user (change these credentials in production!)
const DEFAULT_ADMIN: AdminUser = {
  id: '1',
  username: 'admin',
  email: 'admin@icesuper.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// Helper function to get admin users
async function getAdminUsers(): Promise<Record<string, AdminUser>> {
  try {
    const data = await fs.readFile(ADMIN_USERS_FILE, 'utf-8');
    const usersArray = JSON.parse(data) as AdminUser[];
    // Convert array to object with id as key
    const usersObject: Record<string, AdminUser> = {};
    usersArray.forEach(user => {
      usersObject[user.id] = user;
    });
    return usersObject;
  } catch (error) {
    console.error('Error getting admin users:', error);
    return {};
  }
}

// Helper function to save admin users
async function saveAdminUsers(users: Record<string, AdminUser>): Promise<boolean> {
  try {
    // Convert object to array for file storage
    const usersArray = Object.values(users);
    await fs.writeFile(ADMIN_USERS_FILE, JSON.stringify(usersArray, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving admin users:', error);
    return false;
  }
}

// Helper function to get admin passwords
async function getAdminPasswords(): Promise<Record<string, string>> {
  try {
    const data = await fs.readFile(ADMIN_PASSWORDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting admin passwords:', error);
    return {};
  }
}

// Helper function to save admin passwords
async function saveAdminPasswords(passwords: Record<string, string>): Promise<boolean> {
  try {
    await fs.writeFile(ADMIN_PASSWORDS_FILE, JSON.stringify(passwords, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving admin passwords:', error);
    return false;
  }
}

// Initialize default admin if not exists
export async function initializeDefaultAdmin(): Promise<void> {
  const users = await getAdminUsers();
  const passwords = await getAdminPasswords();
  
  if (!users['1']) {
    const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    users['1'] = DEFAULT_ADMIN;
    passwords['1'] = hashedPassword;
    
    await saveAdminUsers(users);
    await saveAdminPasswords(passwords);
    console.log('Default admin user created');
  }
}

// Authenticate admin user
export async function authenticateAdmin(username: string, password: string): Promise<AdminSession | null> {
  const users = await getAdminUsers();
  const passwords = await getAdminPasswords();
  
  const user = Object.values(users).find(u => u.username === username);
  if (!user) return null;
  
  const hashedPassword = passwords[user.id];
  if (!hashedPassword) return null;
  
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordValid) return null;
  
  // Create JWT token
  const expiresIn = '7d';
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn }
  );
  
  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
  
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
    expiresAt: expiresAt.toISOString(),
  };
}

// Verify admin token
export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    console.log('Verifying JWT token with secret:', JWT_SECRET.substring(0, 10) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    console.log('JWT decoded successfully, userId:', decoded.userId);
    
    const users = await getAdminUsers();
    console.log('Available users:', Object.keys(users));
    
    const user = users[decoded.userId] || null;
    console.log('User found:', user ? user.username : 'Not found');
    
    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Create new admin user
export async function createAdminUser(userData: {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
}): Promise<AdminUser | null> {
  const users = await getAdminUsers();
  const passwords = await getAdminPasswords();
  
  // Check if username or email already exists
  const userExists = Object.values(users).some(
    u => u.username === userData.username || u.email === userData.email
  );
  
  if (userExists) return null;
  
  // Create new user
  const userId = Date.now().toString();
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  
  const newUser: AdminUser = {
    id: userId,
    username: userData.username,
    email: userData.email,
    role: userData.role,
    createdAt: new Date().toISOString(),
  };
  
  // Save user and password
  users[userId] = newUser;
  passwords[userId] = hashedPassword;
  
  const [usersSaved, passwordsSaved] = await Promise.all([
    saveAdminUsers(users),
    saveAdminPasswords(passwords),
  ]);
  
  return usersSaved && passwordsSaved ? newUser : null;
}

// Change admin password
export async function changeAdminPassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
  const users = await getAdminUsers();
  const passwords = await getAdminPasswords();
  
  if (!users[userId] || !passwords[userId]) return false;
  
  // Verify old password
  const isPasswordValid = await bcrypt.compare(oldPassword, passwords[userId]);
  if (!isPasswordValid) return false;
  
  // Update password
  passwords[userId] = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return saveAdminPasswords(passwords);
}

// Get all admin users
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const users = await getAdminUsers();
  return Object.values(users);
}

// Delete admin user
export async function deleteAdminUser(userId: string): Promise<boolean> {
  const users = await getAdminUsers();
  const passwords = await getAdminPasswords();
  
  if (!users[userId]) return false;
  
  // Don't allow deleting the last admin
  const adminUsers = Object.values(users).filter(u => u.role === 'admin');
  if (adminUsers.length <= 1 && users[userId].role === 'admin') {
    return false;
  }
  
  // Delete user and password
  delete users[userId];
  delete passwords[userId];
  
  const [usersSaved, passwordsSaved] = await Promise.all([
    saveAdminUsers(users),
    saveAdminPasswords(passwords),
  ]);
  
  return usersSaved && passwordsSaved;
}
