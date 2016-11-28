import ComponentLoader from 'component-loader-js'
import Weeks from './components/Weeks/Weeks'

/*
* Load Components
*/
const componentLoader = new ComponentLoader({
  Weeks
})
componentLoader.scan()

/*
* Register service worker
*/
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log('Service Worker register', reg)
  }).catch((err) => {
    console.log('Service Worker error', err)
  })
}
