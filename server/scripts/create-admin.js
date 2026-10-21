require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const { User } = require('../src/models');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admitwise_db';
    await mongoose.connect(connString);
    console.log('[AdmitWise CLI] Connected to database.');

    console.log('\n--- Create or Promote Administrator Account ---');
    const name = (await question('Enter Administrator Full Name (e.g. System Admin): ')) || 'System Administrator';
    const email = (await question('Enter Admin Email: ')).toLowerCase().trim();

    if (!email || !email.includes('@')) {
      console.log('Error: A valid email address is required.');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const confirm = await question(
        `User '${email}' already exists with role '${existingUser.role}'. Promote to admin? (y/n): `
      );
      if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`[Success] User ${email} has been promoted to administrator.`);
      } else {
        console.log('Operation cancelled.');
      }
      process.exit(0);
    }

    const password = await question('Enter Admin Password (min 6 characters): ');
    if (!password || password.length < 6) {
      console.log('Error: Password must be at least 6 characters.');
      process.exit(1);
    }

    await User.create({
      name,
      email,
      password,
      role: 'admin',
      isActive: true,
    });

    console.log(`\n[Success] Administrator account for ${email} created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createAdmin();
