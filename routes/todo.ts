// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";
import { execute } from "../utils/sqlite.ts";

const router = Router();

router.get("/", (_req, res) => {
  // deno-lint-ignore no-explicit-any
  const items: any[] = [];
  for (const row of execute("SELECT * FROM items")) {
    items.push({ id: row[0], label: row[1], complete: row[2] ? true : false });
  }
  res.send(JSON.stringify(items));
});

router.post("/", (req, res) => {
  execute("INSERT INTO items(label) VALUES(?)", [
    req.body.label,
  ]);
  res.status(201).send();
});

router.get("/:id", (req, res) => {
  const row = [...execute(
    "SELECT * FROM items WHERE id = ?",
    [req.params.id],
  )].shift() ?? [];
  res.send(
    JSON.stringify({
      id: row[0],
      label: row[1],
      complete: row[2] ? true : false,
    }),
  );
});

router.put("/:id", (req, res) => {
  execute(
"UPDATE \
  items \
  SET \
    label = ?, \
    complete = ? \
  WHERE id = ?",
    [req.body.label, req.body.complete, req.params.id],
  );
  res.status(200).send();
});

router.patch("/:id", (req, res) => {
  execute(
"UPDATE \
  items \
  SET complete = \
  CASE \
    WHEN complete = FALSE THEN TRUE \
    ELSE FALSE \
  END \
  WHERE id = ?",
    [req.params.id],
  );
  res.status(200).send();
});

router.delete("/:id", (req, res) => {
  execute("DELETE FROM items WHERE id = ?", [req.params.id]);
  res.status(204).send();
});

export { router };
