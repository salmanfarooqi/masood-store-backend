'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        first_name: 'Admin',
        last_name: 'User',
        phone: '1234567890',
        email: 'admin@example.com',
        password: 'adminpassword', // You should hash this password in a real application!
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
  },
};
