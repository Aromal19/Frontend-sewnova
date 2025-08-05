import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import CustomerOrdersTable from "../../components/customer/CustomerOrdersTable";
import TrackingWidget from "../../components/customer/TrackingWidget";
import SellersList from "../../components/customer/SellersList";
import CustomerProfileCard from "../../components/customer/CustomerProfileCard";
import CustomerWishlist from "../../components/customer/CustomerWishlist";

const buttonClass =
  "bg-gradient-to-r from-cream to-beige text-black border-2 border-beige px-8 py-4 rounded-2xl font-semibold shadow-lg hover:from-beige hover:to-cream hover:text-black transition-transform text-lg";
const cardClass =
  "bg-gradient-to-b from-beige via-cream to-beige rounded-2xl p-8 flex flex-col items-center shadow-lg border border-beige";

const sections = [
  { key: "orders", label: "My Orders" },
  { key: "tracking", label: "Tracking" },
  { key: "sellers", label: "View Sellers" },
];

const SectionContent = ({ section }) => {
  switch (section) {
    case "orders":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CustomerOrdersTable />
          <CustomerWishlist />
        </div>
      );
    case "tracking":
      return <TrackingWidget />;
    case "sellers":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SellersList />
          <CustomerProfileCard />
        </div>
      );
    default:
      return null;
  }
};

const CustomerDashboard = () => {
  const [active, setActive] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* New Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="customer" 
      />
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${
        sidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <div className="p-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
              {sections.find((s) => s.key === active)?.label}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>
          
          <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px] border border-gray-100">
            <SectionContent section={active} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard; 