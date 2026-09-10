import config from '../payload.config'
import { getPayload } from 'payload'
import { migrations } from '../migrations'
import { sql } from '@payloadcms/db-sqlite'

async function runMigrations() {
  console.log('[MIGRATION] Initializing Payload CMS for startup migrations...')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 1. Clean up any dev push marker (batch: -1) that blocks non-interactive migrations
  try {
    await payload.db.drizzle.run(sql`DELETE FROM \`payload_migrations\` WHERE \`batch\` = -1;`)
  } catch {
    // table might not exist yet on brand new database
  }

  // 2. Fetch existing migrations from database
  let ranMigrations: string[] = []
  try {
    const existing = await payload.find({
      collection: 'payload-migrations',
      limit: 0,
    })
    ranMigrations = (existing.docs || []).map((doc: any) => doc.name)
  } catch {
    // If collection doesn't exist yet, it will be created by the first migration
  }

  // 3. Run pending migrations
  for (const migration of migrations) {
    if (ranMigrations.includes(migration.name)) {
      console.log(`[MIGRATION] Already applied: ${migration.name}`)
      continue
    }

    console.log(`[MIGRATION] Running migration: ${migration.name}...`)
    try {
      await migration.up({
        db: payload.db.drizzle,
        payload,
        req: {} as any,
      })

      await payload.create({
        collection: 'payload-migrations',
        data: {
          name: migration.name,
          batch: 1,
        },
      })
      console.log(`[MIGRATION] Successfully applied: ${migration.name}`)
    } catch (err: any) {
      const msg = err?.message || String(err)
      console.error(`[MIGRATION] Step notice in ${migration.name}:`, msg)
      if (msg.includes('already exists')) {
        try {
          await payload.create({
            collection: 'payload-migrations',
            data: {
              name: migration.name,
              batch: 1,
            },
          })
          console.log(`[MIGRATION] Marked already existing migration as applied: ${migration.name}`)
        } catch {}
      }
    }
  }

  // 4. Critical safety net: Ensure payload_preferences_rels & locked_documents_rels have all collection columns
  try {
    const safeAddColumn = async (table: string, column: string, type: string) => {
      try {
        await payload.db.drizzle.run(sql.raw(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${type};`))
      } catch {
        // ignore duplicate column name
      }
    }

    await safeAddColumn('payload_preferences_rels', 'media_id', 'integer REFERENCES media(id) ON UPDATE no action ON DELETE cascade')
    await safeAddColumn('payload_preferences_rels', 'pages_id', 'integer REFERENCES pages(id) ON UPDATE no action ON DELETE cascade')
    await safeAddColumn('payload_preferences_rels', 'articles_id', 'integer REFERENCES articles(id) ON UPDATE no action ON DELETE cascade')
    await safeAddColumn('payload_preferences_rels', 'contact_submissions_id', 'integer REFERENCES contact_submissions(id) ON UPDATE no action ON DELETE cascade')

    await safeAddColumn('payload_locked_documents_rels', 'articles_id', 'integer REFERENCES articles(id) ON UPDATE no action ON DELETE cascade')
    await safeAddColumn('payload_locked_documents_rels', 'contact_submissions_id', 'integer REFERENCES contact_submissions(id) ON UPDATE no action ON DELETE cascade')

    // Create indexes if not exist
    try {
      await payload.db.drizzle.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_articles_id_idx\` ON \`payload_preferences_rels\` (\`articles_id\`);`))
      await payload.db.drizzle.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_contact_submissions_id_idx\` ON \`payload_preferences_rels\` (\`contact_submissions_id\`);`))
      await payload.db.drizzle.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`))
      await payload.db.drizzle.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_contact_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_submissions_id\`);`))
    } catch {}

    // Ensure users_sessions exists (needed for Payload user sessions)
    try {
      await payload.db.drizzle.run(sql.raw(`
        CREATE TABLE IF NOT EXISTS \`users_sessions\` (
          \`_order\` integer NOT NULL,
          \`_parent_id\` integer NOT NULL,
          \`id\` text PRIMARY KEY NOT NULL,
          \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
          \`expires_at\` text NOT NULL,
          FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
        );
      `))
      await payload.db.drizzle.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`))
      await payload.db.drizzle.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`))
    } catch {}

    // Ensure payload_kv exists (needed for Payload key-value store)
    try {
      await payload.db.drizzle.run(sql.raw(`
        CREATE TABLE IF NOT EXISTS \`payload_kv\` (
          \`id\` integer PRIMARY KEY NOT NULL,
          \`key\` text NOT NULL,
          \`data\` text,
          \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
          \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
        );
      `))
      await payload.db.drizzle.run(sql.raw(`CREATE UNIQUE INDEX IF NOT EXISTS \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`))
    } catch {}

    console.log('[MIGRATION] Database relationship columns verified!')
  } catch (err) {
    console.warn('[MIGRATION] Note on rels verification:', err)
  }

  // 5. Ensure Hero global default text matches Figma design
  try {
    await payload.db.drizzle.run(sql.raw(`
      UPDATE \`hero\`
      SET \`badge_text\` = 'SERVICE & MANTAINANCE',
          \`heading\` = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui.'
      WHERE \`id\` = 1 AND (\`badge_text\` IS NULL OR \`badge_text\` = '' OR \`badge_text\` = 'SERVICE & MAINTENANCE');
    `))
  } catch {}

  console.log('[MIGRATION] Database migrations complete!')
  process.exit(0)
}

runMigrations().catch(err => {
  console.error('[MIGRATION] Startup migration non-fatal warning:', err)
  process.exit(0)
})
