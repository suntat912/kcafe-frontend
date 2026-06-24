import React from 'react';
import { Link } from 'react-router-dom';
import ProfileContent from '../../components/ProfileContent';
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
  section: {
    padding: '40px 48px',
  },
};

const Profile = () => {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{ fontWeight: 'bold', fontSize: '28px', letterSpacing: '0.08em' }}>K-CAFE</div>
        <nav style={styles.nav}>
          <Link to="/customer/home" style={styles.navLink}>
            Trang khách hàng
          </Link>
          <UserIdentityBadge profilePath="/customer/profile" />
        </nav>
      </header>

      <section style={styles.section}>
        <ProfileContent />
      </section>
    </div>
  );
};

export default Profile;
