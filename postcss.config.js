const tailwindcss = require('tailwindcss')
const cssnano = require('cssnano')

module.exports = {
  plugins: [
    tailwindcss('./tailwind.config.js'),
    require('autoprefixer'),
    cssnano({
      preset: 'default'
    })
  ]
}
