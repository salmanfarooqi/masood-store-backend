const db = require('./models');
const bcrypt = require('bcryptjs');

const addMasoodAdmin = async () => {
  try {
    console.log('🔐 Adding Masood admin user...');

    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: { email: 'masood@gmail.com' }
    });

    if (existingUser) {
      console.log('⚠️ User with email masood@gmail.com already exists');
      console.log('Updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash('masood1212', 10);
      
      // Update the existing user
      await existingUser.update({
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user password updated successfully!');
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
  addMasoodAdmin()
    .then(() => {
      console.log('🎉 Admin user setup completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Failed to add admin user:', error);
      process.exit(1);
    });
}

module.exports = addMasoodAdmin;