'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the sequence for generating unique IDs for the cart id field
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS cart_id_seq START 1;
    `);

    // Create the Carts table with a STRING id
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal("CONCAT('CARTID-', NEXTVAL('cart_id_seq'))")  // Generates unique IDs
      },
      product_id: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.FLOAT
      },
      user_id: {
        type: Sequelize.STRING
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
      DROP SEQUENCE IF EXISTS cart_id_seq;
    `);

    // Drop the Carts table
    await queryInterface.dropTable('Carts');
  }
};
