"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import {
  Briefcase,
  Plus,
  X,
  CheckCircle,
  Users,
  Trash2,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from "lucide-react";
import { jobsAPI, departmentsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const jobTypes = ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"];
const appStatusOptions = ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED"];

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const load = () => {
    setLoading(true);
    Promise.allSettled([
      jobsAPI.getAll(),
      jobsAPI.getApplications(),
      departmentsAPI.getAll(),
    ])
      .then(([j, a, d]) => {
        if (j.status === "fulfilled") setJobs(j.value.data.data);
        if (a.status === "fulfilled") setApplications(a.value.data.data);
        if (d.status === "fulfilled") setDepartments(d.value.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await jobsAPI.create(data);
      setSuccess("Job listing created successfully");
      reset();
      setShowForm(false);
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create listing");
    }
  };

  const handleToggle = async (job: any) => {
    try {
      await jobsAPI.update(job.id, { isOpen: !job.isOpen });
      load();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job listing?")) return;
    try {
      await jobsAPI.delete(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Cannot delete");
    }
  };

  const handleAppStatus = async (id: string, status: string) => {
    try {
      await jobsAPI.updateApplication(id, status);
      load();
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Jobs & Recruitment
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {jobs.length} listings · {applications.length} applications
          </p>
        </div>

        <Dialog.Root open={showForm} onOpenChange={setShowForm}>
          <Dialog.Trigger asChild>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-semibold hover:bg-emerald-700 transition-all">
              <Plus className="w-4 h-4" /> Post Job
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 w-full max-w-lg z-50 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-bold">
                  Post Job Listing
                </Dialog.Title>
                <Dialog.Close>
                  <X className="w-5 h-5 text-gray-400" />
                </Dialog.Close>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  {...register("title", { required: true })}
                  placeholder="Job Title"
                  className="w-full border rounded-xl p-3"
                />
                <select
                  {...register("department", { required: true })}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <select
                  {...register("type", { required: true })}
                  className="w-full border rounded-xl p-3"
                >
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <textarea
                  {...register("description", { required: true })}
                  placeholder="Description"
                  className="w-full border rounded-xl p-3 h-24"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold"
                >
                  Post Listing
                </button>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <Tabs.Root defaultValue="listings">
        <Tabs.List className="flex gap-4 border-b border-gray-100 mb-6">
          {["listings", "applications"].map((t) => (
            <Tabs.Trigger
              key={t}
              value={t}
              className="px-2 py-3 text-sm font-bold capitalize text-gray-400 data-[state=active]:text-emerald-600 data-[state=active]:border-b-2 border-emerald-600"
            >
              {t}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="listings" className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold">{job.title}</h3>
                  <p className="text-xs text-gray-400">
                    {job.department} • {job.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggle(job)}>
                  {job.isOpen ? (
                    <ToggleRight className="text-emerald-600 w-6 h-6" />
                  ) : (
                    <ToggleLeft className="text-gray-300 w-6 h-6" />
                  )}
                </button>
                <button onClick={() => handleDelete(job.id)}>
                  <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </Tabs.Content>

        <Tabs.Content value="applications">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 font-medium">{app.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Select.Root
                        defaultValue={app.status}
                        onValueChange={(s) => handleAppStatus(app.id, s)}
                      >
                        <Select.Trigger className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Select.Value />
                          <ChevronDown className="w-4 h-4" />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-white border rounded-xl shadow-lg p-2">
                            {appStatusOptions.map((s) => (
                              <Select.Item
                                key={s}
                                value={s}
                                className="px-4 py-2 hover:bg-emerald-50 cursor-pointer"
                              >
                                {s}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
