import ComponentLoader from 'component-loader-js'
import Weeks from './components/Weeks/Weeks'

/*
* Load Components
*/
const componentLoader = new ComponentLoader({
  Weeks
})
componentLoader.scan()
