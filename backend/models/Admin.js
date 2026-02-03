const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin'
    },
    permissions: [{
        type: String,
        enum: [
            'users.view',
            'users.manage',
            'websites.view',
            'websites.manage',
            'system.view',
            'settings.view',
            'settings.manage',
            'reports.view',
            'admins.view',
            'admins.manage'
        ]
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    avatar: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    collection: 'admins'
});

// Index for faster lookups
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });

// Virtual to check if super admin
adminSchema.virtual('isSuperAdmin').get(function () {
    return this.role === 'superadmin';
});

// Method to check permission
adminSchema.methods.hasPermission = function (permission) {
    // Super admin has all permissions
    if (this.role === 'superadmin') return true;
    return this.permissions.includes(permission);
};

// Method to get all permissions (for super admin returns all, for admin returns assigned)
adminSchema.methods.getAllPermissions = function () {
    if (this.role === 'superadmin') {
        return [
            'users.view', 'users.manage',
            'websites.view', 'websites.manage',
            'system.view',
            'settings.view', 'settings.manage',
            'reports.view',
            'admins.view', 'admins.manage'
        ];
    }
    return this.permissions;
};

module.exports = mongoose.model('Admin', adminSchema);
