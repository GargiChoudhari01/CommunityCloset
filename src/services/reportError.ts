export function reportError(error: unknown): void {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  window.dispatchEvent(new CustomEvent('app-error', { detail: message }));
}
