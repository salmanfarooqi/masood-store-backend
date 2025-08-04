'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable('Orders');
    if (!tableDescription.guest_info) {
      await queryInterface.addColumn('Orders', 'guest_info', {
        type: Sequelize.JSON,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'guest_info');
  }
}; 