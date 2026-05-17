-- جدول المستخدمين (متطوعين + مديرين)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'volunteer', -- volunteer | org_admin | super_admin
  city VARCHAR(100),
  skills TEXT[],
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الجمعيات
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

DROP TABLE IF EXISTS opportunities CASCADE;
-- جدول فرص التطوع
CREATE TABLE IF NOT EXISTS opportunities (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
location VARCHAR(100),
status VARCHAR(50) DEFAULT 'open',
created_at TIMESTAMP DEFAULT NOW()
);

-- جدول طلبات التطوع
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- pending | approved | rejected
  applied_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- جدول الشهادات
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  opportunity_id INTEGER REFERENCES opportunities(id),
  hours INTEGER,
  issued_at TIMESTAMP DEFAULT NOW()
);

-- جدول الشارات
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(100), -- first_volunteer | 10_hours | 50_hours
  earned_at TIMESTAMP DEFAULT NOW()
);