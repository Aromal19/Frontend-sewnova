import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminRoute from "../../components/admin/AdminRoute";

const AdminApp = () => (
  <Routes>
    <Route
      path="dashboard"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
    <Route path="*" element={<Navigate to="/admin/dashboard" />} />
  </Routes>
);

export default AdminApp; 