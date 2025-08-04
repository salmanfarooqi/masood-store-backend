'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a sequence for generating unique IDs for the shipment_id field
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS shipment_id_seq START 1;
    `);

    // Create the shipmentDetails table with a custom formatted shipment_id
    await queryInterface.createTable('shipmentDetails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true,
        defaultValue: Sequelize.literal("CONCAT('SHIPMENT_ID_', NEXTVAL('shipment_id_seq'))") // Generate custom formatted shipment_id
      },
      country: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zip_code: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
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
      DROP SEQUENCE IF EXISTS shipment_id_seq;
    `);

    // Drop the shipmentDetails table
    await queryInterface.dropTable('shipmentDetails');
  }
};
