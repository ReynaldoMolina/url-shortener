import { useState } from "react";
import { shortenUrl } from "../assets/shortenUrl";

export function Shortener() {
  const [input, setInput] = useState({ url: '', empty: false });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleShorten(e) {
    e.preventDefault();
    const url = input.url.trim();
    if (url === '') {
      setInput({...input, empty: true});
      return;
    };

    setLoading(true);
    setError(null);

    try {
      const result = await shortenUrl(url);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

    const data = await shortenUrl(input.url);
    setData(data);
    setShowResult(true);
  }

  const inputEmpty = input.empty ? 'text-red-brand outline-2 outline-red-brand' : 'text-very-dark-violet';

  return (
    <section className="flex flex-col">
      <div className="px-6 bg-[linear-gradient(to_bottom,_white_0%,_white_50%,_#f0f1f6_50%,_#f0f1f6_100%)]">
        <form
          className="flex flex-col md:flex-row gap-4 rounded-xl p-7 md:p-11 bg-[url(/bg-shorten-mobile.svg)] md:bg-[url(/bg-shorten-desktop.svg)] bg-size-[75%] md:bg-cover md:bg-center md:bg-fit bg-no-repeat bg-top-right bg-violet-brand max-w-5xl w-full mx-auto md:items-center"
          onSubmit={handleShorten}>
          <div className="flex flex-col gap-2 w-full md:relative">
            <input
              className={`py-3 px-4 bg-white rounded-lg w-full ${inputEmpty}`}
              placeholder="Shorten a link here..."
              onChange={(event) => {
                const url = event.target.value;
                const empty = url === '' ? true : false
                setInput({url, empty});
              }}
              ></input>
            {(input.empty || error) && 
              <p
                className="text-red-400 text-sm italic md:absolute md:-bottom-7">
                {error ? error : 'Please add a link'}
              </p>
            }
          </div>

          <button
            className="text-white text-center font-bold rounded-lg bg-cyan-brand h-fit p-3 w-full md:w-55 cursor-pointer hover:bg-cyan-hover transition text-xl"
            type="submit">
            {loading ? 'Generating...' : 'Shorten It!' }
          </button>
        </form>
      </div>

      {data && !loading && !error && (
        <UrlDiv data={data} />
      )}
    </section>
  );
}

function UrlDiv({ data }) {
  const [copied, setCopied] = useState(false);
  const bgColor = copied ? 'bg-violet-brand' : 'bg-cyan-brand hover:bg-cyan-hover';
  const text = copied ? 'Copied!' : 'Copy';

  function handleCopy() {
    setCopied(state => !state);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10 rounded-lg bg-white pb-5 md:px-6 md:py-4 max-w-5xl w-full mx-auto">
      <p className="text-very-dark-violet px-4 md:px-0 py-3 md:py-0 border-b-1 md:border-b-0 border-b-neutral-200 md:w-full">{data.long}</p>
      <p className="text-cyan-brand px-4 md:px-0 md:min-w-fit">{data.short}</p>
      <button
        className={`rounded-lg mx-4 md:mx-0 font-bold text-white p-3 md:min-w-30 ${bgColor} cursor-pointer transition text-lg`}
        onClick={handleCopy}>
        {text}
      </button>
    </div>
  );
}