"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Download,
  Trash2,
  Clock,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  RefreshCw,
  MessageSquare
} from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string;
  status: string;
  internalNotes: string | null;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      let url = "/api/enquiries?";
      if (statusFilter !== "All") url += `status=${encodeURIComponent(statusFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setEnquiries(data.enquiries || []);
      }
    } catch {
      toast.error("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Enquiry status updated to ${newStatus}`);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notesDraft }),
      });
      if (res.ok) {
        toast.success("Internal notes saved");
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, internalNotes: notesDraft } : e))
        );
        setEditingNotesId(null);
      }
    } catch {
      toast.error("Failed to save notes");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Enquiry deleted");
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      toast.error("Failed to delete enquiry");
    }
  };

  const statuses = ["All", "New", "Contacted", "In Progress", "Completed", "Cancelled"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Customer Enquiries Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review leads, change workflow statuses, log internal follow-up notes, and export to CSV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/enquiries/export"
            download
            className="px-4 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-surface/80 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-sm"
          >
            <Download size={14} />
            <span>Export to CSV</span>
          </a>

          <button
            onClick={fetchEnquiries}
            className="p-2.5 rounded-xl bg-brand-surface border border-brand-gold/30 text-gray-300 hover:text-brand-gold transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-gold/20 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-surface border border-brand-gold/20 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-gold"
          />
        </form>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-brand-gold text-brand-black"
                  : "bg-brand-surface text-gray-400 hover:text-white border border-brand-gold/15"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table / List */}
      <div className="bg-brand-charcoal border border-brand-gold/20 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-brand-gold font-medium animate-pulse">
            Loading enquiries from database...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-400">
            No enquiries found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-brand-surface border-b border-brand-gold/20 text-[11px] uppercase tracking-wider text-brand-gold">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Client / Phone</th>
                  <th className="py-3.5 px-4 font-bold">Service Requested</th>
                  <th className="py-3.5 px-4 font-bold">Message</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Internal Notes</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/10">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-brand-surface/40 transition-colors">
                    {/* Client Info */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-white block text-sm">
                        {enq.name}
                      </span>
                      <a
                        href={`tel:${enq.phone}`}
                        className="text-brand-gold hover:underline font-mono text-xs block mt-0.5"
                      >
                        +91 {enq.phone}
                      </a>
                      {enq.email && (
                        <span className="text-[11px] text-gray-400 block">{enq.email}</span>
                      )}
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        {new Date(enq.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-goldLight font-semibold text-[11px]">
                        {enq.service}
                      </span>
                    </td>

                    {/* Message */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="line-clamp-2 text-gray-300 italic">
                        &ldquo;{enq.message}&rdquo;
                      </p>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 border outline-none bg-brand-black ${
                          enq.status === "New"
                            ? "border-amber-500 text-amber-400"
                            : enq.status === "Contacted"
                            ? "border-cyan-500 text-cyan-400"
                            : enq.status === "In Progress"
                            ? "border-blue-500 text-blue-400"
                            : enq.status === "Completed"
                            ? "border-emerald-500 text-emerald-400"
                            : "border-red-500 text-red-400"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Internal Notes */}
                    <td className="py-4 px-4 max-w-xs">
                      {editingNotesId === enq.id ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={2}
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            className="w-full p-2 rounded-lg bg-brand-surface border border-brand-gold/40 text-xs text-white outline-none resize-none"
                            placeholder="Add notes..."
                          />
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSaveNotes(enq.id)}
                              className="px-2 py-1 bg-brand-gold text-brand-black rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-1 text-gray-400 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNotesId(enq.id);
                            setNotesDraft(enq.internalNotes || "");
                          }}
                          className="cursor-pointer group p-1.5 rounded hover:bg-brand-surface border border-transparent hover:border-brand-gold/20"
                        >
                          <p className="text-gray-400 line-clamp-2 text-[11px]">
                            {enq.internalNotes || "Click to add internal follow-up notes..."}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/91${enq.phone}?text=${encodeURIComponent(
                            `Hi ${enq.name}, Monish Pasha here from MA Carpenter and Interior Noida regarding your enquiry for ${enq.service}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-[11px] font-semibold transition-colors"
                        >
                          WhatsApp
                        </a>

                        <button
                          onClick={() => handleDelete(enq.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Spam"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

