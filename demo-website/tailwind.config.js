/** @type {import('tailwindcss').Config} */
export default {
content: [
	"./public/**/*.{html,js}",
	"./src/**/*.{js,ts}",
	"./views/**/*.ejs"
],
theme: {
extend: {
	fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
	},
	colors: {
		tomato: "#CA3C25"
    },
},
plugins: [],
}