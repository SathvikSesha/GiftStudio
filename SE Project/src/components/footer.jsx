"use client";
import React from "react";

function MainComponent({
  companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  quickLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Cart", href: "/cart" },
    { label: "My Account", href: "/account" },
    { label: "Track Order", href: "/track" },
  ],
  policyLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Return Policy", href: "/returns" },
    { label: "Security", href: "/security" },
  ],
  cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  supportEmail = "support@example.com",
  supportPhone = "1-800-123-4567",
}) {
  return (
    <Footer1
      companyLinks={companyLinks}
      quickLinks={quickLinks}
      policyLinks={policyLinks}
      cities={cities}
      supportEmail={supportEmail}
      supportPhone={supportPhone}
    />
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent />
      <MainComponent
        supportEmail="custom@example.com"
        supportPhone="1-888-555-0123"
        cities={["Miami", "Seattle", "Boston", "Dallas", "Denver"]}
      />
    </div>
  );
}

export default Footer;