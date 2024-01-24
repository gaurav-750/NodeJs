const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  //more info like address, etc..
});

module.exports = Order;
