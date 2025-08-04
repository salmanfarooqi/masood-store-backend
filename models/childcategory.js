'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class childCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      childCategory.belongsTo(models.parentCategory, {
        foreignKey: 'parent_id',
        as: 'parentCategory'
      });
      
      childCategory.hasMany(models.product, {
        foreignKey: 'child_category',
        sourceKey: 'name',
        as: 'products'
      });
    }
  }
  childCategory.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,  // Custom ID format
      defaultValue: Sequelize.literal("CONCAT('CHILDCAT-', NEXTVAL('child_category_id_seq'))")  
    },

    name: DataTypes.STRING,
    color: DataTypes.STRING,
    icon: DataTypes.STRING,
    parent_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'childCategory',
  });
  return childCategory;
};