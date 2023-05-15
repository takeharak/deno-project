import {
  DB,
  QueryParameterSet,
} from "https://deno.land/x/sqlite@v3.7.2/mod.ts";

const connect = () => {
  return new DB((Deno.env.get("DENO_DIR") ?? "") + "test.db");
};

const execute = (sql: string, params?: QueryParameterSet) => {
  const db = connect();
  let result = db.query(sql, params);
  if (!result) {
    result = db.query("select * from items where id = last_insert_rowid()");
  }
  db.close();
  return result;
};

const migrate = () => {
  const db = connect();
  db.execute(
"CREATE TABLE \
  IF NOT EXISTS items ( \
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    label TEXT, \
    complete BOOLEAN DEFAULT FALSE \
  ) \
;",
  );
  db.close();
};

const cleanup = () => {
  const db = connect();
  db.execute(
    "DROP TABLE IF EXISTS users",
  );
  db.close();
};

export { cleanup, execute, migrate };
