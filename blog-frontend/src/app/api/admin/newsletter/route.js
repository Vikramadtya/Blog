import { NextResponse } from "next/server";
import { Resend } from "resend";
import { blogService } from "@/core";
import { siteMetadata } from "../../../../../site.config.mjs";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const MICROSERVICE_URL = process.env.NEXT_PUBLIC_MICROSERVICE_URL || "http://localhost:8787";

export async function POST(req) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in local development." }, { status: 403 });
  }

  try {
    const { filename } = await req.json();
    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    // 1. Fetch subscribers from backend
    const subsRes = await fetch(`${MICROSERVICE_URL}/subscribers`);
    if (!subsRes.ok) {
      throw new Error("Failed to fetch subscribers from backend");
    }
    const { data: subscribers } = await subsRes.json();

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
    }

    // 2. Fetch the blog metadata
    // In our datastore, filename === id (for development)
    const blog = await blogService.getPostBySlug(filename);
    if (!blog) {
      throw new Error("Blog not found");
    }

    const postUrl = `${siteMetadata.siteUrl}/blogs/${blog.slug}`;
    const coverImage = blog.previewImageSrc 
      ? `${siteMetadata.siteUrl}${blog.previewImageSrc}`
      : `${siteMetadata.siteUrl}/api/og?title=${encodeURIComponent(blog.title)}&readingTime=${encodeURIComponent(blog.readingTime || "")}`;

    // 3. Construct Email HTML
    const html = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #0f172a;">${blog.title}</h1>
        <p style="color: #64748b;">${new Date(blog.createdAt).toLocaleDateString()}</p>
        
        <img src="${coverImage}" alt="Cover image" style="width: 100%; border-radius: 8px; margin-top: 20px; margin-bottom: 20px;" />
        
        <p style="font-size: 16px; line-height: 1.6;">
          ${blog.summary || blog.description}
        </p>

        <a href="${postUrl}" style="display: inline-block; background-color: #f05a28; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
          Read Full Post
        </a>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 40px; margin-bottom: 20px;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          You received this email because you subscribed to ${siteMetadata.title}.
        </p>
      </div>
    `;

    // 4. Send emails using Resend Batch API
    const emails = subscribers.map((sub) => ({
      from: `${siteMetadata.title} <noreply@${siteMetadata.siteUrl.replace("https://", "")}>`, // Note: You need a verified domain in Resend
      to: [sub.email],
      subject: `New Post: ${blog.title}`,
      html: html,
    }));

    const { data, error } = await resend.batch.send(emails);

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: emails.length });
  } catch (error) {
    console.error("Broadcast error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
