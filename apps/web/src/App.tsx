import React, { useState } from 'react';
import { CartProvider } from './features/cart/context/CartContext';
import { StorefrontPage } from './pages/StorefrontPage';
import { AdminLoginPage } from './features/admin/AdminLoginPage';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';

export const App: React.FC = () => {
  const [view, setView] = useState<'storefront' | 'admin_login' | 'admin_dashboard'>('storefront');
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem('customry_admin_token')
  );
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('customry_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('customry_admin_token', token);
    localStorage.setItem('customry_admin_user', JSON.stringify(user));
    setView('admin_dashboard');
  };

  const handleLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('customry_admin_token');
    localStorage.removeItem('customry_admin_user');
    setView('storefront');
  };

  return (
    <CartProvider>
      {view === 'storefront' && (
        <StorefrontPage
          onOpenAdmin={() => {
            if (adminToken && adminUser) {
              setView('admin_dashboard');
            } else {
              setView('admin_login');
            }
          }}
        />
      )}

      {view === 'admin_login' && (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onReturnToStore={() => setView('storefront')}
        />
      )}

      {view === 'admin_dashboard' && adminToken && (
        <AdminDashboardPage
          token={adminToken}
          user={adminUser}
          onLogout={handleLogout}
          onReturnToStore={() => setView('storefront')}
        />
      )}
    </CartProvider>
  );
};

export default App;
