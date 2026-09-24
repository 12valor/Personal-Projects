import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "AG Diaz Evangelista";
    const category = searchParams.get("category") || "Full-Stack Engineering & Interface Design";
    const role = searchParams.get("role") || "Software Engineer & Designer";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#09090b",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #18181b 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "60px 80px",
            fontFamily: "sans-serif",
            color: "#fafafa",
            border: "12px solid #18181b",
          }}
        >
          {/* Top Row: Brand & Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  boxShadow: "0 0 16px #22c55e",
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#a1a1aa",
                }}
              >
                12VALOR // PORTFOLIO
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "9999px",
                backgroundColor: "#27272a",
                border: "1px solid #3f3f46",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#e4e4e7",
              }}
            >
              {category}
            </div>
          </div>

          {/* Center: Main Project Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1040px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 30 ? 64 : 80,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                color: "#ffffff",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: "#a1a1aa",
                margin: 0,
              }}
            >
              {role}
            </p>
          </div>

          {/* Bottom Bar: Metadata & URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #27272a",
              paddingTop: "28px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "24px",
                fontSize: 18,
                color: "#71717a",
                fontWeight: 500,
              }}
            >
              <span>Next.js</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Supabase</span>
            </div>

            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#e4e4e7",
                letterSpacing: "0.05em",
              }}
            >
              12valor.vercel.app
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error("Failed to generate OG image:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
