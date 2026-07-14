"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  Upload,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { postsApi, ApiError } from "@/lib/api";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const emptyForm = { title: "", content: "" };

export default function PostsPage() {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const currentUser = useAuthStore((s) => s.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [published, setPublished] = useState(false); // Interactive publishing state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await postsApi.listAdmin());
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load posts",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPublished(false); // Default new posts to Draft
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      content: post.content,
    });
    setPublished(post.published); // Sync state with actual post status
    setImageFile(null);
    setImagePreview(post.coverImage ?? "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("published", published ? "true" : "false"); // Send publication state to backend

      if (imageFile) {
        formData.append("coverImage", imageFile);
      }

      if (editing) {
        if (editing.authorId !== currentUserId) {
          toast.error("You can only edit posts you authored");
          return;
        }
        await postsApi.update(editing.id, formData);
        toast.success(
          published ? "Post updated and published" : "Post draft updated",
        );
      } else {
        await postsApi.create(formData);
        toast.success(
          published ? "Post successfully published" : "Post saved as draft",
        );
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save post",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await postsApi.togglePublish(post.id);
      toast.success(post.published ? "Post unpublished" : "Post published");
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update post",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await postsApi.remove(id);
      toast.success("Post deleted");
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete post",
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Write and publish hospital news and stories."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[900px] w-[95vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl border border-slate-200/80 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-800">
                    {editing ? "Edit Post" : "Create New Post"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400 mt-0.5">
                    Draft your insights. Publish when you are ready.
                  </DialogDescription>
                </div>
              </div>

              {/* Main Workspace Layout */}
              <div className="flex-1 overflow-y-auto bg-white p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                  {/* Left Column: Text Canvas (Spans 8 columns) */}
                  <div className="lg:col-span-8 flex flex-col space-y-4 pr-1">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Post Title
                      </Label>
                      <Input
                        className="text-2xl md:text-3xl font-extrabold tracking-tight h-auto border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-slate-200 text-slate-800"
                        placeholder="An engaging headline..."
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                      />
                    </div>

                    <div className="border-b border-slate-100 w-full" />

                    <div className="space-y-1 flex-1 flex flex-col">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Article Content
                      </Label>
                      <Textarea
                        className="flex-1 min-h-[300px] text-base leading-relaxed border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 resize-none placeholder:text-slate-300 text-slate-700 py-2"
                        placeholder="Start writing your article details here..."
                        value={form.content}
                        onChange={(e) =>
                          setForm({ ...form, content: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Right Column: Publishing Sidebar (Spans 4 columns) */}
                  <div className="lg:col-span-4 flex flex-col space-y-6 lg:border-l lg:border-slate-100 lg:pl-6">
                    {/* Cover Image Upload Block */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Featured Cover
                      </Label>

                      <div className="space-y-3">
                        {imagePreview ? (
                          <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                            <img
                              src={imagePreview}
                              alt="Cover preview"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="h-8 text-xs font-medium"
                                onClick={() =>
                                  document
                                    .getElementById("file-upload")
                                    ?.click()
                                }
                              >
                                Replace
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="h-8 text-xs font-medium"
                                onClick={() => {
                                  setImageFile(null);
                                  setImagePreview("");
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                            className="cursor-pointer border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 rounded-lg aspect-video flex flex-col items-center justify-center p-4 transition-all duration-200 group text-center bg-slate-50/50"
                          >
                            <div className="rounded-full bg-white p-2.5 shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors border border-slate-100">
                              <Upload className="h-4 w-4" />
                            </div>
                            <span className="mt-2 text-xs font-semibold text-slate-600">
                              Upload Cover
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              JPEG, PNG up to 5MB
                            </span>
                          </div>
                        )}
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setImageFile(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Metadata Detail Card */}
                    <Card className="bg-slate-50/50 border-slate-200/50 shadow-none rounded-lg">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-200/40 pb-2">
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Post Settings
                          </h4>
                        </div>
                        <div className="space-y-4 text-xs">
                          {/* 
                            UI/UX WORKSPACE FIX: Interactive Binary Segment Selector 
                            Replaces static badge so you can switch status dynamically.
                          */}
                          <div className="space-y-1.5">
                            <span className="text-slate-500 font-medium">
                              Moderation Status
                            </span>
                            <div className="grid grid-cols-2 gap-1 bg-slate-200/60 p-1 rounded-lg border border-slate-200">
                              <button
                                type="button"
                                onClick={() => setPublished(false)}
                                className={`py-1.5 text-[11px] font-semibold rounded-md transition-all duration-200 ${
                                  !published
                                    ? "bg-white text-slate-800 shadow-xs"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                Draft
                              </button>
                              <button
                                type="button"
                                onClick={() => setPublished(true)}
                                className={`py-1.5 text-[11px] font-semibold rounded-md transition-all duration-200 ${
                                  published
                                    ? "bg-emerald-500 text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                Publish
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-slate-500">Author</span>
                            <span className="font-semibold text-slate-700">
                              {currentUser
                                ? `${currentUser.firstName} ${currentUser.lastName}`
                                : "You"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Styled Footer Action Bar */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
                <Button
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                  className="h-9 text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-medium text-xs px-4"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className={`h-9 px-5 text-white font-medium text-xs rounded-md transition-colors shadow-sm ${
                    published
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {saving
                    ? "Saving Changes…"
                    : editing
                      ? published
                        ? "Update & Publish"
                        : "Update Draft"
                      : published
                        ? "Publish Post"
                        : "Save as Draft"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Newspaper}
                title="No posts yet"
                description="Write your first post above."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-xs truncate font-medium text-slate-700">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {post.author?.firstName} {post.author?.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          post.published
                            ? "border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold"
                            : "border-0 bg-slate-100 text-slate-700 hover:bg-slate-100 font-semibold"
                        }
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(post.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-semibold mr-1"
                        onClick={() => handleTogglePublish(post)}
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(post)}
                      >
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`Delete "${post.title}"?`}
                        description="This cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(post.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
