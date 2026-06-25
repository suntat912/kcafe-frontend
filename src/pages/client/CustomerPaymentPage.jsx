import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader';
import { API_BASE_URL } from '../../utils/userSession';

const formatVietnamDateTime = (value) => {
  if (!value) {
    return 'Chưa có thông tin';
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

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, rgba(213,162,92,0.16), transparent 24%), linear-gradient(180deg, #f8f0e6 0%, #efe1d1 100%)',
    fontFamily: 'Arial, sans-serif',
    color: '#4a241d',
  },
  shell: {
    padding: '36px 48px 48px',
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#fffaf6',
    borderRadius: '28px',
    border: '1px solid rgba(143, 46, 38, 0.10)',
    boxShadow: '0 18px 34px rgba(107, 18, 24, 0.08)',
    padding: '24px',
  },
  title: {
    margin: 0,
    color: '#6b1218',
    fontSize: '34px',
  },
  text: {
    margin: '10px 0 0',
    color: '#7b5a50',
    lineHeight: 1.7,
  },
  qrWrap: {
    marginTop: '20px',
    borderRadius: '24px',
    background:
      'linear-gradient(135deg, rgba(143,46,38,0.08), rgba(213,162,92,0.12))',
    padding: '22px',
    display: 'grid',
    placeItems: 'center',
  },
  qrImage: {
    width: 'min(360px, 100%)',
    borderRadius: '24px',
    backgroundColor: '#fff',
    boxShadow: '0 18px 30px rgba(107,18,24,0.10)',
  },
  amount: {
    margin: '18px 0 0',
    color: '#8f2e26',
    fontWeight: 'bold',
    fontSize: '32px',
    textAlign: 'center',
  },
  infoGrid: {
    display: 'grid',
    gap: '14px',
    marginTop: '18px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    color: '#7b5a50',
  },
  list: {
    display: 'grid',
    gap: '12px',
    marginTop: '18px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    padding: '14px 16px',
    borderRadius: '18px',
    backgroundColor: '#fff4ea',
    border: '1px solid rgba(143,46,38,0.08)',
  },
  primaryButton: {
    marginTop: '20px',
    width: '100%',
    padding: '15px 18px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  secondaryButton: {
    marginTop: '12px',
    width: '100%',
    padding: '14px 18px',
    borderRadius: '16px',
    border: '1px solid #caa996',
    backgroundColor: '#fff',
    color: '#6b1218',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  statusCard: {
    marginTop: '18px',
    padding: '18px',
    borderRadius: '20px',
    backgroundColor: '#fff4ea',
    border: '1px solid rgba(143, 46, 38, 0.10)',
    color: '#6b1218',
    lineHeight: 1.7,
  },
  successCard: {
    marginTop: '18px',
    padding: '18px',
    borderRadius: '20px',
    backgroundColor: '#eef8ef',
    border: '1px solid rgba(32, 121, 73, 0.16)',
    color: '#207949',
    lineHeight: 1.7,
    fontWeight: 'bold',
  },
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

const CustomerPaymentPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const announcedRef = useRef(false);

  const fetchOrder = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
    setOrder(response.data.order);
    return response.data.order;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [orderResponse, paymentResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/orders/${orderId}`),
          axios.get(`${API_BASE_URL}/api/payment-config`),
        ]);
        setOrder(orderResponse.data.order);
        setPaymentConfig(paymentResponse.data.payment);
        setIsPolling(orderResponse.data.order?.payment_status !== 'paid');
      } catch (error) {
        alert(error.response?.data?.message || 'Không tải được thông tin thanh toán!');
      }
    };

    fetchInitialData();
  }, [orderId]);

  useEffect(() => {
    if (!order || order.payment_status === 'paid') {
      setIsPolling(false);
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const latestOrder = await fetchOrder();
        if (latestOrder?.payment_status === 'paid') {
          setIsPolling(false);
        }
      } catch (error) {
        console.error('Không thể tự kiểm tra trạng thái thanh toán', error);
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [orderId, order]);

  useEffect(() => {
    if (order?.payment_status === 'paid' && !announcedRef.current) {
      announcedRef.current = true;
      alert('Thanh toán thành công. Hệ thống đã tự động xác nhận đơn hàng của bạn.');
    }
  }, [order]);

  const transferContent = useMemo(
    () => order?.payment_transaction?.transfer_content || `KCAFE-DH${orderId}`,
    [order, orderId]
  );

  const activePaymentConfig = useMemo(
    () => ({
      bankCode: order?.payment_transaction?.bank_code || paymentConfig?.bank_code || 'BIDV',
      accountNumber: order?.payment_transaction?.account_no || paymentConfig?.account_no || '1027982130',
      accountName: paymentConfig?.account_name || 'K CAFE',
    }),
    [order, paymentConfig]
  );

  const qrUrl = useMemo(() => {
    if (!order) {
      return '';
    }

    const amount = Number(order.total_amount || 0);
    return `https://img.vietqr.io/image/${activePaymentConfig.bankCode}-${activePaymentConfig.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
      transferContent
    )}&accountName=${encodeURIComponent(activePaymentConfig.accountName)}`;
  }, [order, transferContent, activePaymentConfig]);

  const createdAtText = useMemo(() => formatVietnamDateTime(order?.created_at), [order]);

  const refreshStatus = async () => {
    try {
      const latestOrder = await fetchOrder();
      setIsPolling(latestOrder?.payment_status !== 'paid');
    } catch (error) {
      alert(error.response?.data?.message || 'Không tải được trạng thái thanh toán!');
    }
  };

  if (!order) {
    return (
      <div style={styles.page}>
        <CustomerHeader />
      </div>
    );
  }

  const isPaid = order.payment_status === 'paid';

  return (
    <div style={styles.page}>
      <CustomerHeader />

      <div style={styles.shell}>
        <section style={styles.card}>
          <h1 style={styles.title}>Thanh toán chuyển khoản</h1>
          <p style={styles.text}>
            Quét mã QR bên dưới để thanh toán đúng số tiền của đơn hàng. Hệ thống sẽ tự kiểm tra
            giao dịch khớp và tự động xác nhận khi nhận được callback thanh toán.
          </p>

          <div style={styles.qrWrap}>
            <img src={qrUrl} alt={`QR thanh toán đơn ${order.id}`} style={styles.qrImage} />
          </div>
          <div style={styles.amount}>{Number(order.total_amount || 0).toLocaleString()}đ</div>

          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span>Ngân hàng nhận</span>
              <strong>{activePaymentConfig.bankCode}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Số tài khoản</span>
              <strong>{activePaymentConfig.accountNumber}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Chủ tài khoản</span>
              <strong>{activePaymentConfig.accountName}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Nội dung chuyển khoản</span>
              <strong>{transferContent}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Trạng thái thanh toán</span>
              <strong>{isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Ngày giờ đặt đơn</span>
              <strong>{createdAtText}</strong>
            </div>
          </div>

          {isPaid ? (
            <div style={styles.successCard}>
              Thanh toán thành công. Đơn hàng của bạn đã được chuyển sang trạng thái đang xử lý giao hàng.
            </div>
          ) : (
            <div style={styles.statusCard}>
              Hệ thống đang tự động kiểm tra giao dịch mỗi vài giây.
              <br />
              {isPolling ? 'Đang chờ callback hoặc dữ liệu đối soát từ cổng thanh toán.' : 'Đã dừng tự kiểm tra.'}
            </div>
          )}

          <button type="button" onClick={refreshStatus} style={styles.primaryButton}>
            Kiểm tra lại ngay
          </button>
          <button type="button" onClick={() => navigate('/customer/home')} style={styles.secondaryButton}>
            Quay về trang khách hàng
          </button>
        </section>

        <aside style={styles.card}>
          <h2 style={{ margin: 0, color: '#6b1218', fontSize: '28px' }}>Chi tiết đơn hàng</h2>
          <p style={styles.text}>
            Đơn hàng #{order.id} đang ở trạng thái <strong>{order.status}</strong>.
          </p>

          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span>Người đặt</span>
              <strong>{order.user_name}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Địa chỉ giao hàng</span>
              <strong>{order.shipping_address}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Phí giao hàng</span>
              <strong>{Number(order.delivery_fee || 0).toLocaleString()}đ</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Khoảng cách</span>
              <strong>{order.delivery_distance_km !== null && order.delivery_distance_km !== undefined ? `${order.delivery_distance_km} km` : 'Chưa chọn vị trí'}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Phương thức</span>
              <strong>{order.payment_method}</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Ngày giờ đặt đơn</span>
              <strong>{createdAtText}</strong>
            </div>
            {order.payment_transaction?.transaction_code && (
              <div style={styles.infoRow}>
                <span>Mã giao dịch</span>
                <strong>{order.payment_transaction.transaction_code}</strong>
              </div>
            )}
          </div>

          {hasDeliveryLocation(order) ? (
            <button
              type="button"
              onClick={() => window.open(createMapsUrl(order.delivery_latitude, order.delivery_longitude), '_blank', 'noopener,noreferrer')}
              style={styles.secondaryButton}
            >
              Mở chỉ đường giao hàng
            </button>
          ) : null}

          <div style={styles.list}>
            {(order.items || []).map((item) => (
              <div key={item.id || `${item.product_id}-${item.quantity}`} style={styles.item}>
                <div>
                  <strong>{item.product_name}</strong>
                  <div style={{ color: '#7b5a50', marginTop: '6px' }}>Số lượng: {item.quantity}</div>
                </div>
                <strong>{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}đ</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CustomerPaymentPage;
