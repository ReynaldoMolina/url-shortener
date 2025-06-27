export async function shortenUrl(longUrl) {
  const apiKey =  import.meta.env.PUBLIC_API_KEY;
  const endpoint = "https://shortly-rm.vercel.app/api/shorten";

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api': apiKey,
      },
      body: JSON.stringify({ url: longUrl }),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
