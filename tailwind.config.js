/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Figtree: 'Figtree',
        Merriwheather: 'Merriweather',
      },
      colors: {
        white: '#ffffff',
        black: '#1e2528',
        black2: '#263a41',
        primary: '#ff817e',
        primaryLight: '#fff9f8',
        grey8: '#888888',
        greyDark: '#999999',
        textColor: '#555555',
        textColor2: '#151515',
        lightPink100: '#ff8280cc',
      },
      backgroundColor: {
        white: '#ffffff',
        primary: '#ff817e',
        primaryLight: '#fff9f8',
        white50: '#ffffff80',
        grey1: '#f7f2e9',
        greyShade: '#f0f0f0',
        lightPink80: '#ff8280cc',
        lightPink10: '#ff82801a',
        lightPink20: '#f7f1eb',
        lightPink30: '#faece6',
        lightBlue1: '#edf5f4',
        lightBlue2: '#ecf7ee',
        lightBlue3: '#ebf4fA',
      },
      borderColor: {
        primaryLight: '#fff9f8',
        grey100: '#e3e6ea',
      },
      keyframes: {
        slider: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        rotate: {
          '0%': { transform: 'rotate(-5deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(10deg)' },
          '100%': { transform: 'rotate(-5deg)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'slide': 'slider 50s linear infinite',
        'rotate': 'rotate 10s linear infinite',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      boxShadow: {
        shadow1: 'rgb(240, 240, 240) 0px 5px 20px',
        shadow2: 'rgba(0, 0, 0, 0.05) 0 10px 40px'
      },
      backgroundImage: {
        gradient: 'linear-gradient(100deg,  #ff817e 24.20%, #f79c68 78%)'
      }
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        body: {
          padding: "0",
          margin: "0",
          fontFamily: 'Figtree',
        },
        html: {
          padding: "0",
          margin: "0",
        },
        '*': {
          boxSizing: "border-box",
        },
        li: {
          listStyle: "none",
          margin: "0",
          padding: "0",
        },
        ul: {
          listStyle: "none",
          margin: "0",
          padding: "0",
        },
        a: {
          display: "inline-block",
          textDecoration: "none",
          transition: ".5s",
          '&:hover': {
            textDecoration: "none",
          },
        },
        p: {
          margin: "0",
          padding: "0",
        },
        img: {
          maxWidth: "100%",
          display: "inline-block",
        },
        h1: {
          margin: "0",
          padding: "0",
        },
        h2: {
          margin: "0",
          padding: "0",
        },
        h3: {
          margin: "0",
          padding: "0",
        },
        h4: {
          margin: "0",
          padding: "0",
        },
        h5: {
          margin: "0",
          padding: "0",
        },
        h6: {
          margin: "0",
          padding: "0",
        },
        '.container': {
          maxWidth: '1320px !important',
          margin: '0 auto',
          padding: '0 15px !important',
          "@media (max-width: 1200px)": {
            maxWidth: '100% !important',
          },
        },
        '.container-fluid': {
          width: '100%',
          padding: '0 16px',
        },
        '.line-number': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden'
        }
      });
    },
  ],
}