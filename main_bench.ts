const stagingUrl = Deno.env.get("STAGING_URL") || "http://localhost:3000";

Deno.bench("liveness", async () => {
  await fetch(`${stagingUrl}/health`);
});
