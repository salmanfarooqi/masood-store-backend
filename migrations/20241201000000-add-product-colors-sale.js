'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'colors', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    });

    await queryInterface.addColumn('products', 'sale_price', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('products', 'is_on_sale', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('products', 'sale_percentage', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'colors');
    await queryInterface.removeColumn('products', 'sale_price');
    await queryInterface.removeColumn('products', 'is_on_sale');
    await queryInterface.removeColumn('products', 'sale_percentage');
  }
}; 