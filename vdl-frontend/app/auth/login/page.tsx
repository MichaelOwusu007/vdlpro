"use client";
import { useState } from "react";
import Link from "next/link";
import { SiGoogle, SiApple } from "react-icons/si";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect with backend API
    console.log("Login Data:", form);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
            <h1>Welcome back! please Sign in to continue</h1>
            <p>By signing up, you will gain access to exclusive content, and be the first to hear about exciting news and updates.</p>
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>

          {/* Social Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
        <SiGoogle className="text-red-500 text-xl" />
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                Remember Me
              </label>
              <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-black text-white py-3 font-semibold hover:bg-gray-800 transition"
            >
              Sign In →
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center">
        <img
          src="/images/sign-up-img.webp"
          alt="Dashboard Preview"
          className="w-4/5 h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
