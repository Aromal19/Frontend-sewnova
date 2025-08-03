import React from "react";

const SellerStatsWidget = () => (
  <div className="p-6 bg-white rounded-xl shadow flex flex-col items-center">
    <h3 className="text-lg font-bold mb-2">Sales Overview</h3>
    <div className="flex gap-8 mt-4">
      <div className="text-center">
        <div className="text-2xl font-bold">$2,500</div>
        <div className="text-xs text-gray-500">Total Sales</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">15</div>
        <div className="text-xs text-gray-500">Orders</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">4.8</div>
        <div className="text-xs text-gray-500">Rating</div>
      </div>
    </div>
  </div>
);

export default SellerStatsWidget; 