import type Database from 'better-sqlite3'
import tables from './tables'

const rxp = /\n|\s|;|--.+/g

export default (db: Database.Database) => {
  const result = db.prepare<[]>('SELECT type,name,tbl_name,sql FROM "main".sqlite_master WHERE sql NOT NULL').all() as Array<{ type: string, name: string, tbl_name: string, sql: string }>
  const dbTableMap = new Map<string, string>()
  for (const info of result) { dbTableMap.set(info.name, info.sql.replace(rxp, '')) }
  return Array.from(tables.entries()).every(([name, sql]) => {
    const dbSql = dbTableMap.get(name)
    return dbSql && dbSql == sql.replace(rxp, '')
  })
}
