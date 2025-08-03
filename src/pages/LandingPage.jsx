import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const features = [
  {
    title: "Custom Tailoring",
    description: "Get outfits tailored to your unique style and measurements with our expert tailors.",
    icon: "🧵",
  },
  {
    title: "Premium Fabrics",
    description: "Choose from a curated selection of high-quality fabrics sourced globally.",
    icon: "🪡",
  },
  {
    title: "Fast Delivery",
    description: "Enjoy quick turnaround times and reliable doorstep delivery for every order.",
    icon: "🚚",
  },
  {
    title: "Sustainable Fashion",
    description: "We prioritize eco-friendly practices and materials for a greener tomorrow.",
    icon: "🌱",
  },
];

const customerFeatures = [
  {
    title: "Browse Premium Fabrics",
    description: "Explore thousands of high-quality fabrics from around the world",
    icon: "🪡",
    color: "from-blue-500 to-purple-600"
  },
  {
    title: "Custom Clothing Orders",
    description: "Order perfectly tailored clothing designed just for you",
    icon: "👔",
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Track Your Orders",
    description: "Real-time tracking from order to delivery",
    icon: "📦",
    color: "from-orange-500 to-amber-600"
  },
  {
    title: "Manage Your Profile",
    description: "Store measurements, preferences, and order history",
    icon: "👤",
    color: "from-pink-500 to-rose-600"
  },
  {
    title: "Expert Consultation",
    description: "Get advice from professional tailors and stylists",
    icon: "💬",
    color: "from-indigo-500 to-blue-600"
  },
  {
    title: "Secure Payments",
    description: "Multiple payment options with complete security",
    icon: "🔒",
    color: "from-teal-500 to-cyan-600"
  }
];

const testimonials = [
  {
    name: "Ava Patel",
    quote: "Sew Nova transformed my wardrobe! The fit and quality are unmatched.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Liam Chen",
    quote: "I love the sustainable options and the fast delivery. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sophia Garcia",
    quote: "The custom tailoring service is a game changer. I feel so confident in my new clothes!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const workflowSteps = [
  {
    title: "Choose Your Style",
    description: "Browse our catalog or upload your own design inspiration.",
    icon: "🎨",
  },
  {
    title: "Customize & Order",
    description: "Select fabrics, provide measurements, and place your order easily.",
    icon: "📝",
  },
  {
    title: "Expert Tailoring",
    description: "Our skilled tailors craft your outfit to perfection.",
    icon: "✂️",
  },
  {
    title: "Fast Delivery",
    description: "Receive your custom outfit at your doorstep, ready to wear!",
    icon: "📦",
  },
];

const tailors = [
  {
    name: "James Smith",
    location: "New Delhi",
    rating: 4.8,
    experience: "15 years",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Ananya Rao",
    location: "Mumbai",
    rating: 4.9,
    experience: "12 years",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Farbeic Ali",
    location: "Chennai",
    rating: 4.7,
    experience: "18 years",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const fabricVendors = [
  {
    name: "Premium Cotton Co.",
    location: "Ahmedabad",
    rating: 4.6,
    speciality: "Organic Cotton",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
  },
  {
    name: "Silk Paradise",
    location: "Varanasi",
    rating: 4.8,
    speciality: "Pure Silk",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
  },
  {
    name: "Eco Fabrics Ltd",
    location: "Bangalore",
    rating: 4.9,
    speciality: "Sustainable Materials",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
  },
];

const buttonClass =
  "bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:from-amber-200 hover:to-amber-300 transition-all duration-300 transform hover:scale-105 text-sm";

const cardClass =
  "bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 flex flex-col items-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105";

const LandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-['Inter',sans-serif]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="home" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
              Welcome to SewNova
            </h1>
            <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Your premium custom tailoring platform with expert tailors and world-class fabrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer/signup" className={buttonClass}>
                Get Started
              </Link>
              <Link to="/explore" className={buttonClass}>
                Explore More
              </Link>
            </div>
          </div>
        </section>

        {/* What Customers Can Do Section */}
        <section className="py-16 px-8 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">What You Can Do</h2>
              <p className="text-gray-600 text-lg">Discover all the amazing features available to our customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {customerFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md`}>
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4 text-sm">Ready to start your fashion journey?</p>
              <Link
                to="/customer/signup"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Sign Up as Customer
              </Link>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-16 px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className={cardClass}>
                  <div className="text-5xl mb-4 bg-gradient-to-r from-amber-300 to-amber-400 p-3 rounded-full">{step.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 text-center leading-relaxed text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-8 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Why Choose Sew Nova?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className={cardClass}>
                  <div className="text-5xl mb-4 bg-gradient-to-r from-amber-300 to-amber-400 p-3 rounded-full">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-700 text-center leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tailors Section */}
        <section id="tailors" className="py-16 px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Our Expert Tailors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {tailors.map((tailor, idx) => (
                <div key={idx} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={tailor.image}
                      alt={tailor.name}
                      className="w-16 h-16 rounded-full border-4 border-amber-400 shadow-lg"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{tailor.name}</h3>
                      <p className="text-gray-600 text-sm">{tailor.location}</p>
                      <p className="text-xs text-gray-500">{tailor.experience} experience</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-amber-500 text-xl">★</span>
                    <span className="ml-2 text-gray-700 text-sm font-semibold">{tailor.rating}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2 rounded-lg font-semibold hover:from-slate-800 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 text-sm">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/tailor/signup" className={buttonClass}>
                Register as a Tailor
              </Link>
            </div>
          </div>
        </section>

        {/* Fabric Vendors Section */}
        <section id="vendors" className="py-16 px-8 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Premium Fabric Vendors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {fabricVendors.map((vendor, idx) => (
                <div key={idx} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-300 to-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🪡</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{vendor.name}</h3>
                      <p className="text-gray-600 text-sm">{vendor.location}</p>
                      <p className="text-xs text-gray-500">{vendor.speciality}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-amber-500 text-xl">★</span>
                    <span className="ml-2 text-gray-700 text-sm font-semibold">{vendor.rating}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2 rounded-lg font-semibold hover:from-slate-800 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 text-sm">
                    View Fabrics
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/seller/signup" className={buttonClass}>
                Register as a Fabric Vendor
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div key={idx} className={cardClass}>
                  <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-4 border-amber-400 shadow-xl" />
                  <blockquote className="italic text-lg text-gray-700 mb-4 text-center leading-relaxed">"{t.quote}"</blockquote>
                  <span className="text-slate-900 font-bold text-base">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-8 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Ready to Redefine Your Style?
            </h2>
            <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Join Sew Nova today and experience the future of fashion. Whether you want custom tailoring, premium fabrics, or sustainable choices, we have it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer/signup" className={buttonClass}>Sign Up as Customer</Link>
              <Link to="/customer/dashboard" className={buttonClass}>Go to Customer Dashboard</Link>
              <Link to="/login" className={buttonClass}>Sign In</Link>
            </div>
          </div>
        </section>

        {/* Stay in the Loop Section */}
        <section id="subscribe" className="py-16 px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Stay in the Loop
            </h2>
            <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Get the latest updates, exclusive offers, and style tips from Sew Nova. Subscribe to our newsletter!
            </p>
            <form className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-4 items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-lg border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 bg-white text-gray-900 text-sm"
                required
              />
              <button
                type="submit"
                className={buttonClass}
              >
                Subscribe
              </button>
            </form>
            <div className="mt-10 max-w-3xl mx-auto text-center text-gray-600 text-sm">
              <p>
                <strong>Contact us:</strong> info@sewnova.com | +1 (555) 123-4567<br />
                123 Fashion Ave, New York, NY 10001
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-10 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-lg">&copy; {new Date().getFullYear()} SewNova. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 