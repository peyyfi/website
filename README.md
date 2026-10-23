# Peyyfi waitlist

The repository contains the Next.js waitlist website. Its Django backend lives
separately in `dev/Backend/waitlist-service` and stores signups in MongoDB.

The signup form accepts an email address or a phone number in one field. When
entering a phone number, the country selector shows flags and defaults to
Ghana (`+233`). Visitors can choose another country; phone numbers are validated
and sent to Django in international format.

## Frontend

Copy `.env.example` to `.env.local`, then set `WAITLIST_API_SECRET` to the same
value used by Django.

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Search and sharing

The production canonical URL defaults to `https://www.peyyfi.io/`. Set `SITE_URL`
in the Next.js environment if the public domain changes. It is shared by the
canonical tag, Open Graph metadata, organization/website structured data and sitemap.

Next.js serves `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` and a
1200 × 630 `/opengraph-image` sharing card. The header, splash, browser icons and
sharing card use the current mobile app icon. Vercel preview deployments are
marked `noindex` and excluded from the sitemap.

After deployment, submit `https://www.peyyfi.io/sitemap.xml` in Google Search
Console and request indexing of the homepage. The local changes take effect on
the public site when this Next.js project is deployed.

## Backend

The Django service lives in
[`../../Backend/waitlist-service/`](../../Backend/waitlist-service). From this
website's root folder, run it locally with:

```bash
cd ../../Backend/waitlist-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
docker compose up -d mongo
cp .env.example .env
# Edit .env, then load the MongoDB connection and shared API secret.
set -a
source .env
set +a
python manage.py migrate
python manage.py runserver
```

The frontend keeps `/api/waitlist` as its public endpoint and forwards valid
submissions to Django over the server-side `WAITLIST_API_URL`. Browser clients
never receive the shared API secret.

## Checks

```bash
pnpm lint
pnpm build
(cd ../../Backend/waitlist-service && .venv/bin/python manage.py test waitlist)
```
