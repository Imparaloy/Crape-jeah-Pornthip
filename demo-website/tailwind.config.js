/** @type {import('tailwindcss').Config} */
export default {
content: [
	"./views/**/*.ejs",
	"./src/**/*.{js,ts}",
	"./public/**/*.{html,js}"
],
theme: {
extend: {
	colors: {
		verdantWhisper: "#4CAF50",   // Green
		sunblink: "#FFFBBD",         // Yellow
		amberFlame: "#FF9800",       // Orange
		chiliPulse: "#CA3C25",       // SomSom
		eclipseVoid: "#0A0A0A",      // Dark
		moonMilk: "#F5F5F5",         // GAY
		frostVeil: "#E0E0E0",        // Snow
		goldenRelic: "#D4AF37",      // เหลืองอี๋นลี่
		cloudLoom: "#FFF8F0",        // BG
		},
},
},
plugins: [],
}