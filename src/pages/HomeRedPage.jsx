import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import CustomerSupportChat from '../components/CustomerSupportChat';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f7efe5',
    backgroundImage:
      'linear-gradient(180deg, rgba(107,18,24,0.96) 0 108px, transparent 108px), linear-gradient(180deg, #f7efe5 0%, #efe2d2 100%)',
    color: '#3c1f17',
    fontFamily: 'Arial, sans-serif',
  },
  topbar: {
    height: '108px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 56px',
    color: '#fff7ef',
  },
  brandWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  brandBadge: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,247,239,0.98)',
    border: '2px solid rgba(255,247,239,0.36)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
    flexShrink: 0,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  brandTitle: {
    margin: 0,
    fontSize: '30px',
    letterSpacing: '0.08em',
  },
  brandSub: {
    margin: '4px 0 0',
    fontSize: '12px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    fontWeight: 'bold',
  },
  navLink: {
    color: '#fff7ef',
    textDecoration: 'none',
    fontSize: '15px',
  },
  navButton: {
    color: '#6b1218',
    backgroundColor: '#f2d6b8',
    textDecoration: 'none',
    padding: '12px 20px',
    borderRadius: '999px',
    fontWeight: 'bold',
  },
  hero: {
    padding: '34px 56px 0',
  },
  heroFrame: {
    overflow: 'hidden',
    minHeight: '560px',
    borderRadius: '28px',
    background:
      'linear-gradient(90deg, rgba(107,18,24,0.92) 0%, rgba(107,18,24,0.84) 40%, rgba(76,15,19,0.78) 100%), linear-gradient(135deg, #925d36 0%, #4e130f 100%)',
    boxShadow: '0 26px 60px rgba(95, 28, 24, 0.28)',
    padding: '42px',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.05fr) minmax(340px, 0.95fr)',
    gap: '28px',
    alignItems: 'stretch',
  },
  heroTexture: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    color: '#fff7ef',
    padding: '24px 18px 24px 14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heroEyebrow: {
    display: 'inline-block',
    backgroundColor: 'rgba(242, 214, 184, 0.18)',
    border: '1px solid rgba(242, 214, 184, 0.3)',
    padding: '8px 14px',
    borderRadius: '999px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '18px',
    alignSelf: 'flex-start',
  },
  heroTitle: {
    margin: '0 0 18px',
    fontSize: '56px',
    lineHeight: 1.04,
    maxWidth: '560px',
  },
  heroText: {
    fontSize: '17px',
    lineHeight: 1.8,
    color: 'rgba(255,247,239,0.86)',
    marginBottom: '28px',
    maxWidth: '560px',
  },
  heroActions: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  primaryCta: {
    backgroundColor: '#d5a25c',
    color: '#6b1218',
    textDecoration: 'none',
    padding: '14px 24px',
    borderRadius: '999px',
    fontWeight: 'bold',
  },
  secondaryCta: {
    color: '#fff7ef',
    textDecoration: 'none',
    padding: '14px 24px',
    borderRadius: '999px',
    border: '1px solid rgba(255,247,239,0.26)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    fontWeight: 'bold',
  },
  heroRight: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gap: '18px',
  },
  heroMedia: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: '18px',
    minHeight: '100%',
  },
  heroMediaMain: {
    minHeight: '360px',
    borderRadius: '28px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 22px 46px rgba(26, 6, 8, 0.30)',
    border: '1px solid rgba(255,247,239,0.18)',
  },
  heroMediaStack: {
    display: 'grid',
    gap: '18px',
  },
  heroMediaSmall: {
    minHeight: '171px',
    borderRadius: '24px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 18px 34px rgba(26, 6, 8, 0.26)',
    border: '1px solid rgba(255,247,239,0.18)',
  },
  heroPanel: {
    padding: '24px',
    borderRadius: '24px',
    backgroundColor: 'rgba(247, 239, 229, 0.94)',
    color: '#5b221d',
    boxShadow: '0 18px 36px rgba(40, 9, 12, 0.2)',
  },
  panelLabel: {
    fontSize: '12px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#9e3a33',
    marginBottom: '8px',
  },
  panelTitle: {
    fontSize: '26px',
    margin: '0 0 10px',
  },
  panelText: {
    margin: 0,
    lineHeight: 1.7,
    color: '#74443b',
  },
  section: {
    padding: '34px 56px 0',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '22px',
  },
  card: {
    backgroundColor: '#fbf5ee',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(143, 46, 38, 0.10)',
    boxShadow: '0 12px 30px rgba(107, 18, 24, 0.08)',
  },
  cardIndex: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#6b1218',
    color: '#f8e7d4',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    gap: '24px',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '34px',
    color: '#6b1218',
  },
  sectionDesc: {
    margin: '10px 0 0',
    color: '#7b5a50',
    lineHeight: 1.7,
    maxWidth: '720px',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '20px',
  },
  menuCard: {
    borderRadius: '24px',
    overflow: 'hidden',
    backgroundColor: '#fffaf6',
    boxShadow: '0 14px 30px rgba(107, 18, 24, 0.09)',
    border: '1px solid rgba(143, 46, 38, 0.10)',
  },
  menuVisual: {
    height: '180px',
    padding: '20px',
    display: 'flex',
    alignItems: 'end',
    color: '#fff7ef',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  menuBody: {
    padding: '20px',
  },
  menuMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '14px',
    color: '#8f2e26',
    fontWeight: 'bold',
  },
  storyBand: {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: '22px',
  },
  storyVisual: {
    minHeight: '360px',
    borderRadius: '26px',
    backgroundImage:
      'linear-gradient(180deg, rgba(107,18,24,0.10), rgba(107,18,24,0.28)), url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 16px 36px rgba(107, 18, 24, 0.12)',
  },
  storyCopy: {
    borderRadius: '26px',
    padding: '36px',
    backgroundColor: '#6b1218',
    color: '#fff3e8',
    boxShadow: '0 18px 36px rgba(107, 18, 24, 0.18)',
  },
  footer: {
    marginTop: '42px',
    padding: '26px 56px 40px',
    color: '#8a695f',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
};

const heroImages = {
  main:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  sideTop:
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
  sideBottom:
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
};

const featureCards = [
  {
    id: '01',
    title: 'Cà phê đậm vị',
    text: 'Tập trung vào nhóm món cà phê Việt, pha nhanh, mùi rõ, hợp khách văn phòng và khách quen.',
  },
  {
    id: '02',
    title: 'Không gian để dừng lại',
    text: 'Bàn dài, ánh sáng ấm, không khí đô thị nhưng vẫn giữ được chất thương hiệu quán cà phê Việt.',
  },
  {
    id: '03',
    title: 'Vận hành gọn gàng',
    text: 'Khách vãng lai xem menu trên trang chủ, quản trị viên đăng nhập để điều hành sản phẩm và đơn hàng.',
  },
];

const menuItems = [
  {
    name: 'Phin Sữa Đá',
    tag: 'Đặc trưng',
    price: '39.000',
    text: 'Vị phin rõ, sữa đậm, hậu ngọt vừa. Đây là ly mở đầu để khách nhớ ngay đến thương hiệu.',
    visual: 'linear-gradient(135deg, #8f2e26 0%, #d17c5b 100%)',
  },
  {
    name: 'Freeze Chocolate',
    tag: 'Bán chạy',
    price: '55.000',
    text: 'Kết cấu đầy, màu sắc bắt mắt, hợp nhóm khách trẻ và nhu cầu check-in.',
    visual: 'linear-gradient(135deg, #6b1218 0%, #a74337 100%)',
  },
  {
    name: 'Trà Sen Vàng',
    tag: 'Trà nhẹ',
    price: '45.000',
    text: 'Cân bằng menu bằng một món trà thanh, dễ uống, giúp trang chủ nhìn đầy đặn hơn.',
    visual: 'linear-gradient(135deg, #c08b43 0%, #8f2e26 100%)',
  },
  {
    name: 'Bánh Mì Nóng',
    tag: 'Ăn nhẹ',
    price: '29.000',
    text: 'Thêm món ăn nhanh để khách thấy rõ quán có thể phục vụ cả buổi sáng và giữa buổi.',
    visual: 'linear-gradient(135deg, #a84d32 0%, #e0ad64 100%)',
  },
];

const HomeRedPage = () => {
  return (
    <div className="kc-home-page" style={styles.page}>
      <header className="kc-home-topbar" style={styles.topbar}>
        <div className="kc-home-brand-wrap" style={styles.brandWrap}>
          <div className="kc-home-brand-badge" style={styles.brandBadge}>
            <img src={logoImage} alt="K-Coffee" style={styles.brandLogo} />
          </div>
          <div>
            <h1 style={styles.brandTitle}>K-CAFE</h1>
            <p style={styles.brandSub}>Cà phê và bánh ngọt</p>
          </div>
        </div>

        <nav className="kc-home-nav" style={styles.nav}>
          <a href="#menu" style={styles.navLink}>
            Thực đơn
          </a>
          <a href="#story" style={styles.navLink}>
            Về quán
          </a>
          <a href="#visit" style={styles.navLink}>
            Cửa hàng
          </a>
          <Link to="/login" style={styles.navButton}>
            Đăng nhập
          </Link>
        </nav>
      </header>

      <section className="kc-home-hero" style={styles.hero}>
        <div className="kc-home-hero-frame" style={styles.heroFrame}>
          <div className="kc-home-hero-content" style={styles.heroContent}>
            <div style={styles.heroEyebrow}>Thương hiệu cà phê Việt</div>
            <h2 className="kc-home-hero-title" style={styles.heroTitle}>Đậm chất cà phê Việt, rõ thương hiệu, dễ nhớ ngay từ cái nhìn đầu</h2>
            <p className="kc-home-hero-text" style={styles.heroText}>
              Giao diện này theo hướng thương hiệu cà phê chuỗi: đỏ thương hiệu, hero lớn,
              thực đơn nổi bật và khối nội dung rõ để khách vãng lai xem nhanh mà không cần
              đăng nhập.
            </p>
            <div className="kc-home-actions" style={styles.heroActions}>
              <a href="#menu" style={styles.primaryCta}>
                Khám phá thực đơn
              </a>
              <Link to="/login" style={styles.secondaryCta}>
                Vào khu quản trị
              </Link>
            </div>
          </div>

          <div className="kc-home-hero-right" style={styles.heroRight}>
            <div className="kc-home-hero-media" style={styles.heroMedia}>
              <div className="kc-home-hero-media-main" style={{ ...styles.heroMediaMain, backgroundImage: `url(${heroImages.main})` }} />
              <div className="kc-home-hero-media-stack" style={styles.heroMediaStack}>
                <div style={{ ...styles.heroMediaSmall, backgroundImage: `url(${heroImages.sideTop})` }} />
                <div style={{ ...styles.heroMediaSmall, backgroundImage: `url(${heroImages.sideBottom})` }} />
              </div>
            </div>

            <div className="kc-home-hero-panel" style={styles.heroPanel}>
              <div style={styles.panelLabel}>Thông tin cửa hàng</div>
              <h3 style={styles.panelTitle}>Mở cửa mỗi ngày</h3>
              <p style={styles.panelText}>
                07:00 - 22:00. Phục vụ tại quán, mang đi và đặt nhanh cho nhóm văn phòng
                cần ly nước ổn định, dễ uống và dễ quay lại.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="kc-section" style={styles.section}>
        <div className="kc-grid-3" style={styles.grid3}>
          {featureCards.map((item) => (
            <article key={item.id} style={styles.card}>
              <div style={styles.cardIndex}>{item.id}</div>
              <h3 style={{ margin: '0 0 10px', color: '#6b1218', fontSize: '24px' }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#7b5a50', lineHeight: 1.7 }}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="menu" className="kc-section" style={styles.section}>
        <div className="kc-section-head" style={styles.sectionHead}>
          <div>
            <h2 style={styles.sectionTitle}>Menu nổi bật</h2>
            <p style={styles.sectionDesc}>
              Tinh thần trang chủ chuỗi cà phê: visual lớn, tên món rõ, tag ngắn và giá mở
              đầu để khách có thể xem qua trong vài giây.
            </p>
          </div>
        </div>

        <div className="kc-menu-grid" style={styles.menuGrid}>
          {menuItems.map((item) => (
            <article key={item.name} style={styles.menuCard}>
              <div style={{ ...styles.menuVisual, background: item.visual }}>{item.tag}</div>
              <div style={styles.menuBody}>
                <h3 style={{ margin: 0, color: '#6b1218', fontSize: '24px' }}>{item.name}</h3>
                <p style={{ margin: '10px 0 0', color: '#7b5a50', lineHeight: 1.7 }}>{item.text}</p>
                <div style={styles.menuMeta}>
                  <span>Từ {item.price}đ</span>
                  <span>Xem thêm</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="story" className="kc-section" style={styles.section}>
        <div className="kc-story-band" style={styles.storyBand}>
          <div className="kc-story-visual" style={styles.storyVisual} />
          <div className="kc-story-copy" style={styles.storyCopy}>
            <div style={{ ...styles.heroEyebrow, marginBottom: '16px' }}>Về K-CAFE</div>
            <h2 style={{ margin: '0 0 16px', fontSize: '38px', lineHeight: 1.14 }}>
              Không gian cho khách ghé nhanh, ngồi lâu, hoặc hẹn gặp nhẹ vào cuối ngày
            </h2>
            <p style={{ margin: 0, lineHeight: 1.8, color: 'rgba(255,243,232,0.86)' }}>
              Tối ưu theo hướng thương hiệu đỏ đô: có chất cà phê Việt, có món Đặc trưng, có
              khu vực quản trị riêng. Sau này bạn có thể gắn ảnh, slider và dữ liệu thật vào đây.
            </p>
          </div>
        </div>
      </section>

      <section id="visit" className="kc-section" style={styles.section}>
        <div style={{ ...styles.card, backgroundColor: '#6b1218', color: '#fff3e8' }}>
          <div style={styles.sectionHead}>
            <div>
              <h2 style={{ ...styles.sectionTitle, color: '#fff3e8' }}>Ghé quán hoặc đặt nhanh</h2>
              <p style={{ ...styles.sectionDesc, color: 'rgba(255,243,232,0.78)' }}>
                Bạn có thể gắn thêm địa chỉ, bản đồ, hotline và CTA đặt hàng ở block này.
              </p>
            </div>
            <Link to="/login" style={styles.navButton}>
              Quản trị đăng nhập
            </Link>
          </div>
        </div>
      </section>

      <footer className="kc-home-footer" style={styles.footer}>
        <span>Trang giới thiệu thương hiệu K-CAFE</span>
        <span>Bảng màu: đỏ rượu vang, kem, caramel</span>
      </footer>
      <CustomerSupportChat />
    </div>
  );
};

export default HomeRedPage;

