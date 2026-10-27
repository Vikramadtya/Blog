import { checkAdminAuth, errorResponse } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Resend } from "resend";
import { blogService } from "@/core";
import { backendAdminFetch } from "@/lib/backend";
import { siteMetadata } from "../../../../../site.config.mjs";

const BATCH_SIZE = 100; // Resend batch limit
const BACKEND_URL = process.env.NEXT_PUBLIC_MICROSERVICE_URL || "http://localhost:8787";

// Must match unsubscribeToken() in blog-backend/src/routes/subscribe.ts
const unsubscribeUrl = (email) => {
  const token = createHmac("sha256", process.env.ADMIN_SECRET).update(email).digest("hex");
  return `${BACKEND_URL}/subscribe/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
};

const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function POST(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 400 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { filename } = await req.json();
    if (!filename) return NextResponse.json({ error: "Filename required" }, { status: 400 });

    const { data: subscribers = [] } = await backendAdminFetch("/subscribe");
    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
    }

    // The post id is the filename without extension
    const id = String(filename).replace(/\.md$/, "");
    const blog = (await blogService.getAllPosts({ includeUnpublished: true })).find((p) => p.id === id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    if (!blog.isPublished()) {
      return NextResponse.json({ error: "Publish the post before broadcasting it" }, { status: 400 });
    }

    const postUrl = `${siteMetadata.siteUrl}/blogs/${blog.permalink}`;
    const coverImage = blog.previewImageSrc
      ? `${siteMetadata.siteUrl}${blog.previewImageSrc}`
      : `${siteMetadata.siteUrl}/api/og?title=${encodeURIComponent(blog.title)}&readingTime=${encodeURIComponent(blog.readingTime)}`;

    const renderHtml = (unsubUrl) => `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #0f172a;">${escapeHtml(blog.title)}</h1>
        <p style="color: #64748b;">${new Date(blog.createdAt).toLocaleDateString("en-US")}</p>
        <img src="${escapeHtml(coverImage)}" alt="" style="width: 100%; border-radius: 8px; margin: 20px 0;" />
        <p style="font-size: 16px; line-height: 1.6;">${escapeHtml(blog.summary || blog.description)}</p>
        <a href="${escapeHtml(postUrl)}" style="display: inline-block; background-color: #f05a28; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Read Full Post</a>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0 20px;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          You received this email because you subscribed to ${escapeHtml(siteMetadata.title)}. <a href="${escapeHtml(unsubUrl)}" style="color: #94a3b8;">Unsubscribe</a>
        </p>
      </div>`;

    const from = `${siteMetadata.title} <${process.env.EMAIL_FROM || siteMetadata.email}>`;
    const emails = subscribers.map((sub) => {
      const unsubUrl = unsubscribeUrl(sub.email);
      return {
        from,
        to: [sub.email],
        subject: `New Post: ${blog.title}`,
        html: renderHtml(unsubUrl),
        headers: { "List-Unsubscribe": `<${unsubUrl}>` },
      };
    });

    let sent = 0;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const chunk = emails.slice(i, i + BATCH_SIZE);
      const { error } = await resend.batch.send(chunk);
      if (error) {
        return NextResponse.json({ error: error.message, sent }, { status: 400 });
      }
      sent += chunk.length;
    }

    return NextResponse.json({ success: true, count: sent });
  } catch (error) {
    return errorResponse(error);
  }
}
