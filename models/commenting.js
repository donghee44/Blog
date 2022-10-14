'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commenting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  commenting.init(
    {
      commentId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nickname: DataTypes.STRING,
      comments: DataTypes.STRING,
      postId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'commenting',
    },
  );
  return commenting;
};
