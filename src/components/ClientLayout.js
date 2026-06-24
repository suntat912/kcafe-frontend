import React from 'react';
import { Link } from 'react-router-dom';

const ClientLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 1. THANH NAVBAR TRÊN CÙNG */}
      <header style={{ backgroundColor: '#0f5132', color: 'white', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>☕ K-CAFÉ</Link>
        </div>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', fontSize: '16px' }}>🛒 Giỏ hàng (0)</span>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', border: '1px solid white', padding: '8px 20px', borderRadius: '25px', transition: '0.3s' }}>
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* 2. KHU VỰC HIỂN THỊ TRANG CHỦ, GIỎ HÀNG... */}
      <main style={{ flex: 1, padding: '40px 50px' }}>
        {children}
      </main>

      {/* 3. CHÂN TRANG (FOOTER) */}
      <footer style={{ backgroundColor: '#212529', color: '#adb5bd', textAlign: 'center', padding: '20px', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>© 2026 K-CAFÉ. Đồ án Tốt nghiệp của Xuân Hiệp.</p>
      </footer>

    </div>
  );
};

export default ClientLayout;