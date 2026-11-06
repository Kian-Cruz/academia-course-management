"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Instructor = {
  id: number;
  fullname: string;
};

type Status = { type: "success" | "error"; message: string } | null;

export default function AddCourseForm({
  instructors,
}: {
  instructors: Instructor[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        form.reset();
        router.refresh();
        setStatus({ type: "success", message: "Course added successfully." });
      } else {
        setStatus({
          type: "error",
          message: result.message || "Unable to add course.",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Server connection failed." });
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

  const label = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <section className="mt-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          Course Management
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Add New Course
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter the academic details below to register a new course.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="code" className={label}>
              Course Code
            </label>
            <input
              id="code"
              name="code"
              placeholder="e.g. DIT400"
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="title" className={label}>
              Course Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="Enter course title"
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="credits" className={label}>
              Credits
            </label>
            <input
              id="credits"
              name="credits"
              type="number"
              min="1"
              placeholder="3"
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="semester" className={label}>
              Semester
            </label>
            <input
              id="semester"
              name="semester"
              placeholder="e.g. 2/2026"
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="seats" className={label}>
              Available Seats
            </label>
            <input
              id="seats"
              name="seats"
              type="number"
              min="1"
              placeholder="40"
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="instructorId" className={label}>
              Instructor
            </label>
            <select
              id="instructorId"
              name="instructorId"
              required
              defaultValue=""
              className={field}
            >
              <option value="" disabled>
                Select instructor
              </option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.fullname}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Registering..." : "Register Course"}
          </button>

          {status && (
            <p
              role="status"
              className={`rounded-lg border px-3.5 py-2 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}