import { pool, query, queryOne, execute, initDatabaseTables } from "./mysql";
import crypto from "crypto";

export function generateId(): string {
  return crypto.randomUUID();
}

export const db = {
  admin: {
    async findUnique({ where, select }: { where: { email?: string; id?: string }; select?: any }) {
      if (where.email) {
        return queryOne("SELECT * FROM Admin WHERE email = ? LIMIT 1", [where.email.toLowerCase()]);
      }
      if (where.id) {
        return queryOne("SELECT * FROM Admin WHERE id = ? LIMIT 1", [where.id]);
      }
      return null;
    },
    async create({ data, include }: { data: any; include?: any }) {
      const id = data.id || generateId();
      await execute(
        "INSERT INTO Admin (id, email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?, ?)",
        [id, data.email.toLowerCase(), data.password, data.name, data.role || "superadmin", data.avatar || null]
      );
      return queryOne("SELECT * FROM Admin WHERE id = ?", [id]);
    },
    async upsert({ where, update, create }: { where: { email: string }; update: any; create: any }) {
      const existing = await queryOne("SELECT id FROM Admin WHERE email = ?", [where.email.toLowerCase()]);
      if (existing) {
        if (update.password) {
          await execute("UPDATE Admin SET password = ?, name = ?, role = ? WHERE email = ?", [
            update.password,
            update.name || "Admin",
            update.role || "superadmin",
            where.email.toLowerCase(),
          ]);
        }
        return queryOne("SELECT * FROM Admin WHERE email = ?", [where.email.toLowerCase()]);
      } else {
        const id = create.id || generateId();
        await execute(
          "INSERT INTO Admin (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)",
          [id, where.email.toLowerCase(), create.password, create.name, create.role || "superadmin"]
        );
        return queryOne("SELECT * FROM Admin WHERE id = ?", [id]);
      }
    },
  },

  siteSettings: {
    async findUnique({ where }: { where: { id: string } }) {
      const row = await queryOne("SELECT * FROM SiteSettings WHERE id = ? LIMIT 1", [where.id]);
      return row;
    },
    async upsert({ where, update, create }: { where: { id: string }; update: any; create: any }) {
      const existing = await queryOne("SELECT id FROM SiteSettings WHERE id = ?", [where.id]);
      if (existing) {
        const fields: string[] = [];
        const values: any[] = [];
        for (const [k, v] of Object.entries(update)) {
          if (v !== undefined) {
            fields.push(`${k} = ?`);
            values.push(v);
          }
        }
        if (fields.length > 0) {
          values.push(where.id);
          await execute(`UPDATE SiteSettings SET ${fields.join(", ")} WHERE id = ?`, values);
        }
        return queryOne("SELECT * FROM SiteSettings WHERE id = ?", [where.id]);
      } else {
        const id = create.id || "default";
        const keys = Object.keys(create);
        const placeholders = keys.map(() => "?").join(", ");
        const values = Object.values(create);
        await execute(`INSERT INTO SiteSettings (${keys.join(", ")}) VALUES (${placeholders})`, values);
        return queryOne("SELECT * FROM SiteSettings WHERE id = ?", [id]);
      }
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) {
          fields.push(`${k} = ?`);
          values.push(v);
        }
      }
      if (fields.length > 0) {
        values.push(where.id);
        await execute(`UPDATE SiteSettings SET ${fields.join(", ")} WHERE id = ?`, values);
      }
      return queryOne("SELECT * FROM SiteSettings WHERE id = ?", [where.id]);
    },
  },

  homeSections: {
    async findMany({ orderBy }: { orderBy?: { orderIndex?: "asc" | "desc" } } = {}) {
      const direction = orderBy?.orderIndex === "desc" ? "DESC" : "ASC";
      const rows = await query(`SELECT * FROM HomeSections ORDER BY orderIndex ${direction}`);
      return rows.map((r) => ({ ...r, isEnabled: Boolean(r.isEnabled) }));
    },
    async update({ where, data }: { where: { sectionKey: string }; data: any }) {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) {
          fields.push(`${k} = ?`);
          values.push(v);
        }
      }
      if (fields.length > 0) {
        values.push(where.sectionKey);
        await execute(`UPDATE HomeSections SET ${fields.join(", ")} WHERE sectionKey = ?`, values);
      }
      return queryOne("SELECT * FROM HomeSections WHERE sectionKey = ?", [where.sectionKey]);
    },
    async upsert({ where, update, create }: { where: { sectionKey: string }; update: any; create: any }) {
      const existing = await queryOne("SELECT id FROM HomeSections WHERE sectionKey = ?", [where.sectionKey]);
      if (existing) {
        await execute("UPDATE HomeSections SET title = ?, orderIndex = ? WHERE sectionKey = ?", [
          update.title,
          update.orderIndex || 0,
          where.sectionKey,
        ]);
        return queryOne("SELECT * FROM HomeSections WHERE sectionKey = ?", [where.sectionKey]);
      } else {
        const id = generateId();
        await execute(
          "INSERT INTO HomeSections (id, sectionKey, title, orderIndex, isEnabled) VALUES (?, ?, ?, ?, ?)",
          [id, where.sectionKey, create.title, create.orderIndex || 0, create.isEnabled ?? true]
        );
        return queryOne("SELECT * FROM HomeSections WHERE id = ?", [id]);
      }
    },
  },

  services: {
    async findMany({ where, orderBy, take, select }: { where?: any; orderBy?: any; take?: number; select?: any } = {}) {
      let sql = "SELECT * FROM Services";
      const params: any[] = [];

      if (where?.isPublished !== undefined) {
        sql += " WHERE isPublished = ?";
        params.push(where.isPublished ? 1 : 0);
      }

      sql += " ORDER BY orderIndex ASC";
      if (take) {
        sql += ` LIMIT ${parseInt(String(take))}`;
      }

      const rows = await query(sql, params);
      return rows.map((r) => ({ ...r, isPublished: Boolean(r.isPublished) }));
    },
    async findUnique({ where }: { where: { slug?: string; id?: string } }) {
      let row = null;
      if (where.slug) {
        row = await queryOne("SELECT * FROM Services WHERE slug = ? LIMIT 1", [where.slug]);
      } else if (where.id) {
        row = await queryOne("SELECT * FROM Services WHERE id = ? LIMIT 1", [where.id]);
      }
      if (row) {
        row.isPublished = Boolean(row.isPublished);
      }
      return row;
    },
    async create({ data, include }: { data: any; include?: any }) {
      const id = data.id || generateId();
      await execute(
        `INSERT INTO Services (id, slug, title, category, shortDesc, fullDesc, icon, featuredImage, images, features, benefits, seoTitle, seoDesc, isPublished, orderIndex)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.slug,
          data.title,
          data.category || "Interior",
          data.shortDesc,
          data.fullDesc,
          data.icon || "Hammer",
          data.featuredImage,
          typeof data.images === "string" ? data.images : JSON.stringify(data.images || []),
          typeof data.features === "string" ? data.features : JSON.stringify(data.features || []),
          typeof data.benefits === "string" ? data.benefits : JSON.stringify(data.benefits || []),
          data.seoTitle || null,
          data.seoDesc || null,
          data.isPublished ?? true ? 1 : 0,
          data.orderIndex || 0,
        ]
      );
      return queryOne("SELECT * FROM Services WHERE id = ?", [id]);
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) {
          fields.push(`${k} = ?`);
          values.push(k === "isPublished" ? (v ? 1 : 0) : v);
        }
      }
      if (fields.length > 0) {
        values.push(where.id);
        await execute(`UPDATE Services SET ${fields.join(", ")} WHERE id = ?`, values);
      }
      return queryOne("SELECT * FROM Services WHERE id = ?", [where.id]);
    },
    async delete({ where }: { where: { id: string } }) {
      await execute("DELETE FROM Services WHERE id = ?", [where.id]);
      return { id: where.id };
    },
    async count() {
      const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Services");
      return res ? Number(res.total) : 0;
    },
  },

  projects: {
    async findMany({ where, orderBy, take, include, select }: { where?: any; orderBy?: any; take?: number; include?: any; select?: any } = {}) {
      let sql = "SELECT * FROM Projects";
      const params: any[] = [];
      const conditions: string[] = [];

      if (where?.isPublished !== undefined) {
        conditions.push("isPublished = ?");
        params.push(where.isPublished ? 1 : 0);
      }
      if (where?.isFeatured !== undefined) {
        conditions.push("isFeatured = ?");
        params.push(where.isFeatured ? 1 : 0);
      }

      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
      }

      sql += " ORDER BY orderIndex ASC";
      if (take) {
        sql += ` LIMIT ${parseInt(String(take))}`;
      }

      const rows = await query(sql, params);

      // Fetch related images if include.images
      if (include?.images && rows.length > 0) {
        const projectIds = rows.map((r) => r.id);
        const placeholders = projectIds.map(() => "?").join(",");
        const images = await query(`SELECT * FROM ProjectImages WHERE projectId IN (${placeholders}) ORDER BY orderIndex ASC`, projectIds);
        
        return rows.map((p) => ({
          ...p,
          isPublished: Boolean(p.isPublished),
          isFeatured: Boolean(p.isFeatured),
          images: images.filter((img) => img.projectId === p.id),
        }));
      }

      return rows.map((p) => ({
        ...p,
        isPublished: Boolean(p.isPublished),
        isFeatured: Boolean(p.isFeatured),
      }));
    },
    async findUnique({ where, include }: { where: { slug?: string; id?: string }; include?: any }) {
      let p = null;
      if (where.slug) {
        p = await queryOne("SELECT * FROM Projects WHERE slug = ? LIMIT 1", [where.slug]);
      } else if (where.id) {
        p = await queryOne("SELECT * FROM Projects WHERE id = ? LIMIT 1", [where.id]);
      }
      if (!p) return null;

      p.isPublished = Boolean(p.isPublished);
      p.isFeatured = Boolean(p.isFeatured);

      if (include?.images) {
        p.images = await query("SELECT * FROM ProjectImages WHERE projectId = ? ORDER BY orderIndex ASC", [p.id]);
      }

      return p;
    },
    async create({ data, include }: { data: any; include?: any }) {
      const id = data.id || generateId();
      await execute(
        `INSERT INTO Projects (id, slug, title, category, client, location, completedDate, area, shortDesc, description, featuredImage, beforeImage, afterImage, isPublished, isFeatured, orderIndex)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.slug,
          data.title,
          data.category || "Living Room",
          data.client || null,
          data.location || "Noida, NCR",
          data.completedDate || null,
          data.area || "1,850 sq.ft",
          data.shortDesc,
          data.description,
          data.featuredImage,
          data.beforeImage || null,
          data.afterImage || null,
          data.isPublished ?? true ? 1 : 0,
          data.isFeatured ?? false ? 1 : 0,
          data.orderIndex || 0,
        ]
      );

      if (data.images?.create && Array.isArray(data.images.create)) {
        for (const img of data.images.create) {
          const imgId = generateId();
          await execute(
            "INSERT INTO ProjectImages (id, projectId, imageUrl, caption, orderIndex) VALUES (?, ?, ?, ?, ?)",
            [imgId, id, img.imageUrl, img.caption || null, img.orderIndex || 0]
          );
        }
      }

      return this.findUnique({ where: { id }, include: { images: true } });
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined && k !== "images") {
          fields.push(`${k} = ?`);
          values.push(k === "isPublished" || k === "isFeatured" ? (v ? 1 : 0) : v);
        }
      }
      if (fields.length > 0) {
        values.push(where.id);
        await execute(`UPDATE Projects SET ${fields.join(", ")} WHERE id = ?`, values);
      }
      return this.findUnique({ where: { id: where.id }, include: { images: true } });
    },
    async delete({ where }: { where: { id: string } }) {
      await execute("DELETE FROM ProjectImages WHERE projectId = ?", [where.id]);
      await execute("DELETE FROM Projects WHERE id = ?", [where.id]);
      return { id: where.id };
    },
    async count() {
      const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Projects");
      return res ? Number(res.total) : 0;
    },
  },

  galleryCategories: {
    async findMany({ orderBy }: { orderBy?: any } = {}) {
      return query("SELECT * FROM GalleryCategories ORDER BY orderIndex ASC");
    },
    async upsert({ where, update, create }: { where: { slug: string }; update: any; create: any }) {
      const existing = await queryOne("SELECT id FROM GalleryCategories WHERE slug = ?", [where.slug]);
      if (existing) {
        await execute("UPDATE GalleryCategories SET name = ? WHERE slug = ?", [update.name, where.slug]);
        return queryOne("SELECT * FROM GalleryCategories WHERE slug = ?", [where.slug]);
      } else {
        const id = generateId();
        await execute("INSERT INTO GalleryCategories (id, slug, name, orderIndex) VALUES (?, ?, ?, ?)", [
          id,
          where.slug,
          create.name,
          create.orderIndex || 0,
        ]);
        return queryOne("SELECT * FROM GalleryCategories WHERE id = ?", [id]);
      }
    },
  },

  gallery: {
    async findMany({ where, include, orderBy, take }: { where?: any; include?: any; orderBy?: any; take?: number } = {}) {
      let sql = `
        SELECT g.*, c.name as categoryName, c.slug as categorySlug
        FROM Gallery g
        LEFT JOIN GalleryCategories c ON g.categoryId = c.id
      `;
      const params: any[] = [];
      const conditions: string[] = [];

      if (where?.isFeatured !== undefined) {
        conditions.push("g.isFeatured = ?");
        params.push(where.isFeatured ? 1 : 0);
      }
      if (where?.categoryId) {
        conditions.push("g.categoryId = ?");
        params.push(where.categoryId);
      }

      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
      }

      sql += " ORDER BY g.orderIndex ASC";
      if (take) {
        sql += ` LIMIT ${parseInt(String(take))}`;
      }

      const rows = await query(sql, params);
      return rows.map((r) => ({
        ...r,
        isFeatured: Boolean(r.isFeatured),
        category: {
          id: r.categoryId,
          name: r.categoryName || "Showcase",
          slug: r.categorySlug || "showcase",
        },
      }));
    },
    async create({ data, include }: { data: any; include?: any }) {
      const id = data.id || generateId();
      await execute(
        "INSERT INTO Gallery (id, title, categoryId, imageUrl, thumbnail, isFeatured, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          data.title,
          data.categoryId,
          data.imageUrl,
          data.thumbnail || null,
          data.isFeatured ?? false ? 1 : 0,
          data.orderIndex || 0,
        ]
      );
      const row = await queryOne(
        `SELECT g.*, c.name as categoryName, c.slug as categorySlug
         FROM Gallery g LEFT JOIN GalleryCategories c ON g.categoryId = c.id WHERE g.id = ?`,
        [id]
      );
      return {
        ...row,
        isFeatured: Boolean(row.isFeatured),
        category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
      };
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) {
          fields.push(`${k} = ?`);
          values.push(k === "isFeatured" ? (v ? 1 : 0) : v);
        }
      }
      if (fields.length > 0) {
        values.push(where.id);
        await execute(`UPDATE Gallery SET ${fields.join(", ")} WHERE id = ?`, values);
      }
      return queryOne("SELECT * FROM Gallery WHERE id = ?", [where.id]);
    },
    async delete({ where }: { where: { id: string } }) {
      await execute("DELETE FROM Gallery WHERE id = ?", [where.id]);
      return { id: where.id };
    },
    async count({ where }: { where?: any } = {}) {
      if (where?.categoryId) {
        const res = await queryOne<{ total: number }>(
          "SELECT COUNT(*) as total FROM Gallery WHERE categoryId = ?",
          [where.categoryId]
        );
        return res ? Number(res.total) : 0;
      }
      const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Gallery");
      return res ? Number(res.total) : 0;
    },
  },

  enquiries: {
    async findMany({ where, orderBy, take, select }: { where?: any; orderBy?: any; take?: number; select?: any } = {}) {
      let sql = "SELECT * FROM Enquiries";
      const params: any[] = [];
      const conditions: string[] = [];

      if (where?.status) {
        conditions.push("status = ?");
        params.push(where.status);
      }
      if (where?.service) {
        conditions.push("service = ?");
        params.push(where.service);
      }
      if (where?.OR && Array.isArray(where.OR)) {
        const searchVal = where.OR[0]?.name?.contains || "";
        if (searchVal) {
          conditions.push("(name LIKE ? OR phone LIKE ? OR email LIKE ? OR message LIKE ?)");
          params.push(`%${searchVal}%`, `%${searchVal}%`, `%${searchVal}%`, `%${searchVal}%`);
        }
      }

      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
      }

      sql += " ORDER BY createdAt DESC";
      if (take) {
        sql += ` LIMIT ${parseInt(String(take))}`;
      }
      return query(sql, params);
    },
    async create({ data, include }: { data: any; include?: any }) {
      const id = data.id || generateId();
      await execute(
        "INSERT INTO Enquiries (id, name, phone, email, service, message, status, internalNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          data.name,
          data.phone,
          data.email || null,
          data.service || "General Consultation",
          data.message,
          data.status || "New",
          data.internalNotes || null,
        ]
      );
      return queryOne("SELECT * FROM Enquiries WHERE id = ?", [id]);
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) {
          fields.push(`${k} = ?`);
          values.push(v);
        }
      }
      if (fields.length > 0) {
        values.push(where.id);
        await execute(`UPDATE Enquiries SET ${fields.join(", ")} WHERE id = ?`, values);
      }
      return queryOne("SELECT * FROM Enquiries WHERE id = ?", [where.id]);
    },
    async delete({ where }: { where: { id: string } }) {
      await execute("DELETE FROM Enquiries WHERE id = ?", [where.id]);
      return { id: where.id };
    },
    async count({ where }: { where?: any } = {}) {
      if (where?.status) {
        const res = await queryOne<{ total: number }>(
          "SELECT COUNT(*) as total FROM Enquiries WHERE status = ?",
          [where.status]
        );
        return res ? Number(res.total) : 0;
      }
      const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Enquiries");
      return res ? Number(res.total) : 0;
    },
  },

  testimonials: {
    async findMany({ where, orderBy }: { where?: any; orderBy?: any } = {}) {
      let sql = "SELECT * FROM Testimonials";
      const params: any[] = [];
      if (where?.isPublished !== undefined) {
        sql += " WHERE isPublished = ?";
        params.push(where.isPublished ? 1 : 0);
      }
      sql += " ORDER BY orderIndex ASC";
      const rows = await query(sql, params);
      return rows.map((r) => ({ ...r, isPublished: Boolean(r.isPublished) }));
    },
    async create({ data, include }: { data: any; include?: any }) {
      const id = data.id || generateId();
      await execute(
        "INSERT INTO Testimonials (id, clientName, clientRole, clientLocation, avatarUrl, rating, reviewText, isPublished, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          data.clientName,
          data.clientRole || "Homeowner",
          data.clientLocation || "Sector 120, Noida",
          data.avatarUrl || null,
          data.rating || 5,
          data.reviewText,
          data.isPublished ?? true ? 1 : 0,
          data.orderIndex || 0,
        ]
      );
      return queryOne("SELECT * FROM Testimonials WHERE id = ?", [id]);
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) {
          fields.push(`${k} = ?`);
          values.push(k === "isPublished" ? (v ? 1 : 0) : v);
        }
      }
      if (fields.length > 0) {
        values.push(where.id);
        await execute(`UPDATE Testimonials SET ${fields.join(", ")} WHERE id = ?`, values);
      }
      return queryOne("SELECT * FROM Testimonials WHERE id = ?", [where.id]);
    },
    async delete({ where }: { where: { id: string } }) {
      await execute("DELETE FROM Testimonials WHERE id = ?", [where.id]);
      return { id: where.id };
    },
    async count() {
      const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Testimonials");
      return res ? Number(res.total) : 0;
    },
  },

  sEOSettings: {
    async findMany({ orderBy }: { orderBy?: any } = {}) {
      return query("SELECT * FROM SEOSettings ORDER BY pageRoute ASC");
    },
    async findUnique({ where }: { where: { pageRoute: string } }) {
      return queryOne("SELECT * FROM SEOSettings WHERE pageRoute = ? LIMIT 1", [where.pageRoute]);
    },
    async upsert({ where, update, create }: { where: { pageRoute: string }; update: any; create: any }) {
      const existing = await queryOne("SELECT id FROM SEOSettings WHERE pageRoute = ?", [where.pageRoute]);
      if (existing) {
        await execute(
          `UPDATE SEOSettings SET metaTitle = ?, metaDesc = ?, keywords = ?, canonicalUrl = ?, ogTitle = ?, ogDesc = ? WHERE pageRoute = ?`,
          [
            update.metaTitle,
            update.metaDesc,
            update.keywords || "",
            update.canonicalUrl || null,
            update.ogTitle || update.metaTitle,
            update.ogDesc || update.metaDesc,
            where.pageRoute,
          ]
        );
        return queryOne("SELECT * FROM SEOSettings WHERE pageRoute = ?", [where.pageRoute]);
      } else {
        const id = generateId();
        await execute(
          `INSERT INTO SEOSettings (id, pageRoute, metaTitle, metaDesc, keywords, canonicalUrl, ogTitle, ogDesc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            where.pageRoute,
            create.metaTitle,
            create.metaDesc,
            create.keywords || "",
            create.canonicalUrl || null,
            create.ogTitle || create.metaTitle,
            create.ogDesc || create.metaDesc,
          ]
        );
        return queryOne("SELECT * FROM SEOSettings WHERE id = ?", [id]);
      }
    },
  },

  activityLogs: {
    async create({ data, include }: { data: any; include?: any }) {
      const id = generateId();
      await execute(
        "INSERT INTO ActivityLogs (id, action, adminEmail, details, ipAddress) VALUES (?, ?, ?, ?, ?)",
        [id, data.action, data.adminEmail, data.details || null, data.ipAddress || "localhost"]
      );
    },
    async findMany({ orderBy, take }: { orderBy?: any; take?: number } = {}) {
      const limit = take ? parseInt(String(take)) : 10;
      return query(`SELECT * FROM ActivityLogs ORDER BY createdAt DESC LIMIT ${limit}`);
    },
  },
};

export default db;
