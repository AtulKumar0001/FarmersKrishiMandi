"use client";
import React, { useState } from "react";
import Link from "next/link";
import { login, signup } from "./actions";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-500 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Sign Up / Login
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              formAction={async (formData) => {
                const result = await signup(formData);
                console.log(result);
              }}
            >
              Sign up
            </button>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              formAction={async (formData) => {
                const result = login(formData);
                console.log(result);
              }}
            >
              Log in
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          By signing up, you agree to our{" "}
          <Link href="/" className="text-green-500 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="text-green-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
