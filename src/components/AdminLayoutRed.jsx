import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserIdentityBadge from './UserIdentityBadge';
import logoImage from '../assets/logo.png';

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f3f5f7',
    color: '#1f2937',
  },
  sidebar: {
    width: '272px',
    padding: '24px 18px',
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #123f32 0%, #0f5132 100%)',
    color: '#ffffff',
    borderRight: '1px solid rgba(255,255,255,0.10)',
  },
  brand: {
    padding: '8px 12px 22px',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    marginBottom: '18px',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#ffffff',
    textDecoration: 'none',
  },
  brandBadge: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.96)',
    border: '2px solid rgba(255,255,255,0.22)',
    flexShrink: 0,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  brandTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '0.06em',
  },
  brandSub: {
    margin: '6px 0 0',
    color: 'rgba(255,255,255,0.72)',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'grid',
    gap: '10px',
  },
  navLink: {
    display: 'block',
    padding: '13px 14px',
    color: '#e5f2ec',
    textDecoration: 'none',
    borderRadius: '14px',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  navLinkActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    color: '#ffffff',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    padding: '18px 28px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #dde3ea',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    color: '#163b2f',
  },
  content: {
    padding: '28px',
    flex: 1,
    overflow: 'auto',
  },
};

const navItems = [
  { to: '/admin/dashboard', label: 'Tổng quan' },
  { to: '/admin/products', label: 'Quản lý sản phẩm' },
  { to: '/admin/categories', label: 'Quản lý danh mục' },
  { to: '/admin/orders', label: 'Quản lý đơn hàng' },
  { to: '/admin/accounts', label: 'Quản lý tài khoản' },
  { to: '/admin/profile', label: 'Hồ sơ cá nhân' },
];

const AdminLayoutRed = ({ title, children }) => {
  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <Link to="/admin/products" style={styles.brandLink}>
            <div style={styles.brandBadge}>
              <img src={logoImage} alt="K-Coffee" style={styles.brandLogo} />
            </div>
            <div>
              <div style={styles.brandTitle}>K-COFFEE</div>
              <p style={styles.brandSub}>Bảng điều khiển quản trị</p>
            </div>
          </Link>
        </div>

        <div style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <h1 style={styles.title}>{title}</h1>
          <UserIdentityBadge profilePath="/admin/profile" />
        </div>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export default AdminLayoutRed;
