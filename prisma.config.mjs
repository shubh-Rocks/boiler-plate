// prisma.config.mjs
import 'dotenv/config'             // loads .env into process.env
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    // Use env() helper so Prisma CLI reads it correctly
    url: env('DATABASE_URL'),
    // You can also define a directUrl env var for migrations if you use Neon pooling:
    // directUrl: env('DIRECT_URL'),
  },
})
