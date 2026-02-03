// Test admin login
// Run with: node scripts/testAdminLogin.js

require('dotenv').config();

const testAdminLogin = async () => {
    const email = process.env.ADMIN_EMAIL || 'admin@sitemonitor.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    console.log('Testing admin login...');
    console.log(`Email: ${email}`);

    try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Admin login successful!');
            console.log('Token:', data.data.token.substring(0, 50) + '...');
        } else {
            console.log('❌ Login failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('Make sure the backend server is running on port 5000');
    }
};

testAdminLogin();
