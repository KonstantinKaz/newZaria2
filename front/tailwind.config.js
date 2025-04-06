/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: '#6C0206',
        'stars-color': "#5E3939",
		'pink-bg': "#BB2524",
		'selection-color': "rgba(249, 168, 174, .6)",
		'gradient-border': "linear-gradient(90deg, #6C0206 14.09%, #FFFFFF 22.65%, #FFFFFF 78.53%, #6C0206 87.88%)",
		'gray-input': "#939393",
      },
	  backgroundImage: {
		'bird': "url('/images/cursors/default_cursor.svg')",
		'pointer': "url('/images/cursors/pointer_cursor.svg')"
	  },
      fontSize: {
				xs: '0.82rem',
				sm: '14px',
				base: '27px',
				lg: '1.22rem',
				xl: '1.36rem',
				h1: '100px',
				'1.5xl': '1.5rem',
				'2xl': '1.725rem',
				'3xl': '2.155rem',
				'4xl': '2.58rem',
				'5xl': '3.45rem',
				'6xl': '4.3rem',
				'7xl': '5.17rem',
				'8xl': '6.9rem',
				'9xl': '9.2rem'
			},
    },
  },
  plugins: [],
}
