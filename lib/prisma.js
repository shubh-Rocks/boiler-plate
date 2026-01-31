// lib/prisma.js
import { PrismaClient } from '../src/generated/prisma/client.ts' // adjust path to your generated output
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws' // required for Neon serverless adapter in Node environments

// neonConfig lets you tweak runtime behavior (for edge envs you might use fetch)
neonConfig.webSocketConstructor = ws

// Build a Neon adapter instance
const connectionString = process.env.DATABASE_URL
const adapter = new PrismaNeon({ connectionString })

// Create PrismaClient with adapter (v7 requires adapter or accelerateUrl)
const createClient = () => new PrismaClient({ adapter })

// --- Singleton to avoid connection exhaustion during dev hot reloads ---
// Explanation:
// - In development Next.js hot-reloads modules, which can create multiple PrismaClient instances.
// - Each PrismaClient opens a connection (or pool) to the DB; too many instances => "FATAL: too many connections".
// - To avoid that, re-use a single global variable in dev. In production we just new-up normally.
let prisma

if (process.env.NODE_ENV === 'development') {
  // Use globalThis to persist across module reloads in dev
  if (!globalThis.__prisma) {
    globalThis.__prisma = createClient()
  }
  prisma = globalThis.__prisma
} else {
  prisma = createClient()
}

export default prisma
