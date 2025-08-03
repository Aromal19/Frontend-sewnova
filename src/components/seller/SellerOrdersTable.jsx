import React from "react";

const SellerOrdersTable = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-xl shadow">
      <thead>
        <tr>
          <th className="px-4 py-2">Order ID</th>
          <th className="px-4 py-2">Customer</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">#54321</td>
          <td className="border px-4 py-2">John Doe</td>
          <td className="border px-4 py-2">2024-06-01</td>
          <td className="border px-4 py-2">Pending</td>
          <td className="border px-4 py-2">$200</td>
        </tr>
        <tr>
          <td className="border px-4 py-2">#54322</td>
          <td className="border px-4 py-2">Jane Smith</td>
          <td className="border px-4 py-2">2024-06-02</td>
          <td className="border px-4 py-2">Completed</td>
          <td className="border px-4 py-2">$150</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default SellerOrdersTable; 