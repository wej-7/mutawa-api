import React, { useState } from 'react';

const G = {
  primary: '#00C853',
  dark: '#00796B',
  darker: '#004D40',
  accent: '#FFD600',
};

const styles = {
  page: { fontFamily: 'Tajawal, Arial', background: `linear-gradient(135deg, ${G.darker}, ${G.dark}, ${G.primary})`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' },
  card: { background: 'white', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: G.darker, margin: 0 },
  logoSub: { color: '#666', fontSize: '0.9rem', marginTop: '4px' },
  tabs: { display: 'flex', marginBottom: '1.5rem', background: '#F1F8F6', borderRadius: '12px', padding: '4px' },
  tab: { flex: 1, padding: '9px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' },
  activeTab: { background: `linear-gradient(135deg, ${G.darker}, ${G.dark})`, color: 'white' },
  inactiveTab: { background: 'transparent', color: '#666' },
  input: { width: '100%', padding: '12px', border: `1.5px solid #E0F2F1`, borderRadius: '10px', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box', direction: 'rtl', outline: 'none' },
  btn: { width: '100%', padding: '14px', background: `linear-gradient(135deg, ${G.darker}, ${G.primary})`, color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 15px rgba(0,150,100,0.3)' },
  label: { fontSize: '0.85rem', color: '#444', marginBottom: '4px', display: 'block' },
  success: { background: '#E8F5E9', color: G.darker, padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }
};

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    const url = tab === 'login'
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    const body = tab === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password, city: form.city, skills: [] };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsError(false);
        setMsg('تم تسجيل الدخول بنجاح! 🎉');
        setTimeout(() => onLogin(data.user), 1000);
      } else {
        setIsError(true);
        setMsg(data.error || 'حدث خطأ');
      }
    } catch {
      setIsError(true);
      setMsg('تعذر الاتصال بالسيرفر');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <h1 style={styles.logoTitle}>🌿 منصة متطوع</h1>
          <p style={styles.logoSub}>ساهم في بناء مجتمع أفضل</p>
        </div>

        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(tab === 'login' ? styles.activeTab : styles.inactiveTab) }} onClick={() => setTab('login')}>تسجيل الدخول</button>
          <button style={{ ...styles.tab, ...(tab === 'register' ? styles.activeTab : styles.inactiveTab) }} onClick={() => setTab('register')}>حساب جديد</button>
        </div>

        {msg && <div style={isError ? styles.error : styles.success}>{msg}</div>}

        {tab === 'register' && (
          <>
            <label style={styles.label}>الاسم الكامل</label>
            <input style={styles.input} name="name" placeholder="محمد أحمد" onChange={handle} />
            <label style={styles.label}>المدينة</label>
            <input style={styles.input} name="city" placeholder="الرياض" onChange={handle} />
          </>
        )}

        <label style={styles.label}>البريد الإلكتروني</label>
        <input style={styles.input} name="email" placeholder="example@email.com" onChange={handle} />
        <label style={styles.label}>كلمة المرور</label>
        <input style={styles.input} name="password" type="password" placeholder="••••••••" onChange={handle} />

        <button style={styles.btn} onClick={submit}>
          {tab === 'login' ? 'دخول ←' : 'إنشاء حساب ←'}
        </button>
      </div>
    </div>
  );
}