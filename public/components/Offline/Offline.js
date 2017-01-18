import {Component} from 'component-loader-js'

const OFFLINE_CLASS = 'isOffline'

// publishing custom event to any registered listener
class Offline extends Component {

    constructor () {
      super(...arguments)

      // bind methods
      this.onOnlineStatus = this.onOnlineStatus.bind(this)
      this.onOfflineStatus = this.onOfflineStatus.bind(this)

      this._bindEvents()

      console.log('navigator.onLine', navigator.onLine)
      if (navigator.onLine !== undefined && !navigator.onLine) {
        this.el.classList.add(OFFLINE_CLASS)
      }
    }

    _bindEvents () {
      window.addEventListener('online', this.onOnlineStatus)
      window.addEventListener('offline', this.onOfflineStatus)
    }

    onOnlineStatus () {
      this.el.classList.remove(OFFLINE_CLASS)
      console.log('IS ONLINE')
    }

    onOfflineStatus () {
      this.el.classList.add(OFFLINE_CLASS)
      console.log('IS OFFLINE')
    }

    destroy () {
      window.addEventListener('online', this.updateOnlineStatus)
      window.addEventListener('offline', this.updateOnlineStatus)
    }
}

export default Offline
