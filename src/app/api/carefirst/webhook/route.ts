import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { patientName, email, concern, appointmentSlot, emailStatus } = body;

    if (!patientName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: patientName, email" },
        { status: 400 }
      );
    }

    console.info("[CareFirst Webhook] Email delivery confirmed:", {
      patientName,
      email,
      concern,
      appointmentSlot,
      emailStatus,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email delivery confirmation received",
        patient: patientName,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("[CareFirst Webhook] Error:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
