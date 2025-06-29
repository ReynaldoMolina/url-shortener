import { useState, useEffect } from "react";
import { shortenUrl } from "../assets/shortenUrl";

export function Shortener() {
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSave(newUrl) {
    const isInList = data.some(e => e.shortUrl === newUrl.shortUrl);
    if (isInList) {
      setError('The URL already exists.');
      return;
    };

    try {
      const newList = [newUrl, ...data];
      localStorage.setItem("SHORTENED_LINKS", JSON.stringify(newList));
      setData(newList);
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
    }
  }

  async function handleShorten(e) {
    e.preventDefault();
    const url = input.trim();
    if (url === '') return setError('Please add a link');
    setLoading(true);
    setError(null);

    try {
      const result = await shortenUrl(url);
      handleSave(result);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(shortUrl) {
    try {
      const newList = data.filter(e => e.shortUrl !== shortUrl);
      localStorage.setItem("SHORTENED_LINKS", JSON.stringify(newList));
      setData(newList);
    } catch (error) {
      console.error("Failed to delete from localStorage:", error);
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("SHORTENED_LINKS");
      if (!raw) return;

      const loadedList = JSON.parse(raw);
      if (loadedList) setData(loadedList);
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }, []);

  const inputError = error ? 'text-red-brand outline-2 outline-red-brand' : 'text-very-dark-violet';

  return (
    <section className="flex flex-col" id="shorten">
      <div className="px-6 bg-[linear-gradient(to_bottom,_white_0%,_white_50%,_#f0f1f6_50%,_#f0f1f6_100%)] mt-15">
        <form
          className="flex flex-col md:flex-row gap-4 rounded-xl p-7 md:p-11 bg-[url(/bg-shorten-mobile.svg)] md:bg-[url(/bg-shorten-desktop.svg)] bg-size-[75%] md:bg-cover md:bg-center md:bg-fit bg-no-repeat bg-top-right bg-violet-brand max-w-5xl w-full mx-auto md:items-center"
          onSubmit={handleShorten}>
          <div className="flex flex-col gap-2 w-full md:relative">
            <input
              className={`py-3 px-4 bg-white rounded-lg w-full ${inputError}`}
              placeholder="Shorten a link here..."
              value={input.url}
              onChange={(event) => {
                if (error) setError(null);
                setInput(event.target.value);
              }}
              ></input>
            {error && 
              <p className="text-red-400 text-sm italic md:absolute md:-bottom-7">{error}</p>
            }
          </div>

          <button
            className="text-white text-center font-bold rounded-lg bg-cyan-brand h-fit p-3 w-full md:w-55 cursor-pointer hover:bg-cyan-hover transition text-xl"
            type="submit">
            {loading ? 'Generating...' : 'Shorten It!' }
          </button>
        </form>
      </div>
      
      <LinksList data={data} handleDelete={handleDelete} />
    </section>
  );
}

function UrlDiv({ data, handleDelete }) {
  const [copied, setCopied] = useState(false);
  const bgColor = copied ? 'bg-violet-brand' : 'bg-cyan-brand hover:bg-cyan-hover';
  const text = copied ? 'Copied!' : 'Copy';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopied(state => !state);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Error copying to clipboard. Try again.');
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 rounded-lg bg-white pb-4 md:px-5 md:py-2 max-w-5xl w-full mx-auto shadow-xs">
      <p className="text-very-dark-violet px-4 md:px-0 py-3 md:py-0 border-b-1 md:border-b-0 border-b-neutral-200 md:w-full">{data.fullUrl}</p>
      <a href={`https://${data.shortUrl}`} target="_blank" className="text-cyan-brand px-4 md:px-0 md:min-w-fit hover:underline">{data.shortUrl}</a>
      <div className="flex w-full md:w-fit gap-2 px-4 md:px-0 items-center">
        <button
          className={`rounded-lg font-bold text-white p-3 md:p-2 w-full md:min-w-20 md:w-20 ${bgColor} cursor-pointer transition text-sm`}
          onClick={handleCopy}>
          {text}
        </button>
        <button
          className="rounded-lg font-bold text-white p-3 md:p-2 w-full md:min-w-20 md:w-20 bg-red-400 hover:bg-red-500 cursor-pointer transition text-sm"
          onClick={() => handleDelete(data.shortUrl)}>
          Delete
        </button>
      </div>
    </div>
  );
}

function LinksList({ data, handleDelete }) {
  if (data.length === 0) return;

  return (
    <section className="flex flex-col gap-3 p-6 bg-gray-section">
      {data.map(url => 
        <UrlDiv
          key={url.shortUrl}
          data={url}
          handleDelete={handleDelete} />
      )}
    </section>
  );
}