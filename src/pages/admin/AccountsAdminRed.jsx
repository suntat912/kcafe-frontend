import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayoutRed from '../../components/AdminLayoutRed';
import { API_BASE_URL } from '../../utils/userSession';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  role: 'customer',
  password: '',
};

const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '');

const isValidVietnamPhone = (phone) => /^(09|03)\d{8,9}$/.test(normalizePhone(phone));

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  title: { margin: 0, color: '#6b1218', fontSize: '34px' },
  desc: { margin: '10px 0 0', color: '#7b5a50', lineHeight: 1.7, maxWidth: '760px' },
  formCard: { backgroundColor: '#fff7ef', borderRadius: '24px', border: '1px solid rgba(143, 46, 38, 0.12)', boxShadow: '0 18px 36px rgba(107, 18, 24, 0.07)', padding: '24px', marginBottom: '24px' },
  formTitle: { margin: '0 0 8px', color: '#6b1218', fontSize: '26px' },
  formDesc: { margin: '0 0 18px', color: '#7b5a50', lineHeight: 1.7 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' },
  inputWrap: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#6b1218', fontWeight: 'bold', fontSize: '14px' },
  input: { width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: '14px', border: '1px solid #dcc2b3', fontSize: '14px', backgroundColor: '#fff' },
  fullWidth: { gridColumn: '1 / -1' },
  actionRow: { marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' },
  primaryButton: { padding: '12px 18px', borderRadius: '14px', border: 'none', backgroundColor: '#8f2e26', color: '#fff7ef', fontWeight: 'bold', cursor: 'pointer' },
  secondaryButton: { padding: '12px 18px', borderRadius: '14px', border: '1px solid #caa996', backgroundColor: '#fff', color: '#6b1218', fontWeight: 'bold', cursor: 'pointer' },
  notice: { padding: '16px 18px', borderRadius: '18px', backgroundColor: '#f8ebe0', border: '1px solid rgba(143, 46, 38, 0.10)', color: '#7b5a50', marginBottom: '24px', lineHeight: 1.7 },
  searchWrap: { marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' },
  card: { backgroundColor: '#fff', borderRadius: '22px', border: '1px solid rgba(143, 46, 38, 0.10)', boxShadow: '0 12px 28px rgba(107, 18, 24, 0.06)', padding: '22px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' },
  name: { margin: 0, color: '#6b1218', fontSize: '24px' },
  meta: { margin: '8px 0 0', color: '#7b5a50', lineHeight: 1.7 },
  badge: { display: 'inline-block', padding: '8px 12px', borderRadius: '999px', backgroundColor: '#f3ddd0', color: '#8f2e26', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' },
  cardActions: { display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' },
  deleteButton: { padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(143, 46, 38, 0.20)', backgroundColor: '#fff1ed', color: '#8f2e26', fontWeight: 'bold', cursor: 'pointer' },
};

const AccountsAdminRed = () => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`);
      setAccounts(response.data.users || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Không tải được danh sách tài khoản!');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return accounts;
    }
    return accounts.filter((account) => String(account.full_name || '').toLowerCase().includes(keyword));
  }, [accounts, searchTerm]);

  const handleFormChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleEdit = (account) => {
    setEditingId(account.id);
    setForm({
      fullName: account.full_name || '',
      email: account.email || '',
      phone: account.phone || '',
      address: account.address || '',
      role: account.role || 'customer',
      password: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim()) {
      alert('Họ tên, số điện thoại và email là bắt buộc.');
      return;
    }

    if (!isValidVietnamPhone(form.phone)) {
      alert('Số điện thoại không hợp lệ. Chỉ chấp nhận đầu 09 hoặc 03 và dài 10 hoặc 11 số.');
      return;
    }

    if (!editingId && !form.password.trim()) {
      alert('Khi tạo tài khoản mới, bạn cần nhập mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/api/admin/users/${editingId}`, {
          fullName: form.fullName,
          email: form.email,
          phone: normalizePhone(form.phone),
          address: form.address,
          role: form.role,
        });
        setAccounts((current) => current.map((item) => (item.id === editingId ? response.data.user : item)));
        alert('Cập nhật tài khoản thành công.');
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/admin/users`, {
          fullName: form.fullName,
          email: form.email,
          phone: normalizePhone(form.phone),
          address: form.address,
          role: form.role,
          password: form.password,
        });
        setAccounts((current) => [response.data.user, ...current]);
        alert('Đã tạo tài khoản mới.');
      }
      handleReset();
    } catch (error) {
      alert(error.response?.data?.message || 'Lưu tài khoản thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (account) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${account.full_name || account.email}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${account.id}`);
      setAccounts((current) => current.filter((item) => item.id !== account.id));
      if (editingId === account.id) {
        handleReset();
      }
      alert('Đã xóa tài khoản.');
    } catch (error) {
      alert(error.response?.data?.message || 'Xóa tài khoản thất bại!');
    }
  };

  return (
    <AdminLayoutRed activeItem="accounts">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý tài khoản</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <h3 style={styles.formTitle}>{editingId ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}</h3>
        <p style={styles.formDesc}>{editingId ? 'Cập nhật thông tin tài khoản đang chọn. Email sẽ được kiểm tra trùng trước khi lưu.' : 'Nhập đầy đủ thông tin để tạo tài khoản admin hoặc customer mới.'}</p>

        <div className="kc-form-grid" style={styles.formGrid}>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Họ tên</label>
            <input type="text" value={form.fullName} onChange={(e) => handleFormChange('fullName', e.target.value)} style={styles.input} placeholder="Nguyễn Văn A" />
          </div>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Email</label>
            <input type="email" value={form.email} onChange={(e) => handleFormChange('email', e.target.value)} style={styles.input} placeholder="example@gmail.com" />
          </div>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Số điện thoại</label>
            <input type="text" value={form.phone} onChange={(e) => handleFormChange('phone', normalizePhone(e.target.value))} style={styles.input} placeholder="0901234567" />
          </div>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Role</label>
            <select value={form.role} onChange={(e) => handleFormChange('role', e.target.value)} style={styles.input}>
              <option value="customer">customer</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div style={{ ...styles.inputWrap, ...styles.fullWidth }}>
            <label style={styles.label}>Địa chỉ</label>
            <input type="text" value={form.address} onChange={(e) => handleFormChange('address', e.target.value)} style={styles.input} placeholder="Địa chỉ người dùng" />
          </div>
          {!editingId && (
            <div style={{ ...styles.inputWrap, ...styles.fullWidth }}>
              <label style={styles.label}>Mật khẩu</label>
              <input type="password" value={form.password} onChange={(e) => handleFormChange('password', e.target.value)} style={styles.input} placeholder="Nhập mật khẩu khởi tạo" />
            </div>
          )}
        </div>

        <div style={styles.actionRow}>
          <button type="submit" style={styles.primaryButton} disabled={isLoading}>{editingId ? 'Lưu cập nhật' : 'Thêm tài khoản'}</button>
          <button type="button" onClick={handleReset} style={styles.secondaryButton}>Làm mới form</button>
        </div>
      </form>

      <div style={styles.notice}>Danh sách bên dưới đang đọc trực tiếp từ bảng `users`. Mọi thay đổi thêm, sửa, xóa đều được ghi lên database ngay khi bạn thao tác.</div>

      <div style={styles.searchWrap}>
        <div style={styles.inputWrap}>
          <label style={styles.label}>Tìm kiếm tài khoản theo tên</label>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} placeholder="Ví dụ: Nguyễn Văn A" />
        </div>
      </div>

      <div className="kc-admin-grid" style={styles.grid}>
        {filteredAccounts.map((account) => (
          <article key={account.id} style={styles.card}>
            <div style={styles.row}>
              <div>
                <h3 style={styles.name}>{account.full_name || 'Tài khoản hệ thống'}</h3>
                <p style={styles.meta}>
                  Email: {account.email}
                  <br />
                  Số điện thoại: {account.phone || 'Chưa cập nhật'}
                  <br />
                  Địa chỉ: {account.address || 'Chưa cập nhật'}
                  <br />
                  ID: {account.id}
                </p>
              </div>
              <span style={styles.badge}>{account.role}</span>
            </div>

            <div style={styles.cardActions}>
              <button type="button" onClick={() => handleEdit(account)} style={styles.primaryButton}>Sửa</button>
              <button type="button" onClick={() => handleDelete(account)} style={styles.deleteButton}>Xóa</button>
            </div>
          </article>
        ))}
      </div>
    </AdminLayoutRed>
  );
};

export default AccountsAdminRed;
