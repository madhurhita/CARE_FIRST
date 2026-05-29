import { NextRequest, NextResponse } from "next/server";
import { getBookedSlots } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const date = searchParams.get("date");

  if (!department || !date) {
    return NextResponse.json(
      { error: "department and date are required" },
      { status: 400 }
    );
  }

  const bookedSlots = getBookedSlots(department, date);

  console.log(`[Slots API] department=${department}, date=${date}, bookedCount=${bookedSlots.length}, bookedSlots=${JSON.stringify(bookedSlots)}`);

  return NextResponse.json({ bookedSlots });
}
