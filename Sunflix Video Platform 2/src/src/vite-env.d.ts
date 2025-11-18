/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONGODB_URI: string;
  readonly VITE_API_URL: string;
  readonly VITE_DB_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
