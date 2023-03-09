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
        <title>WhoIsNext</title>
        <meta name="description" content="Website designed to extract a random item from the list for school oral exams (Welcome to Italy).It also the possibility of creating a calendar until the end of the month of all the students on a specific list." />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="w-screen min-h-[600px] overflow-x-hidden h-screen bg-html text-white font-main text-base relative">
        <header className="grid items-center justify-center w-full grid-flow-col grid-cols-2 overflow-hidden text-center border-b bg-header/25 max-h-header h-header border-cyan-800/30 font-sub">

          <Link href={`/lists`} className="px-4 py-1 text-center transition-all duration-300 min-w-fit hover:text-cyemerald hover:text-xl ">
            <h1 className={pathname == `/lists` ? `text-cyemerald [text-shadow:_2px_2px_5px_#080]` : ``}>Lists</h1>
          </Link>
          {/* <Link href={`/`} className="flex items-center justify-center px-4 py-1 text-3xl text-center transition-all duration-300 min-w-fit hover:text-cyemerald hover:text-4xl">
            <h1 className={pathname == `/` ? `text-cyemerald [text-shadow:_2px_2px_5px_#080]` : ``}>
              <BiHome />
            </h1>
          </Link> */}
          <Link href={`/pick`} className="px-4 py-1 text-center transition-all duration-300 min-w-fit hover:text-cyemerald hover:text-xl">
            <h1 className={pathname == `/pick` ? `text-cyemerald [text-shadow:_2px_2px_5px_#080]` : ``}>Random <br className="block" />Pick</h1>
          </Link>

        </header>


        <ListsProvider>
          <main className="w-full text-white h-main max-h-main bg-main/5">
            <Component {...pageProps} />
          </main>
        </ListsProvider>

      </div>
    </>
  );
};

export default MyApp;
