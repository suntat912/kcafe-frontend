import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader';
import { API_BASE_URL } from '../../utils/userSession';

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
    background: 'linear-gradient(135deg, rgba(143,46,38,0.96) 0%, rgba(107,18,24,0.96) 100%)',
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
    color: 'rgba(255,247,239,0.86)',
  },
  section: {
    padding: '0 48px 40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '22px',
  },
  card: {
    backgroundColor: '#fffaf6',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(143,46,38,0.10)',
    boxShadow: '0 16px 32px rgba(107,18,24,0.08)',
  },
  cardVisual: {
    minHeight: '180px',
    padding: '22px',
    display: 'flex',
    alignItems: 'end',
    background: 'linear-gradient(135deg, rgba(198,155,96,0.95) 0%, rgba(143,46,38,0.82) 100%)',
    color: '#fffaf6',
    fontWeight: 'bold',
    fontSize: '28px',
    textTransform: 'uppercase',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  body: {
    padding: '22px',
  },
  title: {
    margin: 0,
    color: '#6b1218',
    fontSize: '28px',
  },
  text: {
    margin: '12px 0 0',
    color: '#7b5a50',
    lineHeight: 1.8,
    minHeight: '92px',
  },
  button: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '18px',
    padding: '12px 18px',
    borderRadius: '14px',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
};

const CustomerDrinksPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

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
        alert(error.response?.data?.message || 'Không tải được dữ liệu đồ uống!');
      }
    };

    fetchData();
  }, []);

  const categoriesWithCounts = useMemo(() => categories.map((category) => ({
    ...category,
    productCount: products.filter((product) => String(product.category_id) === String(category.id)).length,
  })), [categories, products]);

  return (
    <div style={styles.page}>
      <CustomerHeader />
      <section style={styles.hero}>
        <div style={styles.heroCard}>
          <h1 style={styles.heroTitle}>Đồ uống</h1>
          <p style={styles.heroText}>
            Khám phá từng nhóm đồ uống theo danh mục. Mỗi danh mục sẽ hiển thị mô tả ngắn và số lượng món hiện có, sau đó bạn có thể bấm xem chi tiết để vào danh sách sản phẩm cụ thể.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.grid}>
          {categoriesWithCounts.map((category) => (
            <article key={category.id} style={styles.card}>
              <div style={styles.cardVisual}>{category.name}</div>
              <div style={styles.body}>
                <h2 style={styles.title}>{category.name}</h2>
                <p style={styles.text}>
                  {category.description || 'Danh mục đồ uống dành cho khách hàng đang được hiển thị trên hệ thống.'}
                  <br />
                  Hiện có: {category.productCount} sản phẩm.
                </p>
                <Link to={`/customer/drinks/${category.id}`} style={styles.button}>Xem chi tiết</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerDrinksPage;
