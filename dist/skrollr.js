(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function(object) {
    if(!object) return console.warn('bindAll requires at least one argument.');

    var functions = Array.prototype.slice.call(arguments, 1);

    if (functions.length === 0) {

        for (var method in object) {
            if(hasOwnProperty.call(object, method)) {
                if(typeof object[method] == 'function' && toString.call(object[method]) == "[object Function]") {
                    functions.push(method);
                }
            }
        }
    }

    for(var i = 0; i < functions.length; i++) {
        var f = functions[i];
        object[f] = bind(object[f], object);
    }
};

/*
    Faster bind without specific-case checking. (see https://coderwall.com/p/oi3j3w).
    bindAll is only needed for events binding so no need to make slow fixes for constructor
    or partial application.
*/
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}
},{}],2:[function(require,module,exports){
/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var whitespaceRe = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

module.exports = classes;
module.exports.add = add;
module.exports.contains = has;
module.exports.has = has;
module.exports.toggle = toggle;
module.exports.remove = remove;
module.exports.removeMatching = removeMatching;

function classes (el) {
  if (el.classList) {
    return el.classList;
  }

  var str = el.className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(whitespaceRe);
  if ('' === arr[0]) arr.shift();
  return arr;
}

function add (el, name) {
  // classList
  if (el.classList) {
    el.classList.add(name);
    return;
  }

  // fallback
  var arr = classes(el);
  var i = index(arr, name);
  if (!~i) arr.push(name);
  el.className = arr.join(' ');
}

function has (el, name) {
  return el.classList
    ? el.classList.contains(name)
    : !! ~index(classes(el), name);
}

function remove (el, name) {
  if ('[object RegExp]' == toString.call(name)) {
    return removeMatching(el, name);
  }

  // classList
  if (el.classList) {
    el.classList.remove(name);
    return;
  }

  // fallback
  var arr = classes(el);
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  el.className = arr.join(' ');
}

function removeMatching (el, re, ref) {
  var arr = Array.prototype.slice.call(classes(el));
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      remove(el, arr[i]);
    }
  }
}

function toggle (el, name) {
  // classList
  if (el.classList) {
    return el.classList.toggle(name);
  }

  // fallback
  if (has(el, name)) {
    remove(el, name);
  } else {
    add(el, name);
  }
}

},{"indexof":5}],3:[function(require,module,exports){
/*
`dom-create-element`

var create = require('dom-create-element');

var el = create({
  selector: 'div',
  styles: 'preloader',
  html: '<span>Text</span>'
});
*/

module.exports = create;

function create(opt) {

	opt = opt || {};
	
	var el = document.createElement(opt.selector);
	
	if(opt.attr) for(var index in opt.attr)
		opt.attr.hasOwnProperty(index) && el.setAttribute(index, opt.attr[index]);
	
	"a" == opt.selector && opt.link && (
		el.href = opt.link,
		opt.target && el.setAttribute("target", opt.target)
	);

	"img" == opt.selector && opt.src && (
		el.src = opt.src,
		opt.lazyload && (
			el.style.opacity = 0,
			el.onload = function(){
				el.style.opacity = 1;
			}
		)
	);

	opt.id && (el.id = opt.id);
	opt.styles && (el.className = opt.styles);

	opt.html && (el.innerHTML = opt.html);
	opt.children && (el.appendChild(opt.children));
	
	return el;
};
},{}],4:[function(require,module,exports){

var synth = require('synthetic-dom-events');

var on = function(element, name, fn, capture) {
    return element.addEventListener(name, fn, capture || false);
};

var off = function(element, name, fn, capture) {
    return element.removeEventListener(name, fn, capture || false);
};

var once = function (element, name, fn, capture) {
    function tmp (ev) {
        off(element, name, tmp, capture);
        fn(ev);
    }
    on(element, name, tmp, capture);
};

var emit = function(element, name, opt) {
    var ev = synth(name, opt);
    element.dispatchEvent(ev);
};

if (!document.addEventListener) {
    on = function(element, name, fn) {
        return element.attachEvent('on' + name, fn);
    };
}

if (!document.removeEventListener) {
    off = function(element, name, fn) {
        return element.detachEvent('on' + name, fn);
    };
}

if (!document.dispatchEvent) {
    emit = function(element, name, opt) {
        var ev = synth(name, opt);
        return element.fireEvent('on' + ev.type, ev);
    };
}

module.exports = {
    on: on,
    off: off,
    once: once,
    emit: emit
};

},{"synthetic-dom-events":10}],5:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Lethargy = (function() {
    function Lethargy(stability, sensitivity, tolerance, delay) {
      this.stability = stability != null ? Math.abs(stability) : 8;
      this.sensitivity = sensitivity != null ? 1 + Math.abs(sensitivity) : 100;
      this.tolerance = tolerance != null ? 1 + Math.abs(tolerance) : 1.1;
      this.delay = delay != null ? delay : 150;
      this.lastUpDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.lastDownDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.deltasTimestamp = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
    }

    Lethargy.prototype.check = function(e) {
      var lastDelta;
      e = e.originalEvent || e;
      if (e.wheelDelta != null) {
        lastDelta = e.wheelDelta;
      } else if (e.deltaY != null) {
        lastDelta = e.deltaY * -40;
      } else if ((e.detail != null) || e.detail === 0) {
        lastDelta = e.detail * -40;
      }
      this.deltasTimestamp.push(Date.now());
      this.deltasTimestamp.shift();
      if (lastDelta > 0) {
        this.lastUpDeltas.push(lastDelta);
        this.lastUpDeltas.shift();
        return this.isInertia(1);
      } else {
        this.lastDownDeltas.push(lastDelta);
        this.lastDownDeltas.shift();
        return this.isInertia(-1);
      }
      return false;
    };

    Lethargy.prototype.isInertia = function(direction) {
      var lastDeltas, lastDeltasNew, lastDeltasOld, newAverage, newSum, oldAverage, oldSum;
      lastDeltas = direction === -1 ? this.lastDownDeltas : this.lastUpDeltas;
      if (lastDeltas[0] === null) {
        return direction;
      }
      if (this.deltasTimestamp[(this.stability * 2) - 2] + this.delay > Date.now() && lastDeltas[0] === lastDeltas[(this.stability * 2) - 1]) {
        return false;
      }
      lastDeltasOld = lastDeltas.slice(0, this.stability);
      lastDeltasNew = lastDeltas.slice(this.stability, this.stability * 2);
      oldSum = lastDeltasOld.reduce(function(t, s) {
        return t + s;
      });
      newSum = lastDeltasNew.reduce(function(t, s) {
        return t + s;
      });
      oldAverage = oldSum / lastDeltasOld.length;
      newAverage = newSum / lastDeltasNew.length;
      if (Math.abs(oldAverage) < Math.abs(newAverage * this.tolerance) && (this.sensitivity < Math.abs(newAverage))) {
        return direction;
      } else {
        return false;
      }
    };

    Lethargy.prototype.showLastUpDeltas = function() {
      return this.lastUpDeltas;
    };

    Lethargy.prototype.showLastDownDeltas = function() {
      return this.lastDownDeltas;
    };

    return Lethargy;

  })();

}).call(this);

},{}],7:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
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
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
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
	} catch (err) {
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

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],8:[function(require,module,exports){
// check document first so it doesn't error in node.js
var style = typeof document != 'undefined'
  ? document.createElement('p').style
  : {}

var prefixes = ['O', 'ms', 'Moz', 'Webkit']
var upper = /([A-Z])/g
var memo = {}

/**
 * prefix `key`
 *
 *   prefix('transform') // => WebkitTransform
 *
 * @param {String} key
 * @return {String}
 * @api public
 */
function prefix(key){
  // Camel case
  key = key.replace(/-([a-z])/g, function(_, char){
    return char.toUpperCase()
  })

  // Without prefix
  if (style[key] !== undefined) return key

  // With prefix
  var Key = key.charAt(0).toUpperCase() + key.slice(1)
  var i = prefixes.length
  while (i--) {
    var name = prefixes[i] + Key
    if (style[name] !== undefined) return name
  }

  return key
}

/**
 * Memoized version of `prefix`
 *
 * @param {String} key
 * @return {String}
 * @api public
 */
function prefixMemozied(key){
  return key in memo
    ? memo[key]
    : memo[key] = prefix(key)
}

/**
 * Create a dashed prefix
 *
 * @param {String} key
 * @return {String}
 * @api public
 */
function prefixDashed(key){
  key = prefix(key)
  if (upper.test(key)) {
    key = '-' + key.replace(upper, '-$1')
    upper.lastIndex = 0
  }
  return key.toLowerCase()
}

module.exports = prefixMemozied
module.exports.dash = prefixDashed

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _domClasses = require('dom-classes');

var _domClasses2 = _interopRequireDefault(_domClasses);

var _domCreateElement = require('dom-create-element');

var _domCreateElement2 = _interopRequireDefault(_domCreateElement);

var _prefix = require('prefix');

var _prefix2 = _interopRequireDefault(_prefix);

var _virtualScroll = require('virtual-scroll');

var _virtualScroll2 = _interopRequireDefault(_virtualScroll);

var _domEvents = require('dom-events');

var _domEvents2 = _interopRequireDefault(_domEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Smooth = function () {
    function Smooth() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Smooth);

        this.createBound();

        this.options = opt;

        this.prefix = (0, _prefix2.default)('transform');
        this.rAF = undefined;

        // It seems that under heavy load, Firefox will still call the RAF callback even though the RAF has been canceled
        // To prevent that we set a flag to prevent any callback to be executed when RAF is removed
        this.isRAFCanceled = false;

        var constructorName = this.constructor.name ? this.constructor.name : 'Smooth';
        this.extends = constructorName != 'Smooth';

        this.callback = this.options.callback || null;

        this.vars = {
            direction: this.options.direction || 'vertical',
            native: this.options.native || false,
            ease: this.options.ease || 0.075,
            preload: this.options.preload || false,
            current: 0,
            last: 0,
            target: 0,
            height: window.innerHeight,
            width: window.innerWidth,
            bounding: 0,
            timer: null,
            ticking: false
        };

        this.vs = this.vars.native ? null : new _virtualScroll2.default({
            limitInertia: this.options.vs && this.options.vs.limitInertia || false,
            mouseMultiplier: this.options.vs && this.options.vs.mouseMultiplier || 1,
            touchMultiplier: this.options.vs && this.options.vs.touchMultiplier || 1.5,
            firefoxMultiplier: this.options.vs && this.options.vs.firefoxMultiplier || 30,
            preventTouch: this.options.vs && this.options.vs.preventTouch || true
        });

        this.dom = {
            listener: this.options.listener || document.body,
            section: this.options.section || document.querySelector('.vs-section') || null,
            scrollbar: this.vars.native || this.options.noscrollbar ? null : {
                state: {
                    clicked: false,
                    x: 0
                },
                el: (0, _domCreateElement2.default)({ selector: 'div', styles: 'vs-scrollbar vs-' + this.vars.direction + ' vs-scrollbar-' + constructorName.toLowerCase() }),
                drag: {
                    el: (0, _domCreateElement2.default)({ selector: 'div', styles: 'vs-scrolldrag' }),
                    delta: 0,
                    height: 50
                }
            }
        };
    }

    _createClass(Smooth, [{
        key: 'createBound',
        value: function createBound() {
            var _this = this;

            ['run', 'calc', 'debounce', 'resize', 'mouseUp', 'mouseDown', 'mouseMove', 'calcScroll', 'scrollTo'].forEach(function (fn) {
                return _this[fn] = _this[fn].bind(_this);
            });
        }
    }, {
        key: 'init',
        value: function init() {

            this.addClasses();

            this.vars.preload && this.preloadImages();
            this.vars.native ? this.addFakeScrollHeight() : !this.options.noscrollbar && this.addFakeScrollBar();

            this.addEvents();
            this.resize();
        }
    }, {
        key: 'addClasses',
        value: function addClasses() {

            var type = this.vars.native ? 'native' : 'virtual';
            var direction = this.vars.direction === 'vertical' ? 'y' : 'x';

            _domClasses2.default.add(this.dom.listener, 'is-' + type + '-scroll');
            _domClasses2.default.add(this.dom.listener, direction + '-scroll');
        }
    }, {
        key: 'preloadImages',
        value: function preloadImages() {
            var _this2 = this;

            var images = Array.prototype.slice.call(this.dom.listener.querySelectorAll('img'), 0);

            images.forEach(function (image) {

                var img = document.createElement('img');

                _domEvents2.default.once(img, 'load', function () {

                    images.splice(images.indexOf(image), 1);
                    images.length === 0 && _this2.resize();
                });

                img.src = image.getAttribute('src');
            });
        }
    }, {
        key: 'calc',
        value: function calc(e) {

            var delta = this.vars.direction == 'horizontal' ? e.deltaX : e.deltaY;

            this.vars.target += delta * -1;
            this.clampTarget();
        }
    }, {
        key: 'debounce',
        value: function debounce() {
            var _this3 = this;

            var win = this.dom.listener === document.body;

            this.vars.target = this.vars.direction === 'vertical' ? win ? window.scrollY || window.pageYOffset : this.dom.listener.scrollTop : win ? window.scrollX || window.pageXOffset : this.dom.listener.scrollLeft;

            clearTimeout(this.vars.timer);

            if (!this.vars.ticking) {
                this.vars.ticking = true;
                _domClasses2.default.add(this.dom.listener, 'is-scrolling');
            }

            this.vars.timer = setTimeout(function () {
                _this3.vars.ticking = false;
                _domClasses2.default.remove(_this3.dom.listener, 'is-scrolling');
            }, 200);
        }
    }, {
        key: 'run',
        value: function run() {
            if (this.isRAFCanceled) return;

            this.vars.current += (this.vars.target - this.vars.current) * this.vars.ease;
            this.vars.current < .1 && (this.vars.current = 0);

            this.rAF = requestAnimationFrame(this.run);

            if (!this.extends) {
                this.dom.section.style[this.prefix] = this.getTransform(-this.vars.current.toFixed(2));
            }

            if (!this.vars.native && !this.options.noscrollbar) {
                var size = this.dom.scrollbar.drag.height;
                var bounds = this.vars.direction === 'vertical' ? this.vars.height : this.vars.width;
                var value = Math.abs(this.vars.current) / (this.vars.bounding / (bounds - size)) + size / .5 - size;
                var clamp = Math.max(0, Math.min(value - size, value + size));
                this.dom.scrollbar.drag.el.style[this.prefix] = this.getTransform(clamp.toFixed(2));
            }

            if (this.callback && this.vars.current !== this.vars.last) {
                this.callback(this.vars.current);
            }

            this.vars.last = this.vars.current;
        }
    }, {
        key: 'getTransform',
        value: function getTransform(value) {

            return this.vars.direction === 'vertical' ? 'translate3d(0,' + value + 'px,0)' : 'translate3d(' + value + 'px,0,0)';
        }
    }, {
        key: 'on',
        value: function on() {
            var requestAnimationFrame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (this.isRAFCanceled) {
                this.isRAFCanceled = false;
            }

            var node = this.dom.listener === document.body ? window : this.dom.listener;

            this.vars.native ? _domEvents2.default.on(node, 'scroll', this.debounce) : this.vs && this.vs.on(this.calc);

            requestAnimationFrame && this.requestAnimationFrame();
        }
    }, {
        key: 'off',
        value: function off() {
            var cancelAnimationFrame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


            var node = this.dom.listener === document.body ? window : this.dom.listener;

            this.vars.native ? _domEvents2.default.off(node, 'scroll', this.debounce) : this.vs && this.vs.off(this.calc);

            cancelAnimationFrame && this.cancelAnimationFrame();
        }
    }, {
        key: 'requestAnimationFrame',
        value: function (_requestAnimationFrame) {
            function requestAnimationFrame() {
                return _requestAnimationFrame.apply(this, arguments);
            }

            requestAnimationFrame.toString = function () {
                return _requestAnimationFrame.toString();
            };

            return requestAnimationFrame;
        }(function () {

            this.rAF = requestAnimationFrame(this.run);
        })
    }, {
        key: 'cancelAnimationFrame',
        value: function (_cancelAnimationFrame) {
            function cancelAnimationFrame() {
                return _cancelAnimationFrame.apply(this, arguments);
            }

            cancelAnimationFrame.toString = function () {
                return _cancelAnimationFrame.toString();
            };

            return cancelAnimationFrame;
        }(function () {
            this.isRAFCanceled = true;
            cancelAnimationFrame(this.rAF);
        })
    }, {
        key: 'addEvents',
        value: function addEvents() {

            this.on();

            _domEvents2.default.on(window, 'resize', this.resize);
        }
    }, {
        key: 'removeEvents',
        value: function removeEvents() {

            this.off();

            _domEvents2.default.off(window, 'resize', this.resize);
        }
    }, {
        key: 'addFakeScrollBar',
        value: function addFakeScrollBar() {

            this.dom.listener.appendChild(this.dom.scrollbar.el);
            this.dom.scrollbar.el.appendChild(this.dom.scrollbar.drag.el);

            _domEvents2.default.on(this.dom.scrollbar.el, 'click', this.calcScroll);
            _domEvents2.default.on(this.dom.scrollbar.el, 'mousedown', this.mouseDown);

            _domEvents2.default.on(document, 'mousemove', this.mouseMove);
            _domEvents2.default.on(document, 'mouseup', this.mouseUp);
        }
    }, {
        key: 'removeFakeScrollBar',
        value: function removeFakeScrollBar() {

            _domEvents2.default.off(this.dom.scrollbar.el, 'click', this.calcScroll);
            _domEvents2.default.off(this.dom.scrollbar.el, 'mousedown', this.mouseDown);

            _domEvents2.default.off(document, 'mousemove', this.mouseMove);
            _domEvents2.default.off(document, 'mouseup', this.mouseUp);

            this.dom.listener.removeChild(this.dom.scrollbar.el);
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown(e) {

            e.preventDefault();
            e.which == 1 && (this.dom.scrollbar.state.clicked = true);
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp(e) {

            this.dom.scrollbar.state.clicked = false;

            _domClasses2.default.remove(this.dom.listener, 'is-dragging');
        }
    }, {
        key: 'mouseMove',
        value: function mouseMove(e) {

            this.dom.scrollbar.state.clicked && this.calcScroll(e);
        }
    }, {
        key: 'addFakeScrollHeight',
        value: function addFakeScrollHeight() {

            this.dom.scroll = (0, _domCreateElement2.default)({
                selector: 'div',
                styles: 'vs-scroll-view'
            });

            this.dom.listener.appendChild(this.dom.scroll);
        }
    }, {
        key: 'removeFakeScrollHeight',
        value: function removeFakeScrollHeight() {

            this.dom.listener.removeChild(this.dom.scroll);
        }
    }, {
        key: 'calcScroll',
        value: function calcScroll(e) {

            var client = this.vars.direction == 'vertical' ? e.clientY : e.clientX;
            var bounds = this.vars.direction == 'vertical' ? this.vars.height : this.vars.width;
            var delta = client * (this.vars.bounding / bounds);

            _domClasses2.default.add(this.dom.listener, 'is-dragging');

            this.vars.target = delta;
            this.clampTarget();
            this.dom.scrollbar && (this.dom.scrollbar.drag.delta = this.vars.target);
        }
    }, {
        key: 'scrollTo',
        value: function scrollTo(offset) {

            if (this.vars.native) {

                this.vars.direction == 'vertical' ? window.scrollTo(0, offset) : window.scrollTo(offset, 0);
            } else {

                this.vars.target = offset;
                this.clampTarget();
            }
        }
    }, {
        key: 'resize',
        value: function resize() {

            var prop = this.vars.direction === 'vertical' ? 'height' : 'width';

            this.vars.height = window.innerHeight;
            this.vars.width = window.innerWidth;

            if (!this.extends) {
                var bounding = this.dom.section.getBoundingClientRect();
                this.vars.bounding = this.vars.direction === 'vertical' ? bounding.height - (this.vars.native ? 0 : this.vars.height) : bounding.right - (this.vars.native ? 0 : this.vars.width);
            }

            if (!this.vars.native && !this.options.noscrollbar) {
                this.dom.scrollbar.drag.height = this.vars.height * (this.vars.height / (this.vars.bounding + this.vars.height));
                this.dom.scrollbar.drag.el.style[prop] = this.dom.scrollbar.drag.height + 'px';
            } else if (this.vars.native) {
                this.dom.scroll.style[prop] = this.vars.bounding + 'px';
            }

            !this.vars.native && this.clampTarget();
        }
    }, {
        key: 'clampTarget',
        value: function clampTarget() {

            this.vars.target = Math.round(Math.max(0, Math.min(this.vars.target, this.vars.bounding)));
        }
    }, {
        key: 'destroy',
        value: function destroy() {

            if (this.vars.native) {

                _domClasses2.default.remove(this.dom.listener, 'is-native-scroll');

                this.removeFakeScrollHeight();
            } else {

                _domClasses2.default.remove(this.dom.listener, 'is-virtual-scroll');

                !this.options.noscrollbar && this.removeFakeScrollBar();
            }

            this.vars.direction === 'vertical' ? _domClasses2.default.remove(this.dom.listener, 'y-scroll') : _domClasses2.default.remove(this.dom.listener, 'x-scroll');
            this.vars.current = 0;

            this.vs && (this.vs.destroy(), this.vs = null);

            this.removeEvents();
        }
    }]);

    return Smooth;
}();

exports.default = Smooth;


window.Smooth = Smooth;

},{"dom-classes":2,"dom-create-element":3,"dom-events":4,"prefix":8,"virtual-scroll":15}],10:[function(require,module,exports){

// for compression
var win = window;
var doc = document || {};
var root = doc.documentElement || {};

// detect if we need to use firefox KeyEvents vs KeyboardEvents
var use_key_event = true;
try {
    doc.createEvent('KeyEvents');
}
catch (err) {
    use_key_event = false;
}

// Workaround for https://bugs.webkit.org/show_bug.cgi?id=16735
function check_kb(ev, opts) {
    if (ev.ctrlKey != (opts.ctrlKey || false) ||
        ev.altKey != (opts.altKey || false) ||
        ev.shiftKey != (opts.shiftKey || false) ||
        ev.metaKey != (opts.metaKey || false) ||
        ev.keyCode != (opts.keyCode || 0) ||
        ev.charCode != (opts.charCode || 0)) {

        ev = document.createEvent('Event');
        ev.initEvent(opts.type, opts.bubbles, opts.cancelable);
        ev.ctrlKey  = opts.ctrlKey || false;
        ev.altKey   = opts.altKey || false;
        ev.shiftKey = opts.shiftKey || false;
        ev.metaKey  = opts.metaKey || false;
        ev.keyCode  = opts.keyCode || 0;
        ev.charCode = opts.charCode || 0;
    }

    return ev;
}

// modern browsers, do a proper dispatchEvent()
var modern = function(type, opts) {
    opts = opts || {};

    // which init fn do we use
    var family = typeOf(type);
    var init_fam = family;
    if (family === 'KeyboardEvent' && use_key_event) {
        family = 'KeyEvents';
        init_fam = 'KeyEvent';
    }

    var ev = doc.createEvent(family);
    var init_fn = 'init' + init_fam;
    var init = typeof ev[init_fn] === 'function' ? init_fn : 'initEvent';

    var sig = initSignatures[init];
    var args = [];
    var used = {};

    opts.type = type;
    for (var i = 0; i < sig.length; ++i) {
        var key = sig[i];
        var val = opts[key];
        // if no user specified value, then use event default
        if (val === undefined) {
            val = ev[key];
        }
        used[key] = true;
        args.push(val);
    }
    ev[init].apply(ev, args);

    // webkit key event issue workaround
    if (family === 'KeyboardEvent') {
        ev = check_kb(ev, opts);
    }

    // attach remaining unused options to the object
    for (var key in opts) {
        if (!used[key]) {
            ev[key] = opts[key];
        }
    }

    return ev;
};

var legacy = function (type, opts) {
    opts = opts || {};
    var ev = doc.createEventObject();

    ev.type = type;
    for (var key in opts) {
        if (opts[key] !== undefined) {
            ev[key] = opts[key];
        }
    }

    return ev;
};

// expose either the modern version of event generation or legacy
// depending on what we support
// avoids if statements in the code later
module.exports = doc.createEvent ? modern : legacy;

var initSignatures = require('./init.json');
var types = require('./types.json');
var typeOf = (function () {
    var typs = {};
    for (var key in types) {
        var ts = types[key];
        for (var i = 0; i < ts.length; i++) {
            typs[ts[i]] = key;
        }
    }

    return function (name) {
        return typs[name] || 'Event';
    };
})();

},{"./init.json":11,"./types.json":12}],11:[function(require,module,exports){
module.exports={
  "initEvent" : [
    "type",
    "bubbles",
    "cancelable"
  ],
  "initUIEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "view",
    "detail"
  ],
  "initMouseEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "view",
    "detail",
    "screenX",
    "screenY",
    "clientX",
    "clientY",
    "ctrlKey",
    "altKey",
    "shiftKey",
    "metaKey",
    "button",
    "relatedTarget"
  ],
  "initMutationEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "relatedNode",
    "prevValue",
    "newValue",
    "attrName",
    "attrChange"
  ],
  "initKeyboardEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "view",
    "ctrlKey",
    "altKey",
    "shiftKey",
    "metaKey",
    "keyCode",
    "charCode"
  ],
  "initKeyEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "view",
    "ctrlKey",
    "altKey",
    "shiftKey",
    "metaKey",
    "keyCode",
    "charCode"
  ]
}

},{}],12:[function(require,module,exports){
module.exports={
  "MouseEvent" : [
    "click",
    "mousedown",
    "mouseup",
    "mouseover",
    "mousemove",
    "mouseout"
  ],
  "KeyboardEvent" : [
    "keydown",
    "keyup",
    "keypress"
  ],
  "MutationEvent" : [
    "DOMSubtreeModified",
    "DOMNodeInserted",
    "DOMNodeRemoved",
    "DOMNodeRemovedFromDocument",
    "DOMNodeInsertedIntoDocument",
    "DOMAttrModified",
    "DOMCharacterDataModified"
  ],
  "HTMLEvents" : [
    "load",
    "unload",
    "abort",
    "error",
    "select",
    "change",
    "submit",
    "reset",
    "focus",
    "blur",
    "resize",
    "scroll"
  ],
  "UIEvent" : [
    "DOMFocusIn",
    "DOMFocusOut",
    "DOMActivate"
  ]
}

},{}],13:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],14:[function(require,module,exports){
'use strict';

module.exports = function(source) {
    return JSON.parse(JSON.stringify(source));
};
},{}],15:[function(require,module,exports){
'use strict';

var objectAssign = require('object-assign');
var Emitter = require('tiny-emitter');
var Lethargy = require('lethargy').Lethargy;
var support = require('./support');
var clone = require('./clone');
var bindAll = require('bindall-standalone');
var EVT_ID = 'virtualscroll';

module.exports = VirtualScroll;

var keyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
};

function VirtualScroll(options) {
    bindAll(this, '_onWheel', '_onMouseWheel', '_onTouchStart', '_onTouchMove', '_onKeyDown');

    this.el = window;
    if (options && options.el) {
        this.el = options.el;
        delete options.el;
    }
    this.options = objectAssign({
        mouseMultiplier: 1,
        touchMultiplier: 2,
        firefoxMultiplier: 15,
        keyStep: 120,
        preventTouch: false,
        unpreventTouchClass: 'vs-touchmove-allowed',
        limitInertia: false
    }, options);

    if (this.options.limitInertia) this._lethargy = new Lethargy();

    this._emitter = new Emitter();
    this._event = {
        y: 0,
        x: 0,
        deltaX: 0,
        deltaY: 0
    };
    this.touchStartX = null;
    this.touchStartY = null;
    this.bodyTouchAction = null;

    if (this.options.passive !== undefined) {
        this.listenerOptions = {passive: this.options.passive};
    }
}

VirtualScroll.prototype._notify = function(e) {
    var evt = this._event;
    evt.x += evt.deltaX;
    evt.y += evt.deltaY;

   this._emitter.emit(EVT_ID, {
        x: evt.x,
        y: evt.y,
        deltaX: evt.deltaX,
        deltaY: evt.deltaY,
        originalEvent: e
   });
};

VirtualScroll.prototype._onWheel = function(e) {
    var options = this.options;
    if (this._lethargy && this._lethargy.check(e) === false) return;
    var evt = this._event;

    // In Chrome and in Firefox (at least the new one)
    evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1;

    // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
    // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
    if(support.isFirefox && e.deltaMode == 1) {
        evt.deltaX *= options.firefoxMultiplier;
        evt.deltaY *= options.firefoxMultiplier;
    }

    evt.deltaX *= options.mouseMultiplier;
    evt.deltaY *= options.mouseMultiplier;

    this._notify(e);
};

VirtualScroll.prototype._onMouseWheel = function(e) {
    if (this.options.limitInertia && this._lethargy.check(e) === false) return;

    var evt = this._event;

    // In Safari, IE and in Chrome if 'wheel' isn't defined
    evt.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
    evt.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

    this._notify(e);
};

VirtualScroll.prototype._onTouchStart = function(e) {
    var t = (e.targetTouches) ? e.targetTouches[0] : e;
    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;
};

VirtualScroll.prototype._onTouchMove = function(e) {
    var options = this.options;
    if(options.preventTouch
        && !e.target.classList.contains(options.unpreventTouchClass)) {
        e.preventDefault();
    }

    var evt = this._event;

    var t = (e.targetTouches) ? e.targetTouches[0] : e;

    evt.deltaX = (t.pageX - this.touchStartX) * options.touchMultiplier;
    evt.deltaY = (t.pageY - this.touchStartY) * options.touchMultiplier;

    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;

    this._notify(e);
};

VirtualScroll.prototype._onKeyDown = function(e) {
    var evt = this._event;
    evt.deltaX = evt.deltaY = 0;
    var windowHeight = window.innerHeight - 40

    switch(e.keyCode) {
        case keyCodes.LEFT:
        case keyCodes.UP:
            evt.deltaY = this.options.keyStep;
            break;

        case keyCodes.RIGHT:
        case keyCodes.DOWN:
            evt.deltaY = - this.options.keyStep;
            break;
        case keyCodes.SPACE && e.shiftKey:
            evt.deltaY = windowHeight;
            break;
        case keyCodes.SPACE:
            evt.deltaY = - windowHeight;
            break;
        default:
            return;
    }

    this._notify(e);
};

VirtualScroll.prototype._bind = function() {
    if(support.hasWheelEvent) this.el.addEventListener('wheel', this._onWheel, this.listenerOptions);
    if(support.hasMouseWheelEvent) this.el.addEventListener('mousewheel', this._onMouseWheel, this.listenerOptions);

    if(support.hasTouch) {
        this.el.addEventListener('touchstart', this._onTouchStart, this.listenerOptions);
        this.el.addEventListener('touchmove', this._onTouchMove, this.listenerOptions);
    }

    if(support.hasPointer && support.hasTouchWin) {
        this.bodyTouchAction = document.body.style.msTouchAction;
        document.body.style.msTouchAction = 'none';
        this.el.addEventListener('MSPointerDown', this._onTouchStart, true);
        this.el.addEventListener('MSPointerMove', this._onTouchMove, true);
    }

    if(support.hasKeyDown) document.addEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype._unbind = function() {
    if(support.hasWheelEvent) this.el.removeEventListener('wheel', this._onWheel);
    if(support.hasMouseWheelEvent) this.el.removeEventListener('mousewheel', this._onMouseWheel);

    if(support.hasTouch) {
        this.el.removeEventListener('touchstart', this._onTouchStart);
        this.el.removeEventListener('touchmove', this._onTouchMove);
    }

    if(support.hasPointer && support.hasTouchWin) {
        document.body.style.msTouchAction = this.bodyTouchAction;
        this.el.removeEventListener('MSPointerDown', this._onTouchStart, true);
        this.el.removeEventListener('MSPointerMove', this._onTouchMove, true);
    }

    if(support.hasKeyDown) document.removeEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype.on = function(cb, ctx) {
  this._emitter.on(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (events && events[EVT_ID] && events[EVT_ID].length === 1) this._bind();
};

VirtualScroll.prototype.off = function(cb, ctx) {
  this._emitter.off(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (!events[EVT_ID] || events[EVT_ID].length <= 0) this._unbind();
};

VirtualScroll.prototype.reset = function() {
    var evt = this._event;
    evt.x = 0;
    evt.y = 0;
};

VirtualScroll.prototype.destroy = function() {
    this._emitter.off();
    this._unbind();
};

},{"./clone":14,"./support":16,"bindall-standalone":1,"lethargy":6,"object-assign":7,"tiny-emitter":13}],16:[function(require,module,exports){
'use strict';

module.exports = (function getSupport() {
    return {
        hasWheelEvent: 'onwheel' in document,
        hasMouseWheelEvent: 'onmousewheel' in document,
        hasTouch: 'ontouchstart' in document,
        hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
        hasPointer: !!window.navigator.msPointerEnabled,
        hasKeyDown: 'onkeydown' in document,
        isFirefox: navigator.userAgent.indexOf('Firefox') > -1
    };
})();

},{}],17:[function(require,module,exports){
/*!
 * skrollr core
 *
 * Tête Chercheuse - https://github.com/tete-chercheuse/skrollr
 *
 * Free to use under terms of MIT license
 */
(function (window, document, undefined) {
	'use strict';

	var Smooth = require('smooth-scrolling');

	/*
     * Global api.
     */
	var skrollr = {
		get: function () {
			return _instance;
		},
		//Main entry point.
		init: function (options) {
			return _instance || new Skrollr(options);
		},
		VERSION: '1.1.2'
	};

	//Minify optimization.
	var hasProp = Object.prototype.hasOwnProperty;
	var Math = window.Math;
	var getStyle = window.getComputedStyle;

	//They will be filled when skrollr gets initialized.
	var documentElement;
	var documentBody;

	var SKROLLABLE_CLASS = 'skrollable';
	var SKROLLABLE_BEFORE_CLASS = SKROLLABLE_CLASS + '-before';
	var SKROLLABLE_BETWEEN_CLASS = SKROLLABLE_CLASS + '-between';
	var SKROLLABLE_AFTER_CLASS = SKROLLABLE_CLASS + '-after';
	var SKROLLABLE_DONE_CLASS = 'done';

	var SKROLLR_CLASS = 'skrollr';
	var SKROLLR_BODY_CLASS = SKROLLR_CLASS + '-body';
	var NO_SKROLLR_CLASS = 'no-' + SKROLLR_CLASS;

	var DEFAULT_EASING = 'linear';
	var DEFAULT_DURATION = 1000; //ms

	var DEFAULT_SMOOTH_SCROLLING_SPEED = 0.2;

	var ANCHOR_START = 'start';
	var ANCHOR_END = 'end';
	var ANCHOR_CENTER = 'center';
	var ANCHOR_BOTTOM = 'bottom';

	//The property which will be added to the DOM element to hold the ID of the skrollable.
	var SKROLLABLE_ID_DOM_PROPERTY = '___skrollable_id';

	var rxTrim = /^\s+|\s+$/g;

	//Find all data-attributes. data-[_constant]-[offset]-[anchor]-[anchor].
	var rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

	var rxPropValue = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;

	//Easing function names follow the property in square brackets.
	var rxPropEasing = /^(@?[a-z\-]+)\[(\w+)\]$/;

	var rxCamelCase = /-([a-z0-9_])/g;
	var rxCamelCaseFn = function (str, letter) {
		return letter.toUpperCase();
	};

	//Numeric values with optional sign.
	var rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;

	//Used to replace occurences of {?} with a number.
	var rxInterpolateString = /\{\?\}/g;

	//Finds rgb(a) colors, which don't use the percentage notation.
	var rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;

	//Finds all gradients.
	var rxGradient = /[a-z\-]+-gradient/g;

	//Vendor prefix. Will be set once skrollr gets initialized.
	var theCSSPrefix = '';
	var theDashedCSSPrefix = '';

	//Will be called once (when skrollr gets initialized).
	var detectCSSPrefix = function () {
		//Only relevant prefixes. May be extended.
		//Could be dangerous if there will ever be a CSS property which actually starts with "ms". Don't hope so.
		var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;

		//Detect prefix for current browser by finding the first property using a prefix.
		if (!getStyle) {
			return;
		}

		var style = getStyle(documentBody, null);

		for (var k in style) {
			//We check the key and if the key is a number, we check the value as well, because safari's getComputedStyle returns some weird array-like thingy.
			theCSSPrefix = k.match(rxPrefixes) || +k === k && style[k].match(rxPrefixes);

			if (theCSSPrefix) {
				break;
			}
		}

		//Did we even detect a prefix?
		if (!theCSSPrefix) {
			theCSSPrefix = theDashedCSSPrefix = '';

			return;
		}

		theCSSPrefix = theCSSPrefix[0];

		//We could have detected either a dashed prefix or this camelCaseish-inconsistent stuff.
		if (theCSSPrefix.slice(0, 1) === '-') {
			theDashedCSSPrefix = theCSSPrefix;

			//There's no logic behind these. Need a look up.
			theCSSPrefix = {
				'-webkit-': 'webkit',
				'-moz-': 'Moz',
				'-ms-': 'ms',
				'-o-': 'O'
			}[theCSSPrefix];
		} else {
			theDashedCSSPrefix = '-' + theCSSPrefix.toLowerCase() + '-';
		}
	};

	var polyfillRAF = function () {
		var requestAnimFrame = window.requestAnimationFrame || window[theCSSPrefix.toLowerCase() + 'RequestAnimationFrame'];

		var lastTime = _now();

		if (!requestAnimFrame) {
			requestAnimFrame = function (callback) {
				//How long did it take to render?
				var deltaTime = _now() - lastTime;
				var delay = Math.max(0, 1000 / 60 - deltaTime);

				return window.setTimeout(function () {
					lastTime = _now();
					callback();
				}, delay);
			};
		}

		return requestAnimFrame;
	};

	var polyfillCAF = function () {
		var cancelAnimFrame = window.cancelAnimationFrame || window[theCSSPrefix.toLowerCase() + 'CancelAnimationFrame'];

		if (!cancelAnimFrame) {
			cancelAnimFrame = function (timeout) {
				return window.clearTimeout(timeout);
			};
		}

		return cancelAnimFrame;
	};

	//Built-in easing functions.
	var easings = {
		begin: function () {
			return 0;
		},
		end: function () {
			return 1;
		},
		linear: function (p) {
			return p;
		},
		quadratic: function (p) {
			return p * p;
		},
		cubic: function (p) {
			return p * p * p;
		},
		swing: function (p) {
			return -Math.cos(p * Math.PI) / 2 + 0.5;
		},
		sqrt: function (p) {
			return Math.sqrt(p);
		},
		outCubic: function (p) {
			return Math.pow(p - 1, 3) + 1;
		},
		//see https://www.desmos.com/calculator/tbr20s8vd2 for how I did this
		bounce: function (p) {
			var a;

			if (p <= 0.5083) {
				a = 3;
			} else if (p <= 0.8489) {
				a = 9;
			} else if (p <= 0.96208) {
				a = 27;
			} else if (p <= 0.99981) {
				a = 91;
			} else {
				return 1;
			}

			return 1 - Math.abs(3 * Math.cos(p * a * 1.028) / a);
		}
	};

	/**
  * Constructor.
  */
	function Skrollr(options) {

		options = options || {};

		documentElement = options.documentElement ? document.querySelector(options.documentElement) : document.documentElement;
		documentBody = options.documentBody ? document.querySelector(options.documentBody) : options.documentElement ? documentElement : document.body;

		detectCSSPrefix();

		_instance = this;

		_constants = options.constants || {};

		//We allow defining custom easings or overwrite existing.
		if (options.easing) {
			for (var e in options.easing) {
				easings[e] = options.easing[e];
			}
		}

		_edgeStrategy = options.edgeStrategy || 'set';

		_listeners = {
			//Function to be called right before rendering.
			beforerender: options.beforerender,

			//Function to be called right after finishing rendering.
			render: options.render,

			//Function to be called whenever an element with the `data-emit-events` attribute passes a keyframe.
			keyframe: options.keyframe
		};

		//forceHeight is false by default
		_forceHeight = options.forceHeight;

		if (_forceHeight) {
			_scale = options.scale || 1;
		}

		_updateClass(documentElement, [SKROLLR_CLASS], [NO_SKROLLR_CLASS]);

		//Triggers parsing of elements and a first reflow.
		_instance.refresh();

		_addEvent(window, 'resize orientationchange', function () {
			var width = documentElement.clientWidth;
			var height = documentElement.clientHeight;

			//Only reflow if the size actually changed (#271).
			if (height !== _lastViewportHeight || width !== _lastViewportWidth) {
				_lastViewportHeight = height;
				_lastViewportWidth = width;

				_requestReflow = true;
			}
		});

		_smoothScrollingEnabled = options.smoothScroll;

		if (_smoothScrollingEnabled) {

			_updateClass(documentBody, [SKROLLR_BODY_CLASS], []);

			_smoothScrollingDuration = options.speed ? Math.max(0, Math.min(1, options.speed)) : DEFAULT_SMOOTH_SCROLLING_SPEED;

			_smoothScrolling = new Smooth.default({
				native: true,
				section: documentBody,
				ease: _smoothScrollingDuration,
				preload: false,
				callback: function () {
					_render();
				}
			});

			_smoothScrolling.init();

			_render();
		} else {

			var requestAnimFrame = polyfillRAF();

			//Let's go.
			(function skrollrLoop() {

				_animFrame = requestAnimFrame(skrollrLoop);
				_render();
			})();
		}

		return _instance;
	}

	/**
  * (Re)parses some or all elements.
  */
	Skrollr.prototype.refresh = function (elements) {
		var elementIndex;
		var elementsLength;
		var ignoreID = false;

		//Completely reparse anything without argument.
		if (elements === undefined) {
			//Ignore that some elements may already have a skrollable ID.
			ignoreID = true;

			_skrollables = [];
			_skrollableIdCounter = 0;

			elements = document.getElementsByTagName('*');
		} else if (elements.length === undefined) {
			//We also accept a single element as parameter.
			elements = [elements];
		}

		elementIndex = 0;
		elementsLength = elements.length;

		for (; elementIndex < elementsLength; elementIndex++) {
			var el = elements[elementIndex];
			var anchorTarget = el;
			var keyFrames = [];

			//The edge strategy for this particular element.
			var edgeStrategy = _edgeStrategy;

			//If this particular element should emit keyframe events.
			var emitEvents = false;

			//If we're reseting the counter, remove any old element ids that may be hanging around.
			if (ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
				delete el[SKROLLABLE_ID_DOM_PROPERTY];
			}

			if (!el.attributes) {
				continue;
			}

			//Iterate over all attributes and search for key frame attributes.
			var attributeIndex = 0;
			var attributesLength = el.attributes.length;

			for (; attributeIndex < attributesLength; attributeIndex++) {
				var attr = el.attributes[attributeIndex];

				if (attr.name === 'data-anchor-target') {
					anchorTarget = document.querySelector(attr.value);

					if (anchorTarget === null) {
						throw 'Unable to find anchor target "' + attr.value + '"';
					}

					continue;
				}

				//Global edge strategy can be overridden by the element attribute.
				if (attr.name === 'data-edge-strategy') {
					edgeStrategy = attr.value;

					continue;
				}

				//Is this element tagged with the `data-emit-events` attribute?
				if (attr.name === 'data-emit-events') {
					emitEvents = true;

					continue;
				}

				var match = attr.name.match(rxKeyframeAttribute);

				if (match === null) {
					continue;
				}

				var kf = {
					props: attr.value,
					//Point back to the element as well.
					element: el,
					//The name of the event which this keyframe will fire, if emitEvents is
					eventType: attr.name.replace(rxCamelCase, rxCamelCaseFn)
				};

				keyFrames.push(kf);

				var constant = match[1];

				if (constant) {
					//Strip the underscore prefix.
					kf.constant = constant.substr(1);
				}

				//Get the key frame offset.
				var offset = match[2];

				//Is it a percentage offset?
				if (/p$/.test(offset)) {
					kf.isPercentage = true;
					kf.offset = (offset.slice(0, -1) | 0) / 100;
				} else {
					kf.offset = offset | 0;
				}

				var anchor1 = match[3];

				//If second anchor is not set, the first will be taken for both.
				var anchor2 = match[4] || anchor1;

				//"absolute" (or "classic") mode, where numbers mean absolute scroll offset.
				if (!anchor1 || anchor1 === ANCHOR_START || anchor1 === ANCHOR_END) {
					kf.mode = 'absolute';

					//data-end needs to be calculated after all key frames are known.
					if (anchor1 === ANCHOR_END) {
						kf.isEnd = true;
					} else if (!kf.isPercentage) {
						//For data-start we can already set the key frame w/o calculations.
						//#59: "scale" options should only affect absolute mode.
						kf.offset = kf.offset * _scale;
					}
				}
				//"relative" mode, where numbers are relative to anchors.
				else {
						kf.mode = 'relative';
						kf.anchors = [anchor1, anchor2];
					}
			}

			//Does this element have key frames?
			if (!keyFrames.length) {
				continue;
			}

			//Will hold the original style and class attributes before we controlled the element (see #80).
			var styleAttr, classAttr;

			var id;

			if (!ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
				//We already have this element under control. Grab the corresponding skrollable id.
				id = el[SKROLLABLE_ID_DOM_PROPERTY];
				styleAttr = _skrollables[id].styleAttr;
				classAttr = _skrollables[id].classAttr;
			} else {
				//It's an unknown element. Asign it a new skrollable id.
				id = el[SKROLLABLE_ID_DOM_PROPERTY] = _skrollableIdCounter++;
				styleAttr = el.style.cssText;
				classAttr = _getClass(el);
			}

			_skrollables[id] = {
				element: el,
				styleAttr: styleAttr,
				classAttr: classAttr,
				anchorTarget: anchorTarget,
				keyFrames: keyFrames,
				edgeStrategy: edgeStrategy,
				emitEvents: emitEvents,
				lastFrameIndex: -1,
				done: false
			};

			_updateClass(el, [SKROLLABLE_CLASS], []);
		}

		//Reflow for the first time.
		_reflow();

		//Now that we got all key frame numbers right, actually parse the properties.
		elementIndex = 0;
		elementsLength = elements.length;

		for (; elementIndex < elementsLength; elementIndex++) {
			var sk = _skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];

			if (sk === undefined) {
				continue;
			}

			//Parse the property string to objects
			_parseProps(sk);

			//Fill key frames with missing properties from left and right
			_fillProps(sk);
		}

		return _instance;
	};

	/**
  * Transform "relative" mode to "absolute" mode.
  * That is, calculate anchor position and offset of element.
  */
	Skrollr.prototype.relativeToAbsolute = function (element, viewportAnchor, elementAnchor) {
		var viewportHeight = documentElement.clientHeight;
		var box = element.getBoundingClientRect();
		var absolute = box.top;

		//#100: IE doesn't supply "height" with getBoundingClientRect.
		var boxHeight = box.bottom - box.top;

		if (viewportAnchor === ANCHOR_BOTTOM) {
			absolute -= viewportHeight;
		} else if (viewportAnchor === ANCHOR_CENTER) {
			absolute -= viewportHeight / 2;
		}

		if (elementAnchor === ANCHOR_BOTTOM) {
			absolute += boxHeight;
		} else if (elementAnchor === ANCHOR_CENTER) {
			absolute += boxHeight / 2;
		}

		//Compensate scrolling since getBoundingClientRect is relative to viewport.
		absolute += _instance.getScrollTop();

		return absolute + 0.5 | 0;
	};

	/**
  * Animates scroll top to new position.
  */
	Skrollr.prototype.animateTo = function (top, options) {
		options = options || {};

		var now = _now();
		var scrollTop = _instance.getScrollTop();
		var duration = options.duration === undefined ? DEFAULT_DURATION : options.duration;

		//Setting this to a new value will automatically cause the current animation to stop, if any.
		_scrollAnimation = {
			startTop: scrollTop,
			topDiff: top - scrollTop,
			targetTop: top,
			duration: duration,
			startTime: now,
			endTime: now + duration,
			easing: easings[options.easing || DEFAULT_EASING],
			done: options.done
		};

		//Don't queue the animation if there's nothing to animate.
		if (!_scrollAnimation.topDiff) {
			if (_scrollAnimation.done) {
				_scrollAnimation.done.call(_instance, false);
			}

			_scrollAnimation = undefined;
		}

		return _instance;
	};

	/**
  * Stops animateTo animation.
  */
	Skrollr.prototype.stopAnimateTo = function () {
		if (_scrollAnimation && _scrollAnimation.done) {
			_scrollAnimation.done.call(_instance, true);
		}

		_scrollAnimation = undefined;
	};

	/**
  * Returns if an animation caused by animateTo is currently running.
  */
	Skrollr.prototype.isAnimatingTo = function () {
		return !!_scrollAnimation;
	};

	Skrollr.prototype.setScrollTop = function (top, force) {
		_forceRender = force === true;
		window.scrollTo(0, top);

		return _instance;
	};

	Skrollr.prototype.getScrollTop = function () {
		return _smoothScrollingEnabled ? _smoothScrolling.vars.current || 0 : window.pageYOffset || documentElement.scrollTop || documentBody.scrollTop || 0;
	};

	Skrollr.prototype.getMaxScrollTop = function () {
		return _maxKeyFrame;
	};

	Skrollr.prototype.on = function (name, fn) {
		_listeners[name] = fn;

		return _instance;
	};

	Skrollr.prototype.off = function (name) {
		delete _listeners[name];

		return _instance;
	};

	Skrollr.prototype.destroy = function () {
		var cancelAnimFrame = polyfillCAF();
		cancelAnimFrame(_animFrame);
		_removeAllEvents();

		_updateClass(documentElement, [NO_SKROLLR_CLASS], [SKROLLR_CLASS]);

		var skrollableIndex = 0;
		var skrollablesLength = _skrollables.length;

		for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
			_reset(_skrollables[skrollableIndex].element);
		}

		documentElement.style.overflow = documentBody.style.overflow = '';
		documentElement.style.height = documentBody.style.height = '';

		if (_smoothScrollingEnabled) {
			_smoothScrolling.destroy();
			_updateClass(documentBody, [], [SKROLLR_BODY_CLASS]);
			skrollr.setStyle(documentBody, 'transform', null);
		}

		_instance = undefined;
		_listeners = undefined;
		_forceHeight = undefined;
		_maxKeyFrame = 0;
		_scale = 1;
		_constants = undefined;
		_direction = 'down';
		_lastTop = -1;
		_lastViewportWidth = 0;
		_lastViewportHeight = 0;
		_requestReflow = false;
		_scrollAnimation = undefined;
		_smoothScrollingEnabled = undefined;
		_smoothScrollingDuration = undefined;
		_smoothScrolling = undefined;
		_forceRender = undefined;
		_skrollableIdCounter = 0;
		_edgeStrategy = undefined;
	};

	/*
        Private methods.
    */

	/**
  * Updates key frames which depend on others / need to be updated on resize.
  * That is "end" in "absolute" mode and all key frames in "relative" mode.
  * Also handles constants, because they may change on resize.
  */
	var _updateDependentKeyFrames = function () {
		var viewportHeight = documentElement.clientHeight;
		var processedConstants = _processConstants();
		var skrollable;
		var element;
		var anchorTarget;
		var keyFrames;
		var keyFrameIndex;
		var keyFramesLength;
		var kf;
		var skrollableIndex;
		var skrollablesLength;
		var offset;
		var constantValue;

		//First process all relative-mode elements and find the max key frame.
		skrollableIndex = 0;
		skrollablesLength = _skrollables.length;

		for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
			skrollable = _skrollables[skrollableIndex];
			element = skrollable.element;
			anchorTarget = skrollable.anchorTarget;
			keyFrames = skrollable.keyFrames;

			keyFrameIndex = 0;
			keyFramesLength = keyFrames.length;

			for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
				kf = keyFrames[keyFrameIndex];

				offset = kf.offset;
				constantValue = processedConstants[kf.constant] || 0;

				kf.frame = offset;

				if (kf.isPercentage) {
					//Convert the offset to percentage of the viewport height.
					offset = offset * viewportHeight;

					//Absolute + percentage mode.
					kf.frame = offset;
				}

				if (kf.mode === 'relative') {
					_reset(element);

					kf.frame = _instance.relativeToAbsolute(anchorTarget, kf.anchors[0], kf.anchors[1]) - offset;

					_reset(element, true);
				}

				kf.frame += constantValue;

				//Only search for max key frame when forceHeight is enabled.
				if (_forceHeight) {
					//Find the max key frame, but don't use one of the data-end ones for comparison.
					if (!kf.isEnd && kf.frame > _maxKeyFrame) {
						_maxKeyFrame = kf.frame;
					}
				}
			}
		}

		//#133: The document can be larger than the maxKeyFrame we found.
		_maxKeyFrame = Math.max(_maxKeyFrame, _getDocumentHeight());

		//Now process all data-end keyframes.
		skrollableIndex = 0;
		skrollablesLength = _skrollables.length;

		for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
			skrollable = _skrollables[skrollableIndex];
			keyFrames = skrollable.keyFrames;

			keyFrameIndex = 0;
			keyFramesLength = keyFrames.length;

			for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
				kf = keyFrames[keyFrameIndex];

				constantValue = processedConstants[kf.constant] || 0;

				if (kf.isEnd) {
					kf.frame = _maxKeyFrame - kf.offset + constantValue;
				}
			}

			skrollable.keyFrames.sort(_keyFrameComparator);
		}
	};

	/**
  * Calculates and sets the style properties for the element at the given frame.
  * @param fakeFrame The frame to render at when smooth scrolling is enabled.
  * @param actualFrame The actual frame we are at.
  */
	var _calcSteps = function (fakeFrame, actualFrame) {
		//Iterate over all skrollables.
		var skrollableIndex = 0;
		var skrollablesLength = _skrollables.length;

		for (; skrollableIndex < skrollablesLength; skrollableIndex++) {

			var skrollable = _skrollables[skrollableIndex];

			if (!skrollable.done) {

				var element = skrollable.element;
				var frame = actualFrame;
				var frames = skrollable.keyFrames;
				var framesLength = frames.length;
				var firstFrame = frames[0];
				var lastFrame = frames[frames.length - 1];
				var beforeFirst = frame < firstFrame.frame;
				var afterLast = frame > lastFrame.frame;
				var firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;
				var emitEvents = skrollable.emitEvents;
				var lastFrameIndex = skrollable.lastFrameIndex;
				var key;
				var value;

				//If we are before/after the first/last frame, set the styles according to the given edge strategy.
				if (beforeFirst || afterLast) {
					//Check if we already handled this edge case last time.
					//Note: using setScrollTop it's possible that we jumped from one edge to the other.
					if (beforeFirst && skrollable.edge === -1 || afterLast && skrollable.edge === 1) {
						continue;
					}

					//Add the skrollr-before or -after class.
					if (beforeFirst) {
						_updateClass(element, [SKROLLABLE_BEFORE_CLASS], [SKROLLABLE_AFTER_CLASS, SKROLLABLE_BETWEEN_CLASS]);

						//This handles the special case where we exit the first keyframe.
						if (emitEvents && lastFrameIndex > -1) {
							_emitEvent(element, firstFrame.eventType, _direction);
							skrollable.lastFrameIndex = -1;
						}
					} else {
						_updateClass(element, [SKROLLABLE_AFTER_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS]);

						//This handles the special case where we exit the last keyframe.
						if (emitEvents && lastFrameIndex < framesLength) {
							_emitEvent(element, lastFrame.eventType, _direction);
							skrollable.lastFrameIndex = framesLength;
						}
					}

					//Remember that we handled the edge case (before/after the first/last keyframe).
					skrollable.edge = beforeFirst ? -1 : 1;

					switch (skrollable.edgeStrategy) {
						case 'reset':
							_reset(element);
							continue;
						case 'ease':
							//Handle this case like it would be exactly at first/last keyframe and just pass it on.
							frame = firstOrLastFrame.frame;
							break;
						default:
						case 'set':
							var props = firstOrLastFrame.props;

							for (key in props) {
								if (hasProp.call(props, key)) {
									value = _interpolateString(props[key].value);

									//Set style or attribute.
									if (key.indexOf('@') === 0) {
										element.setAttribute(key.substr(1), value);

										if (afterLast && value.indexOf(SKROLLABLE_DONE_CLASS) > -1) {
											skrollable.done = true;
										}
									} else {
										skrollr.setStyle(element, key, value);
									}
								}
							}

							continue;
					}
				} else {
					//Did we handle an edge last time?
					if (skrollable.edge !== 0) {
						_updateClass(element, [SKROLLABLE_CLASS, SKROLLABLE_BETWEEN_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_AFTER_CLASS]);
						skrollable.edge = 0;
					}
				}

				//Find out between which two key frames we are right now.
				var keyFrameIndex = 0;

				for (; keyFrameIndex < framesLength - 1; keyFrameIndex++) {
					if (frame >= frames[keyFrameIndex].frame && frame <= frames[keyFrameIndex + 1].frame) {
						var left = frames[keyFrameIndex];
						var right = frames[keyFrameIndex + 1];

						for (key in left.props) {
							if (hasProp.call(left.props, key)) {
								var progress = (frame - left.frame) / (right.frame - left.frame);

								//Transform the current progress using the given easing function.
								progress = left.props[key].easing(progress);

								//Interpolate between the two values
								value = _calcInterpolation(left.props[key].value, right.props[key].value, progress);

								value = _interpolateString(value);

								//Set style or attribute.
								if (key.indexOf('@') === 0) {
									element.setAttribute(key.substr(1), value);
								} else {
									skrollr.setStyle(element, key, value);
								}
							}
						}

						//Are events enabled on this element?
						//This code handles the usual cases of scrolling through different keyframes.
						//The special cases of before first and after last keyframe are handled above.
						if (emitEvents) {
							//Did we pass a new keyframe?
							if (lastFrameIndex !== keyFrameIndex) {
								if (_direction === 'down') {
									_emitEvent(element, left.eventType, _direction);
								} else {
									_emitEvent(element, right.eventType, _direction);
								}

								skrollable.lastFrameIndex = keyFrameIndex;
							}
						}

						break;
					}
				}
			}
		}
	};

	/**
  * Renders all elements.
  */
	var _render = function () {
		if (_requestReflow) {
			_requestReflow = false;
			_reflow();
		}

		//We may render something else than the actual scrollbar position.
		var renderTop = _instance.getScrollTop();

		//If there's an animation, which ends in current render call, call the callback after rendering.
		var afterAnimationCallback;
		var now = _now();
		var progress;

		//Before actually rendering handle the scroll animation, if any.
		if (_scrollAnimation) {
			//It's over
			if (now >= _scrollAnimation.endTime) {
				renderTop = _scrollAnimation.targetTop;
				afterAnimationCallback = _scrollAnimation.done;
				_scrollAnimation = undefined;
			} else {
				//Map the current progress to the new progress using given easing function.
				progress = _scrollAnimation.easing((now - _scrollAnimation.startTime) / _scrollAnimation.duration);

				renderTop = _scrollAnimation.startTop + progress * _scrollAnimation.topDiff | 0;
			}

			_instance.setScrollTop(renderTop, true);
		}

		//Did the scroll position even change?
		if (_forceRender || _lastTop !== renderTop) {
			//Remember in which direction are we scrolling?
			_direction = renderTop > _lastTop ? 'down' : renderTop < _lastTop ? 'up' : _direction;

			_forceRender = false;

			var listenerParams = {
				curTop: renderTop,
				lastTop: _lastTop,
				maxTop: _maxKeyFrame,
				direction: _direction
			};

			//Tell the listener we are about to render.
			var continueRendering = _listeners.beforerender && _listeners.beforerender.call(_instance, listenerParams);

			//The beforerender listener function is able the cancel rendering.
			if (continueRendering !== false) {
				//Now actually interpolate all the styles.
				_calcSteps(renderTop, _instance.getScrollTop());

				//Remember when we last rendered.
				_lastTop = renderTop;

				if (_listeners.render) {
					_listeners.render.call(_instance, listenerParams);
				}
			}

			if (afterAnimationCallback) {
				afterAnimationCallback.call(_instance, false);
			}
		}

		_lastRenderCall = now;
	};

	/**
  * Parses the properties for each key frame of the given skrollable.
  */
	var _parseProps = function (skrollable) {
		//Iterate over all key frames
		var keyFrameIndex = 0;
		var keyFramesLength = skrollable.keyFrames.length;

		for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
			var frame = skrollable.keyFrames[keyFrameIndex];
			var easing;
			var value;
			var prop;
			var props = {};

			var match;

			while ((match = rxPropValue.exec(frame.props)) !== null) {
				prop = match[1];
				value = match[2];

				easing = prop.match(rxPropEasing);

				//Is there an easing specified for this prop?
				if (easing !== null) {
					prop = easing[1];
					easing = easing[2];
				} else {
					easing = DEFAULT_EASING;
				}

				//Exclamation point at first position forces the value to be taken literal.
				value = value.indexOf('!') ? _parseProp(value) : [value.slice(1)];

				//Save the prop for this key frame with his value and easing function
				props[prop] = {
					value: value,
					easing: easings[easing]
				};
			}

			frame.props = props;
		}
	};

	/**
  * Parses a value extracting numeric values and generating a format string
  * for later interpolation of the new values in old string.
  *
  * @param val The CSS value to be parsed.
  * @return Something like ["rgba(?%,?%, ?%,?)", 100, 50, 0, .7]
  * where the first element is the format string later used
  * and all following elements are the numeric value.
  */
	var _parseProp = function (val) {
		var numbers = [];

		//One special case, where floats don't work.
		//We replace all occurences of rgba colors
		//which don't use percentage notation with the percentage notation.
		rxRGBAIntegerColor.lastIndex = 0;
		val = val.replace(rxRGBAIntegerColor, function (rgba) {
			return rgba.replace(rxNumericValue, function (n) {
				return n / 255 * 100 + '%';
			});
		});

		//Handle prefixing of "gradient" values.
		//For now only the prefixed value will be set. Unprefixed isn't supported anyway.
		if (theDashedCSSPrefix) {
			rxGradient.lastIndex = 0;
			val = val.replace(rxGradient, function (s) {
				return theDashedCSSPrefix + s;
			});
		}

		//Now parse ANY number inside this string and create a format string.
		val = val.replace(rxNumericValue, function (n) {
			numbers.push(+n);
			return '{?}';
		});

		//Add the formatstring as first value.
		numbers.unshift(val);

		return numbers;
	};

	/**
  * Fills the key frames with missing left and right hand properties.
  * If key frame 1 has property X and key frame 2 is missing X,
  * but key frame 3 has X again, then we need to assign X to key frame 2 too.
  *
  * @param sk A skrollable.
  */
	var _fillProps = function (sk) {
		//Will collect the properties key frame by key frame
		var propList = {};
		var keyFrameIndex;
		var keyFramesLength;

		//Iterate over all key frames from left to right
		keyFrameIndex = 0;
		keyFramesLength = sk.keyFrames.length;

		for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
			_fillPropForFrame(sk.keyFrames[keyFrameIndex], propList);
		}

		//Now do the same from right to fill the last gaps

		propList = {};

		//Iterate over all key frames from right to left
		keyFrameIndex = sk.keyFrames.length - 1;

		for (; keyFrameIndex >= 0; keyFrameIndex--) {
			_fillPropForFrame(sk.keyFrames[keyFrameIndex], propList);
		}
	};

	var _fillPropForFrame = function (frame, propList) {
		var key;

		//For each key frame iterate over all right hand properties and assign them,
		//but only if the current key frame doesn't have the property by itself
		for (key in propList) {
			//The current frame misses this property, so assign it.
			if (!hasProp.call(frame.props, key)) {
				frame.props[key] = propList[key];
			}
		}

		//Iterate over all props of the current frame and collect them
		for (key in frame.props) {
			propList[key] = frame.props[key];
		}
	};

	/**
  * Calculates the new values for two given values array.
  */
	var _calcInterpolation = function (val1, val2, progress) {
		var valueIndex;
		var val1Length = val1.length;

		//They both need to have the same length
		if (val1Length !== val2.length) {
			throw 'Can\'t interpolate between "' + val1[0] + '" and "' + val2[0] + '"';
		}

		//Add the format string as first element.
		var interpolated = [val1[0]];

		valueIndex = 1;

		for (; valueIndex < val1Length; valueIndex++) {
			//That's the line where the two numbers are actually interpolated.
			interpolated[valueIndex] = val1[valueIndex] + (val2[valueIndex] - val1[valueIndex]) * progress;
		}

		return interpolated;
	};

	/**
  * Interpolates the numeric values into the format string.
  */
	var _interpolateString = function (val) {
		var valueIndex = 1;

		rxInterpolateString.lastIndex = 0;

		return val[0].replace(rxInterpolateString, function () {
			return val[valueIndex++];
		});
	};

	/**
  * Resets the class and style attribute to what it was before skrollr manipulated the element.
  * Also remembers the values it had before reseting, in order to undo the reset.
  */
	var _reset = function (elements, undo) {
		//We accept a single element or an array of elements.
		elements = [].concat(elements);

		var skrollable;
		var element;
		var elementsIndex = 0;
		var elementsLength = elements.length;

		for (; elementsIndex < elementsLength; elementsIndex++) {
			element = elements[elementsIndex];
			skrollable = _skrollables[element[SKROLLABLE_ID_DOM_PROPERTY]];

			//Couldn't find the skrollable for this DOM element.
			if (!skrollable) {
				continue;
			}

			if (undo) {
				//Reset class and style to the "dirty" (set by skrollr) values.
				element.style.cssText = skrollable.dirtyStyleAttr;
				_updateClass(element, skrollable.dirtyClassAttr);
			} else {
				//Remember the "dirty" (set by skrollr) class and style.
				skrollable.dirtyStyleAttr = element.style.cssText;
				skrollable.dirtyClassAttr = _getClass(element);

				//Reset class and style to what it originally was.
				element.style.cssText = skrollable.styleAttr;
				_updateClass(element, skrollable.classAttr);
			}
		}
	};

	/**
  * Set the CSS property on the given element. Sets prefixed properties as well.
  */
	skrollr.setStyle = function (el, prop, val) {
		var style = el.style;

		//Camel case.
		prop = prop.replace(rxCamelCase, rxCamelCaseFn).replace('-', '');

		//Make sure z-index gets a <integer>.
		//This is the only <integer> case we need to handle.
		if (prop === 'zIndex') {
			if (isNaN(val)) {
				//If it's not a number, don't touch it.
				//It could for example be "auto" (#351).
				style[prop] = val;
			} else {
				//Floor the number.
				style[prop] = '' + (val | 0);
			}
		}
		//#64: "float" can't be set across browsers. Needs to use "cssFloat" for all except IE.
		else if (prop === 'float') {
				style.styleFloat = style.cssFloat = val;
			} else {
				//Need try-catch for old IE.
				try {
					//Set prefixed property if there's a prefix.
					if (theCSSPrefix) {
						style[theCSSPrefix + prop.slice(0, 1).toUpperCase() + prop.slice(1)] = val;
					}

					//Set unprefixed.
					style[prop] = val;
				} catch (ignore) {}
			}
	};

	/**
  * Cross browser event handling.
  */
	var _addEvent = skrollr.addEvent = function (element, names, callback) {
		var intermediate = function (e) {
			//Normalize IE event stuff.
			e = e || window.event;

			if (!e.target) {
				e.target = e.srcElement;
			}

			if (!e.preventDefault) {
				e.preventDefault = function () {
					e.returnValue = false;
					e.defaultPrevented = true;
				};
			}

			return callback.call(this, e);
		};

		names = names.split(' ');

		var name;
		var nameCounter = 0;
		var namesLength = names.length;

		for (; nameCounter < namesLength; nameCounter++) {
			name = names[nameCounter];

			if (element.addEventListener) {
				element.addEventListener(name, callback, false);
			} else {
				element.attachEvent('on' + name, intermediate);
			}

			//Remember the events to be able to flush them later.
			_registeredEvents.push({
				element: element,
				name: name,
				listener: callback
			});
		}
	};

	var _removeEvent = skrollr.removeEvent = function (element, names, callback) {
		names = names.split(' ');

		var nameCounter = 0;
		var namesLength = names.length;

		for (; nameCounter < namesLength; nameCounter++) {
			if (element.removeEventListener) {
				element.removeEventListener(names[nameCounter], callback, false);
			} else {
				element.detachEvent('on' + names[nameCounter], callback);
			}
		}
	};

	var _removeAllEvents = function () {
		var eventData;
		var eventCounter = 0;
		var eventsLength = _registeredEvents.length;

		for (; eventCounter < eventsLength; eventCounter++) {
			eventData = _registeredEvents[eventCounter];

			_removeEvent(eventData.element, eventData.name, eventData.listener);
		}

		_registeredEvents = [];
	};

	var _emitEvent = function (element, name, direction) {
		if (_listeners.keyframe) {
			_listeners.keyframe.call(_instance, element, name, direction);
		}
	};

	var _reflow = function () {
		var pos = _instance.getScrollTop();

		//Will be recalculated by _updateDependentKeyFrames.
		_maxKeyFrame = 0;

		if (_forceHeight) {
			//un-"force" the height to not mess with the calculations in _updateDependentKeyFrames (#216).
			documentBody.style.height = '';
		}

		_updateDependentKeyFrames();

		if (_forceHeight) {
			//"force" the height.
			documentBody.style.height = _maxKeyFrame + documentElement.clientHeight + 'px';
		}

		//Remember and reset the scroll pos (#217).
		_instance.setScrollTop(pos, true);

		_forceRender = true;
	};

	/*
     * Returns a copy of the constants object where all functions and strings have been evaluated.
     */
	var _processConstants = function () {
		var viewportHeight = documentElement.clientHeight;
		var copy = {};
		var prop;
		var value;

		for (prop in _constants) {
			value = _constants[prop];

			if (typeof value === 'function') {
				value = value.call(_instance);
			}
			//Percentage offset.
			else if (/p$/.test(value)) {
					value = value.slice(0, -1) / 100 * viewportHeight;
				}

			copy[prop] = value;
		}

		return copy;
	};

	/*
     * Returns the height of the document.
     */
	var _getDocumentHeight = function () {
		var bodyHeight;

		bodyHeight = Math.max(documentBody.scrollHeight, documentBody.offsetHeight, documentElement.scrollHeight, documentElement.offsetHeight, documentElement.clientHeight);

		return bodyHeight - documentElement.clientHeight;
	};

	/**
  * Returns a string of space separated classnames for the current element.
  * Works with SVG as well.
  */
	var _getClass = function (element) {
		var prop = 'className';

		//SVG support by using className.baseVal instead of just className.
		if (window.SVGElement && element instanceof window.SVGElement) {
			element = element[prop];
			prop = 'baseVal';
		}

		return element[prop];
	};

	/**
  * Adds and removes a CSS classes.
  * Works with SVG as well.
  * add and remove are arrays of strings,
  * or if remove is ommited add is a string and overwrites all classes.
  */
	var _updateClass = function (element, add, remove) {
		var prop = 'className';

		//SVG support by using className.baseVal instead of just className.
		if (window.SVGElement && element instanceof window.SVGElement) {
			element = element[prop];
			prop = 'baseVal';
		}

		//When remove is ommited, we want to overwrite/set the classes.
		if (remove === undefined) {
			element[prop] = add;
			return;
		}

		//Cache current classes. We will work on a string before passing back to DOM.
		var val = element[prop];

		//All classes to be removed.
		var classRemoveIndex = 0;
		var removeLength = remove.length;

		for (; classRemoveIndex < removeLength; classRemoveIndex++) {
			val = _untrim(val).replace(_untrim(remove[classRemoveIndex]), ' ');
		}

		val = _trim(val);

		//All classes to be added.
		var classAddIndex = 0;
		var addLength = add.length;

		for (; classAddIndex < addLength; classAddIndex++) {
			//Only add if el not already has class.
			if (_untrim(val).indexOf(_untrim(add[classAddIndex])) === -1) {
				val += ' ' + add[classAddIndex];
			}
		}

		element[prop] = _trim(val);
	};

	var _trim = function (a) {
		return a.replace(rxTrim, '');
	};

	/**
  * Adds a space before and after the string.
  */
	var _untrim = function (a) {
		return ' ' + a + ' ';
	};

	var _now = Date.now || function () {
		return +new Date();
	};

	var _keyFrameComparator = function (a, b) {
		return a.frame - b.frame;
	};

	/*
     * Private variables.
     */

	//Singleton
	var _instance;

	/*
        A list of all elements which should be animated associated with their the metadata.
        Exmaple skrollable with two key frames animating from 100px width to 20px:
         skrollable = {
            element: <the DOM element>,
            styleAttr: <style attribute of the element before skrollr>,
            classAttr: <class attribute of the element before skrollr>,
            keyFrames: [
                {
                    frame: 100,
                    props: {
                        width: {
                            value: ['{?}px', 100],
                            easing: <reference to easing function>
                        }
                    },
                    mode: "absolute"
                },
                {
                    frame: 200,
                    props: {
                        width: {
                            value: ['{?}px', 20],
                            easing: <reference to easing function>
                        }
                    },
                    mode: "absolute"
                }
            ]
        };
    */
	var _skrollables;

	var _listeners;
	var _forceHeight;
	var _maxKeyFrame = 0;

	var _scale = 1;
	var _constants;

	//Current direction (up/down).
	var _direction = 'down';

	//The last top offset value. Needed to determine direction.
	var _lastTop = -1;

	//The last time we called the render method (doesn't mean we rendered!).
	var _lastRenderCall = _now();

	//For detecting if it actually resized (#271).
	var _lastViewportWidth = 0;
	var _lastViewportHeight = 0;

	var _requestReflow = false;

	//Will contain data about a running scrollbar animation, if any.
	var _scrollAnimation;

	var _smoothScrollingEnabled;

	var _smoothScrollingDuration;

	//Will contain settins for smooth scrolling if enabled.
	//var _smoothScrolling;
	var _smoothScrolling;

	//Can be set by any operation/event to force rendering even if the scrollbar didn't move.
	var _forceRender;

	//Each skrollable gets an unique ID incremented for each skrollable.
	//The ID is the index in the _skrollables array.
	var _skrollableIdCounter = 0;

	var _edgeStrategy;

	//Will contain data about registered events by skrollr.
	var _registeredEvents = [];

	//Animation frame id returned by RequestAnimationFrame (or timeout when RAF is not supported).
	var _animFrame;

	//Expose skrollr as either a global variable or a require.js module.
	if (typeof define === 'function' && define.amd) {
		define([], function () {
			return skrollr;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = skrollr;
	}

	window.skrollr = skrollr;
})(window, document);

},{"smooth-scrolling":9}]},{},[17]);
