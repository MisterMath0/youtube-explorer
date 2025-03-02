/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "hsl(var(--border) / <alpha-value>)",
          input: "hsl(var(--input) / <alpha-value>)",
          ring: "hsl(var(--ring) / <alpha-value>)",
          background: "hsl(var(--background) / <alpha-value>)",
          foreground: "hsl(var(--foreground) / <alpha-value>)",
          primary: {
            DEFAULT: "hsl(var(--primary) / <alpha-value>)",
            foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
            foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
            foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          },
          muted: {
            DEFAULT: "hsl(var(--muted) / <alpha-value>)",
            foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          },
          accent: {
            DEFAULT: "hsl(var(--accent) / <alpha-value>)",
            foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          },
          popover: {
            DEFAULT: "hsl(var(--popover) / <alpha-value>)",
            foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          },
          card: {
            DEFAULT: "hsl(var(--card) / <alpha-value>)",
            foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          },
          youtube: {
            DEFAULT: "#FF0000",
            dark: "#CC0000",
          },
          brand: {
            primary: {
              DEFAULT: "#4F46E5", // indigo-600
              hover: "#4338CA", // indigo-700
              light: "#818CF8", // indigo-400
            },
            secondary: {
              DEFAULT: "#8B5CF6", // purple-600
              hover: "#7C3AED", // purple-700
              light: "#A78BFA", // purple-400
            },
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        boxShadow: {
          card: '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
          "card-hover": '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          button: '0 2px 5px rgba(0, 0, 0, 0.1)',
          "button-hover": '0 4px 10px rgba(0, 0, 0, 0.15)',
        },
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
          "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          "gradient-primary": "linear-gradient(to right, var(--gradient-start), var(--gradient-end))",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          "pulse-subtle": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.85 },
          },
          spin: {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
          "scale-in": {
            "0%": { transform: "scale(0.95)", opacity: 0 },
            "100%": { transform: "scale(1)", opacity: 1 },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
          spin: "spin 1s linear infinite",
          "scale-in": "scale-in 0.2s ease-out",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  };
  