import React, { useState } from "react";
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
          <div className="text-xl">Welcome, Admin! Use the sidebar to manage the platform.</div>
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

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col min-h-screen border-r border-gray-700">
        <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">SewNova Admin</h2>
        <nav className="flex flex-col gap-2">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`text-left px-4 py-2 rounded transition font-medium text-gray-300 hover:text-white hover:bg-gray-700 ${active === s.key ? "bg-blue-700 text-white" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            window.location.href = "/admin/login";
          }}
          className="mt-auto py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 text-gray-100">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold capitalize">{sections.find((s) => s.key === active)?.label}</h1>
        </header>
        <div className="bg-gray-800 rounded-lg p-8 min-h-[300px] border border-gray-700">
          <SectionContent section={active} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 