'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash the password
    const hashedPassword = await bcrypt.hash('masood1212', 10);
    
    return queryInterface.bulkInsert('Users', [
      {
        id: 'USERID-MASOOD-ADMIN',
        first_name: 'Masood',
        last_name: 'Admin',
        phone: '1234567890',
        email: 'masood@gmail.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: 'masood@gmail.com' }, {});
  },
};