import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayoutRed from '../../components/AdminLayoutRed';
import { API_BASE_URL } from '../../utils/userSession';

const emptyForm = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: 'default-product.png',
  status: 'active',
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  title: { margin: 0, color: '#6b1218', fontSize: '34px' },
  desc: { margin: '10px 0 0', color: '#7b5a50', lineHeight: 1.7, maxWidth: '760px' },
  formCard: { backgroundColor: '#fff7ef', borderRadius: '24px', border: '1px solid rgba(143,46,38,0.12)', boxShadow: '0 18px 36px rgba(107,18,24,0.07)', padding: '24px', marginBottom: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' },
  fullWidth: { gridColumn: '1 / -1' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#6b1218', fontWeight: 'bold', fontSize: '14px' },
  input: { width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: '14px', border: '1px solid #dcc2b3', fontSize: '14px', backgroundColor: '#fff' },
  fileInput: { width: '100%', boxSizing: 'border-box', padding: '10px 0', fontSize: '14px' },
  imagePreview: { width: '100%', maxWidth: '240px', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '18px', border: '1px solid rgba(143,46,38,0.12)', boxShadow: '0 10px 24px rgba(107,18,24,0.08)', backgroundColor: '#fff4ea' },
  previewHint: { color: '#7b5a50', lineHeight: 1.7, margin: '8px 0 0' },
  actionRow: { marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' },
  primaryButton: { padding: '12px 18px', borderRadius: '14px', border: 'none', backgroundColor: '#8f2e26', color: '#fff7ef', fontWeight: 'bold', cursor: 'pointer' },
  secondaryButton: { padding: '12px 18px', borderRadius: '14px', border: '1px solid #caa996', backgroundColor: '#fff', color: '#6b1218', fontWeight: 'bold', cursor: 'pointer' },
  dangerButton: { padding: '12px 18px', borderRadius: '14px', border: '1px solid rgba(143,46,38,0.2)', backgroundColor: '#fff1ed', color: '#8f2e26', fontWeight: 'bold', cursor: 'pointer' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px', marginBottom: '24px' },
  metricCard: { background: 'linear-gradient(135deg, rgba(107,18,24,0.94) 0%, rgba(143,46,38,0.92) 100%)', color: '#fff7ef', borderRadius: '22px', padding: '22px' },
  metricLabel: { fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.8 },
  metricValue: { marginTop: '12px', fontSize: '34px', fontWeight: 'bold' },
  searchWrap: { marginBottom: '24px' },
  tableWrap: { overflowX: 'auto', backgroundColor: '#fff', borderRadius: '22px', border: '1px solid rgba(143,46,38,0.12)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px 18px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#f8ebe0', color: '#6b1218' },
  td: { padding: '16px 18px', borderTop: '1px solid rgba(143,46,38,0.08)', color: '#57352c', verticalAlign: 'top' },
  imageThumbButton: { border: 'none', padding: 0, backgroundColor: 'transparent', cursor: 'pointer' },
  imageThumb: { width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover', border: '1px solid rgba(143,46,38,0.12)', boxShadow: '0 8px 20px rgba(107,18,24,0.08)', backgroundColor: '#fff4ea' },
  badge: { display: 'inline-block', padding: '8px 12px', borderRadius: '999px', backgroundColor: '#f3ddd0', color: '#8f2e26', fontWeight: 'bold', fontSize: '13px' },
  rowActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(41, 10, 10, 0.72)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '24px' },
  modalCard: { width: 'min(920px, 100%)', backgroundColor: '#fffaf6', borderRadius: '28px', padding: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.24)' },
  modalImage: { width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '20px', backgroundColor: '#fff4ea' },
};

const getProductImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === 'default-product.png') {
    return '';
  }

  if (/^https?:\/\//.test(imageUrl)) {
    return imageUrl;
  }

  return `${API_BASE_URL}/uploads/products/${imageUrl}`;
};

const ProductAdminRed = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [activePreviewProduct, setActivePreviewProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/products`),
        axios.get(`${API_BASE_URL}/api/categories`),
      ]);
      setProducts(productResponse.data.products || []);
      setCategories(categoryResponse.data.categories || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Không tải được dữ liệu sản phẩm!');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedImageFile) {
      setPreviewUrl('');
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedImageFile);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedImageFile]);

  const activeCount = useMemo(() => products.filter((item) => item.status === 'active').length, [products]);
  const lowStockCount = useMemo(() => products.filter((item) => Number(item.stock) <= 10).length, [products]);
  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return products;
    }
    return products.filter((item) => String(item.name || '').toLowerCase().includes(keyword));
  }, [products, searchTerm]);

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.categoryId || !form.name.trim()) {
      alert('Danh mục và tên sản phẩm là bắt buộc.');
      return;
    }

    try {
      let imageUrl = form.imageUrl;

      if (selectedImageFile) {
        const imagePayload = new FormData();
        imagePayload.append('image', selectedImageFile);
        const uploadResponse = await axios.post(`${API_BASE_URL}/api/products/upload-image`, imagePayload, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = uploadResponse.data.image_url;
      }

      const payload = {
        categoryId: Number(form.categoryId),
        name: form.name,
        description: form.description,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        imageUrl,
        status: form.status,
      };

      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/api/products/${editingId}`, payload);
        setProducts((current) => current.map((item) => (item.id === editingId ? response.data.product : item)));
        alert('Cập nhật sản phẩm thành công.');
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/products`, payload);
        setProducts((current) => [response.data.product, ...current]);
        alert('Tạo sản phẩm thành công.');
      }

      setEditingId(null);
      setForm(emptyForm);
      setSelectedImageFile(null);
      setPreviewUrl('');
    } catch (error) {
      alert(error.response?.data?.message || 'Lưu sản phẩm thất bại!');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      categoryId: String(product.category_id || ''),
      name: product.name || '',
      description: product.description || '',
      price: String(product.price || 0),
      stock: String(product.stock || 0),
      imageUrl: product.image_url || 'default-product.png',
      status: product.status || 'active',
    });
    setSelectedImageFile(null);
    setPreviewUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm ${product.name}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${product.id}`);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      if (editingId === product.id) {
        setEditingId(null);
        setForm(emptyForm);
        setSelectedImageFile(null);
        setPreviewUrl('');
      }
      alert('Xóa sản phẩm thành công.');
    } catch (error) {
      alert(error.response?.data?.message || 'Xóa sản phẩm thất bại!');
    }
  };

  return (
    <AdminLayoutRed activeItem="products">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý sản phẩm</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <h3 style={{ marginTop: 0, color: '#6b1218' }}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Danh mục</label>
            <select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} style={styles.input}>
              <option value="">Chọn danh mục</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Tên sản phẩm</label>
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} style={styles.input} />
          </div>
          <div style={{ ...styles.field, ...styles.fullWidth }}>
            <label style={styles.label}>Mô tả</label>
            <input value={form.description} onChange={(e) => handleChange('description', e.target.value)} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Giá</label>
            <input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Tồn kho</label>
            <input type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Chọn tệp ảnh</label>
            <input type="file" accept="image/*" onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)} style={styles.fileInput} />
            <p style={styles.previewHint}>{selectedImageFile ? `Tệp đã chọn: ${selectedImageFile.name}` : 'Bạn có thể tải ảnh mới hoặc giữ ảnh hiện tại của sản phẩm.'}</p>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Trạng thái</label>
            <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} style={styles.input}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <div style={{ ...styles.field, ...styles.fullWidth }}>
            <label style={styles.label}>Xem trước ảnh</label>
            {previewUrl || getProductImageUrl(form.imageUrl) ? (
              <img src={previewUrl || getProductImageUrl(form.imageUrl)} alt={form.name || 'Ảnh sản phẩm'} style={styles.imagePreview} />
            ) : (
              <div style={{ ...styles.imagePreview, display: 'grid', placeItems: 'center', color: '#8f2e26', fontWeight: 'bold' }}>Chưa có ảnh</div>
            )}
          </div>
        </div>
        <div style={styles.actionRow}>
          <button type="submit" style={styles.primaryButton}>{editingId ? 'Lưu cập nhật' : 'Thêm sản phẩm'}</button>
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setSelectedImageFile(null); setPreviewUrl(''); }} style={styles.secondaryButton}>Làm mới form</button>
        </div>
      </form>

      <div style={styles.metrics}>
        <div style={styles.metricCard}><div style={styles.metricLabel}>Tổng sản phẩm</div><div style={styles.metricValue}>{products.length}</div></div>
        <div style={styles.metricCard}><div style={styles.metricLabel}>Đang kinh doanh</div><div style={styles.metricValue}>{activeCount}</div></div>
        <div style={styles.metricCard}><div style={styles.metricLabel}>Sắp hết hàng</div><div style={styles.metricValue}>{lowStockCount}</div></div>
      </div>

      <div style={styles.searchWrap}>
        <div style={styles.field}>
          <label style={styles.label}>Tìm kiếm sản phẩm theo tên</label>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Ví dụ: espresso, trà đào..." style={styles.input} />
        </div>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Hình ảnh</th>
              <th style={styles.th}>Tên sản phẩm</th>
              <th style={styles.th}>Danh mục</th>
              <th style={styles.th}>Giá</th>
              <th style={styles.th}>Tồn kho</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>#{item.id}</td>
                <td style={styles.td}>
                  {getProductImageUrl(item.image_url) ? (
                    <button type="button" onClick={() => setActivePreviewProduct(item)} style={styles.imageThumbButton}>
                      <img src={getProductImageUrl(item.image_url)} alt={item.name} style={styles.imageThumb} />
                    </button>
                  ) : (
                    <div style={{ ...styles.imageThumb, display: 'grid', placeItems: 'center', color: '#8f2e26', fontWeight: 'bold' }}>Không ảnh</div>
                  )}
                </td>
                <td style={styles.td}><strong>{item.name}</strong><br />{item.description || 'Chưa có mô tả'}</td>
                <td style={styles.td}>{item.category_name}</td>
                <td style={styles.td}>{Number(item.price).toLocaleString()}đ</td>
                <td style={styles.td}>{item.stock}</td>
                <td style={styles.td}><span style={styles.badge}>{item.status}</span></td>
                <td style={styles.td}>
                  <div style={styles.rowActions}>
                    <button type="button" onClick={() => handleEdit(item)} style={styles.primaryButton}>Sửa</button>
                    <button type="button" onClick={() => handleDelete(item)} style={styles.dangerButton}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activePreviewProduct && (
        <div style={styles.modalOverlay} onClick={() => setActivePreviewProduct(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#6b1218', fontSize: '30px' }}>{activePreviewProduct.name}</h3>
                <p style={{ margin: '8px 0 0', color: '#7b5a50' }}>{activePreviewProduct.category_name || 'Sản phẩm'}</p>
              </div>
              <button type="button" onClick={() => setActivePreviewProduct(null)} style={styles.dangerButton}>Đóng</button>
            </div>
            <img src={getProductImageUrl(activePreviewProduct.image_url)} alt={activePreviewProduct.name} style={styles.modalImage} />
          </div>
        </div>
      )}
    </AdminLayoutRed>
  );
};

export default ProductAdminRed;
