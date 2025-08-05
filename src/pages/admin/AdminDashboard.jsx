import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import AnalyticsWidgets from "../../components/admin/dashboard/AnalyticsWidgets";
import UsersTable from "../../components/admin/dashboard/UsersTable";
import TailorsTable from "../../components/admin/dashboard/TailorsTable";
import FabricSellersTable from "../../components/admin/dashboard/FabricSellersTable";
import OrdersTable from "../../components/admin/dashboard/OrdersTable";
import DeliveriesTable from "../../components/admin/dashboard/DeliveriesTable";
import WasteManagementTable from "../../components/admin/dashboard/WasteManagementTable";
import Settings from "../../components/admin/dashboard/Settings";

const sections = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "Users" },
  { key: "tailors", label: "Tailors" },
  { key: "fabricSellers", label: "Fabric Sellers" },
  { key: "orders", label: "Orders" },
  { key: "deliveries", label: "Deliveries" },
  { key: "waste", label: "Waste Management" },
  { key: "settings", label: "Settings" },
];

const SectionContent = ({ section }) => {
  switch (section) {
    case "dashboard":
      return (
        <>
          <AnalyticsWidgets />
          <div className="text-xl text-gray-300">Welcome, Admin! Use the sidebar to manage the platform.</div>
        </>
      );
    case "users":
      return <UsersTable />;
    case "tailors":
      return <TailorsTable />;
    case "fabricSellers":
      return <FabricSellersTable />;
    case "orders":
      return <OrdersTable />;
    case "deliveries":
      return <DeliveriesTable />;
    case "waste":
      return <WasteManagementTable />;
    case "settings":
      return <Settings />;
    default:
      return null;
  }
};

const AdminDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* New Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="admin" 
      />
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${
        sidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <div className="p-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-100 capitalize">
              {sections.find((s) => s.key === active)?.label}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 min-h-[600px] border border-gray-700">
            <SectionContent section={active} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 