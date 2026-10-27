/** Server-side client for the admin-only endpoints of the microservice (uses ADMIN_SECRET, never sent to the browser). */
const BASE_URL = process.env.NEXT_PUBLIC_MICROSERVICE_URL || "http://localhost:8787";

export async function backendAdminFetch(path, init = {}) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set in blog-frontend/.env.local");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: { ...init.headers, Authorization: `Bearer ${secret}` },
  });
  if (!res.ok) throw new Error(`Backend ${path} responded ${res.status}`);
  return res.json();
}
