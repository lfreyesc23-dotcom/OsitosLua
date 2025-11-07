/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_FB_PIXEL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
