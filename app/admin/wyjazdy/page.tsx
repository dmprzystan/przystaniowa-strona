import Navbar from "../components/Navbar";
import Wyjazdy from "./components/Wyjazdy";

export default async function Page() {
  return (
    <>
      <Navbar />
      <Wyjazdy />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";
