import { StyleValue } from "nuxt/dist/app/compat/capi";

export interface Transcribe {
  text: string;
  modified_text?: string;
  start: number;
  end: number;
  confidence: number;
}

export interface Config {
  style: StyleValue;
  highlight_style: StyleValue;
}
