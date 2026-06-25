import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerHeader from '../../components/CustomerHeader';
import {
  clearCartItems,
  getCartItems,
  getStoredUser,
  removeCartItem,
  updateCartItemQuantity,
  API_BASE_URL,
} from '../../utils/userSession';

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

const getProductImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === 'default-product.png') {
    return '';
  }

  if (/^https?:\/\//.test(imageUrl)) {
    return imageUrl;
  }

  return `${API_BASE_URL}/uploads/products/${imageUrl}`;
};

const SHOP_LOCATION = {
  name: 'K-COFFEE',
  latitude: 10.776889,
  longitude: 106.700806,
};

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (from, to) => {
  if (!from?.latitude || !from?.longitude || !to?.latitude || !to?.longitude) {
    return null;
  }

  const earthRadiusKm = 6371;
  const latDistance = toRadians(to.latitude - from.latitude);
  const lonDistance = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(lonDistance / 2) *
      Math.sin(lonDistance / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(2));
};

const fetchRouteDistanceKm = async (from, to, signal) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=false`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('Không lấy được dữ liệu tuyến đường.');
  }

  const data = await response.json();
  const distanceMeters = data.routes?.[0]?.distance;
  if (!distanceMeters) {
    throw new Error('Không tìm thấy tuyến đường phù hợp.');
  }

  return Number((distanceMeters / 1000).toFixed(2));
};

const calculateShippingFee = (subtotal, distanceKm) => {
  if (subtotal <= 0) {
    return 0;
  }

  if (distanceKm === null || distanceKm === undefined) {
    return 15000;
  }

  if (distanceKm <= 3) {
    return 15000;
  }

  return 15000 + Math.ceil(distanceKm - 3) * 4000;
};

const createMapsUrl = (latitude, longitude) =>
  `https://www.google.com/maps/dir/?api=1&origin=${SHOP_LOCATION.latitude},${SHOP_LOCATION.longitude}&destination=${latitude},${longitude}`;

const createMapPreviewUrl = (latitude, longitude) => {
  const delta = 0.01;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
};

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, rgba(143,46,38,0.12), transparent 24%), linear-gradient(180deg, #f8f0e6 0%, #efe1d1 100%)',
    fontFamily: 'Arial, sans-serif',
    color: '#4a241d',
  },
  shell: {
    padding: '34px 48px 48px',
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
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
  title: { margin: 0, color: '#6b1218', fontSize: '34px' },
  text: { margin: '10px 0 0', color: '#7b5a50', lineHeight: 1.7 },
  list: { display: 'grid', gap: '16px', marginTop: '22px' },
  itemCard: { display: 'grid', gridTemplateColumns: '140px 1fr', gap: '18px', borderRadius: '22px', overflow: 'hidden', backgroundColor: '#fff4ea', border: '1px solid rgba(143, 46, 38, 0.08)' },
  itemVisual: { minHeight: '150px', background: 'linear-gradient(135deg, rgba(143,46,38,0.98) 0%, rgba(107,18,24,0.94) 100%)', color: '#fff7ef', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '18px', padding: '18px', textAlign: 'center' },
  itemImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  itemVisualLabel: { padding: '18px', textAlign: 'center' },
  itemBody: { padding: '18px 18px 18px 0' },
  itemHead: { display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start' },
  itemName: { margin: 0, color: '#6b1218', fontSize: '24px' },
  tag: { display: 'inline-block', marginTop: '8px', padding: '7px 12px', borderRadius: '999px', backgroundColor: '#f3ddd0', color: '#8f2e26', fontWeight: 'bold', fontSize: '13px' },
  qtyRow: { marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' },
  qtyWrap: { display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', borderRadius: '999px', border: '1px solid rgba(143, 46, 38, 0.12)', padding: '8px' },
  qtyButton: { width: '34px', height: '34px', borderRadius: '999px', border: 'none', backgroundColor: '#8f2e26', color: '#fff7ef', fontWeight: 'bold', cursor: 'pointer' },
  removeButton: { padding: '11px 14px', borderRadius: '14px', border: '1px solid rgba(143,46,38,0.18)', backgroundColor: '#fff1ed', color: '#8f2e26', fontWeight: 'bold', cursor: 'pointer' },
  summaryTitle: { margin: 0, color: '#6b1218', fontSize: '28px' },
  summaryBlock: { marginTop: '20px', display: 'grid', gap: '14px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#7b5a50' },
  totalRow: { display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '18px', borderTop: '1px solid rgba(143, 46, 38, 0.10)', color: '#6b1218', fontWeight: 'bold', fontSize: '24px' },
  checkoutButton: { marginTop: '20px', width: '100%', padding: '15px 18px', borderRadius: '16px', border: 'none', backgroundColor: '#8f2e26', color: '#fff7ef', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  secondaryButton: { marginTop: '12px', width: '100%', padding: '14px 18px', borderRadius: '16px', border: '1px solid #caa996', backgroundColor: '#fff', color: '#6b1218', fontWeight: 'bold', cursor: 'pointer' },
  emptyWrap: { display: 'grid', placeItems: 'center', minHeight: '320px', textAlign: 'center' },
  field: { display: 'grid', gap: '8px', marginTop: '18px' },
  label: { color: '#6b1218', fontWeight: 'bold', fontSize: '14px' },
  input: { width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '16px', border: '1px solid #dcc2b3', backgroundColor: '#fff', fontSize: '15px' },
  paymentCard: { marginTop: '18px', padding: '18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(143,46,38,0.08), rgba(213,162,92,0.16))', border: '1px solid rgba(143,46,38,0.10)' },
  radioRow: { display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' },
  radioLabel: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '999px', backgroundColor: '#fff', border: '1px solid rgba(143,46,38,0.10)', fontWeight: 'bold' },
  discountRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginTop: '12px' },
  locationGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' },
  mapPreview: { width: '100%', height: '210px', border: 0, borderRadius: '18px', marginTop: '12px', backgroundColor: '#f3ddd0' },
  deliveryNote: { marginTop: '10px', color: '#7b5a50', lineHeight: 1.6, fontSize: '14px' },
  successNote: { marginTop: '10px', color: '#207949', fontWeight: 'bold' },
  warningNote: {
    marginTop: '12px',
    padding: '12px 14px',
    borderRadius: '14px',
    backgroundColor: '#fff1ed',
    border: '1px solid rgba(143,46,38,0.14)',
    color: '#8f2e26',
    fontWeight: 'bold',
    lineHeight: 1.5,
  },
};

const CustomerCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(getCartItems());
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState({ latitude: '', longitude: '' });
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const user = getStoredUser();

  useEffect(() => {
    const syncCart = () => setCartItems(getCartItems());
    window.addEventListener('cart-updated', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('cart-updated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cartItems]
  );
  const fallbackDistanceKm = useMemo(() => {
    const latitude = Number(deliveryLocation.latitude);
    const longitude = Number(deliveryLocation.longitude);
    if (!latitude || !longitude) {
      return null;
    }

    return calculateDistanceKm(SHOP_LOCATION, { latitude, longitude });
  }, [deliveryLocation]);
  const deliveryDistanceKm = routeDistanceKm ?? fallbackDistanceKm;
  const shippingFee = calculateShippingFee(subtotal, deliveryDistanceKm);
  const discountAmount = Number(discount?.discount_amount || 0);
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  useEffect(() => {
    setDiscount(null);
  }, [subtotal]);

  useEffect(() => {
    const latitude = Number(deliveryLocation.latitude);
    const longitude = Number(deliveryLocation.longitude);
    if (!latitude || !longitude) {
      setRouteDistanceKm(null);
      setRouteError('');
      return undefined;
    }

    const controller = new AbortController();
    setIsRouteLoading(true);
    setRouteError('');

    fetchRouteDistanceKm(SHOP_LOCATION, { latitude, longitude }, controller.signal)
      .then((distanceKm) => {
        setRouteDistanceKm(distanceKm);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setRouteDistanceKm(null);
          setRouteError('Chưa lấy được đường đi thực tế, đang dùng khoảng cách ước tính.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsRouteLoading(false);
        }
      });

    return () => controller.abort();
  }, [deliveryLocation]);

  const handleQuantityChange = (productId, nextQuantity) => {
    updateCartItemQuantity(productId, nextQuantity);
    setCartItems(getCartItems());
  };

  const handleRemoveItem = (productId) => {
    removeCartItem(productId);
    setCartItems(getCartItems());
  };

  const handleClearCart = () => {
    clearCartItems();
    setCartItems([]);
    setDiscount(null);
    setDiscountCode('');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn chưa hỗ trợ lấy vị trí hiện tại.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeliveryLocation({
          latitude: position.coords.latitude.toFixed(7),
          longitude: position.coords.longitude.toFixed(7),
        });
      },
      () => {
        alert('Không lấy được vị trí. Bạn có thể nhập tọa độ thủ công để demo bản đồ giao hàng.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      alert('Bạn cần nhập mã giảm giá.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/discount-codes/validate`, {
        code: discountCode,
        subtotal,
      });
      setDiscount(response.data.discount);
      setDiscountCode(response.data.discount.code || discountCode.trim().toUpperCase());
      alert(response.data.message);
    } catch (error) {
      setDiscount(null);
      alert(error.response?.data?.message || 'Không áp dụng được mã giảm giá!');
    }
  };

  const handleCheckout = async () => {
    if (!user?.id) {
      alert('Bạn cần đăng nhập lại trước khi đặt hàng.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Hãy chọn ít nhất một sản phẩm và thêm vào giỏ hàng trước khi tạo đơn.');
      return;
    }

    if (!shippingAddress.trim()) {
      alert('Bạn cần nhập địa chỉ giao hàng.');
      return;
    }

    try {
      const latitude = Number(deliveryLocation.latitude) || null;
      const longitude = Number(deliveryLocation.longitude) || null;
      const payload = {
        userId: user.id,
        shippingAddress,
        deliveryLatitude: latitude,
        deliveryLongitude: longitude,
        deliveryDistanceKm,
        deliveryFee: shippingFee,
        paymentMethod,
        status: 'pending',
        discountCode: discount?.code || '',
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders`, payload);
      clearCartItems();
      setCartItems([]);
      setDiscount(null);
      setDiscountCode('');

      if (paymentMethod === 'transfer') {
        navigate(`/customer/payment/${response.data.order.id}`);
        return;
      }

      const createdAt = formatVietnamDateTime(response.data.order?.created_at);
      alert(`Đặt hàng thành công. Đơn của bạn đã được tạo lúc ${createdAt}.`);
      navigate('/customer/home');
    } catch (error) {
      alert(error.response?.data?.message || 'Tạo đơn hàng thất bại!');
    }
  };

  return (
    <div className="kc-customer-page" style={styles.page}>
      <CustomerHeader />

      <div className="kc-cart-shell" style={styles.shell}>
        <section className="kc-card" style={styles.card}>
          <h1 style={styles.title}>Giỏ hàng của bạn</h1>
          <p style={styles.text}>
            Kiểm tra lại các món đã chọn, thay đổi số lượng nhanh và xem tổng tiền trước khi
            chuyển sang bước thanh toán.
          </p>

          {cartItems.length === 0 ? (
            <div style={styles.emptyWrap}>
              <div>
                <h2 style={{ margin: 0, color: '#6b1218' }}>Giỏ hàng đang trống</h2>
                <p style={{ ...styles.text, marginTop: '12px' }}>
                  Hãy quay lại menu và thêm vài món nổi bật vào giỏ để bắt đầu.
                </p>
              </div>
            </div>
          ) : (
            <div className="kc-cart-list" style={styles.list}>
              {cartItems.map((item) => (
                <article className="kc-cart-item" key={item.productId} style={styles.itemCard}>
                  <div className="kc-cart-item-visual" style={styles.itemVisual}>
                    {getProductImageUrl(item.imageUrl) ? (
                      <img src={getProductImageUrl(item.imageUrl)} alt={item.name} style={styles.itemImage} />
                    ) : (
                      <div style={styles.itemVisualLabel}>{item.name}</div>
                    )}
                  </div>
                  <div className="kc-cart-item-body" style={styles.itemBody}>
                    <div className="kc-cart-item-head" style={styles.itemHead}>
                      <div>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <span style={styles.tag}>{item.categoryName || 'K-CAFE'}</span>
                      </div>
                      <div style={{ color: '#8f2e26', fontWeight: 'bold', fontSize: '22px' }}>
                        {Number(item.price || 0).toLocaleString()}đ
                      </div>
                    </div>

                    <div style={styles.qtyRow}>
                      <div style={styles.qtyWrap}>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, Number(item.quantity || 0) - 1)}
                          style={styles.qtyButton}
                        >
                          -
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, Number(item.quantity || 0) + 1)}
                          style={styles.qtyButton}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ color: '#6b1218', fontWeight: 'bold', fontSize: '20px' }}>
                        {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}đ
                      </div>

                      <button type="button" onClick={() => handleRemoveItem(item.productId)} style={styles.removeButton}>
                        Xóa món
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="kc-card kc-cart-summary" style={styles.card}>
          <h2 style={styles.summaryTitle}>Tóm tắt đơn hàng</h2>
          <div style={styles.summaryBlock}>
            <div style={styles.summaryRow}>
              <span>Số món trong giỏ</span>
              <strong>{cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Tạm tính</span>
              <strong>{subtotal.toLocaleString()}đ</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Phí giao hàng</span>
              <strong>{shippingFee.toLocaleString()}đ</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Khoảng cách</span>
              <strong>{deliveryDistanceKm !== null ? `${deliveryDistanceKm} km` : 'Chưa chọn vị trí'}</strong>
            </div>
            {deliveryDistanceKm !== null ? (
              <div style={styles.summaryRow}>
                <span>Cách tính</span>
                <strong>{routeDistanceKm !== null ? 'Đường đi thực tế' : 'Ước tính tạm'}</strong>
              </div>
            ) : null}
            <div style={styles.summaryRow}>
              <span>Giảm giá</span>
              <strong>-{discountAmount.toLocaleString()}đ</strong>
            </div>
            <div style={styles.totalRow}>
              <span>Tổng cộng</span>
              <span>{total.toLocaleString()}đ</span>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div style={styles.warningNote}>
              Giỏ hàng đang trống. Hãy chọn ít nhất một sản phẩm và thêm vào giỏ hàng trước khi tạo đơn.
            </div>
          ) : null}

          <div style={styles.field}>
            <label style={styles.label}>Địa chỉ giao hàng</label>
            <input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={styles.input} placeholder="Ví dụ: 123 Lê Lợi, Quận 1" />
          </div>

          <div style={styles.paymentCard}>
            <div style={styles.label}>Bản đồ giao hàng</div>
            <div style={styles.deliveryNote}>
              Quán được đặt mặc định tại trung tâm Quận 1. Hệ thống tự tính đường đi thực tế và phí ship theo km, không cần admin tính tay.
            </div>
            <button type="button" style={styles.secondaryButton} onClick={handleUseCurrentLocation}>
              Lấy vị trí hiện tại
            </button>
            <div className="kc-location-grid" style={styles.locationGrid}>
              <input
                type="number"
                step="0.0000001"
                value={deliveryLocation.latitude}
                onChange={(e) => setDeliveryLocation((current) => ({ ...current, latitude: e.target.value }))}
                style={styles.input}
                placeholder="Vĩ độ"
              />
              <input
                type="number"
                step="0.0000001"
                value={deliveryLocation.longitude}
                onChange={(e) => setDeliveryLocation((current) => ({ ...current, longitude: e.target.value }))}
                style={styles.input}
                placeholder="Kinh độ"
              />
            </div>
            {deliveryDistanceKm !== null ? (
              <>
                <div style={styles.deliveryNote}>
                  {isRouteLoading
                    ? 'Đang tính tuyến đường giao hàng...'
                    : routeDistanceKm !== null
                      ? `Đã tính theo tuyến đường lái xe: ${routeDistanceKm} km.`
                      : routeError}
                </div>
                <iframe
                  title="Bản đồ vị trí giao hàng"
                  src={createMapPreviewUrl(Number(deliveryLocation.latitude), Number(deliveryLocation.longitude))}
                  style={styles.mapPreview}
                  loading="lazy"
                />
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => window.open(createMapsUrl(Number(deliveryLocation.latitude), Number(deliveryLocation.longitude)), '_blank', 'noopener,noreferrer')}
                >
                  Mở chỉ đường Google Maps
                </button>
              </>
            ) : null}
          </div>

          <div style={styles.paymentCard}>
            <div style={styles.label}>Phương thức thanh toán</div>
            <div style={styles.radioRow}>
              <label style={styles.radioLabel}>
                <input type="radio" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                Chuyển khoản QR
              </label>
              <label style={styles.radioLabel}>
                <input type="radio" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                Tiền mặt
              </label>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mã giảm giá</label>
            <div className="kc-discount-row" style={styles.discountRow}>
              <input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                style={styles.input}
                placeholder="Ví dụ: WELCOME10"
              />
              <button type="button" style={styles.secondaryButton} onClick={handleApplyDiscount}>
                Áp mã
              </button>
            </div>
            {discount ? <div style={styles.successNote}>Đã áp dụng mã {discount.code}.</div> : null}
          </div>

          <button type="button" style={styles.checkoutButton} onClick={handleCheckout}>
            {paymentMethod === 'transfer' ? 'Tạo đơn và thanh toán QR' : 'Đặt hàng tiền mặt'}
          </button>
          <button type="button" style={styles.secondaryButton} onClick={handleClearCart} disabled={cartItems.length === 0}>
            Xóa toàn bộ giỏ hàng
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CustomerCartPage;
