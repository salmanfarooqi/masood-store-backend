'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the sequence for generating unique IDs for the product id field
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS product_id_seq START 1;
    `);

    // Create the products table with a STRING id
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal("CONCAT('PRODUCTID-', NEXTVAL('product_id_seq'))")  // Generates unique IDs
      },
      name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.ARRAY(Sequelize.STRING),  // Array of strings for images
        allowNull: true
      },
      description: {
        type: Sequelize.STRING
      },
      parent_category: {
        type: Sequelize.STRING
      },
      child_category: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      stock: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.FLOAT
      },
      weight: {
        type: Sequelize.FLOAT
      },
      size: {
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
      DROP SEQUENCE IF EXISTS product_id_seq;
    `);

    // Drop the products table
    await queryInterface.dropTable('products');
  }
};
