import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import HomePage          from './pages/HomePage'
import ProductsPage      from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage          from './pages/CartPage'
import CheckoutPage      from './pages/CheckoutPage'
import LoginPage         from './pages/LoginPage'
import AdminDashboard    from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<HomePage />}          />
        <Route path="/products"   element={<ProductsPage />}      />
        <Route path="/product/:id"element={<ProductDetailPage />} />
        <Route path="/cart"       element={<CartPage />}          />
        <Route path="/checkout"   element={<CheckoutPage />}      />
        <Route path="/login"      element={<LoginPage />}         />
        <Route path="/admin"      element={<AdminDashboard />}    />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
