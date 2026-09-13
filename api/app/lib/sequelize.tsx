import fs from 'fs';
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

export const Word = sequelize.define('Word', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // phonemes stored as a JSON-encoded array of strings, e.g. ["b","e","d"]
  phonemes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;

// Creates tables that don't exist yet (safe to call on every boot; no-ops once tables exist).
let dbReadyPromise: Promise<void> | null = null;

async function seedWords() {
  const count = await Word.count();
  if (count > 0) return;

  const dataDir = path.resolve(process.cwd(), 'data');
  const files: { file: string; length: number }[] = [
    { file: 'words3.json', length: 3 },
    { file: 'words4.json', length: 4 },
    { file: 'words5.json', length: 5 },
  ];

  const rows: { word: string; phonemes: string; length: number }[] = [];
  for (const { file, length } of files) {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) continue;
    const entries = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as { word: string; phonemes: string[] }[];
    entries.forEach((entry) => {
      rows.push({ word: entry.word, phonemes: JSON.stringify(entry.phonemes), length });
    });
  }

  if (rows.length > 0) await Word.bulkCreate(rows);
}

export function ensureDb(): Promise<void> {
  if (!dbReadyPromise) {
    dbReadyPromise = sequelize.sync().then(() => seedWords());
  }
  return dbReadyPromise as Promise<void>;
}