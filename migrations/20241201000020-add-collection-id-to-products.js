'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'collection_id', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'collections',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'collection_id');
  }
}; 