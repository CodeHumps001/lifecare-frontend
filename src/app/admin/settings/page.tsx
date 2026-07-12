"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapPin, Save, LocateFixed } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsApi, ApiError } from "@/lib/api";
import type { HospitalSettingsPayload } from "@/lib/api";

const emptyForm: HospitalSettingsPayload = {
  name: "",
  latitude: 0,
  longitude: 0,
  geofenceRadius: 100,
  address: "",
  phone: "",
  email: "",
  logoUrl: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<HospitalSettingsPayload>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    settingsApi
      .get()
      .then((data) =>
        setForm({
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
          geofenceRadius: data.geofenceRadius,
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          logoUrl: data.logoUrl ?? "",
        }),
      )
      .catch((err) => {
        // 404 on first run just means settings haven't been created yet — keep the empty form
        if (!(err instanceof ApiError && err.status === 404)) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load settings");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setLocating(false);
        toast.success("Location captured from your current position");
      },
      () => {
        setLocating(false);
        toast.error("Could not get your current location");
      },
    );
  };

  const handleSave = async () => {
    if (!form.name || !form.latitude || !form.longitude) {
      toast.error("Hospital name, latitude and longitude are required");
      return;
    }
    setSaving(true);
    try {
      await settingsApi.update(form);
      toast.success("Hospital settings saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Hospital Settings" description="Location, geofence, and general hospital information." />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Hospital Settings" description="Location, geofence, and general hospital information." />

      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" /> Clock-in Geofence
            </CardTitle>
            <CardDescription>
              Staff can only clock in from within this radius of the hospital's coordinates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                />
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation} disabled={locating}>
              <LocateFixed className="mr-2 h-4 w-4" />
              {locating ? "Locating…" : "Use my current location"}
            </Button>
            <div className="space-y-2">
              <Label>Geofence radius (meters)</Label>
              <Input
                type="number"
                value={form.geofenceRadius}
                onChange={(e) => setForm({ ...form, geofenceRadius: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hospital Information</CardTitle>
            <CardDescription>Shown on the public website and in patient notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hospital name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
