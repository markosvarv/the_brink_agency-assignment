import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

async function safeRun(db: any, query: any) {
  try {
    await db.run(query)
  } catch (err: any) {
    const msg = err?.message || String(err)
    if (msg.includes('already exists') || msg.includes('duplicate column name')) return
    console.warn('Migration step notice:', msg)
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. users_sessions table — required by Payload CMS for token-based session tracking
  await safeRun(db, sql`
    CREATE TABLE IF NOT EXISTS \`users_sessions\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`expires_at\` text NOT NULL,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)

  // 2. payload_kv table — required by Payload CMS for internal key-value storage
  await safeRun(db, sql`
    CREATE TABLE IF NOT EXISTS \`payload_kv\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`key\` text NOT NULL,
      \`data\` text,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );
  `)
  await safeRun(db, sql`CREATE UNIQUE INDEX IF NOT EXISTS \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`users_sessions\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`payload_kv\`;`)
}
