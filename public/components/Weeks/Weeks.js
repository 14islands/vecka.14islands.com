import {Component} from 'component-loader-js'

import debounce from '../../utils/debounce'
import animateScrollX from '../../utils/animate-scroll-x'

// publishing custom event to any registered listener
class Weeks extends Component {

    constructor () {
      super(...arguments)

      // data
      this.numberOfWeeks = this.el.dataset.weeksCount

      // local vars
      this._updateFrame = null
      this._scrollEndTimer = null
      this._hasStartedTouch = false
      this._isBusyUpdating = false
      this._animation = { isRunning: false }
      this._scrollItemWidth = 60
      this._sidePadding = 30
      this._weekIndex = 0

      // elements
      this.scrollerWrapperElement = this.el.getElementsByClassName('Weeks-scrollerWrapper')[0]
      this.scrollerElement = this.el.getElementsByClassName('Weeks-scroller')[0]
      this.scrollerListElement = this.el.getElementsByClassName('Weeks-scrollerList')[0]
      this.cardElements = this.el.getElementsByClassName('Weeks-cardWrapper')

      // init scroll
      const listWidth = (this._scrollItemWidth * this.numberOfWeeks) // + this._sidePadding
      this.scrollerListElement.style.width = `${listWidth}px`
      this.scrollerElement.scrollLeft = 0
      this.scrollerWrapperElement.classList.add('isVisible')

      this._bindEvents()
    }

    _bindEvents () {
      this.onScroll = this.onScroll.bind(this)
      this.onScrollEnd = this.onScrollEnd.bind(this)
      this.scrollerElement.addEventListener('scroll', this.onScroll)
      this.scrollerElement.addEventListener("touchstart", () => {
        console.log('touch start')
        this._hasStartedTouch = true
      }, false);
      this.scrollerElement.addEventListener("touchend", () => {
        this._hasStartedTouch = false
        this.respondToScrollEnd()
      }, false);

      window.onresize = debounce(this._onWindowResize.bind(this), 500)
    }
    // Window scroll event listener
    onScroll (e) {
      e.stopPropagation()
      this.requestScrollUpdate(e.target)
      this.respondToScrollEnd()
    }

    respondToScrollEnd () {
      clearTimeout(this._scrollEndTimer)
      this._scrollEndTimer = setTimeout(this.onScrollEnd, 200)
    }

    onScrollEnd () {
      if (!this._hasStartedTouch) {
        const scrollX = this.scrollerElement.scrollLeft
        const newWeekIndex = this.calcWeekIndex(scrollX)
        const destination = newWeekIndex * this._scrollItemWidth
        animateScrollX(this.scrollerElement, scrollX, destination, 300, 'easeOutQuad')
      }
    }

    calcWeekIndex (scrollX) {
      const newWeekIndex = Math.round((scrollX / this._scrollItemWidth))
      return Math.min(newWeekIndex, (this.numberOfWeeks - 1))
    }

    // Updates the selected sample based on scroll position
    requestScrollUpdate (target) {
      // only update if not already busy and no animation is running
      if (!this._isBusyUpdating && !this._animation.isRunning) {
        this._isBusyUpdating = true
        // update in separate thread to not slow down scrolling
        this._updateFrame = window.requestAnimationFrame(this.updateSelectedSampleFromScroll.bind(this, target.scrollLeft))
      }
    }

    // Figures out which sample should be selected based on current scroll
    //  and triggers callback with new index
    updateSelectedSampleFromScroll (scrollX) {
      const newWeekIndex = this.calcWeekIndex(scrollX)
      if (newWeekIndex !== this._weekIndex && this.isValidWeek(newWeekIndex)) {
        this.cardElements[this._weekIndex].classList.remove('isSelected')
        this._weekIndex = newWeekIndex
        this.cardElements[this._weekIndex].classList.add('isSelected')
      }
      this._isBusyUpdating = false
    }

    isValidWeek (index) {
      return (index > -1 && index < this.numberOfWeeks)
    }

    /*
    * Events
    */

    _onWindowResize () {
      // this._setCardWidths()
      // this._setCurrentPosition()
    }

    /*
    * Destroy
    */
    destroy () {
      this.scrollerElement.removeEventListener('scroll', this.onScroll)
      window.cancelAnimationFrame(this._updateFrame)
      window.cancelAnimationFrame(this._animation.frame)
    }
}

export default Weeks
