"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { announcementsApi, departmentsApi, ApiError } from "@/lib/api";
import type { AnnouncementPayload } from "@/lib/api";
import type { Announcement, Department } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const emptyForm: AnnouncementPayload = {
  title: "",
  content: "",
  departmentId: undefined,
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [a, d] = await Promise.all([
        announcementsApi.list(),
        departmentsApi.list(),
      ]);
      setAnnouncements(
        a.sort(
          (x, y) =>
            new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime(),
        ),
      );
      setDepartments(d);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load announcements",
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

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      title: a.title,
      content: a.content,
      departmentId: a.departmentId ?? undefined,
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
        await announcementsApi.update(editing.id, {
          title: form.title,
          content: form.content,
        });
        toast.success("Announcement updated");
      } else {
        await announcementsApi.create(form);
        toast.success("Announcement published");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save announcement",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await announcementsApi.remove(id);
      toast.success("Announcement deleted");
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete announcement",
      );
    }
  };

  const departmentName = (id?: string | null) =>
    departments.find((d) => d.id === id)?.name;

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Broadcast hospital-wide or department-specific updates to staff."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Announcement" : "New Announcement"}
                </DialogTitle>
                <DialogDescription>
                  Leave department blank to broadcast hospital-wide.
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
                  <Label>Content</Label>
                  <Textarea
                    rows={5}
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                  />
                </div>
                {!editing && (
                  <div className="space-y-2">
                    <Label>Department (optional)</Label>
                    <Select
                      value={form.departmentId}
                      onValueChange={(v) =>
                        setForm({ ...form, departmentId: v ?? undefined })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hospital-wide" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Publish"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Publish your first announcement above."
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold">{a.title}</h3>
                    <Badge variant={a.departmentId ? "secondary" : "default"}>
                      {a.departmentId
                        ? (departmentName(a.departmentId) ?? "Department")
                        : "Hospital-wide"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By {a.author?.firstName} {a.author?.lastName} ·{" "}
                    {formatDateTime(a.createdAt)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(a)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    }
                    title="Delete this announcement?"
                    description="This cannot be undone."
                    confirmLabel="Delete"
                    onConfirm={() => handleDelete(a.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {a.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
