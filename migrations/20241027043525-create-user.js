'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a sequence for generating unique IDs
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS user_id_seq START 1;
    `);

    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal("CONCAT('USERID-', NEXTVAL('user_id_seq'))")
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
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
    await queryInterface.dropTable('Users');

    // Drop the sequence when rolling back the migration
    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS user_id_seq;
    `);
  }
};
