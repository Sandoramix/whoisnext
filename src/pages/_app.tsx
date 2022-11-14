import { type AppType } from "next/dist/shared/lib/utils";

import Link from 'next/link';
import { useRouter } from "next/router";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  return (
    <div className="w-screen h-screen bg-black text-white font-main text-base relative">
      <header className="overflow-hidden bg-[#000718]/50 w-full px-10 py-6 max-h-[90px] min-h-[90px] grid-flow-col grid auto-cols-fr items-center  text-center font-normal border-b border-cyan-800/20">

        <Link href={`/lists`} className="px-4 py-1 min-w-fit hover:text-[#05c8cf] hover:text-xl transition-all duration-300 text-center">
          <h1 className={pathname == `/lists` ? `text-[#0fffbf] font-medium` : ``}>Lists</h1>
        </Link>
        <Link href={`/`} className="px-4 py-1 min-w-fit hover:text-[#05c8cf] hover:text-xl transition-all duration-300 text-center">
          <h1 className={pathname == `/` ? `text-[#0fffbf] font-medium` : ``}>Random <br className="block" />Pick</h1>
        </Link>
        <Link href={`/calendar`} className="px-4 py-1 min-w-fit hover:text-[#05c8cf] hover:text-xl transition-all duration-300 text-center">
          <h1 className={pathname == `calendar` ? `text-[#0fffbf] font-medium` : ``}>Generate <br className="block" />Calendar</h1>
        </Link>

      </header>

      <main className="max-h-[calc(100vh_-_90px)] h-[calc(100vh_-_90px)] w-full ">
        <Component {...pageProps} />
      </main>
    </div>
  );
};

export default MyApp;
