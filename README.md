# EMP UNKNOWN

Responsive anonymous-message site for mobile and desktop.

## Setup

- Install dependencies with npm install.
- Set DATABASE_URL to a Neon PostgreSQL connection string in local .env.local and in Vercel environment variables.
- Run npm run dev.

The public form validates message length and stores submissions in anonymous_messages. The admin dashboard and authentication still need to be added before using this as a production inbox. Do not advertise the service as guaranteeing absolute anonymity; infrastructure may process limited connection logs.
