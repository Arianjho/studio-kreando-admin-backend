export async function triggerRevalidate(tag: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!frontendUrl || !secret) {
    console.warn("Skipping revalidation: FRONTEND_URL or REVALIDATE_SECRET not set");
    return;
  }
  try {
    const res = await fetch(`${frontendUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, tag }),
    });
    if (!res.ok) {
      console.error(`Revalidation request failed: ${res.status} ${await res.text()}`);
    }
  } catch (err) {
    console.error("Revalidation request errored:", err);
  }
}
