"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bell, Plus, X, CheckCircle, Trash2, Pencil, Building2 } from "lucide-react";
import { announcementsAPI, departmentsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<any>();

  const load = () => {
    setLoading(true);
    Promise.allSettled([announcementsAPI.getAll(), departmentsAPI.getAll()])
      .then(([a, d]) => {
        if (a.status === "fulfilled") setAnnouncements(a.value.data.data);
        if (d.status === "fulfilled") setDepartments(d.value.data.data);
      })
      .catch(() => setAnnouncements([
        { id: "1", title: "July Shift Schedule Published", content: "July shift schedules are now live. Please check your dashboard.", departmentId: null, createdAt: "2026-06-30", author: { firstName: "Yaw", lastName: "Fosu" } },
      ]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data, departmentId: data.departmentId || undefined };
      if (editing) {
        await announcementsAPI.update(editing.id, payload);
        setSuccess("Announcement updated");
      } else {
        await announcementsAPI.create(payload);
        setSuccess("Announcement created");
      }
      reset();
      setShowForm(false);
      setEditing(null);
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleEdit = (ann: any) => {
    setEditing(ann);
    setValue("title", ann.title);
    setValue("content", ann.content);
    setValue("departmentId", ann.departmentId || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await announcementsAPI.delete(id);
      load();
    } catch {}
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">Broadcast messages to all staff or specific departments</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); reset(); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 rounded-xl p-4">
          <CheckCircle className="w-5 h-5" /><p className="text-sm">{success}</p>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-brand-dark">
                {editing ? "Edit Announcement" : "New Announcement"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Title *</label>
                <input {...register("title", { required: true })} className="input-field" placeholder="Announcement title" />
                {errors.title && <p className="text-red-500 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Content *</label>
                <textarea {...register("content", { required: true })} className="input-field resize-none h-28" placeholder="Write your announcement..." />
                {errors.content && <p className="text-red-500 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Target Department</label>
                <select {...register("departmentId")} className="input-field">
                  <option value="">— All Staff (Hospital-wide) —</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <p className="text-gray-400 text-xs mt-1">Leave blank to broadcast to all staff</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? "Update" : "Publish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 shadow-card animate-pulse h-28" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-2xl shadow-card p-6 flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                ann.departmentId ? "bg-blue-100" : "bg-brand-light"
              }`}>
                {ann.departmentId
                  ? <Building2 className="w-5 h-5 text-blue-600" />
                  : <Bell className="w-5 h-5 text-brand-primary" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-brand-dark">{ann.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    ann.departmentId ? "bg-blue-100 text-blue-700" : "bg-brand-light text-brand-primary"
                  }`}>
                    {ann.departmentId ? "Department" : "Hospital-wide"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-2">{ann.content}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(ann.createdAt)}</span>
                  {ann.author && <span>by {ann.author.firstName} {ann.author.lastName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(ann)} className="p-2 hover:bg-brand-light rounded-xl transition-colors text-gray-400 hover:text-brand-primary">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ann.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
