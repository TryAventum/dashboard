import { arSA } from 'date-fns/esm/locale'

let currentLocale = null
if (window.aventum.i18n.language === 'ar') {
  currentLocale = { name: 'ar', locale: arSA }
}

export default currentLocale
