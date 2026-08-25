// Any setup scripts you might need go here

// Load .env files. Next.js reads `.env.local` on its own, but vitest does
// not — `dotenv/config` alone only looks for a plain `.env`, which this repo
// doesn't have (per Task 1's report, all real local config lives in
// `.env.local`). Load that explicitly so DATABASE_URL/PAYLOAD_SECRET/etc.
// are set for the Payload Local API used by integration tests.
import { config } from 'dotenv'

config({ path: '.env.local' })
