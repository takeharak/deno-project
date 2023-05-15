import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";

const stagingUrl = Deno.env.get("STAGING_URL") || "http://localhost:3000";

Deno.test("liveness", async () => {
  const res = await fetch(`${stagingUrl}/health`);
  assertEquals(res.status, 200);
  const obj = await res.json();
  assertEquals(obj.status, "UP");
});
