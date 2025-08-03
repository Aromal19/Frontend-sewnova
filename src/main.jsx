import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import SignupSelection from "./pages/SignupSelection";
import Signup from "./pages/admin/Signup";
import CustomerSignup from "./pages/customer/CustomerSignup";
import SellerSignup from "./pages/seller/SellerSignup";
import TailorSignup from "./pages/tailor/TailorSignup";
import AdminApp from "./pages/admin/AdminApp";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupSelection />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/seller/signup" element={<SellerSignup />} />
        <Route path="/tailor/signup" element={<TailorSignup />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
