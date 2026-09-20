/**
 * Ensures an external URL has a protocol prefix.
 * If the URL doesn't start with "http://" or "https://", prepends "https://".
 *
 * @param {string} url - The URL string to format.
 * @returns {string} The formatted URL with a protocol prefix.
 */
export function formatExternalUrl(url) {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}
