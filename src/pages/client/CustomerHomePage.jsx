import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader';
import { API_BASE_URL } from '../../utils/userSession';

const sectionButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '220px',
  padding: '14px 24px',
  borderRadius: '999px',
  border: '1px solid currentColor',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  letterSpacing: '0.04em',
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#efe7dd',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#4a2f25',
  },
  splitSection: {
    minHeight: '470px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  lightPanel: {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.94) 58%, rgba(255,255,255,0.58) 100%)',
    display: 'flex',
    alignItems: 'center',
    padding: '56px 64px',
  },
  darkPanel: {
    background: 'linear-gradient(90deg, rgba(198,155,96,0.96) 0%, rgba(198,155,96,0.92) 58%, rgba(198,155,96,0.72) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '56px 64px',
  },
  imagePanelTop: {
    background: 'linear-gradient(120deg, rgba(92,57,38,0.08) 0%, rgba(92,57,38,0.08) 100%), url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80") center/cover no-repeat',
  },
  imagePanelBottom: {
    background: 'linear-gradient(120deg, rgba(176,128,73,0.22) 0%, rgba(176,128,73,0.18) 100%), url("https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80") center/cover no-repeat',
  },
  contentWrap: {
    maxWidth: '560px',
  },
  contentWrapRight: {
    maxWidth: '560px',
    textAlign: 'center',
    marginLeft: 'auto',
  },
  sectionTitle: {
    margin: '0 0 18px',
    fontSize: '62px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#6a452f',
    lineHeight: 1,
  },
  sectionTitleLight: {
    color: '#fff7ef',
  },
  sectionLead: {
    margin: '0 0 12px',
    fontSize: '22px',
    textTransform: 'uppercase',
    color: '#4e423a',
    fontWeight: '600',
  },
  sectionLeadLight: {
    color: '#fff7ef',
  },
  body: {
    margin: 0,
    fontSize: '18px',
    lineHeight: 1.75,
    color: '#4e423a',
    maxWidth: '560px',
  },
  bodyLight: {
    color: 'rgba(255,247,239,0.92)',
  },
  topButton: {
    ...sectionButton,
    marginTop: '28px',
    color: '#b5292d',
    backgroundColor: 'transparent',
  },
  bottomButton: {
    ...sectionButton,
    marginTop: '28px',
    color: '#fff7ef',
    backgroundColor: 'transparent',
  },
  showcase: {
    padding: '34px 48px 48px',
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  showcaseTitle: {
    margin: 0,
    color: '#6b1218',
    fontSize: '34px',
  },
  showcaseText: {
    margin: '8px 0 0',
    color: '#7b5a50',
    lineHeight: 1.7,
  },
  carouselViewport: {
    overflow: 'hidden',
    borderRadius: '24px',
  },
  carouselTrack: {
    display: 'flex',
    gap: '18px',
    transition: 'transform 700ms ease',
    willChange: 'transform',
  },
  card: {
    minWidth: '260px',
    maxWidth: '260px',
    backgroundColor: '#fffaf6',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(143,46,38,0.10)',
    boxShadow: '0 14px 28px rgba(107,18,24,0.08)',
    cursor: 'pointer',
    flexShrink: 0,
  },
  cardImageWrap: {
    height: '190px',
    background: 'linear-gradient(135deg, rgba(143,46,38,0.94) 0%, rgba(107,18,24,0.88) 100%)',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(24,10,10,0.06) 0%, rgba(24,10,10,0.52) 100%)',
  },
  cardBadge: {
    position: 'absolute',
    left: '14px',
    bottom: '14px',
    zIndex: 1,
    padding: '8px 12px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,247,239,0.92)',
    color: '#8f2e26',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  cardBody: {
    padding: '18px',
  },
  cardTitle: {
    margin: 0,
    color: '#6b1218',
    fontSize: '22px',
  },
  cardText: {
    margin: '10px 0 0',
    color: '#7b5a50',
    lineHeight: 1.7,
    minHeight: '72px',
  },
  cardPrice: {
    marginTop: '16px',
    color: '#8f2e26',
    fontWeight: 'bold',
    fontSize: '22px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(26,14,12,0.72)',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    zIndex: 1000,
  },
  modalCard: {
    width: 'min(92vw, 920px)',
    backgroundColor: '#fffaf6',
    borderRadius: '28px',
    overflow: 'hidden',
    boxShadow: '0 24px 48px rgba(0,0,0,0.26)',
    display: 'grid',
    gridTemplateColumns: '1fr 0.95fr',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    minHeight: '460px',
    objectFit: 'cover',
    display: 'block',
    backgroundColor: '#ead8c8',
  },
  modalBody: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalClose: {
    alignSelf: 'flex-end',
    width: '42px',
    height: '42px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  modalTitle: {
    margin: 0,
    color: '#6b1218',
    fontSize: '34px',
  },
  modalDesc: {
    margin: 0,
    color: '#7b5a50',
    lineHeight: 1.8,
    fontSize: '17px',
  },
  modalPrice: {
    color: '#8f2e26',
    fontWeight: 'bold',
    fontSize: '30px',
  },
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

const CustomerHomePage = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, statsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products`),
          axios.get(`${API_BASE_URL}/api/admin/dashboard`),
        ]);
        setProducts(productsResponse.data.products || []);
        setStats(statsResponse.data.stats || null);
      } catch (error) {
        alert(error.response?.data?.message || 'Không tải được dữ liệu trang chủ!');
      }
    };

    fetchData();
  }, []);

  const bestSellerProducts = useMemo(() => {
    const topProducts = stats?.top_products || [];
    if (topProducts.length) {
      const mapped = topProducts
        .map((topProduct) => products.find((product) => Number(product.id) === Number(topProduct.id)))
        .filter(Boolean);
      if (mapped.length) {
        return mapped;
      }
    }

    return products.slice(0, 6);
  }, [products, stats]);

  const sliderProducts = useMemo(() => {
    if (!bestSellerProducts.length) {
      return [];
    }
    return [...bestSellerProducts, ...bestSellerProducts];
  }, [bestSellerProducts]);

  useEffect(() => {
    if (bestSellerProducts.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % bestSellerProducts.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [bestSellerProducts]);

  return (
    <div className="kc-customer-page" style={styles.page}>
      <CustomerHeader />

      <section style={styles.splitSection}>
        <div style={styles.lightPanel}>
          <div style={styles.contentWrap}>
            <h1 style={styles.sectionTitle}>Nguồn gốc</h1>
            <p style={styles.sectionLead}>Câu chuyện của quán</p>
            <p style={styles.body}>
              K-Coffee là không gian cà phê hiện đại với menu rõ ràng, dễ chọn, phù hợp cho khách
              ghé quán, mang đi hoặc đặt nhanh trong ngày.
            </p>
            <Link to="/customer/drinks" style={styles.topButton}>Xem đồ uống</Link>
          </div>
        </div>
        <div style={styles.imagePanelTop} />
      </section>

      <section style={styles.showcase}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.showcaseTitle}>Sản phẩm bán chạy</h2>
            <p style={styles.showcaseText}>Các món được hệ thống thống kê từ đơn hàng đã bán.</p>
          </div>
        </div>

        <div style={styles.carouselViewport}>
          <div
            style={{
              ...styles.carouselTrack,
              transform: `translateX(-${slideIndex * 278}px)`,
            }}
          >
            {sliderProducts.map((product, index) => {
              const imageUrl = getProductImageUrl(product.image_url);
              return (
                <article className="kc-product-card" key={`${product.id}-${index}`} style={styles.card} onClick={() => setActiveProduct(product)}>
                  <div style={styles.cardImageWrap}>
                    {imageUrl ? <img src={imageUrl} alt={product.name} style={styles.cardImage} /> : null}
                    <div style={styles.cardOverlay} />
                    <div style={styles.cardBadge}>Bán chạy</div>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{product.name}</h3>
                    <p style={styles.cardText}>
                      {product.description || 'Sản phẩm đang được nhiều khách hàng lựa chọn.'}
                    </p>
                    <div style={styles.cardPrice}>{Number(product.price || 0).toLocaleString()}đ</div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section style={styles.splitSection}>
        <div style={styles.imagePanelBottom} />
        <div style={styles.darkPanel}>
          <div style={styles.contentWrapRight}>
            <h2 style={{ ...styles.sectionTitle, ...styles.sectionTitleLight }}>Dịch vụ</h2>
            <p style={{ ...styles.sectionLead, ...styles.sectionLeadLight }}>Liên hệ và phản hồi</p>
            <p style={{ ...styles.body, ...styles.bodyLight }}>
              Nếu bạn cần hỗ trợ đặt món hoặc liên hệ trực tiếp với cửa hàng, khu dịch vụ sẽ hiển thị
              email, Facebook và số điện thoại để bạn kết nối nhanh.
            </p>
            <Link to="/customer/services" style={styles.bottomButton}>Xem dịch vụ</Link>
          </div>
        </div>
      </section>

      {activeProduct && (
        <div style={styles.modalOverlay} onClick={() => setActiveProduct(null)}>
          <div style={styles.modalCard} onClick={(event) => event.stopPropagation()}>
            <img
              src={getProductImageUrl(activeProduct.image_url) || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'}
              alt={activeProduct.name}
              style={styles.modalImage}
            />
            <div style={styles.modalBody}>
              <button type="button" style={styles.modalClose} onClick={() => setActiveProduct(null)}>
                x
              </button>
              <h3 style={styles.modalTitle}>{activeProduct.name}</h3>
              <p style={styles.modalDesc}>
                {activeProduct.description || 'Sản phẩm hiện đang có mặt trong menu của quán.'}
              </p>
              <div style={styles.modalPrice}>{Number(activeProduct.price || 0).toLocaleString()}đ</div>
              <Link to="/customer/drinks" style={{ ...sectionButton, color: '#8f2e26' }}>
                Xem toàn bộ đồ uống
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHomePage;
