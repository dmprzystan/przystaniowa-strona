import Navbar from "./components/Navbar";

export default async function Admin() {
  return (
    <>
      <Navbar />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";
