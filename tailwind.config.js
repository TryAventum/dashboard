const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    content: ['./src/**/*.js', './public/index.html'],
    css: ['./src/**/*.css']
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      zIndex: {
        '-10': '-10'
      },
      colors: {
        'brand-red': '#ff002b',
        'brand-dark-red': '#cc0022'
      },
      flex: {
        inherit: 'inherit',
        2: '2 2 0%'
      }
    }
  },
  variants: {
    float: ['responsive', 'direction'],
    margin: ['responsive', 'direction'],
    padding: ['responsive', 'direction'],
    textAlign: ['responsive', 'direction'],
    transformOrigin: ['responsive', 'direction'],
    inset: ['responsive', 'direction'],
    borderWidth: ['responsive', 'direction'],
    borderRadius: ['responsive', 'direction'],
    justifyContent: ['responsive', 'direction'],
    translate: ['responsive', 'direction'],
  },
  plugins: [
    require('@tailwindcss/ui')({
      layout: 'sidebar'
    }),
    require('tailwindcss-dir')()
  ]
}
