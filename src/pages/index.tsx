import type { GetServerSideProps, NextPage } from "next";


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
      <div className="w-full h-full px-6 py-2">
        <section className="flex items-center justify-center">
          <h1 className="font-serif text-4xl">WhoIsNext</h1>
        </section>
        <section>

        </section>

      </div>
    </>
  );
};

export default Home;

