import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginRedPage from './pages/LoginRedPage';
import CustomerProfilePage from './pages/client/CustomerProfilePage';
import CustomerPaymentPage from './pages/client/CustomerPaymentPage';
import CustomerOrderHistoryPage from './pages/client/CustomerOrderHistoryPage';
import AdminProfileRed from './pages/admin/AdminProfileRed';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductAdminRed from './pages/admin/ProductAdminRed';
import CategoryAdminRed from './pages/admin/CategoryAdminRed';
import OrderAdminRed from './pages/admin/OrderAdminRed';
import AccountsAdminRed from './pages/admin/AccountsAdminRed';
import HomeRedPage from './pages/HomeRedPage';
import CustomerHomePage from './pages/client/CustomerHomePage';
import CustomerCartPage from './pages/client/CustomerCartPage';
import CustomerDrinksPage from './pages/client/CustomerDrinksPage';
import CustomerCategoryProductsPage from './pages/client/CustomerCategoryProductsPage';
import CustomerServicesPage from './pages/client/CustomerServicesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedPage />} />
        <Route path="/login" element={<LoginRedPage />} />
        <Route path="/customer/home" element={<ProtectedRoute allowedRoles={['customer']}><CustomerHomePage /></ProtectedRoute>} />
        <Route path="/customer/drinks" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDrinksPage /></ProtectedRoute>} />
        <Route path="/customer/drinks/:categoryId" element={<ProtectedRoute allowedRoles={['customer']}><CustomerCategoryProductsPage /></ProtectedRoute>} />
        <Route path="/customer/services" element={<ProtectedRoute allowedRoles={['customer']}><CustomerServicesPage /></ProtectedRoute>} />
        <Route path="/customer/cart" element={<ProtectedRoute allowedRoles={['customer']}><CustomerCartPage /></ProtectedRoute>} />
        <Route path="/customer/payment/:orderId" element={<ProtectedRoute allowedRoles={['customer']}><CustomerPaymentPage /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={['customer']}><CustomerOrderHistoryPage /></ProtectedRoute>} />
        <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={['customer']}><CustomerProfilePage /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfileRed /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><ProductAdminRed /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['admin']}><CategoryAdminRed /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><OrderAdminRed /></ProtectedRoute>} />
        <Route path="/admin/accounts" element={<ProtectedRoute allowedRoles={['admin']}><AccountsAdminRed /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
