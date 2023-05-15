// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";
// @deno-types="npm:@types/express-actuator@1"
import actuator from "npm:express-actuator@1.8.4";
import { router as index } from "./routes/index.ts";
import { router as todo } from "./routes/todo.ts";
import { migrate } from "./utils/sqlite.ts";

migrate();

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(actuator());
app.use(index);
app.use("/items", todo);

const port = Number(Deno.env.get("PORT")) || 3000;
const server = app.listen(port, () => {
  console.debug(`Listening on ${server.address().port} ...`);
});

addEventListener("unload", () => {
  console.debug("closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
  });
});

addEventListener("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
  });
});
