'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the sequence for generating unique IDs for the id field in childCategories
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS child_category_id_seq START 1;
    `);

    // Create the childCategories table with a STRING id
    await queryInterface.createTable('childCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal("CONCAT('CATEGORYID-', NEXTVAL('child_category_id_seq'))")  // Generates unique IDs
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
      parent_id: {
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
      DROP SEQUENCE IF EXISTS child_category_id_seq;
    `);

    // Drop the childCategories table
    await queryInterface.dropTable('childCategories');
  }
};
