type UnauthorizedListener = () => void;

const listeners = new Set<UnauthorizedListener>();

/** Subscribe to 401 responses detected by the API client. Returns an unsubscribe fn. */
export function onUnauthorized(listener: UnauthorizedListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Called by the API layer only — it never decides what happens next. */
export function emitUnauthorized(): void {
  listeners.forEach((listener) => listener());
}