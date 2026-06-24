import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #f7f2ea 0%, #f3ece1 42%, #efe6d9 100%)',
    fontFamily: 'Arial, sans-serif',
    color: '#2d2218',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 48px',
    backgroundColor: 'rgba(45, 34, 24, 0.92)',
    color: '#fff',
    backdropFilter: 'blur(10px)',
  },
  brand: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '0.08em',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '10px 18px',
    borderRadius: '999px',
  },
  primaryNavLink: {
    backgroundColor: '#c67c4e',
  },
  content: {
    padding: '0 48px 56px',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '28px',
    alignItems: 'stretch',
    padding: '56px 0 28px',
  },
  heroCard: {
    background:
      'linear-gradient(135deg, rgba(45, 34, 24, 0.96) 0%, rgba(88, 58, 37, 0.96) 100%)',
    color: '#fff',
    borderRadius: '30px',
    padding: '52px',
    boxShadow: '0 24px 60px rgba(60, 38, 25, 0.18)',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.12)',
    fontSize: '12px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: '18px',
  },
  title: {
    fontSize: '54px',
    lineHeight: 1.05,
    margin: '0 0 18px',
  },
  desc: {
    fontSize: '17px',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.82)',
    maxWidth: '620px',
    marginBottom: '28px',
  },
  ctaRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-block',
    padding: '14px 22px',
    borderRadius: '14px',
    backgroundColor: '#c67c4e',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '14px 22px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: '1px solid rgba(255,255,255,0.18)',
  },
  infoCard: {
    borderRadius: '30px',
    padding: '28px',
    background:
      'linear-gradient(180deg, rgba(255,250,245,0.96) 0%, rgba(244,235,225,0.98) 100%)',
    border: '1px solid rgba(140, 93, 57, 0.15)',
    boxShadow: '0 18px 40px rgba(111, 90, 72, 0.12)',
  },
  infoTitle: {
    margin: '0 0 16px',
    color: '#4c392a',
    fontSize: '22px',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '18px',
    marginTop: '28px',
  },
  menuCard: {
    backgroundColor: '#fffaf5',
    borderRadius: '22px',
    padding: '22px',
    border: '1px solid rgba(140, 93, 57, 0.12)',
    boxShadow: '0 12px 24px rgba(111, 90, 72, 0.08)',
  },
  sectionTitle: {
    margin: '18px 0 10px',
    fontSize: '28px',
    color: '#2d2218',
  },
  sectionText: {
    color: '#6f5a48',
    lineHeight: 1.7,
    margin: 0,
  },
};

const menuItems = [
  {
    name: 'Espresso Nau',
    desc: 'Vi dam, hau vi chocolate, danh cho nguoi thich ca phe nguyen ban.',
  },
  {
    name: 'Cold Brew Cam',
    desc: 'Thanh, mat, nhan mui cam nhe, hop voi buoi trua va khach van phong.',
  },
  {
    name: 'Latte Muoi Bien',
    desc: 'Mem, beo, co chut man nhe de de uong va de nho.',
  },
];

const HomePage = () => {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          K-CAFE
        </Link>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>
            Trang chu
          </Link>
          <Link to="/login" style={{ ...styles.navLink, ...styles.primaryNavLink }}>
            Dang nhap
          </Link>
        </nav>
      </header>

      <main style={styles.content}>
      <section style={styles.hero}>
        <div style={styles.heroCard}>
          <div style={styles.badge}>Coffee Shop System</div>
          <h1 style={styles.title}>Khach vang lai van co the xem menu va khong gian quan</h1>
          <p style={styles.desc}>
            Day la trang chu public de gioi thieu quan, menu noi bat va khung gio phuc
            vu. Khach co the tham quan truoc, con quan tri vien se dang nhap de vao khu
            vuc dieu hanh.
          </p>
          <div style={styles.ctaRow}>
            <Link to="/login" style={styles.primaryButton}>
              Dang nhap quan tri
            </Link>
            <a href="#menu" style={styles.secondaryButton}>
              Xem menu nhanh
            </a>
          </div>
        </div>

        <aside style={styles.infoCard}>
          <h2 style={styles.infoTitle}>Thong tin nhanh</h2>
          <p style={styles.sectionText}>Mo cua: 07:00 - 22:00 moi ngay</p>
          <p style={styles.sectionText}>Khong gian: hoc tap, lam viec, gap go nhe</p>
          <p style={styles.sectionText}>Dich vu: mang di, tai quan, dat truoc so luong lon</p>
          <p style={styles.sectionText}>Diem nhan: hat rang vua, do uong pha tai cho</p>
        </aside>
      </section>

      <section id="menu">
        <h2 style={styles.sectionTitle}>Mon noi bat</h2>
        <p style={styles.sectionText}>
          Mot vai goi y de khach moi co the hinh dung nhanh phong cach quan va huong vi
          chinh.
        </p>

        <div style={styles.menuGrid}>
          {menuItems.map((item) => (
            <article key={item.name} style={styles.menuCard}>
              <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#4c392a' }}>{item.name}</h3>
              <p style={styles.sectionText}>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
      </main>
    </div>
  );
};

export default HomePage;
