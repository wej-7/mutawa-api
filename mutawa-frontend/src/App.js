import React, { useState } from 'react';
import Login from './Login';

const G = {
  primary: '#00C853',
  dark: '#00796B',
  darker: '#004D40',
  light: '#E8F5E9',
  accent: '#FFD600',
};

const styles = {
  app: { fontFamily: 'Tajawal, Arial', background: '#F1F8F6', minHeight: '100vh', direction: 'rtl' },
  nav: { background: `linear-gradient(135deg, ${G.darker}, ${G.dark})`, padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 },
  navTitle: { color: 'white', fontSize: '1.6rem', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' },
  navBtn: { background: G.accent, color: G.darker, border: 'none', padding: '9px 22px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  navUser: { color: 'white', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  hero: { background: `linear-gradient(135deg, ${G.darker} 0%, ${G.dark} 50%, ${G.primary} 100%)`, color: 'white', padding: '5rem 2rem 6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  heroCircle1: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: '-80px', right: '-80px' },
  heroCircle2: { position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: '-60px', left: '-40px' },
  heroTag: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', padding: '5px 18px', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' },
  heroTitle: { fontSize: '3rem', fontWeight: 'bold', margin: '0 0 1rem', lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.2)' },
  heroSub: { fontSize: '1.15rem', opacity: 0.9, margin: '0 0 2.5rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' },
  heroBtn: { background: G.accent, color: G.darker, border: 'none', padding: '14px 35px', borderRadius: '30px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  statsRow: { display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' },
  statBox: { background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '1.2rem 2rem', textAlign: 'center', minWidth: '130px' },
  statNum: { fontSize: '2rem', fontWeight: 'bold', color: G.accent },
  statLabel: { fontSize: '0.85rem', opacity: 0.85, marginTop: '4px' },
  container: { maxWidth: '1150px', margin: '0 auto', padding: '3rem 1.5rem' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' },
  sectionDot: { width: '6px', height: '30px', background: `linear-gradient(${G.primary}, ${G.dark})`, borderRadius: '3px' },
  sectionTitle: { fontSize: '1.6rem', fontWeight: 'bold', color: G.darker, margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.8rem' },
  card: { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 25px rgba(0,0,0,0.07)', border: '1px solid #E0F2F1', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardTop: { background: `linear-gradient(135deg, ${G.darker}, ${G.dark})`, padding: '1.5rem', color: 'white', position: 'relative' },
  cardBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', padding: '3px 12px', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '10px' },
  cardTitle: { fontSize: '1.15rem', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  cardBody: { padding: '1.4rem' },
  cardDesc: { color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.2rem' },
  cardMeta: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.2rem' },
  metaChip: { background: G.light, color: G.darker, fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', fontWeight: '500' },
  applyBtn: { width: '100%', background: `linear-gradient(135deg, ${G.dark}, ${G.primary})`, color: 'white', border: 'none', padding: '13px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(0,150,100,0.3)' },
  appliedBtn: { width: '100%', background: '#E8F5E9', color: G.dark, border: `2px solid ${G.primary}`, padding: '13px', borderRadius: '12px', cursor: 'default', fontWeight: 'bold', fontSize: '1rem' },
  welcome: { background: `linear-gradient(135deg, ${G.dark}, ${G.primary})`, color: 'white', padding: '0.8rem 2rem', textAlign: 'center', fontSize: '0.95rem' },
  footer: { background: G.darker, color: 'rgba(255,255,255,0.8)', textAlign: 'center', padding: '2rem', marginTop: '2rem', fontSize: '0.9rem' },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [applied, setApplied] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/opportunities')
      .then(res => res.json())
      .then(data => setOpportunities(data));
  }, []);

  const applyToOpportunity = async (id) => {
    if (!user) { setShowLogin(true); return; }
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ opportunity_id: id })
    });
    const data = await res.json();
    if (data.application) { setApplied([...applied, id]); alert('تم التقديم بنجاح! 🎉'); }
    else alert(data.error || 'حدث خطأ');
  };

  if (showLogin) return <Login onLogin={(u) => { setUser(u); setShowLogin(false); }} />;

  return (
    <div style={styles.app}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h1 style={styles.navTitle}>🌿 منصة متطوع</h1>
        {user ? (
          <div style={styles.navUser}>
            <span>أهلاً، {user.name} 👋</span>
            <button style={styles.navBtn} onClick={() => { setUser(null); localStorage.clear(); }}>خروج</button>
          </div>
        ) : (
          <button style={styles.navBtn} onClick={() => setShowLogin(true)}>تسجيل الدخول</button>
        )}
      </nav>

      {user && <div style={styles.welcome}>🌟 نقاطك الحالية: {user.points} نقطة — استمر في التطوع واكسب المزيد!</div>}

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        <div style={styles.heroTag}>🇸🇦 منصة التطوع الأولى في المملكة</div>
        <h2 style={styles.heroTitle}>غيّر حياة شخص<br />ابدأ اليوم 🌱</h2>
        <p style={styles.heroSub}>انضم لآلاف المتطوعين وساهم في بناء مجتمع أفضل من خلال فرص تناسب مهاراتك</p>
        <button style={styles.heroBtn} onClick={() => setShowLogin(true)}>انضم الآن ←</button>
        <div style={styles.statsRow}>
          <div style={styles.statBox}><div style={styles.statNum}>+500</div><div style={styles.statLabel}>متطوع نشط</div></div>
          <div style={styles.statBox}><div style={styles.statNum}>+50</div><div style={styles.statLabel}>جمعية خيرية</div></div>
          <div style={styles.statBox}><div style={styles.statNum}>+1200</div><div style={styles.statLabel}>ساعة تطوع</div></div>
          <div style={styles.statBox}><div style={styles.statNum}>3</div><div style={styles.statLabel}>مدن مشاركة</div></div>
        </div>
      </div>

      {/* Opportunities */}
      <div style={styles.container}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionDot} />
          <h2 style={styles.sectionTitle}>الفرص المتاحة</h2>
        </div>
        <div style={styles.grid}>
          {opportunities.map(op => (
            <div key={op.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.cardBadge}>{op.category}</div>
                <h3 style={styles.cardTitle}>{op.title}</h3>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardDesc}>{op.description}</p>
                <div style={styles.cardMeta}>
                  <span style={styles.metaChip}>📍 {op.city}</span>
                  <span style={styles.metaChip}>🏢 {op.org_name}</span>
                  <span style={styles.metaChip}>👥 {op.spots} أماكن</span>
                  <span style={styles.metaChip}>📅 {new Date(op.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <button
                  style={applied.includes(op.id) ? styles.appliedBtn : styles.applyBtn}
                  onClick={() => applyToOpportunity(op.id)}
                >
                  {applied.includes(op.id) ? '✅ تم التقديم' : 'تطوع الآن ←'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={styles.footer}>
        <p>🌿 منصة متطوع — نربط المتطوعين بمن يحتاجهم | جميع الحقوق محفوظة 2025</p>
      </footer>
    </div>
  );
}