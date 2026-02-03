// Reset or create admin account
// Run: node scripts/resetAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const ADMIN_EMAIL = 'jeet@gmail.com';
const ADMIN_PASSWORD = 'JEET25802580....';
const ADMIN_NAME = 'Jeet';

async function resetAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin exists
        let admin = await Admin.findOne({ email: ADMIN_EMAIL });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        // All permissions for super admin
        const allPermissions = [
            'users.view', 'users.manage',
            'websites.view', 'websites.manage',
            'system.view',
            'settings.view', 'settings.manage',
            'reports.view',
            'admins.view', 'admins.manage'
        ];

        if (admin) {
            // Update existing admin
            admin.password = hashedPassword;
            admin.name = ADMIN_NAME;
            admin.role = 'superadmin';
            admin.permissions = allPermissions;
            admin.isActive = true;
            await admin.save();
            console.log('✅ Admin account updated successfully!');
        } else {
            // Create new admin
            admin = new Admin({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'superadmin',
                permissions: allPermissions,
                isActive: true
            });
            await admin.save();
            console.log('✅ Admin account created successfully!');
        }

        console.log('\n📧 Email:', ADMIN_EMAIL);
        console.log('🔑 Password:', ADMIN_PASSWORD);
        console.log('👤 Role: Super Admin (Full Access)');
        console.log('\n🔐 Login at: /admin/login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetAdmin();
