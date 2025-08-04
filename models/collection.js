'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    static associate(models) {
      // A collection can have many products
      Collection.hasMany(models.product, {
        foreignKey: 'collection_id',
        as: 'products'
      });
    }
  }
  
  Collection.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: Sequelize.literal("CONCAT('COLLECTION-', NEXTVAL('collection_id_seq'))")
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Collection',
    tableName: 'collections'
  });
  
  return Collection;
}; 