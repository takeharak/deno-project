// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";

const router = Router();

router.get("/", (_req, res) => {
  res.send("Hello from Deno and Express!");
});

export { router };
