import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var globalMysqlPool: mysql.Pool | undefined;
}

// Parse connection options from DATABASE_URL or individual variables
let dbHost = process.env.MYSQL_HOST || "localhost";
let dbPort = parseInt(process.env.MYSQL_PORT || "3306");
let dbUser = process.env.MYSQL_USER || "root";
let dbPassword = process.env.MYSQL_PASSWORD || "";
let dbDatabase = process.env.MYSQL_DATABASE || "interior";

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mysql://")) {
  try {
    const parsed = new URL(process.env.DATABASE_URL);
    dbHost = parsed.hostname || dbHost;
    dbPort = parsed.port ? parseInt(parsed.port) : dbPort;
    dbUser = decodeURIComponent(parsed.username || dbUser);
    dbPassword = decodeURIComponent(parsed.password || dbPassword);
    dbDatabase = parsed.pathname.replace(/^\//, "") || dbDatabase;
  } catch (err) {
    console.warn("Failed to parse DATABASE_URL, using individual env vars:", err);
  }
}

const isSsl = process.env.MYSQL_SSL === "true" || process.env.MYSQL_SSL === "1";

export const pool: mysql.Pool =
  global.globalMysqlPool ||
  mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: "utf8mb4",
    ssl: isSsl ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  global.globalMysqlPool = pool;
}

export function isMysqlConfigured(): boolean {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mysql://")) {
    return true;
  }
  if (process.env.MYSQL_HOST && process.env.MYSQL_HOST !== "localhost" && process.env.MYSQL_HOST !== "127.0.0.1") {
    return true;
  }
  // Allow localhost only if NOT on Vercel/serverless
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME && process.env.MYSQL_HOST) {
    return true;
  }
  return false;
}

// Track temporary database failure to fail fast without blocking requests
let lastDbFailure = 0;
const DB_COOLDOWN_MS = 10000;

// Generic query helper
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!isMysqlConfigured()) {
    throw new Error("MySQL is not configured");
  }
  if (lastDbFailure && Date.now() - lastDbFailure < DB_COOLDOWN_MS) {
    throw new Error("Database temporarily unreachable (in cooldown)");
  }
  try {
    const [rows] = await pool.query(sql, params);
    lastDbFailure = 0;
    return rows as T[];
  } catch (err: any) {
    if (
      err?.code === "ECONNREFUSED" ||
      err?.code === "ETIMEDOUT" ||
      err?.code === "PROTOCOL_CONNECTION_LOST" ||
      err?.code === "ENOTFOUND" ||
      err?.code === "EACCES"
    ) {
      lastDbFailure = Date.now();
    }
    throw err;
  }
}

// Single row helper
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// Execute helper (INSERT, UPDATE, DELETE)
export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  if (!isMysqlConfigured()) {
    throw new Error("MySQL is not configured");
  }
  if (lastDbFailure && Date.now() - lastDbFailure < DB_COOLDOWN_MS) {
    throw new Error("Database temporarily unreachable (in cooldown)");
  }
  try {
    const [result] = await pool.execute(sql, params);
    lastDbFailure = 0;
    return result as mysql.ResultSetHeader;
  } catch (err: any) {
    if (
      err?.code === "ECONNREFUSED" ||
      err?.code === "ETIMEDOUT" ||
      err?.code === "PROTOCOL_CONNECTION_LOST" ||
      err?.code === "ENOTFOUND" ||
      err?.code === "EACCES"
    ) {
      lastDbFailure = Date.now();
    }
    throw err;
  }
}

// Database Schema Table Creator for MySQL
export async function initDatabaseTables() {
  await execute(`
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

  await execute(`
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

  await execute(`
    CREATE TABLE IF NOT EXISTS HomeSections (
      id VARCHAR(36) PRIMARY KEY,
      sectionKey VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(191) NOT NULL,
      isEnabled BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_section_key (sectionKey)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS Services (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(191) NOT NULL,
      category VARCHAR(100) DEFAULT 'Interior',
      shortDesc TEXT,
      fullDesc LONGTEXT,
      icon VARCHAR(50) DEFAULT 'Hammer',
      featuredImage TEXT,
      images LONGTEXT,
      features LONGTEXT,
      benefits LONGTEXT,
      seoTitle VARCHAR(255),
      seoDesc TEXT,
      isPublished BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_service_slug (slug),
      INDEX idx_service_published (isPublished)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS Projects (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(191) NOT NULL,
      category VARCHAR(100) DEFAULT 'Living Room',
      client VARCHAR(191),
      location VARCHAR(191) DEFAULT 'Sector 120, Noida',
      completedDate VARCHAR(100),
      area VARCHAR(100) DEFAULT '1,850 sq.ft',
      shortDesc TEXT,
      description LONGTEXT,
      featuredImage TEXT,
      beforeImage TEXT,
      afterImage TEXT,
      isFeatured BOOLEAN DEFAULT FALSE,
      isPublished BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_project_slug (slug),
      INDEX idx_project_published (isPublished)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS ProjectImages (
      id VARCHAR(36) PRIMARY KEY,
      projectId VARCHAR(36) NOT NULL,
      imageUrl TEXT NOT NULL,
      caption VARCHAR(255),
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_proj_img_project (projectId),
      CONSTRAINT fk_proj_img_project FOREIGN KEY (projectId) REFERENCES Projects (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS GalleryCategories (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_gal_cat_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS Gallery (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(191),
      categoryId VARCHAR(36),
      imageUrl TEXT NOT NULL,
      isFeatured BOOLEAN DEFAULT FALSE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_gallery_cat (categoryId),
      CONSTRAINT fk_gallery_cat FOREIGN KEY (categoryId) REFERENCES GalleryCategories (id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS Testimonials (
      id VARCHAR(36) PRIMARY KEY,
      clientName VARCHAR(191) NOT NULL,
      clientRole VARCHAR(100) DEFAULT 'Homeowner',
      clientLocation VARCHAR(191) DEFAULT 'Sector 120, Noida',
      rating INT DEFAULT 5,
      reviewText TEXT NOT NULL,
      avatarUrl TEXT,
      projectType VARCHAR(100),
      isFeatured BOOLEAN DEFAULT FALSE,
      isPublished BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS Enquiries (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(191),
      service VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'New',
      internalNotes TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_enquiry_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS ActivityLogs (
      id VARCHAR(36) PRIMARY KEY,
      action VARCHAR(100) NOT NULL,
      adminEmail VARCHAR(191) NOT NULL,
      details TEXT,
      ipAddress VARCHAR(100),
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS SEOSettings (
      id VARCHAR(36) PRIMARY KEY,
      pageRoute VARCHAR(100) NOT NULL UNIQUE,
      metaTitle VARCHAR(255) NOT NULL,
      metaDesc TEXT NOT NULL,
      keywords TEXT,
      canonicalUrl VARCHAR(255),
      ogTitle VARCHAR(255),
      ogDesc TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_seo_route (pageRoute)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS Blogs (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content LONGTEXT NOT NULL,
      featuredImage TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'Interior Design',
      author VARCHAR(100) DEFAULT 'Monish Pasha',
      readTime VARCHAR(50) DEFAULT '4 min read',
      publishedAt VARCHAR(100),
      isPublished BOOLEAN DEFAULT TRUE,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_blog_slug (slug),
      INDEX idx_blog_published (isPublished)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}
