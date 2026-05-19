const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const applicationRoutes = require('./routes/applications');

const app = express();

// ✅ الحماية من الهجمات
app.use(helmet());

// ✅ منع الطلبات المتكررة (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // أقصى 100 طلب لكل IP
  message: { error: 'طلبات كثيرة جداً، حاول بعد قليل' }
});
app.use(limiter);

// ✅ Rate Limit أشد على تسجيل الدخول
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'محاولات كثيرة، حاول بعد 15 دقيقة' }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' })); // ✅ منع الطلبات الكبيرة جداً

app.get('/', (req, res) => {
  res.json({ message: '🌿 Mutawa API is running!' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

// ✅ التعامل مع الروابط الغير موجودة
app.use((req, res) => {
  res.status(404).json({ error: 'الصفحة غير موجودة' });
});

// ✅ التعامل مع الأخطاء العامة
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'خطأ في السيرفر' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});