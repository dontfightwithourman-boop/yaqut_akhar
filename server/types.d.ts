declare module 'sql.js' {
  interface SqlJsStatic { Database: new (data?: ArrayLike<number>) => Database; }
  interface Statement { bind(params?: Record<string, any> | any[]): boolean; step(): boolean; getAsObject(): Record<string, any>; free(): void; }
  interface Database { run(sql: string, params?: Record<string, any> | any[]): void; exec(sql: string): QueryExecResult[]; prepare(sql: string): Statement; export(): Uint8Array; close(): void; }
  interface QueryExecResult { columns: string[]; values: any[][]; }
  export default function initSqlJs(config?: any): Promise<SqlJsStatic>;
  export { Database, SqlJsStatic, QueryExecResult, Statement };
}
