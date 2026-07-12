"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
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
import type { PostPayload } from "@/lib/api";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const emptyForm: PostPayload = { title: "", content: "", coverImage: "" };

export default function PostsPage() {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await postsApi.list());
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
    setDialogOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      content: post.content,
      coverImage: post.coverImage ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        if (editing.authorId !== currentUserId) {
          toast.error("You can only edit posts you authored");
          return;
        }
        await postsApi.update(editing.id, {
          title: form.title,
          content: form.content,
        });
        toast.success("Post updated");
      } else {
        await postsApi.create(form);
        toast.success("Post saved as draft");
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle>
                <DialogDescription>
                  New posts save as a draft — publish separately when ready.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover image URL</Label>
                  <Input
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm({ ...form, coverImage: e.target.value })
                    }
                    placeholder="https://…"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    rows={10}
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
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
                    <TableCell className="max-w-xs truncate font-medium">
                      {post.title}
                    </TableCell>
                    <TableCell>
                      {post.author?.firstName} {post.author?.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          post.published
                            ? "border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "border-0 bg-slate-100 text-slate-700 hover:bg-slate-100"
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
                        onClick={() => handleTogglePublish(post)}
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
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
