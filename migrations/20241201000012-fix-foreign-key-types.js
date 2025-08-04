'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the columns
    await queryInterface.removeColumn('Orders', 'payment_id');
    await queryInterface.removeColumn('Orders', 'shipment_id');
    await queryInterface.removeColumn('Payments', 'order_id');

    // Recreate the columns with correct types
    await queryInterface.addColumn('Orders', 'payment_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'shipment_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Payments', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the columns
    await queryInterface.removeColumn('Orders', 'payment_id');
    await queryInterface.removeColumn('Orders', 'shipment_id');
    await queryInterface.removeColumn('Payments', 'order_id');

    // Recreate with original types
    await queryInterface.addColumn('Orders', 'payment_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'shipment_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Payments', 'order_id', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
}; 