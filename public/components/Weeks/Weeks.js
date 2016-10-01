import {Component} from 'component-loader-js';

import Hammer from 'hammerjs';

// publishing custom event to any registered listener
class Weeks extends Component {
    constructor() {
        super(...arguments);

        this.isPanning = false
        this.index = 0

        this._onPanLeft = this._onPanLeft.bind(this)
        this._onPanRight = this._onPanRight.bind(this)
        this._onPanEnd = this._onPanEnd.bind(this)

        const mc = new Hammer(this.el);
        mc.on("panleft", this._onPanLeft);
        mc.on("panright", this._onPanRight);
        mc.on("panend", this._onPanEnd);
    }

    _onPanLeft(ev) {
      if (!this.isPanning) {
        console.log('panning to the left')
        this.isPanning = true

        this.index += 1
        const x = this.index * -100
        this.el.style.transform = 'translateX(' + x + '%)';
      }
    }

    _onPanRight(ev) {
      if (!this.isPanning) {
        console.log('panning to the right')
        this.isPanning = true

        if (this.index > 0) {
          this.index -= 1
          const x = this.index * -100
          this.el.style.transform = 'translateX(' + x + '%)';
        }

      }
    }

    _onPanEnd(ev) {
      this.isPanning = false
    }
}

export default Weeks
