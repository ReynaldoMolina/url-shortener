export async function shortenUrl(longUrl) {
  const production = import.meta.env.PROD;
  const apiKey = production ? import.meta.env.API_KEY : import.meta.env.PUBLIC_API_KEY;
  const endpoint = "shortly-rm.vercel.app/shorten";

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
