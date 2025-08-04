'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.belongsTo(models.parentCategory, {
        foreignKey: 'parent_category',
        targetKey: 'name',
        as: 'parentCategory'
      });
      
      product.belongsTo(models.childCategory, {
        foreignKey: 'child_category',
        targetKey: 'name',
        as: 'childCategory'
      });

      // Association with Collection
      product.belongsTo(models.Collection, {
        foreignKey: 'collection_id',
        as: 'collection'
      });

      // Association with Reviews
      product.hasMany(models.Review, {
        foreignKey: 'product_id',
        as: 'reviews'
      });
    }
  }
  product.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,  // Use STRING for custom format if you prefer
      defaultValue: Sequelize.literal("CONCAT('PRODUICTiD-', NEXTVAL('product_id_seq'))")  // Automatically generate a unique ID like 'CARTID-1'
    },
    name: DataTypes.STRING,
    image:DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.TEXT,
    parent_category: DataTypes.STRING,
    child_category: DataTypes.STRING,
    price: DataTypes.FLOAT,
    stock: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
    size: DataTypes.STRING,
    colors: DataTypes.ARRAY(DataTypes.STRING), // Array of available colors
    sale_price: DataTypes.FLOAT, // Sale price for discounted products
    is_on_sale: DataTypes.BOOLEAN, // Flag to indicate if product is on sale
    sale_percentage: DataTypes.FLOAT, // Percentage discount
    video: DataTypes.STRING, // Video URL for product demonstration
    collection_id: DataTypes.STRING, // Reference to collection (subcategory)
    is_trending: DataTypes.BOOLEAN // Flag to indicate if product is trending
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};