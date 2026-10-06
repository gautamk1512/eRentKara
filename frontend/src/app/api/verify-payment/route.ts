import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/verify-payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.get("authorization") ? { Authorization: req.headers.get("authorization")! } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to verify Razorpay payment", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
