const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// تقديم طلب تطوع
router.post('/', auth, async (req, res) => {
  const { opportunity_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO applications (user_id, opportunity_id)
       VALUES ($1,$2) RETURNING *`,
      [req.user.id, opportunity_id]
    );

    // أضف 10 نقاط للمتطوع
    await db.query('UPDATE users SET points = points + 10 WHERE id=$1', [req.user.id]);

    res.status(201).json({ message: 'تم التقديم بنجاح!', application: result.rows[0] });
  } catch {
    res.status(400).json({ error: 'قدّمت على هذه الفرصة مسبقاً' });
  }
});

// طلباتي
router.get('/mine', auth, async (req, res) => {
  const result = await db.query(
    `SELECT a.*, o.title, o.date, o.city, org.name as org_name
     FROM applications a
     JOIN opportunities o ON a.opportunity_id = o.id
     JOIN organizations org ON o.org_id = org.id
     WHERE a.user_id = $1
     ORDER BY a.applied_at DESC`,
    [req.user.id]
  );
  res.json(result.rows);
});

// قبول أو رفض طلب
router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body; // approved | rejected
  const result = await db.query(
    `UPDATE applications SET status=$1 WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );

  // لو اتقبل — أضف 50 نقطة وأصدر شهادة
  if (status === 'approved') {
    const app = result.rows[0];
    await db.query('UPDATE users SET points = points + 50 WHERE id=$1', [app.user_id]);
    await db.query(
      `INSERT INTO certificates (user_id, opportunity_id, hours) VALUES ($1,$2,$3)`,
      [app.user_id, app.opportunity_id, 4]
    );
  }

  res.json(result.rows[0]);
});

module.exports = router;