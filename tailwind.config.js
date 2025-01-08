/** @type {import('tailwindcss').Config} */
import themer from "tailwindcss-themer";

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    themer({
      defaultTheme: {
        extend: {
          colors: {
            primary: "#fea713",
            primaryContrast: "#718bb8",
            secondary: "#e8441d",
            accent: "#e8441d",
            light: "#fffeff",
            lightMild: "#e7e5e4",
            lightMedium: "#a8a29e",
            medium: "#78716c",
            darkMedium: "#44403c",
            darkMild: "#292524",
            dark: "#051110",
          },
        },
      },
      themes: [
        {
          name: "darkTheme",
          selectors: [".dark-mode"],
          extend: {
            colors: {
              primary: "#fff06b",
              primaryContrast: "#4A4A4A",
              secondary: "#ccfcfc",
              accent: "#ea6394",
              light: "#171717",
              lightMild: "#232323",
              lightMedium: "#2E2E2E",
              medium: "#4A4A4A",
              darkMedium: "#828282",
              darkMild: "#B9B9B9",
              dark: "#D5D5D5",
            },
          },
        },
      ],
    }),
  ],
};
