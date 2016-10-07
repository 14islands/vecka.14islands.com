import {Component} from 'component-loader-js';
import Hammer from 'hammerjs';

import debounce from '../../utils/debounce';

// publishing custom event to any registered listener
class Weeks extends Component {

    constructor() {
        super(...arguments);

        this.index = 0
        this.isPanning = false
        this.numberOfWeeks = this.el.dataset.weeksCount

        this.cardListElement = this.el.getElementsByClassName('Weeks-cards')[0]
        this.cardElements = this.el.getElementsByClassName('Weeks-card')

        this._setCardWidths()
        this._bindEvents()
    }

    _setCardWidths () {
      this.viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      this.viewPortWidthPx = `${this.viewPortWidth}px`
      this.cardsWidthPx = `${this.viewPortWidth*this.numberOfWeeks}px`

      this.cardListElement.style.width = this.cardsWidthPx
      for (let element of this.cardElements) {
        element.style.width = this.viewPortWidthPx
      }
    }

    _setCurrentPosition () {
      const x = (this.index * this.viewPortWidth * -1)
      this.cardListElement.style.transform = 'translate3d(' + x + 'px, 0, 0)';
    }

    _bindEvents () {
      this._onPanLeft = this._onPanLeft.bind(this)
      this._onPanRight = this._onPanRight.bind(this)
      this._onPanEnd = this._onPanEnd.bind(this)

      const mc = new Hammer(this.cardListElement);
      mc.on("panleft", this._onPanLeft);
      mc.on("panright", this._onPanRight);
      mc.on("panend", this._onPanEnd);

      window.onresize = debounce(this._onWindowResize.bind(this), 500)
    }

    /*
    * Events
    */

  	_onWindowResize () {
      this._setCardWidths()
      this._setCurrentPosition()
  	}

    _onPanLeft(ev) {
      if (!this.isPanning) {
        this.isPanning = true

        if ((this.index+1) < this.numberOfWeeks) {
          this.index += 1
          this._setCurrentPosition()
        }
      }
    }

    _onPanRight(ev) {
      if (!this.isPanning) {
        this.isPanning = true

        if (this.index > 0) {
          this.index -= 1
          this._setCurrentPosition()
        }
      }
    }

    _onPanEnd(ev) {
      this.isPanning = false
    }
}

export default Weeks
