import React from 'react';
import CustomerHeader from '../../components/CustomerHeader';
import ProfileContent from '../../components/ProfileContent';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f0e6 0%, #efe1d1 100%)',
    fontFamily: 'Arial, sans-serif',
    color: '#4a241d',
  },
  section: {
    padding: '40px 48px',
  },
};

const CustomerProfilePage = () => {
  return (
    <div style={styles.page}>
      <CustomerHeader />
      <section style={styles.section}>
        <ProfileContent />
      </section>
    </div>
  );
};

export default CustomerProfilePage;
