# Faradays Landing Page

A minimalist "coming soon" landing page for **Faradays**, featuring a retro pixel-art aesthetic with animated electric wire effects.

## Overview

The landing page serves as a teaser for the upcoming Faradays launch. It features a dark theme with pixelated typography (Press Start 2P), smooth entrance animations, and a custom canvas-based electric current animation at the bottom of the screen.

The page is written in Portuguese and includes a contact email for those who want to get in touch before launch.

## Tech Stack

- **React** + **TypeScript**
- **Vite** (build tool + dev server)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **shadcn/ui** + **Radix UI** (component primitives)

## Getting Started

Prerequisites: [Node.js](https://nodejs.org/) (v18+) and npm (or bun).

```sh
# Install dependencies
npm install

# Start dev server (port 8080)
npm run dev
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start development server     |
| `npm run build`   | Production build             |
| `npm run preview` | Preview production build     |
| `npm run lint`    | Run ESLint                   |
| `npm run test`    | Run tests (Vitest)           |

## Project Structure

```
src/
├── pages/
│   └── Index.tsx            # Main landing page
├── components/
│   ├── ElectricWire.tsx     # Canvas-based lightning animation
│   ├── DotsCycle.tsx        # Animated dots effect
│   └── SmileyPulse.tsx      # Pulsing smiley component
├── styles/
│   └── pixel.css            # Pixel-art frame styles
├── App.tsx                  # Root component with routing
└── main.tsx                 # Entry point
```

## License

All rights reserved.
