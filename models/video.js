const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
// Correct URL format for SQLite in-memory database
const sequelize = new Sequelize( {
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database', 'database.sqlite')
});

const Video = sequelize.define('Video', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

module.exports = { Video, sequelize };
