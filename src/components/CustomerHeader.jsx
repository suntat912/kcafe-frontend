import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  clearStoredUser,
  getAvatarUrl,
  getCartCount,
  getStoredUser,
  getUserInitials,
} from '../utils/userSession';
import logoImage from '../assets/logo.png';
import CustomerSupportChat from './CustomerSupportChat';

const styles = {
  header: {
    backgroundColor: '#b5292d',
    color: '#fff7ef',
    padding: '14px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    minHeight: '108px',
    boxSizing: 'border-box',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
    minWidth: 0,
    flex: 1,
  },
  brand: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    backgroundColor: 'rgba(255,247,239,0.98)',
    border: '2px solid rgba(255,247,239,0.34)',
    boxShadow: '0 8px 18px rgba(0,0,0,0.14)',
    flexShrink: 0,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#fff7ef',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
    padding: '10px 0',
    borderBottom: '2px solid transparent',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    color: '#f3d8a4',
    borderBottomColor: '#f3d8a4',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    flexWrap: 'wrap',
  },
  actionPill: {
    minHeight: '48px',
    padding: '10px 16px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.14)',
    color: '#fff7ef',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  cartBadge: {
    minWidth: '28px',
    height: '28px',
    borderRadius: '999px',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#f3d8a4',
    color: '#6b1218',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '0 8px',
    boxSizing: 'border-box',
  },
  userPill: {
    minHeight: '48px',
    padding: '8px 16px 8px 10px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.14)',
    color: '#fff7ef',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#fff7ef',
    color: '#8f2e26',
    fontSize: '13px',
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  logoutButton: {
    minHeight: '48px',
    padding: '10px 16px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    color: '#fff7ef',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
};

const CustomerHeader = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(getCartCount());
  const [user, setUser] = useState(getStoredUser());
  const [imageBroken, setImageBroken] = useState(false);

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener('cart-updated', syncCart);
    window.addEventListener('storage', syncCart);
    window.addEventListener('user-updated', syncUser);

    return () => {
      window.removeEventListener('cart-updated', syncCart);
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('user-updated', syncUser);
    };
  }, []);

  const avatarUrl = useMemo(() => getAvatarUrl(user?.avatar), [user?.avatar]);
  const initials = getUserInitials(user?.full_name);

  const renderNavLink = (to, label) => (
    <NavLink
      to={to}
      style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink)}
    >
      {label}
    </NavLink>
  );

  const handleLogout = () => {
    clearStoredUser();
    navigate('/login');
  };

  return (
    <>
      <header className="kc-customer-header" style={styles.header}>
        <div className="kc-customer-header-left" style={styles.left}>
          <NavLink className="kc-customer-brand" to="/customer/home" style={styles.brand}>
            <img src={logoImage} alt="K-Coffee" style={styles.brandLogo} />
          </NavLink>

          <nav className="kc-customer-nav" style={styles.nav}>
            {renderNavLink('/customer/home', 'Trang chủ')}
            {renderNavLink('/customer/drinks', 'Đồ uống')}
            {renderNavLink('/customer/services', 'Dịch vụ')}
            {renderNavLink('/customer/profile', 'Hồ sơ')}
          </nav>
        </div>

        <div className="kc-customer-actions" style={styles.right}>
          <NavLink className="kc-customer-pill" to="/customer/cart" style={styles.actionPill}>
            <span>Giỏ hàng</span>
            <span style={styles.cartBadge}>{cartCount}</span>
          </NavLink>

          <NavLink className="kc-customer-pill kc-customer-user-pill" to="/customer/profile" style={styles.userPill}>
            <div style={styles.avatar}>
              {avatarUrl && !imageBroken ? (
                <img
                  src={avatarUrl}
                  alt={user?.full_name || 'Tài khoản'}
                  style={styles.avatarImage}
                  onError={() => setImageBroken(true)}
                />
              ) : (
                initials
              )}
            </div>
            <span>{user?.full_name || 'Tài khoản'}</span>
          </NavLink>

          <button className="kc-customer-pill" type="button" onClick={handleLogout} style={styles.logoutButton}>
            Đăng xuất
          </button>
        </div>
      </header>
      <CustomerSupportChat />
    </>
  );
};

export default CustomerHeader;
