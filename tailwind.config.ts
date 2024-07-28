import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "o-nas": "url('/images/bg-o-nas.svg')",
        plan: "url('/images/bg-plan.svg')",
      },
      backgroundSize: {
        full: "101% 100%",
      },
      colors: {
        dimmedBlue: {
          DEFAULT: "#4F5D75",
        },
      },
      boxShadow: {
        arround: "0px 2px 8px 0px rgba(0, 0, 0, 0.25);",
        top: "0px -4px 6px 0px rgba(0, 0, 0, 0.125);",
        bottom: "0px 4px 6px 0px rgba(0, 0, 0, 0.125);",
        bottomShadow: "inset 0px -35px 25px -35px #F2F2F2;",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  variants: {
    extend: {
      display: ["last"],
    },
  },
};

export default config;
