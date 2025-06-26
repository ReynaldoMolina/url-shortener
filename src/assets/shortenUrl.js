export async function shortenUrl(longUrl) {
  const endpoint =
    'https://api.shrtco.de/v2/shorten?url=' + encodeURIComponent(longUrl);

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const { result } = await res.json();
  return result.full_short_link;
}