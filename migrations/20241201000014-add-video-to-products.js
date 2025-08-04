'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'video', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Video URL for product demonstration'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'video');
  }
}; 