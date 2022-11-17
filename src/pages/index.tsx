import type { GetServerSideProps } from "next";
import { type NextPage } from "next";


export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: `/lists`,
      permanent: false
    }
  }
}

const Home: NextPage = () => {
  return (
    <>
      <div className="w-full h-full">
        <h1 className="flex items-center justify-center w-full h-full text-2xl font-sub">You&apos;re not supposed to be here!</h1>
      </div>
    </>
  );
};

export default Home;

