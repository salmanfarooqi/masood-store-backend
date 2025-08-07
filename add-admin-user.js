const db = require('./models');
const bcrypt = require('bcryptjs');

const addAdminUser = async () => {
  try {
    console.log('🔐 Adding Masood admin user...');

    // Ensure database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: { email: 'masood@gmail.com' }
    });

    if (existingUser) {
      console.log('⚠️ User with email masood@gmail.com already exists');
      console.log('Updating password and role...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash('masood1212', 10);
      
      // Update the existing user
      await existingUser.update({
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user updated successfully!');
      console.log('📧 Email: masood@gmail.com');
      console.log('🔑 Password: masood1212');
      console.log('👤 Role: admin');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash('masood1212', 10);
      
      // Create new admin user
      const newAdmin = await db.User.create({
        first_name: 'Masood',
        last_name: 'Admin',
        phone: '1234567890',
        email: 'masood@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: masood@gmail.com');
      console.log('🔑 Password: masood1212');
      console.log('👤 Role: admin');
      console.log('🆔 User ID:', newAdmin.id);
    }

    // Verify the user was created/updated
    const verifyUser = await db.User.findOne({
      where: { email: 'masood@gmail.com' }
    });
    
    if (verifyUser) {
      console.log('✅ Verification successful - User exists in database');
      console.log('👤 User details:', {
        id: verifyUser.id,
        email: verifyUser.email,
        role: verifyUser.role,
        first_name: verifyUser.first_name
      });
    }

  } catch (error) {
    console.error('❌ Error adding admin user:', error);
    throw error;
  } finally {
    // Close database connection
    await db.sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  addAdminUser()
    .then(() => {
      console.log('🎉 Admin user setup completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Failed to add admin user:', error);
      process.exit(1);
    });
}

module.exports = addAdminUser;