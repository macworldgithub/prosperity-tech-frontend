import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ensure brand is included (use provided brand if present, otherwise default)
    const proxiedBody = {
      ...body,
      brand: body?.brand ?? "prosperity-tech",
    };

    const response = await fetch(
      "https://prosperity.omnisuiteai.com/chat/query",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proxiedBody),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
