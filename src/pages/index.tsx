import type { GetServerSideProps } from "next";
import { type NextPage } from "next";


// export const getServerSideProps: GetServerSideProps = async () => {
//   return {
//     redirect: {
//       destination: `/lists`,
//       permanent: false
//     }
//   }
// }

const Home: NextPage = () => {
  return (
    <>
      <div className="w-full h-full px-6 py-2">
        <section className="flex justify-center items-center">
          <h1 className="text-4xl font-serif">Pickadate</h1>
        </section>
        <section>

        </section>

      </div>
    </>
  );
};

export default Home;

