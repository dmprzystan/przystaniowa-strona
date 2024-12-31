import Navbar from "./components/Navbar";
import StronaGlowna from "./components/StronaGlowna";

export default async function Admin() {
  return (
    <>
      <Navbar />
      <StronaGlowna />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";
