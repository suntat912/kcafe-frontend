import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, getAvatarUrl, getStoredUser, getUserInitials, storeUser } from '../utils/userSession';
import NotificationModal from './NotificationModal';

const styles = {
  stack: {
    display: 'grid',
    gap: '22px',
  },
  card: {
    backgroundColor: '#fffaf6',
    borderRadius: '26px',
    padding: '26px',
    border: '1px solid rgba(143, 46, 38, 0.10)',
    boxShadow: '0 14px 30px rgba(107, 18, 24, 0.08)',
  },
  avatarCard: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '22px',
    alignItems: 'center',
  },
  avatar: {
    width: '124px',
    height: '124px',
    borderRadius: '50%',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    display: 'grid',
    placeItems: 'center',
    fontSize: '34px',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  title: {
    margin: 0,
    color: '#8f2e26',
    fontSize: '32px',
  },
  text: {
    margin: '10px 0 0',
    color: '#7b5a50',
    lineHeight: 1.7,
  },
  fileInput: {
    marginTop: '14px',
  },
  actionRow: {
    marginTop: '16px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  button: {
    padding: '12px 18px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '12px 18px',
    borderRadius: '14px',
    border: '1px solid #dcc2b3',
    backgroundColor: '#fff4ea',
    color: '#8f2e26',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '18px',
  },
  field: {
    display: 'grid',
    gap: '8px',
  },
  fullSpan: {
    gridColumn: '1 / -1',
  },
  label: {
    color: '#8f2e26',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    borderRadius: '16px',
    border: '1px solid #dcc2b3',
    backgroundColor: '#fff',
    fontSize: '15px',
  },
  note: {
    marginTop: '8px',
    color: '#8a695f',
    lineHeight: 1.7,
  },
  otpHint: {
    marginTop: '14px',
    color: '#8a695f',
    lineHeight: 1.7,
  },
};

const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '');

const isValidVietnamPhone = (phone) => /^(09|03)\d{8,9}$/.test(normalizePhone(phone));

const ProfileContent = () => {
  const storedUser = getStoredUser();
  const [profile, setProfile] = useState({
    id: storedUser?.id || '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    avatar: '',
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [imageBroken, setImageBroken] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [notice, setNotice] = useState(null);

  const showNotice = (message, title = 'Thông báo') => {
    setNotice({ title, message });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!storedUser?.id) {
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/profile/${storedUser.id}`);
        const user = response.data.user;
        setProfile(user);
        setFormData({
          fullName: user.full_name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
        });
        storeUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [storedUser?.id]);

  const avatarUrl = useMemo(() => getAvatarUrl(profile.avatar), [profile.avatar]);
  const previewUrl = useMemo(() => {
    if (!selectedAvatar) {
      return '';
    }

    return URL.createObjectURL(selectedAvatar);
  }, [selectedAvatar]);
  const initials = getUserInitials(profile.full_name || storedUser?.full_name);

  const syncUser = (user) => {
    setProfile(user);
    setFormData({
      fullName: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
    storeUser(user);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showNotice('Họ tên, số điện thoại và email là bắt buộc.', 'Thiếu thông tin');
      return;
    }

    if (!isValidVietnamPhone(formData.phone)) {
      showNotice('Số điện thoại không hợp lệ. Chỉ chấp nhận đầu 09 hoặc 03 và dài 10 hoặc 11 số.', 'Số điện thoại không hợp lệ');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/profile/${profile.id}`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: normalizePhone(formData.phone),
        address: formData.address,
      });
      showNotice(response.data.message, 'Cập nhật thành công');
      syncUser(response.data.user);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Cập nhật hồ sơ thất bại!', 'Không thể cập nhật');
    }
  };

  const handleRequestPasswordOtp = async () => {
    if (!passwordForm.currentPassword) {
      showNotice('Bạn cần nhập mật khẩu hiện tại trước khi xin mã OTP.', 'Thiếu mật khẩu hiện tại');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/profile/${profile.id}/password/request-code`, {
        currentPassword: passwordForm.currentPassword,
      });
      showNotice(response.data.message, 'Đã gửi mã OTP');
      setOtpRequested(true);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Không gửi được mã OTP đổi mật khẩu!', 'Không thể gửi mã');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotice('Mật khẩu mới và xác nhận mật khẩu không khớp.', 'Kiểm tra lại mật khẩu');
      return;
    }

    if (!passwordForm.verificationCode) {
      showNotice('Bạn cần nhập mã OTP xác thực.', 'Thiếu mã OTP');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/profile/${profile.id}/password/verify`, {
        currentPassword: passwordForm.currentPassword,
        verificationCode: passwordForm.verificationCode,
        newPassword: passwordForm.newPassword,
      });
      showNotice(response.data.message, 'Đổi mật khẩu thành công');
      setPasswordForm({
        currentPassword: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
      });
      setOtpRequested(false);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Đổi mật khẩu thất bại!', 'Không thể đổi mật khẩu');
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedAvatar) {
      showNotice('Bạn chưa chọn ảnh đại diện.', 'Chưa chọn ảnh');
      return;
    }

    const payload = new FormData();
    payload.append('avatar', selectedAvatar);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/profile/${profile.id}/avatar`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showNotice(response.data.message, 'Cập nhật ảnh thành công');
      syncUser(response.data.user);
      setSelectedAvatar(null);
      setImageBroken(false);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Cập nhật avatar thất bại!', 'Không thể cập nhật ảnh');
    }
  };

  return (
    <div style={styles.stack}>
      <section style={{ ...styles.card, ...styles.avatarCard }}>
        <div style={styles.avatar}>
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar preview" style={styles.avatarImage} />
          ) : avatarUrl && !imageBroken ? (
            <img
              src={avatarUrl}
              alt={profile.full_name}
              style={styles.avatarImage}
              onError={() => setImageBroken(true)}
            />
          ) : (
            initials
          )}
        </div>

        <div>
          <h1 style={styles.title}>Hồ sơ cá nhân</h1>
          <p style={styles.text}>Quản lý thông tin tài khoản, ảnh đại diện và mật khẩu.</p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedAvatar(e.target.files?.[0] || null)}
            style={styles.fileInput}
          />

          <div style={styles.actionRow}>
            <button type="button" onClick={handleAvatarUpload} style={styles.button}>
              Cập nhật ảnh đại diện
            </button>
            <span style={styles.note}>Hỗ trợ png, jpg, jpeg, gif, webp</span>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={{ ...styles.title, fontSize: '28px' }}>Thông tin tài khoản</h2>

        <form onSubmit={handleProfileUpdate} style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Họ và tên</label>
            <input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Số điện thoại</label>
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: normalizePhone(e.target.value) })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Vai trò</label>
            <input value={profile.role || ''} disabled style={styles.input} />
          </div>

          <div style={{ ...styles.field, ...styles.fullSpan }}>
            <label style={styles.label}>Địa chỉ</label>
            <input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.fullSpan}>
            <button type="submit" style={styles.button}>
              Lưu thông tin
            </button>
          </div>
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={{ ...styles.title, fontSize: '28px' }}>Đổi mật khẩu</h2>
        <p style={styles.text}>Bạn cần xác thực mã OTP gửi về email trước khi đổi mật khẩu mới.</p>

        <form onSubmit={handlePasswordUpdate} style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Mật khẩu hiện tại</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mã OTP xác thực</label>
            <input
              value={passwordForm.verificationCode}
              onChange={(e) => setPasswordForm({ ...passwordForm, verificationCode: e.target.value })}
              style={styles.input}
              placeholder="Nhập mã 6 số"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mật khẩu mới</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={{ ...styles.fullSpan, ...styles.actionRow, marginTop: 0 }}>
            <button type="button" onClick={handleRequestPasswordOtp} style={styles.secondaryButton}>
              Gửi mã OTP
            </button>
            <button type="submit" style={styles.button}>
              Xác nhận đổi mật khẩu
            </button>
          </div>
        </form>

        <p style={styles.otpHint}>
          {otpRequested
            ? 'Mã OTP đã được gửi về email của bạn. Hãy kiểm tra hộp thư và nhập mã để hoàn tất đổi mật khẩu.'
            : 'Bước 1: nhập mật khẩu hiện tại rồi bấm Gửi mã OTP. Bước 2: nhập mã OTP, mật khẩu mới và xác nhận.'}
        </p>
      </section>
      <NotificationModal notice={notice} onClose={() => setNotice(null)} />
    </div>
  );
};

export default ProfileContent;
