import mysql from "mysql2";
import * as dotenv from "dotenv";
import { createClient } from 'redis';
dotenv.config();

console.log('Connecting to Mysql database...');
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME
});
console.log('Successfully connected to database !');

export const redisClient = createClient({ url: 'redis://localhost:6379' });

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
  console.log('Successfully connected to Redis');
});