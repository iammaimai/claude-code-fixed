declare const MACRO: {
  BUILD_TIME: string;
  FEEDBACK_CHANNEL: string;
  ISSUES_EXPLAINER: string;
  NATIVE_PACKAGE_URL: string | null;
  PACKAGE_URL: string;
  VERSION: string;
  VERSION_CHANGELOG: string | null;
};

declare module 'bun:bundle' {
  export function feature(name: string): boolean;
}

declare module 'bun:ffi' {
  export type FFIFunction = (...args: unknown[]) => unknown;
  export const FFIType: Record<string, unknown>;
  export function dlopen(
    library: string,
    symbols: Record<string, unknown>,
  ): {
    symbols: Record<string, FFIFunction>;
    close: () => void;
  };
}
