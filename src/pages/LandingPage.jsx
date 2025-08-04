import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeaderImage from "../assets/Header.png";

const stats = [
  { number: "10K+", label: "Happy Customers" },
  { number: "500+", label: "Expert Tailors" },
  { number: "1000+", label: "Premium Fabrics" },
  { number: "24/7", label: "Support" },
];

const features = [
  {
    title: "Custom Tailoring",
    description: "Get outfits tailored to your unique style and measurements with our expert tailors.",
    icon: "🧵",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Premium Fabrics",
    description: "Choose from a curated selection of high-quality fabrics sourced globally.",
    icon: "🪡",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Fast Delivery",
    description: "Enjoy quick turnaround times and reliable doorstep delivery for every order.",
    icon: "🚚",
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Sustainable Fashion",
    description: "We prioritize eco-friendly practices and materials for a greener tomorrow.",
    icon: "🌱",
    color: "from-green-500 to-emerald-600",
  },
];

const testimonials = [
  {
    name: "Ava Patel",
    role: "Fashion Designer",
    quote: "Sew Nova transformed my wardrobe! The fit and quality are unmatched. I've never felt more confident in my clothes.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    name: "Liam Chen",
    role: "Business Executive",
    quote: "I love the sustainable options and the fast delivery. The attention to detail is incredible. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Sophia Garcia",
    role: "Entrepreneur",
    quote: "The custom tailoring service is a game changer. I feel so confident in my new clothes! Worth every penny.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

const tailors = [
  {
    name: "James Smith",
    location: "New Delhi",
    rating: 4.8,
    experience: "15 years",
    speciality: "Formal Wear",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Ananya Rao",
    location: "Mumbai",
    rating: 4.9,
    experience: "12 years",
    speciality: "Bridal Wear",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Farbeic Ali",
    location: "Chennai",
    rating: 4.7,
    experience: "18 years",
    speciality: "Casual Wear",
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

const renderStars = (rating) => {
  return [...Array(5)].map((_, index) => (
    <span key={index} className={index < rating ? "text-amber-400" : "text-gray-300"}>
      ★
    </span>
  ));
};

const LandingPage = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Navbar */}
      <Navbar currentPage="home" />

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 bg-amber-400 text-blue-900 rounded-full text-sm font-semibold mb-4">
                    ✨ Premium Custom Tailoring Platform
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                  Craft Your Perfect
                  <br />
                  <span className="text-white">Style Story</span>
                </h1>
                
                <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience the future of fashion with expert tailors, premium fabrics, and sustainable choices. 
                  Your style, your way.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Link 
                    to="/customer/signup" 
                    className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Start Your Journey
                  </Link>
                  <Link 
                    to="/explore" 
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
                  >
                    Explore Services
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto lg:mx-0">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.number}</div>
                      <div className="text-gray-300 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Header Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <img 
                    src={HeaderImage} 
                    alt="SewNova Header" 
                    className="w-full max-w-lg h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                  />
                  {/* Optional overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SewNova</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine traditional craftsmanship with modern technology to deliver exceptional results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to get your perfect custom outfit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Choose Your Style", desc: "Browse our catalog or upload your design inspiration" },
                { step: "02", title: "Customize & Order", desc: "Select fabrics, provide measurements, and place your order" },
                { step: "03", title: "Expert Tailoring", desc: "Our skilled tailors craft your outfit to perfection" },
                { step: "04", title: "Fast Delivery", desc: "Receive your custom outfit at your doorstep, ready to wear" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tailors Section */}
        <section className="py-20 px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meet Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Expert Tailors</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Skilled artisans with years of experience in creating perfect fits
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {tailors.map((tailor, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <img
                      src={tailor.image}
                      alt={tailor.name}
                      className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-lg"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">{tailor.name}</h3>
                      <p className="text-gray-600">{tailor.location}</p>
                      <p className="text-sm text-gray-500">{tailor.speciality}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-6">
                    <div className="flex mr-2">{renderStars(tailor.rating)}</div>
                    <span className="text-gray-700 font-semibold">{tailor.rating}</span>
                    <span className="text-gray-500 ml-2">({tailor.experience})</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                    Book Consultation
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link 
                to="/tailor/signup" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join as a Tailor
              </Link>
            </div>
          </div>
        </section>

        {/* Fabric Vendors Section */}
        <section className="py-20 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Premium <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Fabric Vendors</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Curated selection of the finest fabrics from around the world
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {fabricVendors.map((vendor, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🪡</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                      <p className="text-gray-600">{vendor.location}</p>
                      <p className="text-sm text-gray-500">{vendor.speciality}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-6">
                    <div className="flex mr-2">{renderStars(vendor.rating)}</div>
                    <span className="text-gray-700 font-semibold">{vendor.rating}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300">
                    Browse Fabrics
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link 
                to="/seller/signup" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join as a Vendor
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Our <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Customers Say</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real stories from satisfied customers who transformed their style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex mb-6">{renderStars(testimonial.rating)}</div>
                  <blockquote className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full border-2 border-amber-400 shadow-lg" 
                    />
                    <div className="ml-4">
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-8 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Style</span>?
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have discovered the perfect fit with SewNova
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/customer/signup" 
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Today
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stay in the <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Loop</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Get the latest updates, exclusive offers, and style tips from SewNova
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-amber-400 text-gray-900"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-blue-900 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-blue-900 font-bold">S</span>
                  </div>
                  <span className="text-xl font-bold ml-2">SewNova</span>
                </div>
                <p className="text-gray-400">
                  Your premium custom tailoring platform with expert tailors and world-class fabrics.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4">Services</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Custom Tailoring</li>
                  <li>Premium Fabrics</li>
                  <li>Expert Consultation</li>
                  <li>Fast Delivery</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Our Tailors</li>
                  <li>Fabric Vendors</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>info@sewnova.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>123 Fashion Ave</li>
                  <li>New York, NY 10001</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} SewNova. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 