"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BookOpen, Plus, X, CheckCircle, Pencil, Trash2,
  Eye, EyeOff, Globe, FileText
} from "lucide-react";
import { postsAPI } from "@/lib/api";
import { formatDate, truncate } from "@/lib/utils";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<any>();

  const load = () => {
    setLoading(true);
    postsAPI.getPublished()
      .then(res => setPosts(res.data.data))
      .catch(() => setPosts([
        { id: "1", title: "Breast Cancer Awareness", content: "Early detection saves lives...", published: true, createdAt: "2024-10-22", author: { firstName: "Abena", lastName: "Mensah" } },
        { id: "2", title: "Prenatal Care Guide", content: "Regular prenatal visits are crucial...", published: false, createdAt: "2024-09-15", author: { firstName: "Kwame", lastName: "Asante" } },
      ]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      if (editing) {
        await postsAPI.update(editing.id, data);
        setSuccess("Post updated successfully");
      } else {
        await postsAPI.create(data);
        setSuccess("Post created as draft");
      }
      reset();
      setShowForm(false);
      setEditing(null);
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditing(post);
    setValue("title", post.title);
    setValue("content", post.content);
    setValue("coverImage", post.coverImage || "");
    setShowForm(true);
  };

  const handlePublishToggle = async (post: any) => {
    try {
      await postsAPI.publish(post.id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to toggle publish");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await postsAPI.delete(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Cannot delete post");
    }
  };

  const published = posts.filter(p => p.published);
  const drafts = posts.filter(p => !p.published);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-1">{published.length} published · {drafts.length} drafts</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); reset(); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Write Post
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 rounded-xl p-4">
          <CheckCircle className="w-5 h-5" /><p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Published", value: published.length, icon: Globe, color: "bg-green-100 text-green-700" },
          { label: "Drafts", value: drafts.length, icon: FileText, color: "bg-amber-100 text-amber-700" },
          { label: "Total Posts", value: posts.length, icon: BookOpen, color: "bg-blue-100 text-blue-700" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Post form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl my-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-brand-dark">
                {editing ? "Edit Post" : "Write New Post"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Post Title *</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="input-field text-lg font-medium"
                  placeholder="Write a compelling title..."
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{String(errors.title.message)}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Cover Image URL</label>
                <input
                  {...register("coverImage")}
                  className="input-field"
                  placeholder="https://images.unsplash.com/... (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Content *</label>
                <textarea
                  {...register("content", { required: "Content is required", minLength: { value: 100, message: "Content must be at least 100 characters" } })}
                  className="input-field resize-none h-64 font-mono text-sm"
                  placeholder="Write your health article here... Use double line breaks to separate paragraphs."
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{String(errors.content.message)}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? "Saving..." : editing ? "Update Post" : "Save as Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 shadow-card animate-pulse h-28" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No posts yet. Write your first health article.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-card p-5 flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                post.published ? "bg-green-100" : "bg-amber-100"
              }`}>
                {post.published
                  ? <Globe className="w-5 h-5 text-green-600" />
                  : <FileText className="w-5 h-5 text-amber-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-display font-bold text-brand-dark truncate">{post.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-1 mb-2">{truncate(post.content, 100)}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(post.createdAt)}</span>
                  {post.author && <span>by Dr. {post.author.firstName} {post.author.lastName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handlePublishToggle(post)}
                  title={post.published ? "Unpublish" : "Publish"}
                  className={`p-2 rounded-xl transition-colors ${
                    post.published
                      ? "text-green-600 hover:bg-green-50"
                      : "text-gray-400 hover:bg-brand-light hover:text-brand-primary"
                  }`}
                >
                  {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 hover:bg-brand-light rounded-xl transition-colors text-gray-400 hover:text-brand-primary"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500"
                >
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
