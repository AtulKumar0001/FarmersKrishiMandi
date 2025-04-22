"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  loginWithGoogleFarmer,
  loginWithGoogleBuyer,
} from "../../app/login/actions";
import { useSearchParams } from "next/navigation";

// Add Translations interface
interface Translations {
  signUpLogin: string;
  email: string;
  password: string;
  enterEmail: string;
  enterPassword: string;
  signUp: string;
  logIn: string;
  signInGoogleFarmer: string;
  signInGoogleBuyer: string;
  termsAgreement: string;
  termsOfService: string;
  privacyPolicy: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGoogleLoginFarmer = async () => {
    const result = await loginWithGoogleFarmer();
    if (result.url) {
      window.location.href = result.url;
    } else if (result.error) {
      console.error("Error logging in with Google:", result.error);
      // Handle error (e.g., show error message to user)
    }
  };
  const handleGoogleLoginBuyer = async () => {
    const result = await loginWithGoogleBuyer();
    if (result.url) {
      window.location.href = result.url;
    } else if (result.error) {
      console.error("Error logging in with Google:", result.error);
      // Handle error (e.g., show error message to user)
    }
  };

  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get("lang") || "en");
  const [translations, setTranslations] = useState<Translations>(
    {} as Translations
  );
  const [isTranslating, setIsTranslating] = useState(false);

  const contentToTranslate = useMemo<Translations>(
    () => ({
      signUpLogin: "Sign Up / Login",
      email: "Email",
      password: "Password",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      signUp: "Sign up",
      logIn: "Log in",
      signInGoogleFarmer: "Sign in with Google as Farmer",
      signInGoogleBuyer: "Sign in with Google as Buyer",
      termsAgreement: "By signing up, you agree to our",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
    }),
    []
  );

  useEffect(() => {
    const newLang = searchParams.get("lang");
    if (newLang && newLang !== language) {
      setLanguage(newLang);
    }
    setIsTranslating(true);
  }, [searchParams, language]);

  useEffect(() => {
    const translateContent = async () => {
      if (language === "en") {
        setTranslations(contentToTranslate);
        setIsTranslating(false);
        return;
      }

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texts: contentToTranslate,
            targetLanguage: language,
          }),
        });

        if (!response.ok) {
          throw new Error("Translation request failed");
        }

        const translatedContent: Translations = await response.json();
        setTranslations(translatedContent);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslations(contentToTranslate);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [language, contentToTranslate]);

  const getContent = (key: keyof Translations): string => {
    if (isTranslating || !translations[key]) {
      return contentToTranslate[key];
    }
    return translations[key];
  };

  return (
    <div className="min-h-screen bg-gray-500 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {getContent("signUpLogin")}
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {getContent("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={getContent("enterEmail")}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {getContent("password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={getContent("enterPassword")}
            />
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleLoginFarmer}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 mb-3"
          >
            {getContent("signInGoogleFarmer")}
          </button>
          <button
            onClick={handleGoogleLoginBuyer}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            {getContent("signInGoogleBuyer")}
          </button>
        </div>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          {getContent("termsAgreement")}{" "}
          <Link href="/" className="text-green-500 hover:underline">
            {getContent("termsOfService")}
          </Link>{" "}
          and{" "}
          <Link href="/" className="text-green-500 hover:underline">
            {getContent("privacyPolicy")}
          </Link>
        </p>
      </div>
    </div>
  );
}
