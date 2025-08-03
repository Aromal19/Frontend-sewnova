import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // Dummy check: in real app, use context or proper auth
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default AdminRoute; 