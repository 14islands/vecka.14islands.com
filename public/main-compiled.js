!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),ComponentLoader=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=arguments.length<=1||void 0===arguments[1]?document:arguments[1];_classCallCheck(this,t),this.contextEl=n,this.initializedComponents={},this.numberOfInitializedComponents=0,this.components={},this.topics={},this.register(e)}return _createClass(t,[{key:"register",value:function(){var t=this,e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];Object.keys(e).forEach(function(n){t.components[n]=e[n]})}},{key:"unregister",value:function(t){delete this.components[t]}},{key:"subscribe",value:function(t,e,n){this.topics.hasOwnProperty(t)||(this.topics[t]=[]),this.topics[t].push({context:n,callback:e})}},{key:"unsubscribe",value:function(t,e,n){if(!this.topics.hasOwnProperty(t))return!1;for(var i=0,o=this.topics[t].length;i<o;i++)if(this.topics[t][i].callback===e&&(!n||this.topics[t][i].context===n))return this.topics[t].splice(i,1),!0;return!1}},{key:"publish",value:function(t){if(!this.topics.hasOwnProperty(t))return!1;for(var e=new Array(arguments.length-1),n=0;n<e.length;++n)e[n]=arguments[n+1];for(var i=0,o=this.topics[t].length;i<o;i++){var a=this.topics[t][i];a&&a.callback&&a.callback.apply(a.context,e)}return!0}},{key:"scan",value:function(){var t=this,e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n={},i=this.contextEl.querySelectorAll("[data-component]");[].forEach.call(i,function(i){t._scanElement(i,n,e)}),this.numberOfInitializedComponents>0&&this.cleanUp_(n)}},{key:"_scanElement",value:function(t,e,n){var i=this,o=t.getAttribute("data-component-id");o||(o=this._generateUUID(),t.setAttribute("data-component-id",o));var a=t.getAttribute("data-component").match(/\S+/g);a.forEach(function(a){var r=a+"-"+o;e[r]=!0,i.initializedComponents[r]||i._initializeComponent(a,r,t,n)})}},{key:"_initializeComponent",value:function(t,e,n,i){var o=this.components[t];if("function"!=typeof o)throw"ComponentLoader: unknown component '"+t+"'";var a=new o(n,i,this);this.initializedComponents[e]=a,this.numberOfInitializedComponents++}},{key:"_destroyComponent",value:function(t){var e=this.initializedComponents[t];e&&"function"==typeof e.destroy&&e.destroy(),delete this.initializedComponents[t],this.numberOfInitializedComponents--}},{key:"cleanUp_",value:function(){var t=this,e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];Object.keys(this.initializedComponents).forEach(function(n){e[n]||t._destroyComponent(n)})}},{key:"_generateUUID",value:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0,n="x"==t?e:3&e|8;return n.toString(16)})}}]),t}();exports.default=ComponentLoader,module.exports=exports.default},{}],2:[function(require,module,exports){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),_objectAssign=require("object-assign"),_objectAssign2=_interopRequireDefault(_objectAssign),Component=function(){function e(){_classCallCheck(this,e),this.el=arguments[0],"undefined"!=typeof jQuery&&(this.$el=jQuery(this.el)),this.data=arguments[1],this.__mediator=arguments[2],this._configureData()}return _createClass(e,[{key:"defaultData",value:function(){return{}}}]),_createClass(e,[{key:"_configureData",value:function(){var e={};[].forEach.call(this.el.attributes,function(t){if(/^data-/.test(t.name)){var a=t.name.substr(5).replace(/-(.)/g,function(e,t){return t.toUpperCase()});e[a]=t.value}}),this.data=(0,_objectAssign2.default)(this.defaultData?this.defaultData():{},e,this.data)}},{key:"bind",value:function(){for(var e=0;e<arguments.length;e++){var t=arguments[e];this[t]=this[t].bind(this)}}},{key:"publish",value:function(){var e;(e=this.__mediator).publish.apply(e,arguments)}},{key:"subscribe",value:function(e,t){this.__mediator.subscribe(e,t,this)}},{key:"unsubscribe",value:function(e,t){this.__mediator.unsubscribe(e,t,this)}},{key:"scan",value:function(e){this.__mediator.scan(e)}},{key:"defer",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?17:arguments[1];setTimeout(e,t)}},{key:"destroy",value:function(){}}]),e}();exports.default=Component,module.exports=exports.default},{"object-assign":4}],3:[function(require,module,exports){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _componentLoaderJs=require("./component-loader.js"),_componentLoaderJs2=_interopRequireDefault(_componentLoaderJs),_componentJs=require("./component.js"),_componentJs2=_interopRequireDefault(_componentJs);exports.Component=_componentJs2.default,exports.default=_componentLoaderJs2.default},{"./component-loader.js":1,"./component.js":2}],4:[function(require,module,exports){"use strict";function toObject(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}function shouldUseNative(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var r={},t=0;t<10;t++)r["_"+String.fromCharCode(t)]=t;var n=Object.getOwnPropertyNames(r).map(function(e){return r[e]});if("0123456789"!==n.join(""))return!1;var o={};return"abcdefghijklmnopqrst".split("").forEach(function(e){o[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},o)).join("")}catch(e){return!1}}var hasOwnProperty=Object.prototype.hasOwnProperty,propIsEnumerable=Object.prototype.propertyIsEnumerable;module.exports=shouldUseNative()?Object.assign:function(e,r){for(var t,n,o=toObject(e),a=1;a<arguments.length;a++){t=Object(arguments[a]);for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);if(Object.getOwnPropertySymbols){n=Object.getOwnPropertySymbols(t);for(var s=0;s<n.length;s++)propIsEnumerable.call(t,n[s])&&(o[n[s]]=t[n[s]])}}return o}},{}],5:[function(require,module,exports){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _componentLoaderJs=require("component-loader-js"),_debounce=require("../../utils/debounce"),_debounce2=_interopRequireDefault(_debounce),Weeks=function(e){function t(){_classCallCheck(this,t);var n=_possibleConstructorReturn(this,e.apply(this,arguments));n.numberOfWeeks=n.el.dataset.weeksCount,n._updateFrame=null,n._isBusyUpdating=!1,n._animation={isRunning:!1},n._scrollItemWidth=60,n._sidePadding=30,n._weekIndex=0,n.scrollerWrapperElement=n.el.getElementsByClassName("Weeks-scrollerWrapper")[0],n.scrollerElement=n.el.getElementsByClassName("Weeks-scroller")[0],n.scrollerListElement=n.el.getElementsByClassName("Weeks-scrollerList")[0],n.cardElements=n.el.getElementsByClassName("Weeks-cardWrapper");var s=n._scrollItemWidth*n.numberOfWeeks+n._sidePadding;return n.scrollerListElement.style.width=s+"px",n.scrollerElement.scrollLeft=0,n.scrollerWrapperElement.classList.add("isVisible"),n._bindEvents(),n}return _inherits(t,e),t.prototype._bindEvents=function(){this.onScroll=this.onScroll.bind(this),this.scrollerElement.addEventListener("scroll",this.onScroll),window.onresize=(0,_debounce2.default)(this._onWindowResize.bind(this),500)},t.prototype.onScroll=function(e){e.stopPropagation(),this.requestScrollUpdate(e.target)},t.prototype.requestScrollUpdate=function(e){this._isBusyUpdating||this._animation.isRunning||(this._isBusyUpdating=!0,this._updateFrame=window.requestAnimationFrame(this.updateSelectedSampleFromScroll.bind(this,e.scrollLeft)))},t.prototype.updateSelectedSampleFromScroll=function(e){var t=Math.floor(e/this._scrollItemWidth);t!==this._weekIndex&&this.isValidWeek(t)&&(this.cardElements[this._weekIndex].classList.remove("isSelected"),this._weekIndex=t,this.cardElements[this._weekIndex].classList.add("isSelected")),this._isBusyUpdating=!1},t.prototype.isValidWeek=function(e){return e>-1&&e<this.numberOfWeeks},t.prototype._onWindowResize=function(){},t.prototype.destroy=function(){this.scrollerElement.removeEventListener("scroll",this.onScroll),window.cancelAnimationFrame(this._updateFrame),window.cancelAnimationFrame(this._animation.frame)},t}(_componentLoaderJs.Component);exports.default=Weeks},{"../../utils/debounce":7,"component-loader-js":3}],6:[function(require,module,exports){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var _componentLoaderJs=require("component-loader-js"),_componentLoaderJs2=_interopRequireDefault(_componentLoaderJs),_Weeks=require("./components/Weeks/Weeks"),_Weeks2=_interopRequireDefault(_Weeks),componentLoader=new _componentLoaderJs2.default({Weeks:_Weeks2.default});componentLoader.scan()},{"./components/Weeks/Weeks":5,"component-loader-js":3}],7:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _arguments=arguments;exports.default=function(e,t,r){var u=void 0;return function(){var n=void 0,a=_arguments,o=function(){r||e.apply(n,a),u=null};u?clearTimeout(u):r&&e.apply(n,a),u=setTimeout(o,t||100)}}},{}]},{},[6]);