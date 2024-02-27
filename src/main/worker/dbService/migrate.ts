import type Datebase from 'better-sqlite3'
import { DB_VERSION } from './tables'
const migrateV1 = (db: Datebase.Database) => {
  //
  const existsTable = db.prepare('SELECT name FROM "main".sqlite_master WHERE type=\'table\' AND name=\'dislike_list\';').get()
  if (existsTable) {
    const sql = `
    CREATE TABLE "dislike_list" (
      "type" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "meta" TEXT,
    );
    `
    db.exec(sql)
  }
  db.prepare('UPDATE "main"."db_info" SET "field_value"=@value WHERE "field_name"=@name').run({ name: 'version', vaule: DB_VERSION })
}

export default (db: Datebase.Database) => {
  const version = (db.prepare<string>('SELECT "field_value" FROM "main"."db_info" WHERE "field_name"= ?').get('version') as { field_value: string }).field_value

  switch (version) {
    case '1':
      migrateV1(db)
      break
  }
}
