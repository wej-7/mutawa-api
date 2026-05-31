const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'mutawa_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
      }
);

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'volunteer',
      city VARCHAR(100),
      skills TEXT[],
      points INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS organizations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT,
      city VARCHAR(100),
      contact_email VARCHAR(150),
      verified BOOLEAN DEFAULT false,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS opportunities (
      id SERIAL PRIMARY KEY,
      org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      city VARCHAR(100),
      skills_needed TEXT[],
      spots INTEGER DEFAULT 1,
      date DATE,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending',
      applied_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, opportunity_id)
    );
    CREATE TABLE IF NOT EXISTS certificates (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      opportunity_id INTEGER REFERENCES opportunities(id),
      hours INTEGER,
      issued_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS badges (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      type VARCHAR(100),
      earned_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Tables are ready');
};

pool.connect()
  .then(() => {
    console.log('✅ Database connected');
    return createTables();
  })
  .catch(err => console.error('❌ Database error:', err.message));

module.exports = pool;