import { ImageResponse } from "@vercel/og";
import { siteMetadata } from "../../../../site.config.mjs";

export const runtime = "edge";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic values
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : siteMetadata.title;

    const hasReadingTime = searchParams.has("readingTime");
    const readingTime = hasReadingTime
      ? searchParams.get("readingTime")
      : "";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundImage: "linear-gradient(to right, #0f172a, #1e293b)",
            padding: "80px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Logo / Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "auto",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#f05a28",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              {siteMetadata.title.charAt(0)}
            </div>
            <span
              style={{
                marginLeft: 20,
                fontSize: 32,
                color: "white",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {siteMetadata.title}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 40,
              marginBottom: 40,
            }}
          >
            <h1
              style={{
                fontSize: 72,
                color: "white",
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer (Author & Reading Time) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
            }}
          >
            {/* Fallback avatar using ui-avatars since we don't have local image path resolution in edge easy */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
<img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(siteMetadata.author)}&background=4f46e5&color=fff&size=128`}
              width="64"
              height="64"
              style={{
                borderRadius: 32,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 20,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {siteMetadata.author}
              </span>
              <span
                style={{
                  fontSize: 22,
                  color: "#94a3b8",
                  marginTop: 4,
                }}
              >
                {readingTime ? `${readingTime} • ${siteMetadata.siteUrl.replace("https://", "")}` : siteMetadata.siteUrl.replace("https://", "")}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Failed to generate OG image", e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
