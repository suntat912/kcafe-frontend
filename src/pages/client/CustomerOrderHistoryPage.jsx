import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CustomerHeader from '../../components/CustomerHeader';
import { API_BASE_URL, getStoredUser } from '../../utils/userSession';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f0e6 0%, #efe1d1 100%)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#4a241d',
  },
  shell: {
    padding: '36px 48px 48px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    margin: 0,
    color: '#6b1218',
    fontSize: '36px',
  },
  text: {
    margin: '12px 0 0',
    color: '#7b5a50',
    lineHeight: 1.8,
    maxWidth: '760px',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '18px',
    marginBottom: '26px',
  },
  metricCard: {
    backgroundColor: '#fffaf6',
    borderRadius: '22px',
    border: '1px solid rgba(143,46,38,0.10)',
    boxShadow: '0 14px 30px rgba(107,18,24,0.06)',
    padding: '20px',
  },
  metricLabel: {
    color: '#9e3a33',
    fontSize: '13px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  metricValue: {
    marginTop: '10px',
    color: '#6b1218',
    fontSize: '30px',
    fontWeight: 'bold',
  },
  list: {
    display: 'grid',
    gap: '18px',
  },
  card: {
    backgroundColor: '#fffaf6',
    borderRadius: '24px',
    border: '1px solid rgba(143,46,38,0.10)',
    boxShadow: '0 14px 28px rgba(107,18,24,0.06)',
    padding: '22px',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'start',
    flexWrap: 'wrap',
  },
  orderTitle: {
    margin: '0 0 10px',
    color: '#6b1218',
    fontSize: '24px',
  },
  orderMeta: {
    margin: 0,
    color: '#7b5a50',
    lineHeight: 1.8,
  },
  badgeWrap: {
    display: 'grid',
    gap: '10px',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: '999px',
    backgroundColor: '#f3ddd0',
    color: '#8f2e26',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  paidBadge: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: '999px',
    backgroundColor: '#e6f6ea',
    color: '#207949',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  unpaidBadge: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: '999px',
    backgroundColor: '#fff2dc',
    color: '#a06400',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  itemsWrap: {
    marginTop: '16px',
    padding: '16px 18px',
    borderRadius: '18px',
    backgroundColor: '#fff4ea',
    border: '1px solid rgba(143,46,38,0.08)',
    color: '#6a4338',
    lineHeight: 1.8,
  },
  empty: {
    padding: '48px',
    textAlign: 'center',
    borderRadius: '24px',
    backgroundColor: '#fffaf6',
    border: '1px solid rgba(143,46,38,0.10)',
    color: '#7b5a50',
  },
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

const CustomerOrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const user = getStoredUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          params: { user_id: user.id },
        });
        setOrders(response.data.orders || []);
      } catch (error) {
        alert(error.response?.data?.message || 'Không tải được lịch sử đơn hàng!');
      }
    };

    fetchOrders();
  }, [user?.id]);

  const totalSpent = useMemo(
    () => orders.filter((item) => item.payment_status === 'paid').reduce((sum, item) => sum + Number(item.total_amount || 0), 0),
    [orders]
  );
  const pendingOrders = useMemo(() => orders.filter((item) => item.status === 'pending').length, [orders]);
  const processingOrders = useMemo(() => orders.filter((item) => item.status === 'processing').length, [orders]);
  const paidOrders = useMemo(() => orders.filter((item) => item.payment_status === 'paid').length, [orders]);

  return (
    <div style={styles.page}>
      <CustomerHeader />
      <section style={styles.shell}>
        <div style={styles.header}>
          <h1 style={styles.title}>Lịch sử đơn hàng</h1>
          <p style={styles.text}>
            Bạn có thể xem lại toàn bộ đơn đã đặt, thời gian tạo đơn, trạng thái vận hành,
            trạng thái thanh toán và chi tiết từng món trong mỗi đơn hàng.
          </p>
        </div>

        <div style={styles.metrics}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Tổng đơn hàng</div>
            <div style={styles.metricValue}>{orders.length}</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Chờ xác nhận</div>
            <div style={styles.metricValue}>{pendingOrders}</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Đang xử lý</div>
            <div style={styles.metricValue}>{processingOrders}</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Đã thanh toán</div>
            <div style={styles.metricValue}>{paidOrders}</div>
          </div>
        </div>

        <div style={{ marginBottom: '22px', color: '#6b1218', fontWeight: 'bold' }}>
          Tổng chi tiêu đã thanh toán: {totalSpent.toLocaleString()}đ
        </div>

        {orders.length === 0 ? (
          <div style={styles.empty}>Bạn chưa có đơn hàng nào. Hãy chọn vài món và bắt đầu đặt hàng.</div>
        ) : (
          <div style={styles.list}>
            {orders.map((order) => (
              <article key={order.id} style={styles.card}>
                <div style={styles.cardHead}>
                  <div>
                    <h2 style={styles.orderTitle}>Đơn hàng #{order.id}</h2>
                    <p style={styles.orderMeta}>
                      Ngày đặt: {formatVietnamDateTime(order.created_at)}
                      <br />
                      Phương thức thanh toán: {paymentMethodLabels[order.payment_method] || order.payment_method}
                      <br />
                      Địa chỉ giao hàng: {order.shipping_address}
                      <br />
                      Tổng tiền: {Number(order.total_amount || 0).toLocaleString()}đ
                      <br />
                      Phi giao hang: {Number(order.delivery_fee || 0).toLocaleString()}d
                      {order.delivery_distance_km !== null && order.delivery_distance_km !== undefined ? ` (${order.delivery_distance_km} km)` : ''}
                    </p>
                    {hasDeliveryLocation(order) ? (
                      <button
                        type="button"
                        onClick={() => window.open(createMapsUrl(order.delivery_latitude, order.delivery_longitude), '_blank', 'noopener,noreferrer')}
                        style={{
                          marginTop: '12px',
                          padding: '10px 14px',
                          borderRadius: '14px',
                          border: '1px solid #caa996',
                          backgroundColor: '#fff',
                          color: '#6b1218',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        Mo chi duong giao hang
                      </button>
                    ) : null}
                  </div>
                  <div style={styles.badgeWrap}>
                    <span style={styles.badge}>{statusLabels[order.status] || order.status}</span>
                    <span style={order.payment_status === 'paid' ? styles.paidBadge : styles.unpaidBadge}>
                      {paymentStatusLabels[order.payment_status] || order.payment_status || 'Chưa thanh toán'}
                    </span>
                  </div>
                </div>

                <div style={styles.itemsWrap}>
                  {(order.items || []).map((item) => (
                    <div key={item.id || `${order.id}-${item.product_id}`}>
                      - {item.product_name}: {item.quantity} x {Number(item.price || 0).toLocaleString()}đ
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerOrderHistoryPage;
