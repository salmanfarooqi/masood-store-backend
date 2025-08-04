'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class parentCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      parentCategory.hasMany(models.childCategory, {
        foreignKey: 'parent_id',
        as: 'childCategories'
      });
      
      parentCategory.hasMany(models.product, {
        foreignKey: 'parent_category',
        sourceKey: 'name',
        as: 'products'
      });
    }
  }
  parentCategory.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,  // Custom ID format
      defaultValue: Sequelize.literal("CONCAT('CATEGORYID-', NEXTVAL('category_id_seq'))")  // Custom ID generation
    },
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    icon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'parentCategory',
  });
  return parentCategory;
};