"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  //MANY TO MANY R BTW WORKSITE AND WORKER
  class Worksite extends Model {
    static associate(models) {
      // this.belongsToMany();
    }
  }
  Worksite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      worksite_name: { type: DataTypes.STRING(255) },
      geometry: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      modelName: "worksites",
      underscored: true,
    }
  );
  return Worksite;
};
