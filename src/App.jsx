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
import CustomerLandingPage from "./pages/CustomerLandingPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerMeasurements from "./pages/customer/CustomerMeasurements";
import CustomerAddresses from "./pages/customer/CustomerAddresses";
import CustomerBookings from "./pages/customer/CustomerBookings";
import AdminInsights from "./pages/admin/AdminInsights";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AddFabric from "./pages/seller/AddFabric";
import ActiveOrders from "./pages/tailor/ActiveOrders";
import EmailVerification from "./pages/EmailVerification";
import CustomerProfile from "./pages/customer/CustomerProfile";
import SellerProfile from "./pages/seller/SellerProfile";
import TailorProfile from "./pages/tailor/TailorProfile";
import Fabrics from "./pages/seller/Fabrics";
import Inventory from "./pages/seller/Inventory";
// New customer flow pages
import FabricBrowse from "./pages/customer/FabricBrowse";
import TailorBrowse from "./pages/customer/TailorBrowse";
import ProductDetail from "./pages/customer/ProductDetail";
import TailorDetail from "./pages/customer/TailorDetail";
import BookingFlow from "./pages/customer/BookingFlow";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import DesignPage from "./pages/DesignPage";
// Protected route component
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/verify-email" element={<EmailVerification />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        
        {/* Dashboard Routes - Protected */}
        <Route path="/customer/landing" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerLandingPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/customer" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerLandingPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/seller" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/tailor" element={
          <ProtectedRoute requiredRole="tailor">
            <TailorDashboard />
          </ProtectedRoute>
        } />
        
        {/* Customer Service Routes - Protected */}
        <Route path="/customer/dashboard" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/customer/measurements" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerMeasurements />
          </ProtectedRoute>
        } />
        <Route path="/customer/addresses" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerAddresses />
          </ProtectedRoute>
        } />
        <Route path="/customer/bookings" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerBookings />
          </ProtectedRoute>
        } />
        
        {/* Customer Flow Routes - Protected */}
        <Route path="/customer/fabrics" element={
          <ProtectedRoute requiredRole="customer">
            <FabricBrowse />
          </ProtectedRoute>
        } />
        <Route path="/customer/tailors" element={
          <ProtectedRoute requiredRole="customer">
            <TailorBrowse />
          </ProtectedRoute>
        } />
        <Route path="/customer/fabric/:id" element={
          <ProtectedRoute requiredRole="customer">
            <ProductDetail />
          </ProtectedRoute>
        } />
        <Route path="/customer/tailor/:id" element={
          <ProtectedRoute requiredRole="customer">
            <TailorDetail />
          </ProtectedRoute>
        } />
        <Route path="/customer/booking/create" element={
          <ProtectedRoute requiredRole="customer">
            <BookingFlow />
          </ProtectedRoute>
        } />
        <Route path="/customer/cart" element={
          <ProtectedRoute requiredRole="customer">
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/customer/checkout" element={
          <ProtectedRoute requiredRole="customer">
            <Checkout />
          </ProtectedRoute>
        } />
        
        {/* Design Selection Routes - Protected */}
        <Route path="/designs" element={
          <ProtectedRoute requiredRole="customer">
            <DesignPage />
          </ProtectedRoute>
        } />
        
        {/* Profile Routes - Protected */}
        <Route path="/customer/profile" element={
          <ProtectedRoute requiredRole="customer">
            <CustomerProfile />
          </ProtectedRoute>
        } />
        <Route path="/seller/profile" element={
          <ProtectedRoute requiredRole="seller">
            <SellerProfile />
          </ProtectedRoute>
        } />
        <Route path="/tailor/profile" element={
          <ProtectedRoute requiredRole="tailor">
            <TailorProfile />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/insights" element={
          <ProtectedRoute requiredRole="admin">
            <AdminInsights />
          </ProtectedRoute>
        } />
        
        {/* Seller Routes - Protected */}
        <Route path="/add-fabric" element={
          <ProtectedRoute requiredRole="seller">
            <AddFabric />
          </ProtectedRoute>
        } />
        <Route path="/fabrics" element={
          <ProtectedRoute requiredRole="seller">
            <Fabrics />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute requiredRole="seller">
            <Inventory />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/earnings" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/reviews" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Tailor Routes - Protected */}
        <Route path="/active-orders" element={
          <ProtectedRoute requiredRole="tailor">
            <ActiveOrders />
          </ProtectedRoute>
        } />
        <Route path="/completed-orders" element={
          <ProtectedRoute requiredRole="tailor">
            <TailorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/pending-orders" element={
          <ProtectedRoute requiredRole="tailor">
            <TailorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/workflow" element={
          <ProtectedRoute requiredRole="tailor">
            <TailorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute requiredRole="tailor">
            <TailorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute requiredRole="tailor">
            <TailorDashboard />
          </ProtectedRoute>
        } />
        
        {/* Legacy Routes */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
