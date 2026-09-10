# The Brink Agency — Web Platform & Payload CMS

A modern, full-stack website and content management platform built for **The Brink Agency**. Powered by **Next.js 15 (App Router)**, **Payload CMS 3.x**, **TypeScript**, **Tailwind CSS**, and an embedded **SQLite** database.

---

## Features

- **Dynamic Frontend**: Modern, responsive landing page styled with Tailwind CSS, featuring an interactive hero section, video background, dynamic articles grid, and contact block.
- **Payload CMS 3.x Admin**: Headless CMS with Lexical rich-text editing, media uploads, and granular content management.
- **Custom Collections & Globals**:
  - **Collections**: `Articles`, `ContactSubmissions`, `Pages`, `Media`, and `Users`.
  - **Globals**: `Header`, `Hero`, `Contact`, and `Footer`.
- **Inquiry Handling & Email Notifications**: Automated confirmation email dispatched upon contact form submission with local audit logging to `logs/emails/`.
- **Daily Digest Cron API**: Scheduled endpoint (`/api/cron/daily-digest`) aggregating new customer inquiries and notifying the team.
- **Zero-Config Database**: Bundled SQLite database (`payload.db`) with automated startup migrations.

---

## Prerequisites

Before setting up the project, ensure your environment meets the following requirements:

- **Node.js**: `v18.20.0` or higher (`v20.x` recommended; Node `20.18.0` is used in production)
- **Package Manager**: `npm` (v9+ or v10+), `pnpm`, or `yarn`
- **Git**: For cloning and version control

---

## Project Setup Instructions

Follow these steps to set up the project locally from scratch:

### 1. Clone the Repository

```bash
git clone https://github.com/markosvarv/the_brink_agency-assignment.git
cd the_brink_agency-assignment
```

### 2. Install Dependencies

Install all project dependencies using npm:

```bash
npm install
```

*(Alternatively, you can use `pnpm install` or `yarn install`.)*

### 3. Configure Environment Variables

Create a local `.env` file by copying the provided example template:

```bash
cp .env.example .env
```

Open `.env` in your editor and provide a unique `PAYLOAD_SECRET`. You can generate a cryptographically strong secret via:

```bash
openssl rand -hex 32
```

> [!WARNING]
> **Security Reminder**: Never commit your `.env` file, real passwords, secret keys, or API tokens to the repository. The `.gitignore` file is already configured to exclude `.env` and local database files.

---

## Required Environment Variables

The application reads configuration values from environment variables. Below is the full specification:

| Variable | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PAYLOAD_SECRET` | **Yes** | — | A random secret string used by Payload CMS to encrypt session cookies and sign authentication tokens. |
| `DATABASE_URI` | No | `file:./payload.db` | The connection URI for the SQLite database adapter. In local development, defaults to `file:./payload.db`. |
| `NEXT_PUBLIC_SERVER_URL` | No | `http://localhost:3000` | The public base URL of the web server. Used for canonical URLs and absolute asset links. |
| `CRON_SECRET` | No | — | Optional secret token to protect the `/api/cron/daily-digest` endpoint. When set, requests must pass this secret via `Authorization: Bearer <CRON_SECRET>` or `?secret=<CRON_SECRET>`. |
| `DAILY_DIGEST_EMAIL` | No | `vacancy@example.com` | The destination email address for daily contact inquiries digest reports. |
| `SMTP_FROM` | No | `The Brink <noreply@thebrink.agency>` | The sender display name and email address for system-generated notification emails. |

### Example `.env` Configuration

```env
PAYLOAD_SECRET=e7b4c6e9a18451c0989f664a781bcf7623910c24db9470c1e405a396263e8a4d
DATABASE_URI=file:./payload.db
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
CRON_SECRET=sample_dev_cron_secret
DAILY_DIGEST_EMAIL=vacancy@example.com
SMTP_FROM="The Brink <noreply@thebrink.agency>"
```

---

## Instructions for Running the Project Locally

### 1. Database Migrations

The project includes an automated database migration runner (`src/scripts/run-migrations.ts`) ensuring all tables, columns, and relationships are properly configured.

To apply migrations manually:

```bash
npm run migrate
```

*(Note: Migrations run automatically when starting the production build via `npm run start`.)*

### 2. Start the Development Server

To launch the Next.js and Payload CMS development server with hot reload:

```bash
npm run dev
```

Once started, open your browser and navigate to:
- **Frontend Website**: [http://localhost:3000](http://localhost:3000)
- **Payload Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 3. Build & Run for Production

To test or execute the production build locally:

```bash
# Generate import maps and build the Next.js app
npm run build

# Run startup migrations and serve the production app
npm run start
```

### Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with hot module reloading. |
| `npm run build` | Cleans `.next`, generates Payload import maps, and produces an optimized production build. |
| `npm run start` | Executes pending SQLite migrations and starts the production server. |
| `npm run migrate` | Manually executes pending SQLite migrations using tsx. |
| `npm run lint` | Runs ESLint across TypeScript and React source files. |
| `npm run generate:types` | Regenerates TypeScript types (`src/payload-types.ts`) based on Payload collections and globals. |
| `npm run generate:importmap` | Generates component import maps for Payload CMS admin UI. |

---

## Instructions for Accessing the Payload Admin Panel

The Payload CMS administrative dashboard is served alongside the Next.js application.

### 1. Open the Admin Panel

Navigate to:
```
http://localhost:3000/admin
```

### 2. Create the Initial Admin User

If you are running the project with a fresh database:
1. When visiting `http://localhost:3000/admin`, Payload will automatically detect that no users exist and redirect you to the **Create First User** screen (`/admin/create-first-user`).
2. Enter your desired administrator credentials:
   - **Email**: Enter your email address (e.g. `admin@thebrink.agency`).
   - **Password**: Choose a secure password (must be at least 8 characters).
   - **Confirm Password**: Re-type your password.
3. Click **Create** to complete setup.

### 3. Log In

If an admin user has already been registered:
1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
2. Enter your registered **Email** and **Password**.
3. Click **Login**.

### 4. Admin Panel Overview

Once logged in, you can manage all site content through the sidebar:

- **Collections**:
  - **Articles**: Create, publish, draft, and edit blog posts/news with rich text (Lexical), excerpt, cover image, and metadata.
  - **Contact Submissions**: View and monitor inquiries submitted by visitors through the landing page contact form.
  - **Pages**: Manage custom page configurations and layouts.
  - **Media**: Upload, inspect, and organize image assets and video files.
  - **Users**: Manage administrative users and roles.
- **Globals**:
  - **Header**: Configure navigation links and brand elements.
  - **Hero**: Manage homepage hero title, description, and background video/poster.
  - **Contact**: Configure contact section labels, addresses, telephone numbers, and 24/7 emergency dispatch info.
  - **Footer**: Update footer links, social media channels, and copyright notice.

---

## Additional Features & Testing

### Contact Form & Email Notifications
- When a user submits the contact form on the frontend (`/`), a submission document is created in the `contact-submissions` collection.
- An automated confirmation email is immediately generated and dispatched. In local development, email payloads are logged directly to the terminal and appended to `logs/emails/sent-emails.jsonl`.

### Daily Digest Cron Job
- Inquiries can be aggregated into a daily digest and dispatched to `DAILY_DIGEST_EMAIL`.
- Trigger the endpoint locally:
  ```bash
  curl -X POST http://localhost:3000/api/cron/daily-digest
  ```
  *(If `CRON_SECRET` is configured in your `.env`, provide `-H "Authorization: Bearer <CRON_SECRET>"` or append `?secret=<CRON_SECRET>`.)*

---

## License

This project is licensed under the [MIT License](LICENSE.md).
