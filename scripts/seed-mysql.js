const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");

if (fs.existsSync(".env")) {
  fs.readFileSync(".env", "utf8")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || "").trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[match[1]] = val;
      }
    });
}

function uid() {
  return crypto.randomUUID();
}

async function seed() {
  console.log("Seeding MySQL database 'interior' directly with native mysql2...");

  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "interior",
  });

  // 1. Seed Admin
  const hash = await bcrypt.hash("admin123", 10);
  await conn.query(
    `INSERT INTO Admin (id, email, password, name, role) 
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name), role = VALUES(role)`,
    [uid(), "admin@mainterior.com", hash, "Monish Pasha", "superadmin"]
  );

  await conn.query(
    `INSERT INTO Admin (id, email, password, name, role) 
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name), role = VALUES(role)`,
    [uid(), "monishpasha233@gmail.com", hash, "Monish Pasha", "superadmin"]
  );
  console.log("Admins seeded: admin@mainterior.com & monishpasha233@gmail.com (Password: admin123)");

  // 2. Seed SiteSettings
  const heroImages = JSON.stringify([
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=85",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=85",
  ]);

  await conn.query(
    `INSERT INTO SiteSettings (id, siteName, brandName, tagline, phone, email, address, logoUrl, heroTitle, heroSubtitle, heroCtaText, heroCtaLink, heroImages, primaryColor, secondaryColor, accentColor, whatsappNumber, googleMapsUrl, openingHours, footerText, aboutTitle, aboutStory, experienceYears, projectsDone, happyClients)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE siteName = VALUES(siteName), tagline = VALUES(tagline)`,
    [
      "default",
      "MA Carpenter and Interior",
      "MA",
      "Designing Spaces, Defining Lifestyles",
      "8714114418",
      "Monishpasha233@gmail.com",
      "Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301",
      "/logo/ma-logo.svg",
      "Transform Your Home Into a Masterpiece",
      "Discover premium interior design, modular kitchens, custom furniture, and complete home interior solutions with MA Carpenter and Interior.",
      "Explore Our Designs",
      "/projects",
      heroImages,
      "#080808",
      "#D9A441",
      "#F5D58A",
      "8714114418",
      "https://www.google.com/maps/search/?api=1&query=Shop+No+6+Sector+120+Noida+Uttar+Pradesh+201301",
      "Mon - Sun: 9:00 AM - 8:30 PM",
      "Crafting bespoke luxury living environments with master carpentry, modular excellence, and architectural interior design. Proudly serving Noida, Greater Noida, and Delhi NCR.",
      "Crafting Timeless Elegance & Bespoke Woodwork Since 2014",
      "At MA Carpenter and Interior, we believe every space holds the power to elevate the human spirit. Founded by master artisans and architectural planners, our workshop in Sector 120 Noida bridges European precision joinery with bespoke Indian luxury. From custom book-matched marble feature walls to anti-scratch modular kitchens and handcrafted solid teak furniture, we treat every home as our signature masterpiece.",
      12,
      350,
      320,
    ]
  );

  // 3. Seed HomeSections
  const sections = [
    { sectionKey: "hero", title: "Hero Masterpiece Banner", orderIndex: 1 },
    { sectionKey: "about", title: "About MA Carpenter and Interior", orderIndex: 2 },
    { sectionKey: "services", title: "Our Signature Services", orderIndex: 3 },
    { sectionKey: "projects", title: "Featured Interior Transformations", orderIndex: 4 },
    { sectionKey: "whyUs", title: "Why Choose MA Carpenter", orderIndex: 5 },
    { sectionKey: "process", title: "Our 5-Step Crafting Process", orderIndex: 6 },
    { sectionKey: "gallery", title: "Bespoke Interior & Carpentry Gallery", orderIndex: 7 },
    { sectionKey: "testimonials", title: "Words from Our Esteemed Clients", orderIndex: 8 },
    { sectionKey: "consultation", title: "Book a Free Consultation & 3D Estimation", orderIndex: 9 },
  ];

  for (const s of sections) {
    await conn.query(
      `INSERT INTO HomeSections (id, sectionKey, title, orderIndex, isEnabled)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), orderIndex = VALUES(orderIndex)`,
      [uid(), s.sectionKey, s.title, s.orderIndex, 1]
    );
  }

  // 4. Seed Gallery Categories & Items
  const categories = [
    { slug: "living-room", name: "Living Room", orderIndex: 1 },
    { slug: "bedroom", name: "Bedroom", orderIndex: 2 },
    { slug: "modular-kitchen", name: "Modular Kitchen", orderIndex: 3 },
    { slug: "study-room", name: "Study Room", orderIndex: 4 },
    { slug: "luxury-wardrobes", name: "Luxury Wardrobes", orderIndex: 5 },
    { slug: "custom-woodwork", name: "Custom Woodwork", orderIndex: 6 },
  ];

  for (const c of categories) {
    const [existing] = await conn.query("SELECT id FROM GalleryCategories WHERE slug = ?", [c.slug]);
    let catId = existing[0]?.id;
    if (!catId) {
      catId = uid();
      await conn.query(
        "INSERT INTO GalleryCategories (id, slug, name, orderIndex) VALUES (?, ?, ?, ?)",
        [catId, c.slug, c.name, c.orderIndex]
      );
    }

    const [items] = await conn.query("SELECT id FROM Gallery WHERE categoryId = ?", [catId]);
    if (items.length === 0) {
      await conn.query(
        `INSERT INTO Gallery (id, title, categoryId, imageUrl, isFeatured, orderIndex)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          uid(),
          `Signature ${c.name} Project View A`,
          catId,
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
          1,
          1,
        ]
      );
    }
  }

  console.log("Database seeded successfully via native MySQL!");
  await conn.end();
}

seed().catch((err) => {
  console.error("Seed Error:", err);
  process.exit(1);
});
