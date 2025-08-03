import React from "react";
import SellerOrdersTable from "../../components/seller/SellerOrdersTable";
import SellerStatsWidget from "../../components/seller/SellerStatsWidget";
import SellerProfileCard from "../../components/seller/SellerProfileCard";
import SellerProductsTable from "../../components/seller/SellerProductsTable";

const buttonClass =
  "bg-gradient-to-r from-cream to-beige text-black border-2 border-beige px-8 py-4 rounded-2xl font-semibold shadow-lg hover:from-beige hover:to-cream hover:text-black transition-transform text-lg";
const cardClass =
  "bg-gradient-to-b from-beige via-cream to-beige rounded-2xl p-8 flex flex-col items-center shadow-lg border border-beige";

const SellerDashboard = () => (
  <div className="min-h-screen flex flex-col font-body bg-beige">
    <section className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-br from-beige via-cream to-beige shadow-md">
      <h1 className="text-black font-heading text-4xl md:text-6xl font-extrabold mb-6 mt-10 drop-shadow">Seller Dashboard</h1>
      <p className="text-black font-body text-xl md:text-2xl mb-8 max-w-2xl font-light">Welcome, Fabric Seller! Manage your products, view orders, and track performance here.</p>
      <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center">
        <button className={buttonClass}>Add New Product</button>
        <button className={buttonClass}>View Orders</button>
      </div>
    </section>
    <section className="py-12 px-4 bg-gradient-to-br from-beige via-cream to-beige">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <SellerProfileCard />
        <SellerStatsWidget />
        <SellerOrdersTable />
        <SellerProductsTable />
      </div>
    </section>
  </div>
);

export default SellerDashboard; 