import path from 'path';
import Sequelize from 'sequelize';
import sqlite3 from 'sqlite3';

const SequelizeRuntime = Sequelize as any;
const DataTypes = SequelizeRuntime.DataTypes;

export const sequelize = new SequelizeRuntime({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage: path.resolve(process.cwd(), 'sqlite/dev.sqlite'),
  logging: false,
} as any);

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lineStatus: {
    type: DataTypes.ENUM('online', 'offline'),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;