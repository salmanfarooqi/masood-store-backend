'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make stripe_customer_id nullable
    await queryInterface.changeColumn('Payments', 'stripe_customer_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Make amount nullable (in case it's not set immediately)
    await queryInterface.changeColumn('Payments', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });

    // Make currency nullable
    await queryInterface.changeColumn('Payments', 'currency', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Make status nullable
    await queryInterface.changeColumn('Payments', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert stripe_customer_id
    await queryInterface.changeColumn('Payments', 'stripe_customer_id', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Revert amount
    await queryInterface.changeColumn('Payments', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: false
    });

    // Revert currency
    await queryInterface.changeColumn('Payments', 'currency', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Revert status
    await queryInterface.changeColumn('Payments', 'status', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
}; 