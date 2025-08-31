const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');

async function changeAdminPassword() {
  // Get new password from command line argument
  const newPassword = process.argv[2];
  
  if (!newPassword) {
    console.log('Usage: node change-admin-password.js <new-password>');
    console.log('Example: node change-admin-password.js myNewSecurePassword123');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.log('Error: Password must be at least 6 characters long');
    process.exit(1);
  }

  try {
    const DATA_DIR = path.join(process.cwd(), 'data');
    const ADMIN_PASSWORDS_FILE = path.join(DATA_DIR, 'admin-passwords.json');
    
    // Hash the new password
    console.log('Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Read current passwords
    let passwords = {};
    try {
      const data = await fs.readFile(ADMIN_PASSWORDS_FILE, 'utf-8');
      passwords = JSON.parse(data);
    } catch (error) {
      console.log('Creating new password file...');
    }
    
    // Update admin password (user ID "1" is the default admin)
    passwords['1'] = hashedPassword;
    
    // Save updated passwords
    await fs.writeFile(ADMIN_PASSWORDS_FILE, JSON.stringify(passwords, null, 2), 'utf-8');
    
    console.log('✅ Admin password changed successfully!');
    console.log('You can now login with:');
    console.log('  Username: admin');
    console.log('  Password: ' + newPassword);
    
  } catch (error) {
    console.error('❌ Error changing password:', error.message);
    process.exit(1);
  }
}

changeAdminPassword();
