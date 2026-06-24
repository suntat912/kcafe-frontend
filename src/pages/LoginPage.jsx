import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/userSession';
import NotificationModal from '../components/NotificationModal';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background:
      'radial-gradient(circle at top left, #f3d9c3 0%, #f7efe5 35%, #efe5d8 100%)',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '430px',
    backgroundColor: '#fffaf5',
    borderRadius: '22px',
    padding: '36px',
    boxShadow: '0 20px 60px rgba(78, 53, 36, 0.18)',
    border: '1px solid rgba(198, 124, 78, 0.2)',
  },
  eyebrow: {
    color: '#9d6b47',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  title: {
    margin: '0 0 10px',
    fontSize: '34px',
    color: '#2d2218',
  },
  subtitle: {
    margin: '0 0 28px',
    color: '#6f5a48',
    lineHeight: 1.6,
  },
  field: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#4c392a',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #ddc6b3',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    fontSize: '15px',
  },
  button: {
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    borderRadius: '14px',
    backgroundColor: '#2d2218',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  helper: {
    marginTop: '18px',
    textAlign: 'center',
    color: '#6f5a48',
  },
  link: {
    color: '#9d6b47',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [notice, setNotice] = useState(null);

  const showNotice = (message, title = 'Thông báo') => {
    setNotice({ title, message });
  };

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log('Thong tin user:', response.data.user);
      navigate('/admin/products');
    } catch (error) {
      showNotice(error.response?.data?.message || 'Lỗi kết nối server!', 'Không thể đăng nhập');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.eyebrow}>Quan Tri Vien</div>
        <h1 style={styles.title}>Dang nhap</h1>
        <p style={styles.subtitle}>
          Dang nhap de quan ly san pham, theo doi don hang va cap nhat noi dung cua cua
          hang.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email hoac so dien thoai</label>
            <input
              type="text"
              placeholder="admin@kcafe.com"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mat khau</label>
            <input
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) => handleInputChange(e, 'password')}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Vao trang quan tri
          </button>
        </form>

        <div style={styles.helper}>
          <Link to="/" style={styles.link}>
            Quay ve trang chu
          </Link>
        </div>
      </div>
      <NotificationModal notice={notice} onClose={() => setNotice(null)} />
    </div>
  );
};

export default LoginPage;
