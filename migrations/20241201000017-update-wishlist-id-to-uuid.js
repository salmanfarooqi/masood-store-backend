'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, drop the unique constraint
    await queryInterface.removeConstraint('Wishlists', 'unique_user_product_wishlist');
    
    // Add a new UUID column
    await queryInterface.addColumn('Wishlists', 'new_id', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    });

    // Drop the old id column
    await queryInterface.removeColumn('Wishlists', 'id');

    // Rename new_id to id
    await queryInterface.renameColumn('Wishlists', 'new_id', 'id');

    // Add primary key constraint to the new id column
    await queryInterface.addConstraint('Wishlists', {
      fields: ['id'],
      type: 'primary key',
      name: 'Wishlists_pkey'
    });

    // Re-add the unique constraint
    await queryInterface.addConstraint('Wishlists', {
      fields: ['user_id', 'product_id'],
      type: 'unique',
      name: 'unique_user_product_wishlist'
    });
  },

  async down(queryInterface, Sequelize) {
    // This is a destructive migration, so we'll just drop and recreate the table
    await queryInterface.dropTable('Wishlists');
  }
}; 