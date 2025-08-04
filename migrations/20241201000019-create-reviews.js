'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create sequence for review IDs
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS review_id_seq START 1;
    `);

    await queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal("CONCAT('REVIEW-', NEXTVAL('review_id_seq'))")
      },
      product_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.TEXT
      },
      reviewer_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reviewer_email: {
        type: Sequelize.STRING
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_approved: {
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
    await queryInterface.dropTable('reviews');
    await queryInterface.sequelize.query(`DROP SEQUENCE IF EXISTS review_id_seq;`);
  }
}; 