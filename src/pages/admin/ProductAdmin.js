import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout'; 

const ProductAdmin = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Arabica bag', category: 'Cà phê hạt', price: 150000, stock: 10, status: 'Active' },
    { id: 2, name: 'Robusta', category: 'Cà phê bột', price: 250000, stock: 15, status: 'Active' },
  ]);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0f5132', margin: 0 }}>Quản lý sản phẩm</h2>
        <button style={{ backgroundColor: '#0f5132', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Thêm sản phẩm mới
        </button>
      </div>

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#e9ecef', color: '#333' }}>
            <tr>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Tên sản phẩm</th>
              <th style={{ padding: '15px' }}>Giá</th>
              <th style={{ padding: '15px' }}>Tồn kho</th>
              <th style={{ padding: '15px' }}>Trạng thái</th>
            </tr> 
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>#{item.id}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '15px' }}>{item.price.toLocaleString()}đ</td>
                <td style={{ padding: '15px' }}>{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ProductAdmin;