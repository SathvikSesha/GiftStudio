"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  companyInfo = {
    logo: "/logo.png",
    address: "123 Gift Street, Shopping District",
    phone: "+91 9988227733",
    email: "support@giftshop.com",
  },
  quickLinks = [
    { text: "Home", href: "/" },
    { text: "Shop", href: "/shop" },
    { text: "About Us", href: "/about" },
    { text: "Contact", href: "/contact" },
  ],
  customerService = [
    { text: "Shipping Policy", href: "/shipping" },
    { text: "Return Policy", href: "/returns" },
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Terms of Service", href: "/terms" },
  ],
  socialMedia = [
    { icon: "fa-facebook", href: "https://facebook.com" },
    { icon: "fa-twitter", href: "https://twitter.com" },
    { icon: "fa-instagram", href: "https://instagram.com" },
    { icon: "fa-pinterest", href: "https://pinterest.com" },
  ],
}) {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src={companyInfo.logo}
              alt="Company Logo"
              className="h-12 mb-4"
            />
            <p className="text-sm mb-2">
              <i className="fas fa-map-marker-alt mr-2"></i>
              {companyInfo.address}
            </p>
            <p className="text-sm mb-2">
              <i className="fas fa-phone mr-2"></i>
              {companyInfo.phone}
            </p>
            <p className="text-sm">
              <i className="fas fa-envelope mr-2"></i>
              {companyInfo.email}
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {customerService.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-6">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab ${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <i className="fas fa-shield-alt text-green-500"></i>
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-truck text-blue-500"></i>
                <span className="text-sm">Express Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Your Gift Shop. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="/payment/visa.png" alt="Visa" className="h-6" />
              <img
                src="/payment/mastercard.png"
                alt="Mastercard"
                className="h-6"
              />
              <img
                src="/payment/amex.png"
                alt="American Express"
                className="h-6"
              />
              <img src="/payment/paypal.png" alt="PayPal" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StoryComponent() {
  const defaultProps = {
    companyInfo: {
      logo: "/logo.png",
      address: "123 Gift Street, Shopping District",
      phone: "+1 (555) 123-4567",
      email: "support@giftshop.com",
    },
    quickLinks: [
      { text: "Home", href: "/" },
      { text: "Shop", href: "/shop" },
      { text: "About Us", href: "/about" },
      { text: "Contact", href: "/contact" },
    ],
    customerService: [
      { text: "Shipping Policy", href: "/shipping" },
      { text: "Return Policy", href: "/returns" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
    ],
    socialMedia: [
      { icon: "fa-facebook", href: "https://facebook.com" },
      { icon: "fa-twitter", href: "https://twitter.com" },
      { icon: "fa-instagram", href: "https://instagram.com" },
      { icon: "fa-pinterest", href: "https://pinterest.com" },
    ],
  };

  const minimalProps = {
    companyInfo: {
      logo: "/logo.png",
      address: "123 Main St",
      phone: "+91 9988227733",
      email: "info@company.com",
    },
    quickLinks: [
      { text: "Home", href: "/" },
      { text: "About", href: "/about" },
    ],
    customerService: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
    ],
    socialMedia: [
      { icon: "fa-facebook", href: "https://facebook.com" },
      { icon: "fa-twitter", href: "https://twitter.com" },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Default Footer</h2>
        <MainComponent {...defaultProps} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Minimal Footer</h2>
        <MainComponent {...minimalProps} />
      </div>
    </div>
  );
});
}