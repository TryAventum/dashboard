import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
})

const token = localStorage.getItem('x-access-token')
const lng = localStorage.getItem('i18nextLng')
instance.defaults.headers.common['x-access-token'] = token || ''
instance.defaults.headers.common['accept-language'] = lng || ''

export default instance
