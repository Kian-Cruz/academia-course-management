
import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        courses.id,
        courses.code,
        courses.title,
        courses.credits,
        courses.semester,
        courses.seats,
        courses.instructorId,
        instructor.fullname AS instructorName,
        instructor.email AS instructorEmail
      FROM courses
      JOIN instructor
        ON courses.instructorId = instructor.id
      ORDER BY courses.id ASC
    `);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET courses error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to retrieve courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      code,
      title,
      credits,
      semester,
      seats,
      instructorId,
    } = body;

    if (
      !code ||
      !title ||
      !credits ||
      !semester ||
      seats === undefined ||
      !instructorId
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO courses
       (code, title, credits, semester, seats, instructorId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [code, title, credits, semester, seats, instructorId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST courses error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create course" },
      { status: 500 }
    );
  }
}
