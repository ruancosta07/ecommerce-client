import typography from "@tailwindcss/typography"
import type {Config} from "tailwindcss"
module.exports = {
  darkMode: ["selector"],
  content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
  		fontFamily: {
  			space: [
  				'Bricolage Grotesque',
  				'sans-serif'
  			],
  			inter: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [typography, require("tailwindcss-animate")],
} as Config

