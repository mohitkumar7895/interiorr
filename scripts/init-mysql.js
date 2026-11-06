const mysql = require("mysql2/promise");
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

async function init() {
  console.log("Connecting to MySQL on localhost:3306...");

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
  });

  console.log("Creating database 'interior' if not exists...");
  await connection.query("CREATE DATABASE IF NOT EXISTS interior DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
  await connection.changeUser({ database: "interior" });

  console.log("Creating relational tables in 'interior'...");

  await connection.query(`
    CREATE TABLE IF NOT EXISTS Admin (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(191) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(191) NOT NULL,
      role VARCHAR(50) DEFAULT 'superadmin',
      avatar TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_admin_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS SiteSettings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
      siteName VARCHAR(191) DEFAULT 'MA Carpenter and Interior',
      brandName VARCHAR(50) DEFAULT 'MA',
      tagline VARCHAR(255) DEFAULT 'Designing Spaces, Defining Lifestyles',
      phone VARCHAR(50) DEFAULT '8714114418',
      email VARCHAR(191) DEFAULT 'Monishpasha233@gmail.com',
      address VARCHAR(255) DEFAULT 'Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301',
      logoUrl TEXT,
      faviconUrl TEXT,
      heroTitle VARCHAR(255) DEFAULT 'Transform Your Home Into a Masterpiece',
      heroSubtitle TEXT,
      heroCtaText VARCHAR(100) DEFAULT 'Explore Our Designs',
      heroCtaLink VARCHAR(255) DEFAULT '/projects',
      heroImages TEXT,
      primaryColor VARCHAR(20) DEFAULT '#080808',
      secondaryColor VARCHAR(20) DEFAULT '#D9A441',
      accentColor VARCHAR(20) DEFAULT '#F5D58A',
      whatsappNumber VARCHAR(50) DEFAULT '8714114418',
      googleMapsUrl TEXT,
      openingHours VARCHAR(100) DEFAULT 'Mon - Sun: 9:00 AM - 8:30 PM',
      footerText TEXT,
      aboutTitle VARCHAR(255) DEFAULT 'Architects of Elegance & Masters of Carpentry',
      aboutStory TEXT,
      experienceYears INT DEFAULT 12,
      projectsDone INT DEFAULT 350,
      happyClients INT DEFAULT 320,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS HomeSections (
      id VARCHAR(36) PRIMARY KEY,
      sectionKey VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(191) NOT NULL,
      subtitle TEXT,
      isEnabled BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      contentJson TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_homesections_order (orderIndex)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS Services (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(191) NOT NULL,
      category VARCHAR(100) DEFAULT 'Interior',
      shortDesc TEXT NOT NULL,
      fullDesc LONGTEXT NOT NULL,
      icon VARCHAR(100) DEFAULT 'Hammer',
      featuredImage TEXT NOT NULL,
      images TEXT,
      features TEXT,
      benefits TEXT,
      seoTitle VARCHAR(255),
      seoDesc TEXT,
      isPublished BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_services_slug (slug),
      INDEX idx_services_published (isPublished, orderIndex)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS Projects (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(191) NOT NULL,
      category VARCHAR(100) NOT NULL,
      client VARCHAR(191),
      location VARCHAR(191) DEFAULT 'Noida, NCR',
      completedDate VARCHAR(100),
      area VARCHAR(100) DEFAULT '1,850 sq.ft',
      shortDesc TEXT NOT NULL,
      description LONGTEXT NOT NULL,
      featuredImage TEXT NOT NULL,
      beforeImage TEXT,
      afterImage TEXT,
      isPublished BOOLEAN DEFAULT TRUE,
      isFeatured BOOLEAN DEFAULT FALSE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_projects_slug (slug),
      INDEX idx_projects_category (category),
      INDEX idx_projects_featured (isPublished, isFeatured)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS ProjectImages (
      id VARCHAR(36) PRIMARY KEY,
      projectId VARCHAR(36) NOT NULL,
      imageUrl TEXT NOT NULL,
      caption VARCHAR(255),
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_proj_img_project (projectId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS GalleryCategories (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(191) NOT NULL,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_gal_cat_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS Gallery (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      categoryId VARCHAR(36) NOT NULL,
      imageUrl TEXT NOT NULL,
      thumbnail TEXT,
      isFeatured BOOLEAN DEFAULT FALSE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_gallery_cat (categoryId),
      INDEX idx_gallery_featured (isFeatured)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS Enquiries (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(191),
      service VARCHAR(100) DEFAULT 'General Consultation',
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'New',
      internalNotes TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_enquiries_status (status),
      INDEX idx_enquiries_created (createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS Testimonials (
      id VARCHAR(36) PRIMARY KEY,
      clientName VARCHAR(191) NOT NULL,
      clientRole VARCHAR(100) DEFAULT 'Homeowner',
      clientLocation VARCHAR(100) DEFAULT 'Sector 120, Noida',
      avatarUrl TEXT,
      rating INT DEFAULT 5,
      reviewText TEXT NOT NULL,
      isPublished BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_testimonials_pub (isPublished, orderIndex)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS SEOSettings (
      id VARCHAR(36) PRIMARY KEY,
      pageRoute VARCHAR(100) NOT NULL UNIQUE,
      metaTitle VARCHAR(255) NOT NULL,
      metaDesc TEXT NOT NULL,
      keywords TEXT,
      canonicalUrl TEXT,
      ogTitle VARCHAR(255),
      ogDesc TEXT,
      ogImage TEXT,
      robots VARCHAR(50) DEFAULT 'index, follow',
      schemaJson TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_seo_route (pageRoute)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS ActivityLogs (
      id VARCHAR(36) PRIMARY KEY,
      action VARCHAR(191) NOT NULL,
      adminEmail VARCHAR(191) NOT NULL,
      details TEXT,
      ipAddress VARCHAR(100),
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_activity_created (createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log("All tables successfully verified & created in MySQL 'interior'.");
  await connection.end();
}

init().catch((err) => {
  console.error("Init Error:", err);
  process.exit(1);
});
