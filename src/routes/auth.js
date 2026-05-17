const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, password)
VALUES ($1, $2, $3) RETURNING id, name, email, role`,
[name, email, hashed]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'بيانات خاطئة' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, points: user.points }, token });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// بيانات المستخدم الحالي
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  const result = await db.query(
    'SELECT id, name, email, city, skills, points, role FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json(result.rows[0]);
});

module.exports = router;