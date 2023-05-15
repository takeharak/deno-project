import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";

const stagingUrl = Deno.env.get("STAGING_URL") || "http://localhost:3000";

Deno.test;

Deno.test("root", async () => {
  const res = await fetch(`${stagingUrl}/`);
  res.text();
  assertEquals(res.status, 200);
});
