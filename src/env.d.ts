/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MAILCHIMP_API_KEY: string;
  readonly MAILCHIMP_AUDIENCE_ID: string;
  readonly MAILCHIMP_SERVER_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}