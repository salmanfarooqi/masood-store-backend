'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create sequence for collection IDs
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS collection_id_seq START 1;
    `);

    await queryInterface.createTable('collections', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal("CONCAT('COLLECTION-', NEXTVAL('collection_id_seq'))")
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('collections');
    await queryInterface.sequelize.query(`DROP SEQUENCE IF EXISTS collection_id_seq;`);
  }
}; 