import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayoutRed from '../../components/AdminLayoutRed';
import { API_BASE_URL } from '../../utils/userSession';

const createEmptyItem = () => ({ productId: '', quantity: 1, price: 0 });
const emptyForm = {
  userId: '',
  shippingAddress: '',
  deliveryLatitude: '',
  deliveryLongitude: '',
  deliveryDistanceKm: '',
  deliveryFee: 0,
  paymentMethod: 'cash',
  status: 'pending',
  items: [createEmptyItem()],
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  title: { margin: 0, color: '#6b1218', fontSize: '34px' },
  desc: { margin: '10px 0 0', color: '#7b5a50', lineHeight: 1.7, maxWidth: '760px' },
  formCard: { backgroundColor: '#fff7ef', borderRadius: '24px', border: '1px solid rgba(143,46,38,0.12)', boxShadow: '0 18px 36px rgba(107,18,24,0.07)', padding: '24px', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' },
  smallGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' },
  fullWidth: { gridColumn: '1 / -1' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#6b1218', fontWeight: 'bold', fontSize: '14px' },
  input: { width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: '14px', border: '1px solid #dcc2b3', fontSize: '14px', backgroundColor: '#fff' },
  itemRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', marginTop: '12px', alignItems: 'end' },
  button: { padding: '12px 18px', borderRadius: '14px', border: 'none', backgroundColor: '#8f2e26', color: '#fff7ef', fontWeight: 'bold', cursor: 'pointer' },
  secondaryButton: { padding: '12px 18px', borderRadius: '14px', border: '1px solid #caa996', backgroundColor: '#fff', color: '#6b1218', fontWeight: 'bold', cursor: 'pointer' },
  dangerButton: { padding: '12px 18px', borderRadius: '14px', border: '1px solid rgba(143,46,38,0.2)', backgroundColor: '#fff1ed', color: '#8f2e26', fontWeight: 'bold', cursor: 'pointer' },
  actionRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '18px', marginBottom: '24px' },
  metricCard: { background: 'linear-gradient(135deg, rgba(107,18,24,0.94) 0%, rgba(143,46,38,0.92) 100%)', color: '#fff7ef', borderRadius: '22px', padding: '22px' },
  metricLabel: { fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.8 },
  metricValue: { marginTop: '12px', fontSize: '34px', fontWeight: 'bold' },
  searchWrap: { marginBottom: '24px' },
  cardList: { display: 'grid', gap: '18px' },
  orderCard: { backgroundColor: '#fff', borderRadius: '22px', border: '1px solid rgba(143,46,38,0.10)', boxShadow: '0 12px 28px rgba(107,18,24,0.06)', padding: '22px' },
  badge: { display: 'inline-block', padding: '8px 12px', borderRadius: '999px', backgroundColor: '#f3ddd0', color: '#8f2e26', fontWeight: 'bold', fontSize: '13px' },
  paidBadge: { display: 'inline-block', padding: '8px 12px', borderRadius: '999px', backgroundColor: '#e6f6ea', color: '#207949', fontWeight: 'bold', fontSize: '13px' },
  unpaidBadge: { display: 'inline-block', padding: '8px 12px', borderRadius: '999px', backgroundColor: '#fff2dc', color: '#a06400', fontWeight: 'bold', fontSize: '13px' },
  metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', marginTop: '14px' },
  metaCard: { padding: '14px 16px', borderRadius: '18px', backgroundColor: '#fff4ea', border: '1px solid rgba(143,46,38,0.08)', color: '#7b5a50', lineHeight: 1.7 },
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const paymentMethodLabels = {
  cash: 'Tiền mặt',
  transfer: 'Chuyển khoản',
};

const paymentStatusLabels = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
};

const transactionStatusLabels = {
  pending: 'Đang chờ',
  success: 'Thành công',
  failed: 'Thất bại',
};

const SHOP_LOCATION = {
  latitude: 10.776889,
  longitude: 106.700806,
};

const createMapsUrl = (latitude, longitude) =>
  `https://www.google.com/maps/dir/?api=1&origin=${SHOP_LOCATION.latitude},${SHOP_LOCATION.longitude}&destination=${latitude},${longitude}`;

const hasDeliveryLocation = (order) =>
  order.delivery_latitude !== null &&
  order.delivery_latitude !== undefined &&
  order.delivery_longitude !== null &&
  order.delivery_longitude !== undefined;

const formatVietnamDateTime = (value) => {
  if (!value) {
    return 'N/A';
  }

  const normalizedValue = typeof value === 'string' ? value.replace(' ', 'T') : value;

  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(normalizedValue));
};

const OrderAdminRed = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [ordersResponse, usersResponse, productsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/orders`),
        axios.get(`${API_BASE_URL}/api/admin/users`),
        axios.get(`${API_BASE_URL}/api/products`),
      ]);
      setOrders(ordersResponse.data.orders || []);
      setUsers(usersResponse.data.users || []);
      setProducts(productsResponse.data.products || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Không tải được dữ liệu đơn hàng!');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = useMemo(() => orders.filter((item) => item.payment_status === 'paid').reduce((sum, item) => sum + Number(item.total_amount || 0), 0), [orders]);
  const pendingCount = useMemo(() => orders.filter((item) => item.status === 'pending').length, [orders]);
  const processingCount = useMemo(() => orders.filter((item) => item.status === 'processing').length, [orders]);
  const paidCount = useMemo(() => orders.filter((item) => item.payment_status === 'paid').length, [orders]);
  const computedTotal = useMemo(
    () => form.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0) + Number(form.deliveryFee || 0),
    [form.items, form.deliveryFee]
  );
  const filteredOrders = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const transactionCode = String(order.payment_transaction?.transaction_code || '').toLowerCase();
      const userName = String(order.user_name || '').toLowerCase();
      const userEmail = String(order.user_email || '').toLowerCase();
      return transactionCode.includes(keyword) || userName.includes(keyword) || userEmail.includes(keyword);
    });
  }, [orders, searchTerm]);

  const handleFormChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleItemChange = (index, field, value) => {
    setForm((current) => {
      const nextItems = [...current.items];
      const nextItem = { ...nextItems[index], [field]: value };
      if (field === 'productId') {
        const product = products.find((item) => String(item.id) === String(value));
        nextItem.price = product ? product.price : 0;
      }
      nextItems[index] = nextItem;
      return { ...current, items: nextItems };
    });
  };

  const addItemRow = () => setForm((current) => ({ ...current, items: [...current.items, createEmptyItem()] }));
  const removeItemRow = (index) => setForm((current) => {
    const filtered = current.items.filter((_, itemIndex) => itemIndex !== index);
    return { ...current, items: filtered.length ? filtered : [createEmptyItem()] };
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.userId || !form.shippingAddress.trim()) {
      alert('Người đặt và địa chỉ giao hàng là bắt buộc.');
      return;
    }

    const payload = {
      userId: Number(form.userId),
      shippingAddress: form.shippingAddress,
      deliveryLatitude: form.deliveryLatitude ? Number(form.deliveryLatitude) : null,
      deliveryLongitude: form.deliveryLongitude ? Number(form.deliveryLongitude) : null,
      deliveryDistanceKm: form.deliveryDistanceKm ? Number(form.deliveryDistanceKm) : null,
      deliveryFee: Number(form.deliveryFee || 0),
      paymentMethod: form.paymentMethod,
      status: form.status,
      items: form.items.map((item) => ({ productId: Number(item.productId), quantity: Number(item.quantity), price: Number(item.price) })),
    };

    try {
      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/api/orders/${editingId}`, payload);
        setOrders((current) => current.map((item) => (item.id === editingId ? response.data.order : item)));
        alert('Cập nhật đơn hàng thành công.');
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/orders`, payload);
        setOrders((current) => [response.data.order, ...current]);
        alert('Tạo đơn hàng thành công.');
      }
      setEditingId(null);
      setForm(emptyForm);
    } catch (error) {
      alert(error.response?.data?.message || 'Lưu đơn hàng thất bại!');
    }
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setForm({
      userId: String(order.user_id || ''),
      shippingAddress: order.shipping_address || '',
      deliveryLatitude: order.delivery_latitude || '',
      deliveryLongitude: order.delivery_longitude || '',
      deliveryDistanceKm: order.delivery_distance_km || '',
      deliveryFee: order.delivery_fee || 0,
      paymentMethod: order.payment_method || 'cash',
      status: order.status || 'pending',
      items: (order.items || []).map((item) => ({ productId: String(item.product_id), quantity: item.quantity, price: item.price })),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đơn hàng #${order.id}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/orders/${order.id}`);
      setOrders((current) => current.filter((item) => item.id !== order.id));
      if (editingId === order.id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      alert('Xóa đơn hàng thành công.');
    } catch (error) {
      alert(error.response?.data?.message || 'Xóa đơn hàng thất bại!');
    }
  };

  return (
    <AdminLayoutRed activeItem="orders">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý đơn hàng</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <h3 style={{ marginTop: 0, color: '#6b1218' }}>{editingId ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới'}</h3>
        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Người đặt</label>
            <select value={form.userId} onChange={(e) => handleFormChange('userId', e.target.value)} style={styles.input}>
              <option value="">Chọn tài khoản</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.full_name} - {user.email}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Phương thức thanh toán</label>
            <select value={form.paymentMethod} onChange={(e) => handleFormChange('paymentMethod', e.target.value)} style={styles.input}>
              <option value="cash">Tiền mặt</option>
              <option value="transfer">Chuyển khoản</option>
            </select>
          </div>
          <div style={{ ...styles.field, ...styles.fullWidth }}>
            <label style={styles.label}>Địa chỉ giao hàng</label>
            <input value={form.shippingAddress} onChange={(e) => handleFormChange('shippingAddress', e.target.value)} style={styles.input} />
          </div>
          <div style={{ ...styles.field, ...styles.fullWidth }}>
            <label style={styles.label}>Bản đồ giao hàng</label>
            <div style={styles.smallGrid}>
              <input type="number" step="0.0000001" value={form.deliveryLatitude} onChange={(e) => handleFormChange('deliveryLatitude', e.target.value)} style={styles.input} placeholder="Vĩ độ" />
              <input type="number" step="0.0000001" value={form.deliveryLongitude} onChange={(e) => handleFormChange('deliveryLongitude', e.target.value)} style={styles.input} placeholder="Kinh độ" />
              <input type="number" step="0.01" value={form.deliveryDistanceKm} onChange={(e) => handleFormChange('deliveryDistanceKm', e.target.value)} style={styles.input} placeholder="Khoảng cách km" />
              <input type="number" value={form.deliveryFee} onChange={(e) => handleFormChange('deliveryFee', e.target.value)} style={styles.input} placeholder="Phí giao hàng" />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Trạng thái đơn</label>
            <select value={form.status} onChange={(e) => handleFormChange('status', e.target.value)} style={styles.input}>
              <option value="pending">Chờ xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Tổng tiền tạm tính</label>
            <input value={`${computedTotal.toLocaleString()}đ`} readOnly style={styles.input} />
          </div>
        </div>

        <div style={{ marginTop: '18px' }}>
          <h4 style={{ color: '#6b1218', marginBottom: '10px' }}>Chi tiết đơn hàng</h4>
          {form.items.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              <div style={styles.field}>
                <label style={styles.label}>Sản phẩm</label>
                <select value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} style={styles.input}>
                  <option value="">Chọn sản phẩm</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Số lượng</label>
                <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Giá</label>
                <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} style={styles.input} />
              </div>
              <button type="button" onClick={() => removeItemRow(index)} style={styles.dangerButton}>Xóa dòng</button>
            </div>
          ))}
        </div>

        <div style={styles.actionRow}>
          <button type="button" onClick={addItemRow} style={styles.secondaryButton}>+ Thêm món</button>
          <button type="submit" style={styles.button}>{editingId ? 'Lưu cập nhật' : 'Tạo đơn hàng'}</button>
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={styles.secondaryButton}>Làm mới form</button>
        </div>
      </form>

      <div style={styles.metrics}>
        <div style={styles.metricCard}><div style={styles.metricLabel}>Tổng đơn hàng</div><div style={styles.metricValue}>{orders.length}</div></div>
        <div style={styles.metricCard}><div style={styles.metricLabel}>Chờ xác nhận</div><div style={styles.metricValue}>{pendingCount}</div></div>
        <div style={styles.metricCard}><div style={styles.metricLabel}>Đang xử lý</div><div style={styles.metricValue}>{processingCount}</div></div>
        <div style={styles.metricCard}><div style={styles.metricLabel}>Đã thanh toán</div><div style={styles.metricValue}>{paidCount}</div></div>
      </div>

      <div style={{ marginBottom: '22px', color: '#6b1218', fontWeight: 'bold' }}>Doanh thu đơn đã thanh toán: {totalRevenue.toLocaleString()}đ</div>

      <div style={styles.searchWrap}>
        <div style={styles.field}>
          <label style={styles.label}>Tìm kiếm đơn hàng</label>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo mã giao dịch, tên khách hàng hoặc email..." style={styles.input} />
        </div>
      </div>

      <div style={styles.cardList}>
        {filteredOrders.map((order) => (
          <article key={order.id} style={styles.orderCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: '0 0 10px', color: '#6b1218', fontSize: '24px' }}>Đơn hàng #{order.id}</h3>
                <p style={{ margin: 0, lineHeight: 1.7, color: '#7b5a50' }}>
                  Khách hàng: {order.user_name} ({order.user_email})
                  <br />
                  Địa chỉ: {order.shipping_address}
                  <br />
                  Phí giao hàng: {Number(order.delivery_fee || 0).toLocaleString()}đ
                  {order.delivery_distance_km !== null && order.delivery_distance_km !== undefined ? ` (${order.delivery_distance_km} km)` : ''}
                  <br />
                  Thanh toán: {paymentMethodLabels[order.payment_method] || order.payment_method}
                  <br />
                  Tổng tiền: {Number(order.total_amount).toLocaleString()}đ
                  <br />
                  Ngày tạo: {formatVietnamDateTime(order.created_at)}
                </p>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                <span style={styles.badge}>{statusLabels[order.status] || order.status}</span>
                <span style={order.payment_status === 'paid' ? styles.paidBadge : styles.unpaidBadge}>{paymentStatusLabels[order.payment_status] || order.payment_status || 'Chưa thanh toán'}</span>
                <span style={styles.badge}>{(order.items || []).length} món</span>
              </div>
            </div>

            <div style={styles.metaGrid}>
              <div style={styles.metaCard}>
                <strong>Cổng thanh toán:</strong> {order.payment_transaction?.gateway || 'N/A'}
                <br />
                <strong>Nội dung CK:</strong> {order.payment_transaction?.transfer_content || 'N/A'}
              </div>
              <div style={styles.metaCard}>
                <strong>Mã giao dịch:</strong> {order.payment_transaction?.transaction_code || 'Chưa có'}
                <br />
                <strong>Trạng thái giao dịch:</strong> {transactionStatusLabels[order.payment_transaction?.status] || order.payment_transaction?.status || 'N/A'}
              </div>
              <div style={styles.metaCard}>
                <strong>Tọa độ giao hàng:</strong>{' '}
                {hasDeliveryLocation(order)
                  ? `${order.delivery_latitude}, ${order.delivery_longitude}`
                  : 'Chưa có'}
                <br />
                {hasDeliveryLocation(order) ? (
                  <button
                    type="button"
                    onClick={() => window.open(createMapsUrl(order.delivery_latitude, order.delivery_longitude), '_blank', 'noopener,noreferrer')}
                    style={{ ...styles.secondaryButton, marginTop: '10px' }}
                  >
                    Mở chỉ đường
                  </button>
                ) : null}
              </div>
            </div>

            <div style={{ marginTop: '16px', color: '#57352c', lineHeight: 1.8 }}>
              {(order.items || []).map((item) => (
                <div key={item.id || `${order.id}-${item.product_id}`}>
                  - {item.product_name}: {item.quantity} x {Number(item.price).toLocaleString()}đ
                </div>
              ))}
            </div>

            <div style={styles.actionRow}>
              <button type="button" onClick={() => handleEdit(order)} style={styles.button}>Sửa</button>
              <button type="button" onClick={() => handleDelete(order)} style={styles.dangerButton}>Xóa</button>
            </div>
          </article>
        ))}
      </div>
    </AdminLayoutRed>
  );
};

export default OrderAdminRed;
