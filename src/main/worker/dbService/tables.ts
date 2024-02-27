const tables = new Map<string, string>()
tables.set('db_info', `
  CREATE TABLE "db_info" (
    "id" INTEGER NOT NULL UNIQUE,
    "field_name" TEXT,
    "field_value" TEXT,
    primariy key("id" AUTOINCREMENT)
`)
export default tables
export const DB_VERSION = '2'
