import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'backend/prisma/schema.prisma',
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/el_ma3ras_db?sslmode=disable',
  },
});
