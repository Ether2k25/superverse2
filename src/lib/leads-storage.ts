import fs from 'fs/promises';
import path from 'path';

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_DIR = path.join(DATA_DIR, 'leads');
const LEADS_FILE = path.join(LEADS_DIR, 'leads.json');

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'comment' | 'newsletter' | 'contact';
  postId?: string;
  postTitle?: string;
  commentId?: string;
  createdAt: string;
  expiresAt: string;
}

// Ensure leads directory exists
async function ensureLeadsDir() {
  try {
    await fs.access(LEADS_DIR);
  } catch {
    await fs.mkdir(LEADS_DIR, { recursive: true });
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Load leads from file
async function loadLeads(): Promise<Lead[]> {
  try {
    await ensureLeadsDir();
    const data = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save leads to file
async function saveLeads(leads: Lead[]): Promise<void> {
  try {
    await ensureLeadsDir();
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Error saving leads:', error);
    throw error;
  }
}

// Clean expired leads
async function cleanExpiredLeads(): Promise<void> {
  const leads = await loadLeads();
  const now = new Date();
  const validLeads = leads.filter(lead => new Date(lead.expiresAt) > now);
  
  if (validLeads.length !== leads.length) {
    await saveLeads(validLeads);
  }
}

// Create new lead
export async function createLead(leadData: {
  name: string;
  email: string;
  phone?: string;
  source: 'comment' | 'newsletter' | 'contact';
  postId?: string;
  postTitle?: string;
  commentId?: string;
}): Promise<Lead> {
  await cleanExpiredLeads();
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
  
  const lead: Lead = {
    id: generateId(),
    ...leadData,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
  
  const leads = await loadLeads();
  leads.push(lead);
  await saveLeads(leads);
  
  return lead;
}

// Get all leads
export async function getAllLeads(): Promise<Lead[]> {
  await cleanExpiredLeads();
  return await loadLeads();
}

// Get leads by source
export async function getLeadsBySource(source: Lead['source']): Promise<Lead[]> {
  const leads = await getAllLeads();
  return leads.filter(lead => lead.source === source);
}

// Get leads by post
export async function getLeadsByPost(postId: string): Promise<Lead[]> {
  const leads = await getAllLeads();
  return leads.filter(lead => lead.postId === postId);
}

// Delete lead
export async function deleteLead(id: string): Promise<boolean> {
  const leads = await loadLeads();
  const leadIndex = leads.findIndex(lead => lead.id === id);
  
  if (leadIndex === -1) {
    return false;
  }
  
  leads.splice(leadIndex, 1);
  await saveLeads(leads);
  
  return true;
}
