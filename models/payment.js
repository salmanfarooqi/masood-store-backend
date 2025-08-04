'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.hasMany(models.Order, {
        foreignKey: 'payment_id',
        as: 'orders'
      });
    }
  }
  Payment.init({
    user_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    status: DataTypes.STRING,
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripe_payment_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_screenshot: {
      type: DataTypes.STRING,
      allowNull: true
    },
    guest_info: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};