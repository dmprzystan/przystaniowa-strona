import Link from "next/link";
import Markdown from "react-markdown";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Page() {
  const steps = [
    "Każdy uczestnik jest zobowiązany do przynoszenia własnego egzemplarza Pisma Świętego. Dobrze, żeby to była Twoja Biblia, a nie tylko książka zdjęta z półki w domu, a potem tam odłożona – ponieważ będziemy czytać Słowo Boga i odnosić do swojego życia osobiście.",
    "Wszystkie spotkania będą odbywały się w pomieszczeniach duszpasterstwa Przystań – gdyby miało być inaczej, to pojawi się odpowiednia informacja.",
    "Przejście przez to przygotowanie zakłada uczestnictwo w zajęciach, dlatego w ciągu roku możliwe są 4 nieobecności. Oczywiście zrozumiałe są wypadki losowe i zawsze można się dogadać, ale tylko w poważnych przypadkach.",
    "W Wielkim Poście i Adwencie odbędą się rekolekcje dla całego duszpasterstwa Przystań i będą one traktowane jako element przygotowania do bierzmowania, ale nie będzie tam sprawdzana obecność.",
    `Zajęcia rozpoczną się od października i będą trwały do Wielkanocy. Godziny spotkań do wyboru:
- Poniedziałek godz. 17.00 i 19.15
- Czwartek godz. 17.00`,
    "Na pierwszym roku będą tym razem trzy grupy. Jedna grupa będzie liczyła max. 15 os. Jeśli dana grupa liczbę osiągnie, zapisy się zakończą. Nie będzie możliwości zmiany grupy.",
    `Potrzebne dokumenty, które należy dostarczyć w październiku:
- Odpis aktu chrztu
- Zaświadczenie o uczestnictwie w katechezie ze szkoły, do której się aktualnie uczęszcza
- Zgoda własnego proboszcza na przygotowanie i przyjęcie sakramentu bierzmowania poza własną parafią.`,
    "Jeśli nie widzisz żadnych przeszkód i wszystko Ci odpowiada, to możesz zapisać się przez poniższy formularz!",
  ];

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8">
        <main className="pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4 bg-dimmedBlue pb-8 rounded-t-2xl">
          <h2 className="text-white text-3xl sm:text-4xl xl:text-5xl uppercase text-center">
            bierzmowanie
          </h2>
          <div className="flex flex-col gap-2 mt-4 sm:mt-6 md:mt-8 px-4 sm:px-12 md:px-14 lg:px-16 text-white text-base md:text-lg lg:text-xl xl:text-2xl text-pretty">
            <p>Zapisy do bierzmowania na pierwszy rok – 2024/25</p>
            <p className="leading-snug md:leading-normal ">
              Przygotowanie do bierzmowania przy naszym duszpasterstwie jest
              otwarte dla wszytskich licealistów. Najważniejszy wymóg stawiany
              każdemu kandydatowi to osobiste zaangażowanie. Kurs jest dwuletni,
              a spotkania odbywają się raz w tygodniu i trwają 1,5 h.
            </p>
            <p>Ważne, by była to decyzja kandydata.</p>
          </div>
          <div className="mt-4 sm:mt-6 lg:mt-8 xl:mt-10 px-4 sm:px-12 md:px-14 lg:px-24 xl:px-52">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-row gap-2 md:gap-4 lg:gap-6 xl:gap-8 text-white text-base text-pretty"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-full aspect-square flex-shrink-0 px-3 sm:px-4 flex justify-center items-center">
                    <p className="text-black text-xl sm:text-2xl md:text-3xl">
                      {index + 1}
                    </p>
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="bg-white h-full w-1" />
                  )}
                </div>
                <div className="mb-4 md:mb-6 lg:mb-8 xl:mb-12 md:text-lg lg:text-xl xl:text-2xl *:leading-normal">
                  <Markdown className="[&_ul]:list-disc [&_ul]:pl-6">
                    {step}
                  </Markdown>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch w-fit mx-auto gap-6 mt-6 md:text-lg lg:text-2xl xl:text-3xl uppercase">
            <Link
              href=""
              className="block bg-[#D9D9D9] px-8 lg:px-10 py-3 lg:py-4 rounded-xl shadow-lg text-center"
            >
              Zapisz się na I rok
            </Link>
            <Link
              href=""
              className="block bg-[#D9D9D9] px-8 lg:px-10 py-3 lg:py-4 rounded-xl shadow-lg text-center"
            >
              Zapisz się na II rok
            </Link>
          </div>
        </main>
        <img
          src="/images/bg-contact-bottom.svg"
          alt=""
          className="w-full -mt-px"
        />
      </div>
    </>
  );
}
