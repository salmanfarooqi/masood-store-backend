'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // A review belongs to a product
      Review.belongsTo(models.product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      
      // A review belongs to a user (optional, can be null for guest reviews)
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  
  Review.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: Sequelize.literal("CONCAT('REVIEW-', NEXTVAL('review_id_seq'))")
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true // Allow null for guest reviews
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING
    },
    comment: {
      type: DataTypes.TEXT
    },
    reviewer_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reviewer_email: {
      type: DataTypes.STRING
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews'
  });
  
  return Review;
}; 