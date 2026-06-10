/**
 * Sentry integration placeholder.
 *
 * When ready:
 * 1. npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Wire initSentry() in instrumentation.ts or next.config
 */
export function initSentry(): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // TODO: Initialize @sentry/nextjs
  }
}
