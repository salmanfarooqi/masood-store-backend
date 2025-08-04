'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipmentDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shipmentDetail.hasMany(models.Order, {
        foreignKey: 'shipment_id',
        as: 'orders'
      });
    }
  }
  shipmentDetail.init({
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    address: DataTypes.STRING,
    user_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'shipmentDetail',
  });
  return shipmentDetail;
};