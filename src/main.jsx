import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import SignupSelection from "./pages/SignupSelection";
import Signup from "./pages/admin/Signup";
import CustomerSignup from "./pages/customer/CustomerSignup";
import SellerSignup from "./pages/seller/SellerSignup";
import TailorSignup from "./pages/tailor/TailorSignup";
import AdminApp from "./pages/admin/AdminApp";
import SellerDashboard from "./pages/seller/SellerDashboard";
import CustomerLandingPage from "./pages/CustomerLandingPage";
import { GOOGLE_CLIENT_ID } from "./config/googleOAuth";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<SignupSelection />} />
          <Route path="/admin/signup" element={<Signup />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/seller/signup" element={<SellerSignup />} />
          <Route path="/tailor/signup" element={<TailorSignup />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/dashboard/customer" element={<CustomerLandingPage />} />
          <Route path="/customer/landing" element={<CustomerLandingPage />} />
          <Route path="/dashboard/seller" element={<SellerDashboard />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
