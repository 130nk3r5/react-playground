## Next.js App Router Course - Starter

Playground to try out nextjs and React.

## Hosting
http://vercel.com/

# Demo
https://react-playground-tau-ashy.vercel.app/

### Env

```
# Copy from .env.local on the Vercel dashboard
# https://nextjs.org/learn/dashboard-app/setting-up-your-database#create-a-postgres-database
POSTGRES_URL=postgres://neondb_owner:npg_iHfRg2oNOpb8@ep-weathered-voice-a45yeou2-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_PRISMA_URL=postgres://neondb_owner:npg_iHfRg2oNOpb8@ep-weathered-voice-a45yeou2-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
POSTGRES_URL_NON_POOLING=postgres://neondb_owner:npg_iHfRg2oNOpb8@ep-weathered-voice-a45yeou2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-weathered-voice-a45yeou2-pooler.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_iHfRg2oNOpb8
POSTGRES_DATABASE=neondb

# `openssl rand -base64 32`
AUTH_SECRET=d329928facb19c0320087970b9a42f5c
AUTH_URL=http://localhost:3000/api/auth
```