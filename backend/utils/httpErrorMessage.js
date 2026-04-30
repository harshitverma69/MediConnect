/**
 * Cloudinary (and some TLS layers) reject with `{ error: Error }` where the
 * top-level object has no `.message`, so `error.message` is undefined and
 * JSON responses become `{"success":false}` with no user-visible text.
 */
export default function httpErrorMessage(err, fallback = "Something went wrong") {
  if (err == null) return fallback;
  if (typeof err === "string") return err;
  const nested = err.error;
  const m =
    err.message ||
    (nested && typeof nested === "object" && nested.message) ||
    (typeof nested === "string" ? nested : null);
  return m || fallback;
}
