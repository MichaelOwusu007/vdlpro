import { useState } from "react";
import { Link } from "react-router-dom";
import { SiApple } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect with backend API
    console.log("Signup Data:", form);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="md:text-3xl text-lg font-semibold my-4">
            Welcome! Please sign up to continue
          </h1>
          <p className="text-[16px] font-sans my-4">
            By signing up, you will gain access to exclusive content, and be the
            first to hear about exciting news and updates.
          </p>

          {/* Create Account with arc underline */}
          <div className="relative inline-block mb-8">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <svg
              className="absolute left-0 -bottom-3 w-full h-4 text-green-500"
              viewBox="0 0 100 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 5 Q50 -5 100 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-8 mb-6">
            <button className="flex items-center gap-2 border px-6 py-2 rounded-lg hover:bg-gray-100">
              <FcGoogle className="text-xl font-semibold" />
              Sign in with Google
            </button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
              <SiApple className="text-black text-xl" />
              Sign in with Apple
            </button>
          </div>

          <div className="flex items-center gap-2 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* First & Last Name side by side */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="flex-1 rounded-lg border px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="flex-1 rounded-lg border px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Password & Confirm Password side by side */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="flex-1 rounded-lg border px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="flex-1 rounded-lg border px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className="mt-1"
                required
              />
              <p>
                By signing up you agree to{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/policies" className="text-blue-600 hover:underline">
                  Policies
                </Link>{" "}
                of VDL Fulfilment.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black text-white py-3 font-semibold hover:bg-gray-800 transition"
            >
              Sign Up →
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="flex w-full md:w-1/2 bg-gray-50 items-center justify-center p-6">
        <img
          src="/images/sign-up-img.webp"
          alt="Signup Preview"
          className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
