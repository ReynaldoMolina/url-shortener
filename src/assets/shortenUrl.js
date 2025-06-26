export async function shortenUrl(longUrl) {
  const API_KEY = import.meta.env.PUBLIC_API_KEY;

  const endpoint =
    `https://cutt.ly/api/api.php?key=${API_KEY}&short=${encodeURIComponent(longUrl)}`;

  const res = await fetch(endpoint);
  const data = await res.json();

  const status = data.url.status;
  if (status !== 7) {
    throw new Error('Cutt.ly error code: ' + status);
  }
  
  return {
    long: data.url.fullLink,
    short: data.url.shortLink,
    title: data.url.title ?? ''
  };
}
