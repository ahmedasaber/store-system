import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute.js';
import { AppLayout } from '../layouts/AppLayout.js';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import { CategoriesPage } from '../pages/CategoriesPage.js';
import { PlaceholderPage } from '../pages/PlaceholderPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { UnauthorizedPage } from '../pages/UnauthorizedPage.js';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<PlaceholderPage moduleName="Products" />} />
          <Route path="/inventory" element={<PlaceholderPage moduleName="Inventory" />} />
          <Route path="/sales" element={<PlaceholderPage moduleName="Sales" />} />
          <Route path="/purchases" element={<PlaceholderPage moduleName="Purchases" />} />
          <Route path="/reports" element={<PlaceholderPage moduleName="Reports" />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* Default Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
