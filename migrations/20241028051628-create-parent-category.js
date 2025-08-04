'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the sequence for generating unique IDs for the id field
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS category_id_seq START 1;
    `);

    // Create the parentCategories table with a STRING id
    await queryInterface.createTable('parentCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal("CONCAT('CATEGORYID-', NEXTVAL('category_id_seq'))")  
      },
      name: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      icon: {
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
      DROP SEQUENCE IF EXISTS category_id_seq;
    `);

    // Drop the parentCategories table
    await queryInterface.dropTable('parentCategories');
  }
};
