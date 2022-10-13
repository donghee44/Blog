'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  posting.init({
    postId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: DataTypes.STRING,
    nickname: DataTypes.STRING,
    contents: DataTypes.STRING,
    like:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'posting',
  });
  return posting;
};