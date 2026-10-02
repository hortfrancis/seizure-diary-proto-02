# Design

## File structure

The suggested layout for Step 01, based on the standard Cloudflare + Vite + React template:

```
seizure-diary-proto-02/
├── BRIEF.md
├── PLAN.md
├── docs/
│   ├── design.md
│   └── system-diagram-level-0.md
│
├── index.html                # Vite entry HTML
├── package.json
├── vite.config.ts            # React, Tailwind and Cloudflare plugins
├── wrangler.jsonc            # Cloudflare Worker config
├── tsconfig.json
├── components.json           # shadcn/ui config
│
├── src/                      # Front end (React)
│   ├── main.tsx              # Mounts the app
│   ├── App.tsx               # Holds the current screen and switches between them
│   ├── index.css             # Tailwind import + theme
│   ├── screens/              # One file per screen in the flow
│   │   ├── HomeScreen.tsx
│   │   ├── RecordingScreen.tsx
│   │   ├── ProcessingScreen.tsx
│   │   ├── ReviewScreen.tsx
│   │   └── SavedScreen.tsx
│   ├── components/
│   │   └── ui/               # shadcn/ui components (added by its CLI)
│   ├── lib/
│   │   ├── utils.ts          # shadcn helper (cn)
│   │   ├── mockEvent.ts      # Hard-coded example event for the Review screen
│   │   └── format.ts         # Date/time formatting helpers
│   └── types.ts              # Shared types, e.g. DiaryEvent
│
└── worker/                   # Back end (Cloudflare Worker)
    └── index.ts              # Serves the app for now; API routes later
```

## Packages

Everything needed for Step 01. Nothing for recording, AI or D1 yet.

### Dependencies

| Package | Why |
| --- | --- |
| `react` | UI library |
| `react-dom` | Renders React in the browser |
| `lucide-react` | Icons (shadcn's default) |
| `class-variance-authority` | Used by shadcn/ui components for variants |
| `cn` | shadcn's class-name helper (replaces `clsx` + `tailwind-merge`) |
| `radix-ui` | Accessible primitives behind shadcn/ui components (added by the shadcn CLI) |
| `shadcn` | Provides `shadcn/tailwind.css`, imported in `index.css` (added by the shadcn CLI) |
| `@fontsource-variable/geist` | Geist font, from shadcn's default "Nova" preset (added by the shadcn CLI) |

### Dev dependencies

| Package | Why |
| --- | --- |
| `vite` | Dev server and build |
| `@vitejs/plugin-react` | React support for Vite |
| `@cloudflare/vite-plugin` | Runs the Worker inside the Vite dev server |
| `wrangler` | Cloudflare CLI, used for deploying and generating types |
| `typescript` | TypeScript |
| `@types/react` | React types |
| `@types/react-dom` | React DOM types |
| `@types/node` | Node types, for the `@/` path alias in `vite.config.ts` |
| `tailwindcss` | Tailwind CSS (v4) |
| `@tailwindcss/vite` | Tailwind's Vite plugin |
| `tw-animate-css` | Animations used by shadcn/ui |

### Notes on packages

- **shadcn/ui isn't a package.** We run its CLI with `npx shadcn@latest`, which copies component files into `src/components/ui/`. Some components bring small extra dependencies (e.g. Radix UI packages), and the CLI installs those itself.
- **Icons:** we use Lucide (`lucide-react`) because it's shadcn's default, so the CLI and its components work with no extra setup.
- **TypeScript 7** works fine with this setup.
- **Versions:** we'll install the latest of each and let `package-lock.json` pin them.

## Notes

- **Screens, not routes:** `App.tsx` keeps a single `screen` value in state and renders the matching screen. A router can come later if we need one.
- **`src/` vs `worker/`:** front end and back end sit side by side in one project, so there's one `npm run dev` and one deploy.
- **Added in later steps:**
  - `src/lib/recorder.ts` for microphone recording
  - API routes in `worker/`
  - a `migrations/` folder for D1
