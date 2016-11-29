(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * ComponentLoader Class
 *
 * Instantiates JavaScript Classes when their name is found in the DOM using attribute data-component=""
 *
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentLoader = (function () {

	/**
  * Constructor for the ComponentLoader
  * @class
  * @public
  * @param {Object} components - Optional collection of available components: {componentName: classDefinition}
  * @param {Node} context - Optional DOM node to search for components. Defaults to document.
  */

	function ComponentLoader() {
		var components = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

		_classCallCheck(this, ComponentLoader);

		this.contextEl = context;
		this.initializedComponents = {};
		this.numberOfInitializedComponents = 0;
		this.components = {};
		this.topics = {};
		this.register(components);
	}

	/**
  * Add component(s) to collection of available components
  * @public
  * @param {Object} components - Collection of components: {componentName: classDefinition}
  */

	_createClass(ComponentLoader, [{
		key: "register",
		value: function register() {
			var _this = this;

			var components = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			Object.keys(components).forEach(function (componentName) {
				_this.components[componentName] = components[componentName];
			});
		}

		/**
   * Remove component from collection of available components
   * @public
   * @param {String} componentName - Name of the component to remove
   */
	}, {
		key: "unregister",
		value: function unregister(componentName) {
			delete this.components[componentName];
		}

		/**
   * Mediator functionality.
   * Stores the topic and callback given by the component.
   * for further reference.
   * @param  {String} topic      Topic string
   * @param  {Function} callback Callback function that would be triggered.
   * @param  {Function} context  Class instance which owns the callback
   */
	}, {
		key: "subscribe",
		value: function subscribe(topic, callback, context) {

			// Is this a new topic?
			if (!this.topics.hasOwnProperty(topic)) {
				this.topics[topic] = [];
			}

			// Store the subscriber callback
			this.topics[topic].push({ context: context, callback: callback });
		}

		/**
   * Mediator functionality.
   * Removes the stored topic and callback given by the component.
   * @param  {String}   topic    Topic string
   * @param  {Function} callback Callback function that would be triggered.
   * @param  {Function} context  Class instance which owns the callback
   * @return {Boolean}           True on success, False otherwise.
   */
	}, {
		key: "unsubscribe",
		value: function unsubscribe(topic, callback, context) {
			// Do we have this topic?
			if (!this.topics.hasOwnProperty(topic)) {
				return false;
			}

			// Find out where this is and remove it
			for (var i = 0, len = this.topics[topic].length; i < len; i++) {
				if (this.topics[topic][i].callback === callback) {
					if (!context || this.topics[topic][i].context === context) {
						this.topics[topic].splice(i, 1);
						return true;
					}
				}
			}

			return false;
		}

		/**
   * [publish description]
   * @param  {[type]} topic [description]
   * @return {[type]}       [description]
   */
	}, {
		key: "publish",
		value: function publish(topic) {
			// Check if we have subcribers to this topic
			if (!this.topics.hasOwnProperty(topic)) {
				return false;
			}

			// don't slice on arguments because it prevents optimizations in JavaScript engines (V8 for example)
			// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
			// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
			var args = new Array(arguments.length - 1);
			for (var i = 0; i < args.length; ++i) {
				args[i] = arguments[i + 1]; // remove first argument
			}

			// Loop through them and fire the callbacks
			for (var _i = 0, len = this.topics[topic].length; _i < len; _i++) {
				var subscription = this.topics[topic][_i];
				// Call it's callback
				if (subscription && subscription.callback) {
					subscription.callback.apply(subscription.context, args);
				}
			}

			return true;
		}

		/**
   * Scan the DOM, initialize new components and destroy removed components.
   * @public
   * @param {Object} data - Optional data object to pass to the component constructor
   */
	}, {
		key: "scan",
		value: function scan() {
			var _this2 = this;

			var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var activeComponents = {},
			    elements = this.contextEl.querySelectorAll("[data-component]");

			[].forEach.call(elements, function (el) {
				_this2._scanElement(el, activeComponents, data);
			});

			if (this.numberOfInitializedComponents > 0) this.cleanUp_(activeComponents);
		}

		/**
   * Find all components registered on a specific DOM element and initialize them if new
   * @private
   * @param {Element} el - DOM element to scan for components
   * @param {Object} activeComponents - All componentIds currently found in the DOM
   * @param {Object} data - Optional data object to pass to the component constructor
   */
	}, {
		key: "_scanElement",
		value: function _scanElement(el, activeComponents, data) {
			var _this3 = this;

			// check of component(s) for this DOM element already have been initialized
			var elementId = el.getAttribute("data-component-id");

			if (!elementId) {
				// give unique id so we can track it on next scan
				elementId = this._generateUUID();
				el.setAttribute('data-component-id', elementId);
			}

			// find the name of the component instance
			var componentList = el.getAttribute("data-component").match(/\S+/g);
			componentList.forEach(function (componentName) {

				var componentId = componentName + "-" + elementId;
				activeComponents[componentId] = true;

				// check if component not initialized before
				if (!_this3.initializedComponents[componentId]) {
					_this3._initializeComponent(componentName, componentId, el, data);
				}
			});
		}

		/**
   * Call constructor of component and add instance to the collection of initialized components
   * @private
   * @param {String} componentName - Name of the component to initialize. Used to lookup class definition in components collection.
   * @param {String} componentId - Unique component ID (combination of component name and element ID)
   * @param {Element} el - DOM element that is the context of this component
   * @param {Object} data - Optional data object to pass to the component constructor
   */
	}, {
		key: "_initializeComponent",
		value: function _initializeComponent(componentName, componentId, el, data) {
			var component = this.components[componentName];

			if (typeof component !== 'function') throw "ComponentLoader: unknown component '" + componentName + "'";

			var instance = new component(el, data, this);

			this.initializedComponents[componentId] = instance;
			this.numberOfInitializedComponents++;
		}

		/**
   * Call destroy() on a component instance and remove it from the collection of initialized components
   * @private
   * @param {String} componentId - Unique component ID used to find component instance
   */
	}, {
		key: "_destroyComponent",
		value: function _destroyComponent(componentId) {
			var instance = this.initializedComponents[componentId];
			if (instance && typeof instance.destroy === 'function') instance.destroy();

			// safe to delete while object keys while loopinghttp://stackoverflow.com/questions/3463048/is-it-safe-to-delete-an-object-property-while-iterating-over-them
			delete this.initializedComponents[componentId];
			this.numberOfInitializedComponents--;
		}

		/**
   * Destroy inaitialized components that no longer are active
   * @private
   * @param {Object} activeComponents - All componentIds currently found in the DOM
   */
	}, {
		key: "cleanUp_",
		value: function cleanUp_() {
			var _this4 = this;

			var activeComponents = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			Object.keys(this.initializedComponents).forEach(function (componentId) {
				if (!activeComponents[componentId]) {
					_this4._destroyComponent(componentId);
				}
			});
		}

		/**
   * Generates a rfc4122 version 4 compliant unique ID
   * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   * @private
   */
	}, {
		key: "_generateUUID",
		value: function _generateUUID() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
				    v = c == 'x' ? r : r & 0x3 | 0x8;
				return v.toString(16);
			});
		}
	}]);

	return ComponentLoader;
})();

exports["default"] = ComponentLoader;
module.exports = exports["default"];
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

/**
 * Component Base Class
 * 
 * Sets all arguments passed in to constructor from ComponentLoader
 *
 * Exposes pub/sub methods for triggering events to other components
 *
 */

var Component = (function () {
	_createClass(Component, [{
		key: 'defaultData',

		/**
   * Return optional default values for DOM data attributes
   * 
   * @protected
   */
		value: function defaultData() {
			return {
				// camelCased list of data attribute keys and default values
				// myParam: 'myDefaultValue' <- data-my-param="myOverrideValue"
			};
		}

		/**
   * Constructor for the Component
   *
   * Call `super(...arguments);` in the base class constructor
   *
   * @public
   * @param {Node} context - DOM node that contains the component markup
   * @param {Object} data - Optional data object from ComponentLoader.scan()
   * @param {Object} mediator - instance of ComponentLoader for pub/sub
   */
	}]);

	function Component() {
		_classCallCheck(this, Component);

		this.el = arguments[0];
		if (typeof jQuery !== 'undefined') this.$el = jQuery(this.el);
		this.data = arguments[1];
		this.__mediator = arguments[2];

		this._configureData();
	}

	/**
  * Parses the DOM for all data attributes, converts them to camelCase,
  * and applies defaults before storing them in `this.data`
  * 
  * Order of importance of data is as follows:
  * 1. Data passed to constructor using ComponentLoader.scan({})
  * 2. DOM data attributes
  * 3. defaulData() 
     *
  * I.e:
  *  - defaultData() will always be applied if 1) or 2) does not overide the key
  *  - Any data passed to `scan()` will win over DOM attributes or defaultData with same key
  * 
  * @private
  */

	_createClass(Component, [{
		key: '_configureData',
		value: function _configureData() {
			var DOMData = {};
			[].forEach.call(this.el.attributes, function (attr) {
				if (/^data-/.test(attr.name)) {
					var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
						return $1.toUpperCase();
					});
					DOMData[camelCaseName] = attr.value;
				}
			});
			// extend defaults
			this.data = (0, _objectAssign2['default'])(this.defaultData ? this.defaultData() : {}, DOMData, this.data);
		}

		/**
   * Shorthand for binding multiple functions to `this` in one go
   * @param {...String} functionName Variable number of function names to bind to this context.
   * @protected
   */
	}, {
		key: 'bind',
		value: function bind() {
			for (var i = 0; i < arguments.length; i++) {
				var funcName = arguments[i];
				this[funcName] = this[funcName].bind(this);
			}
		}

		/**
   * Publish an event for other components
   * @protected
   * @param {String} topic - Event name
   * @param {Object} data - Optional params to pass with the event
   */
	}, {
		key: 'publish',
		value: function publish() {
			var _mediator;

			(_mediator = this.__mediator).publish.apply(_mediator, arguments);
		}

		/**
   * Subscribe to an event from another component
   * @protected
   * @param {String} topic - Event name
   * @param {Function} callback - Function to bind
   */
	}, {
		key: 'subscribe',
		value: function subscribe(topic, callback) {
			this.__mediator.subscribe(topic, callback, this);
		}

		/**
   * Unsubscribe from an event from another component
   * @protected
   * @param {String} topic - Event name
   * @param {Function} callback - Function to unbind
   */
	}, {
		key: 'unsubscribe',
		value: function unsubscribe(topic, callback) {
			this.__mediator.unsubscribe(topic, callback, this);
		}

		/**
   * Utility method for triggering the ComponentLoader to scan the markup for new components
   * @protected
   * @param {Object} data - Optional data to pass to the constructor of any Component initialized by this scan
   */
	}, {
		key: 'scan',
		value: function scan(data) {
			this.__mediator.scan(data);
		}

		/**
   * Utility method for defering a function call
   * @protected
   * @param {Function} callback - Function to call
   * @param {Number} ms - Optional ms to delay, defaults to 17ms (just over 1 frame at 60fps)
   */
	}, {
		key: 'defer',
		value: function defer(callback) {
			var ms = arguments.length <= 1 || arguments[1] === undefined ? 17 : arguments[1];

			setTimeout(callback, ms);
		}

		/**
   * Called by ComponentLoader when component is no longer found in the markup
   * usually happens as a result of replacing the markup using AJAX
   *	
   * Override in subclass and make sure to clean up event handlers etc
   *
   * @protected
   */
	}, {
		key: 'destroy',
		value: function destroy() {}
	}]);

	return Component;
})();

exports['default'] = Component;
module.exports = exports['default'];
},{"object-assign":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentLoaderJs = require('./component-loader.js');

var _componentLoaderJs2 = _interopRequireDefault(_componentLoaderJs);

var _componentJs = require('./component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

exports.Component = _componentJs2['default'];
exports['default'] = _componentLoaderJs2['default'];
},{"./component-loader.js":1,"./component.js":2}],4:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _componentLoaderJs = require('component-loader-js');

var _debounce = require('../../utils/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _animateScrollX = require('../../utils/animate-scroll-x');

var _animateScrollX2 = _interopRequireDefault(_animateScrollX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// publishing custom event to any registered listener
var Weeks = function (_Component) {
  _inherits(Weeks, _Component);

  function Weeks() {
    _classCallCheck(this, Weeks);

    // data
    var _this = _possibleConstructorReturn(this, _Component.apply(this, arguments));

    _this.numberOfWeeks = _this.el.dataset.weeksCount;

    // local vars
    _this._updateFrame = null;
    _this._scrollEndTimer = null;
    _this._hasStartedTouch = false;
    _this._isBusyUpdating = false;
    _this._animation = { isRunning: false };
    _this._scrollItemWidth = 60;
    _this._sidePadding = 30;
    _this._weekIndex = 0;

    // elements
    _this.scrollerWrapperElement = _this.el.getElementsByClassName('Weeks-scrollerWrapper')[0];
    _this.scrollerElement = _this.el.getElementsByClassName('Weeks-scroller')[0];
    _this.scrollerListElement = _this.el.getElementsByClassName('Weeks-scrollerList')[0];
    _this.cardElements = _this.el.getElementsByClassName('Weeks-cardWrapper');

    // init scroll
    var listWidth = _this._scrollItemWidth * _this.numberOfWeeks; // + this._sidePadding
    _this.scrollerListElement.style.width = listWidth + 'px';
    _this.scrollerElement.scrollLeft = 0;
    _this.scrollerWrapperElement.classList.add('isVisible');

    _this._bindEvents();
    return _this;
  }

  Weeks.prototype._bindEvents = function _bindEvents() {
    var _this2 = this;

    this.onScroll = this.onScroll.bind(this);
    this.onScrollEnd = this.onScrollEnd.bind(this);
    this.scrollerElement.addEventListener('scroll', this.onScroll);
    this.scrollerElement.addEventListener("touchstart", function () {
      console.log('touch start');
      _this2._hasStartedTouch = true;
    }, false);
    this.scrollerElement.addEventListener("touchend", function () {
      _this2._hasStartedTouch = false;
      _this2.respondToScrollEnd();
    }, false);

    window.onresize = (0, _debounce2.default)(this._onWindowResize.bind(this), 500);
  };
  // Window scroll event listener


  Weeks.prototype.onScroll = function onScroll(e) {
    e.stopPropagation();
    this.requestScrollUpdate(e.target);
    this.respondToScrollEnd();
  };

  Weeks.prototype.respondToScrollEnd = function respondToScrollEnd() {
    clearTimeout(this._scrollEndTimer);
    this._scrollEndTimer = setTimeout(this.onScrollEnd, 200);
  };

  Weeks.prototype.onScrollEnd = function onScrollEnd() {
    if (!this._hasStartedTouch) {
      var scrollX = this.scrollerElement.scrollLeft;
      var newWeekIndex = this.calcWeekIndex(scrollX);
      var destination = newWeekIndex * this._scrollItemWidth;
      (0, _animateScrollX2.default)(this.scrollerElement, scrollX, destination, 300, 'easeOutQuad');
    }
  };

  Weeks.prototype.calcWeekIndex = function calcWeekIndex(scrollX) {
    var newWeekIndex = Math.round(scrollX / this._scrollItemWidth);
    return Math.min(newWeekIndex, this.numberOfWeeks - 1);
  };

  // Updates the selected sample based on scroll position


  Weeks.prototype.requestScrollUpdate = function requestScrollUpdate(target) {
    // only update if not already busy and no animation is running
    if (!this._isBusyUpdating && !this._animation.isRunning) {
      this._isBusyUpdating = true;
      // update in separate thread to not slow down scrolling
      this._updateFrame = window.requestAnimationFrame(this.updateSelectedSampleFromScroll.bind(this, target.scrollLeft));
    }
  };

  // Figures out which sample should be selected based on current scroll
  //  and triggers callback with new index


  Weeks.prototype.updateSelectedSampleFromScroll = function updateSelectedSampleFromScroll(scrollX) {
    var newWeekIndex = this.calcWeekIndex(scrollX);
    if (newWeekIndex !== this._weekIndex && this.isValidWeek(newWeekIndex)) {
      this.cardElements[this._weekIndex].classList.remove('isSelected');
      this._weekIndex = newWeekIndex;
      this.cardElements[this._weekIndex].classList.add('isSelected');
    }
    this._isBusyUpdating = false;
  };

  Weeks.prototype.isValidWeek = function isValidWeek(index) {
    return index > -1 && index < this.numberOfWeeks;
  };

  /*
  * Events
  */

  Weeks.prototype._onWindowResize = function _onWindowResize() {}
  // this._setCardWidths()
  // this._setCurrentPosition()


  /*
  * Destroy
  */
  ;

  Weeks.prototype.destroy = function destroy() {
    this.scrollerElement.removeEventListener('scroll', this.onScroll);
    window.cancelAnimationFrame(this._updateFrame);
    window.cancelAnimationFrame(this._animation.frame);
  };

  return Weeks;
}(_componentLoaderJs.Component);

exports.default = Weeks;

},{"../../utils/animate-scroll-x":7,"../../utils/debounce":8,"component-loader-js":3}],6:[function(require,module,exports){
'use strict';

var _componentLoaderJs = require('component-loader-js');

var _componentLoaderJs2 = _interopRequireDefault(_componentLoaderJs);

var _Weeks = require('./components/Weeks/Weeks');

var _Weeks2 = _interopRequireDefault(_Weeks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Load Components
*/
var componentLoader = new _componentLoaderJs2.default({
  Weeks: _Weeks2.default
});
componentLoader.scan();

/*
* Register service worker
*/
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function (reg) {
    console.log('Service Worker register', reg);
  }).catch(function (err) {
    console.log('Service Worker error', err);
  });
}

},{"./components/Weeks/Weeks":5,"component-loader-js":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (element, start, destination) {
  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 200;
  var easing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'linear';
  var callback = arguments[5];


  // define timing functions
  var easings = {
    linear: function linear(t) {
      return t;
    },
    easeInQuad: function easeInQuad(t) {
      return t * t;
    },
    easeOutQuad: function easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad: function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic: function easeOutCubic(t) {
      return --t * t * t + 1;
    },
    easeInOutCubic: function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart: function easeOutQuart(t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function easeOutQuint(t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  var startTime = Date.now();

  function scroll() {
    var now = Date.now();
    var time = Math.min(1, (now - startTime) / duration);
    var timeFunction = easings[easing](time);
    element.scrollLeft = timeFunction * (destination - start) + start;

    if (element.scrollLeft === destination) {
      //callback();
      return;
    }
    requestAnimationFrame(scroll);
  }
  scroll();
};

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var _arguments = arguments;

exports.default = function (func, threshold, execAsap) {
	var timeout = void 0;

	return function () {
		var obj = undefined,
		    args = _arguments;

		var delayed = function delayed() {
			if (!execAsap) {
				func.apply(obj, args);
			}
			timeout = null;
		};

		if (timeout) {
			clearTimeout(timeout);
		} else if (execAsap) {
			func.apply(obj, args);
		}

		timeout = setTimeout(delayed, threshold || 100);
	};
};

},{}]},{},[6])
//# sourceMappingURL=main-compiled.js.map
