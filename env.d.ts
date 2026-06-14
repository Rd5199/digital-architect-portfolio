/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  /** Scheduler link for the audit "Book a call" CTA. Empty → scroll to #contact. */
  readonly VITE_BOOKING_URL?: string
  /** Web3Forms access key used to capture audit leads. Empty → lead capture skipped. */
  readonly VITE_WEB3FORMS_KEY?: string
  /** Endpoint the audit form POSTs to. Defaults to /api/audit. */
  readonly VITE_AUDIT_ENDPOINT?: string
  /** Dwell time per scanning stage, in ms. Defaults to 850. */
  readonly VITE_AUDIT_STAGE_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
