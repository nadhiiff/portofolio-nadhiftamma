/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backdropBlur: {
				sm: '4px',
			  },
			colors: {
				charcoal: '#111111',
				surface: '#1A1A1A',
				maroon: '#5C1A24',
				cream: '#F4F4F0',
				muted: '#A3A3A3',
			},
			fontFamily: {
				heading: ['"Playfair Display"', 'serif'],
				body: ['"Inter"', 'sans-serif'],
				accent: ['"Great Vibes"', 'cursive'],
			},
		  },
		},
	plugins: [],
}
