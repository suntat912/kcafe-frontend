import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' }}>
      
      {/* THANH SIDEBAR BÊN TRÁI */}
      <aside style={{ width: '260px', backgroundColor: '#0f5132', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid #198754' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>☕ K-CAFÉ</Link>
        </div>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #198754' }}>Bảng điều khiển</li>
          <li style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: '#198754' }}>Quản lý sản phẩm</li>
          <li style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #198754' }}>Đơn hàng</li>
          <li style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #198754' }}>Quản lý người dùng</li>
        </ul>
      </aside>

      {/* KHU VỰC NỘI DUNG BÊN PHẢI */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '60px', backgroundColor: '#0f5132', color: 'white', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 30px' }}>
          <span style={{ marginRight: '20px' }}>🔔 Thông báo</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', backgroundColor: 'white', borderRadius: '50%' }}></div>
            Admin
          </span>
        </header>

        <div style={{ padding: '30px', flex: 1 }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minHeight: '400px' }}>
             {/* Nội dung các trang quản trị sẽ chui vào đây */}
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;