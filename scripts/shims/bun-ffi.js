export const FFIType = {};

export function dlopen() {
  throw new Error(
    "bun:ffi is not available in the recovered Node build. Use the published cli.js for upstream proxy features.",
  );
}
