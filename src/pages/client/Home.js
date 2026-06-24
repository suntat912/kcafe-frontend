import React from 'react';
import { Link } from 'react-router-dom';
import UserIdentityBadge from '../../components/UserIdentityBadge';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f0e6 0%, #efe1d1 100%)',
    fontFamily: 'Arial, sans-serif',
    color: '#4a241d',
  },
  header: {
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    padding: '20px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '0.08em',
  },
  nav: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  navLink: {
    color: '#fff7ef',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  hero: {
    padding: '42px 48px 28px',
  },
  heroCard: {
    borderRadius: '28px',
    padding: '40px',
    background:
      'linear-gradient(135deg, rgba(143,46,38,0.96) 0%, rgba(107,18,24,0.96) 100%)',
    color: '#fff7ef',
    boxShadow: '0 20px 44px rgba(107, 18, 24, 0.18)',
  },
  heroTitle: {
    margin: '0 0 14px',
    fontSize: '48px',
    lineHeight: 1.08,
  },
  heroText: {
    margin: '0 0 22px',
    maxWidth: '760px',
    lineHeight: 1.8,
    color: 'rgba(255,247,239,0.85)',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    backgroundColor: '#d5a25c',
    color: '#6b1218',
    padding: '13px 20px',
    borderRadius: '999px',
    fontWeight: 'bold',
  },
  secondaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    border: '1px solid rgba(255,247,239,0.24)',
    color: '#fff7ef',
    padding: '13px 20px',
    borderRadius: '999px',
    fontWeight: 'bold',
  },
  section: {
    padding: '0 48px 32px',
  },
  sectionTitle: {
    fontSize: '30px',
    margin: '0 0 10px',
    color: '#8f2e26',
  },
  sectionText: {
    margin: '0 0 20px',
    color: '#7b5a50',
    lineHeight: 1.7,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fffaf6',
    borderRadius: '22px',
    overflow: 'hidden',
    border: '1px solid rgba(143, 46, 38, 0.10)',
    boxShadow: '0 12px 28px rgba(107, 18, 24, 0.08)',
  },
  cardVisual: {
    height: '170px',
    padding: '18px',
    display: 'flex',
    alignItems: 'end',
    color: '#fff7ef',
    fontWeight: 'bold',
    fontSize: '22px',
  },
  cardBody: {
    padding: '18px',
  },
};

const items = [
  {
    name: 'Phin Sữa Đá',
    desc: 'Món dễ chọn khi muốn vị cà phê Việt rõ, sữa đậm và dễ uống mỗi ngày.',
    visual: 'linear-gradient(135deg, #8f2e26 0%, #d17c5b 100%)',
  },
  {
    name: 'Freeze Chocolate',
    desc: 'Phù hợp cho khách hàng trẻ, thích đồ uống đầy và có hình thức bắt mắt.',
    visual: 'linear-gradient(135deg, #6b1218 0%, #a74337 100%)',
  },
  {
    name: 'Trà Sen Vàng',
    desc: 'Lựa chọn nhẹ hơn cho những lúc cần một món thanh, dễ uống và dễ quay lại.',
    visual: 'linear-gradient(135deg, #c08b43 0%, #8f2e26 100%)',
  },
];

const CustomerHome = () => {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>K-CAFE</div>
        <nav style={styles.nav}>
          <Link to="/customer/profile" style={styles.navLink}>
            Hồ sơ
          </Link>
          <UserIdentityBadge profilePath="/customer/profile" />
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroCard}>
          <h1 style={styles.heroTitle}>Xin chào khách hàng, đây là khu vực dành cho khách hàng</h1>
          <p style={styles.heroText}>
            Sau khi đăng nhập với role customer, bạn sẽ vào trang này để xem món nổi bật,
            theo dõi ưu đãi và tiếp tục mua hàng. Sau này bạn có thể nối giỏ hàng, lịch sử
            đơn và thông tin tài khoản vào đây.
          </p>
          <div style={styles.buttonRow}>
            <a href="#menu" style={styles.primaryButton}>
              Xem menu
            </a>
          </div>
        </div>
      </section>

      <section id="menu" style={styles.section}>
        <h2 style={styles.sectionTitle}>Món đề xuất cho khách hàng</h2>
        <p style={styles.sectionText}>
          Đây là customer home riêng, tách khỏi landing page public. Role customer sẽ được
          đưa vào đây ngay sau khi đăng nhập thành công.
        </p>

        <div style={styles.grid}>
          {items.map((item) => (
            <article key={item.name} style={styles.card}>
              <div style={{ ...styles.cardVisual, background: item.visual }}>{item.name}</div>
              <div style={styles.cardBody}>
                <p style={{ margin: 0, lineHeight: 1.7, color: '#7b5a50' }}>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerHome;
