import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateIndianPhone = (phone) => {
    // Indian phone number validation: +91 followed by 10 digits or 10 digits starting with 6-9
    const phoneRegex = /^(\+91[\-\s]?)?[789]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push("Lowercase letter");

    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push("Uppercase letter");

    if (/[0-9]/.test(password)) strength += 1;
    else feedback.push("Number");

    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    else feedback.push("Special character");

    if (strength <= 2)
      return {
        level: "Poor",
        color: "text-red-500",
        bgColor: "bg-red-50",
        feedback,
      };
    if (strength <= 3)
      return {
        level: "Medium",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        feedback,
      };
    return {
      level: "Strong",
      color: "text-green-600",
      bgColor: "bg-green-50",
      feedback,
    };
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "*Required";
        if (value.trim().length < 2)
          return "First name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim()))
          return "First name can only contain letters and spaces";
        return "";

      case "lastName":
        if (!value.trim()) return "*Required";
        if (value.trim().length < 2)
          return "Last name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim()))
          return "Last name can only contain letters and spaces";
        return "";

      case "email":
        if (!value.trim()) return "*Required";
        if (!validateEmail(value.trim()))
          return "Please enter a valid email address";
        return "";

      case "phone":
        if (!value.trim()) return "*Required";
        if (!validateIndianPhone(value.trim()))
          return "Please enter a valid Indian phone number (10 digits starting with 6-9)";
        return "";

      case "password":
        if (!value) return "*Required";
        if (value.length < 8)
          return "Password must be at least 8 characters long";
        if (passwordStrength.level === "Poor")
          return "Password is too weak. Please include uppercase, lowercase, numbers, and special characters";
        return "";

      case "confirmPassword":
        if (!value) return "*Required";
        if (formData.password !== value) return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Block numbers in name fields
    if ((name === "firstName" || name === "lastName") && /\d/.test(value)) {
      return;
    }

    // Block non-numbers in phone field (except +, -, and spaces)
    if (name === "phone" && !/^[\d\s\+\-]+$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation on keyup
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Check password strength in real-time
    if (name === "password") {
      if (value.length > 0) {
        const strength = checkPasswordStrength(value);
        setPasswordStrength(strength);
      } else {
        setPasswordStrength("");
      }
    }

    // Validate confirm password when password changes
    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3000/api/customers/register", {
        firstname: formData.firstName,
        lastname: formData.lastName,  
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
  
      alert("Signup successful!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setPasswordStrength("");
  
      navigate("/customer/dashboard");
  
    } catch (error) {
      console.error("Signup error:", error.response?.data?.message || error.message);
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <span className="text-3xl text-white font-bold">C</span>
          </div>
          <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-1">
            Customer Signup
          </h2>
          <p className="text-gray-600 text-sm text-center">
            Join SewNova as a customer
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                name="firstName"
                className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-200"
                }`}
                value={formData.firstName}
                onChange={handleChange}
                onKeyUp={handleChange}
                required
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="lastName"
                className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-200"
                }`}
                value={formData.lastName}
                onChange={handleChange}
                onKeyUp={handleChange}
                required
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <input
            type="email"
            name="email"
            className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500 ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
            value={formData.email}
            onChange={handleChange}
            onKeyUp={handleChange}
            required
            placeholder="Email Address"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          <input
            type="tel"
            name="phone"
            className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500 ${
              errors.phone ? "border-red-500" : "border-gray-200"
            }`}
            value={formData.phone}
            onChange={handleChange}
            onKeyUp={handleChange}
            required
            placeholder="Phone Number (e.g., 9876543210)"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`w-full px-4 py-3 pr-12 rounded-lg border-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500 ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
              value={formData.password}
              onChange={handleChange}
              onKeyUp={handleChange}
              required
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          {formData.password && passwordStrength && (
            <div
              className={`p-2 rounded-lg text-xs ${passwordStrength.bgColor}`}
            >
              <div className={`font-medium ${passwordStrength.color}`}>
                Password Strength: {passwordStrength.level}
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-gray-600 mt-1">
                  Add: {passwordStrength.feedback.join(", ")}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className={`w-full px-4 py-3 pr-12 rounded-lg border-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyUp={handleChange}
              required
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create Customer Account"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <button className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center hover:bg-gray-50 shadow-lg text-sm border border-gray-200">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>

        <div className="flex justify-center mt-4 text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 transition-colors ml-1 font-medium"
          >
            Sign in
          </Link>
        </div>
        <div className="flex justify-center mt-2 text-xs text-gray-500">
          <Link
            to="/seller/signup"
            className="hover:text-green-600 transition-colors mr-3"
          >
            Seller Signup
          </Link>
          <span>|</span>
          <Link
            to="/tailor/signup"
            className="hover:text-orange-600 transition-colors ml-3"
          >
            Tailor Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerSignup;
