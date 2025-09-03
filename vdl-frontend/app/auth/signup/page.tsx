"use client";
import { useState } from "react";
import Link from "next/link";
import { SiGoogle, SiApple } from "react-icons/si";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect with backend API
    console.log("Signup Data:", form);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-8 ">
            {/* First & Last Name side by side */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
            <Link href="/auth/login" className="text-blue-600 hover:underline">
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
