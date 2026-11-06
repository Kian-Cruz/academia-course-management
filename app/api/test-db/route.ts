
import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");

    return NextResponse.json({
      success: true,
      message: "Connected to MySQL successfully!",
      data: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MySQL connection failed",
      },
      { status: 500 }
    );
  }
}
