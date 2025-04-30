/// <reference types="@rsbuild/core/types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_MQTT_SERVER: string;
      PUBLIC_PLACEMENT_CENTER: string;
      PUBLIC_JOURNAL_SERVER: string;
    }
  }
}

export {};
