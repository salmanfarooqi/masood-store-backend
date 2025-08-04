'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a sequence for generating unique IDs for the order_id field
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS order_id_seq START 1;
    `);

    // Create the Orders table with a STRING order_id
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true,
        defaultValue: Sequelize.literal("CONCAT('ORDER-ID-', NEXTVAL('order_id_seq'))")
      },
      status: {
        type: Sequelize.STRING
      },
      payment_id: {
        type: Sequelize.STRING
      },
      shipment_id: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      order_items:{
         type:Sequelize.ARRAY(Sequelize.STRING)
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: true // Allow null for guest users
      },
      payment_method: {
        type: Sequelize.STRING
      },
      guest_info: {
        type: Sequelize.JSON,
        allowNull: true
      },
      total: {
        type: Sequelize.DECIMAL,
        allowNull: true
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
    // await queryInterface.sequelize.query(`
    //   DROP SEQUENCE IF EXISTS order_id_seq;
    // `);

    // Drop the Orders table
    await queryInterface.dropTable('Orders');
  }
};
