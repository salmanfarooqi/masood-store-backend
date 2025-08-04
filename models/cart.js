'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Cart.belongsTo(models.product,{
         foreignKey:'product_id',
         as:"product"
      })
    }
  }
  Cart.init({


    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,  // Use STRING for custom format if you prefer
      defaultValue: Sequelize.literal("CONCAT('CARTID-', NEXTVAL('cart_id_seq'))")  // Using Sequelize.literal for custom ID
    },
    product_id:{

     type:DataTypes.STRING,
     allowNull:false,
     references:{
      model:"products",
      key:'id'
     }

    },
    quantity: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    user_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};