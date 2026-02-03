const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create default admin in separate admins collection if not exists
    const Admin = require('../models/Admin');
    const bcrypt = require('bcryptjs');

    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@sitemonitor.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
      await Admin.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@sitemonitor.com',
        password: hashedPassword,
        isActive: true
      });
      console.log('✅ Default admin account created in admins collection');
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
