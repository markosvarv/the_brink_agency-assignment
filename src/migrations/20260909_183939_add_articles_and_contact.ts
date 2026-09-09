import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

async function safeRun(db: any, query: any) {
  try {
    await db.run(query)
  } catch (err: any) {
    const msg = err?.message || String(err)
    if (
      msg.includes('duplicate column name') ||
      msg.includes('already exists')
    ) {
      return
    }
    console.warn('Migration step notice:', msg)
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Articles Collection Table
  await safeRun(db, sql`CREATE TABLE IF NOT EXISTS \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`short_description\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`published_at\` text NOT NULL,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await safeRun(db, sql`CREATE UNIQUE INDEX IF NOT EXISTS \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`articles_featured_image_idx\` ON \`articles\` (\`featured_image_id\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)

  // 2. Contact Submissions Collection Table
  await safeRun(db, sql`CREATE TABLE IF NOT EXISTS \`contact_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`company\` text,
  	\`phone\` text,
  	\`email\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`is_read\` integer DEFAULT false,
  	\`confirmation_email_sent\` integer DEFAULT false,
  	\`daily_digest_sent\` integer DEFAULT false,
  	\`ip_address\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`contact_submissions_updated_at_idx\` ON \`contact_submissions\` (\`updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`contact_submissions_created_at_idx\` ON \`contact_submissions\` (\`created_at\`);`)

  // 3. Hero Global Table
  await safeRun(db, sql`CREATE TABLE IF NOT EXISTS \`hero\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`badge_text\` text DEFAULT 'SERVICE & MAINTENANCE',
  	\`heading\` text DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui.' NOT NULL,
  	\`supporting_text\` text,
  	\`cta_label\` text,
  	\`cta_link\` text,
  	\`media_type\` text DEFAULT 'image',
  	\`background_image_id\` integer,
  	\`background_video_id\` integer,
  	\`background_video_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`background_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`hero_background_image_idx\` ON \`hero\` (\`background_image_id\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`hero_background_video_idx\` ON \`hero\` (\`background_video_id\`);`)

  // 4. Contact Global Table
  await safeRun(db, sql`CREATE TABLE IF NOT EXISTS \`contact\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Contact us' NOT NULL,
  	\`subheading\` text DEFAULT 'Write us a message.',
  	\`name_label\` text DEFAULT 'Full name',
  	\`name_placeholder\` text DEFAULT 'Ilaria Casi',
  	\`company_label\` text DEFAULT 'Company',
  	\`company_placeholder\` text DEFAULT 'Enter company name',
  	\`email_label\` text DEFAULT 'E-mail address',
  	\`email_placeholder\` text DEFAULT 'Your e-mail',
  	\`phone_label\` text DEFAULT 'Telephone number',
  	\`phone_placeholder\` text DEFAULT '342 ..',
  	\`message_label\` text DEFAULT 'Message here',
  	\`message_placeholder\` text DEFAULT 'Write your message here',
  	\`submit_button_label\` text DEFAULT 'Send message',
  	\`success_title\` text DEFAULT 'Thank you for your message!',
  	\`success_message\` text DEFAULT 'We have successfully received your inquiry and dispatched an automated confirmation email. Our team will review your message and reach out shortly.',
  	\`updated_at\` text,
  	\`created_at\` text
  );`)

  // 5. Footer Global Table
  await safeRun(db, sql`CREATE TABLE IF NOT EXISTS \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`headline\` text DEFAULT 'When it matter most .' NOT NULL,
  	\`newsletter_prompt\` text DEFAULT 'Stay up to date on our news, projects and more',
  	\`newsletter_placeholder\` text DEFAULT 'Email address',
  	\`newsletter_button_label\` text DEFAULT 'Sign up',
  	\`copyright_text\` text DEFAULT 'Copyright © 2025',
  	\`privacy_label\` text DEFAULT 'Privacy',
  	\`privacy_url\` text DEFAULT '#privacy',
  	\`instagram_url\` text DEFAULT 'https://instagram.com',
  	\`linkedin_url\` text DEFAULT 'https://linkedin.com',
  	\`updated_at\` text,
  	\`created_at\` text
  );`)

  // 6. Safe additions to payload_locked_documents_rels
  await safeRun(db, sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`articles_id\` integer REFERENCES articles(id) ON UPDATE no action ON DELETE cascade;`)
  await safeRun(db, sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`contact_submissions_id\` integer REFERENCES contact_submissions(id) ON UPDATE no action ON DELETE cascade;`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_contact_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_submissions_id\`);`)

  // 7. Safe additions to payload_preferences_rels
  await safeRun(db, sql`ALTER TABLE \`payload_preferences_rels\` ADD COLUMN \`media_id\` integer REFERENCES media(id) ON UPDATE no action ON DELETE cascade;`)
  await safeRun(db, sql`ALTER TABLE \`payload_preferences_rels\` ADD COLUMN \`pages_id\` integer REFERENCES pages(id) ON UPDATE no action ON DELETE cascade;`)
  await safeRun(db, sql`ALTER TABLE \`payload_preferences_rels\` ADD COLUMN \`articles_id\` integer REFERENCES articles(id) ON UPDATE no action ON DELETE cascade;`)
  await safeRun(db, sql`ALTER TABLE \`payload_preferences_rels\` ADD COLUMN \`contact_submissions_id\` integer REFERENCES contact_submissions(id) ON UPDATE no action ON DELETE cascade;`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_media_id_idx\` ON \`payload_preferences_rels\` (\`media_id\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_pages_id_idx\` ON \`payload_preferences_rels\` (\`pages_id\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_articles_id_idx\` ON \`payload_preferences_rels\` (\`articles_id\`);`)
  await safeRun(db, sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_contact_submissions_id_idx\` ON \`payload_preferences_rels\` (\`contact_submissions_id\`);`)

  // 8. Seed default records if tables are empty
  await safeRun(db, sql`
    INSERT INTO \`hero\` (id, badge_text, heading, supporting_text, cta_label, cta_link, media_type, background_video_url)
    SELECT 1, 'SERVICE & MAINTENANCE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui.', 'High quality industrial services and emergency maintenance available 24/7 across all regions.', 'Contact us', '#contact', 'video', '/ZWRT.mp4'
    WHERE NOT EXISTS (SELECT 1 FROM \`hero\` WHERE id = 1);
  `)

  await safeRun(db, sql`
    INSERT INTO \`contact\` (id, heading, subheading, name_label, name_placeholder, company_label, company_placeholder, email_label, email_placeholder, phone_label, phone_placeholder, message_label, message_placeholder, submit_button_label, success_title, success_message)
    SELECT 1, 'Contact us', 'Write us a message.', 'Full name', 'Ilaria Casi', 'Company', 'Enter company name', 'E-mail address', 'Your e-mail', 'Telephone number', '342 ..', 'Message here', 'Write your message here', 'Send message', 'Thank you for your message!', 'We have successfully received your inquiry and dispatched an automated confirmation email. Our team will review your message and reach out shortly.'
    WHERE NOT EXISTS (SELECT 1 FROM \`contact\` WHERE id = 1);
  `)

  await safeRun(db, sql`
    INSERT INTO \`footer\` (id, headline, newsletter_prompt, newsletter_placeholder, newsletter_button_label, copyright_text, privacy_label, privacy_url, instagram_url, linkedin_url)
    SELECT 1, 'When it matter most .', 'Stay up to date on our news, projects and more', 'Email address', 'Sign up', 'Copyright © 2025', 'Privacy', '#privacy', 'https://instagram.com', 'https://linkedin.com'
    WHERE NOT EXISTS (SELECT 1 FROM \`footer\` WHERE id = 1);
  `)

  await safeRun(db, sql`
    INSERT INTO \`articles\` (id, title, slug, short_description, published_at, updated_at, created_at)
    SELECT 1, 'Flex-e subsidy – solution for grid congestion', 'flex-e-subsidy-solution-for-grid-congestion-1', 'The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing...', '2024-07-30T12:00:00.000Z', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE NOT EXISTS (SELECT 1 FROM \`articles\` WHERE slug = 'flex-e-subsidy-solution-for-grid-congestion-1' OR id = 1);
  `)

  await safeRun(db, sql`
    INSERT INTO \`articles\` (id, title, slug, short_description, published_at, updated_at, created_at)
    SELECT 2, 'Flex-e subsidy – solution for grid congestion', 'flex-e-subsidy-solution-for-grid-congestion-2', 'The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing...', '2024-07-30T12:00:00.000Z', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE NOT EXISTS (SELECT 1 FROM \`articles\` WHERE slug = 'flex-e-subsidy-solution-for-grid-congestion-2' OR id = 2);
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await safeRun(db, sql`DROP TABLE IF EXISTS \`articles\`;`)
  await safeRun(db, sql`DROP TABLE IF EXISTS \`contact_submissions\`;`)
  await safeRun(db, sql`DROP TABLE IF EXISTS \`hero\`;`)
  await safeRun(db, sql`DROP TABLE IF EXISTS \`contact\`;`)
  await safeRun(db, sql`DROP TABLE IF EXISTS \`footer\`;`)
}
