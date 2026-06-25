import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader';
import { addCartItem, API_BASE_URL } from '../../utils/userSession';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f0e6 0%, #efe1d1 100%)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#4a241d',
  },
  hero: {
    padding: '42px 48px 20px',
  },
  heroCard: {
    borderRadius: '30px',
    padding: '42px',
    background: 'linear-gradient(135deg, rgba(198,155,96,0.92) 0%, rgba(143,46,38,0.92) 100%)',
    color: '#fff7ef',
  },
  heroTitle: {
    margin: 0,
    fontSize: '48px',
    lineHeight: 1.05,
    textTransform: 'uppercase',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  heroText: {
    margin: '16px 0 0',
    maxWidth: '820px',
    lineHeight: 1.8,
    color: 'rgba(255,247,239,0.88)',
  },
  section: {
    padding: '0 48px 40px',
  },
  searchWrap: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '18px',
    alignItems: 'end',
    marginBottom: '24px',
  },
  searchLabel: {
    color: '#6b1218',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '8px',
    display: 'block',
  },
  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    borderRadius: '16px',
    border: '1px solid #dcc2b3',
    backgroundColor: '#fffaf6',
    fontSize: '15px',
  },
  resultHint: {
    color: '#7b5a50',
    lineHeight: 1.7,
    textAlign: 'right',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 240px))',
    gap: '16px',
    justifyContent: 'start',
  },
  card: {
    backgroundColor: '#fffaf6',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(143,46,38,0.10)',
    boxShadow: '0 12px 24px rgba(107,18,24,0.07)',
  },
  visual: {
    height: '178px',
    display: 'flex',
    alignItems: 'end',
    background: 'linear-gradient(135deg, rgba(143,46,38,0.96) 0%, rgba(107,18,24,0.88) 100%)',
    color: '#fff7ef',
    fontWeight: 'bold',
    fontSize: '22px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    padding: 0,
    textAlign: 'left',
  },
  visualImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  visualOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(24,10,10,0.06) 0%, rgba(24,10,10,0.72) 100%)',
  },
  visualLabel: {
    position: 'relative',
    zIndex: 1,
    padding: '14px',
    fontSize: '16px',
  },
  body: {
    padding: '16px',
    minHeight: '190px',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: 0,
    color: '#6b1218',
    fontSize: '20px',
  },
  text: {
    margin: '10px 0 0',
    color: '#7b5a50',
    lineHeight: 1.6,
    minHeight: '58px',
    fontSize: '14px',
  },
  priceRow: {
    marginTop: 'auto',
    display: 'grid',
    gap: '10px',
    paddingTop: '18px',
  },
  price: {
    color: '#8f2e26',
    fontWeight: 'bold',
    fontSize: '21px',
  },
  button: {
    padding: '11px 14px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    width: '100%',
  },
  emptyState: {
    padding: '36px',
    textAlign: 'center',
    borderRadius: '24px',
    backgroundColor: '#fffaf6',
    border: '1px solid rgba(143,46,38,0.10)',
    color: '#7b5a50',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(26, 14, 12, 0.72)',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    zIndex: 1000,
  },
  modalCard: {
    width: 'min(92vw, 880px)',
    maxHeight: '92vh',
    backgroundColor: '#fffaf6',
    borderRadius: '26px',
    overflow: 'hidden',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.28)',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 22px',
    borderBottom: '1px solid rgba(143,46,38,0.10)',
  },
  modalTitle: {
    margin: 0,
    color: '#6b1218',
    fontSize: '24px',
  },
  modalClose: {
    width: '40px',
    height: '40px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  modalBody: {
    padding: '18px 22px 22px',
    overflowY: 'auto',
  },
  modalImage: {
    width: '100%',
    maxHeight: '68vh',
    objectFit: 'contain',
    borderRadius: '18px',
    backgroundColor: '#f4e5d8',
  },
  modalHint: {
    margin: '14px 0 0',
    color: '#7b5a50',
    lineHeight: 1.7,
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

const CustomerCategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewProduct, setPreviewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/categories`),
          axios.get(`${API_BASE_URL}/api/products`),
        ]);
        setCategories(categoryResponse.data.categories || []);
        setProducts(productResponse.data.products || []);
      } catch (error) {
        alert(error.response?.data?.message || 'Không tải được chi tiết đồ uống!');
      }
    };

    fetchData();
  }, [categoryId]);

  const category = useMemo(
    () => categories.find((item) => String(item.id) === String(categoryId)),
    [categories, categoryId]
  );

  const categoryProducts = useMemo(
    () => products.filter((product) => String(product.category_id) === String(categoryId)),
    [products, categoryId]
  );
  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return categoryProducts;
    }
    return categoryProducts.filter((product) => String(product.name || '').toLowerCase().includes(keyword));
  }, [categoryProducts, searchTerm]);

  const handleAddToCart = (product) => {
    addCartItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      categoryName: product.category_name,
      quantity: 1,
    });
    alert(`Đã thêm \"${product.name}\" vào giỏ hàng.`);
  };

  const handlePreviewProduct = (product) => {
    if (!getProductImageUrl(product.image_url)) {
      return;
    }
    setPreviewProduct(product);
  };

  return (
    <div style={styles.page}>
      <CustomerHeader />
      <section style={styles.hero}>
        <div style={styles.heroCard}>
          <h1 style={styles.heroTitle}>{category?.name || 'Chi tiết đồ uống'}</h1>
          <p style={styles.heroText}>
            {category?.description || 'Danh mục này đang hiển thị các sản phẩm đồ uống có thể thêm trực tiếp vào giỏ hàng.'}
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.searchWrap}>
          <div>
            <label style={styles.searchLabel}>Tìm kiếm sản phẩm theo tên</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ví dụ: bạc xỉu, trà đào..."
              style={styles.searchInput}
            />
          </div>
          <div style={styles.resultHint}>
            Đang hiển thị {filteredProducts.length}/{categoryProducts.length} sản phẩm
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>Không tìm thấy sản phẩm phù hợp với từ khóa bạn nhập.</div>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
            <article key={product.id} style={styles.card}>
              <button type="button" style={styles.visual} onClick={() => handlePreviewProduct(product)}>
                {getProductImageUrl(product.image_url) && (
                  <>
                    <img src={getProductImageUrl(product.image_url)} alt={product.name} style={styles.visualImage} />
                    <div style={styles.visualOverlay} />
                  </>
                )}
                <div style={styles.visualLabel}>{product.category_name || 'K-CAFE'}</div>
              </button>
              <div style={styles.body}>
                <h2 style={styles.title}>{product.name}</h2>
                <p style={styles.text}>{product.description || 'Sản phẩm hiện đang mở bán trong danh mục này.'}</p>
                <div style={styles.priceRow}>
                  <div style={styles.price}>{Number(product.price || 0).toLocaleString()}đ</div>
                  <button type="button" onClick={() => handleAddToCart(product)} style={styles.button}>Thêm vào giỏ</button>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}
      </section>

      {previewProduct && (
        <div style={styles.modalOverlay} onClick={() => setPreviewProduct(null)}>
          <div style={styles.modalCard} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{previewProduct.name}</h3>
              <button type="button" style={styles.modalClose} onClick={() => setPreviewProduct(null)}>
                x
              </button>
            </div>
            <div style={styles.modalBody}>
              <img
                src={getProductImageUrl(previewProduct.image_url)}
                alt={previewProduct.name}
                style={styles.modalImage}
              />
              <p style={styles.modalHint}>
                {previewProduct.description || 'Hình ảnh sản phẩm đang được hiển thị ở kích thước lớn để người dùng xem rõ hơn.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCategoryProductsPage;
