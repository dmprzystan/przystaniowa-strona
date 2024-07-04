import Image from "next/image";
import ContactForm from "./ContactForm";

function Contact() {
  return (
    <div className="relative">
      <img
        src="/images/bg-contact-top.svg"
        alt=""
        className="w-full absolute -translate-y-full mt-1"
      />
      <div className="py-6 bg-dimmedBlue pb-10 md:pt-16">
        <div className="container mx-auto flex-col items-center">
          <div className="px-8">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl uppercase text-center text-white">
              kontakt
            </h2>
            <div className="w-full flex flex-col mt-8 md:flex-row md:gap-4 ">
              <img
                src="/images/kontakt.png"
                alt=""
                className="w-full md:w-1 h-full flex-1 block flex-shrink object-contain"
              />
              <div className="w-full mt-2 flex-1">
                <img
                  src="/images/kontakt-arrow.png"
                  className="hidden md:block w-2/3"
                  alt=""
                />
                <div className="mx-auto w-fit">
                  <h3 className="font-bold text-2xl sm:text-3xl xl:text-4xl text-white text-center">
                    Ojciec Bartłomiej Sumara OP
                  </h3>
                  <p className="mx-auto w-fit text-lg sm:text-xl xl:text-2xl text-white">
                    Stolarska 12, 31-043 Kraków
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 lg:mt-14 xl:mt-20 flex flex-col items-stretch sm:container">
            <h3 className="px-8 uppercase text-[#D9D9D9] text-xl text-center lg:text-2xl xl:text-3xl">
              aby skontaktować się użyj poniższy formularz
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
      <img
        src="/images/bg-contact-bottom.svg"
        alt=""
        className="w-full -mt-px"
      />
    </div>
  );
}

export default Contact;
