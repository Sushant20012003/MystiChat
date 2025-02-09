/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    import("tailwind-scrollbar-hide").then((module) => module.default),
  ],
};
