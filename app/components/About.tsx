import React from "react";

function About() {
  return (
    <div className="mt-8 sm:mt-4">
      <div className="bg-white py-6 lg:pt-10 lg:pb-0 xl:pt-12 2xl:pt-14 px-8 sm:px-12 lg:px-16 2xl:px-24 rounded-t-2xl shadow-top">
        <h2 className="text-3xl sm:text-4xl xl:text-5xl uppercase text-center md:text-left">
          kim jesteśmy?
        </h2>
        <div className="flex flex-col md:flex-row mt-8 md:mt-6 xl:mt-7 gap-8 md:gap-10 xl:gap-28 2xl:gap-40 text-base sm:text-lg lg:text-xl">
          <p className="flex-1">
            Duszpasterstwo Przystań to wspólnota młodzieży licealnej przy
            klasztorze Dominikanów w Krakowie. Życie naszego duszpasterstwa to
            przede wszystkim wspólna modlitwa – niedzielna Eucharystia oraz
            spotkania formacyjne. W Przystani codzienność przepełniona jest
            obecnością Boga i każdy ma szansę odnaleźć swoją drogę do Niego.
          </p>
          <div className="flex flex-col items-center gap-8 md:gap-6 flex-1">
            <p>
              Nie jesteśmy zamkniętą grupą i można do nas dołączyć w każdym
              momencie bez żadnych formalnych zapisów i list obecności.
              Wystarczy do nas przyjść, żeby razem poszukiwać Boga w swojej
              codzienności ucząc się tego od św. Dominika, którego charyzmatem
              staramy się żyć.
            </p>
            <div className="flex flex-col items-center gap-2 sm:gap-3 z-10 relative">
              <p className="text-center text-sm sm:text-base lg:text-lg opacity-75">
                Jesteś niepełnoletni? Pamiętaj o wypełnieniu zgody poniżej!
              </p>
              <button className="rounded-full bg-slate-600 text-white uppercase px-8 py-2 shadow-lg">
                zgoda
              </button>
            </div>
          </div>
        </div>
      </div>
      <img
        className="-mt-px relative w-full"
        src="/images/bg-about.svg"
        alt=""
      />
    </div>
  );
}

export default About;
