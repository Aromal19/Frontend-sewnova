import React, { useState } from "react";
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
  return (
    <div className="min-h-screen flex font-body bg-beige">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-beige via-cream to-beige p-6 flex flex-col min-h-screen border-r border-beige">
        <h2 className="text-2xl font-bold text-black mb-8 text-center">SewNova Customer</h2>
        <nav className="flex flex-col gap-2">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`text-left px-4 py-2 rounded transition font-medium text-black hover:bg-beige/80 ${active === s.key ? "bg-beige font-bold" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("isCustomer");
            window.location.href = "/login";
          }}
          className="mt-auto py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 text-black">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold capitalize">{sections.find((s) => s.key === active)?.label}</h1>
        </header>
        <div className="bg-gradient-to-b from-beige via-cream to-beige rounded-lg p-8 min-h-[300px] border border-beige">
          <SectionContent section={active} />
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard; 