
import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: Retrieve one course
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.execute(
      `SELECT
        courses.*,
        instructor.fullname AS instructorName,
        instructor.email AS instructorEmail
       FROM courses
       JOIN instructor
         ON courses.instructorId = instructor.id
       WHERE courses.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET course error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to retrieve course" },
      { status: 500 }
    );
  }
}

// PUT: Update a course
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
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

    const [result]: any = await pool.execute(
      `UPDATE courses
       SET code = ?,
           title = ?,
           credits = ?,
           semester = ?,
           seats = ?,
           instructorId = ?
       WHERE id = ?`,
      [code, title, credits, semester, seats, instructorId, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("PUT course error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a course
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const [result]: any = await pool.execute(
      "DELETE FROM courses WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE course error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete course" },
      { status: 500 }
    );
  }
}
