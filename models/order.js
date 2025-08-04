'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Payment, {
        foreignKey: 'payment_id',
        as: 'payment'
      });
      
      Order.belongsTo(models.shipmentDetail, {
        foreignKey: 'shipment_id',
        as: 'shipment'
      });
    }
  }
  Order.init({
    status: DataTypes.STRING,
    payment_id: DataTypes.STRING,
    shipment_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    user_id: DataTypes.STRING, // Can be null for guest users
    payment_method: DataTypes.STRING,
    order_items: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    guest_info: DataTypes.JSON, // Store guest customer information
    total: DataTypes.DECIMAL, // Total order amount
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};