'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable('Orders');
    if (!tableDescription.total) {
      await queryInterface.addColumn('Orders', 'total', {
        type: Sequelize.DECIMAL,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'total');
  }
}; 