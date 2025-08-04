'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a sequence for generating unique IDs for the id field
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS payment_id_seq START 1;
    `);

    // Create the Payments table with a custom formatted id field
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true,
        defaultValue: Sequelize.literal("CONCAT('PAYMENT_ID_', NEXTVAL('payment_id_seq'))") // Generate custom formatted ID
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users', // Assumes the table name is 'Users'
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
     
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stripe_payment_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stripe_customer_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the sequence when rolling back the migration
    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS payment_id_seq;
    `);

    // Drop the Payments table
    await queryInterface.dropTable('Payments');
  }
};
