'use client'
import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'

// Add this type definition
type Translations = {
  contactUs: string;
  contactUsDescription: string;
  email: string;
  phone: string;
  address: string;
  sendUsMessage: string;
  name: string;
  message: string;
  sendMessage: string;
  faq: string;
  faq1Title: string;
  faq1Content: string;
  faq2Title: string;
  faq2Content: string;
  faq3Title: string;
  faq3Content: string;
  [key: string]: string; // Allow for dynamic keys
};

export default function Contact() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get('lang') || "en");
  const [translations, setTranslations] = useState<Translations>({} as Translations);
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const contentToTranslate: Translations = {
    contactUs: "Contact Us",
    contactUsDescription: "We are here to help. Reach out to us with any questions or concerns.",
    email: "Email",
    phone: "Phone",
    address: "Address",
    sendUsMessage: "Send Us a Message",
    name: "Name",
    message: "Message",
    sendMessage: "Send Message",
    faq: "Frequently Asked Questions",
    faq1Title: "How do I create an account?",
    faq1Content: "To create an account, click on the \"Sign Up\" button in the top right corner of our homepage. Follow the prompts to enter your information and set up your profile.",
    faq2Title: "What types of crops can I sell on your platform?",
    faq2Content: "Our platform supports a wide variety of crops. You can sell grains, fruits, vegetables, and more. Check our crop categories for a full list of supported produce.",
    faq3Title: "How do you ensure fair pricing for farmers?",
    faq3Content: "We use a transparent pricing model that takes into account market rates, quality of produce, and transportation costs. Our AI-powered system helps suggest competitive prices to ensure fairness for both farmers and buyers.",
  };

  useEffect(() => {
    const newLang = searchParams.get('lang');
    if (newLang && newLang !== language) {
      setLanguage(newLang);
    }
    // Always set isTranslating to true when component mounts or language changes
    setIsTranslating(true);
  }, [searchParams, language]);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslations(contentToTranslate);
        setIsTranslating(false);
        return;
      }

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ texts: contentToTranslate, targetLanguage: language }),
        });

        if (!response.ok) {
          throw new Error('Translation request failed');
        }

        const translatedContent: Translations = await response.json();
        setTranslations(translatedContent);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslations(contentToTranslate);
      } finally {
        setIsTranslating(false);
      }
    };

    // Always call translateContent when this effect runs
    translateContent();
  }, [language]); // Remove isTranslating from dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', message: '' })
  }

  const getContent = (key: keyof Translations) => {
    if (isTranslating || !translations[key]) {
      return contentToTranslate[key];
    }
    return translations[key];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="bg-green-500 dark:bg-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{getContent('contactUs')}</h1>
          <p className="text-xl">{getContent('contactUsDescription')}</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaEnvelope className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{getContent('email')}</h3>
              <p>support@farmerconnect.com</p>
            </div>
            <div className="text-center">
              <FaPhone className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{getContent('phone')}</h3>
              <p>+1 (123) 456-7890</p>
            </div>
            <div className="text-center">
              <FaMapMarkerAlt className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{getContent('address')}</h3>
              <p>123 Farm Street, Agriville, AG 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{getContent('sendUsMessage')}</h2>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-semibold">{getContent('name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-semibold">{getContent('email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 font-semibold">{getContent('message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              {getContent('sendMessage')}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{getContent('faq')}</h2>
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{getContent('faq1Title')}</h3>
              <p>{getContent('faq1Content')}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{getContent('faq2Title')}</h3>
              <p>{getContent('faq2Content')}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{getContent('faq3Title')}</h3>
              <p>{getContent('faq3Content')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
