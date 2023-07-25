import React, { useEffect, useState, useRef } from "react";
import * as Separator from "@radix-ui/react-separator";
import Select from "./components/Select";
import { FontContext } from "./context/FontContext";
import FontSetter from "./context/FontSetter";
import SwitchDemo from "./components/Switch";
import { generate, count } from "random-words";
import { motion } from "framer-motion";

function App() {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [font, setFont] = useState("sans");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return isDarkMode ? "dark" : "light";
  });
  const [data, setData] = useState([]);

  const [resultOk, setResultOk] = useState(true);
  const playAudio = (url) => {
    const audio = new Audio(url);
    audio.play();
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [theme]);

  useEffect(() => {
    const updateTheme = (e) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
    };

    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addListener(updateTheme);

    return () => darkModeQuery.removeListener(updateTheme);
  }, []);


  const fetchWord = async (word) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setResultOk(true);
      } else {
        setResultOk(false);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword) {
      fetchWord(keyword);
    } else {
      alert("Please enter a keyword");
    }
  };

  const randomWordGenerator = () => {
    const words = generate();
    if (words) {
      setKeyword(words);
      fetchWord(words);
    } else {
      alert("Something Wrong");
    }
  }
  
  return (
    <FontContext.Provider value={{ font, setFont }}>
      <FontSetter />
      <main className="relative">
        <nav className="max-w-3xl mx-auto flex justify-between py-6 items-center font-normal px-3 lg:px-0">
          <a
            href="/"
            className="inline-block text-slate-600 dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-9 h-9 stroke-1 hover:stroke-[1.5px] transition-all duration-300 ease-in-out"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </a>
          <ul className="flex gap-4 items-center dark:text-white">
            <Select setFont={setFont} />
            <Separator.Root
              className="bg-slate-800 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-[30px] data-[orientation=vertical]:w-px dark:bg-white"
              decorative
              orientation="vertical"
            />
            <SwitchDemo
              theme={theme}
              setTheme={setTheme}
            />
          </ul>
        </nav>
        {/* SEARCH INPUT */}
        <form
          className="max-w-3xl mx-auto px-3 lg:px-0 py-3"
          onSubmit={handleSubmit}
        >
          <label className="relative block">
            <span className="sr-only">Search keyword</span>
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
              onClick={handleSubmit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 text-violet-800 dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              className="placeholder:text-slate-500 block bg-slate-100 w-full border-none rounded-xl py-4 shadow-md focus:outline-none focus:border-violet-500 focus:ring-violet-500 focus:ring-1 sm:text-sm font-bold text-black placeholder:font-normal transition-all duration-150 dark:bg-slate-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:ring-1 dark:text-white dark:placeholder-white"
              placeholder="Search for word..."
              type="text"
              name="keyword"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
              }}
              autoComplete="off"
            />
          </label>
        </form>

        {/* Without Search */}
        {data.length === 0 && resultOk && (
          <div className="max-w-3xl mx-auto px-3 lg:px-0 mt-10">
            <motion.button
              type="button"
              className="w-full text-center cursor-pointer bg-violet-200 text-violet-900 font-bold text-lg py-2 px-6 rounded-md hover:text-violet-200 hover:bg-violet-900 dark:text-violet-200 dark:bg-violet-900"
              onClick={() => randomWordGenerator()}
              whileHover={{
                scale: 0.95,
                transition: {
                  type: "spring",
                  duration: 1,
                },
              }}
              whileTap={{ scale: 0.9 }}
            >
              Random word generator
            </motion.button>
          </div>
        )}

        {/* SEARCH RESULTS */}
        {loading && (
          <div className="border shadow rounded-md p-4 max-w-3xl my-10 w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-10 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="rounded-full bg-slate-200 h-32 w-32"></div>
            </div>
          </div>
        )}
        {resultOk === false && (
          <div className="max-w-3xl mx-auto px-3 lg:px-0 font-bold mt-10 xs:text-2xl text-xl text-blue dark:text-white">
            No result found for{" "}
            <span className="text-violet-600">{keyword} 🖕🏻</span>
          </div>
        )}
        {data.length !== 0 && resultOk && (
          <div className="max-w-3xl mx-auto px-3 lg:px-0 pt-8">
            {data.map((d, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-4xl xs:text-6xl my-1 py-0 font-bold text-slate-900 dark:text-white">
                        {d.word}
                      </h2>
                      <span className="text-xl text-violet-600 dark:text-white">
                        {d.phonetic}
                      </span>
                    </div>
                    {d.phonetics.map((item, index) => {
                      console.log(item.audio);
                      if (item.audio !== "") {
                        return (
                          <span
                            className="bg-violet-100 w-14 h-14 xs:w-20 xs:h-20 grid place-items-center rounded-full"
                            key={index}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#581c87"
                              viewBox="0 0 24 24"
                              strokeWidth={0}
                              stroke="currentColor"
                              className="w-7 h-7 #581c87 stroke-0 cursor-pointer"
                              onClick={() => playAudio(item.audio)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                              />
                            </svg>
                          </span>
                        );
                      }
                    })}
                  </div>
                  {/* VERB, NOUN */}
                  <div className="mt-8">
                    {d.meanings.map((item, index) => {
                      return (
                        <div key={index}>
                          <h3 className="text-black italic font-bold flex items-center relative dark:text-white mt-10">
                            {item.partOfSpeech}
                            <span className="flex-grow h-[0.5px] bg-black ml-4 dark:bg-slate-500" />
                          </h3>
                          <div className="mt-8">
                            <h4 className="text-base text-slate-600 mb-4 dark:text-gray-100">
                              Meanings
                            </h4>
                            <ul className="text-base text-black gap-3 flex flex-col list-disc px-10">
                              {item.definitions.map((i, index) => {
                                return (
                                  <li
                                    className="text-violet-600 pr-10 dark:text-violet-200"
                                    key={index}
                                  >
                                    <span className="text-black dark:text-white">
                                      {i.definition}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          {item.synonyms.length !== 0 && (
                            <div className="mt-8 flex gap-6">
                              <h4 className="text-base text-slate-600 mb-4 dark:text-gray-100">
                                Synonyms
                              </h4>
                              <span className="text-violet-800 lowercase dark:text-violet-200">
                                {item.synonyms}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* SOURCE */}
                  <div className="my-8 flex flex-col">
                    <span className="w-full h-[0.5px] bg-black dark:bg-white"></span>
                    <div className="flex flex-wrap w-full gap-4 items-center my-8">
                      <span className="text-slate-500 dark:text-white font-bold text-sm">
                        Source
                      </span>
                      {d.sourceUrls.map((item, index) => {
                        return (
                          <a
                            href={item}
                            className="text-slate-600 underline inline-flex gap-1 text-sm items-center dark:text-white"
                            key={index}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                              />
                            </svg>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <span className="w-full block h-[0.1px] bg-black/30 dark:bg-white mb-10"></span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </FontContext.Provider>
  );
}

export default App;
