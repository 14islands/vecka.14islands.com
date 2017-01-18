import ComponentLoader from 'component-loader-js'
import Weeks from './components/Weeks/Weeks'
import Offline from './components/Offline/Offline'

/*
* Load Components
*/
const componentLoader = new ComponentLoader({
  Weeks,
  Offline
})
componentLoader.scan()
