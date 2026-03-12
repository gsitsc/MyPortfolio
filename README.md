# MyPortfolio

Static portfolio hosted on Firebase Hosting.

## Deploy Readiness

Hosting root is `public/` with SPA rewrite to `index.html`.

Configured cache policy in `firebase.json`:
- `index.html`: `no-cache, no-store, must-revalidate`
- `styles/**`: `public, max-age=86400`
- `scripts/**`: `public, max-age=86400`
- `assets/**`: `public, max-age=604800`

This keeps HTML fresh on every visit while still caching static resources for performance.

## Deploy Commands

From the repository root:

```powershell
firebase.cmd deploy --only hosting
```

If needed, validate target first:

```powershell
firebase.cmd hosting:sites:list
```

## Final Smoke Checklist

Run after each deploy:

1. Page load and layout shell
- Home page loads without console errors.
- Header remains sticky and does not overlap hero content.

2. Navigation and section behavior
- Nav links scroll to the correct section.
- Active nav highlighting updates while scrolling.
- Header progress bar moves with scroll position.

3. Hero and interaction feedback
- Hero does not show `Now viewing: Intro` on initial load.
- Hero dynamic note appears only after scrolling into sections (About, Experience, Work, Skills, Contact).
- Contact status toast appears and dismisses cleanly.

4. Work and contact interactions
- Each `See project highlights` toggle expands/collapses correctly.
- `Escape` collapses open work highlights.
- Contact cards respond to hover/focus/touch without sticky visual artifacts.

5. Mobile checks (<=760px and <=400px)
- Header wraps cleanly; no overlap between CTA, progress line, and content.
- Section label near progress bar is hidden on mobile.
- Buttons remain tap-friendly and full-width on very small screens.
- Mobile show-more controls for experience/work still function.

6. Accessibility and motion
- Keyboard focus is visible for all interactive controls.
- Skip link is reachable and functional.
- Reduced-motion preference disables non-essential motion.

7. Asset fallback
- If `assets/profile-photo.jpg` is unavailable, fallback avatar and portrait states still render correctly.
