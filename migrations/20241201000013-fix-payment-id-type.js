'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change payment_id from INTEGER to STRING in Orders table
    await queryInterface.changeColumn('Orders', 'payment_id', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert payment_id back to INTEGER
    await queryInterface.changeColumn('Orders', 'payment_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
}; 