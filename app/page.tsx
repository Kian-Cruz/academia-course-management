import { Suspense } from "react";
import { connection } from "next/server";
import { pool } from "@/src/lib/db";
import AddCourseForm from "./add-course-form";

type Course = {
  id: number;
  code: string;
  title: string;
  credits: number;
  semester: string;
  seats: number;
  instructor: string;
};

type Instructor = {
  id: number;
  fullname: string;
};

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 text-slate-900 antialiased">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-500 text-lg font-bold text-slate-900">
              A
            </div>
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-tight">Academia</p>
              <p className="text-xs text-slate-400">University Management</p>
            </div>
          </div>
          <span className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300">
            Student Portal
          </span>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-12 pt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            Academic Year 2026
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Course Catalog
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Explore available courses and manage your academic offerings.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Suspense fallback={<CoursesSkeleton />}>
          <Courses />
        </Suspense>
      </div>

      <footer className="border-t border-stone-300 bg-stone-200/60">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-slate-600">
          Academia University Management · Yazar Hein · 6708266
        </div>
      </footer>
    </main>
  );
}

function CoursesSkeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading courses"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-60 animate-pulse rounded-lg bg-stone-200"
        />
      ))}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function seatStyle(seats: number) {
  if (seats <= 0) return "bg-red-100 text-red-700";
  if (seats <= 10) return "bg-amber-100 text-amber-800";
  return "bg-teal-100 text-teal-800";
}

async function Courses() {
  await connection();

  const [courses] = await pool.query(`
    SELECT
      c.id,
      c.code,
      c.title,
      c.credits,
      c.semester,
      c.seats,
      i.fullname AS instructor
    FROM courses c
    JOIN instructor i ON i.id = c.instructorId
    ORDER BY c.semester, c.code
  `);

  const [instructors] = await pool.query(`
    SELECT id, fullname
    FROM instructor
    ORDER BY fullname
  `);

  const courseList = courses as Course[];
  const instructorList = instructors as Instructor[];

  return (
    <>
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Available Courses
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Sorted by semester and course code
            </p>
          </div>
          <span className="rounded-full bg-slate-900 px-3.5 py-1 text-sm font-medium text-white">
            {courseList.length}{" "}
            {courseList.length === 1 ? "course" : "courses"}
          </span>
        </div>

        {courseList.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-stone-300 bg-white p-12 text-center text-sm text-slate-500">
            No courses available yet. Add your first course below.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courseList.map((course) => (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-lg border border-stone-200 border-l-4 border-l-teal-500 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-teal-700">
                      {course.code}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${seatStyle(
                        course.seats
                      )}`}
                    >
                      {course.seats} seats
                    </span>
                  </div>

                  <h3 className="mt-3 min-h-14 text-lg font-semibold leading-snug">
                    {course.title}
                  </h3>

                  <dl className="mt-4 divide-y divide-stone-100 border-t border-stone-100">
                    <Detail label="Credits" value={course.credits} />
                    <Detail label="Semester" value={course.semester} />
                    <Detail label="Course ID" value={`#${course.id}`} />
                  </dl>
                </div>

                <div className="flex items-center gap-3 border-t border-stone-200 bg-stone-50 px-6 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {course.instructor
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <p className="truncate text-sm font-medium text-slate-800">
                    {course.instructor}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <AddCourseForm instructors={instructorList} />
    </>
  );
}