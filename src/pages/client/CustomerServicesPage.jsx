import React from 'react';
import CustomerHeader from '../../components/CustomerHeader';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f0e6 0%, #efe1d1 100%)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#4a241d',
  },
  hero: {
    minHeight: '420px',
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
  },
  imagePanel: {
    background: 'linear-gradient(120deg, rgba(176,128,73,0.18) 0%, rgba(176,128,73,0.16) 100%), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80") center/cover no-repeat',
  },
  contentPanel: {
    backgroundColor: '#c69b60',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 56px',
  },
  contentWrap: {
    maxWidth: '520px',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    color: '#fff7ef',
    fontSize: '64px',
    lineHeight: 1,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  lead: {
    margin: '16px 0 0',
    color: '#fff7ef',
    fontSize: '22px',
    textTransform: 'uppercase',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  text: {
    margin: '18px 0 0',
    color: 'rgba(74,47,37,0.88)',
    lineHeight: 1.8,
    fontSize: '20px',
  },
  section: {
    padding: '42px 48px 54px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '22px',
  },
  card: {
    backgroundColor: '#fffaf6',
    borderRadius: '24px',
    border: '1px solid rgba(143,46,38,0.10)',
    boxShadow: '0 16px 32px rgba(107,18,24,0.08)',
    padding: '24px',
  },
  cardTitle: {
    margin: 0,
    color: '#6b1218',
    fontSize: '26px',
  },
  cardText: {
    margin: '12px 0 0',
    color: '#7b5a50',
    lineHeight: 1.8,
  },
  contact: {
    display: 'inline-block',
    marginTop: '16px',
    color: '#8f2e26',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '18px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
};

const CustomerServicesPage = () => {
  return (
    <div style={styles.page}>
      <CustomerHeader />

      <section style={styles.hero}>
        <div style={styles.imagePanel} />
        <div style={styles.contentPanel}>
          <div style={styles.contentWrap}>
            <h1 style={styles.title}>Dịch vụ</h1>
            <p style={styles.lead}>Dịch vụ này là của chúng mình</p>
            <p style={styles.text}>
              Nếu bạn cần phản hồi trải nghiệm, hỗ trợ đặt hàng hoặc liên hệ trực tiếp với cửa hàng, khu dịch vụ này sẽ tập trung các kênh kết nối quan trọng để bạn gửi góp ý nhanh và rõ ràng hơn.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.cardGrid}>
          <article style={styles.card}>
            <h2 style={styles.cardTitle}>Email phản hồi</h2>
            <p style={styles.cardText}>Gửi góp ý, khiếu nại hoặc yêu cầu hỗ trợ chi tiết qua email để cửa hàng phản hồi chính thức.</p>
            <a href="mailto:support@kcafe.vn" style={styles.contact}>support@kcafe.vn</a>
          </article>

          <article style={styles.card}>
            <h2 style={styles.cardTitle}>Facebook</h2>
            <p style={styles.cardText}>Kết nối với fanpage để xem thông báo, chương trình mới và nhắn tin trực tiếp với bộ phận hỗ trợ.</p>
            <a href="https://facebook.com/kcafe" target="_blank" rel="noreferrer" style={styles.contact}>facebook.com/kcafe</a>
          </article>

          <article style={styles.card}>
            <h2 style={styles.cardTitle}>Số điện thoại</h2>
            <p style={styles.cardText}>Liên hệ nhanh khi cần xác nhận đơn hàng, thay đổi thông tin giao hàng hoặc cần hỗ trợ khẩn.</p>
            <a href="tel:19001234" style={styles.contact}>1900 1234</a>
          </article>
        </div>
      </section>
    </div>
  );
};

export default CustomerServicesPage;
