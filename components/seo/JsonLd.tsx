import React from "react";

export default function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://macarpenterandinterior.com";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "ProfessionalService"],
    "@id": `${siteUrl}/#organization`,
    "name": "MA Carpenter and Interior",
    "alternateName": "MA Interior Noida",
    "description": "Luxury interior design, bespoke modular kitchens, German-hardware wardrobes, and turnkey carpentry solutions in Sector 120, Noida and Delhi NCR.",
    "url": siteUrl,
    "telephone": "+918714114418",
    "email": "Monishpasha233@gmail.com",
    "priceRange": "₹₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer, UPI",
    "image": [
      `${siteUrl}/images/ma-reference-branding.jpg`,
      `${siteUrl}/logo/ma-logo.svg`,
      `${siteUrl}/images/services/modular-kitchen.jpg`,
      `${siteUrl}/images/services/wardrobe-design.jpg`
    ],
    "logo": `${siteUrl}/logo/ma-logo.svg`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No. 6, Sector 120",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201301",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.5898,
      "longitude": 77.3820
    },
    "hasMap": "https://www.google.com/maps/search/?api=1&query=Shop+No+6+Sector+120+Noida+Uttar+Pradesh+201301",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "20:30"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Noida" },
      { "@type": "City", "name": "Greater Noida" },
      { "@type": "City", "name": "Ghaziabad" },
      { "@type": "City", "name": "Delhi NCR" }
    ],
    "founder": {
      "@type": "Person",
      "name": "Monish Pasha",
      "jobTitle": "Master Craftsman & Turnkey Interior Lead"
    },
    "sameAs": [
      "https://www.instagram.com/macarpenterandinterior",
      "https://www.facebook.com/macarpenterandinterior"
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "MA Carpenter and Interior",
    "description": "Luxury woodwork, modular kitchens, and architectural turnkey interiors in Noida.",
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/blogs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}

