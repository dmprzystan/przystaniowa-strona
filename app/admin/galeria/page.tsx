import Navbar from "../components/Navbar";
import Galeria from "./components/Galeria";

export default async function Plan() {
  return (
    <>
      <Navbar />
      <Galeria />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";
