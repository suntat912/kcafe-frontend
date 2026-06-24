import React, { useState } from 'react';
import axios from 'axios';  // <--- DÒNG NÀY CỰC KỲ QUAN TRỌNG
import { API_BASE_URL } from '../../utils/userSession';

// Phong cách chung cho các trang
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    color: '#0f5132',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box', // Đảm bảo padding không làm tăng chiều rộng
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0f5132',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#198754',
  },
  linkText: {
    marginTop: '20px',
    color: '#666',
  },
  link: {
    color: '#0f5132',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

// Component cho một ô nhập liệu
const InputField = ({ label, type, placeholder, value, onChange }) => (
  <div style={styles.formGroup}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={styles.input}
    />
  </div>
);

// Component chính
const AuthPages = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // 2. THAY THẾ TOÀN BỘ HÀM handleSubmit CŨ BẰNG ĐOẠN NÀY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      // LUỒNG ĐĂNG KÝ
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/register`, {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        });
        
        alert(response.data.message); // Báo "Đăng ký thành công"
        setIsRegistering(false);      // Tự động chuyển sang trang Đăng nhập luôn
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi kết nối Server!");
      }

    } else {
      // LUỒNG ĐĂNG NHẬP
      try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, {
          email: formData.email,
          password: formData.password
        });
        
        alert(response.data.message); // Báo "Đăng nhập thành công"
        console.log("Thông tin User:", response.data.user);
        // Sau này mình sẽ chuyển hướng sang trang Admin ở đây
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi kết nối Server!");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isRegistering ? 'Đăng ký K-CAFÉ' : 'Đăng nhập K-CAFÉ'}
        </h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <InputField
                label="Họ tên đầy đủ"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) => handleInputChange(e, 'fullName')}
              />
              <InputField
                label="Số điện thoại"
                type="tel"
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
              />
            </>
          )}
          <InputField
            label="Email hoặc Số điện thoại"
            type="text"
            placeholder="admin@kcafe.com"
            value={formData.email}
            onChange={(e) => handleInputChange(e, 'email')}
          />
          <InputField
            label="Mật khẩu"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={(e) => handleInputChange(e, 'password')}
          />
          {isRegistering && (
            <InputField
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange(e, 'confirmPassword')}
            />
          )}

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            {isRegistering ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <p style={styles.linkText}>
          {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          {' '}
          <span style={styles.link} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPages;
