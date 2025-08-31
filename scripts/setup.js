#!/usr/bin/env node

const { initializeDataDirectory } = require('../src/lib/init-data.ts');

async function setup() {
  console.log('🚀 Setting up ICE SUPER Blog...\n');
  
  try {
    await initializeDataDirectory();
    console.log('\n✅ Setup complete! Your blog is ready to use.');
    console.log('\n📝 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🌐 Access your blog:');
    console.log('   Blog: http://localhost:3000');
    console.log('   Admin: http://localhost:3000/admin/login');
    console.log('\n⚠️  IMPORTANT: Change the default admin password after first login!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
