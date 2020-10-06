import currentLocale from './date-fns'
import { registerLocale, setDefaultLocale } from 'react-datepicker'

/**
 * We set the current local as default local for all the react-datepicker instances
 */
if (currentLocale) {
  registerLocale(currentLocale.name, currentLocale.locale)
  setDefaultLocale(currentLocale.name)
}
