import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayoutRed from '../../components/AdminLayoutRed';
import { API_BASE_URL } from '../../utils/userSession';

const emptyForm = {
  name: '',
  description: '',
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  title: { margin: 0, color: '#6b1218', fontSize: '34px' },
  desc: { margin: '10px 0 0', color: '#7b5a50', lineHeight: 1.7, maxWidth: '760px' },
  formCard: { backgroundColor: '#fff7ef', borderRadius: '24px', border: '1px solid rgba(143,46,38,0.12)', boxShadow: '0 18px 36px rgba(107,18,24,0.07)', padding: '24px', marginBottom: '24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  label: { color: '#6b1218', fontWeight: 'bold', fontSize: '14px' },
  input: { width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: '14px', border: '1px solid #dcc2b3', fontSize: '14px', backgroundColor: '#fff' },
  actionRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  primaryButton: { padding: '12px 18px', borderRadius: '14px', border: 'none', backgroundColor: '#8f2e26', color: '#fff7ef', fontWeight: 'bold', cursor: 'pointer' },
  secondaryButton: { padding: '12px 18px', borderRadius: '14px', border: '1px solid #caa996', backgroundColor: '#fff', color: '#6b1218', fontWeight: 'bold', cursor: 'pointer' },
  dangerButton: { padding: '12px 18px', borderRadius: '14px', border: '1px solid rgba(143,46,38,0.2)', backgroundColor: '#fff1ed', color: '#8f2e26', fontWeight: 'bold', cursor: 'pointer' },
  searchWrap: { marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' },
  card: { backgroundColor: '#fff', borderRadius: '22px', border: '1px solid rgba(143,46,38,0.10)', boxShadow: '0 12px 28px rgba(107,18,24,0.06)', padding: '22px' },
  badge: { display: 'inline-block', padding: '8px 12px', borderRadius: '999px', backgroundColor: '#f3ddd0', color: '#8f2e26', fontWeight: 'bold', fontSize: '13px' },
};

const CategoryAdminRed = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data.categories || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Không tải được danh mục!');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return categories;
    }
    return categories.filter((item) => String(item.name || '').toLowerCase().includes(keyword));
  }, [categories, searchTerm]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      alert('Tên danh mục là bắt buộc.');
      return;
    }

    try {
      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/api/categories/${editingId}`, form);
        setCategories((current) => current.map((item) => (item.id === editingId ? { ...item, ...response.data.category } : item)));
        alert('Cập nhật danh mục thành công.');
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/categories`, form);
        setCategories((current) => [{ ...response.data.category, product_count: 0 }, ...current]);
        alert('Tạo danh mục thành công.');
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Lưu danh mục thất bại!');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name || '', description: item.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục ${item.name}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${item.id}`);
      setCategories((current) => current.filter((category) => category.id !== item.id));
      if (editingId === item.id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      alert('Xóa danh mục thành công.');
    } catch (error) {
      alert(error.response?.data?.message || 'Xóa danh mục thất bại!');
    }
  };

  return (
    <AdminLayoutRed activeItem="categories">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý danh mục</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <h3 style={{ marginTop: 0, color: '#6b1218' }}>{editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
        <div style={styles.field}>
          <label style={styles.label}>Tên danh mục</label>
          <input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Mô tả</label>
          <input value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} style={styles.input} />
        </div>
        <div style={styles.actionRow}>
          <button type="submit" style={styles.primaryButton}>{editingId ? 'Lưu cập nhật' : 'Thêm danh mục'}</button>
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={styles.secondaryButton}>Làm mới form</button>
        </div>
      </form>

      <div style={styles.searchWrap}>
        <div style={styles.field}>
          <label style={styles.label}>Tìm kiếm danh mục theo tên</label>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Ví dụ: cà phê, trà trái cây..." style={styles.input} />
        </div>
      </div>

      <div className="kc-admin-grid" style={styles.grid}>
        {filteredCategories.map((item) => (
          <article key={item.id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' }}>
              <div>
                <h3 style={{ margin: '0 0 10px', color: '#6b1218', fontSize: '24px' }}>{item.name}</h3>
                <p style={{ margin: 0, color: '#7b5a50', lineHeight: 1.7 }}>{item.description || 'Chưa có mô tả'}</p>
              </div>
              <span style={styles.badge}>{item.product_count || 0} sản phẩm</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
              <button type="button" onClick={() => handleEdit(item)} style={styles.primaryButton}>Sửa</button>
              <button type="button" onClick={() => handleDelete(item)} style={styles.dangerButton}>Xóa</button>
            </div>
          </article>
        ))}
      </div>
    </AdminLayoutRed>
  );
};

export default CategoryAdminRed;
