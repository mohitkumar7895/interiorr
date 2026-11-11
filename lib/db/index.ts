import { pool, query, queryOne, execute, initDatabaseTables } from "./mysql";
import crypto from "crypto";
import {
  jsonServices,
  jsonProjects,
  jsonGallery,
  jsonGalleryCategories,
  jsonTestimonials,
  jsonBlogs,
  jsonSiteSettings,
  jsonHomeSections,
  jsonSEO,
  jsonEnquiries,
  jsonAdmin,
  jsonActivityLogs,
} from "./jsonStore";

export function generateId(): string {
  return crypto.randomUUID();
}

export const db = {
  admin: {
    async findUnique({ where, select }: { where: { email?: string; id?: string }; select?: any }) {
      try {
        if (where.email) {
          const row = await queryOne("SELECT * FROM Admin WHERE email = ? LIMIT 1", [where.email.toLowerCase()]);
          if (row) return row;
        }
        if (where.id) {
          const row = await queryOne("SELECT * FROM Admin WHERE id = ? LIMIT 1", [where.id]);
          if (row) return row;
        }
      } catch {}
      return jsonAdmin.findUnique({ where });
    },
    async create({ data, include }: { data: any; include?: any }) {
      const jsonRes = jsonAdmin.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          "INSERT INTO Admin (id, email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?, ?)",
          [id, data.email.toLowerCase(), data.password, data.name, data.role || "superadmin", data.avatar || null]
        );
      } catch {}
      return jsonRes;
    },
    async upsert({ where, update, create }: { where: { email: string }; update: any; create: any }) {
      const jsonRes = jsonAdmin.upsert({ where, update, create });
      try {
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
        } else {
          const id = create.id || generateId();
          await execute(
            "INSERT INTO Admin (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)",
            [id, where.email.toLowerCase(), create.password, create.name, create.role || "superadmin"]
          );
        }
      } catch {}
      return jsonRes;
    },
  },

  siteSettings: {
    async findUnique({ where }: { where: { id: string } }) {
      try {
        const row = await queryOne("SELECT * FROM SiteSettings WHERE id = ? LIMIT 1", [where.id]);
        if (row) return row;
      } catch {}
      return jsonSiteSettings.findUnique({ where });
    },
    async upsert({ where, update, create }: { where: { id: string }; update: any; create: any }) {
      const jsonRes = jsonSiteSettings.upsert({ where, update, create });
      try {
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
        } else {
          const id = create.id || "default";
          const keys = Object.keys(create);
          const placeholders = keys.map(() => "?").join(", ");
          const values = Object.values(create);
          await execute(`INSERT INTO SiteSettings (${keys.join(", ")}) VALUES (${placeholders})`, values);
        }
      } catch {}
      return jsonRes;
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const jsonRes = jsonSiteSettings.update({ where, data });
      try {
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
      } catch {}
      return jsonRes;
    },
  },

  homeSections: {
    async findMany({ orderBy }: { orderBy?: { orderIndex?: "asc" | "desc" } } = {}) {
      try {
        const direction = orderBy?.orderIndex === "desc" ? "DESC" : "ASC";
        const rows = await query(`SELECT * FROM HomeSections ORDER BY orderIndex ${direction}`);
        if (rows && rows.length > 0) return rows;
      } catch {}
      return jsonHomeSections.findMany();
    },
    async update({ where, data }: { where: { sectionKey: string }; data: any }) {
      const jsonRes = jsonHomeSections.update({ where, data });
      try {
        const fields: string[] = [];
        const values: any[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) {
            fields.push(`${k} = ?`);
            values.push(k === "isEnabled" ? (v ? 1 : 0) : v);
          }
        }
        if (fields.length > 0) {
          values.push(where.sectionKey);
          await execute(`UPDATE HomeSections SET ${fields.join(", ")} WHERE sectionKey = ?`, values);
        }
      } catch {}
      return jsonRes;
    },
  },

  services: {
    async findMany({ where, orderBy, take, select }: { where?: any; orderBy?: any; take?: number; select?: any } = {}) {
      try {
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
        if (rows && rows.length > 0) {
          return rows.map((r) => ({ ...r, isPublished: Boolean(r.isPublished) }));
        }
      } catch {}
      return jsonServices.findMany({ where, orderBy, take });
    },
    async findUnique({ where }: { where: { slug?: string; id?: string } }) {
      try {
        let row = null;
        if (where.slug) {
          row = await queryOne("SELECT * FROM Services WHERE slug = ? LIMIT 1", [where.slug]);
        } else if (where.id) {
          row = await queryOne("SELECT * FROM Services WHERE id = ? LIMIT 1", [where.id]);
        }
        if (row) {
          return { ...row, isPublished: Boolean(row.isPublished) };
        }
      } catch {}
      return jsonServices.findUnique({ where });
    },
    async create({ data, include }: { data: any; include?: any }) {
      const jsonRes = jsonServices.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          `INSERT INTO Services (id, slug, title, category, shortDesc, fullDesc, icon, featuredImage, images, features, benefits, seoTitle, seoDesc, isPublished, orderIndex)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            jsonRes.slug,
            jsonRes.title,
            jsonRes.category || "Interior",
            jsonRes.shortDesc,
            jsonRes.fullDesc,
            jsonRes.icon || "Hammer",
            jsonRes.featuredImage,
            jsonRes.images,
            jsonRes.features,
            jsonRes.benefits,
            jsonRes.seoTitle || null,
            jsonRes.seoDesc || null,
            jsonRes.isPublished ? 1 : 0,
            jsonRes.orderIndex || 0,
          ]
        );
      } catch {}
      return jsonRes;
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const jsonRes = jsonServices.update({ where, data });
      try {
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
      } catch {}
      return jsonRes;
    },
    async delete({ where }: { where: { id: string } }) {
      const jsonRes = jsonServices.delete({ where });
      try {
        await execute("DELETE FROM Services WHERE id = ?", [where.id]);
      } catch {}
      return jsonRes;
    },
    async count() {
      try {
        const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Services");
        if (res) return Number(res.total);
      } catch {}
      return jsonServices.count();
    },
  },

  projects: {
    async findMany({ where, orderBy, take, include, select }: { where?: any; orderBy?: any; take?: number; include?: any; select?: any } = {}) {
      try {
        let sql = "SELECT * FROM Projects";
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
        if (rows && rows.length > 0) {
          const projs = rows.map((r) => ({ ...r, isPublished: Boolean(r.isPublished), isFeatured: Boolean(r.isFeatured) }));
          if (include?.images) {
            const projectIds = projs.map((p) => p.id);
            if (projectIds.length > 0) {
              const placeholders = projectIds.map(() => "?").join(", ");
              const images = await query(`SELECT * FROM ProjectImages WHERE projectId IN (${placeholders}) ORDER BY orderIndex ASC`, projectIds).catch(() => []);
              return projs.map((p) => ({
                ...p,
                images: images.filter((img) => img.projectId === p.id),
              }));
            }
          }
          return projs;
        }
      } catch {}
      return jsonProjects.findMany({ where, orderBy, take, include });
    },
    async findUnique({ where, include }: { where: { slug?: string; id?: string }; include?: any }) {
      try {
        let row = null;
        if (where.slug) {
          row = await queryOne("SELECT * FROM Projects WHERE slug = ? LIMIT 1", [where.slug]);
        } else if (where.id) {
          row = await queryOne("SELECT * FROM Projects WHERE id = ? LIMIT 1", [where.id]);
        }
        if (row) {
          row.isPublished = Boolean(row.isPublished);
          row.isFeatured = Boolean(row.isFeatured);
          if (include?.images) {
            const images = await query("SELECT * FROM ProjectImages WHERE projectId = ? ORDER BY orderIndex ASC", [row.id]).catch(() => []);
            row.images = images;
          }
          return row;
        }
      } catch {}
      return jsonProjects.findUnique({ where });
    },
    async create({ data, include }: { data: any; include?: any }) {
      const jsonRes = jsonProjects.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          `INSERT INTO Projects (id, slug, title, category, client, location, completedDate, area, shortDesc, description, featuredImage, beforeImage, afterImage, isPublished, isFeatured, orderIndex)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            jsonRes.slug,
            jsonRes.title,
            jsonRes.category || "Living Room",
            jsonRes.client || null,
            jsonRes.location || "Noida, NCR",
            jsonRes.completedDate || null,
            jsonRes.area || "1,850 sq.ft",
            jsonRes.shortDesc || "",
            jsonRes.description || "",
            jsonRes.featuredImage,
            jsonRes.beforeImage || null,
            jsonRes.afterImage || null,
            jsonRes.isPublished ? 1 : 0,
            jsonRes.isFeatured ? 1 : 0,
            jsonRes.orderIndex || 0,
          ]
        );
      } catch {}
      return jsonRes;
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const jsonRes = jsonProjects.update({ where, data });
      try {
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
      } catch {}
      return jsonRes;
    },
    async delete({ where }: { where: { id: string } }) {
      const jsonRes = jsonProjects.delete({ where });
      try {
        await execute("DELETE FROM ProjectImages WHERE projectId = ?", [where.id]).catch(() => {});
        await execute("DELETE FROM Projects WHERE id = ?", [where.id]);
      } catch {}
      return jsonRes;
    },
    async count() {
      try {
        const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Projects");
        if (res) return Number(res.total);
      } catch {}
      return jsonProjects.count();
    },
  },

  galleryCategories: {
    async findMany({ orderBy }: { orderBy?: any } = {}) {
      try {
        const rows = await query("SELECT * FROM GalleryCategories ORDER BY orderIndex ASC");
        if (rows && rows.length > 0) return rows;
      } catch {}
      return jsonGalleryCategories.findMany();
    },
    async findUnique({ where }: { where: { slug?: string; id?: string } }) {
      try {
        let row = null;
        if (where.slug) {
          row = await queryOne("SELECT * FROM GalleryCategories WHERE slug = ? LIMIT 1", [where.slug]);
        } else if (where.id) {
          row = await queryOne("SELECT * FROM GalleryCategories WHERE id = ? LIMIT 1", [where.id]);
        }
        if (row) return row;
      } catch {}
      return jsonGalleryCategories.findUnique({ where });
    },
    async create({ data }: { data: any }) {
      const jsonRes = jsonGalleryCategories.create({ data });
      try {
        const id = jsonRes.id;
        await execute("INSERT INTO GalleryCategories (id, name, slug, orderIndex) VALUES (?, ?, ?, ?)", [
          id,
          jsonRes.name,
          jsonRes.slug,
          jsonRes.orderIndex || 0,
        ]);
      } catch {}
      return jsonRes;
    },
  },

  gallery: {
    async findMany({ where, orderBy, take, include }: { where?: any; orderBy?: any; take?: number; include?: any } = {}) {
      try {
        let sql = "SELECT * FROM Gallery";
        const params: any[] = [];
        if (where?.isFeatured !== undefined) {
          sql += " WHERE isFeatured = ?";
          params.push(where.isFeatured ? 1 : 0);
        }
        sql += " ORDER BY orderIndex ASC";
        if (take) {
          sql += ` LIMIT ${parseInt(String(take))}`;
        }
        const rows = await query(sql, params);
        if (rows && rows.length > 0) {
          const items = rows.map((r) => ({ ...r, isFeatured: Boolean(r.isFeatured) }));
          if (include?.category) {
            const categories = await query("SELECT * FROM GalleryCategories").catch(() => []);
            return items.map((item) => ({
              ...item,
              category: categories.find((c) => c.id === item.categoryId) || null,
            }));
          }
          return items;
        }
      } catch {}
      return jsonGallery.findMany({ where, orderBy, take, include });
    },
    async findUnique({ where, include }: { where: { id: string }; include?: any }) {
      try {
        const row = await queryOne("SELECT * FROM Gallery WHERE id = ? LIMIT 1", [where.id]);
        if (row) {
          row.isFeatured = Boolean(row.isFeatured);
          if (include?.category && row.categoryId) {
            row.category = await queryOne("SELECT * FROM GalleryCategories WHERE id = ?", [row.categoryId]).catch(() => null);
          }
          return row;
        }
      } catch {}
      return jsonGallery.findUnique({ where });
    },
    async create({ data }: { data: any }) {
      const jsonRes = jsonGallery.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          "INSERT INTO Gallery (id, title, categoryId, imageUrl, isFeatured, orderIndex) VALUES (?, ?, ?, ?, ?, ?)",
          [
            id,
            jsonRes.title || "",
            jsonRes.categoryId || null,
            jsonRes.imageUrl,
            jsonRes.isFeatured ? 1 : 0,
            jsonRes.orderIndex || 0,
          ]
        );
      } catch {}
      return jsonRes;
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const jsonRes = jsonGallery.update({ where, data });
      try {
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
      } catch {}
      return jsonRes;
    },
    async delete({ where }: { where: { id: string } }) {
      const jsonRes = jsonGallery.delete({ where });
      try {
        await execute("DELETE FROM Gallery WHERE id = ?", [where.id]);
      } catch {}
      return jsonRes;
    },
    async count() {
      try {
        const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Gallery");
        if (res) return Number(res.total);
      } catch {}
      return jsonGallery.count();
    },
  },

  testimonials: {
    async findMany({ where, orderBy, take }: { where?: any; orderBy?: any; take?: number } = {}) {
      try {
        let sql = "SELECT * FROM Testimonials";
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
        if (rows && rows.length > 0) {
          return rows.map((r) => ({ ...r, isPublished: Boolean(r.isPublished) }));
        }
      } catch {}
      return jsonTestimonials.findMany({ where, orderBy, take });
    },
    async findUnique({ where }: { where: { id: string } }) {
      try {
        const row = await queryOne("SELECT * FROM Testimonials WHERE id = ? LIMIT 1", [where.id]);
        if (row) return { ...row, isPublished: Boolean(row.isPublished) };
      } catch {}
      return jsonTestimonials.findUnique({ where });
    },
    async create({ data }: { data: any }) {
      const jsonRes = jsonTestimonials.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          `INSERT INTO Testimonials (id, clientName, clientRole, clientLocation, rating, reviewText, isPublished, orderIndex)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            jsonRes.clientName,
            jsonRes.clientRole || "Homeowner",
            jsonRes.clientLocation || "Sector 120, Noida",
            jsonRes.rating || 5,
            jsonRes.reviewText,
            jsonRes.isPublished ? 1 : 0,
            jsonRes.orderIndex || 0,
          ]
        );
      } catch {}
      return jsonRes;
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const jsonRes = jsonTestimonials.update({ where, data });
      try {
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
      } catch {}
      return jsonRes;
    },
    async delete({ where }: { where: { id: string } }) {
      const jsonRes = jsonTestimonials.delete({ where });
      try {
        await execute("DELETE FROM Testimonials WHERE id = ?", [where.id]);
      } catch {}
      return jsonRes;
    },
    async count() {
      try {
        const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Testimonials");
        if (res) return Number(res.total);
      } catch {}
      return jsonTestimonials.count();
    },
  },

  blogs: {
    async findMany(options?: { where?: any; orderBy?: any; take?: number }) {
      try {
        let sql = "SELECT * FROM Blogs";
        const params: any[] = [];
        if (options?.where?.isPublished !== undefined) {
          sql += " WHERE isPublished = ?";
          params.push(options.where.isPublished ? 1 : 0);
        }
        sql += " ORDER BY publishedAt DESC";
        if (options?.take) {
          sql += ` LIMIT ${parseInt(String(options.take))}`;
        }
        const rows = await query(sql, params);
        if (rows && rows.length > 0) {
          return rows.map((r) => ({ ...r, isPublished: Boolean(r.isPublished) }));
        }
      } catch {}
      return jsonBlogs.findMany(options);
    },
    async findFirst({ where }: { where: { slug?: string; id?: string; OR?: Array<{ id?: string; slug?: string }> } }) {
      try {
        if (where.slug) {
          const row = await queryOne("SELECT * FROM Blogs WHERE slug = ? LIMIT 1", [where.slug]);
          if (row) return { ...row, isPublished: Boolean(row.isPublished) };
        }
        if (where.id) {
          const row = await queryOne("SELECT * FROM Blogs WHERE id = ? LIMIT 1", [where.id]);
          if (row) return { ...row, isPublished: Boolean(row.isPublished) };
        }
        if (where.OR && where.OR.length > 0) {
          for (const cond of where.OR) {
            if (cond.slug) {
              const row = await queryOne("SELECT * FROM Blogs WHERE slug = ? LIMIT 1", [cond.slug]);
              if (row) return { ...row, isPublished: Boolean(row.isPublished) };
            }
            if (cond.id) {
              const row = await queryOne("SELECT * FROM Blogs WHERE id = ? LIMIT 1", [cond.id]);
              if (row) return { ...row, isPublished: Boolean(row.isPublished) };
            }
          }
        }
      } catch {}
      return jsonBlogs.findFirst({ where });
    },
    async findUnique({ where }: { where: { slug?: string; id?: string } }) {
      try {
        if (where.slug) {
          const row = await queryOne("SELECT * FROM Blogs WHERE slug = ? LIMIT 1", [where.slug]);
          if (row) return { ...row, isPublished: Boolean(row.isPublished) };
        }
        if (where.id) {
          const row = await queryOne("SELECT * FROM Blogs WHERE id = ? LIMIT 1", [where.id]);
          if (row) return { ...row, isPublished: Boolean(row.isPublished) };
        }
      } catch {}
      return jsonBlogs.findUnique({ where });
    },
    async create({ data }: { data: any }) {
      const jsonRes = jsonBlogs.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          `INSERT INTO Blogs (id, slug, title, excerpt, content, featuredImage, category, author, readTime, publishedAt, isPublished, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
          [
            id,
            jsonRes.slug,
            jsonRes.title,
            jsonRes.excerpt,
            jsonRes.content,
            jsonRes.featuredImage,
            jsonRes.category || "Interior Design",
            jsonRes.author || "Monish Pasha",
            jsonRes.readTime || "4 min read",
            jsonRes.publishedAt,
            jsonRes.isPublished ? 1 : 0,
          ]
        );
      } catch (err) {
        console.error("MySQL Blogs create error:", err);
      }
      return jsonRes;
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const jsonRes = jsonBlogs.update({ where, data });
      try {
        const fields: string[] = [];
        const values: any[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) {
            fields.push(`${k} = ?`);
            values.push(k === "isPublished" ? (v ? 1 : 0) : v);
          }
        }
        fields.push("updatedAt = NOW(3)");
        if (fields.length > 0) {
          values.push(where.id);
          await execute(`UPDATE Blogs SET ${fields.join(", ")} WHERE id = ?`, values);
        }
      } catch (err) {
        console.error("MySQL Blogs update error:", err);
      }
      return jsonRes;
    },
    async delete({ where }: { where: { id: string } }) {
      const jsonRes = jsonBlogs.delete({ where });
      try {
        await execute("DELETE FROM Blogs WHERE id = ? OR slug = ?", [where.id, where.id]);
      } catch (err) {
        console.error("MySQL Blogs delete error:", err);
      }
      return jsonRes;
    },
    async count() {
      try {
        const res = await queryOne<{ total: number }>("SELECT COUNT(*) as total FROM Blogs");
        if (res) return Number(res.total);
      } catch {}
      return jsonBlogs.count();
    },
  },

  sEOSettings: {
    async findMany({ orderBy }: { orderBy?: any } = {}) {
      try {
        const rows = await query("SELECT * FROM SEOSettings ORDER BY pageRoute ASC");
        if (rows && rows.length > 0) return rows;
      } catch {}
      return jsonSEO.findMany();
    },
    async findUnique({ where }: { where: { pageRoute?: string; id?: string } }) {
      try {
        if (where.pageRoute) {
          const row = await queryOne("SELECT * FROM SEOSettings WHERE pageRoute = ? LIMIT 1", [where.pageRoute]);
          if (row) return row;
        }
        if (where.id) {
          const row = await queryOne("SELECT * FROM SEOSettings WHERE id = ? LIMIT 1", [where.id]);
          if (row) return row;
        }
      } catch {}
      return jsonSEO.findUnique({ where });
    },
    async upsert({ where, update, create }: { where: { pageRoute: string }; update: any; create: any }) {
      const jsonRes = jsonSEO.upsert({ where, update, create });
      try {
        const existing = await queryOne("SELECT id FROM SEOSettings WHERE pageRoute = ?", [where.pageRoute]);
        if (existing) {
          await execute(
            `UPDATE SEOSettings SET metaTitle = ?, metaDesc = ?, keywords = ?, canonicalUrl = ?, ogTitle = ?, ogDesc = ?, updatedAt = NOW(3) WHERE pageRoute = ?`,
            [
              update.metaTitle,
              update.metaDesc || "",
              update.keywords || "",
              update.canonicalUrl || null,
              update.ogTitle || update.metaTitle,
              update.ogDesc || update.metaDesc || "",
              where.pageRoute,
            ]
          );
        } else {
          const id = create.id || generateId();
          await execute(
            `INSERT INTO SEOSettings (id, pageRoute, metaTitle, metaDesc, keywords, canonicalUrl, ogTitle, ogDesc, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
            [
              id,
              where.pageRoute,
              create.metaTitle,
              create.metaDesc || "",
              create.keywords || "",
              create.canonicalUrl || null,
              create.ogTitle || create.metaTitle,
              create.ogDesc || create.metaDesc || "",
            ]
          );
        }
      } catch (err) {
        console.error("MySQL SEOSettings upsert error:", err);
      }
      return jsonRes;
    },
  },

  enquiries: {
    async findMany({ where, orderBy, take }: { where?: any; orderBy?: any; take?: number } = {}) {
      try {
        let sql = "SELECT * FROM Enquiries";
        const params: any[] = [];
        if (where?.status && where.status !== "All") {
          sql += " WHERE status = ?";
          params.push(where.status);
        }
        sql += " ORDER BY createdAt DESC";
        if (take) {
          sql += ` LIMIT ${parseInt(String(take))}`;
        }
        const rows = await query(sql, params);
        if (rows && rows.length > 0) return rows;
      } catch {}
      return jsonEnquiries.findMany({ where, orderBy });
    },
    async findUnique({ where }: { where: { id: string } }) {
      try {
        const row = await queryOne("SELECT * FROM Enquiries WHERE id = ? LIMIT 1", [where.id]);
        if (row) return row;
      } catch {}
      return jsonEnquiries.findUnique({ where });
    },
    async create({ data }: { data: any }) {
      const jsonRes = jsonEnquiries.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          `INSERT INTO Enquiries (id, name, phone, email, service, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, jsonRes.name, jsonRes.phone, jsonRes.email || null, jsonRes.service, jsonRes.message, jsonRes.status || "New"]
        );
      } catch {}
      return jsonRes;
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const jsonRes = jsonEnquiries.update({ where, data });
      try {
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
      } catch {}
      return jsonRes;
    },
    async delete({ where }: { where: { id: string } }) {
      const jsonRes = jsonEnquiries.delete({ where });
      try {
        await execute("DELETE FROM Enquiries WHERE id = ?", [where.id]);
      } catch {}
      return jsonRes;
    },
    async count(options?: { where?: any }) {
      try {
        let sql = "SELECT COUNT(*) as total FROM Enquiries";
        const params: any[] = [];
        if (options?.where?.status) {
          sql += " WHERE status = ?";
          params.push(options.where.status);
        }
        const res = await queryOne<{ total: number }>(sql, params);
        if (res) return Number(res.total);
      } catch {}
      return jsonEnquiries.count(options);
    },
  },

  activityLogs: {
    async findMany({ orderBy, take }: { orderBy?: any; take?: number } = {}) {
      try {
        let sql = "SELECT * FROM ActivityLogs ORDER BY timestamp DESC";
        if (take) {
          sql += ` LIMIT ${parseInt(String(take))}`;
        }
        const rows = await query(sql);
        if (rows && rows.length > 0) return rows;
      } catch {}
      return jsonActivityLogs.findMany({ take });
    },
    async create({ data }: { data: any }) {
      const jsonRes = jsonActivityLogs.create({ data });
      try {
        const id = jsonRes.id;
        await execute(
          `INSERT INTO ActivityLogs (id, action, adminEmail, details, ipAddress) VALUES (?, ?, ?, ?, ?)`,
          [id, jsonRes.action, jsonRes.adminEmail, jsonRes.details || null, jsonRes.ipAddress || null]
        );
      } catch {}
      return jsonRes;
    },
  },
};

export default db;
