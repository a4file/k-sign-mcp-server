# Docker seed database

`ksign.db` is a pre-collected snapshot of public KSL data (~37k terms) baked into the Docker image for KC Git deploy, where runtime env vars are not available.

Refresh after local collection:

```bash
npm run db:setup
npm run db:export-seed
```
