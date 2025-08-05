import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SellerDashboard from "./pages/seller/SellerDashboard";
import TailorDashboard from "./pages/tailor/TailorDashboard";
import Login from "./pages/Login";
import SignupSelection from "./pages/SignupSelection";
import CustomerSignup from "./pages/customer/CustomerSignup";
import SellerSignup from "./pages/seller/SellerSignup";
import TailorSignup from "./pages/tailor/TailorSignup";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import AdminInsights from "./pages/admin/AdminInsights";
import AddFabric from "./pages/seller/AddFabric";
import ActiveOrders from "./pages/tailor/ActiveOrders";

const Orders = () => (
  <div className="p-8 text-gray-100">Your Orders (Customer View)</div>
);
const Profile = () => (
  <div className="p-8 text-gray-100">Your Profile (Customer View)</div>
);

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupSelection />} />
        <Route path="/signup/customer" element={<CustomerSignup />} />
        <Route path="/signup/seller" element={<SellerSignup />} />
        <Route path="/signup/tailor" element={<TailorSignup />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard />} />
        <Route path="/dashboard/tailor" element={<TailorDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/insights" element={<AdminInsights />} />
        
        {/* Seller Routes */}
        <Route path="/add-fabric" element={<AddFabric />} />
        <Route path="/fabrics" element={<SellerDashboard />} />
        <Route path="/inventory" element={<SellerDashboard />} />
        <Route path="/analytics" element={<SellerDashboard />} />
        <Route path="/earnings" element={<SellerDashboard />} />
        <Route path="/customers" element={<SellerDashboard />} />
        <Route path="/reviews" element={<SellerDashboard />} />
        
        {/* Tailor Routes */}
        <Route path="/active-orders" element={<ActiveOrders />} />
        <Route path="/completed-orders" element={<TailorDashboard />} />
        <Route path="/pending-orders" element={<TailorDashboard />} />
        <Route path="/workflow" element={<TailorDashboard />} />
        <Route path="/schedule" element={<TailorDashboard />} />
        <Route path="/appointments" element={<TailorDashboard />} />
        
        {/* Legacy Routes */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
