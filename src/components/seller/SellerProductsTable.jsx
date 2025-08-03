import React from "react";

const SellerProductsTable = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-xl shadow">
      <thead>
        <tr>
          <th className="px-4 py-2">Product</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Stock</th>
          <th className="px-4 py-2">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">Cotton Classic</td>
          <td className="border px-4 py-2">Cotton</td>
          <td className="border px-4 py-2">50</td>
          <td className="border px-4 py-2">$10</td>
        </tr>
        <tr>
          <td className="border px-4 py-2">Silk Shine</td>
          <td className="border px-4 py-2">Silk</td>
          <td className="border px-4 py-2">20</td>
          <td className="border px-4 py-2">$25</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default SellerProductsTable; 