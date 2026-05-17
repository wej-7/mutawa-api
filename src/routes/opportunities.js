const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// كل الفرص (مع فلترة اختيارية)
router.get('/', async (req, res) => {
  const { city, category } = req.query;
  let query = `SELECT o.*, org.name as org_name FROM opportunities o
               JOIN organizations org ON o.org_id = org.id
               WHERE o.status = 'active'`;
  const params = [];

  if (city) { params.push(city); query += ` AND o.city = $${params.length}`; }
  if (category) { params.push(category); query += ` AND o.category = $${params.length}`; }

  query += ' ORDER BY o.created_at DESC';
  const result = await db.query(query, params);
  res.json(result.rows);
});

// تفاصيل فرصة واحدة
router.get('/:id', async (req, res) => {
  const result = await db.query(
    `SELECT o.*, org.name as org_name, org.contact_email
     FROM opportunities o JOIN organizations org ON o.org_id = org.id
     WHERE o.id = $1`,
    [req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'الفرصة غير موجودة' });
  res.json(result.rows[0]);
});

// إنشاء فرصة (للجمعيات فقط)
router.post('/', auth, async (req, res) => {
  const { org_id, title, description, category, city, skills_needed, spots, date } = req.body;
  const result = await db.query(
    `INSERT INTO opportunities (org_id, title, description, category, city, skills_needed, spots, date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [org_id, title, description, category, city, skills_needed, spots, date]
  );
  res.status(201).json(result.rows[0]);
});

// AI Matching — فرص مناسبة للمستخدم
router.get('/match/me', auth, async (req, res) => {
  const user = await db.query('SELECT city, skills FROM users WHERE id=$1', [req.user.id]);
  const { city, skills } = user.rows[0];

  const result = await db.query(
    `SELECT o.*, org.name as org_name,
       (SELECT COUNT(*) FROM unnest(o.skills_needed) s WHERE s = ANY($1::text[])) as match_score
     FROM opportunities o JOIN organizations org ON o.org_id = org.id
     WHERE o.status = 'active' AND (o.city = $2 OR o.skills_needed && $1::text[])
     ORDER BY match_score DESC, o.created_at DESC
     LIMIT 10`,
    [skills, city]
  );
  res.json(result.rows);
});

module.exports = router;