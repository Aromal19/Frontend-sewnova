import React from "react";
import { Link } from "react-router-dom";

const SignupSelection = () => {
  const signupOptions = [
    {
      title: "Customer",
      description: "Order custom clothing and browse fabrics",
      icon: "👤",
      color: "blue",
      link: "/customer/signup",
      features: ["Browse fabrics", "Order custom clothing", "Track orders", "Manage profile"]
    },
    {
      title: "Fabric Seller",
      description: "Sell your fabrics to customers and tailors",
      icon: "🏪",
      color: "green",
      link: "/seller/signup",
      features: ["List fabrics", "Manage inventory", "Track sales", "Business analytics"]
    },
    {
      title: "Tailor",
      description: "Offer tailoring services to customers",
      icon: "✂️",
      color: "orange",
      link: "/tailor/signup",
      features: ["Accept orders", "Manage portfolio", "Set rates", "Track earnings"]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
      green: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      orange: "from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
    };
    return colorMap[color] || colorMap.blue;
  };

  const getBorderColor = (color) => {
    const colorMap = {
      blue: "border-blue-200 hover:border-blue-300",
      green: "border-green-200 hover:border-green-300",
      orange: "border-orange-200 hover:border-orange-300"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Account Type</h1>
          <p className="text-gray-600">Select the type of account that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {signupOptions.map((option, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg border-2 ${getBorderColor(option.color)} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{option.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">What you can do:</h4>
                <ul className="space-y-1">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-xs text-gray-600 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={option.link}
                className={`w-full py-3 bg-gradient-to-r ${getColorClasses(option.color)} text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl text-sm`}
              >
                Create {option.title} Account
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupSelection; 