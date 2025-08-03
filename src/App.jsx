import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

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
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
