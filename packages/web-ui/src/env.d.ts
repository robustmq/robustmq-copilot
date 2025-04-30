/// <reference types="@rsbuild/core/types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MQTT_SERVER: string;
      PLACEMENT_CENTER: string;
      JOURNAL_SERVER: string;
    }
  }
}

export {};
