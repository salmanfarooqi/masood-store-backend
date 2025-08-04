'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wishlists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      added_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    // Add unique constraint to prevent duplicate wishlist items
    await queryInterface.addConstraint('Wishlists', {
      fields: ['user_id', 'product_id'],
      type: 'unique',
      name: 'unique_user_product_wishlist'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wishlists');
  }
}; 