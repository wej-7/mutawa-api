const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err.message));
// الكود الجديد حطيه هنا بالضبط
const createTableQuery = `
CREATE TABLE IF NOT EXISTS opportunities (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
location VARCHAR(100),
status VARCHAR(50) DEFAULT 'open',
created_at TIMESTAMP DEFAULT NOW()
);`;

pool.query(createTableQuery)
.then(() => console.log('✅ Opportunities table is ready'))
.catch(err => console.error('❌ Error creating table:', err));

module.exports = pool;