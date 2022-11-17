import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";

import Link from 'next/link';
import { useRouter } from "next/router";
import { ListsProvider } from "../lib/ListsContext";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>Pickadate</title>
        <meta name="description" content="Website designed to extract a random person from the list for school oral exams (Welcome to Italy).It also the possibility of creating a calendar until the end of the month of all the students on a specific list." />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="w-screen min-h-[600px] overflow-x-hidden h-screen bg-black text-white font-main text-base relative">
        <header className="overflow-hidden bg-[#000718]/50 w-full  max-h-[90px] min-h-[90px] grid-flow-col grid grid-cols-3 justify-center items-center  text-center  border-b border-cyan-800/20 font-sub">

          <Link href={`/lists`} className="px-4 py-1 min-w-fit hover:text-[#05c8cf] hover:text-xl transition-all duration-300 text-center ">
            <h1 className={pathname == `/lists` ? `text-[#0fffbf] [text-shadow:_2px_2px_5px_#080]` : ``}>Lists</h1>
          </Link>
          <Link href={`/pick`} className="px-4 py-1 min-w-fit hover:text-[#05c8cf] hover:text-xl transition-all duration-300 text-center">
            <h1 className={pathname == `/` ? `text-[#0fffbf] [text-shadow:_2px_2px_5px_#080]` : ``}>Random <br className="block" />Pick</h1>
          </Link>
          <Link href={`/calendar`} className="px-4 py-1 min-w-fit hover:text-[#05c8cf] hover:text-xl transition-all duration-300 text-center">
            <h1 className={pathname == `/calendar` ? `text-[#0fffbf] [text-shadow:_2px_2px_10px_#080]` : ``}>Generate <br className="block" />Calendar</h1>
          </Link>

        </header>

        <main className="max-h-[calc(100vh_-_90px)] h-[calc(100vh_-_90px)] w-full text-white">
          <ListsProvider>
            <Component {...pageProps} />
          </ListsProvider>
        </main>
      </div>
    </>
  );
};

export default MyApp;
