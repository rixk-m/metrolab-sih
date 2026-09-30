# Local Development Setup

## Prerequisites
- Node.js LTS
- npm / pnpm
- Git
- Supabase project
- GitHub account

## Installation

```bash
git clone <repository-url>
cd metrolab
npm install
```

Create `.env.local` using `ENVIRONMENT.md`.

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Recommended Project Structure

```text
src/
├── app/
├── components/
├── features/
│   ├── instruments/
│   ├── tests/
│   ├── reports/
│   └── dashboard/
├── lib/
│   ├── supabase/
│   ├── validation/
│   └── calculations/
├── server/
└── types/
```
