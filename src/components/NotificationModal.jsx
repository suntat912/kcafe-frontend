import React from 'react';

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(32, 18, 14, 0.48)',
    zIndex: 2000,
  },
  box: {
    width: 'min(420px, 100%)',
    borderRadius: '24px',
    padding: '28px',
    backgroundColor: '#fffaf6',
    border: '1px solid rgba(143, 46, 38, 0.16)',
    boxShadow: '0 28px 70px rgba(37, 16, 12, 0.32)',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 10px',
    color: '#6b1218',
    fontSize: '24px',
  },
  message: {
    margin: '0 0 22px',
    color: '#6f5148',
    lineHeight: 1.65,
  },
  button: {
    minWidth: '130px',
    padding: '12px 18px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

const NotificationModal = ({ notice, onClose }) => {
  if (!notice) {
    return null;
  }

  return (
    <div style={styles.backdrop} role="dialog" aria-modal="true">
      <div style={styles.box}>
        <h3 style={styles.title}>{notice.title || 'Thông báo'}</h3>
        <p style={styles.message}>{notice.message}</p>
        <button type="button" style={styles.button} onClick={onClose}>
          Đã hiểu
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
