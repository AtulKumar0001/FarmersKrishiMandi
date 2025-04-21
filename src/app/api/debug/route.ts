// /app/api/debug/route.ts
export async function GET() {
  return Response.json({ site: process.env.NEXT_PUBLIC_SITE_URL });
}
