import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayoutRed from '../../components/AdminLayoutRed';
import { API_BASE_URL } from '../../utils/userSession';

const chartColors = ['#0f766e', '#b45309', '#8f2e26', '#4338ca', '#15803d', '#c026d3'];

const styles = {
  header: { marginBottom: '24px' },
  title: { margin: 0, color: '#163b2f', fontSize: '34px' },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '18px',
    marginBottom: '24px',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    border: '1px solid #dfe6ed',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
    padding: '22px',
  },
  metricLabel: {
    color: '#5f7184',
    fontSize: '13px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  metricValue: {
    marginTop: '10px',
    color: '#123f32',
    fontSize: '32px',
    fontWeight: 'bold',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    fontWeight: 'bold',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: '20px',
    alignItems: 'start',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #dfe6ed',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
    padding: '22px',
  },
  panelTitle: { margin: '0 0 16px', color: '#123f32', fontSize: '24px' },
  list: { display: 'grid', gap: '12px' },
  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '18px',
    backgroundColor: '#f7fafc',
    border: '1px solid #e5edf4',
  },
  productName: { margin: 0, color: '#123f32', fontSize: '18px' },
  productMeta: { margin: '6px 0 0', color: '#6b7280' },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #dfe6ed',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
    padding: '22px',
  },
  chartTitle: { margin: '0 0 18px', color: '#123f32', fontSize: '22px' },
  chartWrap: { display: 'grid', gridTemplateColumns: '180px 1fr', gap: '18px', alignItems: 'center' },
  donut: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    position: 'relative',
  },
  donutHole: {
    position: 'absolute',
    inset: '28px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    color: '#123f32',
    fontWeight: 'bold',
    fontSize: '18px',
    lineHeight: 1.4,
  },
  legend: { display: 'grid', gap: '10px' },
  legendRow: { display: 'grid', gridTemplateColumns: '14px 1fr auto', gap: '10px', alignItems: 'center' },
  colorDot: { width: '14px', height: '14px', borderRadius: '50%' },
  legendLabel: { color: '#475569' },
  legendValue: { color: '#123f32', fontWeight: 'bold' },
  empty: { color: '#6b7280', lineHeight: 1.7 },
};

const buildConic = (items) => {
  const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!total) {
    return 'conic-gradient(#e2e8f0 0deg 360deg)';
  }

  let current = 0;
  const segments = items.map((item, index) => {
    const slice = (Number(item.value || 0) / total) * 360;
    const start = current;
    const end = current + slice;
    current = end;
    return `${chartColors[index % chartColors.length]} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${segments.join(', ')})`;
};

const PieChartCard = ({ title, items, currency = false }) => {
  const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <section style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      {items.length ? (
        <div style={styles.chartWrap}>
          <div style={{ ...styles.donut, background: buildConic(items) }}>
            <div style={styles.donutHole}>
              <div>
                <div>Tổng</div>
                <div>{currency ? `${total.toLocaleString()}đ` : total.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={styles.legend}>
            {items.map((item, index) => (
              <div key={`${title}-${item.label}-${index}`} style={styles.legendRow}>
                <div style={{ ...styles.colorDot, backgroundColor: chartColors[index % chartColors.length] }} />
                <div style={styles.legendLabel}>{item.label}</div>
                <div style={styles.legendValue}>
                  {currency ? `${Number(item.value || 0).toLocaleString()}đ` : Number(item.value || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.empty}>Chưa có dữ liệu.</div>
      )}
    </section>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState('day');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`);
        setStats(response.data.stats || null);
      } catch (error) {
        alert(error.response?.data?.message || 'Không tải được số liệu báo cáo!');
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/revenue-report`, {
          params: { period },
        });
        setReport(response.data.report || null);
      } catch (error) {
        alert(error.response?.data?.message || 'Không tải được báo cáo doanh thu!');
      }
    };

    fetchReport();
  }, [period]);

  const orderRangeChart = useMemo(() => {
    if (!report?.summary) {
      return [];
    }
    return [
      { label: 'Đơn từ 100k', value: report.summary.orders_over_100k || 0 },
      { label: 'Đơn từ 200k', value: report.summary.orders_over_200k || 0 },
      { label: 'Đơn từ 1 triệu', value: report.summary.orders_over_1m || 0 },
    ];
  }, [report]);

  return (
    <AdminLayoutRed title="Báo cáo doanh thu">
      <div style={styles.header}>
        <h2 style={styles.title}>Báo cáo doanh thu</h2>
      </div>

      <div style={styles.metrics}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Tổng đơn hàng</div>
          <div style={styles.metricValue}>{stats?.total_orders || 0}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Đã thanh toán</div>
          <div style={styles.metricValue}>{stats?.paid_orders || 0}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Đang xử lý</div>
          <div style={styles.metricValue}>{stats?.processing_orders || 0}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Doanh thu</div>
          <div style={styles.metricValue}>{Number(stats?.total_revenue || 0).toLocaleString()}đ</div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <h3 style={{ ...styles.panelTitle, margin: 0 }}>Sản phẩm bán chạy theo thời gian</h3>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} style={styles.select}>
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
      </div>

      <div style={styles.layout}>
        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Sản phẩm bán chạy</h3>
          {report?.top_products?.length ? (
            <div style={styles.list}>
              {report.top_products.map((product, index) => (
                <div key={product.id || `${product.name}-${index}`} style={styles.productRow}>
                  <div>
                    <h4 style={styles.productName}>{index + 1}. {product.name}</h4>
                    <p style={styles.productMeta}>Đã bán: {product.sold_quantity} sản phẩm</p>
                  </div>
                  <strong style={{ color: '#123f32' }}>{Number(product.revenue || 0).toLocaleString()}đ</strong>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>Chưa có dữ liệu.</div>
          )}
        </section>

        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>Mốc đơn hàng</h3>
          <div style={styles.list}>
            <div style={styles.productRow}><span>Đơn từ 100k</span><strong>{report?.summary?.orders_over_100k || 0}</strong></div>
            <div style={styles.productRow}><span>Đơn từ 200k</span><strong>{report?.summary?.orders_over_200k || 0}</strong></div>
            <div style={styles.productRow}><span>Đơn từ 1 triệu</span><strong>{report?.summary?.orders_over_1m || 0}</strong></div>
            <div style={styles.productRow}><span>Tổng doanh thu</span><strong>{Number(report?.summary?.total_revenue_all || 0).toLocaleString()}đ</strong></div>
          </div>
        </section>
      </div>

      <div style={styles.chartGrid}>
        <PieChartCard title="Doanh thu theo danh mục" items={report?.category_revenue || []} currency />
        <PieChartCard title="Doanh thu theo sản phẩm" items={report?.product_revenue || []} currency />
        <PieChartCard title="Khách hàng mới đăng ký" items={report?.customer_split || []} />
        <PieChartCard title="Đơn hàng theo mốc giá" items={orderRangeChart} />
      </div>
    </AdminLayoutRed>
  );
};

export default AdminDashboardPage;
