/*!
 * Bootstrap
 * Copyright 2011-2016
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
  }
}(jQuery);


+function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Util = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Private TransitionEnd Helpers
  * ------------------------------------------------------------------------
  */

	var transition = false;

	var MAX_UID = 1000000;

	var TransitionEndEvent = {
		WebkitTransition: 'webkitTransitionEnd',
		MozTransition: 'transitionend',
		OTransition: 'oTransitionEnd otransitionend',
		transition: 'transitionend'

		// shoutout AngusCroll (https://goo.gl/pxwQGp)
	};function toType(obj) {
		return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}

	function isElement(obj) {
		return (obj[0] || obj).nodeType;
	}

	function getSpecialTransitionEndEvent() {
		return {
			bindType: transition.end,
			delegateType: transition.end,
			handle: function handle(event) {
				if ($(event.target).is(this)) {
					return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
				}
				return undefined;
			}
		};
	}

	function transitionEndTest() {
		if (window.QUnit) {
			return false;
		}

		var el = document.createElement('bootstrap');

		for (var name in TransitionEndEvent) {
			if (el.style[name] !== undefined) {
				return {
					end: TransitionEndEvent[name]
				};
			}
		}

		return false;
	}

	function transitionEndEmulator(duration) {
		var _this = this;

		var called = false;

		$(this).one(Util.TRANSITION_END, function () {
			called = true;
		});

		setTimeout(function () {
			if (!called) {
				Util.triggerTransitionEnd(_this);
			}
		}, duration);

		return this;
	}

	function setTransitionEndSupport() {
		transition = transitionEndTest();

		$.fn.emulateTransitionEnd = transitionEndEmulator;

		if (Util.supportsTransitionEnd()) {
			$.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
		}
	}

	/**
  * --------------------------------------------------------------------------
  * Public Util Api
  * --------------------------------------------------------------------------
  */

	var Util = {

		TRANSITION_END: 'bsTransitionEnd',

		getUID: function getUID(prefix) {
			do {
				// eslint-disable-next-line no-bitwise
				prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
			} while (document.getElementById(prefix));
			return prefix;
		},
		getSelectorFromElement: function getSelectorFromElement(element) {
			var selector = element.getAttribute('data-target');
			if (!selector || selector === '#') {
				selector = element.getAttribute('href') || '';
			}

			try {
				var $selector = $(selector);
				return $selector.length > 0 ? selector : null;
			} catch (error) {
				return null;
			}
		},
		reflow: function reflow(element) {
			return element.offsetHeight;
		},
		triggerTransitionEnd: function triggerTransitionEnd(element) {
			$(element).trigger(transition.end);
		},
		supportsTransitionEnd: function supportsTransitionEnd() {
			return Boolean(transition);
		},
		typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
			for (var property in configTypes) {
				if (configTypes.hasOwnProperty(property)) {
					var expectedTypes = configTypes[property];
					var value = config[property];
					var valueType = value && isElement(value) ? 'element' : toType(value);

					if (!new RegExp(expectedTypes).test(valueType)) {
						throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
					}
				}
			}
		}
	};

	setTransitionEndSupport();

	return Util;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Alert = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'alert';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.alert';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var TRANSITION_DURATION = 150;

	var Selector = {
		DISMISS: '[data-dismiss="alert"]'
	};

	var Event = {
		CLOSE: 'close' + EVENT_KEY,
		CLOSED: 'closed' + EVENT_KEY,
		CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
	};

	var ClassName = {
		ALERT: 'alert',
		FADE: 'fade',
		SHOW: 'show'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Alert = function () {
		function Alert(element) {
			_classCallCheck(this, Alert);

			this._element = element;
		}

		// getters

		_createClass(Alert, [{
			key: 'close',


			// public

			value: function close(element) {
				element = element || this._element;

				var rootElement = this._getRootElement(element);
				var customEvent = this._triggerCloseEvent(rootElement);

				if (customEvent.isDefaultPrevented()) {
					return;
				}

				this._removeElement(rootElement);
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$.removeData(this._element, DATA_KEY);
				this._element = null;
			}

			// private

		}, {
			key: '_getRootElement',
			value: function _getRootElement(element) {
				var selector = Util.getSelectorFromElement(element);
				var parent = false;

				if (selector) {
					parent = $(selector)[0];
				}

				if (!parent) {
					parent = $(element).closest('.' + ClassName.ALERT)[0];
				}

				return parent;
			}
		}, {
			key: '_triggerCloseEvent',
			value: function _triggerCloseEvent(element) {
				var closeEvent = $.Event(Event.CLOSE);

				$(element).trigger(closeEvent);
				return closeEvent;
			}
		}, {
			key: '_removeElement',
			value: function _removeElement(element) {
				var _this2 = this;

				$(element).removeClass(ClassName.SHOW);

				if (!Util.supportsTransitionEnd() || !$(element).hasClass(ClassName.FADE)) {
					this._destroyElement(element);
					return;
				}

				$(element).one(Util.TRANSITION_END, function (event) {
					return _this2._destroyElement(element, event);
				}).emulateTransitionEnd(TRANSITION_DURATION);
			}
		}, {
			key: '_destroyElement',
			value: function _destroyElement(element) {
				$(element).detach().trigger(Event.CLOSED).remove();
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var $element = $(this);
					var data = $element.data(DATA_KEY);

					if (!data) {
						data = new Alert(this);
						$element.data(DATA_KEY, data);
					}

					if (config === 'close') {
						data[config](this);
					}
				});
			}
		}, {
			key: '_handleDismiss',
			value: function _handleDismiss(alertInstance) {
				return function (event) {
					if (event) {
						event.preventDefault();
					}

					alertInstance.close(this);
				};
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}]);

		return Alert;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Alert._jQueryInterface;
	$.fn[NAME].Constructor = Alert;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Alert._jQueryInterface;
	};

	return Alert;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Button = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'button';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.button';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];

	var ClassName = {
		ACTIVE: 'active',
		BUTTON: 'btn',
		FOCUS: 'focus'
	};

	var Selector = {
		DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
		DATA_TOGGLE: '[data-toggle="buttons"]',
		INPUT: 'input',
		ACTIVE: '.active',
		BUTTON: '.btn'
	};

	var Event = {
		CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
		FOCUS_BLUR_DATA_API: 'focus' + EVENT_KEY + DATA_API_KEY + ' ' + ('blur' + EVENT_KEY + DATA_API_KEY)

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Button = function () {
		function Button(element) {
			_classCallCheck(this, Button);

			this._element = element;
		}

		// getters

		_createClass(Button, [{
			key: 'toggle',


			// public

			value: function toggle() {
				var triggerChangeEvent = true;
				var addAriaPressed = true;
				var rootElement = $(this._element).closest(Selector.DATA_TOGGLE)[0];

				if (rootElement) {
					var input = $(this._element).find(Selector.INPUT)[0];

					if (input) {
						if (input.type === 'radio') {
							if (input.checked && $(this._element).hasClass(ClassName.ACTIVE)) {
								triggerChangeEvent = false;
							} else {
								var activeElement = $(rootElement).find(Selector.ACTIVE)[0];

								if (activeElement) {
									$(activeElement).removeClass(ClassName.ACTIVE);
								}
							}
						}

						if (triggerChangeEvent) {
							if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
								return;
							}
							input.checked = !$(this._element).hasClass(ClassName.ACTIVE);
							$(input).trigger('change');
						}

						input.focus();
						addAriaPressed = false;
					}
				}

				if (addAriaPressed) {
					this._element.setAttribute('aria-pressed', !$(this._element).hasClass(ClassName.ACTIVE));
				}

				if (triggerChangeEvent) {
					$(this._element).toggleClass(ClassName.ACTIVE);
				}
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$.removeData(this._element, DATA_KEY);
				this._element = null;
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var data = $(this).data(DATA_KEY);

					if (!data) {
						data = new Button(this);
						$(this).data(DATA_KEY, data);
					}

					if (config === 'toggle') {
						data[config]();
					}
				});
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}]);

		return Button;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
		event.preventDefault();

		var button = event.target;

		if (!$(button).hasClass(ClassName.BUTTON)) {
			button = $(button).closest(Selector.BUTTON);
		}

		Button._jQueryInterface.call($(button), 'toggle');
	}).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
		var button = $(event.target).closest(Selector.BUTTON)[0];
		$(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
	});

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Button._jQueryInterface;
	$.fn[NAME].Constructor = Button;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Button._jQueryInterface;
	};

	return Button;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Carousel = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'carousel';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.carousel';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var TRANSITION_DURATION = 600;
	var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key
	var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key
	var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

	var Default = {
		interval: 5000,
		keyboard: true,
		slide: false,
		pause: 'hover',
		wrap: true
	};

	var DefaultType = {
		interval: '(number|boolean)',
		keyboard: 'boolean',
		slide: '(boolean|string)',
		pause: '(string|boolean)',
		wrap: 'boolean'
	};

	var Direction = {
		NEXT: 'next',
		PREV: 'prev',
		LEFT: 'left',
		RIGHT: 'right'
	};

	var Event = {
		SLIDE: 'slide' + EVENT_KEY,
		SLID: 'slid' + EVENT_KEY,
		KEYDOWN: 'keydown' + EVENT_KEY,
		MOUSEENTER: 'mouseenter' + EVENT_KEY,
		MOUSELEAVE: 'mouseleave' + EVENT_KEY,
		TOUCHEND: 'touchend' + EVENT_KEY,
		LOAD_DATA_API: 'load' + EVENT_KEY + DATA_API_KEY,
		CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
	};

	var ClassName = {
		CAROUSEL: 'carousel',
		ACTIVE: 'active',
		SLIDE: 'slide',
		RIGHT: 'carousel-item-right',
		LEFT: 'carousel-item-left',
		NEXT: 'carousel-item-next',
		PREV: 'carousel-item-prev',
		ITEM: 'carousel-item'
	};

	var Selector = {
		ACTIVE: '.active',
		ACTIVE_ITEM: '.active.carousel-item',
		ITEM: '.carousel-item',
		NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
		INDICATORS: '.carousel-indicators',
		DATA_SLIDE: '[data-slide], [data-slide-to]',
		DATA_RIDE: '[data-ride="carousel"]'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Carousel = function () {
		function Carousel(element, config) {
			_classCallCheck(this, Carousel);

			this._items = null;
			this._interval = null;
			this._activeElement = null;

			this._isPaused = false;
			this._isSliding = false;

			this.touchTimeout = null;

			this._config = this._getConfig(config);
			this._element = $(element)[0];
			this._indicatorsElement = $(this._element).find(Selector.INDICATORS)[0];

			this._addEventListeners();
		}

		// getters

		_createClass(Carousel, [{
			key: 'next',


			// public

			value: function next() {
				if (!this._isSliding) {
					this._slide(Direction.NEXT);
				}
			}
		}, {
			key: 'nextWhenVisible',
			value: function nextWhenVisible() {
				// Don't call next when the page isn't visible
				if (!document.hidden) {
					this.next();
				}
			}
		}, {
			key: 'prev',
			value: function prev() {
				if (!this._isSliding) {
					this._slide(Direction.PREV);
				}
			}
		}, {
			key: 'pause',
			value: function pause(event) {
				if (!event) {
					this._isPaused = true;
				}

				if ($(this._element).find(Selector.NEXT_PREV)[0] && Util.supportsTransitionEnd()) {
					Util.triggerTransitionEnd(this._element);
					this.cycle(true);
				}

				clearInterval(this._interval);
				this._interval = null;
			}
		}, {
			key: 'cycle',
			value: function cycle(event) {
				if (!event) {
					this._isPaused = false;
				}

				if (this._interval) {
					clearInterval(this._interval);
					this._interval = null;
				}

				if (this._config.interval && !this._isPaused) {
					this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
				}
			}
		}, {
			key: 'to',
			value: function to(index) {
				var _this3 = this;

				this._activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];

				var activeIndex = this._getItemIndex(this._activeElement);

				if (index > this._items.length - 1 || index < 0) {
					return;
				}

				if (this._isSliding) {
					$(this._element).one(Event.SLID, function () {
						return _this3.to(index);
					});
					return;
				}

				if (activeIndex === index) {
					this.pause();
					this.cycle();
					return;
				}

				var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

				this._slide(direction, this._items[index]);
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$(this._element).off(EVENT_KEY);
				$.removeData(this._element, DATA_KEY);

				this._items = null;
				this._config = null;
				this._element = null;
				this._interval = null;
				this._isPaused = null;
				this._isSliding = null;
				this._activeElement = null;
				this._indicatorsElement = null;
			}

			// private

		}, {
			key: '_getConfig',
			value: function _getConfig(config) {
				config = $.extend({}, Default, config);
				Util.typeCheckConfig(NAME, config, DefaultType);
				return config;
			}
		}, {
			key: '_addEventListeners',
			value: function _addEventListeners() {
				var _this4 = this;

				if (this._config.keyboard) {
					$(this._element).on(Event.KEYDOWN, function (event) {
						return _this4._keydown(event);
					});
				}

				if (this._config.pause === 'hover') {
					$(this._element).on(Event.MOUSEENTER, function (event) {
						return _this4.pause(event);
					}).on(Event.MOUSELEAVE, function (event) {
						return _this4.cycle(event);
					});
					if ('ontouchstart' in document.documentElement) {
						// if it's a touch-enabled device, mouseenter/leave are fired as
						// part of the mouse compatibility events on first tap - the carousel
						// would stop cycling until user tapped out of it;
						// here, we listen for touchend, explicitly pause the carousel
						// (as if it's the second time we tap on it, mouseenter compat event
						// is NOT fired) and after a timeout (to allow for mouse compatibility
						// events to fire) we explicitly restart cycling
						$(this._element).on(Event.TOUCHEND, function () {
							_this4.pause();
							if (_this4.touchTimeout) {
								clearTimeout(_this4.touchTimeout);
							}
							_this4.touchTimeout = setTimeout(function (event) {
								return _this4.cycle(event);
							}, TOUCHEVENT_COMPAT_WAIT + _this4._config.interval);
						});
					}
				}
			}
		}, {
			key: '_keydown',
			value: function _keydown(event) {
				if (/input|textarea/i.test(event.target.tagName)) {
					return;
				}

				switch (event.which) {
					case ARROW_LEFT_KEYCODE:
						event.preventDefault();
						this.prev();
						break;
					case ARROW_RIGHT_KEYCODE:
						event.preventDefault();
						this.next();
						break;
					default:
						return;
				}
			}
		}, {
			key: '_getItemIndex',
			value: function _getItemIndex(element) {
				this._items = $.makeArray($(element).parent().find(Selector.ITEM));
				return this._items.indexOf(element);
			}
		}, {
			key: '_getItemByDirection',
			value: function _getItemByDirection(direction, activeElement) {
				var isNextDirection = direction === Direction.NEXT;
				var isPrevDirection = direction === Direction.PREV;
				var activeIndex = this._getItemIndex(activeElement);
				var lastItemIndex = this._items.length - 1;
				var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

				if (isGoingToWrap && !this._config.wrap) {
					return activeElement;
				}

				var delta = direction === Direction.PREV ? -1 : 1;
				var itemIndex = (activeIndex + delta) % this._items.length;

				return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
			}
		}, {
			key: '_triggerSlideEvent',
			value: function _triggerSlideEvent(relatedTarget, eventDirectionName) {
				var targetIndex = this._getItemIndex(relatedTarget);
				var fromIndex = this._getItemIndex($(this._element).find(Selector.ACTIVE_ITEM)[0]);
				var slideEvent = $.Event(Event.SLIDE, {
					relatedTarget: relatedTarget,
					direction: eventDirectionName,
					from: fromIndex,
					to: targetIndex
				});

				$(this._element).trigger(slideEvent);

				return slideEvent;
			}
		}, {
			key: '_setActiveIndicatorElement',
			value: function _setActiveIndicatorElement(element) {
				if (this._indicatorsElement) {
					$(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);

					var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

					if (nextIndicator) {
						$(nextIndicator).addClass(ClassName.ACTIVE);
					}
				}
			}
		}, {
			key: '_slide',
			value: function _slide(direction, element) {
				var _this5 = this;

				var activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];
				var activeElementIndex = this._getItemIndex(activeElement);
				var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);
				var nextElementIndex = this._getItemIndex(nextElement);
				var isCycling = Boolean(this._interval);

				var directionalClassName = void 0;
				var orderClassName = void 0;
				var eventDirectionName = void 0;

				if (direction === Direction.NEXT) {
					directionalClassName = ClassName.LEFT;
					orderClassName = ClassName.NEXT;
					eventDirectionName = Direction.LEFT;
				} else {
					directionalClassName = ClassName.RIGHT;
					orderClassName = ClassName.PREV;
					eventDirectionName = Direction.RIGHT;
				}

				if (nextElement && $(nextElement).hasClass(ClassName.ACTIVE)) {
					this._isSliding = false;
					return;
				}

				var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
				if (slideEvent.isDefaultPrevented()) {
					return;
				}

				if (!activeElement || !nextElement) {
					// some weirdness is happening, so we bail
					return;
				}

				this._isSliding = true;

				if (isCycling) {
					this.pause();
				}

				this._setActiveIndicatorElement(nextElement);

				var slidEvent = $.Event(Event.SLID, {
					relatedTarget: nextElement,
					direction: eventDirectionName,
					from: activeElementIndex,
					to: nextElementIndex
				});

				if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.SLIDE)) {

					$(nextElement).addClass(orderClassName);

					Util.reflow(nextElement);

					$(activeElement).addClass(directionalClassName);
					$(nextElement).addClass(directionalClassName);

					$(activeElement).one(Util.TRANSITION_END, function () {
						$(nextElement).removeClass(directionalClassName + ' ' + orderClassName).addClass(ClassName.ACTIVE);

						$(activeElement).removeClass(ClassName.ACTIVE + ' ' + orderClassName + ' ' + directionalClassName);

						_this5._isSliding = false;

						setTimeout(function () {
							return $(_this5._element).trigger(slidEvent);
						}, 0);
					}).emulateTransitionEnd(TRANSITION_DURATION);
				} else {
					$(activeElement).removeClass(ClassName.ACTIVE);
					$(nextElement).addClass(ClassName.ACTIVE);

					this._isSliding = false;
					$(this._element).trigger(slidEvent);
				}

				if (isCycling) {
					this.cycle();
				}
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var data = $(this).data(DATA_KEY);
					var _config = $.extend({}, Default, $(this).data());

					if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
						$.extend(_config, config);
					}

					var action = typeof config === 'string' ? config : _config.slide;

					if (!data) {
						data = new Carousel(this, _config);
						$(this).data(DATA_KEY, data);
					}

					if (typeof config === 'number') {
						data.to(config);
					} else if (typeof action === 'string') {
						if (data[action] === undefined) {
							throw new Error('No method named "' + action + '"');
						}
						data[action]();
					} else if (_config.interval) {
						data.pause();
						data.cycle();
					}
				});
			}
		}, {
			key: '_dataApiClickHandler',
			value: function _dataApiClickHandler(event) {
				var selector = Util.getSelectorFromElement(this);

				if (!selector) {
					return;
				}

				var target = $(selector)[0];

				if (!target || !$(target).hasClass(ClassName.CAROUSEL)) {
					return;
				}

				var config = $.extend({}, $(target).data(), $(this).data());
				var slideIndex = this.getAttribute('data-slide-to');

				if (slideIndex) {
					config.interval = false;
				}

				Carousel._jQueryInterface.call($(target), config);

				if (slideIndex) {
					$(target).data(DATA_KEY).to(slideIndex);
				}

				event.preventDefault();
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}, {
			key: 'Default',
			get: function get() {
				return Default;
			}
		}]);

		return Carousel;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(document).on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler);

	$(window).on(Event.LOAD_DATA_API, function () {
		$(Selector.DATA_RIDE).each(function () {
			var $carousel = $(this);
			Carousel._jQueryInterface.call($carousel, $carousel.data());
		});
	});

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Carousel._jQueryInterface;
	$.fn[NAME].Constructor = Carousel;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Carousel._jQueryInterface;
	};

	return Carousel;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Collapse = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'collapse';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.collapse';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var TRANSITION_DURATION = 600;

	var Default = {
		toggle: true,
		parent: ''
	};

	var DefaultType = {
		toggle: 'boolean',
		parent: 'string'
	};

	var Event = {
		SHOW: 'show' + EVENT_KEY,
		SHOWN: 'shown' + EVENT_KEY,
		HIDE: 'hide' + EVENT_KEY,
		HIDDEN: 'hidden' + EVENT_KEY,
		CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
	};

	var ClassName = {
		SHOW: 'show',
		COLLAPSE: 'collapse',
		COLLAPSING: 'collapsing',
		COLLAPSED: 'collapsed'
	};

	var Dimension = {
		WIDTH: 'width',
		HEIGHT: 'height'
	};

	var Selector = {
		ACTIVES: '.show, .collapsing',
		DATA_TOGGLE: '[data-toggle="collapse"]'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Collapse = function () {
		function Collapse(element, config) {
			_classCallCheck(this, Collapse);

			this._isTransitioning = false;
			this._element = element;
			this._config = this._getConfig(config);
			this._triggerArray = $.makeArray($('[data-toggle="collapse"][href="#' + element.id + '"],' + ('[data-toggle="collapse"][data-target="#' + element.id + '"]')));
			var tabToggles = $(Selector.DATA_TOGGLE);
			for (var i = 0; i < tabToggles.length; i++) {
				var elem = tabToggles[i];
				var selector = Util.getSelectorFromElement(elem);
				if (selector !== null && $(selector).filter(element).length > 0) {
					this._triggerArray.push(elem);
				}
			}

			this._parent = this._config.parent ? this._getParent() : null;

			if (!this._config.parent) {
				this._addAriaAndCollapsedClass(this._element, this._triggerArray);
			}

			if (this._config.toggle) {
				this.toggle();
			}
		}

		// getters

		_createClass(Collapse, [{
			key: 'toggle',


			// public

			value: function toggle() {
				if ($(this._element).hasClass(ClassName.SHOW)) {
					this.hide();
				} else {
					this.show();
				}
			}
		}, {
			key: 'show',
			value: function show() {
				var _this6 = this;

				if (this._isTransitioning || $(this._element).hasClass(ClassName.SHOW)) {
					return;
				}

				var actives = void 0;
				var activesData = void 0;

				if (this._parent) {
					actives = $.makeArray($(this._parent).children().children(Selector.ACTIVES));
					if (!actives.length) {
						actives = null;
					}
				}

				if (actives) {
					activesData = $(actives).data(DATA_KEY);
					if (activesData && activesData._isTransitioning) {
						return;
					}
				}

				var startEvent = $.Event(Event.SHOW);
				$(this._element).trigger(startEvent);
				if (startEvent.isDefaultPrevented()) {
					return;
				}

				if (actives) {
					Collapse._jQueryInterface.call($(actives), 'hide');
					if (!activesData) {
						$(actives).data(DATA_KEY, null);
					}
				}

				var dimension = this._getDimension();

				$(this._element).removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING);

				this._element.style[dimension] = 0;

				if (this._triggerArray.length) {
					$(this._triggerArray).removeClass(ClassName.COLLAPSED).attr('aria-expanded', true);
				}

				this.setTransitioning(true);

				var complete = function complete() {
					$(_this6._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).addClass(ClassName.SHOW);

					_this6._element.style[dimension] = '';

					_this6.setTransitioning(false);

					$(_this6._element).trigger(Event.SHOWN);
				};

				if (!Util.supportsTransitionEnd()) {
					complete();
					return;
				}

				var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
				var scrollSize = 'scroll' + capitalizedDimension;

				$(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);

				this._element.style[dimension] = this._element[scrollSize] + 'px';
			}
		}, {
			key: 'hide',
			value: function hide() {
				var _this7 = this;

				if (this._isTransitioning || !$(this._element).hasClass(ClassName.SHOW)) {
					return;
				}

				var startEvent = $.Event(Event.HIDE);
				$(this._element).trigger(startEvent);
				if (startEvent.isDefaultPrevented()) {
					return;
				}

				var dimension = this._getDimension();

				this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + 'px';

				Util.reflow(this._element);

				$(this._element).addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);

				if (this._triggerArray.length) {
					for (var i = 0; i < this._triggerArray.length; i++) {
						var trigger = this._triggerArray[i];
						var selector = Util.getSelectorFromElement(trigger);
						if (selector !== null) {
							var $elem = $(selector);
							if (!$elem.hasClass(ClassName.SHOW)) {
								$(trigger).addClass(ClassName.COLLAPSED).attr('aria-expanded', false);
							}
						}
					}
				}

				this.setTransitioning(true);

				var complete = function complete() {
					_this7.setTransitioning(false);
					$(_this7._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).trigger(Event.HIDDEN);
				};

				this._element.style[dimension] = '';

				if (!Util.supportsTransitionEnd()) {
					complete();
					return;
				}

				$(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
			}
		}, {
			key: 'setTransitioning',
			value: function setTransitioning(isTransitioning) {
				this._isTransitioning = isTransitioning;
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$.removeData(this._element, DATA_KEY);

				this._config = null;
				this._parent = null;
				this._element = null;
				this._triggerArray = null;
				this._isTransitioning = null;
			}

			// private

		}, {
			key: '_getConfig',
			value: function _getConfig(config) {
				config = $.extend({}, Default, config);
				config.toggle = Boolean(config.toggle); // coerce string values
				Util.typeCheckConfig(NAME, config, DefaultType);
				return config;
			}
		}, {
			key: '_getDimension',
			value: function _getDimension() {
				var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
				return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
			}
		}, {
			key: '_getParent',
			value: function _getParent() {
				var _this8 = this;

				var parent = $(this._config.parent)[0];
				var selector = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]';

				$(parent).find(selector).each(function (i, element) {
					_this8._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
				});

				return parent;
			}
		}, {
			key: '_addAriaAndCollapsedClass',
			value: function _addAriaAndCollapsedClass(element, triggerArray) {
				if (element) {
					var isOpen = $(element).hasClass(ClassName.SHOW);

					if (triggerArray.length) {
						$(triggerArray).toggleClass(ClassName.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
					}
				}
			}

			// static

		}], [{
			key: '_getTargetFromElement',
			value: function _getTargetFromElement(element) {
				var selector = Util.getSelectorFromElement(element);
				return selector ? $(selector)[0] : null;
			}
		}, {
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var $this = $(this);
					var data = $this.data(DATA_KEY);
					var _config = $.extend({}, Default, $this.data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

					if (!data && _config.toggle && /show|hide/.test(config)) {
						_config.toggle = false;
					}

					if (!data) {
						data = new Collapse(this, _config);
						$this.data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config]();
					}
				});
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}, {
			key: 'Default',
			get: function get() {
				return Default;
			}
		}]);

		return Collapse;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
		if (!/input|textarea/i.test(event.target.tagName)) {
			event.preventDefault();
		}

		var $trigger = $(this);
		var selector = Util.getSelectorFromElement(this);
		$(selector).each(function () {
			var $target = $(this);
			var data = $target.data(DATA_KEY);
			var config = data ? 'toggle' : $trigger.data();
			Collapse._jQueryInterface.call($target, config);
		});
	});

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Collapse._jQueryInterface;
	$.fn[NAME].Constructor = Collapse;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Collapse._jQueryInterface;
	};

	return Collapse;
}(jQuery);

/* global Popper */

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Dropdown = function ($) {

	/**
  * Check for Popper dependency
  * Popper - https://popper.js.org
  */
	if (typeof Popper === 'undefined') {
		throw new Error('Bootstrap dropdown require Popper.js (https://popper.js.org)');
	}

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'dropdown';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.dropdown';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key
	var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
	var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
	var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
	var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
	var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
	var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + '|' + ARROW_DOWN_KEYCODE + '|' + ESCAPE_KEYCODE);

	var Event = {
		HIDE: 'hide' + EVENT_KEY,
		HIDDEN: 'hidden' + EVENT_KEY,
		SHOW: 'show' + EVENT_KEY,
		SHOWN: 'shown' + EVENT_KEY,
		CLICK: 'click' + EVENT_KEY,
		CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
		KEYDOWN_DATA_API: 'keydown' + EVENT_KEY + DATA_API_KEY,
		KEYUP_DATA_API: 'keyup' + EVENT_KEY + DATA_API_KEY
	};

	var ClassName = {
		DISABLED: 'disabled',
		SHOW: 'show',
		DROPUP: 'dropup',
		MENURIGHT: 'dropdown-menu-right',
		MENULEFT: 'dropdown-menu-left'
	};

	var Selector = {
		DATA_TOGGLE: '[data-toggle="dropdown"]',
		FORM_CHILD: '.dropdown form',
		MENU: '.dropdown-menu',
		NAVBAR_NAV: '.navbar-nav',
		VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
	};

	var AttachmentMap = {
		TOP: 'top-start',
		TOPEND: 'top-end',
		BOTTOM: 'bottom-start',
		BOTTOMEND: 'bottom-end'
	};

	var Default = {
		placement: AttachmentMap.BOTTOM,
		offset: 0,
		flip: true
	};

	var DefaultType = {
		placement: 'string',
		offset: '(number|string)',
		flip: 'boolean'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Dropdown = function () {
		function Dropdown(element, config) {
			_classCallCheck(this, Dropdown);

			this._element = element;
			this._popper = null;
			this._config = this._getConfig(config);
			this._menu = this._getMenuElement();
			this._inNavbar = this._detectNavbar();

			this._addEventListeners();
		}

		// getters

		_createClass(Dropdown, [{
			key: 'toggle',


			// public

			value: function toggle() {
				if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED)) {
					return;
				}

				var parent = Dropdown._getParentFromElement(this._element);
				var isActive = $(this._menu).hasClass(ClassName.SHOW);

				Dropdown._clearMenus();

				if (isActive) {
					return;
				}

				var relatedTarget = {
					relatedTarget: this._element
				};
				var showEvent = $.Event(Event.SHOW, relatedTarget);

				$(parent).trigger(showEvent);

				if (showEvent.isDefaultPrevented()) {
					return;
				}

				var element = this._element;
				// for dropup with alignment we use the parent as popper container
				if ($(parent).hasClass(ClassName.DROPUP)) {
					if ($(this._menu).hasClass(ClassName.MENULEFT) || $(this._menu).hasClass(ClassName.MENURIGHT)) {
						element = parent;
					}
				}
				this._popper = new Popper(element, this._menu, this._getPopperConfig());

				// if this is a touch-enabled device we add extra
				// empty mouseover listeners to the body's immediate children;
				// only needed because of broken event delegation on iOS
				// https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
				if ('ontouchstart' in document.documentElement && !$(parent).closest(Selector.NAVBAR_NAV).length) {
					$('body').children().on('mouseover', null, $.noop);
				}

				this._element.focus();
				this._element.setAttribute('aria-expanded', true);

				$(this._menu).toggleClass(ClassName.SHOW);
				$(parent).toggleClass(ClassName.SHOW).trigger($.Event(Event.SHOWN, relatedTarget));
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$.removeData(this._element, DATA_KEY);
				$(this._element).off(EVENT_KEY);
				this._element = null;
				this._menu = null;
				if (this._popper !== null) {
					this._popper.destroy();
				}
				this._popper = null;
			}
		}, {
			key: 'update',
			value: function update() {
				this._inNavbar = this._detectNavbar();
				if (this._popper !== null) {
					this._popper.scheduleUpdate();
				}
			}

			// private

		}, {
			key: '_addEventListeners',
			value: function _addEventListeners() {
				var _this9 = this;

				$(this._element).on(Event.CLICK, function (event) {
					event.preventDefault();
					event.stopPropagation();
					_this9.toggle();
				});
			}
		}, {
			key: '_getConfig',
			value: function _getConfig(config) {
				var elementData = $(this._element).data();
				if (elementData.placement !== undefined) {
					elementData.placement = AttachmentMap[elementData.placement.toUpperCase()];
				}

				config = $.extend({}, this.constructor.Default, $(this._element).data(), config);

				Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);

				return config;
			}
		}, {
			key: '_getMenuElement',
			value: function _getMenuElement() {
				if (!this._menu) {
					var parent = Dropdown._getParentFromElement(this._element);
					this._menu = $(parent).find(Selector.MENU)[0];
				}
				return this._menu;
			}
		}, {
			key: '_getPlacement',
			value: function _getPlacement() {
				var $parentDropdown = $(this._element).parent();
				var placement = this._config.placement;

				// Handle dropup
				if ($parentDropdown.hasClass(ClassName.DROPUP) || this._config.placement === AttachmentMap.TOP) {
					placement = AttachmentMap.TOP;
					if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
						placement = AttachmentMap.TOPEND;
					}
				} else if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
					placement = AttachmentMap.BOTTOMEND;
				}
				return placement;
			}
		}, {
			key: '_detectNavbar',
			value: function _detectNavbar() {
				return $(this._element).closest('.navbar').length > 0;
			}
		}, {
			key: '_getPopperConfig',
			value: function _getPopperConfig() {
				var popperConfig = {
					placement: this._getPlacement(),
					modifiers: {
						offset: {
							offset: this._config.offset
						},
						flip: {
							enabled: this._config.flip
						}
					}

					// Disable Popper.js for Dropdown in Navbar
				};if (this._inNavbar) {
					popperConfig.modifiers.applyStyle = {
						enabled: !this._inNavbar
					};
				}
				return popperConfig;
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var data = $(this).data(DATA_KEY);
					var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

					if (!data) {
						data = new Dropdown(this, _config);
						$(this).data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config]();
					}
				});
			}
		}, {
			key: '_clearMenus',
			value: function _clearMenus(event) {
				if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
					return;
				}

				var toggles = $.makeArray($(Selector.DATA_TOGGLE));
				for (var i = 0; i < toggles.length; i++) {
					var parent = Dropdown._getParentFromElement(toggles[i]);
					var context = $(toggles[i]).data(DATA_KEY);
					var relatedTarget = {
						relatedTarget: toggles[i]
					};

					if (!context) {
						continue;
					}

					var dropdownMenu = context._menu;
					if (!$(parent).hasClass(ClassName.SHOW)) {
						continue;
					}

					if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
						continue;
					}

					var hideEvent = $.Event(Event.HIDE, relatedTarget);
					$(parent).trigger(hideEvent);
					if (hideEvent.isDefaultPrevented()) {
						continue;
					}

					// if this is a touch-enabled device we remove the extra
					// empty mouseover listeners we added for iOS support
					if ('ontouchstart' in document.documentElement) {
						$('body').children().off('mouseover', null, $.noop);
					}

					toggles[i].setAttribute('aria-expanded', 'false');

					$(dropdownMenu).removeClass(ClassName.SHOW);
					$(parent).removeClass(ClassName.SHOW).trigger($.Event(Event.HIDDEN, relatedTarget));
				}
			}
		}, {
			key: '_getParentFromElement',
			value: function _getParentFromElement(element) {
				var parent = void 0;
				var selector = Util.getSelectorFromElement(element);

				if (selector) {
					parent = $(selector)[0];
				}

				return parent || element.parentNode;
			}
		}, {
			key: '_dataApiKeydownHandler',
			value: function _dataApiKeydownHandler(event) {
				if (!REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE || /input|textarea/i.test(event.target.tagName)) {
					return;
				}

				event.preventDefault();
				event.stopPropagation();

				if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
					return;
				}

				var parent = Dropdown._getParentFromElement(this);
				var isActive = $(parent).hasClass(ClassName.SHOW);

				if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

					if (event.which === ESCAPE_KEYCODE) {
						var toggle = $(parent).find(Selector.DATA_TOGGLE)[0];
						$(toggle).trigger('focus');
					}

					$(this).trigger('click');
					return;
				}

				var items = $(parent).find(Selector.VISIBLE_ITEMS).get();

				if (!items.length) {
					return;
				}

				var index = items.indexOf(event.target);

				if (event.which === ARROW_UP_KEYCODE && index > 0) {
					// up
					index--;
				}

				if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
					// down
					index++;
				}

				if (index < 0) {
					index = 0;
				}

				items[index].focus();
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}, {
			key: 'Default',
			get: function get() {
				return Default;
			}
		}, {
			key: 'DefaultType',
			get: function get() {
				return DefaultType;
			}
		}]);

		return Dropdown;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API + ' ' + Event.KEYUP_DATA_API, Dropdown._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
		event.preventDefault();
		event.stopPropagation();
		Dropdown._jQueryInterface.call($(this), 'toggle');
	}).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
		e.stopPropagation();
	});

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Dropdown._jQueryInterface;
	$.fn[NAME].Constructor = Dropdown;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Dropdown._jQueryInterface;
	};

	return Dropdown;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Modal = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'modal';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.modal';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var TRANSITION_DURATION = 300;
	var BACKDROP_TRANSITION_DURATION = 150;
	var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

	var Default = {
		backdrop: true,
		keyboard: true,
		focus: true,
		show: true
	};

	var DefaultType = {
		backdrop: '(boolean|string)',
		keyboard: 'boolean',
		focus: 'boolean',
		show: 'boolean'
	};

	var Event = {
		HIDE: 'hide' + EVENT_KEY,
		HIDDEN: 'hidden' + EVENT_KEY,
		SHOW: 'show' + EVENT_KEY,
		SHOWN: 'shown' + EVENT_KEY,
		FOCUSIN: 'focusin' + EVENT_KEY,
		RESIZE: 'resize' + EVENT_KEY,
		CLICK_DISMISS: 'click.dismiss' + EVENT_KEY,
		KEYDOWN_DISMISS: 'keydown.dismiss' + EVENT_KEY,
		MOUSEUP_DISMISS: 'mouseup.dismiss' + EVENT_KEY,
		MOUSEDOWN_DISMISS: 'mousedown.dismiss' + EVENT_KEY,
		CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
	};

	var ClassName = {
		SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
		BACKDROP: 'modal-backdrop',
		OPEN: 'modal-open',
		FADE: 'fade',
		SHOW: 'show'
	};

	var Selector = {
		DIALOG: '.modal-dialog',
		DATA_TOGGLE: '[data-toggle="modal"]',
		DATA_DISMISS: '[data-dismiss="modal"]',
		FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
		NAVBAR_TOGGLER: '.navbar-toggler'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Modal = function () {
		function Modal(element, config) {
			_classCallCheck(this, Modal);

			this._config = this._getConfig(config);
			this._element = element;
			this._dialog = $(element).find(Selector.DIALOG)[0];
			this._backdrop = null;
			this._isShown = false;
			this._isBodyOverflowing = false;
			this._ignoreBackdropClick = false;
			this._originalBodyPadding = 0;
			this._scrollbarWidth = 0;
		}

		// getters

		_createClass(Modal, [{
			key: 'toggle',


			// public

			value: function toggle(relatedTarget) {
				return this._isShown ? this.hide() : this.show(relatedTarget);
			}
		}, {
			key: 'show',
			value: function show(relatedTarget) {
				var _this10 = this;

				if (this._isTransitioning) {
					return;
				}

				if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
					this._isTransitioning = true;
				}

				var showEvent = $.Event(Event.SHOW, {
					relatedTarget: relatedTarget
				});

				$(this._element).trigger(showEvent);

				if (this._isShown || showEvent.isDefaultPrevented()) {
					return;
				}

				this._isShown = true;

				this._checkScrollbar();
				this._setScrollbar();

				$(document.body).addClass(ClassName.OPEN);

				this._setEscapeEvent();
				this._setResizeEvent();

				$(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
					return _this10.hide(event);
				});

				$(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
					$(_this10._element).one(Event.MOUSEUP_DISMISS, function (event) {
						if ($(event.target).is(_this10._element)) {
							_this10._ignoreBackdropClick = true;
						}
					});
				});

				this._showBackdrop(function () {
					return _this10._showElement(relatedTarget);
				});
			}
		}, {
			key: 'hide',
			value: function hide(event) {
				var _this11 = this;

				if (event) {
					event.preventDefault();
				}

				if (this._isTransitioning || !this._isShown) {
					return;
				}

				var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);

				if (transition) {
					this._isTransitioning = true;
				}

				var hideEvent = $.Event(Event.HIDE);

				$(this._element).trigger(hideEvent);

				if (!this._isShown || hideEvent.isDefaultPrevented()) {
					return;
				}

				this._isShown = false;

				this._setEscapeEvent();
				this._setResizeEvent();

				$(document).off(Event.FOCUSIN);

				$(this._element).removeClass(ClassName.SHOW);

				$(this._element).off(Event.CLICK_DISMISS);
				$(this._dialog).off(Event.MOUSEDOWN_DISMISS);

				if (transition) {

					$(this._element).one(Util.TRANSITION_END, function (event) {
						return _this11._hideModal(event);
					}).emulateTransitionEnd(TRANSITION_DURATION);
				} else {
					this._hideModal();
				}
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$.removeData(this._element, DATA_KEY);

				$(window, document, this._element, this._backdrop).off(EVENT_KEY);

				this._config = null;
				this._element = null;
				this._dialog = null;
				this._backdrop = null;
				this._isShown = null;
				this._isBodyOverflowing = null;
				this._ignoreBackdropClick = null;
				this._scrollbarWidth = null;
			}
		}, {
			key: 'handleUpdate',
			value: function handleUpdate() {
				this._adjustDialog();
			}

			// private

		}, {
			key: '_getConfig',
			value: function _getConfig(config) {
				config = $.extend({}, Default, config);
				Util.typeCheckConfig(NAME, config, DefaultType);
				return config;
			}
		}, {
			key: '_showElement',
			value: function _showElement(relatedTarget) {
				var _this12 = this;

				var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);

				if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
					// don't move modals dom position
					document.body.appendChild(this._element);
				}

				this._element.style.display = 'block';
				this._element.removeAttribute('aria-hidden');
				this._element.scrollTop = 0;

				if (transition) {
					Util.reflow(this._element);
				}

				$(this._element).addClass(ClassName.SHOW);

				if (this._config.focus) {
					this._enforceFocus();
				}

				var shownEvent = $.Event(Event.SHOWN, {
					relatedTarget: relatedTarget
				});

				var transitionComplete = function transitionComplete() {
					if (_this12._config.focus) {
						_this12._element.focus();
					}
					_this12._isTransitioning = false;
					$(_this12._element).trigger(shownEvent);
				};

				if (transition) {
					$(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(TRANSITION_DURATION);
				} else {
					transitionComplete();
				}
			}
		}, {
			key: '_enforceFocus',
			value: function _enforceFocus() {
				var _this13 = this;

				$(document).off(Event.FOCUSIN) // guard against infinite focus loop
				.on(Event.FOCUSIN, function (event) {
					if (document !== event.target && _this13._element !== event.target && !$(_this13._element).has(event.target).length) {
						_this13._element.focus();
					}
				});
			}
		}, {
			key: '_setEscapeEvent',
			value: function _setEscapeEvent() {
				var _this14 = this;

				if (this._isShown && this._config.keyboard) {
					$(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
						if (event.which === ESCAPE_KEYCODE) {
							event.preventDefault();
							_this14.hide();
						}
					});
				} else if (!this._isShown) {
					$(this._element).off(Event.KEYDOWN_DISMISS);
				}
			}
		}, {
			key: '_setResizeEvent',
			value: function _setResizeEvent() {
				var _this15 = this;

				if (this._isShown) {
					$(window).on(Event.RESIZE, function (event) {
						return _this15.handleUpdate(event);
					});
				} else {
					$(window).off(Event.RESIZE);
				}
			}
		}, {
			key: '_hideModal',
			value: function _hideModal() {
				var _this16 = this;

				this._element.style.display = 'none';
				this._element.setAttribute('aria-hidden', true);
				this._isTransitioning = false;
				this._showBackdrop(function () {
					$(document.body).removeClass(ClassName.OPEN);
					_this16._resetAdjustments();
					_this16._resetScrollbar();
					$(_this16._element).trigger(Event.HIDDEN);
				});
			}
		}, {
			key: '_removeBackdrop',
			value: function _removeBackdrop() {
				if (this._backdrop) {
					$(this._backdrop).remove();
					this._backdrop = null;
				}
			}
		}, {
			key: '_showBackdrop',
			value: function _showBackdrop(callback) {
				var _this17 = this;

				var animate = $(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

				if (this._isShown && this._config.backdrop) {
					var doAnimate = Util.supportsTransitionEnd() && animate;

					this._backdrop = document.createElement('div');
					this._backdrop.className = ClassName.BACKDROP;

					if (animate) {
						$(this._backdrop).addClass(animate);
					}

					$(this._backdrop).appendTo(document.body);

					$(this._element).on(Event.CLICK_DISMISS, function (event) {
						if (_this17._ignoreBackdropClick) {
							_this17._ignoreBackdropClick = false;
							return;
						}
						if (event.target !== event.currentTarget) {
							return;
						}
						if (_this17._config.backdrop === 'static') {
							_this17._element.focus();
						} else {
							_this17.hide();
						}
					});

					if (doAnimate) {
						Util.reflow(this._backdrop);
					}

					$(this._backdrop).addClass(ClassName.SHOW);

					if (!callback) {
						return;
					}

					if (!doAnimate) {
						callback();
						return;
					}

					$(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
				} else if (!this._isShown && this._backdrop) {
					$(this._backdrop).removeClass(ClassName.SHOW);

					var callbackRemove = function callbackRemove() {
						_this17._removeBackdrop();
						if (callback) {
							callback();
						}
					};

					if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
						$(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
					} else {
						callbackRemove();
					}
				} else if (callback) {
					callback();
				}
			}

			// ----------------------------------------------------------------------
			// the following methods are used to handle overflowing modals
			// todo (fat): these should probably be refactored out of modal.js
			// ----------------------------------------------------------------------

		}, {
			key: '_adjustDialog',
			value: function _adjustDialog() {
				var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

				if (!this._isBodyOverflowing && isModalOverflowing) {
					this._element.style.paddingLeft = this._scrollbarWidth + 'px';
				}

				if (this._isBodyOverflowing && !isModalOverflowing) {
					this._element.style.paddingRight = this._scrollbarWidth + 'px';
				}
			}
		}, {
			key: '_resetAdjustments',
			value: function _resetAdjustments() {
				this._element.style.paddingLeft = '';
				this._element.style.paddingRight = '';
			}
		}, {
			key: '_checkScrollbar',
			value: function _checkScrollbar() {
				this._isBodyOverflowing = document.body.clientWidth < window.innerWidth;
				this._scrollbarWidth = this._getScrollbarWidth();
			}
		}, {
			key: '_setScrollbar',
			value: function _setScrollbar() {
				var _this18 = this;

				if (this._isBodyOverflowing) {
					// Note: DOMNode.style.paddingRight returns the actual value or '' if not set
					//   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set

					// Adjust fixed content padding
					$(Selector.FIXED_CONTENT).each(function (index, element) {
						var actualPadding = $(element)[0].style.paddingRight;
						var calculatedPadding = $(element).css('padding-right');
						$(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this18._scrollbarWidth + 'px');
					});

					// Adjust navbar-toggler margin
					$(Selector.NAVBAR_TOGGLER).each(function (index, element) {
						var actualMargin = $(element)[0].style.marginRight;
						var calculatedMargin = $(element).css('margin-right');
						$(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this18._scrollbarWidth + 'px');
					});

					// Adjust body padding
					var actualPadding = document.body.style.paddingRight;
					var calculatedPadding = $('body').css('padding-right');
					$('body').data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + 'px');
				}
			}
		}, {
			key: '_resetScrollbar',
			value: function _resetScrollbar() {
				// Restore fixed content padding
				$(Selector.FIXED_CONTENT).each(function (index, element) {
					var padding = $(element).data('padding-right');
					if (typeof padding !== 'undefined') {
						$(element).css('padding-right', padding).removeData('padding-right');
					}
				});

				// Restore navbar-toggler margin
				$(Selector.NAVBAR_TOGGLER).each(function (index, element) {
					var margin = $(element).data('margin-right');
					if (typeof margin !== 'undefined') {
						$(element).css('margin-right', margin).removeData('margin-right');
					}
				});

				// Restore body padding
				var padding = $('body').data('padding-right');
				if (typeof padding !== 'undefined') {
					$('body').css('padding-right', padding).removeData('padding-right');
				}
			}
		}, {
			key: '_getScrollbarWidth',
			value: function _getScrollbarWidth() {
				// thx d.walsh
				var scrollDiv = document.createElement('div');
				scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
				document.body.appendChild(scrollDiv);
				var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
				document.body.removeChild(scrollDiv);
				return scrollbarWidth;
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config, relatedTarget) {
				return this.each(function () {
					var data = $(this).data(DATA_KEY);
					var _config = $.extend({}, Modal.Default, $(this).data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

					if (!data) {
						data = new Modal(this, _config);
						$(this).data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config](relatedTarget);
					} else if (_config.show) {
						data.show(relatedTarget);
					}
				});
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}, {
			key: 'Default',
			get: function get() {
				return Default;
			}
		}]);

		return Modal;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
		var _this19 = this;

		var target = void 0;
		var selector = Util.getSelectorFromElement(this);

		if (selector) {
			target = $(selector)[0];
		}

		var config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data());

		if (this.tagName === 'A' || this.tagName === 'AREA') {
			event.preventDefault();
		}

		var $target = $(target).one(Event.SHOW, function (showEvent) {
			if (showEvent.isDefaultPrevented()) {
				// only register focus restorer if modal will actually get shown
				return;
			}

			$target.one(Event.HIDDEN, function () {
				if ($(_this19).is(':visible')) {
					_this19.focus();
				}
			});
		});

		Modal._jQueryInterface.call($(target), config, this);
	});

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Modal._jQueryInterface;
	$.fn[NAME].Constructor = Modal;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Modal._jQueryInterface;
	};

	return Modal;
}(jQuery);

/* global Popper */

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tooltip = function ($) {

	/**
  * Check for Popper dependency
  * Popper - https://popper.js.org
  */
	if (typeof Popper === 'undefined') {
		throw new Error('Bootstrap tooltips require Popper.js (https://popper.js.org)');
	}

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'tooltip';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.tooltip';
	var EVENT_KEY = '.' + DATA_KEY;
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var TRANSITION_DURATION = 150;
	var CLASS_PREFIX = 'bs-tooltip';
	var BSCLS_PREFIX_REGEX = new RegExp('(^|\\s)' + CLASS_PREFIX + '\\S+', 'g');

	var DefaultType = {
		animation: 'boolean',
		template: 'string',
		title: '(string|element|function)',
		trigger: 'string',
		delay: '(number|object)',
		html: 'boolean',
		selector: '(string|boolean)',
		placement: '(string|function)',
		offset: '(number|string)',
		container: '(string|element|boolean)',
		fallbackPlacement: '(string|array)'
	};

	var AttachmentMap = {
		AUTO: 'auto',
		TOP: 'top',
		RIGHT: 'right',
		BOTTOM: 'bottom',
		LEFT: 'left'
	};

	var Default = {
		animation: true,
		template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
		trigger: 'hover focus',
		title: '',
		delay: 0,
		html: false,
		selector: false,
		placement: 'top',
		offset: 0,
		container: false,
		fallbackPlacement: 'flip'
	};

	var HoverState = {
		SHOW: 'show',
		OUT: 'out'
	};

	var Event = {
		HIDE: 'hide' + EVENT_KEY,
		HIDDEN: 'hidden' + EVENT_KEY,
		SHOW: 'show' + EVENT_KEY,
		SHOWN: 'shown' + EVENT_KEY,
		INSERTED: 'inserted' + EVENT_KEY,
		CLICK: 'click' + EVENT_KEY,
		FOCUSIN: 'focusin' + EVENT_KEY,
		FOCUSOUT: 'focusout' + EVENT_KEY,
		MOUSEENTER: 'mouseenter' + EVENT_KEY,
		MOUSELEAVE: 'mouseleave' + EVENT_KEY
	};

	var ClassName = {
		FADE: 'fade',
		SHOW: 'show'
	};

	var Selector = {
		TOOLTIP: '.tooltip',
		TOOLTIP_INNER: '.tooltip-inner',
		ARROW: '.arrow'
	};

	var Trigger = {
		HOVER: 'hover',
		FOCUS: 'focus',
		CLICK: 'click',
		MANUAL: 'manual'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Tooltip = function () {
		function Tooltip(element, config) {
			_classCallCheck(this, Tooltip);

			// private
			this._isEnabled = true;
			this._timeout = 0;
			this._hoverState = '';
			this._activeTrigger = {};
			this._popper = null;

			// protected
			this.element = element;
			this.config = this._getConfig(config);
			this.tip = null;

			this._setListeners();
		}

		// getters

		_createClass(Tooltip, [{
			key: 'enable',


			// public

			value: function enable() {
				this._isEnabled = true;
			}
		}, {
			key: 'disable',
			value: function disable() {
				this._isEnabled = false;
			}
		}, {
			key: 'toggleEnabled',
			value: function toggleEnabled() {
				this._isEnabled = !this._isEnabled;
			}
		}, {
			key: 'toggle',
			value: function toggle(event) {
				if (event) {
					var dataKey = this.constructor.DATA_KEY;
					var context = $(event.currentTarget).data(dataKey);

					if (!context) {
						context = new this.constructor(event.currentTarget, this._getDelegateConfig());
						$(event.currentTarget).data(dataKey, context);
					}

					context._activeTrigger.click = !context._activeTrigger.click;

					if (context._isWithActiveTrigger()) {
						context._enter(null, context);
					} else {
						context._leave(null, context);
					}
				} else {

					if ($(this.getTipElement()).hasClass(ClassName.SHOW)) {
						this._leave(null, this);
						return;
					}

					this._enter(null, this);
				}
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				clearTimeout(this._timeout);

				$.removeData(this.element, this.constructor.DATA_KEY);

				$(this.element).off(this.constructor.EVENT_KEY);
				$(this.element).closest('.modal').off('hide.bs.modal');

				if (this.tip) {
					$(this.tip).remove();
				}

				this._isEnabled = null;
				this._timeout = null;
				this._hoverState = null;
				this._activeTrigger = null;
				if (this._popper !== null) {
					this._popper.destroy();
				}
				this._popper = null;

				this.element = null;
				this.config = null;
				this.tip = null;
			}
		}, {
			key: 'show',
			value: function show() {
				var _this20 = this;

				if ($(this.element).css('display') === 'none') {
					throw new Error('Please use show on visible elements');
				}

				var showEvent = $.Event(this.constructor.Event.SHOW);
				if (this.isWithContent() && this._isEnabled) {
					$(this.element).trigger(showEvent);

					var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

					if (showEvent.isDefaultPrevented() || !isInTheDom) {
						return;
					}

					var tip = this.getTipElement();
					var tipId = Util.getUID(this.constructor.NAME);

					tip.setAttribute('id', tipId);
					this.element.setAttribute('aria-describedby', tipId);

					this.setContent();

					if (this.config.animation) {
						$(tip).addClass(ClassName.FADE);
					}

					var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

					var attachment = this._getAttachment(placement);
					this.addAttachmentClass(attachment);

					var container = this.config.container === false ? document.body : $(this.config.container);

					$(tip).data(this.constructor.DATA_KEY, this);

					if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
						$(tip).appendTo(container);
					}

					$(this.element).trigger(this.constructor.Event.INSERTED);

					this._popper = new Popper(this.element, tip, {
						placement: attachment,
						modifiers: {
							offset: {
								offset: this.config.offset
							},
							flip: {
								behavior: this.config.fallbackPlacement
							},
							arrow: {
								element: Selector.ARROW
							}
						},
						onCreate: function onCreate(data) {
							if (data.originalPlacement !== data.placement) {
								_this20._handlePopperPlacementChange(data);
							}
						},
						onUpdate: function onUpdate(data) {
							_this20._handlePopperPlacementChange(data);
						}
					});

					$(tip).addClass(ClassName.SHOW);

					// if this is a touch-enabled device we add extra
					// empty mouseover listeners to the body's immediate children;
					// only needed because of broken event delegation on iOS
					// https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
					if ('ontouchstart' in document.documentElement) {
						$('body').children().on('mouseover', null, $.noop);
					}

					var complete = function complete() {
						if (_this20.config.animation) {
							_this20._fixTransition();
						}
						var prevHoverState = _this20._hoverState;
						_this20._hoverState = null;

						$(_this20.element).trigger(_this20.constructor.Event.SHOWN);

						if (prevHoverState === HoverState.OUT) {
							_this20._leave(null, _this20);
						}
					};

					if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
						$(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
					} else {
						complete();
					}
				}
			}
		}, {
			key: 'hide',
			value: function hide(callback) {
				var _this21 = this;

				var tip = this.getTipElement();
				var hideEvent = $.Event(this.constructor.Event.HIDE);
				var complete = function complete() {
					if (_this21._hoverState !== HoverState.SHOW && tip.parentNode) {
						tip.parentNode.removeChild(tip);
					}

					_this21._cleanTipClass();
					_this21.element.removeAttribute('aria-describedby');
					$(_this21.element).trigger(_this21.constructor.Event.HIDDEN);
					if (_this21._popper !== null) {
						_this21._popper.destroy();
					}

					if (callback) {
						callback();
					}
				};

				$(this.element).trigger(hideEvent);

				if (hideEvent.isDefaultPrevented()) {
					return;
				}

				$(tip).removeClass(ClassName.SHOW);

				// if this is a touch-enabled device we remove the extra
				// empty mouseover listeners we added for iOS support
				if ('ontouchstart' in document.documentElement) {
					$('body').children().off('mouseover', null, $.noop);
				}

				this._activeTrigger[Trigger.CLICK] = false;
				this._activeTrigger[Trigger.FOCUS] = false;
				this._activeTrigger[Trigger.HOVER] = false;

				if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {

					$(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
				} else {
					complete();
				}

				this._hoverState = '';
			}
		}, {
			key: 'update',
			value: function update() {
				if (this._popper !== null) {
					this._popper.scheduleUpdate();
				}
			}

			// protected

		}, {
			key: 'isWithContent',
			value: function isWithContent() {
				return Boolean(this.getTitle());
			}
		}, {
			key: 'addAttachmentClass',
			value: function addAttachmentClass(attachment) {
				$(this.getTipElement()).addClass(CLASS_PREFIX + '-' + attachment);
			}
		}, {
			key: 'getTipElement',
			value: function getTipElement() {
				return this.tip = this.tip || $(this.config.template)[0];
			}
		}, {
			key: 'setContent',
			value: function setContent() {
				var $tip = $(this.getTipElement());
				this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());
				$tip.removeClass(ClassName.FADE + ' ' + ClassName.SHOW);
			}
		}, {
			key: 'setElementContent',
			value: function setElementContent($element, content) {
				var html = this.config.html;
				if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object' && (content.nodeType || content.jquery)) {
					// content is a DOM node or a jQuery
					if (html) {
						if (!$(content).parent().is($element)) {
							$element.empty().append(content);
						}
					} else {
						$element.text($(content).text());
					}
				} else {
					$element[html ? 'html' : 'text'](content);
				}
			}
		}, {
			key: 'getTitle',
			value: function getTitle() {
				var title = this.element.getAttribute('data-original-title');

				if (!title) {
					title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
				}

				return title;
			}

			// private

		}, {
			key: '_getAttachment',
			value: function _getAttachment(placement) {
				return AttachmentMap[placement.toUpperCase()];
			}
		}, {
			key: '_setListeners',
			value: function _setListeners() {
				var _this22 = this;

				var triggers = this.config.trigger.split(' ');

				triggers.forEach(function (trigger) {
					if (trigger === 'click') {
						$(_this22.element).on(_this22.constructor.Event.CLICK, _this22.config.selector, function (event) {
							return _this22.toggle(event);
						});
					} else if (trigger !== Trigger.MANUAL) {
						var eventIn = trigger === Trigger.HOVER ? _this22.constructor.Event.MOUSEENTER : _this22.constructor.Event.FOCUSIN;
						var eventOut = trigger === Trigger.HOVER ? _this22.constructor.Event.MOUSELEAVE : _this22.constructor.Event.FOCUSOUT;

						$(_this22.element).on(eventIn, _this22.config.selector, function (event) {
							return _this22._enter(event);
						}).on(eventOut, _this22.config.selector, function (event) {
							return _this22._leave(event);
						});
					}

					$(_this22.element).closest('.modal').on('hide.bs.modal', function () {
						return _this22.hide();
					});
				});

				if (this.config.selector) {
					this.config = $.extend({}, this.config, {
						trigger: 'manual',
						selector: ''
					});
				} else {
					this._fixTitle();
				}
			}
		}, {
			key: '_fixTitle',
			value: function _fixTitle() {
				var titleType = _typeof(this.element.getAttribute('data-original-title'));
				if (this.element.getAttribute('title') || titleType !== 'string') {
					this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
					this.element.setAttribute('title', '');
				}
			}
		}, {
			key: '_enter',
			value: function _enter(event, context) {
				var dataKey = this.constructor.DATA_KEY;

				context = context || $(event.currentTarget).data(dataKey);

				if (!context) {
					context = new this.constructor(event.currentTarget, this._getDelegateConfig());
					$(event.currentTarget).data(dataKey, context);
				}

				if (event) {
					context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
				}

				if ($(context.getTipElement()).hasClass(ClassName.SHOW) || context._hoverState === HoverState.SHOW) {
					context._hoverState = HoverState.SHOW;
					return;
				}

				clearTimeout(context._timeout);

				context._hoverState = HoverState.SHOW;

				if (!context.config.delay || !context.config.delay.show) {
					context.show();
					return;
				}

				context._timeout = setTimeout(function () {
					if (context._hoverState === HoverState.SHOW) {
						context.show();
					}
				}, context.config.delay.show);
			}
		}, {
			key: '_leave',
			value: function _leave(event, context) {
				var dataKey = this.constructor.DATA_KEY;

				context = context || $(event.currentTarget).data(dataKey);

				if (!context) {
					context = new this.constructor(event.currentTarget, this._getDelegateConfig());
					$(event.currentTarget).data(dataKey, context);
				}

				if (event) {
					context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
				}

				if (context._isWithActiveTrigger()) {
					return;
				}

				clearTimeout(context._timeout);

				context._hoverState = HoverState.OUT;

				if (!context.config.delay || !context.config.delay.hide) {
					context.hide();
					return;
				}

				context._timeout = setTimeout(function () {
					if (context._hoverState === HoverState.OUT) {
						context.hide();
					}
				}, context.config.delay.hide);
			}
		}, {
			key: '_isWithActiveTrigger',
			value: function _isWithActiveTrigger() {
				for (var trigger in this._activeTrigger) {
					if (this._activeTrigger[trigger]) {
						return true;
					}
				}

				return false;
			}
		}, {
			key: '_getConfig',
			value: function _getConfig(config) {
				config = $.extend({}, this.constructor.Default, $(this.element).data(), config);

				if (config.delay && typeof config.delay === 'number') {
					config.delay = {
						show: config.delay,
						hide: config.delay
					};
				}

				if (config.title && typeof config.title === 'number') {
					config.title = config.title.toString();
				}

				if (config.content && typeof config.content === 'number') {
					config.content = config.content.toString();
				}

				Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);

				return config;
			}
		}, {
			key: '_getDelegateConfig',
			value: function _getDelegateConfig() {
				var config = {};

				if (this.config) {
					for (var key in this.config) {
						if (this.constructor.Default[key] !== this.config[key]) {
							config[key] = this.config[key];
						}
					}
				}

				return config;
			}
		}, {
			key: '_cleanTipClass',
			value: function _cleanTipClass() {
				var $tip = $(this.getTipElement());
				var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
				if (tabClass !== null && tabClass.length > 0) {
					$tip.removeClass(tabClass.join(''));
				}
			}
		}, {
			key: '_handlePopperPlacementChange',
			value: function _handlePopperPlacementChange(data) {
				this._cleanTipClass();
				this.addAttachmentClass(this._getAttachment(data.placement));
			}
		}, {
			key: '_fixTransition',
			value: function _fixTransition() {
				var tip = this.getTipElement();
				var initConfigAnimation = this.config.animation;
				if (tip.getAttribute('x-placement') !== null) {
					return;
				}
				$(tip).removeClass(ClassName.FADE);
				this.config.animation = false;
				this.hide();
				this.show();
				this.config.animation = initConfigAnimation;
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var data = $(this).data(DATA_KEY);
					var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config;

					if (!data && /dispose|hide/.test(config)) {
						return;
					}

					if (!data) {
						data = new Tooltip(this, _config);
						$(this).data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config]();
					}
				});
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}, {
			key: 'Default',
			get: function get() {
				return Default;
			}
		}, {
			key: 'NAME',
			get: function get() {
				return NAME;
			}
		}, {
			key: 'DATA_KEY',
			get: function get() {
				return DATA_KEY;
			}
		}, {
			key: 'Event',
			get: function get() {
				return Event;
			}
		}, {
			key: 'EVENT_KEY',
			get: function get() {
				return EVENT_KEY;
			}
		}, {
			key: 'DefaultType',
			get: function get() {
				return DefaultType;
			}
		}]);

		return Tooltip;
	}();

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Tooltip._jQueryInterface;
	$.fn[NAME].Constructor = Tooltip;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Tooltip._jQueryInterface;
	};

	return Tooltip;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Popover = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'popover';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.popover';
	var EVENT_KEY = '.' + DATA_KEY;
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var CLASS_PREFIX = 'bs-popover';
	var BSCLS_PREFIX_REGEX = new RegExp('(^|\\s)' + CLASS_PREFIX + '\\S+', 'g');

	var Default = $.extend({}, Tooltip.Default, {
		placement: 'right',
		trigger: 'click',
		content: '',
		template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
	});

	var DefaultType = $.extend({}, Tooltip.DefaultType, {
		content: '(string|element|function)'
	});

	var ClassName = {
		FADE: 'fade',
		SHOW: 'show'
	};

	var Selector = {
		TITLE: '.popover-header',
		CONTENT: '.popover-body'
	};

	var Event = {
		HIDE: 'hide' + EVENT_KEY,
		HIDDEN: 'hidden' + EVENT_KEY,
		SHOW: 'show' + EVENT_KEY,
		SHOWN: 'shown' + EVENT_KEY,
		INSERTED: 'inserted' + EVENT_KEY,
		CLICK: 'click' + EVENT_KEY,
		FOCUSIN: 'focusin' + EVENT_KEY,
		FOCUSOUT: 'focusout' + EVENT_KEY,
		MOUSEENTER: 'mouseenter' + EVENT_KEY,
		MOUSELEAVE: 'mouseleave' + EVENT_KEY

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Popover = function (_Tooltip) {
		_inherits(Popover, _Tooltip);

		function Popover() {
			_classCallCheck(this, Popover);

			return _possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).apply(this, arguments));
		}

		_createClass(Popover, [{
			key: 'isWithContent',


			// overrides

			value: function isWithContent() {
				return this.getTitle() || this._getContent();
			}
		}, {
			key: 'addAttachmentClass',
			value: function addAttachmentClass(attachment) {
				$(this.getTipElement()).addClass(CLASS_PREFIX + '-' + attachment);
			}
		}, {
			key: 'getTipElement',
			value: function getTipElement() {
				return this.tip = this.tip || $(this.config.template)[0];
			}
		}, {
			key: 'setContent',
			value: function setContent() {
				var $tip = $(this.getTipElement());

				// we use append for html objects to maintain js events
				this.setElementContent($tip.find(Selector.TITLE), this.getTitle());
				this.setElementContent($tip.find(Selector.CONTENT), this._getContent());

				$tip.removeClass(ClassName.FADE + ' ' + ClassName.SHOW);
			}

			// private

		}, {
			key: '_getContent',
			value: function _getContent() {
				return this.element.getAttribute('data-content') || (typeof this.config.content === 'function' ? this.config.content.call(this.element) : this.config.content);
			}
		}, {
			key: '_cleanTipClass',
			value: function _cleanTipClass() {
				var $tip = $(this.getTipElement());
				var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
				if (tabClass !== null && tabClass.length > 0) {
					$tip.removeClass(tabClass.join(''));
				}
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var data = $(this).data(DATA_KEY);
					var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

					if (!data && /destroy|hide/.test(config)) {
						return;
					}

					if (!data) {
						data = new Popover(this, _config);
						$(this).data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config]();
					}
				});
			}
		}, {
			key: 'VERSION',


			// getters

			get: function get() {
				return VERSION;
			}
		}, {
			key: 'Default',
			get: function get() {
				return Default;
			}
		}, {
			key: 'NAME',
			get: function get() {
				return NAME;
			}
		}, {
			key: 'DATA_KEY',
			get: function get() {
				return DATA_KEY;
			}
		}, {
			key: 'Event',
			get: function get() {
				return Event;
			}
		}, {
			key: 'EVENT_KEY',
			get: function get() {
				return EVENT_KEY;
			}
		}, {
			key: 'DefaultType',
			get: function get() {
				return DefaultType;
			}
		}]);

		return Popover;
	}(Tooltip);

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Popover._jQueryInterface;
	$.fn[NAME].Constructor = Popover;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Popover._jQueryInterface;
	};

	return Popover;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var ScrollSpy = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'scrollspy';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.scrollspy';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];

	var Default = {
		offset: 10,
		method: 'auto',
		target: ''
	};

	var DefaultType = {
		offset: 'number',
		method: 'string',
		target: '(string|element)'
	};

	var Event = {
		ACTIVATE: 'activate' + EVENT_KEY,
		SCROLL: 'scroll' + EVENT_KEY,
		LOAD_DATA_API: 'load' + EVENT_KEY + DATA_API_KEY
	};

	var ClassName = {
		DROPDOWN_ITEM: 'dropdown-item',
		DROPDOWN_MENU: 'dropdown-menu',
		ACTIVE: 'active'
	};

	var Selector = {
		DATA_SPY: '[data-spy="scroll"]',
		ACTIVE: '.active',
		NAV_LIST_GROUP: '.nav, .list-group',
		NAV_LINKS: '.nav-link',
		LIST_ITEMS: '.list-group-item',
		DROPDOWN: '.dropdown',
		DROPDOWN_ITEMS: '.dropdown-item',
		DROPDOWN_TOGGLE: '.dropdown-toggle'
	};

	var OffsetMethod = {
		OFFSET: 'offset',
		POSITION: 'position'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var ScrollSpy = function () {
		function ScrollSpy(element, config) {
			var _this24 = this;

			_classCallCheck(this, ScrollSpy);

			this._element = element;
			this._scrollElement = element.tagName === 'BODY' ? window : element;
			this._config = this._getConfig(config);
			this._selector = this._config.target + ' ' + Selector.NAV_LINKS + ',' + (this._config.target + ' ' + Selector.LIST_ITEMS + ',') + (this._config.target + ' ' + Selector.DROPDOWN_ITEMS);
			this._offsets = [];
			this._targets = [];
			this._activeTarget = null;
			this._scrollHeight = 0;

			$(this._scrollElement).on(Event.SCROLL, function (event) {
				return _this24._process(event);
			});

			this.refresh();
			this._process();
		}

		// getters

		_createClass(ScrollSpy, [{
			key: 'refresh',


			// public

			value: function refresh() {
				var _this25 = this;

				var autoMethod = this._scrollElement !== this._scrollElement.window ? OffsetMethod.POSITION : OffsetMethod.OFFSET;

				var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;

				var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;

				this._offsets = [];
				this._targets = [];

				this._scrollHeight = this._getScrollHeight();

				var targets = $.makeArray($(this._selector));

				targets.map(function (element) {
					var target = void 0;
					var targetSelector = Util.getSelectorFromElement(element);

					if (targetSelector) {
						target = $(targetSelector)[0];
					}

					if (target) {
						var targetBCR = target.getBoundingClientRect();
						if (targetBCR.width || targetBCR.height) {
							// todo (fat): remove sketch reliance on jQuery position/offset
							return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
						}
					}
					return null;
				}).filter(function (item) {
					return item;
				}).sort(function (a, b) {
					return a[0] - b[0];
				}).forEach(function (item) {
					_this25._offsets.push(item[0]);
					_this25._targets.push(item[1]);
				});
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$.removeData(this._element, DATA_KEY);
				$(this._scrollElement).off(EVENT_KEY);

				this._element = null;
				this._scrollElement = null;
				this._config = null;
				this._selector = null;
				this._offsets = null;
				this._targets = null;
				this._activeTarget = null;
				this._scrollHeight = null;
			}

			// private

		}, {
			key: '_getConfig',
			value: function _getConfig(config) {
				config = $.extend({}, Default, config);

				if (typeof config.target !== 'string') {
					var id = $(config.target).attr('id');
					if (!id) {
						id = Util.getUID(NAME);
						$(config.target).attr('id', id);
					}
					config.target = '#' + id;
				}

				Util.typeCheckConfig(NAME, config, DefaultType);

				return config;
			}
		}, {
			key: '_getScrollTop',
			value: function _getScrollTop() {
				return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
			}
		}, {
			key: '_getScrollHeight',
			value: function _getScrollHeight() {
				return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
			}
		}, {
			key: '_getOffsetHeight',
			value: function _getOffsetHeight() {
				return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
			}
		}, {
			key: '_process',
			value: function _process() {
				var scrollTop = this._getScrollTop() + this._config.offset;
				var scrollHeight = this._getScrollHeight();
				var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

				if (this._scrollHeight !== scrollHeight) {
					this.refresh();
				}

				if (scrollTop >= maxScroll) {
					var target = this._targets[this._targets.length - 1];

					if (this._activeTarget !== target) {
						this._activate(target);
					}
					return;
				}

				if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
					this._activeTarget = null;
					this._clear();
					return;
				}

				for (var i = this._offsets.length; i--;) {
					var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (this._offsets[i + 1] === undefined || scrollTop < this._offsets[i + 1]);

					if (isActiveTarget) {
						this._activate(this._targets[i]);
					}
				}
			}
		}, {
			key: '_activate',
			value: function _activate(target) {
				this._activeTarget = target;

				this._clear();

				var queries = this._selector.split(',');
				queries = queries.map(function (selector) {
					return selector + '[data-target="' + target + '"],' + (selector + '[href="' + target + '"]');
				});

				var $link = $(queries.join(','));

				if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
					$link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
					$link.addClass(ClassName.ACTIVE);
				} else {
					// Set triggered link as active
					$link.addClass(ClassName.ACTIVE);
					// Set triggered links parents as active
					// With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
					$link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_LINKS + ', ' + Selector.LIST_ITEMS).addClass(ClassName.ACTIVE);
				}

				$(this._scrollElement).trigger(Event.ACTIVATE, {
					relatedTarget: target
				});
			}
		}, {
			key: '_clear',
			value: function _clear() {
				$(this._selector).filter(Selector.ACTIVE).removeClass(ClassName.ACTIVE);
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var data = $(this).data(DATA_KEY);
					var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config;

					if (!data) {
						data = new ScrollSpy(this, _config);
						$(this).data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config]();
					}
				});
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}, {
			key: 'Default',
			get: function get() {
				return Default;
			}
		}]);

		return ScrollSpy;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(window).on(Event.LOAD_DATA_API, function () {
		var scrollSpys = $.makeArray($(Selector.DATA_SPY));

		for (var i = scrollSpys.length; i--;) {
			var $spy = $(scrollSpys[i]);
			ScrollSpy._jQueryInterface.call($spy, $spy.data());
		}
	});

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = ScrollSpy._jQueryInterface;
	$.fn[NAME].Constructor = ScrollSpy;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return ScrollSpy._jQueryInterface;
	};

	return ScrollSpy;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tab = function ($) {

	/**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

	var NAME = 'tab';
	var VERSION = '4.0.0-beta';
	var DATA_KEY = 'bs.tab';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = $.fn[NAME];
	var TRANSITION_DURATION = 150;

	var Event = {
		HIDE: 'hide' + EVENT_KEY,
		HIDDEN: 'hidden' + EVENT_KEY,
		SHOW: 'show' + EVENT_KEY,
		SHOWN: 'shown' + EVENT_KEY,
		CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
	};

	var ClassName = {
		DROPDOWN_MENU: 'dropdown-menu',
		ACTIVE: 'active',
		DISABLED: 'disabled',
		FADE: 'fade',
		SHOW: 'show'
	};

	var Selector = {
		DROPDOWN: '.dropdown',
		NAV_LIST_GROUP: '.nav, .list-group',
		ACTIVE: '.active',
		DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
		DROPDOWN_TOGGLE: '.dropdown-toggle',
		DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'

		/**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

	};
	var Tab = function () {
		function Tab(element) {
			_classCallCheck(this, Tab);

			this._element = element;
		}

		// getters

		_createClass(Tab, [{
			key: 'show',


			// public

			value: function show() {
				var _this26 = this;

				if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName.ACTIVE) || $(this._element).hasClass(ClassName.DISABLED)) {
					return;
				}

				var target = void 0;
				var previous = void 0;
				var listElement = $(this._element).closest(Selector.NAV_LIST_GROUP)[0];
				var selector = Util.getSelectorFromElement(this._element);

				if (listElement) {
					previous = $.makeArray($(listElement).find(Selector.ACTIVE));
					previous = previous[previous.length - 1];
				}

				var hideEvent = $.Event(Event.HIDE, {
					relatedTarget: this._element
				});

				var showEvent = $.Event(Event.SHOW, {
					relatedTarget: previous
				});

				if (previous) {
					$(previous).trigger(hideEvent);
				}

				$(this._element).trigger(showEvent);

				if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
					return;
				}

				if (selector) {
					target = $(selector)[0];
				}

				this._activate(this._element, listElement);

				var complete = function complete() {
					var hiddenEvent = $.Event(Event.HIDDEN, {
						relatedTarget: _this26._element
					});

					var shownEvent = $.Event(Event.SHOWN, {
						relatedTarget: previous
					});

					$(previous).trigger(hiddenEvent);
					$(_this26._element).trigger(shownEvent);
				};

				if (target) {
					this._activate(target, target.parentNode, complete);
				} else {
					complete();
				}
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				$.removeData(this._element, DATA_KEY);
				this._element = null;
			}

			// private

		}, {
			key: '_activate',
			value: function _activate(element, container, callback) {
				var _this27 = this;

				var active = $(container).find(Selector.ACTIVE)[0];
				var isTransitioning = callback && Util.supportsTransitionEnd() && active && $(active).hasClass(ClassName.FADE);

				var complete = function complete() {
					return _this27._transitionComplete(element, active, isTransitioning, callback);
				};

				if (active && isTransitioning) {
					$(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
				} else {
					complete();
				}

				if (active) {
					$(active).removeClass(ClassName.SHOW);
				}
			}
		}, {
			key: '_transitionComplete',
			value: function _transitionComplete(element, active, isTransitioning, callback) {
				if (active) {
					$(active).removeClass(ClassName.ACTIVE);

					var dropdownChild = $(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

					if (dropdownChild) {
						$(dropdownChild).removeClass(ClassName.ACTIVE);
					}

					active.setAttribute('aria-expanded', false);
				}

				$(element).addClass(ClassName.ACTIVE);
				element.setAttribute('aria-expanded', true);

				if (isTransitioning) {
					Util.reflow(element);
					$(element).addClass(ClassName.SHOW);
				} else {
					$(element).removeClass(ClassName.FADE);
				}

				if (element.parentNode && $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

					var dropdownElement = $(element).closest(Selector.DROPDOWN)[0];
					if (dropdownElement) {
						$(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
					}

					element.setAttribute('aria-expanded', true);
				}

				if (callback) {
					callback();
				}
			}

			// static

		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(config) {
				return this.each(function () {
					var $this = $(this);
					var data = $this.data(DATA_KEY);

					if (!data) {
						data = new Tab(this);
						$this.data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config]();
					}
				});
			}
		}, {
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}]);

		return Tab;
	}();

	/**
  * ------------------------------------------------------------------------
  * Data Api implementation
  * ------------------------------------------------------------------------
  */

	$(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
		event.preventDefault();
		Tab._jQueryInterface.call($(this), 'show');
	});

	/**
  * ------------------------------------------------------------------------
  * jQuery
  * ------------------------------------------------------------------------
  */

	$.fn[NAME] = Tab._jQueryInterface;
	$.fn[NAME].Constructor = Tab;
	$.fn[NAME].noConflict = function () {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Tab._jQueryInterface;
	};

	return Tab;
}(jQuery)

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+ function ($) {
	'use strict';

	// AFFIX CLASS DEFINITION
	// ======================

	var Affix = function Affix(element, options) {
		this.options = $.extend({}, Affix.DEFAULTS, options);

		this.$target = $(this.options.target).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

		this.$element = $(element);
		this.affixed = null;
		this.unpin = null;
		this.pinnedOffset = null;

		this.checkPosition();
	};

	Affix.VERSION = '3.3.6';

	Affix.RESET = 'affix affix-top affix-bottom';

	Affix.DEFAULTS = {
		offset: 0,
		target: window
	};

	Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
		var scrollTop = this.$target.scrollTop();
		var position = this.$element.offset();
		var targetHeight = this.$target.height();

		if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

		if (this.affixed == 'bottom') {
			if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
			return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
		}

		var initializing = this.affixed == null;
		var colliderTop = initializing ? scrollTop : position.top;
		var colliderHeight = initializing ? targetHeight : height;

		if (offsetTop != null && scrollTop <= offsetTop) return 'top';
		if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

		return false;
	};

	Affix.prototype.getPinnedOffset = function () {
		if (this.pinnedOffset) return this.pinnedOffset;
		this.$element.removeClass(Affix.RESET).addClass('affix');
		var scrollTop = this.$target.scrollTop();
		var position = this.$element.offset();
		return this.pinnedOffset = position.top - scrollTop;
	};

	Affix.prototype.checkPositionWithEventLoop = function () {
		setTimeout($.proxy(this.checkPosition, this), 1);
	};

	Affix.prototype.checkPosition = function () {
		if (!this.$element.is(':visible')) return;

		var height = this.$element.height();
		var offset = this.options.offset;
		var offsetTop = offset.top;
		var offsetBottom = offset.bottom;
		var scrollHeight = Math.max($(document).height(), $(document.body).height());

		if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
		if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
		if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

		var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

		if (this.affixed != affix) {
			if (this.unpin != null) this.$element.css('top', '');

			var affixType = 'affix' + (affix ? '-' + affix : '');
			var e = $.Event(affixType + '.bs.affix');

			this.$element.trigger(e);

			if (e.isDefaultPrevented()) return;

			this.affixed = affix;
			this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

			this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
		}

		if (affix == 'bottom') {
			this.$element.offset({
				top: scrollHeight - height - offsetBottom
			});
		}
	};

	// AFFIX PLUGIN DEFINITION
	// =======================

	function Plugin(option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('bs.affix');
			var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

			if (!data) $this.data('bs.affix', data = new Affix(this, options));
			if (typeof option == 'string') data[option]();
		});
	}

	var old = $.fn.affix;

	$.fn.affix = Plugin;
	$.fn.affix.Constructor = Affix;

	// AFFIX NO CONFLICT
	// =================

	$.fn.affix.noConflict = function () {
		$.fn.affix = old;
		return this;
	};

	// AFFIX DATA-API
	// ==============

	$(window).on('load', function () {
		$('[data-spy="affix"]').each(function () {
			var $spy = $(this);
			var data = $spy.data();

			data.offset = data.offset || {};

			if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
			if (data.offsetTop != null) data.offset.top = data.offsetTop;

			Plugin.call($spy, data);
		});
	});
}(jQuery);

var App = {

	_isWithTooltips: false,

	init: function init() {
		App._tooltips();
		App._navDoc();

		$(window).on('resize', App._tooltips);

		$(document).on('shown.bs.tab', function () {
			$(document).trigger('redraw.bs.charts');
		});

		// docs top button
		if ($('.docs-top').length) {
			App._backToTopButton();
			$(window).on('scroll', App._backToTopButton);
		}
	},

	_navDoc: function _navDoc() {
		// doc nav js
		var $toc = $('#markdown-toc');
		var $window = $(window);

		if ($toc[0]) {
			var maybeActivateDocNavigation = function maybeActivateDocNavigation() {
				if ($window.width() > 768) {
					activateDocNavigation();
				} else {
					deactivateDocNavigation();
				}
			};

			var deactivateDocNavigation = function deactivateDocNavigation() {
				$window.off('resize.theme.nav');
				$window.off('scroll.theme.nav');
				$toc.css({
					position: '',
					left: '',
					top: ''
				});
			};

			var activateDocNavigation = function activateDocNavigation() {

				var cache = {};

				function updateCache() {
					cache.containerTop = $('.docs-content').offset().top - 40;
					cache.containerRight = $('.docs-content').offset().left + $('.docs-content').width() + 45;
					measure();
				}

				function measure() {
					var scrollTop = $window.scrollTop();
					var distance = Math.max(scrollTop - cache.containerTop, 0);

					if (!distance) {
						$($toc.find('li a')[1]).addClass('active');
						return $toc.css({
							position: '',
							left: '',
							top: ''
						});
					}

					$toc.css({
						position: 'fixed',
						left: cache.containerRight,
						top: 40
					});
				}

				updateCache();

				$(window).on('resize.theme.nav', updateCache).on('scroll.theme.nav', measure);

				$('body').scrollspy({
					target: '#markdown-toc'
				});

				setTimeout(function () {
					$('body').scrollspy('refresh');
				}, 1000);
			};

			$('#markdown-toc li').addClass('nav-item');
			$('#markdown-toc li > a').addClass('nav-link');
			$('#markdown-toc li > ul').addClass('nav');

			maybeActivateDocNavigation();
			$window.on('resize', maybeActivateDocNavigation);
		}
	},

	_backToTopButton: function _backToTopButton() {
		if ($(window).scrollTop() > $(window).height()) {
			$('.docs-top').fadeIn();
		} else {
			$('.docs-top').fadeOut();
		}
	},

	_tooltips: function _tooltips() {
		if ($(window).width() > 768) {
			if (App._isWithTooltips) return;
			App._isWithTooltips = true;
			$('[data-toggle="tooltip"]').tooltip();
		} else {
			if (!App._isWithTooltips) return;
			App._isWithTooltips = false;
			$('[data-toggle="tooltip"]').tooltip('destroy');
		}
	}
};

App.init();

// Hello…
// This is a backport of our old chart-js data api plugin
// We no longer provide this as a supported plugin because of changes
// to the chart.js option api. However, for contrived examples (like the ones
// found in our theme examples, it makes our lives a bit easier.)
// if you're reading this, we *HIGHLY* recommend you don't use this in
// production, but rather implement your charts using the chart.js docs-top
// themselves, directly: www.chartjs.org/docs/
$(function () {

	var Charts = {

		_HYPHY_REGEX: /-([a-z])/g,

		_cleanAttr: function _cleanAttr(obj) {
			delete obj["chart"];
			delete obj["datasets"];
			delete obj["datasetsOptions"];
			delete obj["labels"];
			delete obj["options"];
		},

		doughnut: function doughnut(element) {
			var attrData = $.extend({}, $(element).data());

			var data = attrData.dataset ? eval(attrData.dataset) : {};
			var dataOptions = attrData.datasetOptions ? eval('(' + attrData.datasetOptions + ')') : {};
			var labels = attrData.labels ? eval(attrData.labels) : {};
			var options = attrData.options ? eval('(' + attrData.options + ')') : {};

			Charts._cleanAttr(attrData);

			var datasets = $.extend({
				data: data,
				borderWidth: 2,
				hoverBorderColor: 'transparent'
			}, dataOptions);

			var options = $.extend({
				cutoutPercentage: 80,
				legend: {
					display: false
				},
				animation: {
					animateRotate: false,
					duration: 0
				}
			}, options);

			new Chart(element.getContext('2d'), {
				type: "doughnut",
				data: {
					datasets: [datasets],
					labels: labels
				},
				options: options
			});
		},

		'spark-line': function sparkLine(element) {
			var attrData = $.extend({}, $(element).data());

			var data = attrData.dataset ? eval(attrData.dataset) : [];
			var datasetOptions = attrData.datasetOptions ? eval(attrData.datasetOptions) : [];
			var labels = attrData.labels ? eval(attrData.labels) : {};
			var options = attrData.options ? eval('(' + attrData.options + ')') : {};

			var data = {
				labels: labels,
				datasets: data.map(function (set, i) {
					return $.extend({
						data: set,
						fill: true,
						backgroundColor: 'rgba(255,255,255,.3)',
						borderColor: '#fff',
						pointBorderColor: '#fff',
						lineTension: 0.25,
						pointRadius: 0
					}, datasetOptions[i]);
				})
			};

			Charts._cleanAttr(attrData);

			var options = $.extend({
				animation: {
					duration: 0
				},
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						display: false
					}],
					yAxes: [{
						display: false
					}]
				},
				tooltips: {
					enabled: false
				}
			}, options);

			new Chart(element.getContext('2d'), {
				type: 'line',
				data: data,
				options: options
			});
		},

		line: function line(element) {
			var attrData = $.extend({}, $(element).data());

			var data = attrData.dataset ? eval(attrData.dataset) : [];
			var datasetOptions = attrData.datasetOptions ? eval(attrData.datasetOptions) : [];
			var labels = attrData.labels ? eval(attrData.labels) : {};
			var options = attrData.options ? eval('(' + attrData.options + ')') : {};
			var isDark = !!attrData.dark;

			var data = {
				labels: labels,
				datasets: data.map(function (set, i) {
					return $.extend({
						data: set,
						fill: true,
						backgroundColor: isDark ? 'rgba(28,168,221,.03)' : 'rgba(66,165,245,.2)',
						borderColor: '#42a5f5',
						pointBorderColor: '#fff',
						lineTension: 0.25,
						pointRadius: 0,
						pointHoverRadius: 0,
						pointHitRadius: 20
					}, datasetOptions[i]);
				})
			};

			Charts._cleanAttr(attrData);

			var options = $.extend({
				maintainAspectRatio: false,
				animation: {
					duration: 0
				},
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						gridLines: {
							color: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)',
							zeroLineColor: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)',
							drawBorder: false
						},
						ticks: {
							beginAtZero: false,
							fixedStepSize: 1000,
							fontColor: isDark ? '#a2a2a2' : 'rgba(0,0,0,.4)',
							fontSize: 14
						}
					}],
					xAxes: [{
						gridLines: {
							display: false
						},
						ticks: {
							fontColor: isDark ? '#a2a2a2' : 'rgba(0,0,0,.4)',
							fontSize: 14
						}
					}]
				},
				tooltips: {
					enabled: true,
					bodyFontSize: 14,
					callbacks: {
						title: function title() {
							return "";
						},
						labelColor: function labelColor() {
							return {
								backgroundColor: '#42a5f5',
								borderColor: '#42a5f5'
							};
						}
					}
				}
			}, options);

			new Chart(element.getContext('2d'), {
				type: 'line',
				data: data,
				options: options
			});
		},

		bar: function bar(element) {
			var attrData = $.extend({}, $(element).data());

			var data = attrData.dataset ? eval(attrData.dataset) : [];
			var datasetOptions = attrData.datasetOptions ? eval(attrData.datasetOptions) : [];
			var labels = attrData.labels ? eval(attrData.labels) : {};
			var options = attrData.options ? eval('(' + attrData.options + ')') : {};
			var isDark = !!attrData.dark;

			var data = {
				labels: labels,
				datasets: data.map(function (set, i) {
					return $.extend({
						data: set,
						fill: true,
						backgroundColor: i % 2 ? '#42a5f5' : '#1bc98e',
						borderColor: 'transparent'
					}, datasetOptions[i]);
				})
			};

			Charts._cleanAttr(attrData);

			var options = $.extend({
				maintainAspectRatio: false,
				animation: {
					duration: 0
				},
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						gridLines: {
							color: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)',
							zeroLineColor: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)',
							drawBorder: false
						},
						ticks: {
							fixedStepSize: 25,
							fontColor: isDark ? '#a2a2a2' : 'rgba(0,0,0,.4)',
							fontSize: 14
						}
					}],
					xAxes: [{
						gridLines: {
							display: false
						},
						ticks: {
							fontColor: isDark ? '#a2a2a2' : 'rgba(0,0,0,.4)',
							fontSize: 14
						}
					}]
				},
				tooltips: {
					enabled: true,
					bodyFontSize: 14
				}
			}, options);

			new Chart(element.getContext('2d'), {
				type: 'bar',
				data: data,
				options: options
			});
		}
	};

	$(document).on('redraw.bs.charts', function () {
		$('[data-chart]').each(function () {
			if ($(this).is(':visible') && !$(this).hasClass('js-chart-drawn')) {
				Charts[$(this).attr('data-chart')](this);
				$(this).addClass('js-chart-drawn');
			}
		});
	}).trigger('redraw.bs.charts');
});

/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 2.4.0
 *
 * Copyright 2016 Nick Downie
 * Released under the MIT license
 * https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
 */
(function (f) {
	if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.Chart = f();
	}
})(function () {
	var define, module, exports;return function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
			s(r[o]);
		}return s;
	}({ 1: [function (require, module, exports) {}, {}], 2: [function (require, module, exports) {
			/* MIT license */
			var colorNames = require(6);

			module.exports = {
				getRgba: getRgba,
				getHsla: getHsla,
				getRgb: getRgb,
				getHsl: getHsl,
				getHwb: getHwb,
				getAlpha: getAlpha,

				hexString: hexString,
				rgbString: rgbString,
				rgbaString: rgbaString,
				percentString: percentString,
				percentaString: percentaString,
				hslString: hslString,
				hslaString: hslaString,
				hwbString: hwbString,
				keyword: keyword
			};

			function getRgba(string) {
				if (!string) {
					return;
				}
				var abbr = /^#([a-fA-F0-9]{3})$/,
				    hex = /^#([a-fA-F0-9]{6})$/,
				    rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
				    per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
				    keyword = /(\w+)/;

				var rgb = [0, 0, 0],
				    a = 1,
				    match = string.match(abbr);
				if (match) {
					match = match[1];
					for (var i = 0; i < rgb.length; i++) {
						rgb[i] = parseInt(match[i] + match[i], 16);
					}
				} else if (match = string.match(hex)) {
					match = match[1];
					for (var i = 0; i < rgb.length; i++) {
						rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
					}
				} else if (match = string.match(rgba)) {
					for (var i = 0; i < rgb.length; i++) {
						rgb[i] = parseInt(match[i + 1]);
					}
					a = parseFloat(match[4]);
				} else if (match = string.match(per)) {
					for (var i = 0; i < rgb.length; i++) {
						rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
					}
					a = parseFloat(match[4]);
				} else if (match = string.match(keyword)) {
					if (match[1] == "transparent") {
						return [0, 0, 0, 0];
					}
					rgb = colorNames[match[1]];
					if (!rgb) {
						return;
					}
				}

				for (var i = 0; i < rgb.length; i++) {
					rgb[i] = scale(rgb[i], 0, 255);
				}
				if (!a && a != 0) {
					a = 1;
				} else {
					a = scale(a, 0, 1);
				}
				rgb[3] = a;
				return rgb;
			}

			function getHsla(string) {
				if (!string) {
					return;
				}
				var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
				var match = string.match(hsl);
				if (match) {
					var alpha = parseFloat(match[4]);
					var h = scale(parseInt(match[1]), 0, 360),
					    s = scale(parseFloat(match[2]), 0, 100),
					    l = scale(parseFloat(match[3]), 0, 100),
					    a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
					return [h, s, l, a];
				}
			}

			function getHwb(string) {
				if (!string) {
					return;
				}
				var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
				var match = string.match(hwb);
				if (match) {
					var alpha = parseFloat(match[4]);
					var h = scale(parseInt(match[1]), 0, 360),
					    w = scale(parseFloat(match[2]), 0, 100),
					    b = scale(parseFloat(match[3]), 0, 100),
					    a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
					return [h, w, b, a];
				}
			}

			function getRgb(string) {
				var rgba = getRgba(string);
				return rgba && rgba.slice(0, 3);
			}

			function getHsl(string) {
				var hsla = getHsla(string);
				return hsla && hsla.slice(0, 3);
			}

			function getAlpha(string) {
				var vals = getRgba(string);
				if (vals) {
					return vals[3];
				} else if (vals = getHsla(string)) {
					return vals[3];
				} else if (vals = getHwb(string)) {
					return vals[3];
				}
			}

			// generators
			function hexString(rgb) {
				return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1]) + hexDouble(rgb[2]);
			}

			function rgbString(rgba, alpha) {
				if (alpha < 1 || rgba[3] && rgba[3] < 1) {
					return rgbaString(rgba, alpha);
				}
				return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
			}

			function rgbaString(rgba, alpha) {
				if (alpha === undefined) {
					alpha = rgba[3] !== undefined ? rgba[3] : 1;
				}
				return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + alpha + ")";
			}

			function percentString(rgba, alpha) {
				if (alpha < 1 || rgba[3] && rgba[3] < 1) {
					return percentaString(rgba, alpha);
				}
				var r = Math.round(rgba[0] / 255 * 100),
				    g = Math.round(rgba[1] / 255 * 100),
				    b = Math.round(rgba[2] / 255 * 100);

				return "rgb(" + r + "%, " + g + "%, " + b + "%)";
			}

			function percentaString(rgba, alpha) {
				var r = Math.round(rgba[0] / 255 * 100),
				    g = Math.round(rgba[1] / 255 * 100),
				    b = Math.round(rgba[2] / 255 * 100);
				return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
			}

			function hslString(hsla, alpha) {
				if (alpha < 1 || hsla[3] && hsla[3] < 1) {
					return hslaString(hsla, alpha);
				}
				return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
			}

			function hslaString(hsla, alpha) {
				if (alpha === undefined) {
					alpha = hsla[3] !== undefined ? hsla[3] : 1;
				}
				return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + alpha + ")";
			}

			// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
			// (hwb have alpha optional & 1 is default value)
			function hwbString(hwb, alpha) {
				if (alpha === undefined) {
					alpha = hwb[3] !== undefined ? hwb[3] : 1;
				}
				return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%" + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
			}

			function keyword(rgb) {
				return reverseNames[rgb.slice(0, 3)];
			}

			// helpers
			function scale(num, min, max) {
				return Math.min(Math.max(min, num), max);
			}

			function hexDouble(num) {
				var str = num.toString(16).toUpperCase();
				return str.length < 2 ? "0" + str : str;
			}

			//create a list of reverse color names
			var reverseNames = {};
			for (var name in colorNames) {
				reverseNames[colorNames[name]] = name;
			}
		}, { "6": 6 }], 3: [function (require, module, exports) {
			/* MIT license */
			var convert = require(5);
			var string = require(2);

			var Color = function Color(obj) {
				if (obj instanceof Color) {
					return obj;
				}
				if (!(this instanceof Color)) {
					return new Color(obj);
				}

				this.values = {
					rgb: [0, 0, 0],
					hsl: [0, 0, 0],
					hsv: [0, 0, 0],
					hwb: [0, 0, 0],
					cmyk: [0, 0, 0, 0],
					alpha: 1
				};

				// parse Color() argument
				var vals;
				if (typeof obj === 'string') {
					vals = string.getRgba(obj);
					if (vals) {
						this.setValues('rgb', vals);
					} else if (vals = string.getHsla(obj)) {
						this.setValues('hsl', vals);
					} else if (vals = string.getHwb(obj)) {
						this.setValues('hwb', vals);
					} else {
						throw new Error('Unable to parse color from string "' + obj + '"');
					}
				} else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
					vals = obj;
					if (vals.r !== undefined || vals.red !== undefined) {
						this.setValues('rgb', vals);
					} else if (vals.l !== undefined || vals.lightness !== undefined) {
						this.setValues('hsl', vals);
					} else if (vals.v !== undefined || vals.value !== undefined) {
						this.setValues('hsv', vals);
					} else if (vals.w !== undefined || vals.whiteness !== undefined) {
						this.setValues('hwb', vals);
					} else if (vals.c !== undefined || vals.cyan !== undefined) {
						this.setValues('cmyk', vals);
					} else {
						throw new Error('Unable to parse color from object ' + JSON.stringify(obj));
					}
				}
			};

			Color.prototype = {
				rgb: function rgb() {
					return this.setSpace('rgb', arguments);
				},
				hsl: function hsl() {
					return this.setSpace('hsl', arguments);
				},
				hsv: function hsv() {
					return this.setSpace('hsv', arguments);
				},
				hwb: function hwb() {
					return this.setSpace('hwb', arguments);
				},
				cmyk: function cmyk() {
					return this.setSpace('cmyk', arguments);
				},

				rgbArray: function rgbArray() {
					return this.values.rgb;
				},
				hslArray: function hslArray() {
					return this.values.hsl;
				},
				hsvArray: function hsvArray() {
					return this.values.hsv;
				},
				hwbArray: function hwbArray() {
					var values = this.values;
					if (values.alpha !== 1) {
						return values.hwb.concat([values.alpha]);
					}
					return values.hwb;
				},
				cmykArray: function cmykArray() {
					return this.values.cmyk;
				},
				rgbaArray: function rgbaArray() {
					var values = this.values;
					return values.rgb.concat([values.alpha]);
				},
				hslaArray: function hslaArray() {
					var values = this.values;
					return values.hsl.concat([values.alpha]);
				},
				alpha: function alpha(val) {
					if (val === undefined) {
						return this.values.alpha;
					}
					this.setValues('alpha', val);
					return this;
				},

				red: function red(val) {
					return this.setChannel('rgb', 0, val);
				},
				green: function green(val) {
					return this.setChannel('rgb', 1, val);
				},
				blue: function blue(val) {
					return this.setChannel('rgb', 2, val);
				},
				hue: function hue(val) {
					if (val) {
						val %= 360;
						val = val < 0 ? 360 + val : val;
					}
					return this.setChannel('hsl', 0, val);
				},
				saturation: function saturation(val) {
					return this.setChannel('hsl', 1, val);
				},
				lightness: function lightness(val) {
					return this.setChannel('hsl', 2, val);
				},
				saturationv: function saturationv(val) {
					return this.setChannel('hsv', 1, val);
				},
				whiteness: function whiteness(val) {
					return this.setChannel('hwb', 1, val);
				},
				blackness: function blackness(val) {
					return this.setChannel('hwb', 2, val);
				},
				value: function value(val) {
					return this.setChannel('hsv', 2, val);
				},
				cyan: function cyan(val) {
					return this.setChannel('cmyk', 0, val);
				},
				magenta: function magenta(val) {
					return this.setChannel('cmyk', 1, val);
				},
				yellow: function yellow(val) {
					return this.setChannel('cmyk', 2, val);
				},
				black: function black(val) {
					return this.setChannel('cmyk', 3, val);
				},

				hexString: function hexString() {
					return string.hexString(this.values.rgb);
				},
				rgbString: function rgbString() {
					return string.rgbString(this.values.rgb, this.values.alpha);
				},
				rgbaString: function rgbaString() {
					return string.rgbaString(this.values.rgb, this.values.alpha);
				},
				percentString: function percentString() {
					return string.percentString(this.values.rgb, this.values.alpha);
				},
				hslString: function hslString() {
					return string.hslString(this.values.hsl, this.values.alpha);
				},
				hslaString: function hslaString() {
					return string.hslaString(this.values.hsl, this.values.alpha);
				},
				hwbString: function hwbString() {
					return string.hwbString(this.values.hwb, this.values.alpha);
				},
				keyword: function keyword() {
					return string.keyword(this.values.rgb, this.values.alpha);
				},

				rgbNumber: function rgbNumber() {
					var rgb = this.values.rgb;
					return rgb[0] << 16 | rgb[1] << 8 | rgb[2];
				},

				luminosity: function luminosity() {
					// http://www.w3.org/TR/WCAG20/#relativeluminancedef
					var rgb = this.values.rgb;
					var lum = [];
					for (var i = 0; i < rgb.length; i++) {
						var chan = rgb[i] / 255;
						lum[i] = chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
					}
					return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
				},

				contrast: function contrast(color2) {
					// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
					var lum1 = this.luminosity();
					var lum2 = color2.luminosity();
					if (lum1 > lum2) {
						return (lum1 + 0.05) / (lum2 + 0.05);
					}
					return (lum2 + 0.05) / (lum1 + 0.05);
				},

				level: function level(color2) {
					var contrastRatio = this.contrast(color2);
					if (contrastRatio >= 7.1) {
						return 'AAA';
					}

					return contrastRatio >= 4.5 ? 'AA' : '';
				},

				dark: function dark() {
					// YIQ equation from http://24ways.org/2010/calculating-color-contrast
					var rgb = this.values.rgb;
					var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
					return yiq < 128;
				},

				light: function light() {
					return !this.dark();
				},

				negate: function negate() {
					var rgb = [];
					for (var i = 0; i < 3; i++) {
						rgb[i] = 255 - this.values.rgb[i];
					}
					this.setValues('rgb', rgb);
					return this;
				},

				lighten: function lighten(ratio) {
					var hsl = this.values.hsl;
					hsl[2] += hsl[2] * ratio;
					this.setValues('hsl', hsl);
					return this;
				},

				darken: function darken(ratio) {
					var hsl = this.values.hsl;
					hsl[2] -= hsl[2] * ratio;
					this.setValues('hsl', hsl);
					return this;
				},

				saturate: function saturate(ratio) {
					var hsl = this.values.hsl;
					hsl[1] += hsl[1] * ratio;
					this.setValues('hsl', hsl);
					return this;
				},

				desaturate: function desaturate(ratio) {
					var hsl = this.values.hsl;
					hsl[1] -= hsl[1] * ratio;
					this.setValues('hsl', hsl);
					return this;
				},

				whiten: function whiten(ratio) {
					var hwb = this.values.hwb;
					hwb[1] += hwb[1] * ratio;
					this.setValues('hwb', hwb);
					return this;
				},

				blacken: function blacken(ratio) {
					var hwb = this.values.hwb;
					hwb[2] += hwb[2] * ratio;
					this.setValues('hwb', hwb);
					return this;
				},

				greyscale: function greyscale() {
					var rgb = this.values.rgb;
					// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
					var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
					this.setValues('rgb', [val, val, val]);
					return this;
				},

				clearer: function clearer(ratio) {
					var alpha = this.values.alpha;
					this.setValues('alpha', alpha - alpha * ratio);
					return this;
				},

				opaquer: function opaquer(ratio) {
					var alpha = this.values.alpha;
					this.setValues('alpha', alpha + alpha * ratio);
					return this;
				},

				rotate: function rotate(degrees) {
					var hsl = this.values.hsl;
					var hue = (hsl[0] + degrees) % 360;
					hsl[0] = hue < 0 ? 360 + hue : hue;
					this.setValues('hsl', hsl);
					return this;
				},

				/**
     * Ported from sass implementation in C
     * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
     */
				mix: function mix(mixinColor, weight) {
					var color1 = this;
					var color2 = mixinColor;
					var p = weight === undefined ? 0.5 : weight;

					var w = 2 * p - 1;
					var a = color1.alpha() - color2.alpha();

					var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
					var w2 = 1 - w1;

					return this.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue()).alpha(color1.alpha() * p + color2.alpha() * (1 - p));
				},

				toJSON: function toJSON() {
					return this.rgb();
				},

				clone: function clone() {
					// NOTE(SB): using node-clone creates a dependency to Buffer when using browserify,
					// making the final build way to big to embed in Chart.js. So let's do it manually,
					// assuming that values to clone are 1 dimension arrays containing only numbers,
					// except 'alpha' which is a number.
					var result = new Color();
					var source = this.values;
					var target = result.values;
					var value, type;

					for (var prop in source) {
						if (source.hasOwnProperty(prop)) {
							value = source[prop];
							type = {}.toString.call(value);
							if (type === '[object Array]') {
								target[prop] = value.slice(0);
							} else if (type === '[object Number]') {
								target[prop] = value;
							} else {
								console.error('unexpected color value:', value);
							}
						}
					}

					return result;
				}
			};

			Color.prototype.spaces = {
				rgb: ['red', 'green', 'blue'],
				hsl: ['hue', 'saturation', 'lightness'],
				hsv: ['hue', 'saturation', 'value'],
				hwb: ['hue', 'whiteness', 'blackness'],
				cmyk: ['cyan', 'magenta', 'yellow', 'black']
			};

			Color.prototype.maxes = {
				rgb: [255, 255, 255],
				hsl: [360, 100, 100],
				hsv: [360, 100, 100],
				hwb: [360, 100, 100],
				cmyk: [100, 100, 100, 100]
			};

			Color.prototype.getValues = function (space) {
				var values = this.values;
				var vals = {};

				for (var i = 0; i < space.length; i++) {
					vals[space.charAt(i)] = values[space][i];
				}

				if (values.alpha !== 1) {
					vals.a = values.alpha;
				}

				// {r: 255, g: 255, b: 255, a: 0.4}
				return vals;
			};

			Color.prototype.setValues = function (space, vals) {
				var values = this.values;
				var spaces = this.spaces;
				var maxes = this.maxes;
				var alpha = 1;
				var i;

				if (space === 'alpha') {
					alpha = vals;
				} else if (vals.length) {
					// [10, 10, 10]
					values[space] = vals.slice(0, space.length);
					alpha = vals[space.length];
				} else if (vals[space.charAt(0)] !== undefined) {
					// {r: 10, g: 10, b: 10}
					for (i = 0; i < space.length; i++) {
						values[space][i] = vals[space.charAt(i)];
					}

					alpha = vals.a;
				} else if (vals[spaces[space][0]] !== undefined) {
					// {red: 10, green: 10, blue: 10}
					var chans = spaces[space];

					for (i = 0; i < space.length; i++) {
						values[space][i] = vals[chans[i]];
					}

					alpha = vals.alpha;
				}

				values.alpha = Math.max(0, Math.min(1, alpha === undefined ? values.alpha : alpha));

				if (space === 'alpha') {
					return false;
				}

				var capped;

				// cap values of the space prior converting all values
				for (i = 0; i < space.length; i++) {
					capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));
					values[space][i] = Math.round(capped);
				}

				// convert to all the other color spaces
				for (var sname in spaces) {
					if (sname !== space) {
						values[sname] = convert[space][sname](values[space]);
					}
				}

				return true;
			};

			Color.prototype.setSpace = function (space, args) {
				var vals = args[0];

				if (vals === undefined) {
					// color.rgb()
					return this.getValues(space);
				}

				// color.rgb(10, 10, 10)
				if (typeof vals === 'number') {
					vals = Array.prototype.slice.call(args);
				}

				this.setValues(space, vals);
				return this;
			};

			Color.prototype.setChannel = function (space, index, val) {
				var svalues = this.values[space];
				if (val === undefined) {
					// color.red()
					return svalues[index];
				} else if (val === svalues[index]) {
					// color.red(color.red())
					return this;
				}

				// color.red(100)
				svalues[index] = val;
				this.setValues(space, svalues);

				return this;
			};

			if (typeof window !== 'undefined') {
				window.Color = Color;
			}

			module.exports = Color;
		}, { "2": 2, "5": 5 }], 4: [function (require, module, exports) {
			/* MIT license */

			module.exports = {
				rgb2hsl: rgb2hsl,
				rgb2hsv: rgb2hsv,
				rgb2hwb: rgb2hwb,
				rgb2cmyk: rgb2cmyk,
				rgb2keyword: rgb2keyword,
				rgb2xyz: rgb2xyz,
				rgb2lab: rgb2lab,
				rgb2lch: rgb2lch,

				hsl2rgb: hsl2rgb,
				hsl2hsv: hsl2hsv,
				hsl2hwb: hsl2hwb,
				hsl2cmyk: hsl2cmyk,
				hsl2keyword: hsl2keyword,

				hsv2rgb: hsv2rgb,
				hsv2hsl: hsv2hsl,
				hsv2hwb: hsv2hwb,
				hsv2cmyk: hsv2cmyk,
				hsv2keyword: hsv2keyword,

				hwb2rgb: hwb2rgb,
				hwb2hsl: hwb2hsl,
				hwb2hsv: hwb2hsv,
				hwb2cmyk: hwb2cmyk,
				hwb2keyword: hwb2keyword,

				cmyk2rgb: cmyk2rgb,
				cmyk2hsl: cmyk2hsl,
				cmyk2hsv: cmyk2hsv,
				cmyk2hwb: cmyk2hwb,
				cmyk2keyword: cmyk2keyword,

				keyword2rgb: keyword2rgb,
				keyword2hsl: keyword2hsl,
				keyword2hsv: keyword2hsv,
				keyword2hwb: keyword2hwb,
				keyword2cmyk: keyword2cmyk,
				keyword2lab: keyword2lab,
				keyword2xyz: keyword2xyz,

				xyz2rgb: xyz2rgb,
				xyz2lab: xyz2lab,
				xyz2lch: xyz2lch,

				lab2xyz: lab2xyz,
				lab2rgb: lab2rgb,
				lab2lch: lab2lch,

				lch2lab: lch2lab,
				lch2xyz: lch2xyz,
				lch2rgb: lch2rgb
			};

			function rgb2hsl(rgb) {
				var r = rgb[0] / 255,
				    g = rgb[1] / 255,
				    b = rgb[2] / 255,
				    min = Math.min(r, g, b),
				    max = Math.max(r, g, b),
				    delta = max - min,
				    h,
				    s,
				    l;

				if (max == min) h = 0;else if (r == max) h = (g - b) / delta;else if (g == max) h = 2 + (b - r) / delta;else if (b == max) h = 4 + (r - g) / delta;

				h = Math.min(h * 60, 360);

				if (h < 0) h += 360;

				l = (min + max) / 2;

				if (max == min) s = 0;else if (l <= 0.5) s = delta / (max + min);else s = delta / (2 - max - min);

				return [h, s * 100, l * 100];
			}

			function rgb2hsv(rgb) {
				var r = rgb[0],
				    g = rgb[1],
				    b = rgb[2],
				    min = Math.min(r, g, b),
				    max = Math.max(r, g, b),
				    delta = max - min,
				    h,
				    s,
				    v;

				if (max == 0) s = 0;else s = delta / max * 1000 / 10;

				if (max == min) h = 0;else if (r == max) h = (g - b) / delta;else if (g == max) h = 2 + (b - r) / delta;else if (b == max) h = 4 + (r - g) / delta;

				h = Math.min(h * 60, 360);

				if (h < 0) h += 360;

				v = max / 255 * 1000 / 10;

				return [h, s, v];
			}

			function rgb2hwb(rgb) {
				var r = rgb[0],
				    g = rgb[1],
				    b = rgb[2],
				    h = rgb2hsl(rgb)[0],
				    w = 1 / 255 * Math.min(r, Math.min(g, b)),
				    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

				return [h, w * 100, b * 100];
			}

			function rgb2cmyk(rgb) {
				var r = rgb[0] / 255,
				    g = rgb[1] / 255,
				    b = rgb[2] / 255,
				    c,
				    m,
				    y,
				    k;

				k = Math.min(1 - r, 1 - g, 1 - b);
				c = (1 - r - k) / (1 - k) || 0;
				m = (1 - g - k) / (1 - k) || 0;
				y = (1 - b - k) / (1 - k) || 0;
				return [c * 100, m * 100, y * 100, k * 100];
			}

			function rgb2keyword(rgb) {
				return reverseKeywords[JSON.stringify(rgb)];
			}

			function rgb2xyz(rgb) {
				var r = rgb[0] / 255,
				    g = rgb[1] / 255,
				    b = rgb[2] / 255;

				// assume sRGB
				r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
				g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
				b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

				var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
				var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
				var z = r * 0.0193 + g * 0.1192 + b * 0.9505;

				return [x * 100, y * 100, z * 100];
			}

			function rgb2lab(rgb) {
				var xyz = rgb2xyz(rgb),
				    x = xyz[0],
				    y = xyz[1],
				    z = xyz[2],
				    l,
				    a,
				    b;

				x /= 95.047;
				y /= 100;
				z /= 108.883;

				x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
				y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
				z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

				l = 116 * y - 16;
				a = 500 * (x - y);
				b = 200 * (y - z);

				return [l, a, b];
			}

			function rgb2lch(args) {
				return lab2lch(rgb2lab(args));
			}

			function hsl2rgb(hsl) {
				var h = hsl[0] / 360,
				    s = hsl[1] / 100,
				    l = hsl[2] / 100,
				    t1,
				    t2,
				    t3,
				    rgb,
				    val;

				if (s == 0) {
					val = l * 255;
					return [val, val, val];
				}

				if (l < 0.5) t2 = l * (1 + s);else t2 = l + s - l * s;
				t1 = 2 * l - t2;

				rgb = [0, 0, 0];
				for (var i = 0; i < 3; i++) {
					t3 = h + 1 / 3 * -(i - 1);
					t3 < 0 && t3++;
					t3 > 1 && t3--;

					if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3;else if (2 * t3 < 1) val = t2;else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;else val = t1;

					rgb[i] = val * 255;
				}

				return rgb;
			}

			function hsl2hsv(hsl) {
				var h = hsl[0],
				    s = hsl[1] / 100,
				    l = hsl[2] / 100,
				    sv,
				    v;

				if (l === 0) {
					// no need to do calc on black
					// also avoids divide by 0 error
					return [0, 0, 0];
				}

				l *= 2;
				s *= l <= 1 ? l : 2 - l;
				v = (l + s) / 2;
				sv = 2 * s / (l + s);
				return [h, sv * 100, v * 100];
			}

			function hsl2hwb(args) {
				return rgb2hwb(hsl2rgb(args));
			}

			function hsl2cmyk(args) {
				return rgb2cmyk(hsl2rgb(args));
			}

			function hsl2keyword(args) {
				return rgb2keyword(hsl2rgb(args));
			}

			function hsv2rgb(hsv) {
				var h = hsv[0] / 60,
				    s = hsv[1] / 100,
				    v = hsv[2] / 100,
				    hi = Math.floor(h) % 6;

				var f = h - Math.floor(h),
				    p = 255 * v * (1 - s),
				    q = 255 * v * (1 - s * f),
				    t = 255 * v * (1 - s * (1 - f)),
				    v = 255 * v;

				switch (hi) {
					case 0:
						return [v, t, p];
					case 1:
						return [q, v, p];
					case 2:
						return [p, v, t];
					case 3:
						return [p, q, v];
					case 4:
						return [t, p, v];
					case 5:
						return [v, p, q];
				}
			}

			function hsv2hsl(hsv) {
				var h = hsv[0],
				    s = hsv[1] / 100,
				    v = hsv[2] / 100,
				    sl,
				    l;

				l = (2 - s) * v;
				sl = s * v;
				sl /= l <= 1 ? l : 2 - l;
				sl = sl || 0;
				l /= 2;
				return [h, sl * 100, l * 100];
			}

			function hsv2hwb(args) {
				return rgb2hwb(hsv2rgb(args));
			}

			function hsv2cmyk(args) {
				return rgb2cmyk(hsv2rgb(args));
			}

			function hsv2keyword(args) {
				return rgb2keyword(hsv2rgb(args));
			}

			// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
			function hwb2rgb(hwb) {
				var h = hwb[0] / 360,
				    wh = hwb[1] / 100,
				    bl = hwb[2] / 100,
				    ratio = wh + bl,
				    i,
				    v,
				    f,
				    n;

				// wh + bl cant be > 1
				if (ratio > 1) {
					wh /= ratio;
					bl /= ratio;
				}

				i = Math.floor(6 * h);
				v = 1 - bl;
				f = 6 * h - i;
				if ((i & 0x01) != 0) {
					f = 1 - f;
				}
				n = wh + f * (v - wh); // linear interpolation

				switch (i) {
					default:
					case 6:
					case 0:
						r = v;g = n;b = wh;break;
					case 1:
						r = n;g = v;b = wh;break;
					case 2:
						r = wh;g = v;b = n;break;
					case 3:
						r = wh;g = n;b = v;break;
					case 4:
						r = n;g = wh;b = v;break;
					case 5:
						r = v;g = wh;b = n;break;
				}

				return [r * 255, g * 255, b * 255];
			}

			function hwb2hsl(args) {
				return rgb2hsl(hwb2rgb(args));
			}

			function hwb2hsv(args) {
				return rgb2hsv(hwb2rgb(args));
			}

			function hwb2cmyk(args) {
				return rgb2cmyk(hwb2rgb(args));
			}

			function hwb2keyword(args) {
				return rgb2keyword(hwb2rgb(args));
			}

			function cmyk2rgb(cmyk) {
				var c = cmyk[0] / 100,
				    m = cmyk[1] / 100,
				    y = cmyk[2] / 100,
				    k = cmyk[3] / 100,
				    r,
				    g,
				    b;

				r = 1 - Math.min(1, c * (1 - k) + k);
				g = 1 - Math.min(1, m * (1 - k) + k);
				b = 1 - Math.min(1, y * (1 - k) + k);
				return [r * 255, g * 255, b * 255];
			}

			function cmyk2hsl(args) {
				return rgb2hsl(cmyk2rgb(args));
			}

			function cmyk2hsv(args) {
				return rgb2hsv(cmyk2rgb(args));
			}

			function cmyk2hwb(args) {
				return rgb2hwb(cmyk2rgb(args));
			}

			function cmyk2keyword(args) {
				return rgb2keyword(cmyk2rgb(args));
			}

			function xyz2rgb(xyz) {
				var x = xyz[0] / 100,
				    y = xyz[1] / 100,
				    z = xyz[2] / 100,
				    r,
				    g,
				    b;

				r = x * 3.2406 + y * -1.5372 + z * -0.4986;
				g = x * -0.9689 + y * 1.8758 + z * 0.0415;
				b = x * 0.0557 + y * -0.2040 + z * 1.0570;

				// assume sRGB
				r = r > 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : r = r * 12.92;

				g = g > 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : g = g * 12.92;

				b = b > 0.0031308 ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055 : b = b * 12.92;

				r = Math.min(Math.max(0, r), 1);
				g = Math.min(Math.max(0, g), 1);
				b = Math.min(Math.max(0, b), 1);

				return [r * 255, g * 255, b * 255];
			}

			function xyz2lab(xyz) {
				var x = xyz[0],
				    y = xyz[1],
				    z = xyz[2],
				    l,
				    a,
				    b;

				x /= 95.047;
				y /= 100;
				z /= 108.883;

				x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
				y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
				z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

				l = 116 * y - 16;
				a = 500 * (x - y);
				b = 200 * (y - z);

				return [l, a, b];
			}

			function xyz2lch(args) {
				return lab2lch(xyz2lab(args));
			}

			function lab2xyz(lab) {
				var l = lab[0],
				    a = lab[1],
				    b = lab[2],
				    x,
				    y,
				    z,
				    y2;

				if (l <= 8) {
					y = l * 100 / 903.3;
					y2 = 7.787 * (y / 100) + 16 / 116;
				} else {
					y = 100 * Math.pow((l + 16) / 116, 3);
					y2 = Math.pow(y / 100, 1 / 3);
				}

				x = x / 95.047 <= 0.008856 ? x = 95.047 * (a / 500 + y2 - 16 / 116) / 7.787 : 95.047 * Math.pow(a / 500 + y2, 3);

				z = z / 108.883 <= 0.008859 ? z = 108.883 * (y2 - b / 200 - 16 / 116) / 7.787 : 108.883 * Math.pow(y2 - b / 200, 3);

				return [x, y, z];
			}

			function lab2lch(lab) {
				var l = lab[0],
				    a = lab[1],
				    b = lab[2],
				    hr,
				    h,
				    c;

				hr = Math.atan2(b, a);
				h = hr * 360 / 2 / Math.PI;
				if (h < 0) {
					h += 360;
				}
				c = Math.sqrt(a * a + b * b);
				return [l, c, h];
			}

			function lab2rgb(args) {
				return xyz2rgb(lab2xyz(args));
			}

			function lch2lab(lch) {
				var l = lch[0],
				    c = lch[1],
				    h = lch[2],
				    a,
				    b,
				    hr;

				hr = h / 360 * 2 * Math.PI;
				a = c * Math.cos(hr);
				b = c * Math.sin(hr);
				return [l, a, b];
			}

			function lch2xyz(args) {
				return lab2xyz(lch2lab(args));
			}

			function lch2rgb(args) {
				return lab2rgb(lch2lab(args));
			}

			function keyword2rgb(keyword) {
				return cssKeywords[keyword];
			}

			function keyword2hsl(args) {
				return rgb2hsl(keyword2rgb(args));
			}

			function keyword2hsv(args) {
				return rgb2hsv(keyword2rgb(args));
			}

			function keyword2hwb(args) {
				return rgb2hwb(keyword2rgb(args));
			}

			function keyword2cmyk(args) {
				return rgb2cmyk(keyword2rgb(args));
			}

			function keyword2lab(args) {
				return rgb2lab(keyword2rgb(args));
			}

			function keyword2xyz(args) {
				return rgb2xyz(keyword2rgb(args));
			}

			var cssKeywords = {
				aliceblue: [240, 248, 255],
				antiquewhite: [250, 235, 215],
				aqua: [0, 255, 255],
				aquamarine: [127, 255, 212],
				azure: [240, 255, 255],
				beige: [245, 245, 220],
				bisque: [255, 228, 196],
				black: [0, 0, 0],
				blanchedalmond: [255, 235, 205],
				blue: [0, 0, 255],
				blueviolet: [138, 43, 226],
				brown: [165, 42, 42],
				burlywood: [222, 184, 135],
				cadetblue: [95, 158, 160],
				chartreuse: [127, 255, 0],
				chocolate: [210, 105, 30],
				coral: [255, 127, 80],
				cornflowerblue: [100, 149, 237],
				cornsilk: [255, 248, 220],
				crimson: [220, 20, 60],
				cyan: [0, 255, 255],
				darkblue: [0, 0, 139],
				darkcyan: [0, 139, 139],
				darkgoldenrod: [184, 134, 11],
				darkgray: [169, 169, 169],
				darkgreen: [0, 100, 0],
				darkgrey: [169, 169, 169],
				darkkhaki: [189, 183, 107],
				darkmagenta: [139, 0, 139],
				darkolivegreen: [85, 107, 47],
				darkorange: [255, 140, 0],
				darkorchid: [153, 50, 204],
				darkred: [139, 0, 0],
				darksalmon: [233, 150, 122],
				darkseagreen: [143, 188, 143],
				darkslateblue: [72, 61, 139],
				darkslategray: [47, 79, 79],
				darkslategrey: [47, 79, 79],
				darkturquoise: [0, 206, 209],
				darkviolet: [148, 0, 211],
				deeppink: [255, 20, 147],
				deepskyblue: [0, 191, 255],
				dimgray: [105, 105, 105],
				dimgrey: [105, 105, 105],
				dodgerblue: [30, 144, 255],
				firebrick: [178, 34, 34],
				floralwhite: [255, 250, 240],
				forestgreen: [34, 139, 34],
				fuchsia: [255, 0, 255],
				gainsboro: [220, 220, 220],
				ghostwhite: [248, 248, 255],
				gold: [255, 215, 0],
				goldenrod: [218, 165, 32],
				gray: [128, 128, 128],
				green: [0, 128, 0],
				greenyellow: [173, 255, 47],
				grey: [128, 128, 128],
				honeydew: [240, 255, 240],
				hotpink: [255, 105, 180],
				indianred: [205, 92, 92],
				indigo: [75, 0, 130],
				ivory: [255, 255, 240],
				khaki: [240, 230, 140],
				lavender: [230, 230, 250],
				lavenderblush: [255, 240, 245],
				lawngreen: [124, 252, 0],
				lemonchiffon: [255, 250, 205],
				lightblue: [173, 216, 230],
				lightcoral: [240, 128, 128],
				lightcyan: [224, 255, 255],
				lightgoldenrodyellow: [250, 250, 210],
				lightgray: [211, 211, 211],
				lightgreen: [144, 238, 144],
				lightgrey: [211, 211, 211],
				lightpink: [255, 182, 193],
				lightsalmon: [255, 160, 122],
				lightseagreen: [32, 178, 170],
				lightskyblue: [135, 206, 250],
				lightslategray: [119, 136, 153],
				lightslategrey: [119, 136, 153],
				lightsteelblue: [176, 196, 222],
				lightyellow: [255, 255, 224],
				lime: [0, 255, 0],
				limegreen: [50, 205, 50],
				linen: [250, 240, 230],
				magenta: [255, 0, 255],
				maroon: [128, 0, 0],
				mediumaquamarine: [102, 205, 170],
				mediumblue: [0, 0, 205],
				mediumorchid: [186, 85, 211],
				mediumpurple: [147, 112, 219],
				mediumseagreen: [60, 179, 113],
				mediumslateblue: [123, 104, 238],
				mediumspringgreen: [0, 250, 154],
				mediumturquoise: [72, 209, 204],
				mediumvioletred: [199, 21, 133],
				midnightblue: [25, 25, 112],
				mintcream: [245, 255, 250],
				mistyrose: [255, 228, 225],
				moccasin: [255, 228, 181],
				navajowhite: [255, 222, 173],
				navy: [0, 0, 128],
				oldlace: [253, 245, 230],
				olive: [128, 128, 0],
				olivedrab: [107, 142, 35],
				orange: [255, 165, 0],
				orangered: [255, 69, 0],
				orchid: [218, 112, 214],
				palegoldenrod: [238, 232, 170],
				palegreen: [152, 251, 152],
				paleturquoise: [175, 238, 238],
				palevioletred: [219, 112, 147],
				papayawhip: [255, 239, 213],
				peachpuff: [255, 218, 185],
				peru: [205, 133, 63],
				pink: [255, 192, 203],
				plum: [221, 160, 221],
				powderblue: [176, 224, 230],
				purple: [128, 0, 128],
				rebeccapurple: [102, 51, 153],
				red: [255, 0, 0],
				rosybrown: [188, 143, 143],
				royalblue: [65, 105, 225],
				saddlebrown: [139, 69, 19],
				salmon: [250, 128, 114],
				sandybrown: [244, 164, 96],
				seagreen: [46, 139, 87],
				seashell: [255, 245, 238],
				sienna: [160, 82, 45],
				silver: [192, 192, 192],
				skyblue: [135, 206, 235],
				slateblue: [106, 90, 205],
				slategray: [112, 128, 144],
				slategrey: [112, 128, 144],
				snow: [255, 250, 250],
				springgreen: [0, 255, 127],
				steelblue: [70, 130, 180],
				tan: [210, 180, 140],
				teal: [0, 128, 128],
				thistle: [216, 191, 216],
				tomato: [255, 99, 71],
				turquoise: [64, 224, 208],
				violet: [238, 130, 238],
				wheat: [245, 222, 179],
				white: [255, 255, 255],
				whitesmoke: [245, 245, 245],
				yellow: [255, 255, 0],
				yellowgreen: [154, 205, 50]
			};

			var reverseKeywords = {};
			for (var key in cssKeywords) {
				reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
			}
		}, {}], 5: [function (require, module, exports) {
			var conversions = require(4);

			var convert = function convert() {
				return new Converter();
			};

			for (var func in conversions) {
				// export Raw versions
				convert[func + "Raw"] = function (func) {
					// accept array or plain args
					return function (arg) {
						if (typeof arg == "number") arg = Array.prototype.slice.call(arguments);
						return conversions[func](arg);
					};
				}(func);

				var pair = /(\w+)2(\w+)/.exec(func),
				    from = pair[1],
				    to = pair[2];

				// export rgb2hsl and ["rgb"]["hsl"]
				convert[from] = convert[from] || {};

				convert[from][to] = convert[func] = function (func) {
					return function (arg) {
						if (typeof arg == "number") arg = Array.prototype.slice.call(arguments);

						var val = conversions[func](arg);
						if (typeof val == "string" || val === undefined) return val; // keyword

						for (var i = 0; i < val.length; i++) {
							val[i] = Math.round(val[i]);
						}return val;
					};
				}(func);
			}

			/* Converter does lazy conversion and caching */
			var Converter = function Converter() {
				this.convs = {};
			};

			/* Either get the values for a space or
     set the values for a space, depending on args */
			Converter.prototype.routeSpace = function (space, args) {
				var values = args[0];
				if (values === undefined) {
					// color.rgb()
					return this.getValues(space);
				}
				// color.rgb(10, 10, 10)
				if (typeof values == "number") {
					values = Array.prototype.slice.call(args);
				}

				return this.setValues(space, values);
			};

			/* Set the values for a space, invalidating cache */
			Converter.prototype.setValues = function (space, values) {
				this.space = space;
				this.convs = {};
				this.convs[space] = values;
				return this;
			};

			/* Get the values for a space. If there's already
     a conversion for the space, fetch it, otherwise
     compute it */
			Converter.prototype.getValues = function (space) {
				var vals = this.convs[space];
				if (!vals) {
					var fspace = this.space,
					    from = this.convs[fspace];
					vals = convert[fspace][space](from);

					this.convs[space] = vals;
				}
				return vals;
			};

			["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function (space) {
				Converter.prototype[space] = function (vals) {
					return this.routeSpace(space, arguments);
				};
			});

			module.exports = convert;
		}, { "4": 4 }], 6: [function (require, module, exports) {
			module.exports = {
				"aliceblue": [240, 248, 255],
				"antiquewhite": [250, 235, 215],
				"aqua": [0, 255, 255],
				"aquamarine": [127, 255, 212],
				"azure": [240, 255, 255],
				"beige": [245, 245, 220],
				"bisque": [255, 228, 196],
				"black": [0, 0, 0],
				"blanchedalmond": [255, 235, 205],
				"blue": [0, 0, 255],
				"blueviolet": [138, 43, 226],
				"brown": [165, 42, 42],
				"burlywood": [222, 184, 135],
				"cadetblue": [95, 158, 160],
				"chartreuse": [127, 255, 0],
				"chocolate": [210, 105, 30],
				"coral": [255, 127, 80],
				"cornflowerblue": [100, 149, 237],
				"cornsilk": [255, 248, 220],
				"crimson": [220, 20, 60],
				"cyan": [0, 255, 255],
				"darkblue": [0, 0, 139],
				"darkcyan": [0, 139, 139],
				"darkgoldenrod": [184, 134, 11],
				"darkgray": [169, 169, 169],
				"darkgreen": [0, 100, 0],
				"darkgrey": [169, 169, 169],
				"darkkhaki": [189, 183, 107],
				"darkmagenta": [139, 0, 139],
				"darkolivegreen": [85, 107, 47],
				"darkorange": [255, 140, 0],
				"darkorchid": [153, 50, 204],
				"darkred": [139, 0, 0],
				"darksalmon": [233, 150, 122],
				"darkseagreen": [143, 188, 143],
				"darkslateblue": [72, 61, 139],
				"darkslategray": [47, 79, 79],
				"darkslategrey": [47, 79, 79],
				"darkturquoise": [0, 206, 209],
				"darkviolet": [148, 0, 211],
				"deeppink": [255, 20, 147],
				"deepskyblue": [0, 191, 255],
				"dimgray": [105, 105, 105],
				"dimgrey": [105, 105, 105],
				"dodgerblue": [30, 144, 255],
				"firebrick": [178, 34, 34],
				"floralwhite": [255, 250, 240],
				"forestgreen": [34, 139, 34],
				"fuchsia": [255, 0, 255],
				"gainsboro": [220, 220, 220],
				"ghostwhite": [248, 248, 255],
				"gold": [255, 215, 0],
				"goldenrod": [218, 165, 32],
				"gray": [128, 128, 128],
				"green": [0, 128, 0],
				"greenyellow": [173, 255, 47],
				"grey": [128, 128, 128],
				"honeydew": [240, 255, 240],
				"hotpink": [255, 105, 180],
				"indianred": [205, 92, 92],
				"indigo": [75, 0, 130],
				"ivory": [255, 255, 240],
				"khaki": [240, 230, 140],
				"lavender": [230, 230, 250],
				"lavenderblush": [255, 240, 245],
				"lawngreen": [124, 252, 0],
				"lemonchiffon": [255, 250, 205],
				"lightblue": [173, 216, 230],
				"lightcoral": [240, 128, 128],
				"lightcyan": [224, 255, 255],
				"lightgoldenrodyellow": [250, 250, 210],
				"lightgray": [211, 211, 211],
				"lightgreen": [144, 238, 144],
				"lightgrey": [211, 211, 211],
				"lightpink": [255, 182, 193],
				"lightsalmon": [255, 160, 122],
				"lightseagreen": [32, 178, 170],
				"lightskyblue": [135, 206, 250],
				"lightslategray": [119, 136, 153],
				"lightslategrey": [119, 136, 153],
				"lightsteelblue": [176, 196, 222],
				"lightyellow": [255, 255, 224],
				"lime": [0, 255, 0],
				"limegreen": [50, 205, 50],
				"linen": [250, 240, 230],
				"magenta": [255, 0, 255],
				"maroon": [128, 0, 0],
				"mediumaquamarine": [102, 205, 170],
				"mediumblue": [0, 0, 205],
				"mediumorchid": [186, 85, 211],
				"mediumpurple": [147, 112, 219],
				"mediumseagreen": [60, 179, 113],
				"mediumslateblue": [123, 104, 238],
				"mediumspringgreen": [0, 250, 154],
				"mediumturquoise": [72, 209, 204],
				"mediumvioletred": [199, 21, 133],
				"midnightblue": [25, 25, 112],
				"mintcream": [245, 255, 250],
				"mistyrose": [255, 228, 225],
				"moccasin": [255, 228, 181],
				"navajowhite": [255, 222, 173],
				"navy": [0, 0, 128],
				"oldlace": [253, 245, 230],
				"olive": [128, 128, 0],
				"olivedrab": [107, 142, 35],
				"orange": [255, 165, 0],
				"orangered": [255, 69, 0],
				"orchid": [218, 112, 214],
				"palegoldenrod": [238, 232, 170],
				"palegreen": [152, 251, 152],
				"paleturquoise": [175, 238, 238],
				"palevioletred": [219, 112, 147],
				"papayawhip": [255, 239, 213],
				"peachpuff": [255, 218, 185],
				"peru": [205, 133, 63],
				"pink": [255, 192, 203],
				"plum": [221, 160, 221],
				"powderblue": [176, 224, 230],
				"purple": [128, 0, 128],
				"rebeccapurple": [102, 51, 153],
				"red": [255, 0, 0],
				"rosybrown": [188, 143, 143],
				"royalblue": [65, 105, 225],
				"saddlebrown": [139, 69, 19],
				"salmon": [250, 128, 114],
				"sandybrown": [244, 164, 96],
				"seagreen": [46, 139, 87],
				"seashell": [255, 245, 238],
				"sienna": [160, 82, 45],
				"silver": [192, 192, 192],
				"skyblue": [135, 206, 235],
				"slateblue": [106, 90, 205],
				"slategray": [112, 128, 144],
				"slategrey": [112, 128, 144],
				"snow": [255, 250, 250],
				"springgreen": [0, 255, 127],
				"steelblue": [70, 130, 180],
				"tan": [210, 180, 140],
				"teal": [0, 128, 128],
				"thistle": [216, 191, 216],
				"tomato": [255, 99, 71],
				"turquoise": [64, 224, 208],
				"violet": [238, 130, 238],
				"wheat": [245, 222, 179],
				"white": [255, 255, 255],
				"whitesmoke": [245, 245, 245],
				"yellow": [255, 255, 0],
				"yellowgreen": [154, 205, 50]
			};
		}, {}], 7: [function (require, module, exports) {
			/**
    * @namespace Chart
    */
			var Chart = require(28)();

			require(26)(Chart);
			require(22)(Chart);
			require(25)(Chart);
			require(21)(Chart);
			require(23)(Chart);
			require(24)(Chart);
			require(29)(Chart);
			require(33)(Chart);
			require(31)(Chart);
			require(34)(Chart);
			require(32)(Chart);
			require(35)(Chart);
			require(30)(Chart);
			require(27)(Chart);
			require(36)(Chart);

			require(37)(Chart);
			require(38)(Chart);
			require(39)(Chart);
			require(40)(Chart);

			require(43)(Chart);
			require(41)(Chart);
			require(42)(Chart);
			require(44)(Chart);
			require(45)(Chart);
			require(46)(Chart);

			// Controllers must be loaded after elements
			// See Chart.core.datasetController.dataElementType
			require(15)(Chart);
			require(16)(Chart);
			require(17)(Chart);
			require(18)(Chart);
			require(19)(Chart);
			require(20)(Chart);

			require(8)(Chart);
			require(9)(Chart);
			require(10)(Chart);
			require(11)(Chart);
			require(12)(Chart);
			require(13)(Chart);
			require(14)(Chart);

			window.Chart = module.exports = Chart;
		}, { "10": 10, "11": 11, "12": 12, "13": 13, "14": 14, "15": 15, "16": 16, "17": 17, "18": 18, "19": 19, "20": 20, "21": 21, "22": 22, "23": 23, "24": 24, "25": 25, "26": 26, "27": 27, "28": 28, "29": 29, "30": 30, "31": 31, "32": 32, "33": 33, "34": 34, "35": 35, "36": 36, "37": 37, "38": 38, "39": 39, "40": 40, "41": 41, "42": 42, "43": 43, "44": 44, "45": 45, "46": 46, "8": 8, "9": 9 }], 8: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				Chart.Bar = function (context, config) {
					config.type = 'bar';

					return new Chart(context, config);
				};
			};
		}, {}], 9: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				Chart.Bubble = function (context, config) {
					config.type = 'bubble';
					return new Chart(context, config);
				};
			};
		}, {}], 10: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				Chart.Doughnut = function (context, config) {
					config.type = 'doughnut';

					return new Chart(context, config);
				};
			};
		}, {}], 11: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				Chart.Line = function (context, config) {
					config.type = 'line';

					return new Chart(context, config);
				};
			};
		}, {}], 12: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				Chart.PolarArea = function (context, config) {
					config.type = 'polarArea';

					return new Chart(context, config);
				};
			};
		}, {}], 13: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				Chart.Radar = function (context, config) {
					config.type = 'radar';

					return new Chart(context, config);
				};
			};
		}, {}], 14: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var defaultConfig = {
					hover: {
						mode: 'single'
					},

					scales: {
						xAxes: [{
							type: 'linear', // scatter should not use a category axis
							position: 'bottom',
							id: 'x-axis-1' // need an ID so datasets can reference the scale
						}],
						yAxes: [{
							type: 'linear',
							position: 'left',
							id: 'y-axis-1'
						}]
					},

					tooltips: {
						callbacks: {
							title: function title() {
								// Title doesn't make sense for scatter since we format the data as a point
								return '';
							},
							label: function label(tooltipItem) {
								return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
							}
						}
					}
				};

				// Register the default config for this type
				Chart.defaults.scatter = defaultConfig;

				// Scatter charts use line controllers
				Chart.controllers.scatter = Chart.controllers.line;

				Chart.Scatter = function (context, config) {
					config.type = 'scatter';
					return new Chart(context, config);
				};
			};
		}, {}], 15: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.bar = {
					hover: {
						mode: 'label'
					},

					scales: {
						xAxes: [{
							type: 'category',

							// Specific to Bar Controller
							categoryPercentage: 0.8,
							barPercentage: 0.9,

							// grid line settings
							gridLines: {
								offsetGridLines: true
							}
						}],
						yAxes: [{
							type: 'linear'
						}]
					}
				};

				Chart.controllers.bar = Chart.DatasetController.extend({

					dataElementType: Chart.elements.Rectangle,

					initialize: function initialize(chart, datasetIndex) {
						Chart.DatasetController.prototype.initialize.call(this, chart, datasetIndex);

						// Use this to indicate that this is a bar dataset.
						this.getMeta().bar = true;
					},

					// Get the number of datasets that display bars. We use this to correctly calculate the bar width
					getBarCount: function getBarCount() {
						var me = this;
						var barCount = 0;
						helpers.each(me.chart.data.datasets, function (dataset, datasetIndex) {
							var meta = me.chart.getDatasetMeta(datasetIndex);
							if (meta.bar && me.chart.isDatasetVisible(datasetIndex)) {
								++barCount;
							}
						}, me);
						return barCount;
					},

					update: function update(reset) {
						var me = this;
						helpers.each(me.getMeta().data, function (rectangle, index) {
							me.updateElement(rectangle, index, reset);
						}, me);
					},

					updateElement: function updateElement(rectangle, index, reset) {
						var me = this;
						var meta = me.getMeta();
						var xScale = me.getScaleForId(meta.xAxisID);
						var yScale = me.getScaleForId(meta.yAxisID);
						var scaleBase = yScale.getBasePixel();
						var rectangleElementOptions = me.chart.options.elements.rectangle;
						var custom = rectangle.custom || {};
						var dataset = me.getDataset();

						rectangle._xScale = xScale;
						rectangle._yScale = yScale;
						rectangle._datasetIndex = me.index;
						rectangle._index = index;

						var ruler = me.getRuler(index);
						rectangle._model = {
							x: me.calculateBarX(index, me.index, ruler),
							y: reset ? scaleBase : me.calculateBarY(index, me.index),

							// Tooltip
							label: me.chart.data.labels[index],
							datasetLabel: dataset.label,

							// Appearance
							base: reset ? scaleBase : me.calculateBarBase(me.index, index),
							width: me.calculateBarWidth(ruler),
							backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
							borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
							borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
							borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
						};

						rectangle.pivot();
					},

					calculateBarBase: function calculateBarBase(datasetIndex, index) {
						var me = this;
						var meta = me.getMeta();
						var yScale = me.getScaleForId(meta.yAxisID);
						var base = 0;

						if (yScale.options.stacked) {
							var chart = me.chart;
							var datasets = chart.data.datasets;
							var value = Number(datasets[datasetIndex].data[index]);

							for (var i = 0; i < datasetIndex; i++) {
								var currentDs = datasets[i];
								var currentDsMeta = chart.getDatasetMeta(i);
								if (currentDsMeta.bar && currentDsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
									var currentVal = Number(currentDs.data[index]);
									base += value < 0 ? Math.min(currentVal, 0) : Math.max(currentVal, 0);
								}
							}

							return yScale.getPixelForValue(base);
						}

						return yScale.getBasePixel();
					},

					getRuler: function getRuler(index) {
						var me = this;
						var meta = me.getMeta();
						var xScale = me.getScaleForId(meta.xAxisID);
						var datasetCount = me.getBarCount();

						var tickWidth;

						if (xScale.options.type === 'category') {
							tickWidth = xScale.getPixelForTick(index + 1) - xScale.getPixelForTick(index);
						} else {
							// Average width
							tickWidth = xScale.width / xScale.ticks.length;
						}
						var categoryWidth = tickWidth * xScale.options.categoryPercentage;
						var categorySpacing = (tickWidth - tickWidth * xScale.options.categoryPercentage) / 2;
						var fullBarWidth = categoryWidth / datasetCount;

						if (xScale.ticks.length !== me.chart.data.labels.length) {
							var perc = xScale.ticks.length / me.chart.data.labels.length;
							fullBarWidth = fullBarWidth * perc;
						}

						var barWidth = fullBarWidth * xScale.options.barPercentage;
						var barSpacing = fullBarWidth - fullBarWidth * xScale.options.barPercentage;

						return {
							datasetCount: datasetCount,
							tickWidth: tickWidth,
							categoryWidth: categoryWidth,
							categorySpacing: categorySpacing,
							fullBarWidth: fullBarWidth,
							barWidth: barWidth,
							barSpacing: barSpacing
						};
					},

					calculateBarWidth: function calculateBarWidth(ruler) {
						var xScale = this.getScaleForId(this.getMeta().xAxisID);
						if (xScale.options.barThickness) {
							return xScale.options.barThickness;
						}
						return xScale.options.stacked ? ruler.categoryWidth : ruler.barWidth;
					},

					// Get bar index from the given dataset index accounting for the fact that not all bars are visible
					getBarIndex: function getBarIndex(datasetIndex) {
						var barIndex = 0;
						var meta, j;

						for (j = 0; j < datasetIndex; ++j) {
							meta = this.chart.getDatasetMeta(j);
							if (meta.bar && this.chart.isDatasetVisible(j)) {
								++barIndex;
							}
						}

						return barIndex;
					},

					calculateBarX: function calculateBarX(index, datasetIndex, ruler) {
						var me = this;
						var meta = me.getMeta();
						var xScale = me.getScaleForId(meta.xAxisID);
						var barIndex = me.getBarIndex(datasetIndex);
						var leftTick = xScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
						leftTick -= me.chart.isCombo ? ruler.tickWidth / 2 : 0;

						if (xScale.options.stacked) {
							return leftTick + ruler.categoryWidth / 2 + ruler.categorySpacing;
						}

						return leftTick + ruler.barWidth / 2 + ruler.categorySpacing + ruler.barWidth * barIndex + ruler.barSpacing / 2 + ruler.barSpacing * barIndex;
					},

					calculateBarY: function calculateBarY(index, datasetIndex) {
						var me = this;
						var meta = me.getMeta();
						var yScale = me.getScaleForId(meta.yAxisID);
						var value = Number(me.getDataset().data[index]);

						if (yScale.options.stacked) {

							var sumPos = 0,
							    sumNeg = 0;

							for (var i = 0; i < datasetIndex; i++) {
								var ds = me.chart.data.datasets[i];
								var dsMeta = me.chart.getDatasetMeta(i);
								if (dsMeta.bar && dsMeta.yAxisID === yScale.id && me.chart.isDatasetVisible(i)) {
									var stackedVal = Number(ds.data[index]);
									if (stackedVal < 0) {
										sumNeg += stackedVal || 0;
									} else {
										sumPos += stackedVal || 0;
									}
								}
							}

							if (value < 0) {
								return yScale.getPixelForValue(sumNeg + value);
							}
							return yScale.getPixelForValue(sumPos + value);
						}

						return yScale.getPixelForValue(value);
					},

					draw: function draw(ease) {
						var me = this;
						var easingDecimal = ease || 1;
						var metaData = me.getMeta().data;
						var dataset = me.getDataset();
						var i, len;

						for (i = 0, len = metaData.length; i < len; ++i) {
							var d = dataset.data[i];
							if (d !== null && d !== undefined && !isNaN(d)) {
								metaData[i].transition(easingDecimal).draw();
							}
						}
					},

					setHoverStyle: function setHoverStyle(rectangle) {
						var dataset = this.chart.data.datasets[rectangle._datasetIndex];
						var index = rectangle._index;

						var custom = rectangle.custom || {};
						var model = rectangle._model;
						model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.hoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
						model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.hoverBorderColor, index, helpers.getHoverColor(model.borderColor));
						model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
					},

					removeHoverStyle: function removeHoverStyle(rectangle) {
						var dataset = this.chart.data.datasets[rectangle._datasetIndex];
						var index = rectangle._index;
						var custom = rectangle.custom || {};
						var model = rectangle._model;
						var rectangleElementOptions = this.chart.options.elements.rectangle;

						model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor);
						model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor);
						model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth);
					}

				});

				// including horizontalBar in the bar file, instead of a file of its own
				// it extends bar (like pie extends doughnut)
				Chart.defaults.horizontalBar = {
					hover: {
						mode: 'label'
					},

					scales: {
						xAxes: [{
							type: 'linear',
							position: 'bottom'
						}],
						yAxes: [{
							position: 'left',
							type: 'category',

							// Specific to Horizontal Bar Controller
							categoryPercentage: 0.8,
							barPercentage: 0.9,

							// grid line settings
							gridLines: {
								offsetGridLines: true
							}
						}]
					},
					elements: {
						rectangle: {
							borderSkipped: 'left'
						}
					},
					tooltips: {
						callbacks: {
							title: function title(tooltipItems, data) {
								// Pick first xLabel for now
								var title = '';

								if (tooltipItems.length > 0) {
									if (tooltipItems[0].yLabel) {
										title = tooltipItems[0].yLabel;
									} else if (data.labels.length > 0 && tooltipItems[0].index < data.labels.length) {
										title = data.labels[tooltipItems[0].index];
									}
								}

								return title;
							},
							label: function label(tooltipItem, data) {
								var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
								return datasetLabel + ': ' + tooltipItem.xLabel;
							}
						}
					}
				};

				Chart.controllers.horizontalBar = Chart.controllers.bar.extend({
					updateElement: function updateElement(rectangle, index, reset) {
						var me = this;
						var meta = me.getMeta();
						var xScale = me.getScaleForId(meta.xAxisID);
						var yScale = me.getScaleForId(meta.yAxisID);
						var scaleBase = xScale.getBasePixel();
						var custom = rectangle.custom || {};
						var dataset = me.getDataset();
						var rectangleElementOptions = me.chart.options.elements.rectangle;

						rectangle._xScale = xScale;
						rectangle._yScale = yScale;
						rectangle._datasetIndex = me.index;
						rectangle._index = index;

						var ruler = me.getRuler(index);
						rectangle._model = {
							x: reset ? scaleBase : me.calculateBarX(index, me.index),
							y: me.calculateBarY(index, me.index, ruler),

							// Tooltip
							label: me.chart.data.labels[index],
							datasetLabel: dataset.label,

							// Appearance
							base: reset ? scaleBase : me.calculateBarBase(me.index, index),
							height: me.calculateBarHeight(ruler),
							backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
							borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
							borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
							borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
						};
						rectangle.draw = function () {
							var ctx = this._chart.ctx;
							var vm = this._view;

							var halfHeight = vm.height / 2,
							    topY = vm.y - halfHeight,
							    bottomY = vm.y + halfHeight,
							    right = vm.base - (vm.base - vm.x),
							    halfStroke = vm.borderWidth / 2;

							// Canvas doesn't allow us to stroke inside the width so we can
							// adjust the sizes to fit if we're setting a stroke on the line
							if (vm.borderWidth) {
								topY += halfStroke;
								bottomY -= halfStroke;
								right += halfStroke;
							}

							ctx.beginPath();

							ctx.fillStyle = vm.backgroundColor;
							ctx.strokeStyle = vm.borderColor;
							ctx.lineWidth = vm.borderWidth;

							// Corner points, from bottom-left to bottom-right clockwise
							// | 1 2 |
							// | 0 3 |
							var corners = [[vm.base, bottomY], [vm.base, topY], [right, topY], [right, bottomY]];

							// Find first (starting) corner with fallback to 'bottom'
							var borders = ['bottom', 'left', 'top', 'right'];
							var startCorner = borders.indexOf(vm.borderSkipped, 0);
							if (startCorner === -1) {
								startCorner = 0;
							}

							function cornerAt(cornerIndex) {
								return corners[(startCorner + cornerIndex) % 4];
							}

							// Draw rectangle from 'startCorner'
							ctx.moveTo.apply(ctx, cornerAt(0));
							for (var i = 1; i < 4; i++) {
								ctx.lineTo.apply(ctx, cornerAt(i));
							}

							ctx.fill();
							if (vm.borderWidth) {
								ctx.stroke();
							}
						};

						rectangle.pivot();
					},

					calculateBarBase: function calculateBarBase(datasetIndex, index) {
						var me = this;
						var meta = me.getMeta();
						var xScale = me.getScaleForId(meta.xAxisID);
						var base = 0;

						if (xScale.options.stacked) {
							var chart = me.chart;
							var datasets = chart.data.datasets;
							var value = Number(datasets[datasetIndex].data[index]);

							for (var i = 0; i < datasetIndex; i++) {
								var currentDs = datasets[i];
								var currentDsMeta = chart.getDatasetMeta(i);
								if (currentDsMeta.bar && currentDsMeta.xAxisID === xScale.id && chart.isDatasetVisible(i)) {
									var currentVal = Number(currentDs.data[index]);
									base += value < 0 ? Math.min(currentVal, 0) : Math.max(currentVal, 0);
								}
							}

							return xScale.getPixelForValue(base);
						}

						return xScale.getBasePixel();
					},

					getRuler: function getRuler(index) {
						var me = this;
						var meta = me.getMeta();
						var yScale = me.getScaleForId(meta.yAxisID);
						var datasetCount = me.getBarCount();

						var tickHeight;
						if (yScale.options.type === 'category') {
							tickHeight = yScale.getPixelForTick(index + 1) - yScale.getPixelForTick(index);
						} else {
							// Average width
							tickHeight = yScale.width / yScale.ticks.length;
						}
						var categoryHeight = tickHeight * yScale.options.categoryPercentage;
						var categorySpacing = (tickHeight - tickHeight * yScale.options.categoryPercentage) / 2;
						var fullBarHeight = categoryHeight / datasetCount;

						if (yScale.ticks.length !== me.chart.data.labels.length) {
							var perc = yScale.ticks.length / me.chart.data.labels.length;
							fullBarHeight = fullBarHeight * perc;
						}

						var barHeight = fullBarHeight * yScale.options.barPercentage;
						var barSpacing = fullBarHeight - fullBarHeight * yScale.options.barPercentage;

						return {
							datasetCount: datasetCount,
							tickHeight: tickHeight,
							categoryHeight: categoryHeight,
							categorySpacing: categorySpacing,
							fullBarHeight: fullBarHeight,
							barHeight: barHeight,
							barSpacing: barSpacing
						};
					},

					calculateBarHeight: function calculateBarHeight(ruler) {
						var me = this;
						var yScale = me.getScaleForId(me.getMeta().yAxisID);
						if (yScale.options.barThickness) {
							return yScale.options.barThickness;
						}
						return yScale.options.stacked ? ruler.categoryHeight : ruler.barHeight;
					},

					calculateBarX: function calculateBarX(index, datasetIndex) {
						var me = this;
						var meta = me.getMeta();
						var xScale = me.getScaleForId(meta.xAxisID);
						var value = Number(me.getDataset().data[index]);

						if (xScale.options.stacked) {

							var sumPos = 0,
							    sumNeg = 0;

							for (var i = 0; i < datasetIndex; i++) {
								var ds = me.chart.data.datasets[i];
								var dsMeta = me.chart.getDatasetMeta(i);
								if (dsMeta.bar && dsMeta.xAxisID === xScale.id && me.chart.isDatasetVisible(i)) {
									var stackedVal = Number(ds.data[index]);
									if (stackedVal < 0) {
										sumNeg += stackedVal || 0;
									} else {
										sumPos += stackedVal || 0;
									}
								}
							}

							if (value < 0) {
								return xScale.getPixelForValue(sumNeg + value);
							}
							return xScale.getPixelForValue(sumPos + value);
						}

						return xScale.getPixelForValue(value);
					},

					calculateBarY: function calculateBarY(index, datasetIndex, ruler) {
						var me = this;
						var meta = me.getMeta();
						var yScale = me.getScaleForId(meta.yAxisID);
						var barIndex = me.getBarIndex(datasetIndex);
						var topTick = yScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
						topTick -= me.chart.isCombo ? ruler.tickHeight / 2 : 0;

						if (yScale.options.stacked) {
							return topTick + ruler.categoryHeight / 2 + ruler.categorySpacing;
						}

						return topTick + ruler.barHeight / 2 + ruler.categorySpacing + ruler.barHeight * barIndex + ruler.barSpacing / 2 + ruler.barSpacing * barIndex;
					}
				});
			};
		}, {}], 16: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.bubble = {
					hover: {
						mode: 'single'
					},

					scales: {
						xAxes: [{
							type: 'linear', // bubble should probably use a linear scale by default
							position: 'bottom',
							id: 'x-axis-0' // need an ID so datasets can reference the scale
						}],
						yAxes: [{
							type: 'linear',
							position: 'left',
							id: 'y-axis-0'
						}]
					},

					tooltips: {
						callbacks: {
							title: function title() {
								// Title doesn't make sense for scatter since we format the data as a point
								return '';
							},
							label: function label(tooltipItem, data) {
								var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
								var dataPoint = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
								return datasetLabel + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ', ' + dataPoint.r + ')';
							}
						}
					}
				};

				Chart.controllers.bubble = Chart.DatasetController.extend({

					dataElementType: Chart.elements.Point,

					update: function update(reset) {
						var me = this;
						var meta = me.getMeta();
						var points = meta.data;

						// Update Points
						helpers.each(points, function (point, index) {
							me.updateElement(point, index, reset);
						});
					},

					updateElement: function updateElement(point, index, reset) {
						var me = this;
						var meta = me.getMeta();
						var xScale = me.getScaleForId(meta.xAxisID);
						var yScale = me.getScaleForId(meta.yAxisID);

						var custom = point.custom || {};
						var dataset = me.getDataset();
						var data = dataset.data[index];
						var pointElementOptions = me.chart.options.elements.point;
						var dsIndex = me.index;

						helpers.extend(point, {
							// Utility
							_xScale: xScale,
							_yScale: yScale,
							_datasetIndex: dsIndex,
							_index: index,

							// Desired view properties
							_model: {
								x: reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? data : NaN, index, dsIndex, me.chart.isCombo),
								y: reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex),
								// Appearance
								radius: reset ? 0 : custom.radius ? custom.radius : me.getRadius(data),

								// Tooltip
								hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
							}
						});

						// Trick to reset the styles of the point
						Chart.DatasetController.prototype.removeHoverStyle.call(me, point, pointElementOptions);

						var model = point._model;
						model.skip = custom.skip ? custom.skip : isNaN(model.x) || isNaN(model.y);

						point.pivot();
					},

					getRadius: function getRadius(value) {
						return value.r || this.chart.options.elements.point.radius;
					},

					setHoverStyle: function setHoverStyle(point) {
						var me = this;
						Chart.DatasetController.prototype.setHoverStyle.call(me, point);

						// Radius
						var dataset = me.chart.data.datasets[point._datasetIndex];
						var index = point._index;
						var custom = point.custom || {};
						var model = point._model;
						model.radius = custom.hoverRadius ? custom.hoverRadius : helpers.getValueAtIndexOrDefault(dataset.hoverRadius, index, me.chart.options.elements.point.hoverRadius) + me.getRadius(dataset.data[index]);
					},

					removeHoverStyle: function removeHoverStyle(point) {
						var me = this;
						Chart.DatasetController.prototype.removeHoverStyle.call(me, point, me.chart.options.elements.point);

						var dataVal = me.chart.data.datasets[point._datasetIndex].data[point._index];
						var custom = point.custom || {};
						var model = point._model;

						model.radius = custom.radius ? custom.radius : me.getRadius(dataVal);
					}
				});
			};
		}, {}], 17: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers,
				    defaults = Chart.defaults;

				defaults.doughnut = {
					animation: {
						// Boolean - Whether we animate the rotation of the Doughnut
						animateRotate: true,
						// Boolean - Whether we animate scaling the Doughnut from the centre
						animateScale: false
					},
					aspectRatio: 1,
					hover: {
						mode: 'single'
					},
					legendCallback: function legendCallback(chart) {
						var text = [];
						text.push('<ul class="' + chart.id + '-legend">');

						var data = chart.data;
						var datasets = data.datasets;
						var labels = data.labels;

						if (datasets.length) {
							for (var i = 0; i < datasets[0].data.length; ++i) {
								text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
								if (labels[i]) {
									text.push(labels[i]);
								}
								text.push('</li>');
							}
						}

						text.push('</ul>');
						return text.join('');
					},
					legend: {
						labels: {
							generateLabels: function generateLabels(chart) {
								var data = chart.data;
								if (data.labels.length && data.datasets.length) {
									return data.labels.map(function (label, i) {
										var meta = chart.getDatasetMeta(0);
										var ds = data.datasets[0];
										var arc = meta.data[i];
										var custom = arc && arc.custom || {};
										var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
										var arcOpts = chart.options.elements.arc;
										var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
										var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
										var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

										return {
											text: label,
											fillStyle: fill,
											strokeStyle: stroke,
											lineWidth: bw,
											hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

											// Extra data used for toggling the correct item
											index: i
										};
									});
								}
								return [];
							}
						},

						onClick: function onClick(e, legendItem) {
							var index = legendItem.index;
							var chart = this.chart;
							var i, ilen, meta;

							for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
								meta = chart.getDatasetMeta(i);
								// toggle visibility of index if exists
								if (meta.data[index]) {
									meta.data[index].hidden = !meta.data[index].hidden;
								}
							}

							chart.update();
						}
					},

					// The percentage of the chart that we cut out of the middle.
					cutoutPercentage: 50,

					// The rotation of the chart, where the first data arc begins.
					rotation: Math.PI * -0.5,

					// The total circumference of the chart.
					circumference: Math.PI * 2.0,

					// Need to override these to give a nice default
					tooltips: {
						callbacks: {
							title: function title() {
								return '';
							},
							label: function label(tooltipItem, data) {
								var dataLabel = data.labels[tooltipItem.index];
								var value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

								if (helpers.isArray(dataLabel)) {
									// show value on first line of multiline label
									// need to clone because we are changing the value
									dataLabel = dataLabel.slice();
									dataLabel[0] += value;
								} else {
									dataLabel += value;
								}

								return dataLabel;
							}
						}
					}
				};

				defaults.pie = helpers.clone(defaults.doughnut);
				helpers.extend(defaults.pie, {
					cutoutPercentage: 0
				});

				Chart.controllers.doughnut = Chart.controllers.pie = Chart.DatasetController.extend({

					dataElementType: Chart.elements.Arc,

					linkScales: helpers.noop,

					// Get index of the dataset in relation to the visible datasets. This allows determining the inner and outer radius correctly
					getRingIndex: function getRingIndex(datasetIndex) {
						var ringIndex = 0;

						for (var j = 0; j < datasetIndex; ++j) {
							if (this.chart.isDatasetVisible(j)) {
								++ringIndex;
							}
						}

						return ringIndex;
					},

					update: function update(reset) {
						var me = this;
						var chart = me.chart,
						    chartArea = chart.chartArea,
						    opts = chart.options,
						    arcOpts = opts.elements.arc,
						    availableWidth = chartArea.right - chartArea.left - arcOpts.borderWidth,
						    availableHeight = chartArea.bottom - chartArea.top - arcOpts.borderWidth,
						    minSize = Math.min(availableWidth, availableHeight),
						    offset = {
							x: 0,
							y: 0
						},
						    meta = me.getMeta(),
						    cutoutPercentage = opts.cutoutPercentage,
						    circumference = opts.circumference;

						// If the chart's circumference isn't a full circle, calculate minSize as a ratio of the width/height of the arc
						if (circumference < Math.PI * 2.0) {
							var startAngle = opts.rotation % (Math.PI * 2.0);
							startAngle += Math.PI * 2.0 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);
							var endAngle = startAngle + circumference;
							var start = { x: Math.cos(startAngle), y: Math.sin(startAngle) };
							var end = { x: Math.cos(endAngle), y: Math.sin(endAngle) };
							var contains0 = startAngle <= 0 && 0 <= endAngle || startAngle <= Math.PI * 2.0 && Math.PI * 2.0 <= endAngle;
							var contains90 = startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle || startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle;
							var contains180 = startAngle <= -Math.PI && -Math.PI <= endAngle || startAngle <= Math.PI && Math.PI <= endAngle;
							var contains270 = startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle || startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle;
							var cutout = cutoutPercentage / 100.0;
							var min = { x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)), y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout)) };
							var max = { x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)), y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout)) };
							var size = { width: (max.x - min.x) * 0.5, height: (max.y - min.y) * 0.5 };
							minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
							offset = { x: (max.x + min.x) * -0.5, y: (max.y + min.y) * -0.5 };
						}

						chart.borderWidth = me.getMaxBorderWidth(meta.data);
						chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
						chart.innerRadius = Math.max(cutoutPercentage ? chart.outerRadius / 100 * cutoutPercentage : 1, 0);
						chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
						chart.offsetX = offset.x * chart.outerRadius;
						chart.offsetY = offset.y * chart.outerRadius;

						meta.total = me.calculateTotal();

						me.outerRadius = chart.outerRadius - chart.radiusLength * me.getRingIndex(me.index);
						me.innerRadius = me.outerRadius - chart.radiusLength;

						helpers.each(meta.data, function (arc, index) {
							me.updateElement(arc, index, reset);
						});
					},

					updateElement: function updateElement(arc, index, reset) {
						var me = this;
						var chart = me.chart,
						    chartArea = chart.chartArea,
						    opts = chart.options,
						    animationOpts = opts.animation,
						    centerX = (chartArea.left + chartArea.right) / 2,
						    centerY = (chartArea.top + chartArea.bottom) / 2,
						    startAngle = opts.rotation,
						    // non reset case handled later
						endAngle = opts.rotation,
						    // non reset case handled later
						dataset = me.getDataset(),
						    circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
						    innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius,
						    outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius,
						    valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

						helpers.extend(arc, {
							// Utility
							_datasetIndex: me.index,
							_index: index,

							// Desired view properties
							_model: {
								x: centerX + chart.offsetX,
								y: centerY + chart.offsetY,
								startAngle: startAngle,
								endAngle: endAngle,
								circumference: circumference,
								outerRadius: outerRadius,
								innerRadius: innerRadius,
								label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
							}
						});

						var model = arc._model;
						// Resets the visual styles
						this.removeHoverStyle(arc);

						// Set correct angles if not resetting
						if (!reset || !animationOpts.animateRotate) {
							if (index === 0) {
								model.startAngle = opts.rotation;
							} else {
								model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
							}

							model.endAngle = model.startAngle + model.circumference;
						}

						arc.pivot();
					},

					removeHoverStyle: function removeHoverStyle(arc) {
						Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
					},

					calculateTotal: function calculateTotal() {
						var dataset = this.getDataset();
						var meta = this.getMeta();
						var total = 0;
						var value;

						helpers.each(meta.data, function (element, index) {
							value = dataset.data[index];
							if (!isNaN(value) && !element.hidden) {
								total += Math.abs(value);
							}
						});

						/* if (total === 0) {
      	total = NaN;
      }*/

						return total;
					},

					calculateCircumference: function calculateCircumference(value) {
						var total = this.getMeta().total;
						if (total > 0 && !isNaN(value)) {
							return Math.PI * 2.0 * (value / total);
						}
						return 0;
					},

					// gets the max border or hover width to properly scale pie charts
					getMaxBorderWidth: function getMaxBorderWidth(elements) {
						var max = 0,
						    index = this.index,
						    length = elements.length,
						    borderWidth,
						    hoverWidth;

						for (var i = 0; i < length; i++) {
							borderWidth = elements[i]._model ? elements[i]._model.borderWidth : 0;
							hoverWidth = elements[i]._chart ? elements[i]._chart.config.data.datasets[index].hoverBorderWidth : 0;

							max = borderWidth > max ? borderWidth : max;
							max = hoverWidth > max ? hoverWidth : max;
						}
						return max;
					}
				});
			};
		}, {}], 18: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.line = {
					showLines: true,
					spanGaps: false,

					hover: {
						mode: 'label'
					},

					scales: {
						xAxes: [{
							type: 'category',
							id: 'x-axis-0'
						}],
						yAxes: [{
							type: 'linear',
							id: 'y-axis-0'
						}]
					}
				};

				function lineEnabled(dataset, options) {
					return helpers.getValueOrDefault(dataset.showLine, options.showLines);
				}

				Chart.controllers.line = Chart.DatasetController.extend({

					datasetElementType: Chart.elements.Line,

					dataElementType: Chart.elements.Point,

					update: function update(reset) {
						var me = this;
						var meta = me.getMeta();
						var line = meta.dataset;
						var points = meta.data || [];
						var options = me.chart.options;
						var lineElementOptions = options.elements.line;
						var scale = me.getScaleForId(meta.yAxisID);
						var i, ilen, custom;
						var dataset = me.getDataset();
						var showLine = lineEnabled(dataset, options);

						// Update Line
						if (showLine) {
							custom = line.custom || {};

							// Compatibility: If the properties are defined with only the old name, use those values
							if (dataset.tension !== undefined && dataset.lineTension === undefined) {
								dataset.lineTension = dataset.tension;
							}

							// Utility
							line._scale = scale;
							line._datasetIndex = me.index;
							// Data
							line._children = points;
							// Model
							line._model = {
								// Appearance
								// The default behavior of lines is to break at null values, according
								// to https://github.com/chartjs/Chart.js/issues/2435#issuecomment-216718158
								// This option gives lines the ability to span gaps
								spanGaps: dataset.spanGaps ? dataset.spanGaps : options.spanGaps,
								tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
								backgroundColor: custom.backgroundColor ? custom.backgroundColor : dataset.backgroundColor || lineElementOptions.backgroundColor,
								borderWidth: custom.borderWidth ? custom.borderWidth : dataset.borderWidth || lineElementOptions.borderWidth,
								borderColor: custom.borderColor ? custom.borderColor : dataset.borderColor || lineElementOptions.borderColor,
								borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : dataset.borderCapStyle || lineElementOptions.borderCapStyle,
								borderDash: custom.borderDash ? custom.borderDash : dataset.borderDash || lineElementOptions.borderDash,
								borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : dataset.borderDashOffset || lineElementOptions.borderDashOffset,
								borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : dataset.borderJoinStyle || lineElementOptions.borderJoinStyle,
								fill: custom.fill ? custom.fill : dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill,
								steppedLine: custom.steppedLine ? custom.steppedLine : helpers.getValueOrDefault(dataset.steppedLine, lineElementOptions.stepped),
								cubicInterpolationMode: custom.cubicInterpolationMode ? custom.cubicInterpolationMode : helpers.getValueOrDefault(dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode),
								// Scale
								scaleTop: scale.top,
								scaleBottom: scale.bottom,
								scaleZero: scale.getBasePixel()
							};

							line.pivot();
						}

						// Update Points
						for (i = 0, ilen = points.length; i < ilen; ++i) {
							me.updateElement(points[i], i, reset);
						}

						if (showLine && line._model.tension !== 0) {
							me.updateBezierControlPoints();
						}

						// Now pivot the point for animation
						for (i = 0, ilen = points.length; i < ilen; ++i) {
							points[i].pivot();
						}
					},

					getPointBackgroundColor: function getPointBackgroundColor(point, index) {
						var backgroundColor = this.chart.options.elements.point.backgroundColor;
						var dataset = this.getDataset();
						var custom = point.custom || {};

						if (custom.backgroundColor) {
							backgroundColor = custom.backgroundColor;
						} else if (dataset.pointBackgroundColor) {
							backgroundColor = helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, backgroundColor);
						} else if (dataset.backgroundColor) {
							backgroundColor = dataset.backgroundColor;
						}

						return backgroundColor;
					},

					getPointBorderColor: function getPointBorderColor(point, index) {
						var borderColor = this.chart.options.elements.point.borderColor;
						var dataset = this.getDataset();
						var custom = point.custom || {};

						if (custom.borderColor) {
							borderColor = custom.borderColor;
						} else if (dataset.pointBorderColor) {
							borderColor = helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, borderColor);
						} else if (dataset.borderColor) {
							borderColor = dataset.borderColor;
						}

						return borderColor;
					},

					getPointBorderWidth: function getPointBorderWidth(point, index) {
						var borderWidth = this.chart.options.elements.point.borderWidth;
						var dataset = this.getDataset();
						var custom = point.custom || {};

						if (custom.borderWidth) {
							borderWidth = custom.borderWidth;
						} else if (dataset.pointBorderWidth) {
							borderWidth = helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, borderWidth);
						} else if (dataset.borderWidth) {
							borderWidth = dataset.borderWidth;
						}

						return borderWidth;
					},

					updateElement: function updateElement(point, index, reset) {
						var me = this;
						var meta = me.getMeta();
						var custom = point.custom || {};
						var dataset = me.getDataset();
						var datasetIndex = me.index;
						var value = dataset.data[index];
						var yScale = me.getScaleForId(meta.yAxisID);
						var xScale = me.getScaleForId(meta.xAxisID);
						var pointOptions = me.chart.options.elements.point;
						var x, y;
						var labels = me.chart.data.labels || [];
						var includeOffset = labels.length === 1 || dataset.data.length === 1 || me.chart.isCombo;

						// Compatibility: If the properties are defined with only the old name, use those values
						if (dataset.radius !== undefined && dataset.pointRadius === undefined) {
							dataset.pointRadius = dataset.radius;
						}
						if (dataset.hitRadius !== undefined && dataset.pointHitRadius === undefined) {
							dataset.pointHitRadius = dataset.hitRadius;
						}

						x = xScale.getPixelForValue((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? value : NaN, index, datasetIndex, includeOffset);
						y = reset ? yScale.getBasePixel() : me.calculatePointY(value, index, datasetIndex);

						// Utility
						point._xScale = xScale;
						point._yScale = yScale;
						point._datasetIndex = datasetIndex;
						point._index = index;

						// Desired view properties
						point._model = {
							x: x,
							y: y,
							skip: custom.skip || isNaN(x) || isNaN(y),
							// Appearance
							radius: custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointOptions.radius),
							pointStyle: custom.pointStyle || helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointOptions.pointStyle),
							backgroundColor: me.getPointBackgroundColor(point, index),
							borderColor: me.getPointBorderColor(point, index),
							borderWidth: me.getPointBorderWidth(point, index),
							tension: meta.dataset._model ? meta.dataset._model.tension : 0,
							steppedLine: meta.dataset._model ? meta.dataset._model.steppedLine : false,
							// Tooltip
							hitRadius: custom.hitRadius || helpers.getValueAtIndexOrDefault(dataset.pointHitRadius, index, pointOptions.hitRadius)
						};
					},

					calculatePointY: function calculatePointY(value, index, datasetIndex) {
						var me = this;
						var chart = me.chart;
						var meta = me.getMeta();
						var yScale = me.getScaleForId(meta.yAxisID);
						var sumPos = 0;
						var sumNeg = 0;
						var i, ds, dsMeta;

						if (yScale.options.stacked) {
							for (i = 0; i < datasetIndex; i++) {
								ds = chart.data.datasets[i];
								dsMeta = chart.getDatasetMeta(i);
								if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
									var stackedRightValue = Number(yScale.getRightValue(ds.data[index]));
									if (stackedRightValue < 0) {
										sumNeg += stackedRightValue || 0;
									} else {
										sumPos += stackedRightValue || 0;
									}
								}
							}

							var rightValue = Number(yScale.getRightValue(value));
							if (rightValue < 0) {
								return yScale.getPixelForValue(sumNeg + rightValue);
							}
							return yScale.getPixelForValue(sumPos + rightValue);
						}

						return yScale.getPixelForValue(value);
					},

					updateBezierControlPoints: function updateBezierControlPoints() {
						var me = this;
						var meta = me.getMeta();
						var area = me.chart.chartArea;
						var points = meta.data || [];
						var i, ilen, point, model, controlPoints;

						// Only consider points that are drawn in case the spanGaps option is used
						if (meta.dataset._model.spanGaps) {
							points = points.filter(function (pt) {
								return !pt._model.skip;
							});
						}

						function capControlPoint(pt, min, max) {
							return Math.max(Math.min(pt, max), min);
						}

						if (meta.dataset._model.cubicInterpolationMode === 'monotone') {
							helpers.splineCurveMonotone(points);
						} else {
							for (i = 0, ilen = points.length; i < ilen; ++i) {
								point = points[i];
								model = point._model;
								controlPoints = helpers.splineCurve(helpers.previousItem(points, i)._model, model, helpers.nextItem(points, i)._model, meta.dataset._model.tension);
								model.controlPointPreviousX = controlPoints.previous.x;
								model.controlPointPreviousY = controlPoints.previous.y;
								model.controlPointNextX = controlPoints.next.x;
								model.controlPointNextY = controlPoints.next.y;
							}
						}

						if (me.chart.options.elements.line.capBezierPoints) {
							for (i = 0, ilen = points.length; i < ilen; ++i) {
								model = points[i]._model;
								model.controlPointPreviousX = capControlPoint(model.controlPointPreviousX, area.left, area.right);
								model.controlPointPreviousY = capControlPoint(model.controlPointPreviousY, area.top, area.bottom);
								model.controlPointNextX = capControlPoint(model.controlPointNextX, area.left, area.right);
								model.controlPointNextY = capControlPoint(model.controlPointNextY, area.top, area.bottom);
							}
						}
					},

					draw: function draw(ease) {
						var me = this;
						var meta = me.getMeta();
						var points = meta.data || [];
						var easingDecimal = ease || 1;
						var i, ilen;

						// Transition Point Locations
						for (i = 0, ilen = points.length; i < ilen; ++i) {
							points[i].transition(easingDecimal);
						}

						// Transition and Draw the line
						if (lineEnabled(me.getDataset(), me.chart.options)) {
							meta.dataset.transition(easingDecimal).draw();
						}

						// Draw the points
						for (i = 0, ilen = points.length; i < ilen; ++i) {
							points[i].draw();
						}
					},

					setHoverStyle: function setHoverStyle(point) {
						// Point
						var dataset = this.chart.data.datasets[point._datasetIndex];
						var index = point._index;
						var custom = point.custom || {};
						var model = point._model;

						model.radius = custom.hoverRadius || helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
						model.backgroundColor = custom.hoverBackgroundColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
						model.borderColor = custom.hoverBorderColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
						model.borderWidth = custom.hoverBorderWidth || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
					},

					removeHoverStyle: function removeHoverStyle(point) {
						var me = this;
						var dataset = me.chart.data.datasets[point._datasetIndex];
						var index = point._index;
						var custom = point.custom || {};
						var model = point._model;

						// Compatibility: If the properties are defined with only the old name, use those values
						if (dataset.radius !== undefined && dataset.pointRadius === undefined) {
							dataset.pointRadius = dataset.radius;
						}

						model.radius = custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, me.chart.options.elements.point.radius);
						model.backgroundColor = me.getPointBackgroundColor(point, index);
						model.borderColor = me.getPointBorderColor(point, index);
						model.borderWidth = me.getPointBorderWidth(point, index);
					}
				});
			};
		}, {}], 19: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.polarArea = {

					scale: {
						type: 'radialLinear',
						lineArc: true, // so that lines are circular
						ticks: {
							beginAtZero: true
						}
					},

					// Boolean - Whether to animate the rotation of the chart
					animation: {
						animateRotate: true,
						animateScale: true
					},

					startAngle: -0.5 * Math.PI,
					aspectRatio: 1,
					legendCallback: function legendCallback(chart) {
						var text = [];
						text.push('<ul class="' + chart.id + '-legend">');

						var data = chart.data;
						var datasets = data.datasets;
						var labels = data.labels;

						if (datasets.length) {
							for (var i = 0; i < datasets[0].data.length; ++i) {
								text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
								if (labels[i]) {
									text.push(labels[i]);
								}
								text.push('</li>');
							}
						}

						text.push('</ul>');
						return text.join('');
					},
					legend: {
						labels: {
							generateLabels: function generateLabels(chart) {
								var data = chart.data;
								if (data.labels.length && data.datasets.length) {
									return data.labels.map(function (label, i) {
										var meta = chart.getDatasetMeta(0);
										var ds = data.datasets[0];
										var arc = meta.data[i];
										var custom = arc.custom || {};
										var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
										var arcOpts = chart.options.elements.arc;
										var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
										var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
										var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

										return {
											text: label,
											fillStyle: fill,
											strokeStyle: stroke,
											lineWidth: bw,
											hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

											// Extra data used for toggling the correct item
											index: i
										};
									});
								}
								return [];
							}
						},

						onClick: function onClick(e, legendItem) {
							var index = legendItem.index;
							var chart = this.chart;
							var i, ilen, meta;

							for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
								meta = chart.getDatasetMeta(i);
								meta.data[index].hidden = !meta.data[index].hidden;
							}

							chart.update();
						}
					},

					// Need to override these to give a nice default
					tooltips: {
						callbacks: {
							title: function title() {
								return '';
							},
							label: function label(tooltipItem, data) {
								return data.labels[tooltipItem.index] + ': ' + tooltipItem.yLabel;
							}
						}
					}
				};

				Chart.controllers.polarArea = Chart.DatasetController.extend({

					dataElementType: Chart.elements.Arc,

					linkScales: helpers.noop,

					update: function update(reset) {
						var me = this;
						var chart = me.chart;
						var chartArea = chart.chartArea;
						var meta = me.getMeta();
						var opts = chart.options;
						var arcOpts = opts.elements.arc;
						var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
						chart.outerRadius = Math.max((minSize - arcOpts.borderWidth / 2) / 2, 0);
						chart.innerRadius = Math.max(opts.cutoutPercentage ? chart.outerRadius / 100 * opts.cutoutPercentage : 1, 0);
						chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();

						me.outerRadius = chart.outerRadius - chart.radiusLength * me.index;
						me.innerRadius = me.outerRadius - chart.radiusLength;

						meta.count = me.countVisibleElements();

						helpers.each(meta.data, function (arc, index) {
							me.updateElement(arc, index, reset);
						});
					},

					updateElement: function updateElement(arc, index, reset) {
						var me = this;
						var chart = me.chart;
						var dataset = me.getDataset();
						var opts = chart.options;
						var animationOpts = opts.animation;
						var scale = chart.scale;
						var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
						var labels = chart.data.labels;

						var circumference = me.calculateCircumference(dataset.data[index]);
						var centerX = scale.xCenter;
						var centerY = scale.yCenter;

						// If there is NaN data before us, we need to calculate the starting angle correctly.
						// We could be way more efficient here, but its unlikely that the polar area chart will have a lot of data
						var visibleCount = 0;
						var meta = me.getMeta();
						for (var i = 0; i < index; ++i) {
							if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
								++visibleCount;
							}
						}

						// var negHalfPI = -0.5 * Math.PI;
						var datasetStartAngle = opts.startAngle;
						var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
						var startAngle = datasetStartAngle + circumference * visibleCount;
						var endAngle = startAngle + (arc.hidden ? 0 : circumference);

						var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

						helpers.extend(arc, {
							// Utility
							_datasetIndex: me.index,
							_index: index,
							_scale: scale,

							// Desired view properties
							_model: {
								x: centerX,
								y: centerY,
								innerRadius: 0,
								outerRadius: reset ? resetRadius : distance,
								startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
								endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
								label: getValueAtIndexOrDefault(labels, index, labels[index])
							}
						});

						// Apply border and fill style
						me.removeHoverStyle(arc);

						arc.pivot();
					},

					removeHoverStyle: function removeHoverStyle(arc) {
						Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
					},

					countVisibleElements: function countVisibleElements() {
						var dataset = this.getDataset();
						var meta = this.getMeta();
						var count = 0;

						helpers.each(meta.data, function (element, index) {
							if (!isNaN(dataset.data[index]) && !element.hidden) {
								count++;
							}
						});

						return count;
					},

					calculateCircumference: function calculateCircumference(value) {
						var count = this.getMeta().count;
						if (count > 0 && !isNaN(value)) {
							return 2 * Math.PI / count;
						}
						return 0;
					}
				});
			};
		}, {}], 20: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.radar = {
					aspectRatio: 1,
					scale: {
						type: 'radialLinear'
					},
					elements: {
						line: {
							tension: 0 // no bezier in radar
						}
					}
				};

				Chart.controllers.radar = Chart.DatasetController.extend({

					datasetElementType: Chart.elements.Line,

					dataElementType: Chart.elements.Point,

					linkScales: helpers.noop,

					update: function update(reset) {
						var me = this;
						var meta = me.getMeta();
						var line = meta.dataset;
						var points = meta.data;
						var custom = line.custom || {};
						var dataset = me.getDataset();
						var lineElementOptions = me.chart.options.elements.line;
						var scale = me.chart.scale;

						// Compatibility: If the properties are defined with only the old name, use those values
						if (dataset.tension !== undefined && dataset.lineTension === undefined) {
							dataset.lineTension = dataset.tension;
						}

						helpers.extend(meta.dataset, {
							// Utility
							_datasetIndex: me.index,
							// Data
							_children: points,
							_loop: true,
							// Model
							_model: {
								// Appearance
								tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
								backgroundColor: custom.backgroundColor ? custom.backgroundColor : dataset.backgroundColor || lineElementOptions.backgroundColor,
								borderWidth: custom.borderWidth ? custom.borderWidth : dataset.borderWidth || lineElementOptions.borderWidth,
								borderColor: custom.borderColor ? custom.borderColor : dataset.borderColor || lineElementOptions.borderColor,
								fill: custom.fill ? custom.fill : dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill,
								borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : dataset.borderCapStyle || lineElementOptions.borderCapStyle,
								borderDash: custom.borderDash ? custom.borderDash : dataset.borderDash || lineElementOptions.borderDash,
								borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : dataset.borderDashOffset || lineElementOptions.borderDashOffset,
								borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : dataset.borderJoinStyle || lineElementOptions.borderJoinStyle,

								// Scale
								scaleTop: scale.top,
								scaleBottom: scale.bottom,
								scaleZero: scale.getBasePosition()
							}
						});

						meta.dataset.pivot();

						// Update Points
						helpers.each(points, function (point, index) {
							me.updateElement(point, index, reset);
						}, me);

						// Update bezier control points
						me.updateBezierControlPoints();
					},
					updateElement: function updateElement(point, index, reset) {
						var me = this;
						var custom = point.custom || {};
						var dataset = me.getDataset();
						var scale = me.chart.scale;
						var pointElementOptions = me.chart.options.elements.point;
						var pointPosition = scale.getPointPositionForValue(index, dataset.data[index]);

						helpers.extend(point, {
							// Utility
							_datasetIndex: me.index,
							_index: index,
							_scale: scale,

							// Desired view properties
							_model: {
								x: reset ? scale.xCenter : pointPosition.x, // value not used in dataset scale, but we want a consistent API between scales
								y: reset ? scale.yCenter : pointPosition.y,

								// Appearance
								tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.tension, me.chart.options.elements.line.tension),
								radius: custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointElementOptions.radius),
								backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor),
								borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor),
								borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth),
								pointStyle: custom.pointStyle ? custom.pointStyle : helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointElementOptions.pointStyle),

								// Tooltip
								hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
							}
						});

						point._model.skip = custom.skip ? custom.skip : isNaN(point._model.x) || isNaN(point._model.y);
					},
					updateBezierControlPoints: function updateBezierControlPoints() {
						var chartArea = this.chart.chartArea;
						var meta = this.getMeta();

						helpers.each(meta.data, function (point, index) {
							var model = point._model;
							var controlPoints = helpers.splineCurve(helpers.previousItem(meta.data, index, true)._model, model, helpers.nextItem(meta.data, index, true)._model, model.tension);

							// Prevent the bezier going outside of the bounds of the graph
							model.controlPointPreviousX = Math.max(Math.min(controlPoints.previous.x, chartArea.right), chartArea.left);
							model.controlPointPreviousY = Math.max(Math.min(controlPoints.previous.y, chartArea.bottom), chartArea.top);

							model.controlPointNextX = Math.max(Math.min(controlPoints.next.x, chartArea.right), chartArea.left);
							model.controlPointNextY = Math.max(Math.min(controlPoints.next.y, chartArea.bottom), chartArea.top);

							// Now pivot the point for animation
							point.pivot();
						});
					},

					draw: function draw(ease) {
						var meta = this.getMeta();
						var easingDecimal = ease || 1;

						// Transition Point Locations
						helpers.each(meta.data, function (point) {
							point.transition(easingDecimal);
						});

						// Transition and Draw the line
						meta.dataset.transition(easingDecimal).draw();

						// Draw the points
						helpers.each(meta.data, function (point) {
							point.draw();
						});
					},

					setHoverStyle: function setHoverStyle(point) {
						// Point
						var dataset = this.chart.data.datasets[point._datasetIndex];
						var custom = point.custom || {};
						var index = point._index;
						var model = point._model;

						model.radius = custom.hoverRadius ? custom.hoverRadius : helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
						model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
						model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
						model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
					},

					removeHoverStyle: function removeHoverStyle(point) {
						var dataset = this.chart.data.datasets[point._datasetIndex];
						var custom = point.custom || {};
						var index = point._index;
						var model = point._model;
						var pointElementOptions = this.chart.options.elements.point;

						model.radius = custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.radius, index, pointElementOptions.radius);
						model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor);
						model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor);
						model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth);
					}
				});
			};
		}, {}], 21: [function (require, module, exports) {
			/* global window: false */
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.global.animation = {
					duration: 1000,
					easing: 'easeOutQuart',
					onProgress: helpers.noop,
					onComplete: helpers.noop
				};

				Chart.Animation = Chart.Element.extend({
					currentStep: null, // the current animation step
					numSteps: 60, // default number of steps
					easing: '', // the easing to use for this animation
					render: null, // render function used by the animation service

					onAnimationProgress: null, // user specified callback to fire on each step of the animation
					onAnimationComplete: null // user specified callback to fire when the animation finishes
				});

				Chart.animationService = {
					frameDuration: 17,
					animations: [],
					dropFrames: 0,
					request: null,

					/**
      * @function Chart.animationService.addAnimation
      * @param chartInstance {ChartController} the chart to animate
      * @param animationObject {IAnimation} the animation that we will animate
      * @param duration {Number} length of animation in ms
      * @param lazy {Boolean} if true, the chart is not marked as animating to enable more responsive interactions
      */
					addAnimation: function addAnimation(chartInstance, animationObject, duration, lazy) {
						var me = this;

						if (!lazy) {
							chartInstance.animating = true;
						}

						for (var index = 0; index < me.animations.length; ++index) {
							if (me.animations[index].chartInstance === chartInstance) {
								// replacing an in progress animation
								me.animations[index].animationObject = animationObject;
								return;
							}
						}

						me.animations.push({
							chartInstance: chartInstance,
							animationObject: animationObject
						});

						// If there are no animations queued, manually kickstart a digest, for lack of a better word
						if (me.animations.length === 1) {
							me.requestAnimationFrame();
						}
					},
					// Cancel the animation for a given chart instance
					cancelAnimation: function cancelAnimation(chartInstance) {
						var index = helpers.findIndex(this.animations, function (animationWrapper) {
							return animationWrapper.chartInstance === chartInstance;
						});

						if (index !== -1) {
							this.animations.splice(index, 1);
							chartInstance.animating = false;
						}
					},
					requestAnimationFrame: function requestAnimationFrame() {
						var me = this;
						if (me.request === null) {
							// Skip animation frame requests until the active one is executed.
							// This can happen when processing mouse events, e.g. 'mousemove'
							// and 'mouseout' events will trigger multiple renders.
							me.request = helpers.requestAnimFrame.call(window, function () {
								me.request = null;
								me.startDigest();
							});
						}
					},
					startDigest: function startDigest() {
						var me = this;

						var startTime = Date.now();
						var framesToDrop = 0;

						if (me.dropFrames > 1) {
							framesToDrop = Math.floor(me.dropFrames);
							me.dropFrames = me.dropFrames % 1;
						}

						var i = 0;
						while (i < me.animations.length) {
							if (me.animations[i].animationObject.currentStep === null) {
								me.animations[i].animationObject.currentStep = 0;
							}

							me.animations[i].animationObject.currentStep += 1 + framesToDrop;

							if (me.animations[i].animationObject.currentStep > me.animations[i].animationObject.numSteps) {
								me.animations[i].animationObject.currentStep = me.animations[i].animationObject.numSteps;
							}

							me.animations[i].animationObject.render(me.animations[i].chartInstance, me.animations[i].animationObject);
							if (me.animations[i].animationObject.onAnimationProgress && me.animations[i].animationObject.onAnimationProgress.call) {
								me.animations[i].animationObject.onAnimationProgress.call(me.animations[i].chartInstance, me.animations[i]);
							}

							if (me.animations[i].animationObject.currentStep === me.animations[i].animationObject.numSteps) {
								if (me.animations[i].animationObject.onAnimationComplete && me.animations[i].animationObject.onAnimationComplete.call) {
									me.animations[i].animationObject.onAnimationComplete.call(me.animations[i].chartInstance, me.animations[i]);
								}

								// executed the last frame. Remove the animation.
								me.animations[i].chartInstance.animating = false;

								me.animations.splice(i, 1);
							} else {
								++i;
							}
						}

						var endTime = Date.now();
						var dropFrames = (endTime - startTime) / me.frameDuration;

						me.dropFrames += dropFrames;

						// Do we have more stuff to animate?
						if (me.animations.length > 0) {
							me.requestAnimationFrame();
						}
					}
				};
			};
		}, {}], 22: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {
				// Global Chart canvas helpers object for drawing items to canvas
				var helpers = Chart.canvasHelpers = {};

				helpers.drawPoint = function (ctx, pointStyle, radius, x, y) {
					var type, edgeLength, xOffset, yOffset, height, size;

					if ((typeof pointStyle === 'undefined' ? 'undefined' : _typeof(pointStyle)) === 'object') {
						type = pointStyle.toString();
						if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
							ctx.drawImage(pointStyle, x - pointStyle.width / 2, y - pointStyle.height / 2);
							return;
						}
					}

					if (isNaN(radius) || radius <= 0) {
						return;
					}

					switch (pointStyle) {
						// Default includes circle
						default:
							ctx.beginPath();
							ctx.arc(x, y, radius, 0, Math.PI * 2);
							ctx.closePath();
							ctx.fill();
							break;
						case 'triangle':
							ctx.beginPath();
							edgeLength = 3 * radius / Math.sqrt(3);
							height = edgeLength * Math.sqrt(3) / 2;
							ctx.moveTo(x - edgeLength / 2, y + height / 3);
							ctx.lineTo(x + edgeLength / 2, y + height / 3);
							ctx.lineTo(x, y - 2 * height / 3);
							ctx.closePath();
							ctx.fill();
							break;
						case 'rect':
							size = 1 / Math.SQRT2 * radius;
							ctx.beginPath();
							ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
							ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
							break;
						case 'rectRot':
							size = 1 / Math.SQRT2 * radius;
							ctx.beginPath();
							ctx.moveTo(x - size, y);
							ctx.lineTo(x, y + size);
							ctx.lineTo(x + size, y);
							ctx.lineTo(x, y - size);
							ctx.closePath();
							ctx.fill();
							break;
						case 'cross':
							ctx.beginPath();
							ctx.moveTo(x, y + radius);
							ctx.lineTo(x, y - radius);
							ctx.moveTo(x - radius, y);
							ctx.lineTo(x + radius, y);
							ctx.closePath();
							break;
						case 'crossRot':
							ctx.beginPath();
							xOffset = Math.cos(Math.PI / 4) * radius;
							yOffset = Math.sin(Math.PI / 4) * radius;
							ctx.moveTo(x - xOffset, y - yOffset);
							ctx.lineTo(x + xOffset, y + yOffset);
							ctx.moveTo(x - xOffset, y + yOffset);
							ctx.lineTo(x + xOffset, y - yOffset);
							ctx.closePath();
							break;
						case 'star':
							ctx.beginPath();
							ctx.moveTo(x, y + radius);
							ctx.lineTo(x, y - radius);
							ctx.moveTo(x - radius, y);
							ctx.lineTo(x + radius, y);
							xOffset = Math.cos(Math.PI / 4) * radius;
							yOffset = Math.sin(Math.PI / 4) * radius;
							ctx.moveTo(x - xOffset, y - yOffset);
							ctx.lineTo(x + xOffset, y + yOffset);
							ctx.moveTo(x - xOffset, y + yOffset);
							ctx.lineTo(x + xOffset, y - yOffset);
							ctx.closePath();
							break;
						case 'line':
							ctx.beginPath();
							ctx.moveTo(x - radius, y);
							ctx.lineTo(x + radius, y);
							ctx.closePath();
							break;
						case 'dash':
							ctx.beginPath();
							ctx.moveTo(x, y);
							ctx.lineTo(x + radius, y);
							ctx.closePath();
							break;
					}

					ctx.stroke();
				};
			};
		}, {}], 23: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				// Create a dictionary of chart types, to allow for extension of existing types
				Chart.types = {};

				// Store a reference to each instance - allowing us to globally resize chart instances on window resize.
				// Destroy method on the chart will remove the instance of the chart from this reference.
				Chart.instances = {};

				// Controllers available for dataset visualization eg. bar, line, slice, etc.
				Chart.controllers = {};

				/**
     * The "used" size is the final value of a dimension property after all calculations have
     * been performed. This method uses the computed style of `element` but returns undefined
     * if the computed style is not expressed in pixels. That can happen in some cases where
     * `element` has a size relative to its parent and this last one is not yet displayed,
     * for example because of `display: none` on a parent node.
     * TODO(SB) Move this method in the upcoming core.platform class.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
     * @returns {Number} Size in pixels or undefined if unknown.
     */
				function readUsedSize(element, property) {
					var value = helpers.getStyle(element, property);
					var matches = value && value.match(/(\d+)px/);
					return matches ? Number(matches[1]) : undefined;
				}

				/**
     * Initializes the canvas style and render size without modifying the canvas display size,
     * since responsiveness is handled by the controller.resize() method. The config is used
     * to determine the aspect ratio to apply in case no explicit height has been specified.
     * TODO(SB) Move this method in the upcoming core.platform class.
     */
				function initCanvas(canvas, config) {
					var style = canvas.style;

					// NOTE(SB) canvas.getAttribute('width') !== canvas.width: in the first case it
					// returns null or '' if no explicit value has been set to the canvas attribute.
					var renderHeight = canvas.getAttribute('height');
					var renderWidth = canvas.getAttribute('width');

					// Chart.js modifies some canvas values that we want to restore on destroy
					canvas._chartjs = {
						initial: {
							height: renderHeight,
							width: renderWidth,
							style: {
								display: style.display,
								height: style.height,
								width: style.width
							}
						}
					};

					// Force canvas to display as block to avoid extra space caused by inline
					// elements, which would interfere with the responsive resize process.
					// https://github.com/chartjs/Chart.js/issues/2538
					style.display = style.display || 'block';

					if (renderWidth === null || renderWidth === '') {
						var displayWidth = readUsedSize(canvas, 'width');
						if (displayWidth !== undefined) {
							canvas.width = displayWidth;
						}
					}

					if (renderHeight === null || renderHeight === '') {
						if (canvas.style.height === '') {
							// If no explicit render height and style height, let's apply the aspect ratio,
							// which one can be specified by the user but also by charts as default option
							// (i.e. options.aspectRatio). If not specified, use canvas aspect ratio of 2.
							canvas.height = canvas.width / (config.options.aspectRatio || 2);
						} else {
							var displayHeight = readUsedSize(canvas, 'height');
							if (displayWidth !== undefined) {
								canvas.height = displayHeight;
							}
						}
					}

					return canvas;
				}

				/**
     * Restores the canvas initial state, such as render/display sizes and style.
     * TODO(SB) Move this method in the upcoming core.platform class.
     */
				function releaseCanvas(canvas) {
					if (!canvas._chartjs) {
						return;
					}

					var initial = canvas._chartjs.initial;
					['height', 'width'].forEach(function (prop) {
						var value = initial[prop];
						if (value === undefined || value === null) {
							canvas.removeAttribute(prop);
						} else {
							canvas.setAttribute(prop, value);
						}
					});

					helpers.each(initial.style || {}, function (value, key) {
						canvas.style[key] = value;
					});

					// The canvas render size might have been changed (and thus the state stack discarded),
					// we can't use save() and restore() to restore the initial state. So make sure that at
					// least the canvas context is reset to the default state by setting the canvas width.
					// https://www.w3.org/TR/2011/WD-html5-20110525/the-canvas-element.html
					canvas.width = canvas.width;

					delete canvas._chartjs;
				}

				/**
     * TODO(SB) Move this method in the upcoming core.platform class.
     */
				function acquireContext(item, config) {
					if (typeof item === 'string') {
						item = document.getElementById(item);
					} else if (item.length) {
						// Support for array based queries (such as jQuery)
						item = item[0];
					}

					if (item && item.canvas) {
						// Support for any object associated to a canvas (including a context2d)
						item = item.canvas;
					}

					if (item instanceof HTMLCanvasElement) {
						// To prevent canvas fingerprinting, some add-ons undefine the getContext
						// method, for example: https://github.com/kkapsner/CanvasBlocker
						// https://github.com/chartjs/Chart.js/issues/2807
						var context = item.getContext && item.getContext('2d');
						if (context instanceof CanvasRenderingContext2D) {
							initCanvas(item, config);
							return context;
						}
					}

					return null;
				}

				/**
     * Initializes the given config with global and chart default values.
     */
				function initConfig(config) {
					config = config || {};

					// Do NOT use configMerge() for the data object because this method merges arrays
					// and so would change references to labels and datasets, preventing data updates.
					var data = config.data = config.data || {};
					data.datasets = data.datasets || [];
					data.labels = data.labels || [];

					config.options = helpers.configMerge(Chart.defaults.global, Chart.defaults[config.type], config.options || {});

					return config;
				}

				/**
     * @class Chart.Controller
     * The main controller of a chart.
     */
				Chart.Controller = function (item, config, instance) {
					var me = this;

					config = initConfig(config);

					var context = acquireContext(item, config);
					var canvas = context && context.canvas;
					var height = canvas && canvas.height;
					var width = canvas && canvas.width;

					instance.ctx = context;
					instance.canvas = canvas;
					instance.config = config;
					instance.width = width;
					instance.height = height;
					instance.aspectRatio = height ? width / height : null;

					me.id = helpers.uid();
					me.chart = instance;
					me.config = config;
					me.options = config.options;
					me._bufferedRender = false;

					// Add the chart instance to the global namespace
					Chart.instances[me.id] = me;

					Object.defineProperty(me, 'data', {
						get: function get() {
							return me.config.data;
						}
					});

					if (!context || !canvas) {
						// The given item is not a compatible context2d element, let's return before finalizing
						// the chart initialization but after setting basic chart / controller properties that
						// can help to figure out that the chart is not valid (e.g chart.canvas !== null);
						// https://github.com/chartjs/Chart.js/issues/2807
						console.error("Failed to create chart: can't acquire context from the given item");
						return me;
					}

					helpers.retinaScale(instance);

					// Responsiveness is currently based on the use of an iframe, however this method causes
					// performance issues and could be troublesome when used with ad blockers. So make sure
					// that the user is still able to create a chart without iframe when responsive is false.
					// See https://github.com/chartjs/Chart.js/issues/2210
					if (me.options.responsive) {
						helpers.addResizeListener(canvas.parentNode, function () {
							me.resize();
						});

						// Initial resize before chart draws (must be silent to preserve initial animations).
						me.resize(true);
					}

					me.initialize();

					return me;
				};

				helpers.extend(Chart.Controller.prototype, /** @lends Chart.Controller */{
					initialize: function initialize() {
						var me = this;

						// Before init plugin notification
						Chart.plugins.notify('beforeInit', [me]);

						me.bindEvents();

						// Make sure controllers are built first so that each dataset is bound to an axis before the scales
						// are built
						me.ensureScalesHaveIDs();
						me.buildOrUpdateControllers();
						me.buildScales();
						me.updateLayout();
						me.resetElements();
						me.initToolTip();
						me.update();

						// After init plugin notification
						Chart.plugins.notify('afterInit', [me]);

						return me;
					},

					clear: function clear() {
						helpers.clear(this.chart);
						return this;
					},

					stop: function stop() {
						// Stops any current animation loop occurring
						Chart.animationService.cancelAnimation(this);
						return this;
					},

					resize: function resize(silent) {
						var me = this;
						var chart = me.chart;
						var options = me.options;
						var canvas = chart.canvas;
						var aspectRatio = options.maintainAspectRatio && chart.aspectRatio || null;

						// the canvas render width and height will be casted to integers so make sure that
						// the canvas display style uses the same integer values to avoid blurring effect.
						var newWidth = Math.floor(helpers.getMaximumWidth(canvas));
						var newHeight = Math.floor(aspectRatio ? newWidth / aspectRatio : helpers.getMaximumHeight(canvas));

						if (chart.width === newWidth && chart.height === newHeight) {
							return;
						}

						canvas.width = chart.width = newWidth;
						canvas.height = chart.height = newHeight;
						canvas.style.width = newWidth + 'px';
						canvas.style.height = newHeight + 'px';

						helpers.retinaScale(chart);

						// Notify any plugins about the resize
						var newSize = { width: newWidth, height: newHeight };
						Chart.plugins.notify('resize', [me, newSize]);

						// Notify of resize
						if (me.options.onResize) {
							me.options.onResize(me, newSize);
						}

						if (!silent) {
							me.stop();
							me.update(me.options.responsiveAnimationDuration);
						}
					},

					ensureScalesHaveIDs: function ensureScalesHaveIDs() {
						var options = this.options;
						var scalesOptions = options.scales || {};
						var scaleOptions = options.scale;

						helpers.each(scalesOptions.xAxes, function (xAxisOptions, index) {
							xAxisOptions.id = xAxisOptions.id || 'x-axis-' + index;
						});

						helpers.each(scalesOptions.yAxes, function (yAxisOptions, index) {
							yAxisOptions.id = yAxisOptions.id || 'y-axis-' + index;
						});

						if (scaleOptions) {
							scaleOptions.id = scaleOptions.id || 'scale';
						}
					},

					/**
      * Builds a map of scale ID to scale object for future lookup.
      */
					buildScales: function buildScales() {
						var me = this;
						var options = me.options;
						var scales = me.scales = {};
						var items = [];

						if (options.scales) {
							items = items.concat((options.scales.xAxes || []).map(function (xAxisOptions) {
								return { options: xAxisOptions, dtype: 'category' };
							}), (options.scales.yAxes || []).map(function (yAxisOptions) {
								return { options: yAxisOptions, dtype: 'linear' };
							}));
						}

						if (options.scale) {
							items.push({ options: options.scale, dtype: 'radialLinear', isDefault: true });
						}

						helpers.each(items, function (item) {
							var scaleOptions = item.options;
							var scaleType = helpers.getValueOrDefault(scaleOptions.type, item.dtype);
							var scaleClass = Chart.scaleService.getScaleConstructor(scaleType);
							if (!scaleClass) {
								return;
							}

							var scale = new scaleClass({
								id: scaleOptions.id,
								options: scaleOptions,
								ctx: me.chart.ctx,
								chart: me
							});

							scales[scale.id] = scale;

							// TODO(SB): I think we should be able to remove this custom case (options.scale)
							// and consider it as a regular scale part of the "scales"" map only! This would
							// make the logic easier and remove some useless? custom code.
							if (item.isDefault) {
								me.scale = scale;
							}
						});

						Chart.scaleService.addScalesToLayout(this);
					},

					updateLayout: function updateLayout() {
						Chart.layoutService.update(this, this.chart.width, this.chart.height);
					},

					buildOrUpdateControllers: function buildOrUpdateControllers() {
						var me = this;
						var types = [];
						var newControllers = [];

						helpers.each(me.data.datasets, function (dataset, datasetIndex) {
							var meta = me.getDatasetMeta(datasetIndex);
							if (!meta.type) {
								meta.type = dataset.type || me.config.type;
							}

							types.push(meta.type);

							if (meta.controller) {
								meta.controller.updateIndex(datasetIndex);
							} else {
								meta.controller = new Chart.controllers[meta.type](me, datasetIndex);
								newControllers.push(meta.controller);
							}
						}, me);

						if (types.length > 1) {
							for (var i = 1; i < types.length; i++) {
								if (types[i] !== types[i - 1]) {
									me.isCombo = true;
									break;
								}
							}
						}

						return newControllers;
					},

					/**
      * Reset the elements of all datasets
      * @method resetElements
      * @private
      */
					resetElements: function resetElements() {
						var me = this;
						helpers.each(me.data.datasets, function (dataset, datasetIndex) {
							me.getDatasetMeta(datasetIndex).controller.reset();
						}, me);
					},

					/**
     * Resets the chart back to it's state before the initial animation
     * @method reset
     */
					reset: function reset() {
						this.resetElements();
						this.tooltip.initialize();
					},

					update: function update(animationDuration, lazy) {
						var me = this;
						Chart.plugins.notify('beforeUpdate', [me]);

						// In case the entire data object changed
						me.tooltip._data = me.data;

						// Make sure dataset controllers are updated and new controllers are reset
						var newControllers = me.buildOrUpdateControllers();

						// Make sure all dataset controllers have correct meta data counts
						helpers.each(me.data.datasets, function (dataset, datasetIndex) {
							me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
						}, me);

						Chart.layoutService.update(me, me.chart.width, me.chart.height);

						// Apply changes to the datasets that require the scales to have been calculated i.e BorderColor changes
						Chart.plugins.notify('afterScaleUpdate', [me]);

						// Can only reset the new controllers after the scales have been updated
						helpers.each(newControllers, function (controller) {
							controller.reset();
						});

						me.updateDatasets();

						// Do this before render so that any plugins that need final scale updates can use it
						Chart.plugins.notify('afterUpdate', [me]);

						if (me._bufferedRender) {
							me._bufferedRequest = {
								lazy: lazy,
								duration: animationDuration
							};
						} else {
							me.render(animationDuration, lazy);
						}
					},

					/**
      * @method beforeDatasetsUpdate
      * @description Called before all datasets are updated. If a plugin returns false,
      * the datasets update will be cancelled until another chart update is triggered.
      * @param {Object} instance the chart instance being updated.
      * @returns {Boolean} false to cancel the datasets update.
      * @memberof Chart.PluginBase
      * @since version 2.1.5
      * @instance
      */

					/**
      * @method afterDatasetsUpdate
      * @description Called after all datasets have been updated. Note that this
      * extension will not be called if the datasets update has been cancelled.
      * @param {Object} instance the chart instance being updated.
      * @memberof Chart.PluginBase
      * @since version 2.1.5
      * @instance
      */

					/**
      * Updates all datasets unless a plugin returns false to the beforeDatasetsUpdate
      * extension, in which case no datasets will be updated and the afterDatasetsUpdate
      * notification will be skipped.
      * @protected
      * @instance
      */
					updateDatasets: function updateDatasets() {
						var me = this;
						var i, ilen;

						if (Chart.plugins.notify('beforeDatasetsUpdate', [me])) {
							for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
								me.getDatasetMeta(i).controller.update();
							}

							Chart.plugins.notify('afterDatasetsUpdate', [me]);
						}
					},

					render: function render(duration, lazy) {
						var me = this;
						Chart.plugins.notify('beforeRender', [me]);

						var animationOptions = me.options.animation;
						if (animationOptions && (typeof duration !== 'undefined' && duration !== 0 || typeof duration === 'undefined' && animationOptions.duration !== 0)) {
							var animation = new Chart.Animation();
							animation.numSteps = (duration || animationOptions.duration) / 16.66; // 60 fps
							animation.easing = animationOptions.easing;

							// render function
							animation.render = function (chartInstance, animationObject) {
								var easingFunction = helpers.easingEffects[animationObject.easing];
								var stepDecimal = animationObject.currentStep / animationObject.numSteps;
								var easeDecimal = easingFunction(stepDecimal);

								chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);
							};

							// user events
							animation.onAnimationProgress = animationOptions.onProgress;
							animation.onAnimationComplete = animationOptions.onComplete;

							Chart.animationService.addAnimation(me, animation, duration, lazy);
						} else {
							me.draw();
							if (animationOptions && animationOptions.onComplete && animationOptions.onComplete.call) {
								animationOptions.onComplete.call(me);
							}
						}
						return me;
					},

					draw: function draw(ease) {
						var me = this;
						var easingDecimal = ease || 1;
						me.clear();

						Chart.plugins.notify('beforeDraw', [me, easingDecimal]);

						// Draw all the scales
						helpers.each(me.boxes, function (box) {
							box.draw(me.chartArea);
						}, me);
						if (me.scale) {
							me.scale.draw();
						}

						Chart.plugins.notify('beforeDatasetsDraw', [me, easingDecimal]);

						// Draw each dataset via its respective controller (reversed to support proper line stacking)
						helpers.each(me.data.datasets, function (dataset, datasetIndex) {
							if (me.isDatasetVisible(datasetIndex)) {
								me.getDatasetMeta(datasetIndex).controller.draw(ease);
							}
						}, me, true);

						Chart.plugins.notify('afterDatasetsDraw', [me, easingDecimal]);

						// Finally draw the tooltip
						me.tooltip.transition(easingDecimal).draw();

						Chart.plugins.notify('afterDraw', [me, easingDecimal]);
					},

					// Get the single element that was clicked on
					// @return : An object containing the dataset index and element index of the matching element. Also contains the rectangle that was draw
					getElementAtEvent: function getElementAtEvent(e) {
						return Chart.Interaction.modes.single(this, e);
					},

					getElementsAtEvent: function getElementsAtEvent(e) {
						return Chart.Interaction.modes.label(this, e, { intersect: true });
					},

					getElementsAtXAxis: function getElementsAtXAxis(e) {
						return Chart.Interaction.modes['x-axis'](this, e, { intersect: true });
					},

					getElementsAtEventForMode: function getElementsAtEventForMode(e, mode, options) {
						var method = Chart.Interaction.modes[mode];
						if (typeof method === 'function') {
							return method(this, e, options);
						}

						return [];
					},

					getDatasetAtEvent: function getDatasetAtEvent(e) {
						return Chart.Interaction.modes.dataset(this, e);
					},

					getDatasetMeta: function getDatasetMeta(datasetIndex) {
						var me = this;
						var dataset = me.data.datasets[datasetIndex];
						if (!dataset._meta) {
							dataset._meta = {};
						}

						var meta = dataset._meta[me.id];
						if (!meta) {
							meta = dataset._meta[me.id] = {
								type: null,
								data: [],
								dataset: null,
								controller: null,
								hidden: null, // See isDatasetVisible() comment
								xAxisID: null,
								yAxisID: null
							};
						}

						return meta;
					},

					getVisibleDatasetCount: function getVisibleDatasetCount() {
						var count = 0;
						for (var i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
							if (this.isDatasetVisible(i)) {
								count++;
							}
						}
						return count;
					},

					isDatasetVisible: function isDatasetVisible(datasetIndex) {
						var meta = this.getDatasetMeta(datasetIndex);

						// meta.hidden is a per chart dataset hidden flag override with 3 states: if true or false,
						// the dataset.hidden value is ignored, else if null, the dataset hidden state is returned.
						return typeof meta.hidden === 'boolean' ? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
					},

					generateLegend: function generateLegend() {
						return this.options.legendCallback(this);
					},

					destroy: function destroy() {
						var me = this;
						var canvas = me.chart.canvas;
						var meta, i, ilen;

						me.stop();

						// dataset controllers need to cleanup associated data
						for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
							meta = me.getDatasetMeta(i);
							if (meta.controller) {
								meta.controller.destroy();
								meta.controller = null;
							}
						}

						if (canvas) {
							helpers.unbindEvents(me, me.events);
							helpers.removeResizeListener(canvas.parentNode);
							helpers.clear(me.chart);
							releaseCanvas(canvas);
							me.chart.canvas = null;
							me.chart.ctx = null;
						}

						Chart.plugins.notify('destroy', [me]);

						delete Chart.instances[me.id];
					},

					toBase64Image: function toBase64Image() {
						return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
					},

					initToolTip: function initToolTip() {
						var me = this;
						me.tooltip = new Chart.Tooltip({
							_chart: me.chart,
							_chartInstance: me,
							_data: me.data,
							_options: me.options.tooltips
						}, me);
						me.tooltip.initialize();
					},

					bindEvents: function bindEvents() {
						var me = this;
						helpers.bindEvents(me, me.options.events, function (evt) {
							me.eventHandler(evt);
						});
					},

					updateHoverStyle: function updateHoverStyle(elements, mode, enabled) {
						var method = enabled ? 'setHoverStyle' : 'removeHoverStyle';
						var element, i, ilen;

						for (i = 0, ilen = elements.length; i < ilen; ++i) {
							element = elements[i];
							if (element) {
								this.getDatasetMeta(element._datasetIndex).controller[method](element);
							}
						}
					},

					eventHandler: function eventHandler(e) {
						var me = this;
						var legend = me.legend;
						var tooltip = me.tooltip;
						var hoverOptions = me.options.hover;

						// Buffer any update calls so that renders do not occur
						me._bufferedRender = true;
						me._bufferedRequest = null;

						var changed = me.handleEvent(e);
						changed |= legend && legend.handleEvent(e);
						changed |= tooltip && tooltip.handleEvent(e);

						var bufferedRequest = me._bufferedRequest;
						if (bufferedRequest) {
							// If we have an update that was triggered, we need to do a normal render
							me.render(bufferedRequest.duration, bufferedRequest.lazy);
						} else if (changed && !me.animating) {
							// If entering, leaving, or changing elements, animate the change via pivot
							me.stop();

							// We only need to render at this point. Updating will cause scales to be
							// recomputed generating flicker & using more memory than necessary.
							me.render(hoverOptions.animationDuration, true);
						}

						me._bufferedRender = false;
						me._bufferedRequest = null;

						return me;
					},

					/**
      * Handle an event
      * @private
      * param e {Event} the event to handle
      * @return {Boolean} true if the chart needs to re-render
      */
					handleEvent: function handleEvent(e) {
						var me = this;
						var options = me.options || {};
						var hoverOptions = options.hover;
						var changed = false;

						me.lastActive = me.lastActive || [];

						// Find Active Elements for hover and tooltips
						if (e.type === 'mouseout') {
							me.active = [];
						} else {
							me.active = me.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions);
						}

						// On Hover hook
						if (hoverOptions.onHover) {
							hoverOptions.onHover.call(me, me.active);
						}

						if (e.type === 'mouseup' || e.type === 'click') {
							if (options.onClick) {
								options.onClick.call(me, e, me.active);
							}
						}

						// Remove styling for last active (even if it may still be active)
						if (me.lastActive.length) {
							me.updateHoverStyle(me.lastActive, hoverOptions.mode, false);
						}

						// Built in hover styling
						if (me.active.length && hoverOptions.mode) {
							me.updateHoverStyle(me.active, hoverOptions.mode, true);
						}

						changed = !helpers.arrayEquals(me.active, me.lastActive);

						// Remember Last Actives
						me.lastActive = me.active;

						return changed;
					}
				});
			};
		}, {}], 24: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];

				/**
     * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
     * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
     * called on the 'onData*' callbacks (e.g. onDataPush, etc.) with same arguments.
     */
				function listenArrayEvents(array, listener) {
					if (array._chartjs) {
						array._chartjs.listeners.push(listener);
						return;
					}

					Object.defineProperty(array, '_chartjs', {
						configurable: true,
						enumerable: false,
						value: {
							listeners: [listener]
						}
					});

					arrayEvents.forEach(function (key) {
						var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
						var base = array[key];

						Object.defineProperty(array, key, {
							configurable: true,
							enumerable: false,
							value: function value() {
								var args = Array.prototype.slice.call(arguments);
								var res = base.apply(this, args);

								helpers.each(array._chartjs.listeners, function (object) {
									if (typeof object[method] === 'function') {
										object[method].apply(object, args);
									}
								});

								return res;
							}
						});
					});
				}

				/**
     * Removes the given array event listener and cleanup extra attached properties (such as
     * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
     */
				function unlistenArrayEvents(array, listener) {
					var stub = array._chartjs;
					if (!stub) {
						return;
					}

					var listeners = stub.listeners;
					var index = listeners.indexOf(listener);
					if (index !== -1) {
						listeners.splice(index, 1);
					}

					if (listeners.length > 0) {
						return;
					}

					arrayEvents.forEach(function (key) {
						delete array[key];
					});

					delete array._chartjs;
				}

				// Base class for all dataset controllers (line, bar, etc)
				Chart.DatasetController = function (chart, datasetIndex) {
					this.initialize(chart, datasetIndex);
				};

				helpers.extend(Chart.DatasetController.prototype, {

					/**
      * Element type used to generate a meta dataset (e.g. Chart.element.Line).
      * @type {Chart.core.element}
      */
					datasetElementType: null,

					/**
      * Element type used to generate a meta data (e.g. Chart.element.Point).
      * @type {Chart.core.element}
      */
					dataElementType: null,

					initialize: function initialize(chart, datasetIndex) {
						var me = this;
						me.chart = chart;
						me.index = datasetIndex;
						me.linkScales();
						me.addElements();
					},

					updateIndex: function updateIndex(datasetIndex) {
						this.index = datasetIndex;
					},

					linkScales: function linkScales() {
						var me = this;
						var meta = me.getMeta();
						var dataset = me.getDataset();

						if (meta.xAxisID === null) {
							meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
						}
						if (meta.yAxisID === null) {
							meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
						}
					},

					getDataset: function getDataset() {
						return this.chart.data.datasets[this.index];
					},

					getMeta: function getMeta() {
						return this.chart.getDatasetMeta(this.index);
					},

					getScaleForId: function getScaleForId(scaleID) {
						return this.chart.scales[scaleID];
					},

					reset: function reset() {
						this.update(true);
					},

					/**
      * @private
      */
					destroy: function destroy() {
						if (this._data) {
							unlistenArrayEvents(this._data, this);
						}
					},

					createMetaDataset: function createMetaDataset() {
						var me = this;
						var type = me.datasetElementType;
						return type && new type({
							_chart: me.chart.chart,
							_datasetIndex: me.index
						});
					},

					createMetaData: function createMetaData(index) {
						var me = this;
						var type = me.dataElementType;
						return type && new type({
							_chart: me.chart.chart,
							_datasetIndex: me.index,
							_index: index
						});
					},

					addElements: function addElements() {
						var me = this;
						var meta = me.getMeta();
						var data = me.getDataset().data || [];
						var metaData = meta.data;
						var i, ilen;

						for (i = 0, ilen = data.length; i < ilen; ++i) {
							metaData[i] = metaData[i] || me.createMetaData(i);
						}

						meta.dataset = meta.dataset || me.createMetaDataset();
					},

					addElementAndReset: function addElementAndReset(index) {
						var element = this.createMetaData(index);
						this.getMeta().data.splice(index, 0, element);
						this.updateElement(element, index, true);
					},

					buildOrUpdateElements: function buildOrUpdateElements() {
						var me = this;
						var dataset = me.getDataset();
						var data = dataset.data || (dataset.data = []);

						// In order to correctly handle data addition/deletion animation (an thus simulate
						// real-time charts), we need to monitor these data modifications and synchronize
						// the internal meta data accordingly.
						if (me._data !== data) {
							if (me._data) {
								// This case happens when the user replaced the data array instance.
								unlistenArrayEvents(me._data, me);
							}

							listenArrayEvents(data, me);
							me._data = data;
						}

						// Re-sync meta data in case the user replaced the data array or if we missed
						// any updates and so make sure that we handle number of datapoints changing.
						me.resyncElements();
					},

					update: helpers.noop,

					draw: function draw(ease) {
						var easingDecimal = ease || 1;
						var i, len;
						var metaData = this.getMeta().data;
						for (i = 0, len = metaData.length; i < len; ++i) {
							metaData[i].transition(easingDecimal).draw();
						}
					},

					removeHoverStyle: function removeHoverStyle(element, elementOpts) {
						var dataset = this.chart.data.datasets[element._datasetIndex],
						    index = element._index,
						    custom = element.custom || {},
						    valueOrDefault = helpers.getValueAtIndexOrDefault,
						    model = element._model;

						model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
						model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
						model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);
					},

					setHoverStyle: function setHoverStyle(element) {
						var dataset = this.chart.data.datasets[element._datasetIndex],
						    index = element._index,
						    custom = element.custom || {},
						    valueOrDefault = helpers.getValueAtIndexOrDefault,
						    getHoverColor = helpers.getHoverColor,
						    model = element._model;

						model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueOrDefault(dataset.hoverBackgroundColor, index, getHoverColor(model.backgroundColor));
						model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : valueOrDefault(dataset.hoverBorderColor, index, getHoverColor(model.borderColor));
						model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : valueOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
					},

					/**
      * @private
      */
					resyncElements: function resyncElements() {
						var me = this;
						var meta = me.getMeta();
						var data = me.getDataset().data;
						var numMeta = meta.data.length;
						var numData = data.length;

						if (numData < numMeta) {
							meta.data.splice(numData, numMeta - numData);
						} else if (numData > numMeta) {
							me.insertElements(numMeta, numData - numMeta);
						}
					},

					/**
      * @private
      */
					insertElements: function insertElements(start, count) {
						for (var i = 0; i < count; ++i) {
							this.addElementAndReset(start + i);
						}
					},

					/**
      * @private
      */
					onDataPush: function onDataPush() {
						this.insertElements(this.getDataset().data.length - 1, arguments.length);
					},

					/**
      * @private
      */
					onDataPop: function onDataPop() {
						this.getMeta().data.pop();
					},

					/**
      * @private
      */
					onDataShift: function onDataShift() {
						this.getMeta().data.shift();
					},

					/**
      * @private
      */
					onDataSplice: function onDataSplice(start, count) {
						this.getMeta().data.splice(start, count);
						this.insertElements(start, arguments.length - 2);
					},

					/**
      * @private
      */
					onDataUnshift: function onDataUnshift() {
						this.insertElements(0, arguments.length);
					}
				});

				Chart.DatasetController.extend = helpers.inherits;
			};
		}, {}], 25: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.elements = {};

				Chart.Element = function (configuration) {
					helpers.extend(this, configuration);
					this.initialize.apply(this, arguments);
				};

				helpers.extend(Chart.Element.prototype, {

					initialize: function initialize() {
						this.hidden = false;
					},

					pivot: function pivot() {
						var me = this;
						if (!me._view) {
							me._view = helpers.clone(me._model);
						}
						me._start = helpers.clone(me._view);
						return me;
					},

					transition: function transition(ease) {
						var me = this;

						if (!me._view) {
							me._view = helpers.clone(me._model);
						}

						// No animation -> No Transition
						if (ease === 1) {
							me._view = me._model;
							me._start = null;
							return me;
						}

						if (!me._start) {
							me.pivot();
						}

						helpers.each(me._model, function (value, key) {

							if (key[0] === '_') {
								// Only non-underscored properties
								// Init if doesn't exist
							} else if (!me._view.hasOwnProperty(key)) {
								if (typeof value === 'number' && !isNaN(me._view[key])) {
									me._view[key] = value * ease;
								} else {
									me._view[key] = value;
								}
								// No unnecessary computations
							} else if (value === me._view[key]) {
								// It's the same! Woohoo!
								// Color transitions if possible
							} else if (typeof value === 'string') {
								try {
									var color = helpers.color(me._model[key]).mix(helpers.color(me._start[key]), ease);
									me._view[key] = color.rgbString();
								} catch (err) {
									me._view[key] = value;
								}
								// Number transitions
							} else if (typeof value === 'number') {
								var startVal = me._start[key] !== undefined && isNaN(me._start[key]) === false ? me._start[key] : 0;
								me._view[key] = (me._model[key] - startVal) * ease + startVal;
								// Everything else
							} else {
								me._view[key] = value;
							}
						}, me);

						return me;
					},

					tooltipPosition: function tooltipPosition() {
						return {
							x: this._model.x,
							y: this._model.y
						};
					},

					hasValue: function hasValue() {
						return helpers.isNumber(this._model.x) && helpers.isNumber(this._model.y);
					}
				});

				Chart.Element.extend = helpers.inherits;
			};
		}, {}], 26: [function (require, module, exports) {
			/* global window: false */
			/* global document: false */
			'use strict';

			var color = require(3);

			module.exports = function (Chart) {
				// Global Chart helpers object for utility methods and classes
				var helpers = Chart.helpers = {};

				// -- Basic js utility methods
				helpers.each = function (loopable, callback, self, reverse) {
					// Check to see if null or undefined firstly.
					var i, len;
					if (helpers.isArray(loopable)) {
						len = loopable.length;
						if (reverse) {
							for (i = len - 1; i >= 0; i--) {
								callback.call(self, loopable[i], i);
							}
						} else {
							for (i = 0; i < len; i++) {
								callback.call(self, loopable[i], i);
							}
						}
					} else if ((typeof loopable === 'undefined' ? 'undefined' : _typeof(loopable)) === 'object') {
						var keys = Object.keys(loopable);
						len = keys.length;
						for (i = 0; i < len; i++) {
							callback.call(self, loopable[keys[i]], keys[i]);
						}
					}
				};
				helpers.clone = function (obj) {
					var objClone = {};
					helpers.each(obj, function (value, key) {
						if (helpers.isArray(value)) {
							objClone[key] = value.slice(0);
						} else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
							objClone[key] = helpers.clone(value);
						} else {
							objClone[key] = value;
						}
					});
					return objClone;
				};
				helpers.extend = function (base) {
					var setFn = function setFn(value, key) {
						base[key] = value;
					};
					for (var i = 1, ilen = arguments.length; i < ilen; i++) {
						helpers.each(arguments[i], setFn);
					}
					return base;
				};
				// Need a special merge function to chart configs since they are now grouped
				helpers.configMerge = function (_base) {
					var base = helpers.clone(_base);
					helpers.each(Array.prototype.slice.call(arguments, 1), function (extension) {
						helpers.each(extension, function (value, key) {
							var baseHasProperty = base.hasOwnProperty(key);
							var baseVal = baseHasProperty ? base[key] : {};

							if (key === 'scales') {
								// Scale config merging is complex. Add our own function here for that
								base[key] = helpers.scaleMerge(baseVal, value);
							} else if (key === 'scale') {
								// Used in polar area & radar charts since there is only one scale
								base[key] = helpers.configMerge(baseVal, Chart.scaleService.getScaleDefaults(value.type), value);
							} else if (baseHasProperty && (typeof baseVal === 'undefined' ? 'undefined' : _typeof(baseVal)) === 'object' && !helpers.isArray(baseVal) && baseVal !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !helpers.isArray(value)) {
								// If we are overwriting an object with an object, do a merge of the properties.
								base[key] = helpers.configMerge(baseVal, value);
							} else {
								// can just overwrite the value in this case
								base[key] = value;
							}
						});
					});

					return base;
				};
				helpers.scaleMerge = function (_base, extension) {
					var base = helpers.clone(_base);

					helpers.each(extension, function (value, key) {
						if (key === 'xAxes' || key === 'yAxes') {
							// These properties are arrays of items
							if (base.hasOwnProperty(key)) {
								helpers.each(value, function (valueObj, index) {
									var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
									var axisDefaults = Chart.scaleService.getScaleDefaults(axisType);
									if (index >= base[key].length || !base[key][index].type) {
										base[key].push(helpers.configMerge(axisDefaults, valueObj));
									} else if (valueObj.type && valueObj.type !== base[key][index].type) {
										// Type changed. Bring in the new defaults before we bring in valueObj so that valueObj can override the correct scale defaults
										base[key][index] = helpers.configMerge(base[key][index], axisDefaults, valueObj);
									} else {
										// Type is the same
										base[key][index] = helpers.configMerge(base[key][index], valueObj);
									}
								});
							} else {
								base[key] = [];
								helpers.each(value, function (valueObj) {
									var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
									base[key].push(helpers.configMerge(Chart.scaleService.getScaleDefaults(axisType), valueObj));
								});
							}
						} else if (base.hasOwnProperty(key) && _typeof(base[key]) === 'object' && base[key] !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
							// If we are overwriting an object with an object, do a merge of the properties.
							base[key] = helpers.configMerge(base[key], value);
						} else {
							// can just overwrite the value in this case
							base[key] = value;
						}
					});

					return base;
				};
				helpers.getValueAtIndexOrDefault = function (value, index, defaultValue) {
					if (value === undefined || value === null) {
						return defaultValue;
					}

					if (helpers.isArray(value)) {
						return index < value.length ? value[index] : defaultValue;
					}

					return value;
				};
				helpers.getValueOrDefault = function (value, defaultValue) {
					return value === undefined ? defaultValue : value;
				};
				helpers.indexOf = Array.prototype.indexOf ? function (array, item) {
					return array.indexOf(item);
				} : function (array, item) {
					for (var i = 0, ilen = array.length; i < ilen; ++i) {
						if (array[i] === item) {
							return i;
						}
					}
					return -1;
				};
				helpers.where = function (collection, filterCallback) {
					if (helpers.isArray(collection) && Array.prototype.filter) {
						return collection.filter(filterCallback);
					}
					var filtered = [];

					helpers.each(collection, function (item) {
						if (filterCallback(item)) {
							filtered.push(item);
						}
					});

					return filtered;
				};
				helpers.findIndex = Array.prototype.findIndex ? function (array, callback, scope) {
					return array.findIndex(callback, scope);
				} : function (array, callback, scope) {
					scope = scope === undefined ? array : scope;
					for (var i = 0, ilen = array.length; i < ilen; ++i) {
						if (callback.call(scope, array[i], i, array)) {
							return i;
						}
					}
					return -1;
				};
				helpers.findNextWhere = function (arrayToSearch, filterCallback, startIndex) {
					// Default to start of the array
					if (startIndex === undefined || startIndex === null) {
						startIndex = -1;
					}
					for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
						var currentItem = arrayToSearch[i];
						if (filterCallback(currentItem)) {
							return currentItem;
						}
					}
				};
				helpers.findPreviousWhere = function (arrayToSearch, filterCallback, startIndex) {
					// Default to end of the array
					if (startIndex === undefined || startIndex === null) {
						startIndex = arrayToSearch.length;
					}
					for (var i = startIndex - 1; i >= 0; i--) {
						var currentItem = arrayToSearch[i];
						if (filterCallback(currentItem)) {
							return currentItem;
						}
					}
				};
				helpers.inherits = function (extensions) {
					// Basic javascript inheritance based on the model created in Backbone.js
					var me = this;
					var ChartElement = extensions && extensions.hasOwnProperty('constructor') ? extensions.constructor : function () {
						return me.apply(this, arguments);
					};

					var Surrogate = function Surrogate() {
						this.constructor = ChartElement;
					};
					Surrogate.prototype = me.prototype;
					ChartElement.prototype = new Surrogate();

					ChartElement.extend = helpers.inherits;

					if (extensions) {
						helpers.extend(ChartElement.prototype, extensions);
					}

					ChartElement.__super__ = me.prototype;

					return ChartElement;
				};
				helpers.noop = function () {};
				helpers.uid = function () {
					var id = 0;
					return function () {
						return id++;
					};
				}();
				// -- Math methods
				helpers.isNumber = function (n) {
					return !isNaN(parseFloat(n)) && isFinite(n);
				};
				helpers.almostEquals = function (x, y, epsilon) {
					return Math.abs(x - y) < epsilon;
				};
				helpers.max = function (array) {
					return array.reduce(function (max, value) {
						if (!isNaN(value)) {
							return Math.max(max, value);
						}
						return max;
					}, Number.NEGATIVE_INFINITY);
				};
				helpers.min = function (array) {
					return array.reduce(function (min, value) {
						if (!isNaN(value)) {
							return Math.min(min, value);
						}
						return min;
					}, Number.POSITIVE_INFINITY);
				};
				helpers.sign = Math.sign ? function (x) {
					return Math.sign(x);
				} : function (x) {
					x = +x; // convert to a number
					if (x === 0 || isNaN(x)) {
						return x;
					}
					return x > 0 ? 1 : -1;
				};
				helpers.log10 = Math.log10 ? function (x) {
					return Math.log10(x);
				} : function (x) {
					return Math.log(x) / Math.LN10;
				};
				helpers.toRadians = function (degrees) {
					return degrees * (Math.PI / 180);
				};
				helpers.toDegrees = function (radians) {
					return radians * (180 / Math.PI);
				};
				// Gets the angle from vertical upright to the point about a centre.
				helpers.getAngleFromPoint = function (centrePoint, anglePoint) {
					var distanceFromXCenter = anglePoint.x - centrePoint.x,
					    distanceFromYCenter = anglePoint.y - centrePoint.y,
					    radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);

					var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);

					if (angle < -0.5 * Math.PI) {
						angle += 2.0 * Math.PI; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
					}

					return {
						angle: angle,
						distance: radialDistanceFromCenter
					};
				};
				helpers.distanceBetweenPoints = function (pt1, pt2) {
					return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
				};
				helpers.aliasPixel = function (pixelWidth) {
					return pixelWidth % 2 === 0 ? 0 : 0.5;
				};
				helpers.splineCurve = function (firstPoint, middlePoint, afterPoint, t) {
					// Props to Rob Spencer at scaled innovation for his post on splining between points
					// http://scaledinnovation.com/analytics/splines/aboutSplines.html

					// This function must also respect "skipped" points

					var previous = firstPoint.skip ? middlePoint : firstPoint,
					    current = middlePoint,
					    next = afterPoint.skip ? middlePoint : afterPoint;

					var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
					var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));

					var s01 = d01 / (d01 + d12);
					var s12 = d12 / (d01 + d12);

					// If all points are the same, s01 & s02 will be inf
					s01 = isNaN(s01) ? 0 : s01;
					s12 = isNaN(s12) ? 0 : s12;

					var fa = t * s01; // scaling factor for triangle Ta
					var fb = t * s12;

					return {
						previous: {
							x: current.x - fa * (next.x - previous.x),
							y: current.y - fa * (next.y - previous.y)
						},
						next: {
							x: current.x + fb * (next.x - previous.x),
							y: current.y + fb * (next.y - previous.y)
						}
					};
				};
				helpers.EPSILON = Number.EPSILON || 1e-14;
				helpers.splineCurveMonotone = function (points) {
					// This function calculates Bézier control points in a similar way than |splineCurve|,
					// but preserves monotonicity of the provided data and ensures no local extremums are added
					// between the dataset discrete points due to the interpolation.
					// See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation

					var pointsWithTangents = (points || []).map(function (point) {
						return {
							model: point._model,
							deltaK: 0,
							mK: 0
						};
					});

					// Calculate slopes (deltaK) and initialize tangents (mK)
					var pointsLen = pointsWithTangents.length;
					var i, pointBefore, pointCurrent, pointAfter;
					for (i = 0; i < pointsLen; ++i) {
						pointCurrent = pointsWithTangents[i];
						if (pointCurrent.model.skip) {
							continue;
						}

						pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
						pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
						if (pointAfter && !pointAfter.model.skip) {
							pointCurrent.deltaK = (pointAfter.model.y - pointCurrent.model.y) / (pointAfter.model.x - pointCurrent.model.x);
						}

						if (!pointBefore || pointBefore.model.skip) {
							pointCurrent.mK = pointCurrent.deltaK;
						} else if (!pointAfter || pointAfter.model.skip) {
							pointCurrent.mK = pointBefore.deltaK;
						} else if (this.sign(pointBefore.deltaK) !== this.sign(pointCurrent.deltaK)) {
							pointCurrent.mK = 0;
						} else {
							pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2;
						}
					}

					// Adjust tangents to ensure monotonic properties
					var alphaK, betaK, tauK, squaredMagnitude;
					for (i = 0; i < pointsLen - 1; ++i) {
						pointCurrent = pointsWithTangents[i];
						pointAfter = pointsWithTangents[i + 1];
						if (pointCurrent.model.skip || pointAfter.model.skip) {
							continue;
						}

						if (helpers.almostEquals(pointCurrent.deltaK, 0, this.EPSILON)) {
							pointCurrent.mK = pointAfter.mK = 0;
							continue;
						}

						alphaK = pointCurrent.mK / pointCurrent.deltaK;
						betaK = pointAfter.mK / pointCurrent.deltaK;
						squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
						if (squaredMagnitude <= 9) {
							continue;
						}

						tauK = 3 / Math.sqrt(squaredMagnitude);
						pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
						pointAfter.mK = betaK * tauK * pointCurrent.deltaK;
					}

					// Compute control points
					var deltaX;
					for (i = 0; i < pointsLen; ++i) {
						pointCurrent = pointsWithTangents[i];
						if (pointCurrent.model.skip) {
							continue;
						}

						pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
						pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
						if (pointBefore && !pointBefore.model.skip) {
							deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
							pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
							pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK;
						}
						if (pointAfter && !pointAfter.model.skip) {
							deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
							pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
							pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK;
						}
					}
				};
				helpers.nextItem = function (collection, index, loop) {
					if (loop) {
						return index >= collection.length - 1 ? collection[0] : collection[index + 1];
					}
					return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
				};
				helpers.previousItem = function (collection, index, loop) {
					if (loop) {
						return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
					}
					return index <= 0 ? collection[0] : collection[index - 1];
				};
				// Implementation of the nice number algorithm used in determining where axis labels will go
				helpers.niceNum = function (range, round) {
					var exponent = Math.floor(helpers.log10(range));
					var fraction = range / Math.pow(10, exponent);
					var niceFraction;

					if (round) {
						if (fraction < 1.5) {
							niceFraction = 1;
						} else if (fraction < 3) {
							niceFraction = 2;
						} else if (fraction < 7) {
							niceFraction = 5;
						} else {
							niceFraction = 10;
						}
					} else if (fraction <= 1.0) {
						niceFraction = 1;
					} else if (fraction <= 2) {
						niceFraction = 2;
					} else if (fraction <= 5) {
						niceFraction = 5;
					} else {
						niceFraction = 10;
					}

					return niceFraction * Math.pow(10, exponent);
				};
				// Easing functions adapted from Robert Penner's easing equations
				// http://www.robertpenner.com/easing/
				var easingEffects = helpers.easingEffects = {
					linear: function linear(t) {
						return t;
					},
					easeInQuad: function easeInQuad(t) {
						return t * t;
					},
					easeOutQuad: function easeOutQuad(t) {
						return -1 * t * (t - 2);
					},
					easeInOutQuad: function easeInOutQuad(t) {
						if ((t /= 1 / 2) < 1) {
							return 1 / 2 * t * t;
						}
						return -1 / 2 * (--t * (t - 2) - 1);
					},
					easeInCubic: function easeInCubic(t) {
						return t * t * t;
					},
					easeOutCubic: function easeOutCubic(t) {
						return 1 * ((t = t / 1 - 1) * t * t + 1);
					},
					easeInOutCubic: function easeInOutCubic(t) {
						if ((t /= 1 / 2) < 1) {
							return 1 / 2 * t * t * t;
						}
						return 1 / 2 * ((t -= 2) * t * t + 2);
					},
					easeInQuart: function easeInQuart(t) {
						return t * t * t * t;
					},
					easeOutQuart: function easeOutQuart(t) {
						return -1 * ((t = t / 1 - 1) * t * t * t - 1);
					},
					easeInOutQuart: function easeInOutQuart(t) {
						if ((t /= 1 / 2) < 1) {
							return 1 / 2 * t * t * t * t;
						}
						return -1 / 2 * ((t -= 2) * t * t * t - 2);
					},
					easeInQuint: function easeInQuint(t) {
						return 1 * (t /= 1) * t * t * t * t;
					},
					easeOutQuint: function easeOutQuint(t) {
						return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
					},
					easeInOutQuint: function easeInOutQuint(t) {
						if ((t /= 1 / 2) < 1) {
							return 1 / 2 * t * t * t * t * t;
						}
						return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
					},
					easeInSine: function easeInSine(t) {
						return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
					},
					easeOutSine: function easeOutSine(t) {
						return 1 * Math.sin(t / 1 * (Math.PI / 2));
					},
					easeInOutSine: function easeInOutSine(t) {
						return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
					},
					easeInExpo: function easeInExpo(t) {
						return t === 0 ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
					},
					easeOutExpo: function easeOutExpo(t) {
						return t === 1 ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
					},
					easeInOutExpo: function easeInOutExpo(t) {
						if (t === 0) {
							return 0;
						}
						if (t === 1) {
							return 1;
						}
						if ((t /= 1 / 2) < 1) {
							return 1 / 2 * Math.pow(2, 10 * (t - 1));
						}
						return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
					},
					easeInCirc: function easeInCirc(t) {
						if (t >= 1) {
							return t;
						}
						return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
					},
					easeOutCirc: function easeOutCirc(t) {
						return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
					},
					easeInOutCirc: function easeInOutCirc(t) {
						if ((t /= 1 / 2) < 1) {
							return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
						}
						return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
					},
					easeInElastic: function easeInElastic(t) {
						var s = 1.70158;
						var p = 0;
						var a = 1;
						if (t === 0) {
							return 0;
						}
						if ((t /= 1) === 1) {
							return 1;
						}
						if (!p) {
							p = 1 * 0.3;
						}
						if (a < Math.abs(1)) {
							a = 1;
							s = p / 4;
						} else {
							s = p / (2 * Math.PI) * Math.asin(1 / a);
						}
						return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
					},
					easeOutElastic: function easeOutElastic(t) {
						var s = 1.70158;
						var p = 0;
						var a = 1;
						if (t === 0) {
							return 0;
						}
						if ((t /= 1) === 1) {
							return 1;
						}
						if (!p) {
							p = 1 * 0.3;
						}
						if (a < Math.abs(1)) {
							a = 1;
							s = p / 4;
						} else {
							s = p / (2 * Math.PI) * Math.asin(1 / a);
						}
						return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
					},
					easeInOutElastic: function easeInOutElastic(t) {
						var s = 1.70158;
						var p = 0;
						var a = 1;
						if (t === 0) {
							return 0;
						}
						if ((t /= 1 / 2) === 2) {
							return 1;
						}
						if (!p) {
							p = 1 * (0.3 * 1.5);
						}
						if (a < Math.abs(1)) {
							a = 1;
							s = p / 4;
						} else {
							s = p / (2 * Math.PI) * Math.asin(1 / a);
						}
						if (t < 1) {
							return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
						}
						return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
					},
					easeInBack: function easeInBack(t) {
						var s = 1.70158;
						return 1 * (t /= 1) * t * ((s + 1) * t - s);
					},
					easeOutBack: function easeOutBack(t) {
						var s = 1.70158;
						return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
					},
					easeInOutBack: function easeInOutBack(t) {
						var s = 1.70158;
						if ((t /= 1 / 2) < 1) {
							return 1 / 2 * (t * t * (((s *= 1.525) + 1) * t - s));
						}
						return 1 / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
					},
					easeInBounce: function easeInBounce(t) {
						return 1 - easingEffects.easeOutBounce(1 - t);
					},
					easeOutBounce: function easeOutBounce(t) {
						if ((t /= 1) < 1 / 2.75) {
							return 1 * (7.5625 * t * t);
						} else if (t < 2 / 2.75) {
							return 1 * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
						} else if (t < 2.5 / 2.75) {
							return 1 * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
						}
						return 1 * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
					},
					easeInOutBounce: function easeInOutBounce(t) {
						if (t < 1 / 2) {
							return easingEffects.easeInBounce(t * 2) * 0.5;
						}
						return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
					}
				};
				// Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
				helpers.requestAnimFrame = function () {
					return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
						return window.setTimeout(callback, 1000 / 60);
					};
				}();
				helpers.cancelAnimFrame = function () {
					return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (callback) {
						return window.clearTimeout(callback, 1000 / 60);
					};
				}();
				// -- DOM methods
				helpers.getRelativePosition = function (evt, chart) {
					var mouseX, mouseY;
					var e = evt.originalEvent || evt,
					    canvas = evt.currentTarget || evt.srcElement,
					    boundingRect = canvas.getBoundingClientRect();

					var touches = e.touches;
					if (touches && touches.length > 0) {
						mouseX = touches[0].clientX;
						mouseY = touches[0].clientY;
					} else {
						mouseX = e.clientX;
						mouseY = e.clientY;
					}

					// Scale mouse coordinates into canvas coordinates
					// by following the pattern laid out by 'jerryj' in the comments of
					// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
					var paddingLeft = parseFloat(helpers.getStyle(canvas, 'padding-left'));
					var paddingTop = parseFloat(helpers.getStyle(canvas, 'padding-top'));
					var paddingRight = parseFloat(helpers.getStyle(canvas, 'padding-right'));
					var paddingBottom = parseFloat(helpers.getStyle(canvas, 'padding-bottom'));
					var width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
					var height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;

					// We divide by the current device pixel ratio, because the canvas is scaled up by that amount in each direction. However
					// the backend model is in unscaled coordinates. Since we are going to deal with our model coordinates, we go back here
					mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / width * canvas.width / chart.currentDevicePixelRatio);
					mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / height * canvas.height / chart.currentDevicePixelRatio);

					return {
						x: mouseX,
						y: mouseY
					};
				};
				helpers.addEvent = function (node, eventType, method) {
					if (node.addEventListener) {
						node.addEventListener(eventType, method);
					} else if (node.attachEvent) {
						node.attachEvent('on' + eventType, method);
					} else {
						node['on' + eventType] = method;
					}
				};
				helpers.removeEvent = function (node, eventType, handler) {
					if (node.removeEventListener) {
						node.removeEventListener(eventType, handler, false);
					} else if (node.detachEvent) {
						node.detachEvent('on' + eventType, handler);
					} else {
						node['on' + eventType] = helpers.noop;
					}
				};
				helpers.bindEvents = function (chartInstance, arrayOfEvents, handler) {
					// Create the events object if it's not already present
					var events = chartInstance.events = chartInstance.events || {};

					helpers.each(arrayOfEvents, function (eventName) {
						events[eventName] = function () {
							handler.apply(chartInstance, arguments);
						};
						helpers.addEvent(chartInstance.chart.canvas, eventName, events[eventName]);
					});
				};
				helpers.unbindEvents = function (chartInstance, arrayOfEvents) {
					var canvas = chartInstance.chart.canvas;
					helpers.each(arrayOfEvents, function (handler, eventName) {
						helpers.removeEvent(canvas, eventName, handler);
					});
				};

				// Private helper function to convert max-width/max-height values that may be percentages into a number
				function parseMaxStyle(styleValue, node, parentProperty) {
					var valueInPixels;
					if (typeof styleValue === 'string') {
						valueInPixels = parseInt(styleValue, 10);

						if (styleValue.indexOf('%') !== -1) {
							// percentage * size in dimension
							valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
						}
					} else {
						valueInPixels = styleValue;
					}

					return valueInPixels;
				}

				/**
     * Returns if the given value contains an effective constraint.
     * @private
     */
				function isConstrainedValue(value) {
					return value !== undefined && value !== null && value !== 'none';
				}

				// Private helper to get a constraint dimension
				// @param domNode : the node to check the constraint on
				// @param maxStyle : the style that defines the maximum for the direction we are using (maxWidth / maxHeight)
				// @param percentageProperty : property of parent to use when calculating width as a percentage
				// @see http://www.nathanaeljones.com/blog/2013/reading-max-width-cross-browser
				function getConstraintDimension(domNode, maxStyle, percentageProperty) {
					var view = document.defaultView;
					var parentNode = domNode.parentNode;
					var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
					var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
					var hasCNode = isConstrainedValue(constrainedNode);
					var hasCContainer = isConstrainedValue(constrainedContainer);
					var infinity = Number.POSITIVE_INFINITY;

					if (hasCNode || hasCContainer) {
						return Math.min(hasCNode ? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity, hasCContainer ? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
					}

					return 'none';
				}
				// returns Number or undefined if no constraint
				helpers.getConstraintWidth = function (domNode) {
					return getConstraintDimension(domNode, 'max-width', 'clientWidth');
				};
				// returns Number or undefined if no constraint
				helpers.getConstraintHeight = function (domNode) {
					return getConstraintDimension(domNode, 'max-height', 'clientHeight');
				};
				helpers.getMaximumWidth = function (domNode) {
					var container = domNode.parentNode;
					var paddingLeft = parseInt(helpers.getStyle(container, 'padding-left'), 10);
					var paddingRight = parseInt(helpers.getStyle(container, 'padding-right'), 10);
					var w = container.clientWidth - paddingLeft - paddingRight;
					var cw = helpers.getConstraintWidth(domNode);
					return isNaN(cw) ? w : Math.min(w, cw);
				};
				helpers.getMaximumHeight = function (domNode) {
					var container = domNode.parentNode;
					var paddingTop = parseInt(helpers.getStyle(container, 'padding-top'), 10);
					var paddingBottom = parseInt(helpers.getStyle(container, 'padding-bottom'), 10);
					var h = container.clientHeight - paddingTop - paddingBottom;
					var ch = helpers.getConstraintHeight(domNode);
					return isNaN(ch) ? h : Math.min(h, ch);
				};
				helpers.getStyle = function (el, property) {
					return el.currentStyle ? el.currentStyle[property] : document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
				};
				helpers.retinaScale = function (chart) {
					var pixelRatio = chart.currentDevicePixelRatio = window.devicePixelRatio || 1;
					if (pixelRatio === 1) {
						return;
					}

					var canvas = chart.canvas;
					var height = chart.height;
					var width = chart.width;

					canvas.height = height * pixelRatio;
					canvas.width = width * pixelRatio;
					chart.ctx.scale(pixelRatio, pixelRatio);

					// If no style has been set on the canvas, the render size is used as display size,
					// making the chart visually bigger, so let's enforce it to the "correct" values.
					// See https://github.com/chartjs/Chart.js/issues/3575
					canvas.style.height = height + 'px';
					canvas.style.width = width + 'px';
				};
				// -- Canvas methods
				helpers.clear = function (chart) {
					chart.ctx.clearRect(0, 0, chart.width, chart.height);
				};
				helpers.fontString = function (pixelSize, fontStyle, fontFamily) {
					return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
				};
				helpers.longestText = function (ctx, font, arrayOfThings, cache) {
					cache = cache || {};
					var data = cache.data = cache.data || {};
					var gc = cache.garbageCollect = cache.garbageCollect || [];

					if (cache.font !== font) {
						data = cache.data = {};
						gc = cache.garbageCollect = [];
						cache.font = font;
					}

					ctx.font = font;
					var longest = 0;
					helpers.each(arrayOfThings, function (thing) {
						// Undefined strings and arrays should not be measured
						if (thing !== undefined && thing !== null && helpers.isArray(thing) !== true) {
							longest = helpers.measureText(ctx, data, gc, longest, thing);
						} else if (helpers.isArray(thing)) {
							// if it is an array lets measure each element
							// to do maybe simplify this function a bit so we can do this more recursively?
							helpers.each(thing, function (nestedThing) {
								// Undefined strings and arrays should not be measured
								if (nestedThing !== undefined && nestedThing !== null && !helpers.isArray(nestedThing)) {
									longest = helpers.measureText(ctx, data, gc, longest, nestedThing);
								}
							});
						}
					});

					var gcLen = gc.length / 2;
					if (gcLen > arrayOfThings.length) {
						for (var i = 0; i < gcLen; i++) {
							delete data[gc[i]];
						}
						gc.splice(0, gcLen);
					}
					return longest;
				};
				helpers.measureText = function (ctx, data, gc, longest, string) {
					var textWidth = data[string];
					if (!textWidth) {
						textWidth = data[string] = ctx.measureText(string).width;
						gc.push(string);
					}
					if (textWidth > longest) {
						longest = textWidth;
					}
					return longest;
				};
				helpers.numberOfLabelLines = function (arrayOfThings) {
					var numberOfLines = 1;
					helpers.each(arrayOfThings, function (thing) {
						if (helpers.isArray(thing)) {
							if (thing.length > numberOfLines) {
								numberOfLines = thing.length;
							}
						}
					});
					return numberOfLines;
				};
				helpers.drawRoundedRectangle = function (ctx, x, y, width, height, radius) {
					ctx.beginPath();
					ctx.moveTo(x + radius, y);
					ctx.lineTo(x + width - radius, y);
					ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
					ctx.lineTo(x + width, y + height - radius);
					ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
					ctx.lineTo(x + radius, y + height);
					ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
					ctx.lineTo(x, y + radius);
					ctx.quadraticCurveTo(x, y, x + radius, y);
					ctx.closePath();
				};
				helpers.color = function (c) {
					if (!color) {
						console.error('Color.js not found!');
						return c;
					}

					/* global CanvasGradient */
					if (c instanceof CanvasGradient) {
						return color(Chart.defaults.global.defaultColor);
					}

					return color(c);
				};
				helpers.addResizeListener = function (node, callback) {
					var iframe = document.createElement('iframe');
					iframe.className = 'chartjs-hidden-iframe';
					iframe.style.cssText = 'display:block;' + 'overflow:hidden;' + 'border:0;' + 'margin:0;' + 'top:0;' + 'left:0;' + 'bottom:0;' + 'right:0;' + 'height:100%;' + 'width:100%;' + 'position:absolute;' + 'pointer-events:none;' + 'z-index:-1;';

					// Prevent the iframe to gain focus on tab.
					// https://github.com/chartjs/Chart.js/issues/3090
					iframe.tabIndex = -1;

					// Let's keep track of this added iframe and thus avoid DOM query when removing it.
					var stub = node._chartjs = {
						resizer: iframe,
						ticking: false
					};

					// Throttle the callback notification until the next animation frame.
					var notify = function notify() {
						if (!stub.ticking) {
							stub.ticking = true;
							helpers.requestAnimFrame.call(window, function () {
								if (stub.resizer) {
									stub.ticking = false;
									return callback();
								}
							});
						}
					};

					// If the iframe is re-attached to the DOM, the resize listener is removed because the
					// content is reloaded, so make sure to install the handler after the iframe is loaded.
					// https://github.com/chartjs/Chart.js/issues/3521
					helpers.addEvent(iframe, 'load', function () {
						helpers.addEvent(iframe.contentWindow || iframe, 'resize', notify);

						// The iframe size might have changed while loading, which can also
						// happen if the size has been changed while detached from the DOM.
						notify();
					});

					node.insertBefore(iframe, node.firstChild);
				};
				helpers.removeResizeListener = function (node) {
					if (!node || !node._chartjs) {
						return;
					}

					var iframe = node._chartjs.resizer;
					if (iframe) {
						iframe.parentNode.removeChild(iframe);
						node._chartjs.resizer = null;
					}

					delete node._chartjs;
				};
				helpers.isArray = Array.isArray ? function (obj) {
					return Array.isArray(obj);
				} : function (obj) {
					return Object.prototype.toString.call(obj) === '[object Array]';
				};
				// ! @see http://stackoverflow.com/a/14853974
				helpers.arrayEquals = function (a0, a1) {
					var i, ilen, v0, v1;

					if (!a0 || !a1 || a0.length !== a1.length) {
						return false;
					}

					for (i = 0, ilen = a0.length; i < ilen; ++i) {
						v0 = a0[i];
						v1 = a1[i];

						if (v0 instanceof Array && v1 instanceof Array) {
							if (!helpers.arrayEquals(v0, v1)) {
								return false;
							}
						} else if (v0 !== v1) {
							// NOTE: two different object instances will never be equal: {x:20} != {x:20}
							return false;
						}
					}

					return true;
				};
				helpers.callCallback = function (fn, args, _tArg) {
					if (fn && typeof fn.call === 'function') {
						fn.apply(_tArg, args);
					}
				};
				helpers.getHoverColor = function (colorValue) {
					/* global CanvasPattern */
					return colorValue instanceof CanvasPattern ? colorValue : helpers.color(colorValue).saturate(0.5).darken(0.1).rgbString();
				};
			};
		}, { "3": 3 }], 27: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {
				var helpers = Chart.helpers;

				/**
     * Helper function to traverse all of the visible elements in the chart
     * @param chart {chart} the chart
     * @param handler {Function} the callback to execute for each visible item
     */
				function parseVisibleItems(chart, handler) {
					var datasets = chart.data.datasets;
					var meta, i, j, ilen, jlen;

					for (i = 0, ilen = datasets.length; i < ilen; ++i) {
						if (!chart.isDatasetVisible(i)) {
							continue;
						}

						meta = chart.getDatasetMeta(i);
						for (j = 0, jlen = meta.data.length; j < jlen; ++j) {
							var element = meta.data[j];
							if (!element._view.skip) {
								handler(element);
							}
						}
					}
				}

				/**
     * Helper function to get the items that intersect the event position
     * @param items {ChartElement[]} elements to filter
     * @param position {Point} the point to be nearest to
     * @return {ChartElement[]} the nearest items
     */
				function getIntersectItems(chart, position) {
					var elements = [];

					parseVisibleItems(chart, function (element) {
						if (element.inRange(position.x, position.y)) {
							elements.push(element);
						}
					});

					return elements;
				}

				/**
     * Helper function to get the items nearest to the event position considering all visible items in teh chart
     * @param chart {Chart} the chart to look at elements from
     * @param position {Point} the point to be nearest to
     * @param intersect {Boolean} if true, only consider items that intersect the position
     * @param distanceMetric {Function} Optional function to provide the distance between
     * @return {ChartElement[]} the nearest items
     */
				function getNearestItems(chart, position, intersect, distanceMetric) {
					var minDistance = Number.POSITIVE_INFINITY;
					var nearestItems = [];

					if (!distanceMetric) {
						distanceMetric = helpers.distanceBetweenPoints;
					}

					parseVisibleItems(chart, function (element) {
						if (intersect && !element.inRange(position.x, position.y)) {
							return;
						}

						var center = element.getCenterPoint();
						var distance = distanceMetric(position, center);

						if (distance < minDistance) {
							nearestItems = [element];
							minDistance = distance;
						} else if (distance === minDistance) {
							// Can have multiple items at the same distance in which case we sort by size
							nearestItems.push(element);
						}
					});

					return nearestItems;
				}

				function indexMode(chart, e, options) {
					var position = helpers.getRelativePosition(e, chart.chart);
					var distanceMetric = function distanceMetric(pt1, pt2) {
						return Math.abs(pt1.x - pt2.x);
					};
					var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
					var elements = [];

					if (!items.length) {
						return [];
					}

					chart.data.datasets.forEach(function (dataset, datasetIndex) {
						if (chart.isDatasetVisible(datasetIndex)) {
							var meta = chart.getDatasetMeta(datasetIndex),
							    element = meta.data[items[0]._index];

							// don't count items that are skipped (null data)
							if (element && !element._view.skip) {
								elements.push(element);
							}
						}
					});

					return elements;
				}

				/**
     * @interface IInteractionOptions
     */
				/**
     * If true, only consider items that intersect the point
     * @name IInterfaceOptions#boolean
     * @type Boolean
     */

				/**
     * @namespace Chart.Interaction
     * Contains interaction related functions
     */
				Chart.Interaction = {
					// Helper function for different modes
					modes: {
						single: function single(chart, e) {
							var position = helpers.getRelativePosition(e, chart.chart);
							var elements = [];

							parseVisibleItems(chart, function (element) {
								if (element.inRange(position.x, position.y)) {
									elements.push(element);
									return elements;
								}
							});

							return elements.slice(0, 1);
						},

						/**
       * @function Chart.Interaction.modes.label
       * @deprecated since version 2.4.0
       */
						label: indexMode,

						/**
       * Returns items at the same index. If the options.intersect parameter is true, we only return items if we intersect something
       * If the options.intersect mode is false, we find the nearest item and return the items at the same index as that item
       * @function Chart.Interaction.modes.index
       * @since v2.4.0
       * @param chart {chart} the chart we are returning items from
       * @param e {Event} the event we are find things at
       * @param options {IInteractionOptions} options to use during interaction
       * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
       */
						index: indexMode,

						/**
       * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
       * If the options.intersect is false, we find the nearest item and return the items in that dataset
       * @function Chart.Interaction.modes.dataset
       * @param chart {chart} the chart we are returning items from
       * @param e {Event} the event we are find things at
       * @param options {IInteractionOptions} options to use during interaction
       * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
       */
						dataset: function dataset(chart, e, options) {
							var position = helpers.getRelativePosition(e, chart.chart);
							var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false);

							if (items.length > 0) {
								items = chart.getDatasetMeta(items[0]._datasetIndex).data;
							}

							return items;
						},

						/**
       * @function Chart.Interaction.modes.x-axis
       * @deprecated since version 2.4.0. Use index mode and intersect == true
       */
						'x-axis': function xAxis(chart, e) {
							return indexMode(chart, e, true);
						},

						/**
       * Point mode returns all elements that hit test based on the event position
       * of the event
       * @function Chart.Interaction.modes.intersect
       * @param chart {chart} the chart we are returning items from
       * @param e {Event} the event we are find things at
       * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
       */
						point: function point(chart, e) {
							var position = helpers.getRelativePosition(e, chart.chart);
							return getIntersectItems(chart, position);
						},

						/**
       * nearest mode returns the element closest to the point
       * @function Chart.Interaction.modes.intersect
       * @param chart {chart} the chart we are returning items from
       * @param e {Event} the event we are find things at
       * @param options {IInteractionOptions} options to use
       * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
       */
						nearest: function nearest(chart, e, options) {
							var position = helpers.getRelativePosition(e, chart.chart);
							var nearestItems = getNearestItems(chart, position, options.intersect);

							// We have multiple items at the same distance from the event. Now sort by smallest
							if (nearestItems.length > 1) {
								nearestItems.sort(function (a, b) {
									var sizeA = a.getArea();
									var sizeB = b.getArea();
									var ret = sizeA - sizeB;

									if (ret === 0) {
										// if equal sort by dataset index
										ret = a._datasetIndex - b._datasetIndex;
									}

									return ret;
								});
							}

							// Return only 1 item
							return nearestItems.slice(0, 1);
						},

						/**
       * x mode returns the elements that hit-test at the current x coordinate
       * @function Chart.Interaction.modes.x
       * @param chart {chart} the chart we are returning items from
       * @param e {Event} the event we are find things at
       * @param options {IInteractionOptions} options to use
       * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
       */
						x: function x(chart, e, options) {
							var position = helpers.getRelativePosition(e, chart.chart);
							var items = [];
							var intersectsItem = false;

							parseVisibleItems(chart, function (element) {
								if (element.inXRange(position.x)) {
									items.push(element);
								}

								if (element.inRange(position.x, position.y)) {
									intersectsItem = true;
								}
							});

							// If we want to trigger on an intersect and we don't have any items
							// that intersect the position, return nothing
							if (options.intersect && !intersectsItem) {
								items = [];
							}
							return items;
						},

						/**
       * y mode returns the elements that hit-test at the current y coordinate
       * @function Chart.Interaction.modes.y
       * @param chart {chart} the chart we are returning items from
       * @param e {Event} the event we are find things at
       * @param options {IInteractionOptions} options to use
       * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
       */
						y: function y(chart, e, options) {
							var position = helpers.getRelativePosition(e, chart.chart);
							var items = [];
							var intersectsItem = false;

							parseVisibleItems(chart, function (element) {
								if (element.inYRange(position.y)) {
									items.push(element);
								}

								if (element.inRange(position.x, position.y)) {
									intersectsItem = true;
								}
							});

							// If we want to trigger on an intersect and we don't have any items
							// that intersect the position, return nothing
							if (options.intersect && !intersectsItem) {
								items = [];
							}
							return items;
						}
					}
				};
			};
		}, {}], 28: [function (require, module, exports) {
			'use strict';

			module.exports = function () {

				// Occupy the global variable of Chart, and create a simple base class
				var Chart = function Chart(item, config) {
					this.controller = new Chart.Controller(item, config, this);
					return this.controller;
				};

				// Globally expose the defaults to allow for user updating/changing
				Chart.defaults = {
					global: {
						responsive: true,
						responsiveAnimationDuration: 0,
						maintainAspectRatio: true,
						events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
						hover: {
							onHover: null,
							mode: 'nearest',
							intersect: true,
							animationDuration: 400
						},
						onClick: null,
						defaultColor: 'rgba(0,0,0,0.1)',
						defaultFontColor: '#666',
						defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
						defaultFontSize: 12,
						defaultFontStyle: 'normal',
						showLines: true,

						// Element defaults defined in element extensions
						elements: {},

						// Legend callback string
						legendCallback: function legendCallback(chart) {
							var text = [];
							text.push('<ul class="' + chart.id + '-legend">');
							for (var i = 0; i < chart.data.datasets.length; i++) {
								text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
								if (chart.data.datasets[i].label) {
									text.push(chart.data.datasets[i].label);
								}
								text.push('</li>');
							}
							text.push('</ul>');

							return text.join('');
						}
					}
				};

				Chart.Chart = Chart;

				return Chart;
			};
		}, {}], 29: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				// The layout service is very self explanatory.  It's responsible for the layout within a chart.
				// Scales, Legends and Plugins all rely on the layout service and can easily register to be placed anywhere they need
				// It is this service's responsibility of carrying out that layout.
				Chart.layoutService = {
					defaults: {},

					// Register a box to a chartInstance. A box is simply a reference to an object that requires layout. eg. Scales, Legend, Plugins.
					addBox: function addBox(chartInstance, box) {
						if (!chartInstance.boxes) {
							chartInstance.boxes = [];
						}
						chartInstance.boxes.push(box);
					},

					removeBox: function removeBox(chartInstance, box) {
						if (!chartInstance.boxes) {
							return;
						}
						chartInstance.boxes.splice(chartInstance.boxes.indexOf(box), 1);
					},

					// The most important function
					update: function update(chartInstance, width, height) {

						if (!chartInstance) {
							return;
						}

						var layoutOptions = chartInstance.options.layout;
						var padding = layoutOptions ? layoutOptions.padding : null;

						var leftPadding = 0;
						var rightPadding = 0;
						var topPadding = 0;
						var bottomPadding = 0;

						if (!isNaN(padding)) {
							// options.layout.padding is a number. assign to all
							leftPadding = padding;
							rightPadding = padding;
							topPadding = padding;
							bottomPadding = padding;
						} else {
							leftPadding = padding.left || 0;
							rightPadding = padding.right || 0;
							topPadding = padding.top || 0;
							bottomPadding = padding.bottom || 0;
						}

						var leftBoxes = helpers.where(chartInstance.boxes, function (box) {
							return box.options.position === 'left';
						});
						var rightBoxes = helpers.where(chartInstance.boxes, function (box) {
							return box.options.position === 'right';
						});
						var topBoxes = helpers.where(chartInstance.boxes, function (box) {
							return box.options.position === 'top';
						});
						var bottomBoxes = helpers.where(chartInstance.boxes, function (box) {
							return box.options.position === 'bottom';
						});

						// Boxes that overlay the chartarea such as the radialLinear scale
						var chartAreaBoxes = helpers.where(chartInstance.boxes, function (box) {
							return box.options.position === 'chartArea';
						});

						// Ensure that full width boxes are at the very top / bottom
						topBoxes.sort(function (a, b) {
							return (b.options.fullWidth ? 1 : 0) - (a.options.fullWidth ? 1 : 0);
						});
						bottomBoxes.sort(function (a, b) {
							return (a.options.fullWidth ? 1 : 0) - (b.options.fullWidth ? 1 : 0);
						});

						// Essentially we now have any number of boxes on each of the 4 sides.
						// Our canvas looks like the following.
						// The areas L1 and L2 are the left axes. R1 is the right axis, T1 is the top axis and
						// B1 is the bottom axis
						// There are also 4 quadrant-like locations (left to right instead of clockwise) reserved for chart overlays
						// These locations are single-box locations only, when trying to register a chartArea location that is already taken,
						// an error will be thrown.
						//
						// |----------------------------------------------------|
						// |                  T1 (Full Width)                   |
						// |----------------------------------------------------|
						// |    |    |                 T2                  |    |
						// |    |----|-------------------------------------|----|
						// |    |    | C1 |                           | C2 |    |
						// |    |    |----|                           |----|    |
						// |    |    |                                     |    |
						// | L1 | L2 |           ChartArea (C0)            | R1 |
						// |    |    |                                     |    |
						// |    |    |----|                           |----|    |
						// |    |    | C3 |                           | C4 |    |
						// |    |----|-------------------------------------|----|
						// |    |    |                 B1                  |    |
						// |----------------------------------------------------|
						// |                  B2 (Full Width)                   |
						// |----------------------------------------------------|
						//
						// What we do to find the best sizing, we do the following
						// 1. Determine the minimum size of the chart area.
						// 2. Split the remaining width equally between each vertical axis
						// 3. Split the remaining height equally between each horizontal axis
						// 4. Give each layout the maximum size it can be. The layout will return it's minimum size
						// 5. Adjust the sizes of each axis based on it's minimum reported size.
						// 6. Refit each axis
						// 7. Position each axis in the final location
						// 8. Tell the chart the final location of the chart area
						// 9. Tell any axes that overlay the chart area the positions of the chart area

						// Step 1
						var chartWidth = width - leftPadding - rightPadding;
						var chartHeight = height - topPadding - bottomPadding;
						var chartAreaWidth = chartWidth / 2; // min 50%
						var chartAreaHeight = chartHeight / 2; // min 50%

						// Step 2
						var verticalBoxWidth = (width - chartAreaWidth) / (leftBoxes.length + rightBoxes.length);

						// Step 3
						var horizontalBoxHeight = (height - chartAreaHeight) / (topBoxes.length + bottomBoxes.length);

						// Step 4
						var maxChartAreaWidth = chartWidth;
						var maxChartAreaHeight = chartHeight;
						var minBoxSizes = [];

						function getMinimumBoxSize(box) {
							var minSize;
							var isHorizontal = box.isHorizontal();

							if (isHorizontal) {
								minSize = box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, horizontalBoxHeight);
								maxChartAreaHeight -= minSize.height;
							} else {
								minSize = box.update(verticalBoxWidth, chartAreaHeight);
								maxChartAreaWidth -= minSize.width;
							}

							minBoxSizes.push({
								horizontal: isHorizontal,
								minSize: minSize,
								box: box
							});
						}

						helpers.each(leftBoxes.concat(rightBoxes, topBoxes, bottomBoxes), getMinimumBoxSize);

						// At this point, maxChartAreaHeight and maxChartAreaWidth are the size the chart area could
						// be if the axes are drawn at their minimum sizes.

						// Steps 5 & 6
						var totalLeftBoxesWidth = leftPadding;
						var totalRightBoxesWidth = rightPadding;
						var totalTopBoxesHeight = topPadding;
						var totalBottomBoxesHeight = bottomPadding;

						// Function to fit a box
						function fitBox(box) {
							var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minBox) {
								return minBox.box === box;
							});

							if (minBoxSize) {
								if (box.isHorizontal()) {
									var scaleMargin = {
										left: totalLeftBoxesWidth,
										right: totalRightBoxesWidth,
										top: 0,
										bottom: 0
									};

									// Don't use min size here because of label rotation. When the labels are rotated, their rotation highly depends
									// on the margin. Sometimes they need to increase in size slightly
									box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin);
								} else {
									box.update(minBoxSize.minSize.width, maxChartAreaHeight);
								}
							}
						}

						// Update, and calculate the left and right margins for the horizontal boxes
						helpers.each(leftBoxes.concat(rightBoxes), fitBox);

						helpers.each(leftBoxes, function (box) {
							totalLeftBoxesWidth += box.width;
						});

						helpers.each(rightBoxes, function (box) {
							totalRightBoxesWidth += box.width;
						});

						// Set the Left and Right margins for the horizontal boxes
						helpers.each(topBoxes.concat(bottomBoxes), fitBox);

						// Figure out how much margin is on the top and bottom of the vertical boxes
						helpers.each(topBoxes, function (box) {
							totalTopBoxesHeight += box.height;
						});

						helpers.each(bottomBoxes, function (box) {
							totalBottomBoxesHeight += box.height;
						});

						function finalFitVerticalBox(box) {
							var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minSize) {
								return minSize.box === box;
							});

							var scaleMargin = {
								left: 0,
								right: 0,
								top: totalTopBoxesHeight,
								bottom: totalBottomBoxesHeight
							};

							if (minBoxSize) {
								box.update(minBoxSize.minSize.width, maxChartAreaHeight, scaleMargin);
							}
						}

						// Let the left layout know the final margin
						helpers.each(leftBoxes.concat(rightBoxes), finalFitVerticalBox);

						// Recalculate because the size of each layout might have changed slightly due to the margins (label rotation for instance)
						totalLeftBoxesWidth = leftPadding;
						totalRightBoxesWidth = rightPadding;
						totalTopBoxesHeight = topPadding;
						totalBottomBoxesHeight = bottomPadding;

						helpers.each(leftBoxes, function (box) {
							totalLeftBoxesWidth += box.width;
						});

						helpers.each(rightBoxes, function (box) {
							totalRightBoxesWidth += box.width;
						});

						helpers.each(topBoxes, function (box) {
							totalTopBoxesHeight += box.height;
						});
						helpers.each(bottomBoxes, function (box) {
							totalBottomBoxesHeight += box.height;
						});

						// Figure out if our chart area changed. This would occur if the dataset layout label rotation
						// changed due to the application of the margins in step 6. Since we can only get bigger, this is safe to do
						// without calling `fit` again
						var newMaxChartAreaHeight = height - totalTopBoxesHeight - totalBottomBoxesHeight;
						var newMaxChartAreaWidth = width - totalLeftBoxesWidth - totalRightBoxesWidth;

						if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
							helpers.each(leftBoxes, function (box) {
								box.height = newMaxChartAreaHeight;
							});

							helpers.each(rightBoxes, function (box) {
								box.height = newMaxChartAreaHeight;
							});

							helpers.each(topBoxes, function (box) {
								if (!box.options.fullWidth) {
									box.width = newMaxChartAreaWidth;
								}
							});

							helpers.each(bottomBoxes, function (box) {
								if (!box.options.fullWidth) {
									box.width = newMaxChartAreaWidth;
								}
							});

							maxChartAreaHeight = newMaxChartAreaHeight;
							maxChartAreaWidth = newMaxChartAreaWidth;
						}

						// Step 7 - Position the boxes
						var left = leftPadding;
						var top = topPadding;

						function placeBox(box) {
							if (box.isHorizontal()) {
								box.left = box.options.fullWidth ? leftPadding : totalLeftBoxesWidth;
								box.right = box.options.fullWidth ? width - rightPadding : totalLeftBoxesWidth + maxChartAreaWidth;
								box.top = top;
								box.bottom = top + box.height;

								// Move to next point
								top = box.bottom;
							} else {

								box.left = left;
								box.right = left + box.width;
								box.top = totalTopBoxesHeight;
								box.bottom = totalTopBoxesHeight + maxChartAreaHeight;

								// Move to next point
								left = box.right;
							}
						}

						helpers.each(leftBoxes.concat(topBoxes), placeBox);

						// Account for chart width and height
						left += maxChartAreaWidth;
						top += maxChartAreaHeight;

						helpers.each(rightBoxes, placeBox);
						helpers.each(bottomBoxes, placeBox);

						// Step 8
						chartInstance.chartArea = {
							left: totalLeftBoxesWidth,
							top: totalTopBoxesHeight,
							right: totalLeftBoxesWidth + maxChartAreaWidth,
							bottom: totalTopBoxesHeight + maxChartAreaHeight
						};

						// Step 9
						helpers.each(chartAreaBoxes, function (box) {
							box.left = chartInstance.chartArea.left;
							box.top = chartInstance.chartArea.top;
							box.right = chartInstance.chartArea.right;
							box.bottom = chartInstance.chartArea.bottom;

							box.update(maxChartAreaWidth, maxChartAreaHeight);
						});
					}
				};
			};
		}, {}], 30: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;
				var noop = helpers.noop;

				Chart.defaults.global.legend = {

					display: true,
					position: 'top',
					fullWidth: true, // marks that this box should take the full width of the canvas (pushing down other boxes)
					reverse: false,

					// a callback that will handle
					onClick: function onClick(e, legendItem) {
						var index = legendItem.datasetIndex;
						var ci = this.chart;
						var meta = ci.getDatasetMeta(index);

						// See controller.isDatasetVisible comment
						meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

						// We hid a dataset ... rerender the chart
						ci.update();
					},

					onHover: null,

					labels: {
						boxWidth: 40,
						padding: 10,
						// Generates labels shown in the legend
						// Valid properties to return:
						// text : text to display
						// fillStyle : fill of coloured box
						// strokeStyle: stroke of coloured box
						// hidden : if this legend item refers to a hidden item
						// lineCap : cap style for line
						// lineDash
						// lineDashOffset :
						// lineJoin :
						// lineWidth :
						generateLabels: function generateLabels(chart) {
							var data = chart.data;
							return helpers.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
								return {
									text: dataset.label,
									fillStyle: !helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0],
									hidden: !chart.isDatasetVisible(i),
									lineCap: dataset.borderCapStyle,
									lineDash: dataset.borderDash,
									lineDashOffset: dataset.borderDashOffset,
									lineJoin: dataset.borderJoinStyle,
									lineWidth: dataset.borderWidth,
									strokeStyle: dataset.borderColor,
									pointStyle: dataset.pointStyle,

									// Below is extra data used for toggling the datasets
									datasetIndex: i
								};
							}, this) : [];
						}
					}
				};

				/**
     * Helper function to get the box width based on the usePointStyle option
     * @param labelopts {Object} the label options on the legend
     * @param fontSize {Number} the label font size
     * @return {Number} width of the color box area
     */
				function getBoxWidth(labelOpts, fontSize) {
					return labelOpts.usePointStyle ? fontSize * Math.SQRT2 : labelOpts.boxWidth;
				}

				Chart.Legend = Chart.Element.extend({

					initialize: function initialize(config) {
						helpers.extend(this, config);

						// Contains hit boxes for each dataset (in dataset order)
						this.legendHitBoxes = [];

						// Are we in doughnut mode which has a different data type
						this.doughnutMode = false;
					},

					// These methods are ordered by lifecycle. Utilities then follow.
					// Any function defined here is inherited by all legend types.
					// Any function can be extended by the legend type

					beforeUpdate: noop,
					update: function update(maxWidth, maxHeight, margins) {
						var me = this;

						// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
						me.beforeUpdate();

						// Absorb the master measurements
						me.maxWidth = maxWidth;
						me.maxHeight = maxHeight;
						me.margins = margins;

						// Dimensions
						me.beforeSetDimensions();
						me.setDimensions();
						me.afterSetDimensions();
						// Labels
						me.beforeBuildLabels();
						me.buildLabels();
						me.afterBuildLabels();

						// Fit
						me.beforeFit();
						me.fit();
						me.afterFit();
						//
						me.afterUpdate();

						return me.minSize;
					},
					afterUpdate: noop,

					//

					beforeSetDimensions: noop,
					setDimensions: function setDimensions() {
						var me = this;
						// Set the unconstrained dimension before label rotation
						if (me.isHorizontal()) {
							// Reset position before calculating rotation
							me.width = me.maxWidth;
							me.left = 0;
							me.right = me.width;
						} else {
							me.height = me.maxHeight;

							// Reset position before calculating rotation
							me.top = 0;
							me.bottom = me.height;
						}

						// Reset padding
						me.paddingLeft = 0;
						me.paddingTop = 0;
						me.paddingRight = 0;
						me.paddingBottom = 0;

						// Reset minSize
						me.minSize = {
							width: 0,
							height: 0
						};
					},
					afterSetDimensions: noop,

					//

					beforeBuildLabels: noop,
					buildLabels: function buildLabels() {
						var me = this;
						me.legendItems = me.options.labels.generateLabels.call(me, me.chart);
						if (me.options.reverse) {
							me.legendItems.reverse();
						}
					},
					afterBuildLabels: noop,

					//

					beforeFit: noop,
					fit: function fit() {
						var me = this;
						var opts = me.options;
						var labelOpts = opts.labels;
						var display = opts.display;

						var ctx = me.ctx;

						var globalDefault = Chart.defaults.global,
						    itemOrDefault = helpers.getValueOrDefault,
						    fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize),
						    fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle),
						    fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily),
						    labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

						// Reset hit boxes
						var hitboxes = me.legendHitBoxes = [];

						var minSize = me.minSize;
						var isHorizontal = me.isHorizontal();

						if (isHorizontal) {
							minSize.width = me.maxWidth; // fill all the width
							minSize.height = display ? 10 : 0;
						} else {
							minSize.width = display ? 10 : 0;
							minSize.height = me.maxHeight; // fill all the height
						}

						// Increase sizes here
						if (display) {
							ctx.font = labelFont;

							if (isHorizontal) {
								// Labels

								// Width of each line of legend boxes. Labels wrap onto multiple lines when there are too many to fit on one
								var lineWidths = me.lineWidths = [0];
								var totalHeight = me.legendItems.length ? fontSize + labelOpts.padding : 0;

								ctx.textAlign = 'left';
								ctx.textBaseline = 'top';

								helpers.each(me.legendItems, function (legendItem, i) {
									var boxWidth = getBoxWidth(labelOpts, fontSize);
									var width = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;

									if (lineWidths[lineWidths.length - 1] + width + labelOpts.padding >= me.width) {
										totalHeight += fontSize + labelOpts.padding;
										lineWidths[lineWidths.length] = me.left;
									}

									// Store the hitbox width and height here. Final position will be updated in `draw`
									hitboxes[i] = {
										left: 0,
										top: 0,
										width: width,
										height: fontSize
									};

									lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
								});

								minSize.height += totalHeight;
							} else {
								var vPadding = labelOpts.padding;
								var columnWidths = me.columnWidths = [];
								var totalWidth = labelOpts.padding;
								var currentColWidth = 0;
								var currentColHeight = 0;
								var itemHeight = fontSize + vPadding;

								helpers.each(me.legendItems, function (legendItem, i) {
									var boxWidth = getBoxWidth(labelOpts, fontSize);
									var itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;

									// If too tall, go to new column
									if (currentColHeight + itemHeight > minSize.height) {
										totalWidth += currentColWidth + labelOpts.padding;
										columnWidths.push(currentColWidth); // previous column width

										currentColWidth = 0;
										currentColHeight = 0;
									}

									// Get max width
									currentColWidth = Math.max(currentColWidth, itemWidth);
									currentColHeight += itemHeight;

									// Store the hitbox width and height here. Final position will be updated in `draw`
									hitboxes[i] = {
										left: 0,
										top: 0,
										width: itemWidth,
										height: fontSize
									};
								});

								totalWidth += currentColWidth;
								columnWidths.push(currentColWidth);
								minSize.width += totalWidth;
							}
						}

						me.width = minSize.width;
						me.height = minSize.height;
					},
					afterFit: noop,

					// Shared Methods
					isHorizontal: function isHorizontal() {
						return this.options.position === 'top' || this.options.position === 'bottom';
					},

					// Actually draw the legend on the canvas
					draw: function draw() {
						var me = this;
						var opts = me.options;
						var labelOpts = opts.labels;
						var globalDefault = Chart.defaults.global,
						    lineDefault = globalDefault.elements.line,
						    legendWidth = me.width,
						    lineWidths = me.lineWidths;

						if (opts.display) {
							var ctx = me.ctx,
							    cursor,
							    itemOrDefault = helpers.getValueOrDefault,
							    fontColor = itemOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor),
							    fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize),
							    fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle),
							    fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily),
							    labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

							// Canvas setup
							ctx.textAlign = 'left';
							ctx.textBaseline = 'top';
							ctx.lineWidth = 0.5;
							ctx.strokeStyle = fontColor; // for strikethrough effect
							ctx.fillStyle = fontColor; // render in correct colour
							ctx.font = labelFont;

							var boxWidth = getBoxWidth(labelOpts, fontSize),
							    hitboxes = me.legendHitBoxes;

							// current position
							var drawLegendBox = function drawLegendBox(x, y, legendItem) {
								if (isNaN(boxWidth) || boxWidth <= 0) {
									return;
								}

								// Set the ctx for the box
								ctx.save();

								ctx.fillStyle = itemOrDefault(legendItem.fillStyle, globalDefault.defaultColor);
								ctx.lineCap = itemOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
								ctx.lineDashOffset = itemOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
								ctx.lineJoin = itemOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
								ctx.lineWidth = itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
								ctx.strokeStyle = itemOrDefault(legendItem.strokeStyle, globalDefault.defaultColor);
								var isLineWidthZero = itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth) === 0;

								if (ctx.setLineDash) {
									// IE 9 and 10 do not support line dash
									ctx.setLineDash(itemOrDefault(legendItem.lineDash, lineDefault.borderDash));
								}

								if (opts.labels && opts.labels.usePointStyle) {
									// Recalculate x and y for drawPoint() because its expecting
									// x and y to be center of figure (instead of top left)
									var radius = fontSize * Math.SQRT2 / 2;
									var offSet = radius / Math.SQRT2;
									var centerX = x + offSet;
									var centerY = y + offSet;

									// Draw pointStyle as legend symbol
									Chart.canvasHelpers.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
								} else {
									// Draw box as legend symbol
									if (!isLineWidthZero) {
										ctx.strokeRect(x, y, boxWidth, fontSize);
									}
									ctx.fillRect(x, y, boxWidth, fontSize);
								}

								ctx.restore();
							};
							var fillText = function fillText(x, y, legendItem, textWidth) {
								ctx.fillText(legendItem.text, boxWidth + fontSize / 2 + x, y);

								if (legendItem.hidden) {
									// Strikethrough the text if hidden
									ctx.beginPath();
									ctx.lineWidth = 2;
									ctx.moveTo(boxWidth + fontSize / 2 + x, y + fontSize / 2);
									ctx.lineTo(boxWidth + fontSize / 2 + x + textWidth, y + fontSize / 2);
									ctx.stroke();
								}
							};

							// Horizontal
							var isHorizontal = me.isHorizontal();
							if (isHorizontal) {
								cursor = {
									x: me.left + (legendWidth - lineWidths[0]) / 2,
									y: me.top + labelOpts.padding,
									line: 0
								};
							} else {
								cursor = {
									x: me.left + labelOpts.padding,
									y: me.top + labelOpts.padding,
									line: 0
								};
							}

							var itemHeight = fontSize + labelOpts.padding;
							helpers.each(me.legendItems, function (legendItem, i) {
								var textWidth = ctx.measureText(legendItem.text).width,
								    width = boxWidth + fontSize / 2 + textWidth,
								    x = cursor.x,
								    y = cursor.y;

								if (isHorizontal) {
									if (x + width >= legendWidth) {
										y = cursor.y += itemHeight;
										cursor.line++;
										x = cursor.x = me.left + (legendWidth - lineWidths[cursor.line]) / 2;
									}
								} else if (y + itemHeight > me.bottom) {
									x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
									y = cursor.y = me.top;
									cursor.line++;
								}

								drawLegendBox(x, y, legendItem);

								hitboxes[i].left = x;
								hitboxes[i].top = y;

								// Fill the actual label
								fillText(x, y, legendItem, textWidth);

								if (isHorizontal) {
									cursor.x += width + labelOpts.padding;
								} else {
									cursor.y += itemHeight;
								}
							});
						}
					},

					/**
      * Handle an event
      * @private
      * @param e {Event} the event to handle
      * @return {Boolean} true if a change occured
      */
					handleEvent: function handleEvent(e) {
						var me = this;
						var opts = me.options;
						var type = e.type === 'mouseup' ? 'click' : e.type;
						var changed = false;

						if (type === 'mousemove') {
							if (!opts.onHover) {
								return;
							}
						} else if (type === 'click') {
							if (!opts.onClick) {
								return;
							}
						} else {
							return;
						}

						var position = helpers.getRelativePosition(e, me.chart.chart),
						    x = position.x,
						    y = position.y;

						if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
							// See if we are touching one of the dataset boxes
							var lh = me.legendHitBoxes;
							for (var i = 0; i < lh.length; ++i) {
								var hitBox = lh[i];

								if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
									// Touching an element
									if (type === 'click') {
										opts.onClick.call(me, e, me.legendItems[i]);
										changed = true;
										break;
									} else if (type === 'mousemove') {
										opts.onHover.call(me, e, me.legendItems[i]);
										changed = true;
										break;
									}
								}
							}
						}

						return changed;
					}
				});

				// Register the legend plugin
				Chart.plugins.register({
					beforeInit: function beforeInit(chartInstance) {
						var opts = chartInstance.options;
						var legendOpts = opts.legend;

						if (legendOpts) {
							chartInstance.legend = new Chart.Legend({
								ctx: chartInstance.chart.ctx,
								options: legendOpts,
								chart: chartInstance
							});

							Chart.layoutService.addBox(chartInstance, chartInstance.legend);
						}
					}
				});
			};
		}, {}], 31: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var noop = Chart.helpers.noop;

				/**
     * The plugin service singleton
     * @namespace Chart.plugins
     * @since 2.1.0
     */
				Chart.plugins = {
					_plugins: [],

					/**
      * Registers the given plugin(s) if not already registered.
      * @param {Array|Object} plugins plugin instance(s).
      */
					register: function register(plugins) {
						var p = this._plugins;
						[].concat(plugins).forEach(function (plugin) {
							if (p.indexOf(plugin) === -1) {
								p.push(plugin);
							}
						});
					},

					/**
      * Unregisters the given plugin(s) only if registered.
      * @param {Array|Object} plugins plugin instance(s).
      */
					unregister: function unregister(plugins) {
						var p = this._plugins;
						[].concat(plugins).forEach(function (plugin) {
							var idx = p.indexOf(plugin);
							if (idx !== -1) {
								p.splice(idx, 1);
							}
						});
					},

					/**
      * Remove all registered plugins.
      * @since 2.1.5
      */
					clear: function clear() {
						this._plugins = [];
					},

					/**
      * Returns the number of registered plugins?
      * @returns {Number}
      * @since 2.1.5
      */
					count: function count() {
						return this._plugins.length;
					},

					/**
      * Returns all registered plugin instances.
      * @returns {Array} array of plugin objects.
      * @since 2.1.5
      */
					getAll: function getAll() {
						return this._plugins;
					},

					/**
      * Calls registered plugins on the specified extension, with the given args. This
      * method immediately returns as soon as a plugin explicitly returns false. The
      * returned value can be used, for instance, to interrupt the current action.
      * @param {String} extension the name of the plugin method to call (e.g. 'beforeUpdate').
      * @param {Array} [args] extra arguments to apply to the extension call.
      * @returns {Boolean} false if any of the plugins return false, else returns true.
      */
					notify: function notify(extension, args) {
						var plugins = this._plugins;
						var ilen = plugins.length;
						var i, plugin;

						for (i = 0; i < ilen; ++i) {
							plugin = plugins[i];
							if (typeof plugin[extension] === 'function') {
								if (plugin[extension].apply(plugin, args || []) === false) {
									return false;
								}
							}
						}

						return true;
					}
				};

				/**
     * Plugin extension methods.
     * @interface Chart.PluginBase
     * @since 2.1.0
     */
				Chart.PluginBase = Chart.Element.extend({
					// Called at start of chart init
					beforeInit: noop,

					// Called at end of chart init
					afterInit: noop,

					// Called at start of update
					beforeUpdate: noop,

					// Called at end of update
					afterUpdate: noop,

					// Called at start of draw
					beforeDraw: noop,

					// Called at end of draw
					afterDraw: noop,

					// Called during destroy
					destroy: noop
				});

				/**
     * Provided for backward compatibility, use Chart.plugins instead
     * @namespace Chart.pluginService
     * @deprecated since version 2.1.5
     * @todo remove me at version 3
     */
				Chart.pluginService = Chart.plugins;
			};
		}, {}], 32: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.scale = {
					display: true,
					position: 'left',

					// grid line settings
					gridLines: {
						display: true,
						color: 'rgba(0, 0, 0, 0.1)',
						lineWidth: 1,
						drawBorder: true,
						drawOnChartArea: true,
						drawTicks: true,
						tickMarkLength: 10,
						zeroLineWidth: 1,
						zeroLineColor: 'rgba(0,0,0,0.25)',
						offsetGridLines: false,
						borderDash: [],
						borderDashOffset: 0.0
					},

					// scale label
					scaleLabel: {
						// actual label
						labelString: '',

						// display property
						display: false
					},

					// label settings
					ticks: {
						beginAtZero: false,
						minRotation: 0,
						maxRotation: 50,
						mirror: false,
						padding: 10,
						reverse: false,
						display: true,
						autoSkip: true,
						autoSkipPadding: 0,
						labelOffset: 0,
						// We pass through arrays to be rendered as multiline labels, we convert Others to strings here.
						callback: Chart.Ticks.formatters.values
					}
				};

				Chart.Scale = Chart.Element.extend({

					// These methods are ordered by lifecycle. Utilities then follow.
					// Any function defined here is inherited by all scale types.
					// Any function can be extended by the scale type

					beforeUpdate: function beforeUpdate() {
						helpers.callCallback(this.options.beforeUpdate, [this]);
					},
					update: function update(maxWidth, maxHeight, margins) {
						var me = this;

						// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
						me.beforeUpdate();

						// Absorb the master measurements
						me.maxWidth = maxWidth;
						me.maxHeight = maxHeight;
						me.margins = helpers.extend({
							left: 0,
							right: 0,
							top: 0,
							bottom: 0
						}, margins);

						// Dimensions
						me.beforeSetDimensions();
						me.setDimensions();
						me.afterSetDimensions();

						// Data min/max
						me.beforeDataLimits();
						me.determineDataLimits();
						me.afterDataLimits();

						// Ticks
						me.beforeBuildTicks();
						me.buildTicks();
						me.afterBuildTicks();

						me.beforeTickToLabelConversion();
						me.convertTicksToLabels();
						me.afterTickToLabelConversion();

						// Tick Rotation
						me.beforeCalculateTickRotation();
						me.calculateTickRotation();
						me.afterCalculateTickRotation();
						// Fit
						me.beforeFit();
						me.fit();
						me.afterFit();
						//
						me.afterUpdate();

						return me.minSize;
					},
					afterUpdate: function afterUpdate() {
						helpers.callCallback(this.options.afterUpdate, [this]);
					},

					//

					beforeSetDimensions: function beforeSetDimensions() {
						helpers.callCallback(this.options.beforeSetDimensions, [this]);
					},
					setDimensions: function setDimensions() {
						var me = this;
						// Set the unconstrained dimension before label rotation
						if (me.isHorizontal()) {
							// Reset position before calculating rotation
							me.width = me.maxWidth;
							me.left = 0;
							me.right = me.width;
						} else {
							me.height = me.maxHeight;

							// Reset position before calculating rotation
							me.top = 0;
							me.bottom = me.height;
						}

						// Reset padding
						me.paddingLeft = 0;
						me.paddingTop = 0;
						me.paddingRight = 0;
						me.paddingBottom = 0;
					},
					afterSetDimensions: function afterSetDimensions() {
						helpers.callCallback(this.options.afterSetDimensions, [this]);
					},

					// Data limits
					beforeDataLimits: function beforeDataLimits() {
						helpers.callCallback(this.options.beforeDataLimits, [this]);
					},
					determineDataLimits: helpers.noop,
					afterDataLimits: function afterDataLimits() {
						helpers.callCallback(this.options.afterDataLimits, [this]);
					},

					//
					beforeBuildTicks: function beforeBuildTicks() {
						helpers.callCallback(this.options.beforeBuildTicks, [this]);
					},
					buildTicks: helpers.noop,
					afterBuildTicks: function afterBuildTicks() {
						helpers.callCallback(this.options.afterBuildTicks, [this]);
					},

					beforeTickToLabelConversion: function beforeTickToLabelConversion() {
						helpers.callCallback(this.options.beforeTickToLabelConversion, [this]);
					},
					convertTicksToLabels: function convertTicksToLabels() {
						var me = this;
						// Convert ticks to strings
						var tickOpts = me.options.ticks;
						me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback);
					},
					afterTickToLabelConversion: function afterTickToLabelConversion() {
						helpers.callCallback(this.options.afterTickToLabelConversion, [this]);
					},

					//

					beforeCalculateTickRotation: function beforeCalculateTickRotation() {
						helpers.callCallback(this.options.beforeCalculateTickRotation, [this]);
					},
					calculateTickRotation: function calculateTickRotation() {
						var me = this;
						var context = me.ctx;
						var globalDefaults = Chart.defaults.global;
						var optionTicks = me.options.ticks;

						// Get the width of each grid by calculating the difference
						// between x offsets between 0 and 1.
						var tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
						var tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
						var tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
						var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
						context.font = tickLabelFont;

						var firstWidth = context.measureText(me.ticks[0]).width;
						var lastWidth = context.measureText(me.ticks[me.ticks.length - 1]).width;
						var firstRotated;

						me.labelRotation = optionTicks.minRotation || 0;
						me.paddingRight = 0;
						me.paddingLeft = 0;

						if (me.options.display) {
							if (me.isHorizontal()) {
								me.paddingRight = lastWidth / 2 + 3;
								me.paddingLeft = firstWidth / 2 + 3;

								if (!me.longestTextCache) {
									me.longestTextCache = {};
								}
								var originalLabelWidth = helpers.longestText(context, tickLabelFont, me.ticks, me.longestTextCache);
								var labelWidth = originalLabelWidth;
								var cosRotation;
								var sinRotation;

								// Allow 3 pixels x2 padding either side for label readability
								// only the index matters for a dataset scale, but we want a consistent interface between scales
								var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;

								// Max label rotation can be set or default to 90 - also act as a loop counter
								while (labelWidth > tickWidth && me.labelRotation < optionTicks.maxRotation) {
									cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
									sinRotation = Math.sin(helpers.toRadians(me.labelRotation));

									firstRotated = cosRotation * firstWidth;

									// We're right aligning the text now.
									if (firstRotated + tickFontSize / 2 > me.yLabelWidth) {
										me.paddingLeft = firstRotated + tickFontSize / 2;
									}

									me.paddingRight = tickFontSize / 2;

									if (sinRotation * originalLabelWidth > me.maxHeight) {
										// go back one step
										me.labelRotation--;
										break;
									}

									me.labelRotation++;
									labelWidth = cosRotation * originalLabelWidth;
								}
							}
						}

						if (me.margins) {
							me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
							me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
						}
					},
					afterCalculateTickRotation: function afterCalculateTickRotation() {
						helpers.callCallback(this.options.afterCalculateTickRotation, [this]);
					},

					//

					beforeFit: function beforeFit() {
						helpers.callCallback(this.options.beforeFit, [this]);
					},
					fit: function fit() {
						var me = this;
						// Reset
						var minSize = me.minSize = {
							width: 0,
							height: 0
						};

						var opts = me.options;
						var globalDefaults = Chart.defaults.global;
						var tickOpts = opts.ticks;
						var scaleLabelOpts = opts.scaleLabel;
						var gridLineOpts = opts.gridLines;
						var display = opts.display;
						var isHorizontal = me.isHorizontal();

						var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
						var tickFontStyle = helpers.getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
						var tickFontFamily = helpers.getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
						var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

						var scaleLabelFontSize = helpers.getValueOrDefault(scaleLabelOpts.fontSize, globalDefaults.defaultFontSize);

						var tickMarkLength = opts.gridLines.tickMarkLength;

						// Width
						if (isHorizontal) {
							// subtract the margins to line up with the chartArea if we are a full width scale
							minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
						} else {
							minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
						}

						// height
						if (isHorizontal) {
							minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
						} else {
							minSize.height = me.maxHeight; // fill all the height
						}

						// Are we showing a title for the scale?
						if (scaleLabelOpts.display && display) {
							if (isHorizontal) {
								minSize.height += scaleLabelFontSize * 1.5;
							} else {
								minSize.width += scaleLabelFontSize * 1.5;
							}
						}

						if (tickOpts.display && display) {
							// Don't bother fitting the ticks if we are not showing them
							if (!me.longestTextCache) {
								me.longestTextCache = {};
							}

							var largestTextWidth = helpers.longestText(me.ctx, tickLabelFont, me.ticks, me.longestTextCache);
							var tallestLabelHeightInLines = helpers.numberOfLabelLines(me.ticks);
							var lineSpace = tickFontSize * 0.5;

							if (isHorizontal) {
								// A horizontal axis is more constrained by the height.
								me.longestLabelWidth = largestTextWidth;

								// TODO - improve this calculation
								var labelHeight = Math.sin(helpers.toRadians(me.labelRotation)) * me.longestLabelWidth + tickFontSize * tallestLabelHeightInLines + lineSpace * tallestLabelHeightInLines;

								minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight);
								me.ctx.font = tickLabelFont;

								var firstLabelWidth = me.ctx.measureText(me.ticks[0]).width;
								var lastLabelWidth = me.ctx.measureText(me.ticks[me.ticks.length - 1]).width;

								// Ensure that our ticks are always inside the canvas. When rotated, ticks are right aligned which means that the right padding is dominated
								// by the font height
								var cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
								var sinRotation = Math.sin(helpers.toRadians(me.labelRotation));
								me.paddingLeft = me.labelRotation !== 0 ? cosRotation * firstLabelWidth + 3 : firstLabelWidth / 2 + 3; // add 3 px to move away from canvas edges
								me.paddingRight = me.labelRotation !== 0 ? sinRotation * (tickFontSize / 2) + 3 : lastLabelWidth / 2 + 3; // when rotated
							} else {
								// A vertical axis is more constrained by the width. Labels are the dominant factor here, so get that length first
								var maxLabelWidth = me.maxWidth - minSize.width;

								// Account for padding
								var mirror = tickOpts.mirror;
								if (!mirror) {
									largestTextWidth += me.options.ticks.padding;
								} else {
									// If mirrored text is on the inside so don't expand
									largestTextWidth = 0;
								}

								if (largestTextWidth < maxLabelWidth) {
									// We don't need all the room
									minSize.width += largestTextWidth;
								} else {
									// Expand to max size
									minSize.width = me.maxWidth;
								}

								me.paddingTop = tickFontSize / 2;
								me.paddingBottom = tickFontSize / 2;
							}
						}

						if (me.margins) {
							me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
							me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
							me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
							me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
						}

						me.width = minSize.width;
						me.height = minSize.height;
					},
					afterFit: function afterFit() {
						helpers.callCallback(this.options.afterFit, [this]);
					},

					// Shared Methods
					isHorizontal: function isHorizontal() {
						return this.options.position === 'top' || this.options.position === 'bottom';
					},
					isFullWidth: function isFullWidth() {
						return this.options.fullWidth;
					},

					// Get the correct value. NaN bad inputs, If the value type is object get the x or y based on whether we are horizontal or not
					getRightValue: function getRightValue(rawValue) {
						// Null and undefined values first
						if (rawValue === null || typeof rawValue === 'undefined') {
							return NaN;
						}
						// isNaN(object) returns true, so make sure NaN is checking for a number; Discard Infinite values
						if (typeof rawValue === 'number' && !isFinite(rawValue)) {
							return NaN;
						}
						// If it is in fact an object, dive in one more level
						if ((typeof rawValue === 'undefined' ? 'undefined' : _typeof(rawValue)) === 'object') {
							if (rawValue instanceof Date || rawValue.isValid) {
								return rawValue;
							}
							return this.getRightValue(this.isHorizontal() ? rawValue.x : rawValue.y);
						}

						// Value is good, return it
						return rawValue;
					},

					// Used to get the value to display in the tooltip for the data at the given index
					// function getLabelForIndex(index, datasetIndex)
					getLabelForIndex: helpers.noop,

					// Used to get data value locations.  Value can either be an index or a numerical value
					getPixelForValue: helpers.noop,

					// Used to get the data value from a given pixel. This is the inverse of getPixelForValue
					getValueForPixel: helpers.noop,

					// Used for tick location, should
					getPixelForTick: function getPixelForTick(index, includeOffset) {
						var me = this;
						if (me.isHorizontal()) {
							var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
							var tickWidth = innerWidth / Math.max(me.ticks.length - (me.options.gridLines.offsetGridLines ? 0 : 1), 1);
							var pixel = tickWidth * index + me.paddingLeft;

							if (includeOffset) {
								pixel += tickWidth / 2;
							}

							var finalVal = me.left + Math.round(pixel);
							finalVal += me.isFullWidth() ? me.margins.left : 0;
							return finalVal;
						}
						var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
						return me.top + index * (innerHeight / (me.ticks.length - 1));
					},

					// Utility for getting the pixel location of a percentage of scale
					getPixelForDecimal: function getPixelForDecimal(decimal /* , includeOffset*/) {
						var me = this;
						if (me.isHorizontal()) {
							var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
							var valueOffset = innerWidth * decimal + me.paddingLeft;

							var finalVal = me.left + Math.round(valueOffset);
							finalVal += me.isFullWidth() ? me.margins.left : 0;
							return finalVal;
						}
						return me.top + decimal * me.height;
					},

					getBasePixel: function getBasePixel() {
						var me = this;
						var min = me.min;
						var max = me.max;

						return me.getPixelForValue(me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0);
					},

					// Actually draw the scale on the canvas
					// @param {rectangle} chartArea : the area of the chart to draw full grid lines on
					draw: function draw(chartArea) {
						var me = this;
						var options = me.options;
						if (!options.display) {
							return;
						}

						var context = me.ctx;
						var globalDefaults = Chart.defaults.global;
						var optionTicks = options.ticks;
						var gridLines = options.gridLines;
						var scaleLabel = options.scaleLabel;

						var isRotated = me.labelRotation !== 0;
						var skipRatio;
						var useAutoskipper = optionTicks.autoSkip;
						var isHorizontal = me.isHorizontal();

						// figure out the maximum number of gridlines to show
						var maxTicks;
						if (optionTicks.maxTicksLimit) {
							maxTicks = optionTicks.maxTicksLimit;
						}

						var tickFontColor = helpers.getValueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
						var tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
						var tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
						var tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
						var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
						var tl = gridLines.tickMarkLength;
						var borderDash = helpers.getValueOrDefault(gridLines.borderDash, globalDefaults.borderDash);
						var borderDashOffset = helpers.getValueOrDefault(gridLines.borderDashOffset, globalDefaults.borderDashOffset);

						var scaleLabelFontColor = helpers.getValueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
						var scaleLabelFontSize = helpers.getValueOrDefault(scaleLabel.fontSize, globalDefaults.defaultFontSize);
						var scaleLabelFontStyle = helpers.getValueOrDefault(scaleLabel.fontStyle, globalDefaults.defaultFontStyle);
						var scaleLabelFontFamily = helpers.getValueOrDefault(scaleLabel.fontFamily, globalDefaults.defaultFontFamily);
						var scaleLabelFont = helpers.fontString(scaleLabelFontSize, scaleLabelFontStyle, scaleLabelFontFamily);

						var labelRotationRadians = helpers.toRadians(me.labelRotation);
						var cosRotation = Math.cos(labelRotationRadians);
						var longestRotatedLabel = me.longestLabelWidth * cosRotation;

						// Make sure we draw text in the correct color and font
						context.fillStyle = tickFontColor;

						var itemsToDraw = [];

						if (isHorizontal) {
							skipRatio = false;

							// Only calculate the skip ratio with the half width of longestRotateLabel if we got an actual rotation
							// See #2584
							if (isRotated) {
								longestRotatedLabel /= 2;
							}

							if ((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length > me.width - (me.paddingLeft + me.paddingRight)) {
								skipRatio = 1 + Math.floor((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length / (me.width - (me.paddingLeft + me.paddingRight)));
							}

							// if they defined a max number of optionTicks,
							// increase skipRatio until that number is met
							if (maxTicks && me.ticks.length > maxTicks) {
								while (!skipRatio || me.ticks.length / (skipRatio || 1) > maxTicks) {
									if (!skipRatio) {
										skipRatio = 1;
									}
									skipRatio += 1;
								}
							}

							if (!useAutoskipper) {
								skipRatio = false;
							}
						}

						var xTickStart = options.position === 'right' ? me.left : me.right - tl;
						var xTickEnd = options.position === 'right' ? me.left + tl : me.right;
						var yTickStart = options.position === 'bottom' ? me.top : me.bottom - tl;
						var yTickEnd = options.position === 'bottom' ? me.top + tl : me.bottom;

						helpers.each(me.ticks, function (label, index) {
							// If the callback returned a null or undefined value, do not draw this line
							if (label === undefined || label === null) {
								return;
							}

							var isLastTick = me.ticks.length === index + 1;

							// Since we always show the last tick,we need may need to hide the last shown one before
							var shouldSkip = skipRatio > 1 && index % skipRatio > 0 || index % skipRatio === 0 && index + skipRatio >= me.ticks.length;
							if (shouldSkip && !isLastTick || label === undefined || label === null) {
								return;
							}

							var lineWidth, lineColor;
							if (index === (typeof me.zeroLineIndex !== 'undefined' ? me.zeroLineIndex : 0)) {
								// Draw the first index specially
								lineWidth = gridLines.zeroLineWidth;
								lineColor = gridLines.zeroLineColor;
							} else {
								lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, index);
								lineColor = helpers.getValueAtIndexOrDefault(gridLines.color, index);
							}

							// Common properties
							var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
							var textAlign = 'middle';
							var textBaseline = 'middle';

							if (isHorizontal) {
								if (!isRotated) {
									textBaseline = options.position === 'top' ? 'bottom' : 'top';
								}

								textAlign = isRotated ? 'right' : 'center';

								var xLineValue = me.getPixelForTick(index) + helpers.aliasPixel(lineWidth); // xvalues for grid lines
								labelX = me.getPixelForTick(index, gridLines.offsetGridLines) + optionTicks.labelOffset; // x values for optionTicks (need to consider offsetLabel option)
								labelY = isRotated ? me.top + 12 : options.position === 'top' ? me.bottom - tl : me.top + tl;

								tx1 = tx2 = x1 = x2 = xLineValue;
								ty1 = yTickStart;
								ty2 = yTickEnd;
								y1 = chartArea.top;
								y2 = chartArea.bottom;
							} else {
								if (options.position === 'left') {
									if (optionTicks.mirror) {
										labelX = me.right + optionTicks.padding;
										textAlign = 'left';
									} else {
										labelX = me.right - optionTicks.padding;
										textAlign = 'right';
									}
									// right side
								} else if (optionTicks.mirror) {
									labelX = me.left - optionTicks.padding;
									textAlign = 'right';
								} else {
									labelX = me.left + optionTicks.padding;
									textAlign = 'left';
								}

								var yLineValue = me.getPixelForTick(index); // xvalues for grid lines
								yLineValue += helpers.aliasPixel(lineWidth);
								labelY = me.getPixelForTick(index, gridLines.offsetGridLines);

								tx1 = xTickStart;
								tx2 = xTickEnd;
								x1 = chartArea.left;
								x2 = chartArea.right;
								ty1 = ty2 = y1 = y2 = yLineValue;
							}

							itemsToDraw.push({
								tx1: tx1,
								ty1: ty1,
								tx2: tx2,
								ty2: ty2,
								x1: x1,
								y1: y1,
								x2: x2,
								y2: y2,
								labelX: labelX,
								labelY: labelY,
								glWidth: lineWidth,
								glColor: lineColor,
								glBorderDash: borderDash,
								glBorderDashOffset: borderDashOffset,
								rotation: -1 * labelRotationRadians,
								label: label,
								textBaseline: textBaseline,
								textAlign: textAlign
							});
						});

						// Draw all of the tick labels, tick marks, and grid lines at the correct places
						helpers.each(itemsToDraw, function (itemToDraw) {
							if (gridLines.display) {
								context.save();
								context.lineWidth = itemToDraw.glWidth;
								context.strokeStyle = itemToDraw.glColor;
								if (context.setLineDash) {
									context.setLineDash(itemToDraw.glBorderDash);
									context.lineDashOffset = itemToDraw.glBorderDashOffset;
								}

								context.beginPath();

								if (gridLines.drawTicks) {
									context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
									context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
								}

								if (gridLines.drawOnChartArea) {
									context.moveTo(itemToDraw.x1, itemToDraw.y1);
									context.lineTo(itemToDraw.x2, itemToDraw.y2);
								}

								context.stroke();
								context.restore();
							}

							if (optionTicks.display) {
								context.save();
								context.translate(itemToDraw.labelX, itemToDraw.labelY);
								context.rotate(itemToDraw.rotation);
								context.font = tickLabelFont;
								context.textBaseline = itemToDraw.textBaseline;
								context.textAlign = itemToDraw.textAlign;

								var label = itemToDraw.label;
								if (helpers.isArray(label)) {
									for (var i = 0, y = -(label.length - 1) * tickFontSize * 0.75; i < label.length; ++i) {
										// We just make sure the multiline element is a string here..
										context.fillText('' + label[i], 0, y);
										// apply same lineSpacing as calculated @ L#320
										y += tickFontSize * 1.5;
									}
								} else {
									context.fillText(label, 0, 0);
								}
								context.restore();
							}
						});

						if (scaleLabel.display) {
							// Draw the scale label
							var scaleLabelX;
							var scaleLabelY;
							var rotation = 0;

							if (isHorizontal) {
								scaleLabelX = me.left + (me.right - me.left) / 2; // midpoint of the width
								scaleLabelY = options.position === 'bottom' ? me.bottom - scaleLabelFontSize / 2 : me.top + scaleLabelFontSize / 2;
							} else {
								var isLeft = options.position === 'left';
								scaleLabelX = isLeft ? me.left + scaleLabelFontSize / 2 : me.right - scaleLabelFontSize / 2;
								scaleLabelY = me.top + (me.bottom - me.top) / 2;
								rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
							}

							context.save();
							context.translate(scaleLabelX, scaleLabelY);
							context.rotate(rotation);
							context.textAlign = 'center';
							context.textBaseline = 'middle';
							context.fillStyle = scaleLabelFontColor; // render in correct colour
							context.font = scaleLabelFont;
							context.fillText(scaleLabel.labelString, 0, 0);
							context.restore();
						}

						if (gridLines.drawBorder) {
							// Draw the line at the edge of the axis
							context.lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, 0);
							context.strokeStyle = helpers.getValueAtIndexOrDefault(gridLines.color, 0);
							var x1 = me.left,
							    x2 = me.right,
							    y1 = me.top,
							    y2 = me.bottom;

							var aliasPixel = helpers.aliasPixel(context.lineWidth);
							if (isHorizontal) {
								y1 = y2 = options.position === 'top' ? me.bottom : me.top;
								y1 += aliasPixel;
								y2 += aliasPixel;
							} else {
								x1 = x2 = options.position === 'left' ? me.right : me.left;
								x1 += aliasPixel;
								x2 += aliasPixel;
							}

							context.beginPath();
							context.moveTo(x1, y1);
							context.lineTo(x2, y2);
							context.stroke();
						}
					}
				});
			};
		}, {}], 33: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.scaleService = {
					// Scale registration object. Extensions can register new scale types (such as log or DB scales) and then
					// use the new chart options to grab the correct scale
					constructors: {},
					// Use a registration function so that we can move to an ES6 map when we no longer need to support
					// old browsers

					// Scale config defaults
					defaults: {},
					registerScaleType: function registerScaleType(type, scaleConstructor, defaults) {
						this.constructors[type] = scaleConstructor;
						this.defaults[type] = helpers.clone(defaults);
					},
					getScaleConstructor: function getScaleConstructor(type) {
						return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined;
					},
					getScaleDefaults: function getScaleDefaults(type) {
						// Return the scale defaults merged with the global settings so that we always use the latest ones
						return this.defaults.hasOwnProperty(type) ? helpers.scaleMerge(Chart.defaults.scale, this.defaults[type]) : {};
					},
					updateScaleDefaults: function updateScaleDefaults(type, additions) {
						var defaults = this.defaults;
						if (defaults.hasOwnProperty(type)) {
							defaults[type] = helpers.extend(defaults[type], additions);
						}
					},
					addScalesToLayout: function addScalesToLayout(chartInstance) {
						// Adds each scale to the chart.boxes array to be sized accordingly
						helpers.each(chartInstance.scales, function (scale) {
							Chart.layoutService.addBox(chartInstance, scale);
						});
					}
				};
			};
		}, {}], 34: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				/**
     * Namespace to hold static tick generation functions
     * @namespace Chart.Ticks
     */
				Chart.Ticks = {
					/**
      * Namespace to hold generators for different types of ticks
      * @namespace Chart.Ticks.generators
      */
					generators: {
						/**
       * Interface for the options provided to the numeric tick generator
       * @interface INumericTickGenerationOptions
       */
						/**
       * The maximum number of ticks to display
       * @name INumericTickGenerationOptions#maxTicks
       * @type Number
       */
						/**
       * The distance between each tick.
       * @name INumericTickGenerationOptions#stepSize
       * @type Number
       * @optional
       */
						/**
       * Forced minimum for the ticks. If not specified, the minimum of the data range is used to calculate the tick minimum
       * @name INumericTickGenerationOptions#min
       * @type Number
       * @optional
       */
						/**
       * The maximum value of the ticks. If not specified, the maximum of the data range is used to calculate the tick maximum
       * @name INumericTickGenerationOptions#max
       * @type Number
       * @optional
       */

						/**
       * Generate a set of linear ticks
       * @method Chart.Ticks.generators.linear
       * @param generationOptions {INumericTickGenerationOptions} the options used to generate the ticks
       * @param dataRange {IRange} the range of the data
       * @returns {Array<Number>} array of tick values
       */
						linear: function linear(generationOptions, dataRange) {
							var ticks = [];
							// To get a "nice" value for the tick spacing, we will use the appropriately named
							// "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
							// for details.

							var spacing;
							if (generationOptions.stepSize && generationOptions.stepSize > 0) {
								spacing = generationOptions.stepSize;
							} else {
								var niceRange = helpers.niceNum(dataRange.max - dataRange.min, false);
								spacing = helpers.niceNum(niceRange / (generationOptions.maxTicks - 1), true);
							}
							var niceMin = Math.floor(dataRange.min / spacing) * spacing;
							var niceMax = Math.ceil(dataRange.max / spacing) * spacing;

							// If min, max and stepSize is set and they make an evenly spaced scale use it.
							if (generationOptions.min && generationOptions.max && generationOptions.stepSize) {
								var minMaxDeltaDivisibleByStepSize = (generationOptions.max - generationOptions.min) % generationOptions.stepSize === 0;
								if (minMaxDeltaDivisibleByStepSize) {
									niceMin = generationOptions.min;
									niceMax = generationOptions.max;
								}
							}

							var numSpaces = (niceMax - niceMin) / spacing;
							// If very close to our rounded value, use it.
							if (helpers.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
								numSpaces = Math.round(numSpaces);
							} else {
								numSpaces = Math.ceil(numSpaces);
							}

							// Put the values into the ticks array
							ticks.push(generationOptions.min !== undefined ? generationOptions.min : niceMin);
							for (var j = 1; j < numSpaces; ++j) {
								ticks.push(niceMin + j * spacing);
							}
							ticks.push(generationOptions.max !== undefined ? generationOptions.max : niceMax);

							return ticks;
						},

						/**
       * Generate a set of logarithmic ticks
       * @method Chart.Ticks.generators.logarithmic
       * @param generationOptions {INumericTickGenerationOptions} the options used to generate the ticks
       * @param dataRange {IRange} the range of the data
       * @returns {Array<Number>} array of tick values
       */
						logarithmic: function logarithmic(generationOptions, dataRange) {
							var ticks = [];
							var getValueOrDefault = helpers.getValueOrDefault;

							// Figure out what the max number of ticks we can support it is based on the size of
							// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
							// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
							// the graph
							var tickVal = getValueOrDefault(generationOptions.min, Math.pow(10, Math.floor(helpers.log10(dataRange.min))));

							while (tickVal < dataRange.max) {
								ticks.push(tickVal);

								var exp;
								var significand;

								if (tickVal === 0) {
									exp = Math.floor(helpers.log10(dataRange.minNotZero));
									significand = Math.round(dataRange.minNotZero / Math.pow(10, exp));
								} else {
									exp = Math.floor(helpers.log10(tickVal));
									significand = Math.floor(tickVal / Math.pow(10, exp)) + 1;
								}

								if (significand === 10) {
									significand = 1;
									++exp;
								}

								tickVal = significand * Math.pow(10, exp);
							}

							var lastTick = getValueOrDefault(generationOptions.max, tickVal);
							ticks.push(lastTick);

							return ticks;
						}
					},

					/**
      * Namespace to hold formatters for different types of ticks
      * @namespace Chart.Ticks.formatters
      */
					formatters: {
						/**
       * Formatter for value labels
       * @method Chart.Ticks.formatters.values
       * @param value the value to display
       * @return {String|Array} the label to display
       */
						values: function values(value) {
							return helpers.isArray(value) ? value : '' + value;
						},

						/**
       * Formatter for linear numeric ticks
       * @method Chart.Ticks.formatters.linear
       * @param tickValue {Number} the value to be formatted
       * @param index {Number} the position of the tickValue parameter in the ticks array
       * @param ticks {Array<Number>} the list of ticks being converted
       * @return {String} string representation of the tickValue parameter
       */
						linear: function linear(tickValue, index, ticks) {
							// If we have lots of ticks, don't use the ones
							var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];

							// If we have a number like 2.5 as the delta, figure out how many decimal places we need
							if (Math.abs(delta) > 1) {
								if (tickValue !== Math.floor(tickValue)) {
									// not an integer
									delta = tickValue - Math.floor(tickValue);
								}
							}

							var logDelta = helpers.log10(Math.abs(delta));
							var tickString = '';

							if (tickValue !== 0) {
								var numDecimal = -1 * Math.floor(logDelta);
								numDecimal = Math.max(Math.min(numDecimal, 20), 0); // toFixed has a max of 20 decimal places
								tickString = tickValue.toFixed(numDecimal);
							} else {
								tickString = '0'; // never show decimal places for 0
							}

							return tickString;
						},

						logarithmic: function logarithmic(tickValue, index, ticks) {
							var remain = tickValue / Math.pow(10, Math.floor(helpers.log10(tickValue)));

							if (tickValue === 0) {
								return '0';
							} else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1) {
								return tickValue.toExponential();
							}
							return '';
						}
					}
				};
			};
		}, {}], 35: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				Chart.defaults.global.title = {
					display: false,
					position: 'top',
					fullWidth: true, // marks that this box should take the full width of the canvas (pushing down other boxes)

					fontStyle: 'bold',
					padding: 10,

					// actual title
					text: ''
				};

				var noop = helpers.noop;
				Chart.Title = Chart.Element.extend({

					initialize: function initialize(config) {
						var me = this;
						helpers.extend(me, config);
						me.options = helpers.configMerge(Chart.defaults.global.title, config.options);

						// Contains hit boxes for each dataset (in dataset order)
						me.legendHitBoxes = [];
					},

					// These methods are ordered by lifecycle. Utilities then follow.

					beforeUpdate: function beforeUpdate() {
						var chartOpts = this.chart.options;
						if (chartOpts && chartOpts.title) {
							this.options = helpers.configMerge(Chart.defaults.global.title, chartOpts.title);
						}
					},
					update: function update(maxWidth, maxHeight, margins) {
						var me = this;

						// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
						me.beforeUpdate();

						// Absorb the master measurements
						me.maxWidth = maxWidth;
						me.maxHeight = maxHeight;
						me.margins = margins;

						// Dimensions
						me.beforeSetDimensions();
						me.setDimensions();
						me.afterSetDimensions();
						// Labels
						me.beforeBuildLabels();
						me.buildLabels();
						me.afterBuildLabels();

						// Fit
						me.beforeFit();
						me.fit();
						me.afterFit();
						//
						me.afterUpdate();

						return me.minSize;
					},
					afterUpdate: noop,

					//

					beforeSetDimensions: noop,
					setDimensions: function setDimensions() {
						var me = this;
						// Set the unconstrained dimension before label rotation
						if (me.isHorizontal()) {
							// Reset position before calculating rotation
							me.width = me.maxWidth;
							me.left = 0;
							me.right = me.width;
						} else {
							me.height = me.maxHeight;

							// Reset position before calculating rotation
							me.top = 0;
							me.bottom = me.height;
						}

						// Reset padding
						me.paddingLeft = 0;
						me.paddingTop = 0;
						me.paddingRight = 0;
						me.paddingBottom = 0;

						// Reset minSize
						me.minSize = {
							width: 0,
							height: 0
						};
					},
					afterSetDimensions: noop,

					//

					beforeBuildLabels: noop,
					buildLabels: noop,
					afterBuildLabels: noop,

					//

					beforeFit: noop,
					fit: function fit() {
						var me = this,
						    valueOrDefault = helpers.getValueOrDefault,
						    opts = me.options,
						    globalDefaults = Chart.defaults.global,
						    display = opts.display,
						    fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize),
						    minSize = me.minSize;

						if (me.isHorizontal()) {
							minSize.width = me.maxWidth; // fill all the width
							minSize.height = display ? fontSize + opts.padding * 2 : 0;
						} else {
							minSize.width = display ? fontSize + opts.padding * 2 : 0;
							minSize.height = me.maxHeight; // fill all the height
						}

						me.width = minSize.width;
						me.height = minSize.height;
					},
					afterFit: noop,

					// Shared Methods
					isHorizontal: function isHorizontal() {
						var pos = this.options.position;
						return pos === 'top' || pos === 'bottom';
					},

					// Actually draw the title block on the canvas
					draw: function draw() {
						var me = this,
						    ctx = me.ctx,
						    valueOrDefault = helpers.getValueOrDefault,
						    opts = me.options,
						    globalDefaults = Chart.defaults.global;

						if (opts.display) {
							var fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize),
							    fontStyle = valueOrDefault(opts.fontStyle, globalDefaults.defaultFontStyle),
							    fontFamily = valueOrDefault(opts.fontFamily, globalDefaults.defaultFontFamily),
							    titleFont = helpers.fontString(fontSize, fontStyle, fontFamily),
							    rotation = 0,
							    titleX,
							    titleY,
							    top = me.top,
							    left = me.left,
							    bottom = me.bottom,
							    right = me.right,
							    maxWidth;

							ctx.fillStyle = valueOrDefault(opts.fontColor, globalDefaults.defaultFontColor); // render in correct colour
							ctx.font = titleFont;

							// Horizontal
							if (me.isHorizontal()) {
								titleX = left + (right - left) / 2; // midpoint of the width
								titleY = top + (bottom - top) / 2; // midpoint of the height
								maxWidth = right - left;
							} else {
								titleX = opts.position === 'left' ? left + fontSize / 2 : right - fontSize / 2;
								titleY = top + (bottom - top) / 2;
								maxWidth = bottom - top;
								rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5);
							}

							ctx.save();
							ctx.translate(titleX, titleY);
							ctx.rotate(rotation);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillText(opts.text, 0, 0, maxWidth);
							ctx.restore();
						}
					}
				});

				// Register the title plugin
				Chart.plugins.register({
					beforeInit: function beforeInit(chartInstance) {
						var opts = chartInstance.options;
						var titleOpts = opts.title;

						if (titleOpts) {
							chartInstance.titleBlock = new Chart.Title({
								ctx: chartInstance.chart.ctx,
								options: titleOpts,
								chart: chartInstance
							});

							Chart.layoutService.addBox(chartInstance, chartInstance.titleBlock);
						}
					}
				});
			};
		}, {}], 36: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				/**
    	 * Helper method to merge the opacity into a color
    	 */
				function mergeOpacity(colorString, opacity) {
					var color = helpers.color(colorString);
					return color.alpha(opacity * color.alpha()).rgbaString();
				}

				Chart.defaults.global.tooltips = {
					enabled: true,
					custom: null,
					mode: 'nearest',
					position: 'average',
					intersect: true,
					backgroundColor: 'rgba(0,0,0,0.8)',
					titleFontStyle: 'bold',
					titleSpacing: 2,
					titleMarginBottom: 6,
					titleFontColor: '#fff',
					titleAlign: 'left',
					bodySpacing: 2,
					bodyFontColor: '#fff',
					bodyAlign: 'left',
					footerFontStyle: 'bold',
					footerSpacing: 2,
					footerMarginTop: 6,
					footerFontColor: '#fff',
					footerAlign: 'left',
					yPadding: 6,
					xPadding: 6,
					caretSize: 5,
					cornerRadius: 6,
					multiKeyBackground: '#fff',
					displayColors: true,
					callbacks: {
						// Args are: (tooltipItems, data)
						beforeTitle: helpers.noop,
						title: function title(tooltipItems, data) {
							// Pick first xLabel for now
							var title = '';
							var labels = data.labels;
							var labelCount = labels ? labels.length : 0;

							if (tooltipItems.length > 0) {
								var item = tooltipItems[0];

								if (item.xLabel) {
									title = item.xLabel;
								} else if (labelCount > 0 && item.index < labelCount) {
									title = labels[item.index];
								}
							}

							return title;
						},
						afterTitle: helpers.noop,

						// Args are: (tooltipItems, data)
						beforeBody: helpers.noop,

						// Args are: (tooltipItem, data)
						beforeLabel: helpers.noop,
						label: function label(tooltipItem, data) {
							var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
							return datasetLabel + ': ' + tooltipItem.yLabel;
						},
						labelColor: function labelColor(tooltipItem, chartInstance) {
							var meta = chartInstance.getDatasetMeta(tooltipItem.datasetIndex);
							var activeElement = meta.data[tooltipItem.index];
							var view = activeElement._view;
							return {
								borderColor: view.borderColor,
								backgroundColor: view.backgroundColor
							};
						},
						afterLabel: helpers.noop,

						// Args are: (tooltipItems, data)
						afterBody: helpers.noop,

						// Args are: (tooltipItems, data)
						beforeFooter: helpers.noop,
						footer: helpers.noop,
						afterFooter: helpers.noop
					}
				};

				// Helper to push or concat based on if the 2nd parameter is an array or not
				function pushOrConcat(base, toPush) {
					if (toPush) {
						if (helpers.isArray(toPush)) {
							// base = base.concat(toPush);
							Array.prototype.push.apply(base, toPush);
						} else {
							base.push(toPush);
						}
					}

					return base;
				}

				// Private helper to create a tooltip item model
				// @param element : the chart element (point, arc, bar) to create the tooltip item for
				// @return : new tooltip item
				function createTooltipItem(element) {
					var xScale = element._xScale;
					var yScale = element._yScale || element._scale; // handle radar || polarArea charts
					var index = element._index,
					    datasetIndex = element._datasetIndex;

					return {
						xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '',
						yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '',
						index: index,
						datasetIndex: datasetIndex,
						x: element._model.x,
						y: element._model.y
					};
				}

				/**
     * Helper to get the reset model for the tooltip
     * @param tooltipOpts {Object} the tooltip options
     */
				function getBaseModel(tooltipOpts) {
					var globalDefaults = Chart.defaults.global;
					var getValueOrDefault = helpers.getValueOrDefault;

					return {
						// Positioning
						xPadding: tooltipOpts.xPadding,
						yPadding: tooltipOpts.yPadding,
						xAlign: tooltipOpts.xAlign,
						yAlign: tooltipOpts.yAlign,

						// Body
						bodyFontColor: tooltipOpts.bodyFontColor,
						_bodyFontFamily: getValueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
						_bodyFontStyle: getValueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
						_bodyAlign: tooltipOpts.bodyAlign,
						bodyFontSize: getValueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
						bodySpacing: tooltipOpts.bodySpacing,

						// Title
						titleFontColor: tooltipOpts.titleFontColor,
						_titleFontFamily: getValueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
						_titleFontStyle: getValueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
						titleFontSize: getValueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
						_titleAlign: tooltipOpts.titleAlign,
						titleSpacing: tooltipOpts.titleSpacing,
						titleMarginBottom: tooltipOpts.titleMarginBottom,

						// Footer
						footerFontColor: tooltipOpts.footerFontColor,
						_footerFontFamily: getValueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
						_footerFontStyle: getValueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
						footerFontSize: getValueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
						_footerAlign: tooltipOpts.footerAlign,
						footerSpacing: tooltipOpts.footerSpacing,
						footerMarginTop: tooltipOpts.footerMarginTop,

						// Appearance
						caretSize: tooltipOpts.caretSize,
						cornerRadius: tooltipOpts.cornerRadius,
						backgroundColor: tooltipOpts.backgroundColor,
						opacity: 0,
						legendColorBackground: tooltipOpts.multiKeyBackground,
						displayColors: tooltipOpts.displayColors
					};
				}

				/**
     * Get the size of the tooltip
     */
				function getTooltipSize(tooltip, model) {
					var ctx = tooltip._chart.ctx;

					var height = model.yPadding * 2; // Tooltip Padding
					var width = 0;

					// Count of all lines in the body
					var body = model.body;
					var combinedBodyLength = body.reduce(function (count, bodyItem) {
						return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
					}, 0);
					combinedBodyLength += model.beforeBody.length + model.afterBody.length;

					var titleLineCount = model.title.length;
					var footerLineCount = model.footer.length;
					var titleFontSize = model.titleFontSize,
					    bodyFontSize = model.bodyFontSize,
					    footerFontSize = model.footerFontSize;

					height += titleLineCount * titleFontSize; // Title Lines
					height += titleLineCount ? (titleLineCount - 1) * model.titleSpacing : 0; // Title Line Spacing
					height += titleLineCount ? model.titleMarginBottom : 0; // Title's bottom Margin
					height += combinedBodyLength * bodyFontSize; // Body Lines
					height += combinedBodyLength ? (combinedBodyLength - 1) * model.bodySpacing : 0; // Body Line Spacing
					height += footerLineCount ? model.footerMarginTop : 0; // Footer Margin
					height += footerLineCount * footerFontSize; // Footer Lines
					height += footerLineCount ? (footerLineCount - 1) * model.footerSpacing : 0; // Footer Line Spacing

					// Title width
					var widthPadding = 0;
					var maxLineWidth = function maxLineWidth(line) {
						width = Math.max(width, ctx.measureText(line).width + widthPadding);
					};

					ctx.font = helpers.fontString(titleFontSize, model._titleFontStyle, model._titleFontFamily);
					helpers.each(model.title, maxLineWidth);

					// Body width
					ctx.font = helpers.fontString(bodyFontSize, model._bodyFontStyle, model._bodyFontFamily);
					helpers.each(model.beforeBody.concat(model.afterBody), maxLineWidth);

					// Body lines may include some extra width due to the color box
					widthPadding = model.displayColors ? bodyFontSize + 2 : 0;
					helpers.each(body, function (bodyItem) {
						helpers.each(bodyItem.before, maxLineWidth);
						helpers.each(bodyItem.lines, maxLineWidth);
						helpers.each(bodyItem.after, maxLineWidth);
					});

					// Reset back to 0
					widthPadding = 0;

					// Footer width
					ctx.font = helpers.fontString(footerFontSize, model._footerFontStyle, model._footerFontFamily);
					helpers.each(model.footer, maxLineWidth);

					// Add padding
					width += 2 * model.xPadding;

					return {
						width: width,
						height: height
					};
				}

				/**
     * Helper to get the alignment of a tooltip given the size
     */
				function determineAlignment(tooltip, size) {
					var model = tooltip._model;
					var chart = tooltip._chart;
					var chartArea = tooltip._chartInstance.chartArea;
					var xAlign = 'center';
					var yAlign = 'center';

					if (model.y < size.height) {
						yAlign = 'top';
					} else if (model.y > chart.height - size.height) {
						yAlign = 'bottom';
					}

					var lf, rf; // functions to determine left, right alignment
					var olf, orf; // functions to determine if left/right alignment causes tooltip to go outside chart
					var yf; // function to get the y alignment if the tooltip goes outside of the left or right edges
					var midX = (chartArea.left + chartArea.right) / 2;
					var midY = (chartArea.top + chartArea.bottom) / 2;

					if (yAlign === 'center') {
						lf = function lf(x) {
							return x <= midX;
						};
						rf = function rf(x) {
							return x > midX;
						};
					} else {
						lf = function lf(x) {
							return x <= size.width / 2;
						};
						rf = function rf(x) {
							return x >= chart.width - size.width / 2;
						};
					}

					olf = function olf(x) {
						return x + size.width > chart.width;
					};
					orf = function orf(x) {
						return x - size.width < 0;
					};
					yf = function yf(y) {
						return y <= midY ? 'top' : 'bottom';
					};

					if (lf(model.x)) {
						xAlign = 'left';

						// Is tooltip too wide and goes over the right side of the chart.?
						if (olf(model.x)) {
							xAlign = 'center';
							yAlign = yf(model.y);
						}
					} else if (rf(model.x)) {
						xAlign = 'right';

						// Is tooltip too wide and goes outside left edge of canvas?
						if (orf(model.x)) {
							xAlign = 'center';
							yAlign = yf(model.y);
						}
					}

					var opts = tooltip._options;
					return {
						xAlign: opts.xAlign ? opts.xAlign : xAlign,
						yAlign: opts.yAlign ? opts.yAlign : yAlign
					};
				}

				/**
     * @Helper to get the location a tooltip needs to be placed at given the initial position (via the vm) and the size and alignment
     */
				function getBackgroundPoint(vm, size, alignment) {
					// Background Position
					var x = vm.x;
					var y = vm.y;

					var caretSize = vm.caretSize,
					    caretPadding = vm.caretPadding,
					    cornerRadius = vm.cornerRadius,
					    xAlign = alignment.xAlign,
					    yAlign = alignment.yAlign,
					    paddingAndSize = caretSize + caretPadding,
					    radiusAndPadding = cornerRadius + caretPadding;

					if (xAlign === 'right') {
						x -= size.width;
					} else if (xAlign === 'center') {
						x -= size.width / 2;
					}

					if (yAlign === 'top') {
						y += paddingAndSize;
					} else if (yAlign === 'bottom') {
						y -= size.height + paddingAndSize;
					} else {
						y -= size.height / 2;
					}

					if (yAlign === 'center') {
						if (xAlign === 'left') {
							x += paddingAndSize;
						} else if (xAlign === 'right') {
							x -= paddingAndSize;
						}
					} else if (xAlign === 'left') {
						x -= radiusAndPadding;
					} else if (xAlign === 'right') {
						x += radiusAndPadding;
					}

					return {
						x: x,
						y: y
					};
				}

				Chart.Tooltip = Chart.Element.extend({
					initialize: function initialize() {
						this._model = getBaseModel(this._options);
					},

					// Get the title
					// Args are: (tooltipItem, data)
					getTitle: function getTitle() {
						var me = this;
						var opts = me._options;
						var callbacks = opts.callbacks;

						var beforeTitle = callbacks.beforeTitle.apply(me, arguments),
						    title = callbacks.title.apply(me, arguments),
						    afterTitle = callbacks.afterTitle.apply(me, arguments);

						var lines = [];
						lines = pushOrConcat(lines, beforeTitle);
						lines = pushOrConcat(lines, title);
						lines = pushOrConcat(lines, afterTitle);

						return lines;
					},

					// Args are: (tooltipItem, data)
					getBeforeBody: function getBeforeBody() {
						var lines = this._options.callbacks.beforeBody.apply(this, arguments);
						return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
					},

					// Args are: (tooltipItem, data)
					getBody: function getBody(tooltipItems, data) {
						var me = this;
						var callbacks = me._options.callbacks;
						var bodyItems = [];

						helpers.each(tooltipItems, function (tooltipItem) {
							var bodyItem = {
								before: [],
								lines: [],
								after: []
							};
							pushOrConcat(bodyItem.before, callbacks.beforeLabel.call(me, tooltipItem, data));
							pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
							pushOrConcat(bodyItem.after, callbacks.afterLabel.call(me, tooltipItem, data));

							bodyItems.push(bodyItem);
						});

						return bodyItems;
					},

					// Args are: (tooltipItem, data)
					getAfterBody: function getAfterBody() {
						var lines = this._options.callbacks.afterBody.apply(this, arguments);
						return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
					},

					// Get the footer and beforeFooter and afterFooter lines
					// Args are: (tooltipItem, data)
					getFooter: function getFooter() {
						var me = this;
						var callbacks = me._options.callbacks;

						var beforeFooter = callbacks.beforeFooter.apply(me, arguments);
						var footer = callbacks.footer.apply(me, arguments);
						var afterFooter = callbacks.afterFooter.apply(me, arguments);

						var lines = [];
						lines = pushOrConcat(lines, beforeFooter);
						lines = pushOrConcat(lines, footer);
						lines = pushOrConcat(lines, afterFooter);

						return lines;
					},

					update: function update(changed) {
						var me = this;
						var opts = me._options;

						// Need to regenerate the model because its faster than using extend and it is necessary due to the optimization in Chart.Element.transition
						// that does _view = _model if ease === 1. This causes the 2nd tooltip update to set properties in both the view and model at the same time
						// which breaks any animations.
						var existingModel = me._model;
						var model = me._model = getBaseModel(opts);
						var active = me._active;

						var data = me._data;
						var chartInstance = me._chartInstance;

						// In the case where active.length === 0 we need to keep these at existing values for good animations
						var alignment = {
							xAlign: existingModel.xAlign,
							yAlign: existingModel.yAlign
						};
						var backgroundPoint = {
							x: existingModel.x,
							y: existingModel.y
						};
						var tooltipSize = {
							width: existingModel.width,
							height: existingModel.height
						};
						var tooltipPosition = {
							x: existingModel.caretX,
							y: existingModel.caretY
						};

						var i, len;

						if (active.length) {
							model.opacity = 1;

							var labelColors = [];
							tooltipPosition = Chart.Tooltip.positioners[opts.position](active, me._eventPosition);

							var tooltipItems = [];
							for (i = 0, len = active.length; i < len; ++i) {
								tooltipItems.push(createTooltipItem(active[i]));
							}

							// If the user provided a filter function, use it to modify the tooltip items
							if (opts.filter) {
								tooltipItems = tooltipItems.filter(function (a) {
									return opts.filter(a, data);
								});
							}

							// If the user provided a sorting function, use it to modify the tooltip items
							if (opts.itemSort) {
								tooltipItems = tooltipItems.sort(function (a, b) {
									return opts.itemSort(a, b, data);
								});
							}

							// Determine colors for boxes
							helpers.each(tooltipItems, function (tooltipItem) {
								labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, chartInstance));
							});

							// Build the Text Lines
							model.title = me.getTitle(tooltipItems, data);
							model.beforeBody = me.getBeforeBody(tooltipItems, data);
							model.body = me.getBody(tooltipItems, data);
							model.afterBody = me.getAfterBody(tooltipItems, data);
							model.footer = me.getFooter(tooltipItems, data);

							// Initial positioning and colors
							model.x = Math.round(tooltipPosition.x);
							model.y = Math.round(tooltipPosition.y);
							model.caretPadding = helpers.getValueOrDefault(tooltipPosition.padding, 2);
							model.labelColors = labelColors;

							// data points
							model.dataPoints = tooltipItems;

							// We need to determine alignment of the tooltip
							tooltipSize = getTooltipSize(this, model);
							alignment = determineAlignment(this, tooltipSize);
							// Final Size and Position
							backgroundPoint = getBackgroundPoint(model, tooltipSize, alignment);
						} else {
							model.opacity = 0;
						}

						model.xAlign = alignment.xAlign;
						model.yAlign = alignment.yAlign;
						model.x = backgroundPoint.x;
						model.y = backgroundPoint.y;
						model.width = tooltipSize.width;
						model.height = tooltipSize.height;

						// Point where the caret on the tooltip points to
						model.caretX = tooltipPosition.x;
						model.caretY = tooltipPosition.y;

						me._model = model;

						if (changed && opts.custom) {
							opts.custom.call(me, model);
						}

						return me;
					},
					drawCaret: function drawCaret(tooltipPoint, size, opacity) {
						var vm = this._view;
						var ctx = this._chart.ctx;
						var x1, x2, x3;
						var y1, y2, y3;
						var caretSize = vm.caretSize;
						var cornerRadius = vm.cornerRadius;
						var xAlign = vm.xAlign,
						    yAlign = vm.yAlign;
						var ptX = tooltipPoint.x,
						    ptY = tooltipPoint.y;
						var width = size.width,
						    height = size.height;

						if (yAlign === 'center') {
							// Left or right side
							if (xAlign === 'left') {
								x1 = ptX;
								x2 = x1 - caretSize;
								x3 = x1;
							} else {
								x1 = ptX + width;
								x2 = x1 + caretSize;
								x3 = x1;
							}

							y2 = ptY + height / 2;
							y1 = y2 - caretSize;
							y3 = y2 + caretSize;
						} else {
							if (xAlign === 'left') {
								x1 = ptX + cornerRadius;
								x2 = x1 + caretSize;
								x3 = x2 + caretSize;
							} else if (xAlign === 'right') {
								x1 = ptX + width - cornerRadius;
								x2 = x1 - caretSize;
								x3 = x2 - caretSize;
							} else {
								x2 = ptX + width / 2;
								x1 = x2 - caretSize;
								x3 = x2 + caretSize;
							}

							if (yAlign === 'top') {
								y1 = ptY;
								y2 = y1 - caretSize;
								y3 = y1;
							} else {
								y1 = ptY + height;
								y2 = y1 + caretSize;
								y3 = y1;
							}
						}

						ctx.fillStyle = mergeOpacity(vm.backgroundColor, opacity);
						ctx.beginPath();
						ctx.moveTo(x1, y1);
						ctx.lineTo(x2, y2);
						ctx.lineTo(x3, y3);
						ctx.closePath();
						ctx.fill();
					},
					drawTitle: function drawTitle(pt, vm, ctx, opacity) {
						var title = vm.title;

						if (title.length) {
							ctx.textAlign = vm._titleAlign;
							ctx.textBaseline = 'top';

							var titleFontSize = vm.titleFontSize,
							    titleSpacing = vm.titleSpacing;

							ctx.fillStyle = mergeOpacity(vm.titleFontColor, opacity);
							ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);

							var i, len;
							for (i = 0, len = title.length; i < len; ++i) {
								ctx.fillText(title[i], pt.x, pt.y);
								pt.y += titleFontSize + titleSpacing; // Line Height and spacing

								if (i + 1 === title.length) {
									pt.y += vm.titleMarginBottom - titleSpacing; // If Last, add margin, remove spacing
								}
							}
						}
					},
					drawBody: function drawBody(pt, vm, ctx, opacity) {
						var bodyFontSize = vm.bodyFontSize;
						var bodySpacing = vm.bodySpacing;
						var body = vm.body;

						ctx.textAlign = vm._bodyAlign;
						ctx.textBaseline = 'top';

						var textColor = mergeOpacity(vm.bodyFontColor, opacity);
						ctx.fillStyle = textColor;
						ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);

						// Before Body
						var xLinePadding = 0;
						var fillLineOfText = function fillLineOfText(line) {
							ctx.fillText(line, pt.x + xLinePadding, pt.y);
							pt.y += bodyFontSize + bodySpacing;
						};

						// Before body lines
						helpers.each(vm.beforeBody, fillLineOfText);

						var drawColorBoxes = vm.displayColors;
						xLinePadding = drawColorBoxes ? bodyFontSize + 2 : 0;

						// Draw body lines now
						helpers.each(body, function (bodyItem, i) {
							helpers.each(bodyItem.before, fillLineOfText);

							helpers.each(bodyItem.lines, function (line) {
								// Draw Legend-like boxes if needed
								if (drawColorBoxes) {
									// Fill a white rect so that colours merge nicely if the opacity is < 1
									ctx.fillStyle = mergeOpacity(vm.legendColorBackground, opacity);
									ctx.fillRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

									// Border
									ctx.strokeStyle = mergeOpacity(vm.labelColors[i].borderColor, opacity);
									ctx.strokeRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

									// Inner square
									ctx.fillStyle = mergeOpacity(vm.labelColors[i].backgroundColor, opacity);
									ctx.fillRect(pt.x + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);

									ctx.fillStyle = textColor;
								}

								fillLineOfText(line);
							});

							helpers.each(bodyItem.after, fillLineOfText);
						});

						// Reset back to 0 for after body
						xLinePadding = 0;

						// After body lines
						helpers.each(vm.afterBody, fillLineOfText);
						pt.y -= bodySpacing; // Remove last body spacing
					},
					drawFooter: function drawFooter(pt, vm, ctx, opacity) {
						var footer = vm.footer;

						if (footer.length) {
							pt.y += vm.footerMarginTop;

							ctx.textAlign = vm._footerAlign;
							ctx.textBaseline = 'top';

							ctx.fillStyle = mergeOpacity(vm.footerFontColor, opacity);
							ctx.font = helpers.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);

							helpers.each(footer, function (line) {
								ctx.fillText(line, pt.x, pt.y);
								pt.y += vm.footerFontSize + vm.footerSpacing;
							});
						}
					},
					drawBackground: function drawBackground(pt, vm, ctx, tooltipSize, opacity) {
						ctx.fillStyle = mergeOpacity(vm.backgroundColor, opacity);
						helpers.drawRoundedRectangle(ctx, pt.x, pt.y, tooltipSize.width, tooltipSize.height, vm.cornerRadius);
						ctx.fill();
					},
					draw: function draw() {
						var ctx = this._chart.ctx;
						var vm = this._view;

						if (vm.opacity === 0) {
							return;
						}

						var tooltipSize = {
							width: vm.width,
							height: vm.height
						};
						var pt = {
							x: vm.x,
							y: vm.y
						};

						// IE11/Edge does not like very small opacities, so snap to 0
						var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity;

						if (this._options.enabled) {
							// Draw Background
							this.drawBackground(pt, vm, ctx, tooltipSize, opacity);

							// Draw Caret
							this.drawCaret(pt, tooltipSize, opacity);

							// Draw Title, Body, and Footer
							pt.x += vm.xPadding;
							pt.y += vm.yPadding;

							// Titles
							this.drawTitle(pt, vm, ctx, opacity);

							// Body
							this.drawBody(pt, vm, ctx, opacity);

							// Footer
							this.drawFooter(pt, vm, ctx, opacity);
						}
					},

					/**
      * Handle an event
      * @private
      * @param e {Event} the event to handle
      * @returns {Boolean} true if the tooltip changed
      */
					handleEvent: function handleEvent(e) {
						var me = this;
						var options = me._options;
						var changed = false;

						me._lastActive = me._lastActive || [];

						// Find Active Elements for tooltips
						if (e.type === 'mouseout') {
							me._active = [];
						} else {
							me._active = me._chartInstance.getElementsAtEventForMode(e, options.mode, options);
						}

						// Remember Last Actives
						changed = !helpers.arrayEquals(me._active, me._lastActive);
						me._lastActive = me._active;

						if (options.enabled || options.custom) {
							me._eventPosition = helpers.getRelativePosition(e, me._chart);

							var model = me._model;
							me.update(true);
							me.pivot();

							// See if our tooltip position changed
							changed |= model.x !== me._model.x || model.y !== me._model.y;
						}

						return changed;
					}
				});

				/**
     * @namespace Chart.Tooltip.positioners
     */
				Chart.Tooltip.positioners = {
					/**
      * Average mode places the tooltip at the average position of the elements shown
      * @function Chart.Tooltip.positioners.average
      * @param elements {ChartElement[]} the elements being displayed in the tooltip
      * @returns {Point} tooltip position
      */
					average: function average(elements) {
						if (!elements.length) {
							return false;
						}

						var i, len;
						var x = 0;
						var y = 0;
						var count = 0;

						for (i = 0, len = elements.length; i < len; ++i) {
							var el = elements[i];
							if (el && el.hasValue()) {
								var pos = el.tooltipPosition();
								x += pos.x;
								y += pos.y;
								++count;
							}
						}

						return {
							x: Math.round(x / count),
							y: Math.round(y / count)
						};
					},

					/**
      * Gets the tooltip position nearest of the item nearest to the event position
      * @function Chart.Tooltip.positioners.nearest
      * @param elements {Chart.Element[]} the tooltip elements
      * @param eventPosition {Point} the position of the event in canvas coordinates
      * @returns {Point} the tooltip position
      */
					nearest: function nearest(elements, eventPosition) {
						var x = eventPosition.x;
						var y = eventPosition.y;

						var nearestElement;
						var minDistance = Number.POSITIVE_INFINITY;
						var i, len;
						for (i = 0, len = elements.length; i < len; ++i) {
							var el = elements[i];
							if (el && el.hasValue()) {
								var center = el.getCenterPoint();
								var d = helpers.distanceBetweenPoints(eventPosition, center);

								if (d < minDistance) {
									minDistance = d;
									nearestElement = el;
								}
							}
						}

						if (nearestElement) {
							var tp = nearestElement.tooltipPosition();
							x = tp.x;
							y = tp.y;
						}

						return {
							x: x,
							y: y
						};
					}
				};
			};
		}, {}], 37: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers,
				    globalOpts = Chart.defaults.global;

				globalOpts.elements.arc = {
					backgroundColor: globalOpts.defaultColor,
					borderColor: '#fff',
					borderWidth: 2
				};

				Chart.elements.Arc = Chart.Element.extend({
					inLabelRange: function inLabelRange(mouseX) {
						var vm = this._view;

						if (vm) {
							return Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2);
						}
						return false;
					},
					inRange: function inRange(chartX, chartY) {
						var vm = this._view;

						if (vm) {
							var pointRelativePosition = helpers.getAngleFromPoint(vm, {
								x: chartX,
								y: chartY
							}),
							    angle = pointRelativePosition.angle,
							    distance = pointRelativePosition.distance;

							// Sanitise angle range
							var startAngle = vm.startAngle;
							var endAngle = vm.endAngle;
							while (endAngle < startAngle) {
								endAngle += 2.0 * Math.PI;
							}
							while (angle > endAngle) {
								angle -= 2.0 * Math.PI;
							}
							while (angle < startAngle) {
								angle += 2.0 * Math.PI;
							}

							// Check if within the range of the open/close angle
							var betweenAngles = angle >= startAngle && angle <= endAngle,
							    withinRadius = distance >= vm.innerRadius && distance <= vm.outerRadius;

							return betweenAngles && withinRadius;
						}
						return false;
					},
					getCenterPoint: function getCenterPoint() {
						var vm = this._view;
						var halfAngle = (vm.startAngle + vm.endAngle) / 2;
						var halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
						return {
							x: vm.x + Math.cos(halfAngle) * halfRadius,
							y: vm.y + Math.sin(halfAngle) * halfRadius
						};
					},
					getArea: function getArea() {
						var vm = this._view;
						return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2));
					},
					tooltipPosition: function tooltipPosition() {
						var vm = this._view;

						var centreAngle = vm.startAngle + (vm.endAngle - vm.startAngle) / 2,
						    rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;
						return {
							x: vm.x + Math.cos(centreAngle) * rangeFromCentre,
							y: vm.y + Math.sin(centreAngle) * rangeFromCentre
						};
					},
					draw: function draw() {

						var ctx = this._chart.ctx,
						    vm = this._view,
						    sA = vm.startAngle,
						    eA = vm.endAngle;

						ctx.beginPath();

						ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
						ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

						ctx.closePath();
						ctx.strokeStyle = vm.borderColor;
						ctx.lineWidth = vm.borderWidth;

						ctx.fillStyle = vm.backgroundColor;

						ctx.fill();
						ctx.lineJoin = 'bevel';

						if (vm.borderWidth) {
							ctx.stroke();
						}
					}
				});
			};
		}, {}], 38: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;
				var globalDefaults = Chart.defaults.global;

				Chart.defaults.global.elements.line = {
					tension: 0.4,
					backgroundColor: globalDefaults.defaultColor,
					borderWidth: 3,
					borderColor: globalDefaults.defaultColor,
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					capBezierPoints: true,
					fill: true // do we fill in the area between the line and its base axis
				};

				Chart.elements.Line = Chart.Element.extend({
					draw: function draw() {
						var me = this;
						var vm = me._view;
						var spanGaps = vm.spanGaps;
						var fillPoint = vm.scaleZero;
						var loop = me._loop;

						// Handle different fill modes for cartesian lines
						if (!loop) {
							if (vm.fill === 'top') {
								fillPoint = vm.scaleTop;
							} else if (vm.fill === 'bottom') {
								fillPoint = vm.scaleBottom;
							}
						}

						var ctx = me._chart.ctx;
						ctx.save();

						// Helper function to draw a line to a point
						function lineToPoint(previousPoint, point) {
							var pointVM = point._view;
							if (point._view.steppedLine === true) {
								ctx.lineTo(pointVM.x, previousPoint._view.y);
								ctx.lineTo(pointVM.x, pointVM.y);
							} else if (point._view.tension === 0) {
								ctx.lineTo(pointVM.x, pointVM.y);
							} else {
								ctx.bezierCurveTo(previousPoint._view.controlPointNextX, previousPoint._view.controlPointNextY, pointVM.controlPointPreviousX, pointVM.controlPointPreviousY, pointVM.x, pointVM.y);
							}
						}

						var points = me._children.slice(); // clone array
						var lastDrawnIndex = -1;

						// If we are looping, adding the first point again
						if (loop && points.length) {
							points.push(points[0]);
						}

						var index, current, previous, currentVM;

						// Fill Line
						if (points.length && vm.fill) {
							ctx.beginPath();

							for (index = 0; index < points.length; ++index) {
								current = points[index];
								previous = helpers.previousItem(points, index);
								currentVM = current._view;

								// First point moves to it's starting position no matter what
								if (index === 0) {
									if (loop) {
										ctx.moveTo(fillPoint.x, fillPoint.y);
									} else {
										ctx.moveTo(currentVM.x, fillPoint);
									}

									if (!currentVM.skip) {
										lastDrawnIndex = index;
										ctx.lineTo(currentVM.x, currentVM.y);
									}
								} else {
									previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

									if (currentVM.skip) {
										// Only do this if this is the first point that is skipped
										if (!spanGaps && lastDrawnIndex === index - 1) {
											if (loop) {
												ctx.lineTo(fillPoint.x, fillPoint.y);
											} else {
												ctx.lineTo(previous._view.x, fillPoint);
											}
										}
									} else {
										if (lastDrawnIndex !== index - 1) {
											// There was a gap and this is the first point after the gap. If we've never drawn a point, this is a special case.
											// If the first data point is NaN, then there is no real gap to skip
											if (spanGaps && lastDrawnIndex !== -1) {
												// We are spanning the gap, so simple draw a line to this point
												lineToPoint(previous, current);
											} else if (loop) {
												ctx.lineTo(currentVM.x, currentVM.y);
											} else {
												ctx.lineTo(currentVM.x, fillPoint);
												ctx.lineTo(currentVM.x, currentVM.y);
											}
										} else {
											// Line to next point
											lineToPoint(previous, current);
										}
										lastDrawnIndex = index;
									}
								}
							}

							if (!loop && lastDrawnIndex !== -1) {
								ctx.lineTo(points[lastDrawnIndex]._view.x, fillPoint);
							}

							ctx.fillStyle = vm.backgroundColor || globalDefaults.defaultColor;
							ctx.closePath();
							ctx.fill();
						}

						// Stroke Line Options
						var globalOptionLineElements = globalDefaults.elements.line;
						ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

						// IE 9 and 10 do not support line dash
						if (ctx.setLineDash) {
							ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
						}

						ctx.lineDashOffset = vm.borderDashOffset || globalOptionLineElements.borderDashOffset;
						ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
						ctx.lineWidth = vm.borderWidth || globalOptionLineElements.borderWidth;
						ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;

						// Stroke Line
						ctx.beginPath();
						lastDrawnIndex = -1;

						for (index = 0; index < points.length; ++index) {
							current = points[index];
							previous = helpers.previousItem(points, index);
							currentVM = current._view;

							// First point moves to it's starting position no matter what
							if (index === 0) {
								if (!currentVM.skip) {
									ctx.moveTo(currentVM.x, currentVM.y);
									lastDrawnIndex = index;
								}
							} else {
								previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

								if (!currentVM.skip) {
									if (lastDrawnIndex !== index - 1 && !spanGaps || lastDrawnIndex === -1) {
										// There was a gap and this is the first point after the gap
										ctx.moveTo(currentVM.x, currentVM.y);
									} else {
										// Line to next point
										lineToPoint(previous, current);
									}
									lastDrawnIndex = index;
								}
							}
						}

						ctx.stroke();
						ctx.restore();
					}
				});
			};
		}, {}], 39: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers,
				    globalOpts = Chart.defaults.global,
				    defaultColor = globalOpts.defaultColor;

				globalOpts.elements.point = {
					radius: 3,
					pointStyle: 'circle',
					backgroundColor: defaultColor,
					borderWidth: 1,
					borderColor: defaultColor,
					// Hover
					hitRadius: 1,
					hoverRadius: 4,
					hoverBorderWidth: 1
				};

				function xRange(mouseX) {
					var vm = this._view;
					return vm ? Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hitRadius, 2) : false;
				}

				function yRange(mouseY) {
					var vm = this._view;
					return vm ? Math.pow(mouseY - vm.y, 2) < Math.pow(vm.radius + vm.hitRadius, 2) : false;
				}

				Chart.elements.Point = Chart.Element.extend({
					inRange: function inRange(mouseX, mouseY) {
						var vm = this._view;
						return vm ? Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2) < Math.pow(vm.hitRadius + vm.radius, 2) : false;
					},

					inLabelRange: xRange,
					inXRange: xRange,
					inYRange: yRange,

					getCenterPoint: function getCenterPoint() {
						var vm = this._view;
						return {
							x: vm.x,
							y: vm.y
						};
					},
					getArea: function getArea() {
						return Math.PI * Math.pow(this._view.radius, 2);
					},
					tooltipPosition: function tooltipPosition() {
						var vm = this._view;
						return {
							x: vm.x,
							y: vm.y,
							padding: vm.radius + vm.borderWidth
						};
					},
					draw: function draw() {
						var vm = this._view;
						var ctx = this._chart.ctx;
						var pointStyle = vm.pointStyle;
						var radius = vm.radius;
						var x = vm.x;
						var y = vm.y;

						if (vm.skip) {
							return;
						}

						ctx.strokeStyle = vm.borderColor || defaultColor;
						ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.point.borderWidth);
						ctx.fillStyle = vm.backgroundColor || defaultColor;

						Chart.canvasHelpers.drawPoint(ctx, pointStyle, radius, x, y);
					}
				});
			};
		}, {}], 40: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var globalOpts = Chart.defaults.global;

				globalOpts.elements.rectangle = {
					backgroundColor: globalOpts.defaultColor,
					borderWidth: 0,
					borderColor: globalOpts.defaultColor,
					borderSkipped: 'bottom'
				};

				function isVertical(bar) {
					return bar._view.width !== undefined;
				}

				/**
     * Helper function to get the bounds of the bar regardless of the orientation
     * @private
     * @param bar {Chart.Element.Rectangle} the bar
     * @return {Bounds} bounds of the bar
     */
				function getBarBounds(bar) {
					var vm = bar._view;
					var x1, x2, y1, y2;

					if (isVertical(bar)) {
						// vertical
						var halfWidth = vm.width / 2;
						x1 = vm.x - halfWidth;
						x2 = vm.x + halfWidth;
						y1 = Math.min(vm.y, vm.base);
						y2 = Math.max(vm.y, vm.base);
					} else {
						// horizontal bar
						var halfHeight = vm.height / 2;
						x1 = Math.min(vm.x, vm.base);
						x2 = Math.max(vm.x, vm.base);
						y1 = vm.y - halfHeight;
						y2 = vm.y + halfHeight;
					}

					return {
						left: x1,
						top: y1,
						right: x2,
						bottom: y2
					};
				}

				Chart.elements.Rectangle = Chart.Element.extend({
					draw: function draw() {
						var ctx = this._chart.ctx;
						var vm = this._view;

						var halfWidth = vm.width / 2,
						    leftX = vm.x - halfWidth,
						    rightX = vm.x + halfWidth,
						    top = vm.base - (vm.base - vm.y),
						    halfStroke = vm.borderWidth / 2;

						// Canvas doesn't allow us to stroke inside the width so we can
						// adjust the sizes to fit if we're setting a stroke on the line
						if (vm.borderWidth) {
							leftX += halfStroke;
							rightX -= halfStroke;
							top += halfStroke;
						}

						ctx.beginPath();
						ctx.fillStyle = vm.backgroundColor;
						ctx.strokeStyle = vm.borderColor;
						ctx.lineWidth = vm.borderWidth;

						// Corner points, from bottom-left to bottom-right clockwise
						// | 1 2 |
						// | 0 3 |
						var corners = [[leftX, vm.base], [leftX, top], [rightX, top], [rightX, vm.base]];

						// Find first (starting) corner with fallback to 'bottom'
						var borders = ['bottom', 'left', 'top', 'right'];
						var startCorner = borders.indexOf(vm.borderSkipped, 0);
						if (startCorner === -1) {
							startCorner = 0;
						}

						function cornerAt(index) {
							return corners[(startCorner + index) % 4];
						}

						// Draw rectangle from 'startCorner'
						var corner = cornerAt(0);
						ctx.moveTo(corner[0], corner[1]);

						for (var i = 1; i < 4; i++) {
							corner = cornerAt(i);
							ctx.lineTo(corner[0], corner[1]);
						}

						ctx.fill();
						if (vm.borderWidth) {
							ctx.stroke();
						}
					},
					height: function height() {
						var vm = this._view;
						return vm.base - vm.y;
					},
					inRange: function inRange(mouseX, mouseY) {
						var inRange = false;

						if (this._view) {
							var bounds = getBarBounds(this);
							inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
						}

						return inRange;
					},
					inLabelRange: function inLabelRange(mouseX, mouseY) {
						var me = this;
						if (!me._view) {
							return false;
						}

						var inRange = false;
						var bounds = getBarBounds(me);

						if (isVertical(me)) {
							inRange = mouseX >= bounds.left && mouseX <= bounds.right;
						} else {
							inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
						}

						return inRange;
					},
					inXRange: function inXRange(mouseX) {
						var bounds = getBarBounds(this);
						return mouseX >= bounds.left && mouseX <= bounds.right;
					},
					inYRange: function inYRange(mouseY) {
						var bounds = getBarBounds(this);
						return mouseY >= bounds.top && mouseY <= bounds.bottom;
					},
					getCenterPoint: function getCenterPoint() {
						var vm = this._view;
						var x, y;
						if (isVertical(this)) {
							x = vm.x;
							y = (vm.y + vm.base) / 2;
						} else {
							x = (vm.x + vm.base) / 2;
							y = vm.y;
						}

						return { x: x, y: y };
					},
					getArea: function getArea() {
						var vm = this._view;
						return vm.width * Math.abs(vm.y - vm.base);
					},
					tooltipPosition: function tooltipPosition() {
						var vm = this._view;
						return {
							x: vm.x,
							y: vm.y
						};
					}
				});
			};
		}, {}], 41: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;
				// Default config for a category scale
				var defaultConfig = {
					position: 'bottom'
				};

				var DatasetScale = Chart.Scale.extend({
					/**
     * Internal function to get the correct labels. If data.xLabels or data.yLabels are defined, use those
     * else fall back to data.labels
     * @private
     */
					getLabels: function getLabels() {
						var data = this.chart.data;
						return (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
					},
					// Implement this so that
					determineDataLimits: function determineDataLimits() {
						var me = this;
						var labels = me.getLabels();
						me.minIndex = 0;
						me.maxIndex = labels.length - 1;
						var findIndex;

						if (me.options.ticks.min !== undefined) {
							// user specified min value
							findIndex = helpers.indexOf(labels, me.options.ticks.min);
							me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
						}

						if (me.options.ticks.max !== undefined) {
							// user specified max value
							findIndex = helpers.indexOf(labels, me.options.ticks.max);
							me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
						}

						me.min = labels[me.minIndex];
						me.max = labels[me.maxIndex];
					},

					buildTicks: function buildTicks() {
						var me = this;
						var labels = me.getLabels();
						// If we are viewing some subset of labels, slice the original array
						me.ticks = me.minIndex === 0 && me.maxIndex === labels.length - 1 ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
					},

					getLabelForIndex: function getLabelForIndex(index, datasetIndex) {
						var me = this;
						var data = me.chart.data;
						var isHorizontal = me.isHorizontal();

						if (data.xLabels && isHorizontal || data.yLabels && !isHorizontal) {
							return me.getRightValue(data.datasets[datasetIndex].data[index]);
						}
						return me.ticks[index];
					},

					// Used to get data value locations.  Value can either be an index or a numerical value
					getPixelForValue: function getPixelForValue(value, index, datasetIndex, includeOffset) {
						var me = this;
						// 1 is added because we need the length but we have the indexes
						var offsetAmt = Math.max(me.maxIndex + 1 - me.minIndex - (me.options.gridLines.offsetGridLines ? 0 : 1), 1);

						if (value !== undefined && isNaN(index)) {
							var labels = me.getLabels();
							var idx = labels.indexOf(value);
							index = idx !== -1 ? idx : index;
						}

						if (me.isHorizontal()) {
							var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
							var valueWidth = innerWidth / offsetAmt;
							var widthOffset = valueWidth * (index - me.minIndex) + me.paddingLeft;

							if (me.options.gridLines.offsetGridLines && includeOffset || me.maxIndex === me.minIndex && includeOffset) {
								widthOffset += valueWidth / 2;
							}

							return me.left + Math.round(widthOffset);
						}
						var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
						var valueHeight = innerHeight / offsetAmt;
						var heightOffset = valueHeight * (index - me.minIndex) + me.paddingTop;

						if (me.options.gridLines.offsetGridLines && includeOffset) {
							heightOffset += valueHeight / 2;
						}

						return me.top + Math.round(heightOffset);
					},
					getPixelForTick: function getPixelForTick(index, includeOffset) {
						return this.getPixelForValue(this.ticks[index], index + this.minIndex, null, includeOffset);
					},
					getValueForPixel: function getValueForPixel(pixel) {
						var me = this;
						var value;
						var offsetAmt = Math.max(me.ticks.length - (me.options.gridLines.offsetGridLines ? 0 : 1), 1);
						var horz = me.isHorizontal();
						var innerDimension = horz ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);
						var valueDimension = innerDimension / offsetAmt;

						pixel -= horz ? me.left : me.top;

						if (me.options.gridLines.offsetGridLines) {
							pixel -= valueDimension / 2;
						}
						pixel -= horz ? me.paddingLeft : me.paddingTop;

						if (pixel <= 0) {
							value = 0;
						} else {
							value = Math.round(pixel / valueDimension);
						}

						return value;
					},
					getBasePixel: function getBasePixel() {
						return this.bottom;
					}
				});

				Chart.scaleService.registerScaleType('category', DatasetScale, defaultConfig);
			};
		}, {}], 42: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				var defaultConfig = {
					position: 'left',
					ticks: {
						callback: Chart.Ticks.formatters.linear
					}
				};

				var LinearScale = Chart.LinearScaleBase.extend({
					determineDataLimits: function determineDataLimits() {
						var me = this;
						var opts = me.options;
						var chart = me.chart;
						var data = chart.data;
						var datasets = data.datasets;
						var isHorizontal = me.isHorizontal();

						function IDMatches(meta) {
							return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
						}

						// First Calculate the range
						me.min = null;
						me.max = null;

						if (opts.stacked) {
							var valuesPerType = {};

							helpers.each(datasets, function (dataset, datasetIndex) {
								var meta = chart.getDatasetMeta(datasetIndex);
								if (valuesPerType[meta.type] === undefined) {
									valuesPerType[meta.type] = {
										positiveValues: [],
										negativeValues: []
									};
								}

								// Store these per type
								var positiveValues = valuesPerType[meta.type].positiveValues;
								var negativeValues = valuesPerType[meta.type].negativeValues;

								if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
									helpers.each(dataset.data, function (rawValue, index) {
										var value = +me.getRightValue(rawValue);
										if (isNaN(value) || meta.data[index].hidden) {
											return;
										}

										positiveValues[index] = positiveValues[index] || 0;
										negativeValues[index] = negativeValues[index] || 0;

										if (opts.relativePoints) {
											positiveValues[index] = 100;
										} else if (value < 0) {
											negativeValues[index] += value;
										} else {
											positiveValues[index] += value;
										}
									});
								}
							});

							helpers.each(valuesPerType, function (valuesForType) {
								var values = valuesForType.positiveValues.concat(valuesForType.negativeValues);
								var minVal = helpers.min(values);
								var maxVal = helpers.max(values);
								me.min = me.min === null ? minVal : Math.min(me.min, minVal);
								me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
							});
						} else {
							helpers.each(datasets, function (dataset, datasetIndex) {
								var meta = chart.getDatasetMeta(datasetIndex);
								if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
									helpers.each(dataset.data, function (rawValue, index) {
										var value = +me.getRightValue(rawValue);
										if (isNaN(value) || meta.data[index].hidden) {
											return;
										}

										if (me.min === null) {
											me.min = value;
										} else if (value < me.min) {
											me.min = value;
										}

										if (me.max === null) {
											me.max = value;
										} else if (value > me.max) {
											me.max = value;
										}
									});
								}
							});
						}

						// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
						this.handleTickRangeOptions();
					},
					getTickLimit: function getTickLimit() {
						var maxTicks;
						var me = this;
						var tickOpts = me.options.ticks;

						if (me.isHorizontal()) {
							maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.width / 50));
						} else {
							// The factor of 2 used to scale the font size has been experimentally determined.
							var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, Chart.defaults.global.defaultFontSize);
							maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.height / (2 * tickFontSize)));
						}

						return maxTicks;
					},
					// Called after the ticks are built. We need
					handleDirectionalChanges: function handleDirectionalChanges() {
						if (!this.isHorizontal()) {
							// We are in a vertical orientation. The top value is the highest. So reverse the array
							this.ticks.reverse();
						}
					},
					getLabelForIndex: function getLabelForIndex(index, datasetIndex) {
						return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
					},
					// Utils
					getPixelForValue: function getPixelForValue(value) {
						// This must be called after fit has been run so that
						// this.left, this.top, this.right, and this.bottom have been defined
						var me = this;
						var paddingLeft = me.paddingLeft;
						var paddingBottom = me.paddingBottom;
						var start = me.start;

						var rightValue = +me.getRightValue(value);
						var pixel;
						var innerDimension;
						var range = me.end - start;

						if (me.isHorizontal()) {
							innerDimension = me.width - (paddingLeft + me.paddingRight);
							pixel = me.left + innerDimension / range * (rightValue - start);
							return Math.round(pixel + paddingLeft);
						}
						innerDimension = me.height - (me.paddingTop + paddingBottom);
						pixel = me.bottom - paddingBottom - innerDimension / range * (rightValue - start);
						return Math.round(pixel);
					},
					getValueForPixel: function getValueForPixel(pixel) {
						var me = this;
						var isHorizontal = me.isHorizontal();
						var paddingLeft = me.paddingLeft;
						var paddingBottom = me.paddingBottom;
						var innerDimension = isHorizontal ? me.width - (paddingLeft + me.paddingRight) : me.height - (me.paddingTop + paddingBottom);
						var offset = (isHorizontal ? pixel - me.left - paddingLeft : me.bottom - paddingBottom - pixel) / innerDimension;
						return me.start + (me.end - me.start) * offset;
					},
					getPixelForTick: function getPixelForTick(index) {
						return this.getPixelForValue(this.ticksAsNumbers[index]);
					}
				});
				Chart.scaleService.registerScaleType('linear', LinearScale, defaultConfig);
			};
		}, {}], 43: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers,
				    noop = helpers.noop;

				Chart.LinearScaleBase = Chart.Scale.extend({
					handleTickRangeOptions: function handleTickRangeOptions() {
						var me = this;
						var opts = me.options;
						var tickOpts = opts.ticks;

						// If we are forcing it to begin at 0, but 0 will already be rendered on the chart,
						// do nothing since that would make the chart weird. If the user really wants a weird chart
						// axis, they can manually override it
						if (tickOpts.beginAtZero) {
							var minSign = helpers.sign(me.min);
							var maxSign = helpers.sign(me.max);

							if (minSign < 0 && maxSign < 0) {
								// move the top up to 0
								me.max = 0;
							} else if (minSign > 0 && maxSign > 0) {
								// move the bottom down to 0
								me.min = 0;
							}
						}

						if (tickOpts.min !== undefined) {
							me.min = tickOpts.min;
						} else if (tickOpts.suggestedMin !== undefined) {
							me.min = Math.min(me.min, tickOpts.suggestedMin);
						}

						if (tickOpts.max !== undefined) {
							me.max = tickOpts.max;
						} else if (tickOpts.suggestedMax !== undefined) {
							me.max = Math.max(me.max, tickOpts.suggestedMax);
						}

						if (me.min === me.max) {
							me.max++;

							if (!tickOpts.beginAtZero) {
								me.min--;
							}
						}
					},
					getTickLimit: noop,
					handleDirectionalChanges: noop,

					buildTicks: function buildTicks() {
						var me = this;
						var opts = me.options;
						var tickOpts = opts.ticks;

						// Figure out what the max number of ticks we can support it is based on the size of
						// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
						// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
						// the graph. Make sure we always have at least 2 ticks
						var maxTicks = me.getTickLimit();
						maxTicks = Math.max(2, maxTicks);

						var numericGeneratorOptions = {
							maxTicks: maxTicks,
							min: tickOpts.min,
							max: tickOpts.max,
							stepSize: helpers.getValueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize)
						};
						var ticks = me.ticks = Chart.Ticks.generators.linear(numericGeneratorOptions, me);

						me.handleDirectionalChanges();

						// At this point, we need to update our max and min given the tick values since we have expanded the
						// range of the scale
						me.max = helpers.max(ticks);
						me.min = helpers.min(ticks);

						if (tickOpts.reverse) {
							ticks.reverse();

							me.start = me.max;
							me.end = me.min;
						} else {
							me.start = me.min;
							me.end = me.max;
						}
					},
					convertTicksToLabels: function convertTicksToLabels() {
						var me = this;
						me.ticksAsNumbers = me.ticks.slice();
						me.zeroLineIndex = me.ticks.indexOf(0);

						Chart.Scale.prototype.convertTicksToLabels.call(me);
					}
				});
			};
		}, {}], 44: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;

				var defaultConfig = {
					position: 'left',

					// label settings
					ticks: {
						callback: Chart.Ticks.formatters.logarithmic
					}
				};

				var LogarithmicScale = Chart.Scale.extend({
					determineDataLimits: function determineDataLimits() {
						var me = this;
						var opts = me.options;
						var tickOpts = opts.ticks;
						var chart = me.chart;
						var data = chart.data;
						var datasets = data.datasets;
						var getValueOrDefault = helpers.getValueOrDefault;
						var isHorizontal = me.isHorizontal();
						function IDMatches(meta) {
							return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
						}

						// Calculate Range
						me.min = null;
						me.max = null;
						me.minNotZero = null;

						if (opts.stacked) {
							var valuesPerType = {};

							helpers.each(datasets, function (dataset, datasetIndex) {
								var meta = chart.getDatasetMeta(datasetIndex);
								if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
									if (valuesPerType[meta.type] === undefined) {
										valuesPerType[meta.type] = [];
									}

									helpers.each(dataset.data, function (rawValue, index) {
										var values = valuesPerType[meta.type];
										var value = +me.getRightValue(rawValue);
										if (isNaN(value) || meta.data[index].hidden) {
											return;
										}

										values[index] = values[index] || 0;

										if (opts.relativePoints) {
											values[index] = 100;
										} else {
											// Don't need to split positive and negative since the log scale can't handle a 0 crossing
											values[index] += value;
										}
									});
								}
							});

							helpers.each(valuesPerType, function (valuesForType) {
								var minVal = helpers.min(valuesForType);
								var maxVal = helpers.max(valuesForType);
								me.min = me.min === null ? minVal : Math.min(me.min, minVal);
								me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
							});
						} else {
							helpers.each(datasets, function (dataset, datasetIndex) {
								var meta = chart.getDatasetMeta(datasetIndex);
								if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
									helpers.each(dataset.data, function (rawValue, index) {
										var value = +me.getRightValue(rawValue);
										if (isNaN(value) || meta.data[index].hidden) {
											return;
										}

										if (me.min === null) {
											me.min = value;
										} else if (value < me.min) {
											me.min = value;
										}

										if (me.max === null) {
											me.max = value;
										} else if (value > me.max) {
											me.max = value;
										}

										if (value !== 0 && (me.minNotZero === null || value < me.minNotZero)) {
											me.minNotZero = value;
										}
									});
								}
							});
						}

						me.min = getValueOrDefault(tickOpts.min, me.min);
						me.max = getValueOrDefault(tickOpts.max, me.max);

						if (me.min === me.max) {
							if (me.min !== 0 && me.min !== null) {
								me.min = Math.pow(10, Math.floor(helpers.log10(me.min)) - 1);
								me.max = Math.pow(10, Math.floor(helpers.log10(me.max)) + 1);
							} else {
								me.min = 1;
								me.max = 10;
							}
						}
					},
					buildTicks: function buildTicks() {
						var me = this;
						var opts = me.options;
						var tickOpts = opts.ticks;

						var generationOptions = {
							min: tickOpts.min,
							max: tickOpts.max
						};
						var ticks = me.ticks = Chart.Ticks.generators.logarithmic(generationOptions, me);

						if (!me.isHorizontal()) {
							// We are in a vertical orientation. The top value is the highest. So reverse the array
							ticks.reverse();
						}

						// At this point, we need to update our max and min given the tick values since we have expanded the
						// range of the scale
						me.max = helpers.max(ticks);
						me.min = helpers.min(ticks);

						if (tickOpts.reverse) {
							ticks.reverse();

							me.start = me.max;
							me.end = me.min;
						} else {
							me.start = me.min;
							me.end = me.max;
						}
					},
					convertTicksToLabels: function convertTicksToLabels() {
						this.tickValues = this.ticks.slice();

						Chart.Scale.prototype.convertTicksToLabels.call(this);
					},
					// Get the correct tooltip label
					getLabelForIndex: function getLabelForIndex(index, datasetIndex) {
						return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
					},
					getPixelForTick: function getPixelForTick(index) {
						return this.getPixelForValue(this.tickValues[index]);
					},
					getPixelForValue: function getPixelForValue(value) {
						var me = this;
						var innerDimension;
						var pixel;

						var start = me.start;
						var newVal = +me.getRightValue(value);
						var range;
						var paddingTop = me.paddingTop;
						var paddingBottom = me.paddingBottom;
						var paddingLeft = me.paddingLeft;
						var opts = me.options;
						var tickOpts = opts.ticks;

						if (me.isHorizontal()) {
							range = helpers.log10(me.end) - helpers.log10(start); // todo: if start === 0
							if (newVal === 0) {
								pixel = me.left + paddingLeft;
							} else {
								innerDimension = me.width - (paddingLeft + me.paddingRight);
								pixel = me.left + innerDimension / range * (helpers.log10(newVal) - helpers.log10(start));
								pixel += paddingLeft;
							}
						} else {
							// Bottom - top since pixels increase downward on a screen
							innerDimension = me.height - (paddingTop + paddingBottom);
							if (start === 0 && !tickOpts.reverse) {
								range = helpers.log10(me.end) - helpers.log10(me.minNotZero);
								if (newVal === start) {
									pixel = me.bottom - paddingBottom;
								} else if (newVal === me.minNotZero) {
									pixel = me.bottom - paddingBottom - innerDimension * 0.02;
								} else {
									pixel = me.bottom - paddingBottom - innerDimension * 0.02 - innerDimension * 0.98 / range * (helpers.log10(newVal) - helpers.log10(me.minNotZero));
								}
							} else if (me.end === 0 && tickOpts.reverse) {
								range = helpers.log10(me.start) - helpers.log10(me.minNotZero);
								if (newVal === me.end) {
									pixel = me.top + paddingTop;
								} else if (newVal === me.minNotZero) {
									pixel = me.top + paddingTop + innerDimension * 0.02;
								} else {
									pixel = me.top + paddingTop + innerDimension * 0.02 + innerDimension * 0.98 / range * (helpers.log10(newVal) - helpers.log10(me.minNotZero));
								}
							} else {
								range = helpers.log10(me.end) - helpers.log10(start);
								innerDimension = me.height - (paddingTop + paddingBottom);
								pixel = me.bottom - paddingBottom - innerDimension / range * (helpers.log10(newVal) - helpers.log10(start));
							}
						}
						return pixel;
					},
					getValueForPixel: function getValueForPixel(pixel) {
						var me = this;
						var range = helpers.log10(me.end) - helpers.log10(me.start);
						var value, innerDimension;

						if (me.isHorizontal()) {
							innerDimension = me.width - (me.paddingLeft + me.paddingRight);
							value = me.start * Math.pow(10, (pixel - me.left - me.paddingLeft) * range / innerDimension);
						} else {
							// todo: if start === 0
							innerDimension = me.height - (me.paddingTop + me.paddingBottom);
							value = Math.pow(10, (me.bottom - me.paddingBottom - pixel) * range / innerDimension) / me.start;
						}
						return value;
					}
				});
				Chart.scaleService.registerScaleType('logarithmic', LogarithmicScale, defaultConfig);
			};
		}, {}], 45: [function (require, module, exports) {
			'use strict';

			module.exports = function (Chart) {

				var helpers = Chart.helpers;
				var globalDefaults = Chart.defaults.global;

				var defaultConfig = {
					display: true,

					// Boolean - Whether to animate scaling the chart from the centre
					animate: true,
					lineArc: false,
					position: 'chartArea',

					angleLines: {
						display: true,
						color: 'rgba(0, 0, 0, 0.1)',
						lineWidth: 1
					},

					// label settings
					ticks: {
						// Boolean - Show a backdrop to the scale label
						showLabelBackdrop: true,

						// String - The colour of the label backdrop
						backdropColor: 'rgba(255,255,255,0.75)',

						// Number - The backdrop padding above & below the label in pixels
						backdropPaddingY: 2,

						// Number - The backdrop padding to the side of the label in pixels
						backdropPaddingX: 2,

						callback: Chart.Ticks.formatters.linear
					},

					pointLabels: {
						// Number - Point label font size in pixels
						fontSize: 10,

						// Function - Used to convert point labels
						callback: function callback(label) {
							return label;
						}
					}
				};

				var LinearRadialScale = Chart.LinearScaleBase.extend({
					getValueCount: function getValueCount() {
						return this.chart.data.labels.length;
					},
					setDimensions: function setDimensions() {
						var me = this;
						var opts = me.options;
						var tickOpts = opts.ticks;
						// Set the unconstrained dimension before label rotation
						me.width = me.maxWidth;
						me.height = me.maxHeight;
						me.xCenter = Math.round(me.width / 2);
						me.yCenter = Math.round(me.height / 2);

						var minSize = helpers.min([me.height, me.width]);
						var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
						me.drawingArea = opts.display ? minSize / 2 - (tickFontSize / 2 + tickOpts.backdropPaddingY) : minSize / 2;
					},
					determineDataLimits: function determineDataLimits() {
						var me = this;
						var chart = me.chart;
						me.min = null;
						me.max = null;

						helpers.each(chart.data.datasets, function (dataset, datasetIndex) {
							if (chart.isDatasetVisible(datasetIndex)) {
								var meta = chart.getDatasetMeta(datasetIndex);

								helpers.each(dataset.data, function (rawValue, index) {
									var value = +me.getRightValue(rawValue);
									if (isNaN(value) || meta.data[index].hidden) {
										return;
									}

									if (me.min === null) {
										me.min = value;
									} else if (value < me.min) {
										me.min = value;
									}

									if (me.max === null) {
										me.max = value;
									} else if (value > me.max) {
										me.max = value;
									}
								});
							}
						});

						// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
						me.handleTickRangeOptions();
					},
					getTickLimit: function getTickLimit() {
						var tickOpts = this.options.ticks;
						var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
						return Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(this.drawingArea / (1.5 * tickFontSize)));
					},
					convertTicksToLabels: function convertTicksToLabels() {
						var me = this;
						Chart.LinearScaleBase.prototype.convertTicksToLabels.call(me);

						// Point labels
						me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me);
					},
					getLabelForIndex: function getLabelForIndex(index, datasetIndex) {
						return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
					},
					fit: function fit() {
						/*
       * Right, this is really confusing and there is a lot of maths going on here
       * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
       *
       * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
       *
       * Solution:
       *
       * We assume the radius of the polygon is half the size of the canvas at first
       * at each index we check if the text overlaps.
       *
       * Where it does, we store that angle and that index.
       *
       * After finding the largest index and angle we calculate how much we need to remove
       * from the shape radius to move the point inwards by that x.
       *
       * We average the left and right distances to get the maximum shape radius that can fit in the box
       * along with labels.
       *
       * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
       * on each side, removing that from the size, halving it and adding the left x protrusion width.
       *
       * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
       * and position it in the most space efficient manner
       *
       * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
       */

						var pointLabels = this.options.pointLabels;
						var pointLabelFontSize = helpers.getValueOrDefault(pointLabels.fontSize, globalDefaults.defaultFontSize);
						var pointLabeFontStyle = helpers.getValueOrDefault(pointLabels.fontStyle, globalDefaults.defaultFontStyle);
						var pointLabeFontFamily = helpers.getValueOrDefault(pointLabels.fontFamily, globalDefaults.defaultFontFamily);
						var pointLabeFont = helpers.fontString(pointLabelFontSize, pointLabeFontStyle, pointLabeFontFamily);

						// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
						// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
						var largestPossibleRadius = helpers.min([this.height / 2 - pointLabelFontSize - 5, this.width / 2]),
						    pointPosition,
						    i,
						    textWidth,
						    halfTextWidth,
						    furthestRight = this.width,
						    furthestRightIndex,
						    furthestRightAngle,
						    furthestLeft = 0,
						    furthestLeftIndex,
						    furthestLeftAngle,
						    xProtrusionLeft,
						    xProtrusionRight,
						    radiusReductionRight,
						    radiusReductionLeft;
						this.ctx.font = pointLabeFont;

						for (i = 0; i < this.getValueCount(); i++) {
							// 5px to space the text slightly out - similar to what we do in the draw function.
							pointPosition = this.getPointPosition(i, largestPossibleRadius);
							textWidth = this.ctx.measureText(this.pointLabels[i] ? this.pointLabels[i] : '').width + 5;

							// Add quarter circle to make degree 0 mean top of circle
							var angleRadians = this.getIndexAngle(i) + Math.PI / 2;
							var angle = angleRadians * 360 / (2 * Math.PI) % 360;

							if (angle === 0 || angle === 180) {
								// At angle 0 and 180, we're at exactly the top/bottom
								// of the radar chart, so text will be aligned centrally, so we'll half it and compare
								// w/left and right text sizes
								halfTextWidth = textWidth / 2;
								if (pointPosition.x + halfTextWidth > furthestRight) {
									furthestRight = pointPosition.x + halfTextWidth;
									furthestRightIndex = i;
								}
								if (pointPosition.x - halfTextWidth < furthestLeft) {
									furthestLeft = pointPosition.x - halfTextWidth;
									furthestLeftIndex = i;
								}
							} else if (angle < 180) {
								// Less than half the values means we'll left align the text
								if (pointPosition.x + textWidth > furthestRight) {
									furthestRight = pointPosition.x + textWidth;
									furthestRightIndex = i;
								}
								// More than half the values means we'll right align the text
							} else if (pointPosition.x - textWidth < furthestLeft) {
								furthestLeft = pointPosition.x - textWidth;
								furthestLeftIndex = i;
							}
						}

						xProtrusionLeft = furthestLeft;
						xProtrusionRight = Math.ceil(furthestRight - this.width);

						furthestRightAngle = this.getIndexAngle(furthestRightIndex);
						furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);

						radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI / 2);
						radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI / 2);

						// Ensure we actually need to reduce the size of the chart
						radiusReductionRight = helpers.isNumber(radiusReductionRight) ? radiusReductionRight : 0;
						radiusReductionLeft = helpers.isNumber(radiusReductionLeft) ? radiusReductionLeft : 0;

						this.drawingArea = Math.round(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2);
						this.setCenterPoint(radiusReductionLeft, radiusReductionRight);
					},
					setCenterPoint: function setCenterPoint(leftMovement, rightMovement) {
						var me = this;
						var maxRight = me.width - rightMovement - me.drawingArea,
						    maxLeft = leftMovement + me.drawingArea;

						me.xCenter = Math.round((maxLeft + maxRight) / 2 + me.left);
						// Always vertically in the centre as the text height doesn't change
						me.yCenter = Math.round(me.height / 2 + me.top);
					},

					getIndexAngle: function getIndexAngle(index) {
						var angleMultiplier = Math.PI * 2 / this.getValueCount();
						var startAngle = this.chart.options && this.chart.options.startAngle ? this.chart.options.startAngle : 0;

						var startAngleRadians = startAngle * Math.PI * 2 / 360;

						// Start from the top instead of right, so remove a quarter of the circle
						return index * angleMultiplier - Math.PI / 2 + startAngleRadians;
					},
					getDistanceFromCenterForValue: function getDistanceFromCenterForValue(value) {
						var me = this;

						if (value === null) {
							return 0; // null always in center
						}

						// Take into account half font size + the yPadding of the top value
						var scalingFactor = me.drawingArea / (me.max - me.min);
						if (me.options.reverse) {
							return (me.max - value) * scalingFactor;
						}
						return (value - me.min) * scalingFactor;
					},
					getPointPosition: function getPointPosition(index, distanceFromCenter) {
						var me = this;
						var thisAngle = me.getIndexAngle(index);
						return {
							x: Math.round(Math.cos(thisAngle) * distanceFromCenter) + me.xCenter,
							y: Math.round(Math.sin(thisAngle) * distanceFromCenter) + me.yCenter
						};
					},
					getPointPositionForValue: function getPointPositionForValue(index, value) {
						return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
					},

					getBasePosition: function getBasePosition() {
						var me = this;
						var min = me.min;
						var max = me.max;

						return me.getPointPositionForValue(0, me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0);
					},

					draw: function draw() {
						var me = this;
						var opts = me.options;
						var gridLineOpts = opts.gridLines;
						var tickOpts = opts.ticks;
						var angleLineOpts = opts.angleLines;
						var pointLabelOpts = opts.pointLabels;
						var getValueOrDefault = helpers.getValueOrDefault;

						if (opts.display) {
							var ctx = me.ctx;

							// Tick Font
							var tickFontSize = getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
							var tickFontStyle = getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
							var tickFontFamily = getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
							var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

							helpers.each(me.ticks, function (label, index) {
								// Don't draw a centre value (if it is minimum)
								if (index > 0 || opts.reverse) {
									var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);
									var yHeight = me.yCenter - yCenterOffset;

									// Draw circular lines around the scale
									if (gridLineOpts.display && index !== 0) {
										ctx.strokeStyle = helpers.getValueAtIndexOrDefault(gridLineOpts.color, index - 1);
										ctx.lineWidth = helpers.getValueAtIndexOrDefault(gridLineOpts.lineWidth, index - 1);

										if (opts.lineArc) {
											// Draw circular arcs between the points
											ctx.beginPath();
											ctx.arc(me.xCenter, me.yCenter, yCenterOffset, 0, Math.PI * 2);
											ctx.closePath();
											ctx.stroke();
										} else {
											// Draw straight lines connecting each index
											ctx.beginPath();
											for (var i = 0; i < me.getValueCount(); i++) {
												var pointPosition = me.getPointPosition(i, yCenterOffset);
												if (i === 0) {
													ctx.moveTo(pointPosition.x, pointPosition.y);
												} else {
													ctx.lineTo(pointPosition.x, pointPosition.y);
												}
											}
											ctx.closePath();
											ctx.stroke();
										}
									}

									if (tickOpts.display) {
										var tickFontColor = getValueOrDefault(tickOpts.fontColor, globalDefaults.defaultFontColor);
										ctx.font = tickLabelFont;

										if (tickOpts.showLabelBackdrop) {
											var labelWidth = ctx.measureText(label).width;
											ctx.fillStyle = tickOpts.backdropColor;
											ctx.fillRect(me.xCenter - labelWidth / 2 - tickOpts.backdropPaddingX, yHeight - tickFontSize / 2 - tickOpts.backdropPaddingY, labelWidth + tickOpts.backdropPaddingX * 2, tickFontSize + tickOpts.backdropPaddingY * 2);
										}

										ctx.textAlign = 'center';
										ctx.textBaseline = 'middle';
										ctx.fillStyle = tickFontColor;
										ctx.fillText(label, me.xCenter, yHeight);
									}
								}
							});

							if (!opts.lineArc) {
								ctx.lineWidth = angleLineOpts.lineWidth;
								ctx.strokeStyle = angleLineOpts.color;

								var outerDistance = me.getDistanceFromCenterForValue(opts.reverse ? me.min : me.max);

								// Point Label Font
								var pointLabelFontSize = getValueOrDefault(pointLabelOpts.fontSize, globalDefaults.defaultFontSize);
								var pointLabeFontStyle = getValueOrDefault(pointLabelOpts.fontStyle, globalDefaults.defaultFontStyle);
								var pointLabeFontFamily = getValueOrDefault(pointLabelOpts.fontFamily, globalDefaults.defaultFontFamily);
								var pointLabeFont = helpers.fontString(pointLabelFontSize, pointLabeFontStyle, pointLabeFontFamily);

								for (var i = me.getValueCount() - 1; i >= 0; i--) {
									if (angleLineOpts.display) {
										var outerPosition = me.getPointPosition(i, outerDistance);
										ctx.beginPath();
										ctx.moveTo(me.xCenter, me.yCenter);
										ctx.lineTo(outerPosition.x, outerPosition.y);
										ctx.stroke();
										ctx.closePath();
									}
									// Extra 3px out for some label spacing
									var pointLabelPosition = me.getPointPosition(i, outerDistance + 5);

									// Keep this in loop since we may support array properties here
									var pointLabelFontColor = getValueOrDefault(pointLabelOpts.fontColor, globalDefaults.defaultFontColor);
									ctx.font = pointLabeFont;
									ctx.fillStyle = pointLabelFontColor;

									var pointLabels = me.pointLabels;

									// Add quarter circle to make degree 0 mean top of circle
									var angleRadians = this.getIndexAngle(i) + Math.PI / 2;
									var angle = angleRadians * 360 / (2 * Math.PI) % 360;

									if (angle === 0 || angle === 180) {
										ctx.textAlign = 'center';
									} else if (angle < 180) {
										ctx.textAlign = 'left';
									} else {
										ctx.textAlign = 'right';
									}

									// Set the correct text baseline based on outer positioning
									if (angle === 90 || angle === 270) {
										ctx.textBaseline = 'middle';
									} else if (angle > 270 || angle < 90) {
										ctx.textBaseline = 'bottom';
									} else {
										ctx.textBaseline = 'top';
									}

									ctx.fillText(pointLabels[i] ? pointLabels[i] : '', pointLabelPosition.x, pointLabelPosition.y);
								}
							}
						}
					}
				});
				Chart.scaleService.registerScaleType('radialLinear', LinearRadialScale, defaultConfig);
			};
		}, {}], 46: [function (require, module, exports) {
			/* global window: false */
			'use strict';

			var moment = require(1);
			moment = typeof moment === 'function' ? moment : window.moment;

			module.exports = function (Chart) {

				var helpers = Chart.helpers;
				var time = {
					units: [{
						name: 'millisecond',
						steps: [1, 2, 5, 10, 20, 50, 100, 250, 500]
					}, {
						name: 'second',
						steps: [1, 2, 5, 10, 30]
					}, {
						name: 'minute',
						steps: [1, 2, 5, 10, 30]
					}, {
						name: 'hour',
						steps: [1, 2, 3, 6, 12]
					}, {
						name: 'day',
						steps: [1, 2, 5]
					}, {
						name: 'week',
						maxStep: 4
					}, {
						name: 'month',
						maxStep: 3
					}, {
						name: 'quarter',
						maxStep: 4
					}, {
						name: 'year',
						maxStep: false
					}]
				};

				var defaultConfig = {
					position: 'bottom',

					time: {
						parser: false, // false == a pattern string from http://momentjs.com/docs/#/parsing/string-format/ or a custom callback that converts its argument to a moment
						format: false, // DEPRECATED false == date objects, moment object, callback or a pattern string from http://momentjs.com/docs/#/parsing/string-format/
						unit: false, // false == automatic or override with week, month, year, etc.
						round: false, // none, or override with week, month, year, etc.
						displayFormat: false, // DEPRECATED
						isoWeekday: false, // override week start day - see http://momentjs.com/docs/#/get-set/iso-weekday/
						minUnit: 'millisecond',

						// defaults to unit's corresponding unitFormat below or override using pattern string from http://momentjs.com/docs/#/displaying/format/
						displayFormats: {
							millisecond: 'h:mm:ss.SSS a', // 11:20:01.123 AM,
							second: 'h:mm:ss a', // 11:20:01 AM
							minute: 'h:mm:ss a', // 11:20:01 AM
							hour: 'MMM D, hA', // Sept 4, 5PM
							day: 'll', // Sep 4 2015
							week: 'll', // Week 46, or maybe "[W]WW - YYYY" ?
							month: 'MMM YYYY', // Sept 2015
							quarter: '[Q]Q - YYYY', // Q3
							year: 'YYYY' // 2015
						}
					},
					ticks: {
						autoSkip: false
					}
				};

				var TimeScale = Chart.Scale.extend({
					initialize: function initialize() {
						if (!moment) {
							throw new Error('Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com');
						}

						Chart.Scale.prototype.initialize.call(this);
					},
					getLabelMoment: function getLabelMoment(datasetIndex, index) {
						if (datasetIndex === null || index === null) {
							return null;
						}

						if (typeof this.labelMoments[datasetIndex] !== 'undefined') {
							return this.labelMoments[datasetIndex][index];
						}

						return null;
					},
					getLabelDiff: function getLabelDiff(datasetIndex, index) {
						var me = this;
						if (datasetIndex === null || index === null) {
							return null;
						}

						if (me.labelDiffs === undefined) {
							me.buildLabelDiffs();
						}

						if (typeof me.labelDiffs[datasetIndex] !== 'undefined') {
							return me.labelDiffs[datasetIndex][index];
						}

						return null;
					},
					getMomentStartOf: function getMomentStartOf(tick) {
						var me = this;
						if (me.options.time.unit === 'week' && me.options.time.isoWeekday !== false) {
							return tick.clone().startOf('isoWeek').isoWeekday(me.options.time.isoWeekday);
						}
						return tick.clone().startOf(me.tickUnit);
					},
					determineDataLimits: function determineDataLimits() {
						var me = this;
						me.labelMoments = [];

						// Only parse these once. If the dataset does not have data as x,y pairs, we will use
						// these
						var scaleLabelMoments = [];
						if (me.chart.data.labels && me.chart.data.labels.length > 0) {
							helpers.each(me.chart.data.labels, function (label) {
								var labelMoment = me.parseTime(label);

								if (labelMoment.isValid()) {
									if (me.options.time.round) {
										labelMoment.startOf(me.options.time.round);
									}
									scaleLabelMoments.push(labelMoment);
								}
							}, me);

							me.firstTick = moment.min.call(me, scaleLabelMoments);
							me.lastTick = moment.max.call(me, scaleLabelMoments);
						} else {
							me.firstTick = null;
							me.lastTick = null;
						}

						helpers.each(me.chart.data.datasets, function (dataset, datasetIndex) {
							var momentsForDataset = [];
							var datasetVisible = me.chart.isDatasetVisible(datasetIndex);

							if (_typeof(dataset.data[0]) === 'object' && dataset.data[0] !== null) {
								helpers.each(dataset.data, function (value) {
									var labelMoment = me.parseTime(me.getRightValue(value));

									if (labelMoment.isValid()) {
										if (me.options.time.round) {
											labelMoment.startOf(me.options.time.round);
										}
										momentsForDataset.push(labelMoment);

										if (datasetVisible) {
											// May have gone outside the scale ranges, make sure we keep the first and last ticks updated
											me.firstTick = me.firstTick !== null ? moment.min(me.firstTick, labelMoment) : labelMoment;
											me.lastTick = me.lastTick !== null ? moment.max(me.lastTick, labelMoment) : labelMoment;
										}
									}
								}, me);
							} else {
								// We have no labels. Use the ones from the scale
								momentsForDataset = scaleLabelMoments;
							}

							me.labelMoments.push(momentsForDataset);
						}, me);

						// Set these after we've done all the data
						if (me.options.time.min) {
							me.firstTick = me.parseTime(me.options.time.min);
						}

						if (me.options.time.max) {
							me.lastTick = me.parseTime(me.options.time.max);
						}

						// We will modify these, so clone for later
						me.firstTick = (me.firstTick || moment()).clone();
						me.lastTick = (me.lastTick || moment()).clone();
					},
					buildLabelDiffs: function buildLabelDiffs() {
						var me = this;
						me.labelDiffs = [];
						var scaleLabelDiffs = [];
						// Parse common labels once
						if (me.chart.data.labels && me.chart.data.labels.length > 0) {
							helpers.each(me.chart.data.labels, function (label) {
								var labelMoment = me.parseTime(label);

								if (labelMoment.isValid()) {
									if (me.options.time.round) {
										labelMoment.startOf(me.options.time.round);
									}
									scaleLabelDiffs.push(labelMoment.diff(me.firstTick, me.tickUnit, true));
								}
							}, me);
						}

						helpers.each(me.chart.data.datasets, function (dataset) {
							var diffsForDataset = [];

							if (_typeof(dataset.data[0]) === 'object' && dataset.data[0] !== null) {
								helpers.each(dataset.data, function (value) {
									var labelMoment = me.parseTime(me.getRightValue(value));

									if (labelMoment.isValid()) {
										if (me.options.time.round) {
											labelMoment.startOf(me.options.time.round);
										}
										diffsForDataset.push(labelMoment.diff(me.firstTick, me.tickUnit, true));
									}
								}, me);
							} else {
								// We have no labels. Use common ones
								diffsForDataset = scaleLabelDiffs;
							}

							me.labelDiffs.push(diffsForDataset);
						}, me);
					},
					buildTicks: function buildTicks() {
						var me = this;

						me.ctx.save();
						var tickFontSize = helpers.getValueOrDefault(me.options.ticks.fontSize, Chart.defaults.global.defaultFontSize);
						var tickFontStyle = helpers.getValueOrDefault(me.options.ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
						var tickFontFamily = helpers.getValueOrDefault(me.options.ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
						var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
						me.ctx.font = tickLabelFont;

						me.ticks = [];
						me.unitScale = 1; // How much we scale the unit by, ie 2 means 2x unit per step
						me.scaleSizeInUnits = 0; // How large the scale is in the base unit (seconds, minutes, etc)

						// Set unit override if applicable
						if (me.options.time.unit) {
							me.tickUnit = me.options.time.unit || 'day';
							me.displayFormat = me.options.time.displayFormats[me.tickUnit];
							me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
							me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, 1);
						} else {
							// Determine the smallest needed unit of the time
							var innerWidth = me.isHorizontal() ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);

							// Crude approximation of what the label length might be
							var tempFirstLabel = me.tickFormatFunction(me.firstTick, 0, []);
							var tickLabelWidth = me.ctx.measureText(tempFirstLabel).width;
							var cosRotation = Math.cos(helpers.toRadians(me.options.ticks.maxRotation));
							var sinRotation = Math.sin(helpers.toRadians(me.options.ticks.maxRotation));
							tickLabelWidth = tickLabelWidth * cosRotation + tickFontSize * sinRotation;
							var labelCapacity = innerWidth / tickLabelWidth;

							// Start as small as possible
							me.tickUnit = me.options.time.minUnit;
							me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
							me.displayFormat = me.options.time.displayFormats[me.tickUnit];

							var unitDefinitionIndex = 0;
							var unitDefinition = time.units[unitDefinitionIndex];

							// While we aren't ideal and we don't have units left
							while (unitDefinitionIndex < time.units.length) {
								// Can we scale this unit. If `false` we can scale infinitely
								me.unitScale = 1;

								if (helpers.isArray(unitDefinition.steps) && Math.ceil(me.scaleSizeInUnits / labelCapacity) < helpers.max(unitDefinition.steps)) {
									// Use one of the predefined steps
									for (var idx = 0; idx < unitDefinition.steps.length; ++idx) {
										if (unitDefinition.steps[idx] >= Math.ceil(me.scaleSizeInUnits / labelCapacity)) {
											me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, unitDefinition.steps[idx]);
											break;
										}
									}

									break;
								} else if (unitDefinition.maxStep === false || Math.ceil(me.scaleSizeInUnits / labelCapacity) < unitDefinition.maxStep) {
									// We have a max step. Scale this unit
									me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, Math.ceil(me.scaleSizeInUnits / labelCapacity));
									break;
								} else {
									// Move to the next unit up
									++unitDefinitionIndex;
									unitDefinition = time.units[unitDefinitionIndex];

									me.tickUnit = unitDefinition.name;
									var leadingUnitBuffer = me.firstTick.diff(me.getMomentStartOf(me.firstTick), me.tickUnit, true);
									var trailingUnitBuffer = me.getMomentStartOf(me.lastTick.clone().add(1, me.tickUnit)).diff(me.lastTick, me.tickUnit, true);
									me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true) + leadingUnitBuffer + trailingUnitBuffer;
									me.displayFormat = me.options.time.displayFormats[unitDefinition.name];
								}
							}
						}

						var roundedStart;

						// Only round the first tick if we have no hard minimum
						if (!me.options.time.min) {
							me.firstTick = me.getMomentStartOf(me.firstTick);
							roundedStart = me.firstTick;
						} else {
							roundedStart = me.getMomentStartOf(me.firstTick);
						}

						// Only round the last tick if we have no hard maximum
						if (!me.options.time.max) {
							var roundedEnd = me.getMomentStartOf(me.lastTick);
							var delta = roundedEnd.diff(me.lastTick, me.tickUnit, true);
							if (delta < 0) {
								// Do not use end of because we need me to be in the next time unit
								me.lastTick = me.getMomentStartOf(me.lastTick.add(1, me.tickUnit));
							} else if (delta >= 0) {
								me.lastTick = roundedEnd;
							}

							me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
						}

						// Tick displayFormat override
						if (me.options.time.displayFormat) {
							me.displayFormat = me.options.time.displayFormat;
						}

						// first tick. will have been rounded correctly if options.time.min is not specified
						me.ticks.push(me.firstTick.clone());

						// For every unit in between the first and last moment, create a moment and add it to the ticks tick
						for (var i = 1; i <= me.scaleSizeInUnits; ++i) {
							var newTick = roundedStart.clone().add(i, me.tickUnit);

							// Are we greater than the max time
							if (me.options.time.max && newTick.diff(me.lastTick, me.tickUnit, true) >= 0) {
								break;
							}

							if (i % me.unitScale === 0) {
								me.ticks.push(newTick);
							}
						}

						// Always show the right tick
						var diff = me.ticks[me.ticks.length - 1].diff(me.lastTick, me.tickUnit);
						if (diff !== 0 || me.scaleSizeInUnits === 0) {
							// this is a weird case. If the <max> option is the same as the end option, we can't just diff the times because the tick was created from the roundedStart
							// but the last tick was not rounded.
							if (me.options.time.max) {
								me.ticks.push(me.lastTick.clone());
								me.scaleSizeInUnits = me.lastTick.diff(me.ticks[0], me.tickUnit, true);
							} else {
								me.ticks.push(me.lastTick.clone());
								me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
							}
						}

						me.ctx.restore();

						// Invalidate label diffs cache
						me.labelDiffs = undefined;
					},
					// Get tooltip label
					getLabelForIndex: function getLabelForIndex(index, datasetIndex) {
						var me = this;
						var label = me.chart.data.labels && index < me.chart.data.labels.length ? me.chart.data.labels[index] : '';

						if (_typeof(me.chart.data.datasets[datasetIndex].data[0]) === 'object') {
							label = me.getRightValue(me.chart.data.datasets[datasetIndex].data[index]);
						}

						// Format nicely
						if (me.options.time.tooltipFormat) {
							label = me.parseTime(label).format(me.options.time.tooltipFormat);
						}

						return label;
					},
					// Function to format an individual tick mark
					tickFormatFunction: function tickFormatFunction(tick, index, ticks) {
						var formattedTick = tick.format(this.displayFormat);
						var tickOpts = this.options.ticks;
						var callback = helpers.getValueOrDefault(tickOpts.callback, tickOpts.userCallback);

						if (callback) {
							return callback(formattedTick, index, ticks);
						}
						return formattedTick;
					},
					convertTicksToLabels: function convertTicksToLabels() {
						var me = this;
						me.tickMoments = me.ticks;
						me.ticks = me.ticks.map(me.tickFormatFunction, me);
					},
					getPixelForValue: function getPixelForValue(value, index, datasetIndex) {
						var me = this;
						var offset = null;
						if (index !== undefined && datasetIndex !== undefined) {
							offset = me.getLabelDiff(datasetIndex, index);
						}

						if (offset === null) {
							if (!value || !value.isValid) {
								// not already a moment object
								value = me.parseTime(me.getRightValue(value));
							}
							if (value && value.isValid && value.isValid()) {
								offset = value.diff(me.firstTick, me.tickUnit, true);
							}
						}

						if (offset !== null) {
							var decimal = offset !== 0 ? offset / me.scaleSizeInUnits : offset;

							if (me.isHorizontal()) {
								var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
								var valueOffset = innerWidth * decimal + me.paddingLeft;

								return me.left + Math.round(valueOffset);
							}
							var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
							var heightOffset = innerHeight * decimal + me.paddingTop;

							return me.top + Math.round(heightOffset);
						}
					},
					getPixelForTick: function getPixelForTick(index) {
						return this.getPixelForValue(this.tickMoments[index], null, null);
					},
					getValueForPixel: function getValueForPixel(pixel) {
						var me = this;
						var innerDimension = me.isHorizontal() ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);
						var offset = (pixel - (me.isHorizontal() ? me.left + me.paddingLeft : me.top + me.paddingTop)) / innerDimension;
						offset *= me.scaleSizeInUnits;
						return me.firstTick.clone().add(moment.duration(offset, me.tickUnit).asSeconds(), 'seconds');
					},
					parseTime: function parseTime(label) {
						var me = this;
						if (typeof me.options.time.parser === 'string') {
							return moment(label, me.options.time.parser);
						}
						if (typeof me.options.time.parser === 'function') {
							return me.options.time.parser(label);
						}
						// Date objects
						if (typeof label.getMonth === 'function' || typeof label === 'number') {
							return moment(label);
						}
						// Moment support
						if (label.isValid && label.isValid()) {
							return label;
						}
						// Custom parsing (return an instance of moment)
						if (typeof me.options.time.format !== 'string' && me.options.time.format.call) {
							console.warn('options.time.format is deprecated and replaced by options.time.parser. See http://nnnick.github.io/Chart.js/docs-v2/#scales-time-scale');
							return me.options.time.format(label);
						}
						// Moment format parsing
						return moment(label, me.options.time.format);
					}
				});
				Chart.scaleService.registerScaleType('time', TimeScale, defaultConfig);
			};
		}, { "1": 1 }] }, {}, [7])(7);
});

/* =========================================================
 * bootstrap-datepicker.js
 * Repo: https://github.com/eternicode/bootstrap-datepicker/
 * Demo: http://eternicode.github.io/bootstrap-datepicker/
 * Docs: http://bootstrap-datepicker.readthedocs.org/
 * Forked from http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Started by Stefan Petre; improvements by Andrew Rowls + contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function ($, undefined) {

	function UTCDate() {
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday() {
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function isUTCEquals(date1, date2) {
		return date1.getUTCFullYear() === date2.getUTCFullYear() && date1.getUTCMonth() === date2.getUTCMonth() && date1.getUTCDate() === date2.getUTCDate();
	}
	function alias(method) {
		return function () {
			return this[method].apply(this, arguments);
		};
	}

	var DateArray = function () {
		var extras = {
			get: function get(i) {
				return this.slice(i)[0];
			},
			contains: function contains(d) {
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i = 0, l = this.length; i < l; i++) {
					if (this[i].valueOf() === val) return i;
				}return -1;
			},
			remove: function remove(i) {
				this.splice(i, 1);
			},
			replace: function replace(new_array) {
				if (!new_array) return;
				if (!$.isArray(new_array)) new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function clear() {
				this.length = 0;
			},
			copy: function copy() {
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function () {
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	}();

	// Picker object

	var Datepicker = function Datepicker(element, options) {
		this._process_options(options);

		this.dates = new DateArray();
		this.viewDate = this.o.defaultViewDate;
		this.focusDate = null;

		this.element = $(element);
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0) this.component = false;

		this.picker = $(DPGlobal.template);
		this._buildEvents();
		this._attachEvents();

		if (this.isInline) {
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		} else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl) {
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks) this.picker.find('tfoot .today, tfoot .clear').attr('colspan', function (i, val) {
			return parseInt(val) + 1;
		});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
		this.setDatesDisabled(this.o.datesDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if (this.isInline) {
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_process_options: function _process_options(opts) {
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]) {
				lang = lang.split('-')[0];
				if (!dates[lang]) lang = defaults.language;
			}
			o.language = lang;

			switch (o.startView) {
				case 2:
				case 'decade':
					o.startView = 2;
					break;
				case 1:
				case 'year':
					o.startView = 1;
					break;
				default:
					o.startView = 0;
			}

			switch (o.minViewMode) {
				case 1:
				case 'months':
					o.minViewMode = 1;
					break;
				case 2:
				case 'years':
					o.minViewMode = 2;
					break;
				default:
					o.minViewMode = 0;
			}

			o.startView = Math.max(o.startView, o.minViewMode);

			// true, false, or Number > 0
			if (o.multidate !== true) {
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false) o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = (o.weekStart + 6) % 7;

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity) {
				if (!!o.startDate) {
					if (o.startDate instanceof Date) o.startDate = this._local_to_utc(this._zero_time(o.startDate));else o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
				} else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity) {
				if (!!o.endDate) {
					if (o.endDate instanceof Date) o.endDate = this._local_to_utc(this._zero_time(o.endDate));else o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
				} else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled || [];
			if (!$.isArray(o.daysOfWeekDisabled)) o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});

			o.datesDisabled = o.datesDisabled || [];
			if (!$.isArray(o.datesDisabled)) {
				var datesDisabled = [];
				datesDisabled.push(DPGlobal.parseDate(o.datesDisabled, format, o.language));
				o.datesDisabled = datesDisabled;
			}
			o.datesDisabled = $.map(o.datesDisabled, function (d) {
				return DPGlobal.parseDate(d, format, o.language);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
			    _plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function (word) {
				return (/^auto|left|right|top|bottom$/.test(word)
				);
			});
			o.orientation = { x: 'auto', y: 'auto' };
			if (!_plc || _plc === 'auto') ; // no action
			else if (plc.length === 1) {
					switch (plc[0]) {
						case 'top':
						case 'bottom':
							o.orientation.y = plc[0];
							break;
						case 'left':
						case 'right':
							o.orientation.x = plc[0];
							break;
					}
				} else {
					_plc = $.grep(plc, function (word) {
						return (/^left|right$/.test(word)
						);
					});
					o.orientation.x = _plc[0] || 'auto';

					_plc = $.grep(plc, function (word) {
						return (/^top|bottom$/.test(word)
						);
					});
					o.orientation.y = _plc[0] || 'auto';
				}
			if (o.defaultViewDate) {
				var year = o.defaultViewDate.year || new Date().getFullYear();
				var month = o.defaultViewDate.month || 0;
				var day = o.defaultViewDate.day || 1;
				o.defaultViewDate = UTCDate(year, month, day);
			} else {
				o.defaultViewDate = UTCToday();
			}
			o.showOnFocus = o.showOnFocus !== undefined ? o.showOnFocus : true;
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function _applyEvents(evs) {
			for (var i = 0, el, ch, ev; i < evs.length; i++) {
				el = evs[i][0];
				if (evs[i].length === 2) {
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3) {
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function _unapplyEvents(evs) {
			for (var i = 0, el, ev, ch; i < evs.length; i++) {
				el = evs[i][0];
				if (evs[i].length === 2) {
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3) {
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function _buildEvents() {
			var events = {
				keyup: $.proxy(function (e) {
					if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1) this.update();
				}, this),
				keydown: $.proxy(this.keydown, this)
			};

			if (this.o.showOnFocus === true) {
				events.focus = $.proxy(this.show, this);
			}

			if (this.isInput) {
				// single input
				this._events = [[this.element, events]];
			} else if (this.component && this.hasInput) {
				// component: input + button
				this._events = [
				// For components that are not readonly, allow keyboard nav
				[this.element.find('input'), events], [this.component, {
					click: $.proxy(this.show, this)
				}]];
			} else if (this.element.is('div')) {
				// inline datepicker
				this.isInline = true;
			} else {
				this._events = [[this.element, {
					click: $.proxy(this.show, this)
				}]];
			}
			this._events.push(
			// Component: listen for blur on element descendants
			[this.element, '*', {
				blur: $.proxy(function (e) {
					this._focused_from = e.target;
				}, this)
			}],
			// Input: listen for blur on element
			[this.element, {
				blur: $.proxy(function (e) {
					this._focused_from = e.target;
				}, this)
			}]);

			this._secondaryEvents = [[this.picker, {
				click: $.proxy(this.click, this)
			}], [$(window), {
				resize: $.proxy(this.place, this)
			}], [$(document), {
				'mousedown touchstart': $.proxy(function (e) {
					// Clicked outside the datepicker, hide it
					if (!(this.element.is(e.target) || this.element.find(e.target).length || this.picker.is(e.target) || this.picker.find(e.target).length)) {
						this.hide();
					}
				}, this)
			}]];
		},
		_attachEvents: function _attachEvents() {
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function _detachEvents() {
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function _attachSecondaryEvents() {
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function _detachSecondaryEvents() {
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function _trigger(event, altdate) {
			var date = altdate || this.dates.get(-1),
			    local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function (ix, format) {
					if (arguments.length === 0) {
						ix = this.dates.length - 1;
						format = this.o.format;
					} else if (typeof ix === 'string') {
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function show() {
			if (this.element.attr('readonly')) return;
			if (!this.isInline) this.picker.appendTo(this.o.container);
			this.place();
			this.picker.show();
			this._attachSecondaryEvents();
			this._trigger('show');
			if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
				$(this.element).blur();
			}
			return this;
		},

		hide: function hide() {
			if (this.isInline) return this;
			if (!this.picker.is(':visible')) return this;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find('input').val())) this.setValue();
			this._trigger('hide');
			return this;
		},

		remove: function remove() {
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput) {
				delete this.element.data().date;
			}
			return this;
		},

		_utc_to_local: function _utc_to_local(utc) {
			return utc && new Date(utc.getTime() + utc.getTimezoneOffset() * 60000);
		},
		_local_to_utc: function _local_to_utc(local) {
			return local && new Date(local.getTime() - local.getTimezoneOffset() * 60000);
		},
		_zero_time: function _zero_time(local) {
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function _zero_utc_time(utc) {
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function getDates() {
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function getUTCDates() {
			return $.map(this.dates, function (d) {
				return new Date(d);
			});
		},

		getDate: function getDate() {
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function getUTCDate() {
			var selected_date = this.dates.get(-1);
			if (typeof selected_date !== 'undefined') {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		clearDates: function clearDates() {
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}

			if (element) {
				element.val('').change();
			}

			this.update();
			this._trigger('changeDate');

			if (this.o.autoclose) {
				this.hide();
			}
		},
		setDates: function setDates() {
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setUTCDates: function setUTCDates() {
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),

		setValue: function setValue() {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component) {
					this.element.find('input').val(formatted).change();
				}
			} else {
				this.element.val(formatted).change();
			}
			return this;
		},

		getFormattedDate: function getFormattedDate(format) {
			if (format === undefined) format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function (d) {
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		setStartDate: function setStartDate(startDate) {
			this._process_options({ startDate: startDate });
			this.update();
			this.updateNavArrows();
			return this;
		},

		setEndDate: function setEndDate(endDate) {
			this._process_options({ endDate: endDate });
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function setDaysOfWeekDisabled(daysOfWeekDisabled) {
			this._process_options({ daysOfWeekDisabled: daysOfWeekDisabled });
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDatesDisabled: function setDatesDisabled(datesDisabled) {
			this._process_options({ datesDisabled: datesDisabled });
			this.update();
			this.updateNavArrows();
		},

		place: function place() {
			if (this.isInline) return this;
			var calendarWidth = this.picker.outerWidth(),
			    calendarHeight = this.picker.outerHeight(),
			    visualPadding = 10,
			    windowWidth = $(this.o.container).width(),
			    windowHeight = $(this.o.container).height(),
			    scrollTop = $(this.o.container).scrollTop(),
			    appendOffset = $(this.o.container).offset();

			var parentsZindex = [];
			this.element.parents().each(function () {
				var itemZIndex = $(this).css('z-index');
				if (itemZIndex !== 'auto' && itemZIndex !== 0) parentsZindex.push(parseInt(itemZIndex));
			});
			var zIndex = Math.max.apply(Math, parentsZindex) + 10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left - appendOffset.left,
			    top = offset.top - appendOffset.top;

			this.picker.removeClass('datepicker-orient-top datepicker-orient-bottom ' + 'datepicker-orient-right datepicker-orient-left');

			if (this.o.orientation.x !== 'auto') {
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right') left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
					if (offset.left < 0) {
						// component is outside the window on the left side. Move it into visible range
						this.picker.addClass('datepicker-orient-left');
						left -= offset.left - visualPadding;
					} else if (left + calendarWidth > windowWidth) {
						// the calendar passes the widow right edge. Align it to component right side
						this.picker.addClass('datepicker-orient-right');
						left = offset.left + width - calendarWidth;
					} else {
						// Default to left
						this.picker.addClass('datepicker-orient-left');
					}
				}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
			    top_overflow,
			    bottom_overflow;
			if (yorient === 'auto') {
				top_overflow = -scrollTop + top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow) yorient = 'top';else yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top') top += height;else top -= calendarHeight + parseInt(this.picker.css('padding-top'));

			if (this.o.rtl) {
				var right = windowWidth - (left + width);
				this.picker.css({
					top: top,
					right: right,
					zIndex: zIndex
				});
			} else {
				this.picker.css({
					top: top,
					left: left,
					zIndex: zIndex
				});
			}
			return this;
		},

		_allow_update: true,
		update: function update() {
			if (!this._allow_update) return this;

			var oldDates = this.dates.copy(),
			    dates = [],
			    fromArgs = false;
			if (arguments.length) {
				$.each(arguments, $.proxy(function (i, date) {
					if (date instanceof Date) date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			} else {
				dates = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
				if (dates && this.o.multidate) dates = dates.split(this.o.multidateSeparator);else dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function (date) {
				return DPGlobal.parseDate(date, this.o.format, this.o.language);
			}, this));
			dates = $.grep(dates, $.proxy(function (date) {
				return date < this.o.startDate || date > this.o.endDate || !date;
			}, this), true);
			this.dates.replace(dates);

			if (this.dates.length) this.viewDate = new Date(this.dates.get(-1));else if (this.viewDate < this.o.startDate) this.viewDate = new Date(this.o.startDate);else if (this.viewDate > this.o.endDate) this.viewDate = new Date(this.o.endDate);

			if (fromArgs) {
				// setting date by clicking
				this.setValue();
			} else if (dates.length) {
				// setting date by typing
				if (String(oldDates) !== String(this.dates)) this._trigger('changeDate');
			}
			if (!this.dates.length && oldDates.length) this._trigger('clearDate');

			this.fill();
			return this;
		},

		fillDow: function fillDow() {
			var dowCnt = this.o.weekStart,
			    html = '<tr>';
			if (this.o.calendarWeeks) {
				this.picker.find('.datepicker-days thead tr:first-child .datepicker-switch').attr('colspan', function (i, val) {
					return parseInt(val) + 1;
				});
				var cell = '<th class="cw">&#160;</th>';
				html += cell;
			}
			while (dowCnt < this.o.weekStart + 7) {
				html += '<th class="dow">' + dates[this.o.language].daysMin[dowCnt++ % 7] + '</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function fillMonths() {
			var html = '',
			    i = 0;
			while (i < 12) {
				html += '<span class="month">' + dates[this.o.language].monthsShort[i++] + '</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function setRange(range) {
			if (!range || !range.length) delete this.range;else this.range = $.map(range, function (d) {
				return d.valueOf();
			});
			this.fill();
		},

		getClassNames: function getClassNames(date) {
			var cls = [],
			    year = this.viewDate.getUTCFullYear(),
			    month = this.viewDate.getUTCMonth(),
			    today = new Date();
			if (date.getUTCFullYear() < year || date.getUTCFullYear() === year && date.getUTCMonth() < month) {
				cls.push('old');
			} else if (date.getUTCFullYear() > year || date.getUTCFullYear() === year && date.getUTCMonth() > month) {
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf()) cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight && date.getUTCFullYear() === today.getFullYear() && date.getUTCMonth() === today.getMonth() && date.getUTCDate() === today.getDate()) {
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1) cls.push('active');
			if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate || $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) {
				cls.push('disabled');
			}
			if (this.o.datesDisabled.length > 0 && $.grep(this.o.datesDisabled, function (d) {
				return isUTCEquals(date, d);
			}).length > 0) {
				cls.push('disabled', 'disabled-date');
			}

			if (this.range) {
				if (date > this.range[0] && date < this.range[this.range.length - 1]) {
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1) {
					cls.push('selected');
				}
			}
			return cls;
		},

		fill: function fill() {
			var d = new Date(this.viewDate),
			    year = d.getUTCFullYear(),
			    month = d.getUTCMonth(),
			    startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
			    startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
			    endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
			    endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
			    todaytxt = dates[this.o.language].today || dates['en'].today || '',
			    cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
			    tooltip;
			if (isNaN(year) || isNaN(month)) return;
			this.picker.find('.datepicker-days thead .datepicker-switch').text(dates[this.o.language].months[month] + ' ' + year);
			this.picker.find('tfoot .today').text(todaytxt).toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot .clear').text(cleartxt).toggle(this.o.clearBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month - 1, 28),
			    day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7) % 7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() === this.o.weekStart) {
					html.push('<tr>');
					if (this.o.calendarWeeks) {
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
						// Start of current week: based on weekstart/current date
						ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),

						// Thursday of this week
						th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),

						// First Thursday of year, year from thursday
						yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),

						// Calendar week: ms between thursdays, div ms per day, div 7 days
						calWeek = (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">' + calWeek + '</td>');
					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop) {
					var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined) before = {};else if (typeof before === 'boolean') before = { enabled: before };else if (typeof before === 'string') before = { classes: before };
					if (before.enabled === false) clsName.push('disabled');
					if (before.classes) clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip) tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				html.push('<td class="' + clsName.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + prevMonth.getUTCDate() + '</td>');
				tooltip = null;
				if (prevMonth.getUTCDay() === this.o.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var months = this.picker.find('.datepicker-months').find('th:eq(1)').text(year).end().find('span').removeClass('active');

			$.each(this.dates, function (i, d) {
				if (d.getUTCFullYear() === year) months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year === startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear) {
				months.slice(endMonth + 1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop) {
				var that = this;
				$.each(months, function (i, month) {
					if (!$(month).hasClass('disabled')) {
						var moDate = new Date(year, i, 1);
						var before = that.o.beforeShowMonth(moDate);
						if (before === false) $(month).addClass('disabled');
					}
				});
			}

			html = '';
			year = parseInt(year / 10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years').find('th:eq(1)').text(year + '-' + (year + 9)).end().find('td');
			year -= 1;
			var years = $.map(this.dates, function (d) {
				return d.getUTCFullYear();
			}),
			    classes;
			for (var i = -1; i < 11; i++) {
				classes = ['year'];
				if (i === -1) classes.push('old');else if (i === 10) classes.push('new');
				if ($.inArray(year, years) !== -1) classes.push('active');
				if (year < startYear || year > endYear) classes.push('disabled');
				html += '<span class="' + classes.join(' ') + '">' + year + '</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function updateNavArrows() {
			if (!this._allow_update) return;

			var d = new Date(this.viewDate),
			    year = d.getUTCFullYear(),
			    month = d.getUTCMonth();
			switch (this.viewMode) {
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({ visibility: 'hidden' });
					} else {
						this.picker.find('.prev').css({ visibility: 'visible' });
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()) {
						this.picker.find('.next').css({ visibility: 'hidden' });
					} else {
						this.picker.find('.next').css({ visibility: 'visible' });
					}
					break;
				case 1:
				case 2:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({ visibility: 'hidden' });
					} else {
						this.picker.find('.prev').css({ visibility: 'visible' });
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({ visibility: 'hidden' });
					} else {
						this.picker.find('.next').css({ visibility: 'visible' });
					}
					break;
			}
		},

		click: function click(e) {
			e.preventDefault();
			var target = $(e.target).closest('span, td, th'),
			    year,
			    month,
			    day;
			if (target.length === 1) {
				switch (target[0].nodeName.toLowerCase()) {
					case 'th':
						switch (target[0].className) {
							case 'datepicker-switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
								switch (this.viewMode) {
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										this._trigger('changeMonth', this.viewDate);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										if (this.viewMode === 1) this._trigger('changeYear', this.viewDate);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.o.todayBtn === 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
							case 'clear':
								this.clearDates();
								break;
						}
						break;
					case 'span':
						if (!target.hasClass('disabled')) {
							this.viewDate.setUTCDate(1);
							if (target.hasClass('month')) {
								day = 1;
								month = target.parent().find('span').index(target);
								year = this.viewDate.getUTCFullYear();
								this.viewDate.setUTCMonth(month);
								this._trigger('changeMonth', this.viewDate);
								if (this.o.minViewMode === 1) {
									this._setDate(UTCDate(year, month, day));
								}
							} else {
								day = 1;
								month = 0;
								year = parseInt(target.text(), 10) || 0;
								this.viewDate.setUTCFullYear(year);
								this._trigger('changeYear', this.viewDate);
								if (this.o.minViewMode === 2) {
									this._setDate(UTCDate(year, month, day));
								}
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.hasClass('day') && !target.hasClass('disabled')) {
							day = parseInt(target.text(), 10) || 1;
							year = this.viewDate.getUTCFullYear();
							month = this.viewDate.getUTCMonth();
							if (target.hasClass('old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.hasClass('new')) {
								if (month === 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day));
						}
						break;
				}
			}
			if (this.picker.is(':visible') && this._focused_from) {
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function _toggle_multidate(date) {
			var ix = this.dates.contains(date);
			if (!date) {
				this.dates.clear();
			}

			if (ix !== -1) {
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive) {
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			} else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number') while (this.dates.length > this.o.multidate) {
				this.dates.remove(0);
			}
		},

		_setDate: function _setDate(date, which) {
			if (!which || which === 'date') this._toggle_multidate(date && new Date(date));
			if (!which || which === 'view') this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which !== 'view') {
				this._trigger('changeDate');
			}
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}
			if (element) {
				element.change();
			}
			if (this.o.autoclose && (!which || which === 'date')) {
				this.hide();
			}
		},

		moveMonth: function moveMonth(date, dir) {
			if (!date) return undefined;
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
			    day = new_date.getUTCDate(),
			    month = new_date.getUTCMonth(),
			    mag = Math.abs(dir),
			    new_month,
			    test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1) {
				test = dir === -1
				// If going back one month, make sure month is not current month
				// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
				? function () {
					return new_date.getUTCMonth() === month;
				}
				// If going forward one month, make sure month is as expected
				// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
				: function () {
					return new_date.getUTCMonth() !== new_month;
				};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11) new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i = 0; i < mag; i++) {
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				} // ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function test() {
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()) {
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function moveYear(date, dir) {
			return this.moveMonth(date, dir * 12);
		},

		dateWithinRange: function dateWithinRange(date) {
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function keydown(e) {
			if (!this.picker.is(':visible')) {
				if (e.keyCode === 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
			    dir,
			    newDate,
			    newViewDate,
			    focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode) {
				case 27:
					// escape
					if (this.focusDate) {
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					} else this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39:
					// right
					if (!this.o.keyboardNavigation) break;
					dir = e.keyCode === 37 ? -1 : 1;
					if (e.ctrlKey) {
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					} else if (e.shiftKey) {
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					} else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newViewDate)) {
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 38: // up
				case 40:
					// down
					if (!this.o.keyboardNavigation) break;
					dir = e.keyCode === 38 ? -1 : 1;
					if (e.ctrlKey) {
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					} else if (e.shiftKey) {
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					} else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir * 7);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newViewDate)) {
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 32:
					// spacebar
					// Spacebar is used in manually typing dates in some formats.
					// As such, its behavior should not be hijacked.
					break;
				case 13:
					// enter
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')) {
						e.preventDefault();
						if (typeof e.stopPropagation === 'function') {
							e.stopPropagation(); // All modern browsers, IE9+
						} else {
							e.cancelBubble = true; // IE6,7,8 ignore "stopPropagation"
						}
						if (this.o.autoclose) this.hide();
					}
					break;
				case 9:
					// tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged) {
				if (this.dates.length) this._trigger('changeDate');else this._trigger('clearDate');
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component) {
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},

		showMode: function showMode(dir) {
			if (dir) {
				this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker.children('div').hide().filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function DateRangePicker(element, options) {
		this.element = $(element);
		this.inputs = $.map(options.inputs, function (i) {
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		datepickerPlugin.call($(this.inputs), options).bind('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function (i) {
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function updateDates() {
			this.dates = $.map(this.pickers, function (i) {
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function updateRanges() {
			var range = $.map(this.dates, function (d) {
				return d.valueOf();
			});
			$.each(this.pickers, function (i, p) {
				p.setRange(range);
			});
		},
		dateUpdated: function dateUpdated(e) {
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating) return;
			this.updating = true;

			var dp = $(e.target).data('datepicker'),
			    new_date = dp.getUTCDate(),
			    i = $.inArray(e.target, this.inputs),
			    j = i - 1,
			    k = i + 1,
			    l = this.inputs.length;
			if (i === -1) return;

			$.each(this.pickers, function (i, p) {
				if (!p.getUTCDate()) p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]) {
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j]) {
					this.pickers[j--].setUTCDate(new_date);
				}
			} else if (new_date > this.dates[k]) {
				// Date being moved later/right
				while (k < l && new_date > this.dates[k]) {
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function remove() {
			$.map(this.pickers, function (p) {
				p.remove();
			});
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix) {
		// Derive options from element data-attrs
		var data = $(el).data(),
		    out = {},
		    inkey,
		    replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_, a) {
			return a.toLowerCase();
		}
		for (var key in data) {
			if (prefix.test(key)) {
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		}return out;
	}

	function opts_from_locale(lang) {
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]) {
			lang = lang.split('-')[0];
			if (!dates[lang]) return;
		}
		var d = dates[lang];
		$.each(locale_opts, function (i, k) {
			if (k in d) out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	var datepickerPlugin = function datepickerPlugin(option) {
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function () {
			var $this = $(this),
			    data = $this.data('datepicker'),
			    options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option;
			if (!data) {
				var elopts = opts_from_el(this, 'date'),

				// Preliminary otions
				xopts = $.extend({}, defaults, elopts, options),
				    locopts = opts_from_locale(xopts.language),

				// Options priority: js args, data-attrs, locales, defaults
				opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.hasClass('input-daterange') || opts.inputs) {
					var ropts = {
						inputs: opts.inputs || $this.find('input').toArray()
					};
					$this.data('datepicker', data = new DateRangePicker(this, $.extend(opts, ropts)));
				} else {
					$this.data('datepicker', data = new Datepicker(this, opts));
				}
			}
			if (typeof option === 'string' && typeof data[option] === 'function') {
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined) return false;
			}
		});
		if (internal_return !== undefined) return internal_return;else return this;
	};
	$.fn.datepicker = datepickerPlugin;

	var defaults = $.fn.datepicker.defaults = {
		autoclose: false,
		beforeShowDay: $.noop,
		beforeShowMonth: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		toggleActive: false,
		daysOfWeekDisabled: [],
		datesDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		weekStart: 0,
		disableTouchKeyboard: false,
		container: 'body'
	};
	var locale_opts = $.fn.datepicker.locale_opts = ['format', 'rtl', 'weekStart'];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear"
		}
	};

	var DPGlobal = {
		modes: [{
			clsName: 'days',
			navFnc: 'Month',
			navStep: 1
		}, {
			clsName: 'months',
			navFnc: 'FullYear',
			navStep: 1
		}, {
			clsName: 'years',
			navFnc: 'FullYear',
			navStep: 10
		}],
		isLeapYear: function isLeapYear(year) {
			return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
		},
		getDaysInMonth: function getDaysInMonth(year, month) {
			return [31, DPGlobal.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function parseFormat(format) {
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
			    parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0) {
				throw new Error("Invalid date format.");
			}
			return { separators: separators, parts: parts };
		},
		parseDate: function parseDate(date, format, language) {
			if (!date) return undefined;
			if (date instanceof Date) return date;
			if (typeof format === 'string') format = DPGlobal.parseFormat(format);
			var part_re = /([\-+]\d+)([dmwy])/,
			    parts = date.match(/([\-+]\d+)([dmwy])/g),
			    part,
			    dir,
			    i;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
				date = new Date();
				for (i = 0; i < parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]) {
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			parts = date && date.match(this.nonpunctuation) || [];
			date = new Date();
			var parsed = {},
			    setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
			    setters_map = {
				yyyy: function yyyy(d, v) {
					return d.setUTCFullYear(v);
				},
				yy: function yy(d, v) {
					return d.setUTCFullYear(2000 + v);
				},
				m: function m(d, v) {
					if (isNaN(d)) return d;
					v -= 1;
					while (v < 0) {
						v += 12;
					}v %= 12;
					d.setUTCMonth(v);
					while (d.getUTCMonth() !== v) {
						d.setUTCDate(d.getUTCDate() - 1);
					}return d;
				},
				d: function d(_d, v) {
					return _d.setUTCDate(v);
				}
			},
			    val,
			    filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length) {
				fparts = $(fparts).filter(function (i, p) {
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part() {
				var m = this.slice(0, parts[i].length),
				    p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length) {
				var cnt;
				for (i = 0, cnt = fparts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)) {
						switch (part) {
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i = 0; i < setters_order.length; i++) {
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])) {
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date)) date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function formatDate(date, format, language) {
			if (!date) return '';
			if (typeof format === 'string') format = DPGlobal.parseFormat(format);
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
				if (seps.length) date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>' + '<tr>' + '<th class="prev">&#171;</th>' + '<th colspan="5" class="datepicker-switch"></th>' + '<th class="next">&#187;</th>' + '</tr>' + '</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>' + '<tr>' + '<th colspan="7" class="today"></th>' + '</tr>' + '<tr>' + '<th colspan="7" class="clear"></th>' + '</tr>' + '</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">' + '<div class="datepicker-days">' + '<table class=" table-condensed">' + DPGlobal.headTemplate + '<tbody></tbody>' + DPGlobal.footTemplate + '</table>' + '</div>' + '<div class="datepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + '</table>' + '</div>' + '<div class="datepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + '</table>' + '</div>' + '</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;

	/* DATEPICKER NO CONFLICT
 * =================== */

	$.fn.datepicker.noConflict = function () {
		$.fn.datepicker = old;
		return this;
	};

	/* DATEPICKER DATA-API
 * ================== */

	$(document).on('focus.datepicker.data-api click.datepicker.data-api', '[data-provide="datepicker"]', function (e) {
		var $this = $(this);
		if ($this.data('datepicker')) return;
		e.preventDefault();
		// component click requires us to explicitly show it
		datepickerPlugin.call($this, 'show');
	});
	$(function () {
		datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});
})(window.jQuery);

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.

var Emitter = function () {
	function Emitter() {
		_classCallCheck(this, Emitter);
	}

	_createClass(Emitter, [{
		key: 'on',

		// Add an event listener for given event
		value: function on(event, fn) {
			this._callbacks = this._callbacks || {};
			// Create namespace for this event
			if (!this._callbacks[event]) {
				this._callbacks[event] = [];
			}
			this._callbacks[event].push(fn);
			return this;
		}
	}, {
		key: 'emit',
		value: function emit(event) {
			this._callbacks = this._callbacks || {};
			var callbacks = this._callbacks[event];

			if (callbacks) {
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var callback = _step.value;

						callback.apply(this, args);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			return this;
		}

		// Remove event listener for given event. If fn is not provided, all event
		// listeners for that event will be removed. If neither is provided, all
		// event listeners will be removed.

	}, {
		key: 'off',
		value: function off(event, fn) {
			if (!this._callbacks || arguments.length === 0) {
				this._callbacks = {};
				return this;
			}

			// specific event
			var callbacks = this._callbacks[event];
			if (!callbacks) {
				return this;
			}

			// remove all handlers
			if (arguments.length === 1) {
				delete this._callbacks[event];
				return this;
			}

			// remove specific handler
			for (var i = 0; i < callbacks.length; i++) {
				var callback = callbacks[i];
				if (callback === fn) {
					callbacks.splice(i, 1);
					break;
				}
			}

			return this;
		}
	}]);

	return Emitter;
}();

var Dropzone = function (_Emitter) {
	_inherits(Dropzone, _Emitter);

	_createClass(Dropzone, null, [{
		key: 'initClass',
		value: function initClass() {

			// Exposing the emitter class, mainly for tests
			this.prototype.Emitter = Emitter;

			/*
    This is a list of all available events you can register on a dropzone object.
     You can register an event handler like this:
     dropzone.on("dragEnter", function() { });
     */
			this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

			this.prototype.defaultOptions = {
				/**
     * Has to be specified on elements other than form (or when the form
     * doesn't have an `action` attribute). You can also
     * provide a function that will be called with `files` and
     * must return the url (since `v3.12.0`)
     */
				url: null,

				/**
     * Can be changed to `"put"` if necessary. You can also provide a function
     * that will be called with `files` and must return the method (since `v3.12.0`).
     */
				method: "post",

				/**
     * Will be set on the XHRequest.
     */
				withCredentials: false,

				/**
     * The timeout for the XHR requests in milliseconds (since `v4.4.0`).
     */
				timeout: 30000,

				/**
     * How many file uploads to process in parallel (See the
     * Enqueuing file uploads* documentation section for more info)
     */
				parallelUploads: 2,

				/**
     * Whether to send multiple files in one request. If
     * this it set to true, then the fallback file input element will
     * have the `multiple` attribute as well. This option will
     * also trigger additional events (like `processingmultiple`). See the events
     * documentation section for more information.
     */
				uploadMultiple: false,

				/**
     * Whether you want files to be uploaded in chunks to your server. This can't be
     * used in combination with `uploadMultiple`.
     *
     * See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
     */
				chunking: false,

				/**
     * If `chunking` is enabled, this defines whether **every** file should be chunked,
     * even if the file size is below chunkSize. This means, that the additional chunk
     * form data will be submitted and the `chunksUploaded` callback will be invoked.
     */
				forceChunking: false,

				/**
     * If `chunking` is `true`, then this defines the chunk size in bytes.
     */
				chunkSize: 2000000,

				/**
     * If `true`, the individual chunks of a file are being uploaded simultaneously.
     */
				parallelChunkUploads: false,

				/**
     * Whether a chunk should be retried if it fails.
     */
				retryChunks: false,

				/**
     * If `retryChunks` is true, how many times should it be retried.
     */
				retryChunksLimit: 3,

				/**
     * If not `null` defines how many files this Dropzone handles. If it exceeds,
     * the event `maxfilesexceeded` will be called. The dropzone element gets the
     * class `dz-max-files-reached` accordingly so you can provide visual feedback.
     */
				maxFilesize: 256,

				/**
     * The name of the file param that gets transferred.
     * **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
     * Dropzone will append `[]` to the name.
     */
				paramName: "uploadfile",

				/**
     * Whether thumbnails for images should be generated
     */
				createImageThumbnails: true,

				/**
     * In MB. When the filename exceeds this limit, the thumbnail will not be generated.
     */
				maxThumbnailFilesize: 10,

				/**
     * If `null`, the ratio of the image will be used to calculate it.
     */
				thumbnailWidth: 120,

				/**
     * The same as `thumbnailWidth`. If both are null, images will not be resized.
     */
				thumbnailHeight: 120,

				/**
     * How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
     * Can be either `contain` or `crop`.
     */
				thumbnailMethod: 'crop',

				/**
     * If set, images will be resized to these dimensions before being **uploaded**.
     * If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
     * ratio of the file will be preserved.
     *
     * The `options.transformFile` function uses these options, so if the `transformFile` function
     * is overridden, these options don't do anything.
     */
				resizeWidth: null,

				/**
     * See `resizeWidth`.
     */
				resizeHeight: null,

				/**
     * The mime type of the resized image (before it gets uploaded to the server).
     * If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
     * See `resizeWidth` for more information.
     */
				resizeMimeType: null,

				/**
     * The quality of the resized images. See `resizeWidth`.
     */
				resizeQuality: 0.8,

				/**
     * How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
     * Can be either `contain` or `crop`.
     */
				resizeMethod: 'contain',

				/**
     * The base that is used to calculate the filesize. You can change this to
     * 1024 if you would rather display kibibytes, mebibytes, etc...
     * 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte` not `1 kilobyte`.
     * You can change this to `1024` if you don't care about validity.
     */
				filesizeBase: 1000,

				/**
     * Can be used to limit the maximum number of files that will be handled by this Dropzone
     */
				maxFiles: null,

				/**
     * An optional object to send additional headers to the server. Eg:
     * `{ "My-Awesome-Header": "header value" }`
     */
				headers: null,

				/**
     * If `true`, the dropzone element itself will be clickable, if `false`
     * nothing will be clickable.
     *
     * You can also pass an HTML element, a CSS selector (for multiple elements)
     * or an array of those. In that case, all of those elements will trigger an
     * upload when clicked.
     */
				clickable: true,

				/**
     * Whether hidden files in directories should be ignored.
     */
				ignoreHiddenFiles: true,

				/**
     * The default implementation of `accept` checks the file's mime type or
     * extension against this list. This is a comma separated list of mime
     * types or file extensions.
     *
     * Eg.: `image/*,application/pdf,.psd`
     *
     * If the Dropzone is `clickable` this option will also be used as
     * [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
     * parameter on the hidden file input as well.
     */
				acceptedFiles: null,

				/**
     * **Deprecated!**
     * Use acceptedFiles instead.
     */
				acceptedMimeTypes: null,

				/**
     * If false, files will be added to the queue but the queue will not be
     * processed automatically.
     * This can be useful if you need some additional user input before sending
     * files (or if you want want all files sent at once).
     * If you're ready to send the file simply call `myDropzone.processQueue()`.
     *
     * See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
     * section for more information.
     */
				autoProcessQueue: true,

				/**
     * If false, files added to the dropzone will not be queued by default.
     * You'll have to call `enqueueFile(file)` manually.
     */
				autoQueue: true,

				/**
     * If `true`, this will add a link to every file preview to remove or cancel (if
     * already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
     * and `dictRemoveFile` options are used for the wording.
     */
				addRemoveLinks: false,

				/**
     * Defines where to display the file previews – if `null` the
     * Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
     * selector. The element should have the `dropzone-previews` class so
     * the previews are displayed properly.
     */
				previewsContainer: null,

				/**
     * This is the element the hidden input field (which is used when clicking on the
     * dropzone to trigger file selection) will be appended to. This might
     * be important in case you use frameworks to switch the content of your page.
     */
				hiddenInputContainer: "body",

				/**
     * If null, no capture type will be specified
     * If camera, mobile devices will skip the file selection and choose camera
     * If microphone, mobile devices will skip the file selection and choose the microphone
     * If camcorder, mobile devices will skip the file selection and choose the camera in video mode
     * On apple devices multiple must be set to false.  AcceptedFiles may need to
     * be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
     */
				capture: null,

				/**
     * **Deprecated**. Use `renameFile` instead.
     */
				renameFilename: null,

				/**
     * A function that is invoked before the file is uploaded to the server and renames the file.
     * This function gets the `File` as argument and can use the `file.name`. The actual name of the
     * file that gets used during the upload can be accessed through `file.upload.filename`.
     */
				renameFile: null,

				/**
     * If `true` the fallback will be forced. This is very useful to test your server
     * implementations first and make sure that everything works as
     * expected without dropzone if you experience problems, and to test
     * how your fallbacks will look.
     */
				forceFallback: false,

				/**
     * The text used before any files are dropped.
     */
				dictDefaultMessage: "Drop files here to upload",

				/**
     * The text that replaces the default message text it the browser is not supported.
     */
				dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",

				/**
     * The text that will be added before the fallback form.
     * If you provide a  fallback element yourself, or if this option is `null` this will
     * be ignored.
     */
				dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",

				/**
     * If the filesize is too big.
     * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
     */
				dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",

				/**
     * If the file doesn't match the file type.
     */
				dictInvalidFileType: "You can't upload files of this type.",

				/**
     * If the server response was invalid.
     * `{{statusCode}}` will be replaced with the servers status code.
     */
				dictResponseError: "Server responded with {{statusCode}} code.",

				/**
     * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
     */
				dictCancelUpload: "Cancel upload",

				/**
     * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
     */
				dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",

				/**
     * If `addRemoveLinks` is true, the text to be used to remove a file.
     */
				dictRemoveFile: "Remove file",

				/**
     * If this is not null, then the user will be prompted before removing a file.
     */
				dictRemoveFileConfirmation: null,

				/**
     * Displayed if `maxFiles` is st and exceeded.
     * The string `{{maxFiles}}` will be replaced by the configuration value.
     */
				dictMaxFilesExceeded: "You can not upload any more files.",

				/**
     * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
     * `b` for bytes.
     */
				dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" },

				/**
     * Called when dropzone initialized
     * You can add event listeners here
     */
				init: function init() {},


				/**
     * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
     * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
     * of a function, this needs to return a map.
     *
     * The default implementation does nothing for normal uploads, but adds relevant information for
     * chunked uploads.
     *
     * This is the same as adding hidden input fields in the form element.
     */
				params: function params(files, xhr, chunk) {
					if (chunk) {
						return {
							dzuuid: chunk.file.upload.uuid,
							dzchunkindex: chunk.index,
							dztotalfilesize: chunk.file.size,
							dzchunksize: this.options.chunkSize,
							dztotalchunkcount: chunk.file.upload.totalChunkCount,
							dzchunkbyteoffset: chunk.index * this.options.chunkSize
						};
					}
				},


				/**
     * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
     * and a `done` function as parameters.
     *
     * If the done function is invoked without arguments, the file is "accepted" and will
     * be processed. If you pass an error message, the file is rejected, and the error
     * message will be displayed.
     * This function will not be called if the file is too big or doesn't match the mime types.
     */
				accept: function accept(file, done) {
					return done();
				},


				/**
     * The callback that will be invoked when all chunks have been uploaded for a file.
     * It gets the file for which the chunks have been uploaded as the first parameter,
     * and the `done` function as second. `done()` needs to be invoked when everything
     * needed to finish the upload process is done.
     */
				chunksUploaded: function chunksUploaded(file, done) {
					done();
				},

				/**
     * Gets called when the browser is not supported.
     * The default implementation shows the fallback input field and adds
     * a text.
     */
				fallback: function fallback() {
					// This code should pass in IE7... :(
					var messageElement = void 0;
					this.element.className = this.element.className + ' dz-browser-not-supported';

					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = this.element.getElementsByTagName("div")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var child = _step2.value;

							if (/(^| )dz-message($| )/.test(child.className)) {
								messageElement = child;
								child.className = "dz-message"; // Removes the 'dz-default' class
								break;
							}
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					if (!messageElement) {
						messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
						this.element.appendChild(messageElement);
					}

					var span = messageElement.getElementsByTagName("span")[0];
					if (span) {
						if (span.textContent != null) {
							span.textContent = this.options.dictFallbackMessage;
						} else if (span.innerText != null) {
							span.innerText = this.options.dictFallbackMessage;
						}
					}

					return this.element.appendChild(this.getFallbackForm());
				},


				/**
     * Gets called to calculate the thumbnail dimensions.
     *
     * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
     *
     *  - `srcWidth` & `srcHeight` (required)
     *  - `trgWidth` & `trgHeight` (required)
     *  - `srcX` & `srcY` (optional, default `0`)
     *  - `trgX` & `trgY` (optional, default `0`)
     *
     * Those values are going to be used by `ctx.drawImage()`.
     */
				resize: function resize(file, width, height, resizeMethod) {
					var info = {
						srcX: 0,
						srcY: 0,
						srcWidth: file.width,
						srcHeight: file.height
					};

					var srcRatio = file.width / file.height;

					// Automatically calculate dimensions if not specified
					if (width == null && height == null) {
						width = info.srcWidth;
						height = info.srcHeight;
					} else if (width == null) {
						width = height * srcRatio;
					} else if (height == null) {
						height = width / srcRatio;
					}

					// Make sure images aren't upscaled
					width = Math.min(width, info.srcWidth);
					height = Math.min(height, info.srcHeight);

					var trgRatio = width / height;

					if (info.srcWidth > width || info.srcHeight > height) {
						// Image is bigger and needs rescaling
						if (resizeMethod === 'crop') {
							if (srcRatio > trgRatio) {
								info.srcHeight = file.height;
								info.srcWidth = info.srcHeight * trgRatio;
							} else {
								info.srcWidth = file.width;
								info.srcHeight = info.srcWidth / trgRatio;
							}
						} else if (resizeMethod === 'contain') {
							// Method 'contain'
							if (srcRatio > trgRatio) {
								height = width / srcRatio;
							} else {
								width = height * srcRatio;
							}
						} else {
							throw new Error('Unknown resizeMethod \'' + resizeMethod + '\'');
						}
					}

					info.srcX = (file.width - info.srcWidth) / 2;
					info.srcY = (file.height - info.srcHeight) / 2;

					info.trgWidth = width;
					info.trgHeight = height;

					return info;
				},


				/**
     * Can be used to transform the file (for example, resize an image if necessary).
     *
     * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
     * images according to those dimensions.
     *
     * Gets the `file` as the first parameter, and a `done()` function as the second, that needs
     * to be invoked with the file when the transformation is done.
     */
				transformFile: function transformFile(file, done) {
					if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {
						return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
					} else {
						return done(file);
					}
				},


				/**
     * A string that contains the template used for each dropped
     * file. Change it to fulfill your needs but make sure to properly
     * provide all elements.
     *
     * If you want to use an actual HTML element instead of providing a String
     * as a config option, you could create a div with the id `tpl`,
     * put the template inside it and provide the element like this:
     *
     *     document
     *       .querySelector('#tpl')
     *       .innerHTML
     *
     */
				previewTemplate: '<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>',

				// END OPTIONS
				// (Required by the dropzone documentation parser)


				/*
     Those functions register themselves to the events on init and handle all
     the user interface specific stuff. Overwriting them won't break the upload
     but can break the way it's displayed.
     You can overwrite them if you don't like the default behavior. If you just
     want to add an additional event handler, register it on the dropzone object
     and don't overwrite those options.
     */

				// Those are self explanatory and simply concern the DragnDrop.
				drop: function drop(e) {
					return this.element.classList.remove("dz-drag-hover");
				},
				dragstart: function dragstart(e) {},
				dragend: function dragend(e) {
					return this.element.classList.remove("dz-drag-hover");
				},
				dragenter: function dragenter(e) {
					return this.element.classList.add("dz-drag-hover");
				},
				dragover: function dragover(e) {
					return this.element.classList.add("dz-drag-hover");
				},
				dragleave: function dragleave(e) {
					return this.element.classList.remove("dz-drag-hover");
				},
				paste: function paste(e) {},


				// Called whenever there are no files left in the dropzone anymore, and the
				// dropzone should be displayed as if in the initial state.
				reset: function reset() {
					return this.element.classList.remove("dz-started");
				},


				// Called when a file is added to the queue
				// Receives `file`
				addedfile: function addedfile(file) {
					var _this29 = this;

					if (this.element === this.previewsContainer) {
						this.element.classList.add("dz-started");
					}

					if (this.previewsContainer) {
						file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
						file.previewTemplate = file.previewElement; // Backwards compatibility

						this.previewsContainer.appendChild(file.previewElement);
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = file.previewElement.querySelectorAll("[data-dz-name]")[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var node = _step3.value;

								node.textContent = file.name;
							}
						} catch (err) {
							_didIteratorError3 = true;
							_iteratorError3 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion3 && _iterator3.return) {
									_iterator3.return();
								}
							} finally {
								if (_didIteratorError3) {
									throw _iteratorError3;
								}
							}
						}

						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = file.previewElement.querySelectorAll("[data-dz-size]")[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								node = _step4.value;

								node.innerHTML = this.filesize(file.size);
							}
						} catch (err) {
							_didIteratorError4 = true;
							_iteratorError4 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion4 && _iterator4.return) {
									_iterator4.return();
								}
							} finally {
								if (_didIteratorError4) {
									throw _iteratorError4;
								}
							}
						}

						if (this.options.addRemoveLinks) {
							file._removeLink = Dropzone.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>' + this.options.dictRemoveFile + '</a>');
							file.previewElement.appendChild(file._removeLink);
						}

						var removeFileEvent = function removeFileEvent(e) {
							e.preventDefault();
							e.stopPropagation();
							if (file.status === Dropzone.UPLOADING) {
								return Dropzone.confirm(_this29.options.dictCancelUploadConfirmation, function () {
									return _this29.removeFile(file);
								});
							} else {
								if (_this29.options.dictRemoveFileConfirmation) {
									return Dropzone.confirm(_this29.options.dictRemoveFileConfirmation, function () {
										return _this29.removeFile(file);
									});
								} else {
									return _this29.removeFile(file);
								}
							}
						};

						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;

						try {
							for (var _iterator5 = file.previewElement.querySelectorAll("[data-dz-remove]")[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var removeLink = _step5.value;

								removeLink.addEventListener("click", removeFileEvent);
							}
						} catch (err) {
							_didIteratorError5 = true;
							_iteratorError5 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion5 && _iterator5.return) {
									_iterator5.return();
								}
							} finally {
								if (_didIteratorError5) {
									throw _iteratorError5;
								}
							}
						}
					}
				},


				// Called whenever a file is removed.
				removedfile: function removedfile(file) {
					if (file.previewElement != null && file.previewElement.parentNode != null) {
						file.previewElement.parentNode.removeChild(file.previewElement);
					}
					return this._updateMaxFilesReachedClass();
				},


				// Called when a thumbnail has been generated
				// Receives `file` and `dataUrl`
				thumbnail: function thumbnail(file, dataUrl) {
					if (file.previewElement) {
						file.previewElement.classList.remove("dz-file-preview");
						var _iteratorNormalCompletion6 = true;
						var _didIteratorError6 = false;
						var _iteratorError6 = undefined;

						try {
							for (var _iterator6 = file.previewElement.querySelectorAll("[data-dz-thumbnail]")[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
								var thumbnailElement = _step6.value;

								thumbnailElement.alt = file.name;
								thumbnailElement.src = dataUrl;
							}
						} catch (err) {
							_didIteratorError6 = true;
							_iteratorError6 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion6 && _iterator6.return) {
									_iterator6.return();
								}
							} finally {
								if (_didIteratorError6) {
									throw _iteratorError6;
								}
							}
						}

						return setTimeout(function () {
							return file.previewElement.classList.add("dz-image-preview");
						}, 1);
					}
				},


				// Called whenever an error occurs
				// Receives `file` and `message`
				error: function error(file, message) {
					if (file.previewElement) {
						file.previewElement.classList.add("dz-error");
						if (typeof message !== "String" && message.error) {
							message = message.error;
						}
						var _iteratorNormalCompletion7 = true;
						var _didIteratorError7 = false;
						var _iteratorError7 = undefined;

						try {
							for (var _iterator7 = file.previewElement.querySelectorAll("[data-dz-errormessage]")[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
								var node = _step7.value;

								node.textContent = message;
							}
						} catch (err) {
							_didIteratorError7 = true;
							_iteratorError7 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion7 && _iterator7.return) {
									_iterator7.return();
								}
							} finally {
								if (_didIteratorError7) {
									throw _iteratorError7;
								}
							}
						}
					}
				},
				errormultiple: function errormultiple() {},


				// Called when a file gets processed. Since there is a cue, not all added
				// files are processed immediately.
				// Receives `file`
				processing: function processing(file) {
					if (file.previewElement) {
						file.previewElement.classList.add("dz-processing");
						if (file._removeLink) {
							return file._removeLink.textContent = this.options.dictCancelUpload;
						}
					}
				},
				processingmultiple: function processingmultiple() {},


				// Called whenever the upload progress gets updated.
				// Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
				// To get the total number of bytes of the file, use `file.size`
				uploadprogress: function uploadprogress(file, progress, bytesSent) {
					if (file.previewElement) {
						var _iteratorNormalCompletion8 = true;
						var _didIteratorError8 = false;
						var _iteratorError8 = undefined;

						try {
							for (var _iterator8 = file.previewElement.querySelectorAll("[data-dz-uploadprogress]")[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
								var node = _step8.value;

								node.nodeName === 'PROGRESS' ? node.value = progress : node.style.width = progress + '%';
							}
						} catch (err) {
							_didIteratorError8 = true;
							_iteratorError8 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion8 && _iterator8.return) {
									_iterator8.return();
								}
							} finally {
								if (_didIteratorError8) {
									throw _iteratorError8;
								}
							}
						}
					}
				},


				// Called whenever the total upload progress gets updated.
				// Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
				totaluploadprogress: function totaluploadprogress() {},


				// Called just before the file is sent. Gets the `xhr` object as second
				// parameter, so you can modify it (for example to add a CSRF token) and a
				// `formData` object to add additional information.
				sending: function sending() {},
				sendingmultiple: function sendingmultiple() {},


				// When the complete upload is finished and successful
				// Receives `file`
				success: function success(file) {
					if (file.previewElement) {
						return file.previewElement.classList.add("dz-success");
					}
				},
				successmultiple: function successmultiple() {},


				// When the upload is canceled.
				canceled: function canceled(file) {
					return this.emit("error", file, "Upload canceled.");
				},
				canceledmultiple: function canceledmultiple() {},


				// When the upload is finished, either with success or an error.
				// Receives `file`
				complete: function complete(file) {
					if (file._removeLink) {
						file._removeLink.textContent = this.options.dictRemoveFile;
					}
					if (file.previewElement) {
						return file.previewElement.classList.add("dz-complete");
					}
				},
				completemultiple: function completemultiple() {},
				maxfilesexceeded: function maxfilesexceeded() {},
				maxfilesreached: function maxfilesreached() {},
				queuecomplete: function queuecomplete() {},
				addedfiles: function addedfiles() {}
			};

			this.prototype._thumbnailQueue = [];
			this.prototype._processingThumbnail = false;
		}

		// global utility

	}, {
		key: 'extend',
		value: function extend(target) {
			for (var _len2 = arguments.length, objects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				objects[_key2 - 1] = arguments[_key2];
			}

			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = objects[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var object = _step9.value;

					for (var key in object) {
						var val = object[key];
						target[key] = val;
					}
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return target;
		}
	}]);

	function Dropzone(el, options) {
		_classCallCheck(this, Dropzone);

		var _this28 = _possibleConstructorReturn(this, (Dropzone.__proto__ || Object.getPrototypeOf(Dropzone)).call(this));

		var fallback = void 0,
		    left = void 0;
		_this28.element = el;
		// For backwards compatibility since the version was in the prototype previously
		_this28.version = Dropzone.version;

		_this28.defaultOptions.previewTemplate = _this28.defaultOptions.previewTemplate.replace(/\n*/g, "");

		_this28.clickableElements = [];
		_this28.listeners = [];
		_this28.files = []; // All files

		if (typeof _this28.element === "string") {
			_this28.element = document.querySelector(_this28.element);
		}

		// Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
		if (!_this28.element || _this28.element.nodeType == null) {
			throw new Error("Invalid dropzone element.");
		}

		if (_this28.element.dropzone) {
			throw new Error("Dropzone already attached.");
		}

		// Now add this dropzone to the instances.
		Dropzone.instances.push(_this28);

		// Put the dropzone inside the element itself.
		_this28.element.dropzone = _this28;

		var elementOptions = (left = Dropzone.optionsForElement(_this28.element)) != null ? left : {};

		_this28.options = Dropzone.extend({}, _this28.defaultOptions, elementOptions, options != null ? options : {});

		// If the browser failed, just call the fallback and leave
		if (_this28.options.forceFallback || !Dropzone.isBrowserSupported()) {
			var _ret;

			return _ret = _this28.options.fallback.call(_this28), _possibleConstructorReturn(_this28, _ret);
		}

		// @options.url = @element.getAttribute "action" unless @options.url?
		if (_this28.options.url == null) {
			_this28.options.url = _this28.element.getAttribute("action");
		}

		if (!_this28.options.url) {
			throw new Error("No URL provided.");
		}

		if (_this28.options.acceptedFiles && _this28.options.acceptedMimeTypes) {
			throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
		}

		if (_this28.options.uploadMultiple && _this28.options.chunking) {
			throw new Error('You cannot set both: uploadMultiple and chunking.');
		}

		// Backwards compatibility
		if (_this28.options.acceptedMimeTypes) {
			_this28.options.acceptedFiles = _this28.options.acceptedMimeTypes;
			delete _this28.options.acceptedMimeTypes;
		}

		// Backwards compatibility
		if (_this28.options.renameFilename != null) {
			_this28.options.renameFile = function (file) {
				return _this28.options.renameFilename.call(_this28, file.name, file);
			};
		}

		_this28.options.method = _this28.options.method.toUpperCase();

		if ((fallback = _this28.getExistingFallback()) && fallback.parentNode) {
			// Remove the fallback
			fallback.parentNode.removeChild(fallback);
		}

		// Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false
		if (_this28.options.previewsContainer !== false) {
			if (_this28.options.previewsContainer) {
				_this28.previewsContainer = Dropzone.getElement(_this28.options.previewsContainer, "previewsContainer");
			} else {
				_this28.previewsContainer = _this28.element;
			}
		}

		if (_this28.options.clickable) {
			if (_this28.options.clickable === true) {
				_this28.clickableElements = [_this28.element];
			} else {
				_this28.clickableElements = Dropzone.getElements(_this28.options.clickable, "clickable");
			}
		}

		_this28.init();
		return _this28;
	}

	// Returns all files that have been accepted


	_createClass(Dropzone, [{
		key: 'getAcceptedFiles',
		value: function getAcceptedFiles() {
			return this.files.filter(function (file) {
				return file.accepted;
			}).map(function (file) {
				return file;
			});
		}

		// Returns all files that have been rejected
		// Not sure when that's going to be useful, but added for completeness.

	}, {
		key: 'getRejectedFiles',
		value: function getRejectedFiles() {
			return this.files.filter(function (file) {
				return !file.accepted;
			}).map(function (file) {
				return file;
			});
		}
	}, {
		key: 'getFilesWithStatus',
		value: function getFilesWithStatus(status) {
			return this.files.filter(function (file) {
				return file.status === status;
			}).map(function (file) {
				return file;
			});
		}

		// Returns all files that are in the queue

	}, {
		key: 'getQueuedFiles',
		value: function getQueuedFiles() {
			return this.getFilesWithStatus(Dropzone.QUEUED);
		}
	}, {
		key: 'getUploadingFiles',
		value: function getUploadingFiles() {
			return this.getFilesWithStatus(Dropzone.UPLOADING);
		}
	}, {
		key: 'getAddedFiles',
		value: function getAddedFiles() {
			return this.getFilesWithStatus(Dropzone.ADDED);
		}

		// Files that are either queued or uploading

	}, {
		key: 'getActiveFiles',
		value: function getActiveFiles() {
			return this.files.filter(function (file) {
				return file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED;
			}).map(function (file) {
				return file;
			});
		}

		// The function that gets called when Dropzone is initialized. You
		// can (and should) setup event listeners inside this function.

	}, {
		key: 'init',
		value: function init() {
			var _this30 = this;

			// In case it isn't set already
			if (this.element.tagName === "form") {
				this.element.setAttribute("enctype", "multipart/form-data");
			}

			if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
				this.element.appendChild(Dropzone.createElement('<div class="dz-default dz-message"><span>' + this.options.dictDefaultMessage + '</span></div>'));
			}

			if (this.clickableElements.length) {
				var setupHiddenFileInput = function setupHiddenFileInput() {
					if (_this30.hiddenFileInput) {
						_this30.hiddenFileInput.parentNode.removeChild(_this30.hiddenFileInput);
					}
					_this30.hiddenFileInput = document.createElement("input");
					_this30.hiddenFileInput.setAttribute("type", "file");
					if (_this30.options.maxFiles === null || _this30.options.maxFiles > 1) {
						_this30.hiddenFileInput.setAttribute("multiple", "multiple");
					}
					_this30.hiddenFileInput.className = "dz-hidden-input";

					if (_this30.options.acceptedFiles !== null) {
						_this30.hiddenFileInput.setAttribute("accept", _this30.options.acceptedFiles);
					}
					if (_this30.options.capture !== null) {
						_this30.hiddenFileInput.setAttribute("capture", _this30.options.capture);
					}

					// Not setting `display="none"` because some browsers don't accept clicks
					// on elements that aren't displayed.
					_this30.hiddenFileInput.style.visibility = "hidden";
					_this30.hiddenFileInput.style.position = "absolute";
					_this30.hiddenFileInput.style.top = "0";
					_this30.hiddenFileInput.style.left = "0";
					_this30.hiddenFileInput.style.height = "0";
					_this30.hiddenFileInput.style.width = "0";
					document.querySelector(_this30.options.hiddenInputContainer).appendChild(_this30.hiddenFileInput);
					return _this30.hiddenFileInput.addEventListener("change", function () {
						var files = _this30.hiddenFileInput.files;

						if (files.length) {
							var _iteratorNormalCompletion10 = true;
							var _didIteratorError10 = false;
							var _iteratorError10 = undefined;

							try {
								for (var _iterator10 = files[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
									var file = _step10.value;

									_this30.addFile(file);
								}
							} catch (err) {
								_didIteratorError10 = true;
								_iteratorError10 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion10 && _iterator10.return) {
										_iterator10.return();
									}
								} finally {
									if (_didIteratorError10) {
										throw _iteratorError10;
									}
								}
							}
						}
						_this30.emit("addedfiles", files);
						return setupHiddenFileInput();
					});
				};
				setupHiddenFileInput();
			}

			this.URL = window.URL !== null ? window.URL : window.webkitURL;

			// Setup all event listeners on the Dropzone object itself.
			// They're not in @setupEventListeners() because they shouldn't be removed
			// again when the dropzone gets disabled.
			var _iteratorNormalCompletion11 = true;
			var _didIteratorError11 = false;
			var _iteratorError11 = undefined;

			try {
				for (var _iterator11 = this.events[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
					var eventName = _step11.value;

					this.on(eventName, this.options[eventName]);
				}
			} catch (err) {
				_didIteratorError11 = true;
				_iteratorError11 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion11 && _iterator11.return) {
						_iterator11.return();
					}
				} finally {
					if (_didIteratorError11) {
						throw _iteratorError11;
					}
				}
			}

			this.on("uploadprogress", function () {
				return _this30.updateTotalUploadProgress();
			});

			this.on("removedfile", function () {
				return _this30.updateTotalUploadProgress();
			});

			this.on("canceled", function (file) {
				return _this30.emit("complete", file);
			});

			// Emit a `queuecomplete` event if all files finished uploading.
			this.on("complete", function (file) {
				if (_this30.getAddedFiles().length === 0 && _this30.getUploadingFiles().length === 0 && _this30.getQueuedFiles().length === 0) {
					// This needs to be deferred so that `queuecomplete` really triggers after `complete`
					return setTimeout(function () {
						return _this30.emit("queuecomplete");
					}, 0);
				}
			});

			var noPropagation = function noPropagation(e) {
				e.stopPropagation();
				if (e.preventDefault) {
					return e.preventDefault();
				} else {
					return e.returnValue = false;
				}
			};

			// Create the listeners
			this.listeners = [{
				element: this.element,
				events: {
					"dragstart": function dragstart(e) {
						return _this30.emit("dragstart", e);
					},
					"dragenter": function dragenter(e) {
						noPropagation(e);
						return _this30.emit("dragenter", e);
					},
					"dragover": function dragover(e) {
						// Makes it possible to drag files from chrome's download bar
						// http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
						// Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
						var efct = void 0;
						try {
							efct = e.dataTransfer.effectAllowed;
						} catch (error) {}
						e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';

						noPropagation(e);
						return _this30.emit("dragover", e);
					},
					"dragleave": function dragleave(e) {
						return _this30.emit("dragleave", e);
					},
					"drop": function drop(e) {
						noPropagation(e);
						return _this30.drop(e);
					},
					"dragend": function dragend(e) {
						return _this30.emit("dragend", e);
					}

					// This is disabled right now, because the browsers don't implement it properly.
					// "paste": (e) =>
					//   noPropagation e
					//   @paste e
				} }];

			this.clickableElements.forEach(function (clickableElement) {
				return _this30.listeners.push({
					element: clickableElement,
					events: {
						"click": function click(evt) {
							// Only the actual dropzone or the message element should trigger file selection
							if (clickableElement !== _this30.element || evt.target === _this30.element || Dropzone.elementInside(evt.target, _this30.element.querySelector(".dz-message"))) {
								_this30.hiddenFileInput.click(); // Forward the click
							}
							return true;
						}
					}
				});
			});

			this.enable();

			return this.options.init.call(this);
		}

		// Not fully tested yet

	}, {
		key: 'destroy',
		value: function destroy() {
			this.disable();
			this.removeAllFiles(true);
			if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {
				this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
				this.hiddenFileInput = null;
			}
			delete this.element.dropzone;
			return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
		}
	}, {
		key: 'updateTotalUploadProgress',
		value: function updateTotalUploadProgress() {
			var totalUploadProgress = void 0;
			var totalBytesSent = 0;
			var totalBytes = 0;

			var activeFiles = this.getActiveFiles();

			if (activeFiles.length) {
				var _iteratorNormalCompletion12 = true;
				var _didIteratorError12 = false;
				var _iteratorError12 = undefined;

				try {
					for (var _iterator12 = this.getActiveFiles()[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
						var file = _step12.value;

						totalBytesSent += file.upload.bytesSent;
						totalBytes += file.upload.total;
					}
				} catch (err) {
					_didIteratorError12 = true;
					_iteratorError12 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion12 && _iterator12.return) {
							_iterator12.return();
						}
					} finally {
						if (_didIteratorError12) {
							throw _iteratorError12;
						}
					}
				}

				totalUploadProgress = 100 * totalBytesSent / totalBytes;
			} else {
				totalUploadProgress = 100;
			}

			return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
		}

		// @options.paramName can be a function taking one parameter rather than a string.
		// A parameter name for a file is obtained simply by calling this with an index number.

	}, {
		key: '_getParamName',
		value: function _getParamName(n) {
			if (typeof this.options.paramName === "function") {
				return this.options.paramName(n);
			} else {
				return '' + this.options.paramName + (this.options.uploadMultiple ? '[' + n + ']' : "");
			}
		}

		// If @options.renameFile is a function,
		// the function will be used to rename the file.name before appending it to the formData

	}, {
		key: '_renameFile',
		value: function _renameFile(file) {
			if (typeof this.options.renameFile !== "function") {
				return file.name;
			}
			return this.options.renameFile(file);
		}

		// Returns a form that can be used as fallback if the browser does not support DragnDrop
		//
		// If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
		// This code has to pass in IE7 :(

	}, {
		key: 'getFallbackForm',
		value: function getFallbackForm() {
			var existingFallback = void 0,
			    form = void 0;
			if (existingFallback = this.getExistingFallback()) {
				return existingFallback;
			}

			var fieldsString = "<div class=\"dz-fallback\">";
			if (this.options.dictFallbackText) {
				fieldsString += '<p>' + this.options.dictFallbackText + '</p>';
			}
			fieldsString += '<input type="file" name="' + this._getParamName(0) + '" ' + (this.options.uploadMultiple ? 'multiple="multiple"' : undefined) + ' /><input type="submit" value="Upload!"></div>';

			var fields = Dropzone.createElement(fieldsString);
			if (this.element.tagName !== "FORM") {
				form = Dropzone.createElement('<form action="' + this.options.url + '" enctype="multipart/form-data" method="' + this.options.method + '"></form>');
				form.appendChild(fields);
			} else {
				// Make sure that the enctype and method attributes are set properly
				this.element.setAttribute("enctype", "multipart/form-data");
				this.element.setAttribute("method", this.options.method);
			}
			return form != null ? form : fields;
		}

		// Returns the fallback elements if they exist already
		//
		// This code has to pass in IE7 :(

	}, {
		key: 'getExistingFallback',
		value: function getExistingFallback() {
			var getFallback = function getFallback(elements) {
				var _iteratorNormalCompletion13 = true;
				var _didIteratorError13 = false;
				var _iteratorError13 = undefined;

				try {
					for (var _iterator13 = elements[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
						var el = _step13.value;

						if (/(^| )fallback($| )/.test(el.className)) {
							return el;
						}
					}
				} catch (err) {
					_didIteratorError13 = true;
					_iteratorError13 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion13 && _iterator13.return) {
							_iterator13.return();
						}
					} finally {
						if (_didIteratorError13) {
							throw _iteratorError13;
						}
					}
				}
			};

			var _arr = ["div", "form"];
			for (var _i = 0; _i < _arr.length; _i++) {
				var tagName = _arr[_i];
				var fallback;
				if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
					return fallback;
				}
			}
		}

		// Activates all listeners stored in @listeners

	}, {
		key: 'setupEventListeners',
		value: function setupEventListeners() {
			return this.listeners.map(function (elementListeners) {
				return function () {
					var result = [];
					for (var event in elementListeners.events) {
						var listener = elementListeners.events[event];
						result.push(elementListeners.element.addEventListener(event, listener, false));
					}
					return result;
				}();
			});
		}

		// Deactivates all listeners stored in @listeners

	}, {
		key: 'removeEventListeners',
		value: function removeEventListeners() {
			return this.listeners.map(function (elementListeners) {
				return function () {
					var result = [];
					for (var event in elementListeners.events) {
						var listener = elementListeners.events[event];
						result.push(elementListeners.element.removeEventListener(event, listener, false));
					}
					return result;
				}();
			});
		}

		// Removes all event listeners and cancels all files in the queue or being processed.

	}, {
		key: 'disable',
		value: function disable() {
			var _this31 = this;

			this.clickableElements.forEach(function (element) {
				return element.classList.remove("dz-clickable");
			});
			this.removeEventListeners();

			return this.files.map(function (file) {
				return _this31.cancelUpload(file);
			});
		}
	}, {
		key: 'enable',
		value: function enable() {
			this.clickableElements.forEach(function (element) {
				return element.classList.add("dz-clickable");
			});
			return this.setupEventListeners();
		}

		// Returns a nicely formatted filesize

	}, {
		key: 'filesize',
		value: function filesize(size) {
			var selectedSize = 0;
			var selectedUnit = "b";

			if (size > 0) {
				var units = ['tb', 'gb', 'mb', 'kb', 'b'];

				for (var i = 0; i < units.length; i++) {
					var unit = units[i];
					var cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

					if (size >= cutoff) {
						selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
						selectedUnit = unit;
						break;
					}
				}

				selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
			}

			return '<strong>' + selectedSize + '</strong> ' + this.options.dictFileSizeUnits[selectedUnit];
		}

		// Adds or removes the `dz-max-files-reached` class from the form.

	}, {
		key: '_updateMaxFilesReachedClass',
		value: function _updateMaxFilesReachedClass() {
			if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
				if (this.getAcceptedFiles().length === this.options.maxFiles) {
					this.emit('maxfilesreached', this.files);
				}
				return this.element.classList.add("dz-max-files-reached");
			} else {
				return this.element.classList.remove("dz-max-files-reached");
			}
		}
	}, {
		key: 'drop',
		value: function drop(e) {
			if (!e.dataTransfer) {
				return;
			}
			this.emit("drop", e);

			var files = e.dataTransfer.files;

			this.emit("addedfiles", files);

			// Even if it's a folder, files.length will contain the folders.
			if (files.length) {
				var items = e.dataTransfer.items;

				if (items && items.length && items[0].webkitGetAsEntry != null) {
					// The browser supports dropping of folders, so handle items instead of files
					this._addFilesFromItems(items);
				} else {
					this.handleFiles(files);
				}
			}
		}
	}, {
		key: 'paste',
		value: function paste(e) {
			if (__guard__(e != null ? e.clipboardData : undefined, function (x) {
				return x.items;
			}) == null) {
				return;
			}

			this.emit("paste", e);
			var items = e.clipboardData.items;


			if (items.length) {
				return this._addFilesFromItems(items);
			}
		}
	}, {
		key: 'handleFiles',
		value: function handleFiles(files) {
			var _this32 = this;

			return files.map(function (file) {
				return _this32.addFile(file);
			});
		}

		// When a folder is dropped (or files are pasted), items must be handled
		// instead of files.

	}, {
		key: '_addFilesFromItems',
		value: function _addFilesFromItems(items) {
			var _this33 = this;

			return function () {
				var result = [];
				var _iteratorNormalCompletion14 = true;
				var _didIteratorError14 = false;
				var _iteratorError14 = undefined;

				try {
					for (var _iterator14 = items[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
						var item = _step14.value;

						var entry;
						if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
							if (entry.isFile) {
								result.push(_this33.addFile(item.getAsFile()));
							} else if (entry.isDirectory) {
								// Append all files from that directory to files
								result.push(_this33._addFilesFromDirectory(entry, entry.name));
							} else {
								result.push(undefined);
							}
						} else if (item.getAsFile != null) {
							if (item.kind == null || item.kind === "file") {
								result.push(_this33.addFile(item.getAsFile()));
							} else {
								result.push(undefined);
							}
						} else {
							result.push(undefined);
						}
					}
				} catch (err) {
					_didIteratorError14 = true;
					_iteratorError14 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion14 && _iterator14.return) {
							_iterator14.return();
						}
					} finally {
						if (_didIteratorError14) {
							throw _iteratorError14;
						}
					}
				}

				return result;
			}();
		}

		// Goes through the directory, and adds each file it finds recursively

	}, {
		key: '_addFilesFromDirectory',
		value: function _addFilesFromDirectory(directory, path) {
			var _this34 = this;

			var dirReader = directory.createReader();

			var errorHandler = function errorHandler(error) {
				return __guardMethod__(console, 'log', function (o) {
					return o.log(error);
				});
			};

			var readEntries = function readEntries() {
				return dirReader.readEntries(function (entries) {
					if (entries.length > 0) {
						var _iteratorNormalCompletion15 = true;
						var _didIteratorError15 = false;
						var _iteratorError15 = undefined;

						try {
							for (var _iterator15 = entries[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
								var entry = _step15.value;

								if (entry.isFile) {
									entry.file(function (file) {
										if (_this34.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
											return;
										}
										file.fullPath = path + '/' + file.name;
										return _this34.addFile(file);
									});
								} else if (entry.isDirectory) {
									_this34._addFilesFromDirectory(entry, path + '/' + entry.name);
								}
							}

							// Recursively call readEntries() again, since browser only handle
							// the first 100 entries.
							// See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
						} catch (err) {
							_didIteratorError15 = true;
							_iteratorError15 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion15 && _iterator15.return) {
									_iterator15.return();
								}
							} finally {
								if (_didIteratorError15) {
									throw _iteratorError15;
								}
							}
						}

						readEntries();
					}
					return null;
				}, errorHandler);
			};

			return readEntries();
		}

		// If `done()` is called without argument the file is accepted
		// If you call it with an error message, the file is rejected
		// (This allows for asynchronous validation)
		//
		// This function checks the filesize, and if the file.type passes the
		// `acceptedFiles` check.

	}, {
		key: 'accept',
		value: function accept(file, done) {
			if (file.size > this.options.maxFilesize * 1024 * 1024) {
				return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
			} else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
				return done(this.options.dictInvalidFileType);
			} else if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
				done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
				return this.emit("maxfilesexceeded", file);
			} else {
				return this.options.accept.call(this, file, done);
			}
		}
	}, {
		key: 'addFile',
		value: function addFile(file) {
			var _this35 = this;

			file.upload = {
				uuid: Dropzone.uuidv4(),
				progress: 0,
				// Setting the total upload size to file.size for the beginning
				// It's actual different than the size to be transmitted.
				total: file.size,
				bytesSent: 0,
				filename: this._renameFile(file),
				chunked: this.options.chunking && (this.options.forceChunking || file.size > this.options.chunkSize),
				totalChunkCount: Math.ceil(file.size / this.options.chunkSize)
			};
			this.files.push(file);

			file.status = Dropzone.ADDED;

			this.emit("addedfile", file);

			this._enqueueThumbnail(file);

			return this.accept(file, function (error) {
				if (error) {
					file.accepted = false;
					_this35._errorProcessing([file], error); // Will set the file.status
				} else {
					file.accepted = true;
					if (_this35.options.autoQueue) {
						_this35.enqueueFile(file);
					} // Will set .accepted = true
				}
				return _this35._updateMaxFilesReachedClass();
			});
		}

		// Wrapper for enqueueFile

	}, {
		key: 'enqueueFiles',
		value: function enqueueFiles(files) {
			var _iteratorNormalCompletion16 = true;
			var _didIteratorError16 = false;
			var _iteratorError16 = undefined;

			try {
				for (var _iterator16 = files[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
					var file = _step16.value;

					this.enqueueFile(file);
				}
			} catch (err) {
				_didIteratorError16 = true;
				_iteratorError16 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion16 && _iterator16.return) {
						_iterator16.return();
					}
				} finally {
					if (_didIteratorError16) {
						throw _iteratorError16;
					}
				}
			}

			return null;
		}
	}, {
		key: 'enqueueFile',
		value: function enqueueFile(file) {
			var _this36 = this;

			if (file.status === Dropzone.ADDED && file.accepted === true) {
				file.status = Dropzone.QUEUED;
				if (this.options.autoProcessQueue) {
					return setTimeout(function () {
						return _this36.processQueue();
					}, 0); // Deferring the call
				}
			} else {
				throw new Error("This file can't be queued because it has already been processed or was rejected.");
			}
		}
	}, {
		key: '_enqueueThumbnail',
		value: function _enqueueThumbnail(file) {
			var _this37 = this;

			if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
				this._thumbnailQueue.push(file);
				return setTimeout(function () {
					return _this37._processThumbnailQueue();
				}, 0); // Deferring the call
			}
		}
	}, {
		key: '_processThumbnailQueue',
		value: function _processThumbnailQueue() {
			var _this38 = this;

			if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
				return;
			}

			this._processingThumbnail = true;
			var file = this._thumbnailQueue.shift();
			return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, function (dataUrl) {
				_this38.emit("thumbnail", file, dataUrl);
				_this38._processingThumbnail = false;
				return _this38._processThumbnailQueue();
			});
		}

		// Can be called by the user to remove a file

	}, {
		key: 'removeFile',
		value: function removeFile(file) {
			if (file.status === Dropzone.UPLOADING) {
				this.cancelUpload(file);
			}
			this.files = without(this.files, file);

			this.emit("removedfile", file);
			if (this.files.length === 0) {
				return this.emit("reset");
			}
		}

		// Removes all files that aren't currently processed from the list

	}, {
		key: 'removeAllFiles',
		value: function removeAllFiles(cancelIfNecessary) {
			// Create a copy of files since removeFile() changes the @files array.
			if (cancelIfNecessary == null) {
				cancelIfNecessary = false;
			}
			var _iteratorNormalCompletion17 = true;
			var _didIteratorError17 = false;
			var _iteratorError17 = undefined;

			try {
				for (var _iterator17 = this.files.slice()[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
					var file = _step17.value;

					if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
						this.removeFile(file);
					}
				}
			} catch (err) {
				_didIteratorError17 = true;
				_iteratorError17 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion17 && _iterator17.return) {
						_iterator17.return();
					}
				} finally {
					if (_didIteratorError17) {
						throw _iteratorError17;
					}
				}
			}

			return null;
		}

		// Resizes an image before it gets sent to the server. This function is the default behavior of
		// `options.transformFile` if `resizeWidth` or `resizeHeight` are set. The callback is invoked with
		// the resized blob.

	}, {
		key: 'resizeImage',
		value: function resizeImage(file, width, height, resizeMethod, callback) {
			var _this39 = this;

			return this.createThumbnail(file, width, height, resizeMethod, false, function (dataUrl, canvas) {
				if (canvas === null) {
					// The image has not been resized
					return callback(file);
				} else {
					var resizeMimeType = _this39.options.resizeMimeType;

					if (resizeMimeType == null) {
						resizeMimeType = file.type;
					}
					var resizedDataURL = canvas.toDataURL(resizeMimeType, _this39.options.resizeQuality);
					if (resizeMimeType === 'image/jpeg' || resizeMimeType === 'image/jpg') {
						// Now add the original EXIF information
						resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
					}
					return callback(Dropzone.dataURItoBlob(resizedDataURL));
				}
			});
		}
	}, {
		key: 'createThumbnail',
		value: function createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
			var _this40 = this;

			var fileReader = new FileReader();

			fileReader.onload = function () {

				file.dataURL = fileReader.result;

				// Don't bother creating a thumbnail for SVG images since they're vector
				if (file.type === "image/svg+xml") {
					if (callback != null) {
						callback(fileReader.result);
					}
					return;
				}

				return _this40.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
			};

			return fileReader.readAsDataURL(file);
		}
	}, {
		key: 'createThumbnailFromUrl',
		value: function createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
			var _this41 = this;

			// Not using `new Image` here because of a bug in latest Chrome versions.
			// See https://github.com/enyo/dropzone/pull/226
			var img = document.createElement("img");

			if (crossOrigin) {
				img.crossOrigin = crossOrigin;
			}

			img.onload = function () {
				var loadExif = function loadExif(callback) {
					return callback(1);
				};
				if (typeof EXIF !== 'undefined' && EXIF !== null && fixOrientation) {
					loadExif = function loadExif(callback) {
						return EXIF.getData(img, function () {
							return callback(EXIF.getTag(this, 'Orientation'));
						});
					};
				}

				return loadExif(function (orientation) {
					file.width = img.width;
					file.height = img.height;

					var resizeInfo = _this41.options.resize.call(_this41, file, width, height, resizeMethod);

					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");

					canvas.width = resizeInfo.trgWidth;
					canvas.height = resizeInfo.trgHeight;

					if (orientation > 4) {
						canvas.width = resizeInfo.trgHeight;
						canvas.height = resizeInfo.trgWidth;
					}

					switch (orientation) {
						case 2:
							// horizontal flip
							ctx.translate(canvas.width, 0);
							ctx.scale(-1, 1);
							break;
						case 3:
							// 180° rotate left
							ctx.translate(canvas.width, canvas.height);
							ctx.rotate(Math.PI);
							break;
						case 4:
							// vertical flip
							ctx.translate(0, canvas.height);
							ctx.scale(1, -1);
							break;
						case 5:
							// vertical flip + 90 rotate right
							ctx.rotate(0.5 * Math.PI);
							ctx.scale(1, -1);
							break;
						case 6:
							// 90° rotate right
							ctx.rotate(0.5 * Math.PI);
							ctx.translate(0, -canvas.height);
							break;
						case 7:
							// horizontal flip + 90 rotate right
							ctx.rotate(0.5 * Math.PI);
							ctx.translate(canvas.width, -canvas.height);
							ctx.scale(-1, 1);
							break;
						case 8:
							// 90° rotate left
							ctx.rotate(-0.5 * Math.PI);
							ctx.translate(-canvas.width, 0);
							break;
					}

					// This is a bugfix for iOS' scaling bug.
					drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);

					var thumbnail = canvas.toDataURL("image/png");

					if (callback != null) {
						return callback(thumbnail, canvas);
					}
				});
			};

			if (callback != null) {
				img.onerror = callback;
			}

			return img.src = file.dataURL;
		}

		// Goes through the queue and processes files if there aren't too many already.

	}, {
		key: 'processQueue',
		value: function processQueue() {
			var parallelUploads = this.options.parallelUploads;

			var processingLength = this.getUploadingFiles().length;
			var i = processingLength;

			// There are already at least as many files uploading than should be
			if (processingLength >= parallelUploads) {
				return;
			}

			var queuedFiles = this.getQueuedFiles();

			if (!(queuedFiles.length > 0)) {
				return;
			}

			if (this.options.uploadMultiple) {
				// The files should be uploaded in one request
				return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
			} else {
				while (i < parallelUploads) {
					if (!queuedFiles.length) {
						return;
					} // Nothing left to process
					this.processFile(queuedFiles.shift());
					i++;
				}
			}
		}

		// Wrapper for `processFiles`

	}, {
		key: 'processFile',
		value: function processFile(file) {
			return this.processFiles([file]);
		}

		// Loads the file, then calls finishedLoading()

	}, {
		key: 'processFiles',
		value: function processFiles(files) {
			var _iteratorNormalCompletion18 = true;
			var _didIteratorError18 = false;
			var _iteratorError18 = undefined;

			try {
				for (var _iterator18 = files[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
					var file = _step18.value;

					file.processing = true; // Backwards compatibility
					file.status = Dropzone.UPLOADING;

					this.emit("processing", file);
				}
			} catch (err) {
				_didIteratorError18 = true;
				_iteratorError18 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion18 && _iterator18.return) {
						_iterator18.return();
					}
				} finally {
					if (_didIteratorError18) {
						throw _iteratorError18;
					}
				}
			}

			if (this.options.uploadMultiple) {
				this.emit("processingmultiple", files);
			}

			return this.uploadFiles(files);
		}
	}, {
		key: '_getFilesWithXhr',
		value: function _getFilesWithXhr(xhr) {
			var files = void 0;
			return files = this.files.filter(function (file) {
				return file.xhr === xhr;
			}).map(function (file) {
				return file;
			});
		}

		// Cancels the file upload and sets the status to CANCELED
		// **if** the file is actually being uploaded.
		// If it's still in the queue, the file is being removed from it and the status
		// set to CANCELED.

	}, {
		key: 'cancelUpload',
		value: function cancelUpload(file) {
			if (file.status === Dropzone.UPLOADING) {
				var groupedFiles = this._getFilesWithXhr(file.xhr);
				var _iteratorNormalCompletion19 = true;
				var _didIteratorError19 = false;
				var _iteratorError19 = undefined;

				try {
					for (var _iterator19 = groupedFiles[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
						var groupedFile = _step19.value;

						groupedFile.status = Dropzone.CANCELED;
					}
				} catch (err) {
					_didIteratorError19 = true;
					_iteratorError19 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion19 && _iterator19.return) {
							_iterator19.return();
						}
					} finally {
						if (_didIteratorError19) {
							throw _iteratorError19;
						}
					}
				}

				if (typeof file.xhr !== 'undefined') {
					file.xhr.abort();
				}
				var _iteratorNormalCompletion20 = true;
				var _didIteratorError20 = false;
				var _iteratorError20 = undefined;

				try {
					for (var _iterator20 = groupedFiles[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
						var _groupedFile = _step20.value;

						this.emit("canceled", _groupedFile);
					}
				} catch (err) {
					_didIteratorError20 = true;
					_iteratorError20 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion20 && _iterator20.return) {
							_iterator20.return();
						}
					} finally {
						if (_didIteratorError20) {
							throw _iteratorError20;
						}
					}
				}

				if (this.options.uploadMultiple) {
					this.emit("canceledmultiple", groupedFiles);
				}
			} else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
				file.status = Dropzone.CANCELED;
				this.emit("canceled", file);
				if (this.options.uploadMultiple) {
					this.emit("canceledmultiple", [file]);
				}
			}

			if (this.options.autoProcessQueue) {
				return this.processQueue();
			}
		}
	}, {
		key: 'resolveOption',
		value: function resolveOption(option) {
			if (typeof option === 'function') {
				for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
					args[_key3 - 1] = arguments[_key3];
				}

				return option.apply(this, args);
			}
			return option;
		}
	}, {
		key: 'uploadFile',
		value: function uploadFile(file) {
			return this.uploadFiles([file]);
		}
	}, {
		key: 'uploadFiles',
		value: function uploadFiles(files) {
			var _this42 = this;

			this._transformFiles(files, function (transformedFiles) {
				if (files[0].upload.chunked) {
					// This file should be sent in chunks!

					// If the chunking option is set, we **know** that there can only be **one** file, since
					// uploadMultiple is not allowed with this option.
					var file = files[0];
					var transformedFile = transformedFiles[0];
					var startedChunkCount = 0;

					file.upload.chunks = [];

					var handleNextChunk = function handleNextChunk() {
						var chunkIndex = 0;

						// Find the next item in file.upload.chunks that is not defined yet.
						while (file.upload.chunks[chunkIndex] !== undefined) {
							chunkIndex++;
						}

						// This means, that all chunks have already been started.
						if (chunkIndex >= file.upload.totalChunkCount) return;

						startedChunkCount++;

						var start = chunkIndex * _this42.options.chunkSize;
						var end = Math.min(start + _this42.options.chunkSize, file.size);

						var dataBlock = {
							name: _this42._getParamName(0),
							data: transformedFile.webkitSlice ? transformedFile.webkitSlice(start, end) : transformedFile.slice(start, end),
							filename: file.upload.filename,
							chunkIndex: chunkIndex
						};

						file.upload.chunks[chunkIndex] = {
							file: file,
							index: chunkIndex,
							dataBlock: dataBlock, // In case we want to retry.
							status: Dropzone.UPLOADING,
							progress: 0,
							retries: 0 // The number of times this block has been retried.
						};

						_this42._uploadData(files, [dataBlock]);
					};

					file.upload.finishedChunkUpload = function (chunk) {
						var allFinished = true;
						chunk.status = Dropzone.SUCCESS;

						// Clear the data from the chunk
						chunk.dataBlock = null;

						for (var i = 0; i < file.upload.totalChunkCount; i++) {
							if (file.upload.chunks[i] === undefined) {
								return handleNextChunk();
							}
							if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
								allFinished = false;
							}
						}

						if (allFinished) {
							_this42.options.chunksUploaded(file, function () {
								_this42._finished(files, '', null);
							});
						}
					};

					if (_this42.options.parallelChunkUploads) {
						for (var i = 0; i < file.upload.totalChunkCount; i++) {
							handleNextChunk();
						}
					} else {
						handleNextChunk();
					}
				} else {
					var dataBlocks = [];
					for (var _i2 = 0; _i2 < files.length; _i2++) {
						dataBlocks[_i2] = {
							name: _this42._getParamName(_i2),
							data: transformedFiles[_i2],
							filename: files[_i2].upload.filename
						};
					}
					_this42._uploadData(files, dataBlocks);
				}
			});
		}

		/// Returns the right chunk for given file and xhr

	}, {
		key: '_getChunk',
		value: function _getChunk(file, xhr) {
			for (var i = 0; i < file.upload.totalChunkCount; i++) {
				if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
					return file.upload.chunks[i];
				}
			}
		}

		// This function actually uploads the file(s) to the server.
		// If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
		// files, or individual chunks for chunked upload).

	}, {
		key: '_uploadData',
		value: function _uploadData(files, dataBlocks) {
			var _this43 = this;

			var xhr = new XMLHttpRequest();

			// Put the xhr object in the file objects to be able to reference it later.
			var _iteratorNormalCompletion21 = true;
			var _didIteratorError21 = false;
			var _iteratorError21 = undefined;

			try {
				for (var _iterator21 = files[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
					var file = _step21.value;

					file.xhr = xhr;
				}
			} catch (err) {
				_didIteratorError21 = true;
				_iteratorError21 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion21 && _iterator21.return) {
						_iterator21.return();
					}
				} finally {
					if (_didIteratorError21) {
						throw _iteratorError21;
					}
				}
			}

			if (files[0].upload.chunked) {
				// Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
				files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
			}

			var method = this.resolveOption(this.options.method, files);
			var url = this.resolveOption(this.options.url, files);
			xhr.open(method, url, true);

			// Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8
			xhr.timeout = this.resolveOption(this.options.timeout, files);

			// Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
			xhr.withCredentials = !!this.options.withCredentials;

			xhr.onload = function (e) {
				_this43._finishedUploading(files, xhr, e);
			};

			xhr.onerror = function () {
				_this43._handleUploadError(files, xhr);
			};

			// Some browsers do not have the .upload property
			var progressObj = xhr.upload != null ? xhr.upload : xhr;
			progressObj.onprogress = function (e) {
				return _this43._updateFilesUploadProgress(files, xhr, e);
			};

			var headers = {
				"Accept": "application/json",
				"Cache-Control": "no-cache",
				"X-Requested-With": "XMLHttpRequest"
			};

			if (this.options.headers) {
				Dropzone.extend(headers, this.options.headers);
			}

			for (var headerName in headers) {
				var headerValue = headers[headerName];
				if (headerValue) {
					xhr.setRequestHeader(headerName, headerValue);
				}
			}

			var formData = new FormData();

			// Adding all @options parameters
			if (this.options.params) {
				var additionalParams = this.options.params;
				if (typeof additionalParams === 'function') {
					additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
				}

				for (var key in additionalParams) {
					var value = additionalParams[key];
					formData.append(key, value);
				}
			}

			// Let the user add additional data if necessary
			var _iteratorNormalCompletion22 = true;
			var _didIteratorError22 = false;
			var _iteratorError22 = undefined;

			try {
				for (var _iterator22 = files[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
					var _file = _step22.value;

					this.emit("sending", _file, xhr, formData);
				}
			} catch (err) {
				_didIteratorError22 = true;
				_iteratorError22 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion22 && _iterator22.return) {
						_iterator22.return();
					}
				} finally {
					if (_didIteratorError22) {
						throw _iteratorError22;
					}
				}
			}

			if (this.options.uploadMultiple) {
				this.emit("sendingmultiple", files, xhr, formData);
			}

			this._addFormElementData(formData);

			// Finally add the files
			// Has to be last because some servers (eg: S3) expect the file to be the last parameter
			for (var i = 0; i < dataBlocks.length; i++) {
				var dataBlock = dataBlocks[i];
				formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
			}

			this.submitRequest(xhr, formData, files);
		}

		// Transforms all files with this.options.transformFile and invokes done with the transformed files when done.

	}, {
		key: '_transformFiles',
		value: function _transformFiles(files, done) {
			var _this44 = this;

			var transformedFiles = [];
			// Clumsy way of handling asynchronous calls, until I get to add a proper Future library.
			var doneCounter = 0;

			var _loop = function _loop(i) {
				_this44.options.transformFile.call(_this44, files[i], function (transformedFile) {
					transformedFiles[i] = transformedFile;
					if (++doneCounter === files.length) {
						done(transformedFiles);
					}
				});
			};

			for (var i = 0; i < files.length; i++) {
				_loop(i);
			}
		}

		// Takes care of adding other input elements of the form to the AJAX request

	}, {
		key: '_addFormElementData',
		value: function _addFormElementData(formData) {
			// Take care of other input elements
			if (this.element.tagName === "FORM") {
				var _iteratorNormalCompletion23 = true;
				var _didIteratorError23 = false;
				var _iteratorError23 = undefined;

				try {
					for (var _iterator23 = this.element.querySelectorAll("input, textarea, select, button")[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
						var input = _step23.value;

						var inputName = input.getAttribute("name");
						var inputType = input.getAttribute("type");
						if (inputType) inputType = inputType.toLowerCase();

						// If the input doesn't have a name, we can't use it.
						if (typeof inputName === 'undefined' || inputName === null) continue;

						if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
							// Possibly multiple values
							var _iteratorNormalCompletion24 = true;
							var _didIteratorError24 = false;
							var _iteratorError24 = undefined;

							try {
								for (var _iterator24 = input.options[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
									var option = _step24.value;

									if (option.selected) {
										formData.append(inputName, option.value);
									}
								}
							} catch (err) {
								_didIteratorError24 = true;
								_iteratorError24 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion24 && _iterator24.return) {
										_iterator24.return();
									}
								} finally {
									if (_didIteratorError24) {
										throw _iteratorError24;
									}
								}
							}
						} else if (!inputType || inputType !== "checkbox" && inputType !== "radio" || input.checked) {
							formData.append(inputName, input.value);
						}
					}
				} catch (err) {
					_didIteratorError23 = true;
					_iteratorError23 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion23 && _iterator23.return) {
							_iterator23.return();
						}
					} finally {
						if (_didIteratorError23) {
							throw _iteratorError23;
						}
					}
				}
			}
		}

		// Invoked when there is new progress information about given files.
		// If e is not provided, it is assumed that the upload is finished.

	}, {
		key: '_updateFilesUploadProgress',
		value: function _updateFilesUploadProgress(files, xhr, e) {
			var progress = void 0;
			if (typeof e !== 'undefined') {
				progress = 100 * e.loaded / e.total;

				if (files[0].upload.chunked) {
					var file = files[0];
					// Since this is a chunked upload, we need to update the appropriate chunk progress.
					var chunk = this._getChunk(file, xhr);
					chunk.progress = progress;
					chunk.total = e.total;
					chunk.bytesSent = e.loaded;
					var fileProgress = 0,
					    fileTotal = void 0,
					    fileBytesSent = void 0;
					file.upload.progress = 0;
					file.upload.total = 0;
					file.upload.bytesSent = 0;
					for (var i = 0; i < file.upload.totalChunkCount; i++) {
						if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].progress !== undefined) {
							file.upload.progress += file.upload.chunks[i].progress;
							file.upload.total += file.upload.chunks[i].total;
							file.upload.bytesSent += file.upload.chunks[i].bytesSent;
						}
					}
					file.upload.progress = file.upload.progress / file.upload.totalChunkCount;
				} else {
					var _iteratorNormalCompletion25 = true;
					var _didIteratorError25 = false;
					var _iteratorError25 = undefined;

					try {
						for (var _iterator25 = files[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
							var _file2 = _step25.value;

							_file2.upload.progress = progress;
							_file2.upload.total = e.total;
							_file2.upload.bytesSent = e.loaded;
						}
					} catch (err) {
						_didIteratorError25 = true;
						_iteratorError25 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion25 && _iterator25.return) {
								_iterator25.return();
							}
						} finally {
							if (_didIteratorError25) {
								throw _iteratorError25;
							}
						}
					}
				}
				var _iteratorNormalCompletion26 = true;
				var _didIteratorError26 = false;
				var _iteratorError26 = undefined;

				try {
					for (var _iterator26 = files[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
						var _file3 = _step26.value;

						this.emit("uploadprogress", _file3, _file3.upload.progress, _file3.upload.bytesSent);
					}
				} catch (err) {
					_didIteratorError26 = true;
					_iteratorError26 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion26 && _iterator26.return) {
							_iterator26.return();
						}
					} finally {
						if (_didIteratorError26) {
							throw _iteratorError26;
						}
					}
				}
			} else {
				// Called when the file finished uploading

				var allFilesFinished = true;

				progress = 100;

				var _iteratorNormalCompletion27 = true;
				var _didIteratorError27 = false;
				var _iteratorError27 = undefined;

				try {
					for (var _iterator27 = files[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
						var _file4 = _step27.value;

						if (_file4.upload.progress !== 100 || _file4.upload.bytesSent !== _file4.upload.total) {
							allFilesFinished = false;
						}
						_file4.upload.progress = progress;
						_file4.upload.bytesSent = _file4.upload.total;
					}

					// Nothing to do, all files already at 100%
				} catch (err) {
					_didIteratorError27 = true;
					_iteratorError27 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion27 && _iterator27.return) {
							_iterator27.return();
						}
					} finally {
						if (_didIteratorError27) {
							throw _iteratorError27;
						}
					}
				}

				if (allFilesFinished) {
					return;
				}

				var _iteratorNormalCompletion28 = true;
				var _didIteratorError28 = false;
				var _iteratorError28 = undefined;

				try {
					for (var _iterator28 = files[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
						var _file5 = _step28.value;

						this.emit("uploadprogress", _file5, progress, _file5.upload.bytesSent);
					}
				} catch (err) {
					_didIteratorError28 = true;
					_iteratorError28 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion28 && _iterator28.return) {
							_iterator28.return();
						}
					} finally {
						if (_didIteratorError28) {
							throw _iteratorError28;
						}
					}
				}
			}
		}
	}, {
		key: '_finishedUploading',
		value: function _finishedUploading(files, xhr, e) {
			var response = void 0;

			if (files[0].status === Dropzone.CANCELED) {
				return;
			}

			if (xhr.readyState !== 4) {
				return;
			}

			if (xhr.responseType !== 'arraybuffer' && xhr.responseType !== 'blob') {
				response = xhr.responseText;

				if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
					try {
						response = JSON.parse(response);
					} catch (error) {
						e = error;
						response = "Invalid JSON response from server.";
					}
				}
			}

			this._updateFilesUploadProgress(files);

			if (!(200 <= xhr.status && xhr.status < 300)) {
				this._handleUploadError(files, xhr, response);
			} else {
				if (files[0].upload.chunked) {
					files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr));
				} else {
					this._finished(files, response, e);
				}
			}
		}
	}, {
		key: '_handleUploadError',
		value: function _handleUploadError(files, xhr, response) {
			if (files[0].status === Dropzone.CANCELED) {
				return;
			}

			if (files[0].upload.chunked && this.options.retryChunks) {
				var chunk = this._getChunk(files[0], xhr);
				if (chunk.retries++ < this.options.retryChunksLimit) {
					this._uploadData(files, [chunk.dataBlock]);
					return;
				} else {
					console.warn('Retried this chunk too often. Giving up.');
				}
			}

			var _iteratorNormalCompletion29 = true;
			var _didIteratorError29 = false;
			var _iteratorError29 = undefined;

			try {
				for (var _iterator29 = files[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
					var file = _step29.value;

					this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
				}
			} catch (err) {
				_didIteratorError29 = true;
				_iteratorError29 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion29 && _iterator29.return) {
						_iterator29.return();
					}
				} finally {
					if (_didIteratorError29) {
						throw _iteratorError29;
					}
				}
			}
		}
	}, {
		key: 'submitRequest',
		value: function submitRequest(xhr, formData, files) {
			xhr.send(formData);
		}

		// Called internally when processing is finished.
		// Individual callbacks have to be called in the appropriate sections.

	}, {
		key: '_finished',
		value: function _finished(files, responseText, e) {
			var _iteratorNormalCompletion30 = true;
			var _didIteratorError30 = false;
			var _iteratorError30 = undefined;

			try {
				for (var _iterator30 = files[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
					var file = _step30.value;

					file.status = Dropzone.SUCCESS;
					this.emit("success", file, responseText, e);
					this.emit("complete", file);
				}
			} catch (err) {
				_didIteratorError30 = true;
				_iteratorError30 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion30 && _iterator30.return) {
						_iterator30.return();
					}
				} finally {
					if (_didIteratorError30) {
						throw _iteratorError30;
					}
				}
			}

			if (this.options.uploadMultiple) {
				this.emit("successmultiple", files, responseText, e);
				this.emit("completemultiple", files);
			}

			if (this.options.autoProcessQueue) {
				return this.processQueue();
			}
		}

		// Called internally when processing is finished.
		// Individual callbacks have to be called in the appropriate sections.

	}, {
		key: '_errorProcessing',
		value: function _errorProcessing(files, message, xhr) {
			var _iteratorNormalCompletion31 = true;
			var _didIteratorError31 = false;
			var _iteratorError31 = undefined;

			try {
				for (var _iterator31 = files[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
					var file = _step31.value;

					file.status = Dropzone.ERROR;
					this.emit("error", file, message, xhr);
					this.emit("complete", file);
				}
			} catch (err) {
				_didIteratorError31 = true;
				_iteratorError31 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion31 && _iterator31.return) {
						_iterator31.return();
					}
				} finally {
					if (_didIteratorError31) {
						throw _iteratorError31;
					}
				}
			}

			if (this.options.uploadMultiple) {
				this.emit("errormultiple", files, message, xhr);
				this.emit("completemultiple", files);
			}

			if (this.options.autoProcessQueue) {
				return this.processQueue();
			}
		}
	}], [{
		key: 'uuidv4',
		value: function uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
				    v = c === 'x' ? r : r & 0x3 | 0x8;
				return v.toString(16);
			});
		}
	}]);

	return Dropzone;
}(Emitter);

Dropzone.initClass();

Dropzone.version = "5.2.0";

// This is a map of options for your different dropzones. Add configurations
// to this object for your different dropzone elemens.
//
// Example:
//
//     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
//
// To disable autoDiscover for a specific element, you can set `false` as an option:
//
//     Dropzone.options.myDisabledElementId = false;
//
// And in html:
//
//     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = {};

// Returns the options for an element or undefined if none available.
Dropzone.optionsForElement = function (element) {
	// Get the `Dropzone.options.elementId` for this element if it exists
	if (element.getAttribute("id")) {
		return Dropzone.options[camelize(element.getAttribute("id"))];
	} else {
		return undefined;
	}
};

// Holds a list of all dropzone instances
Dropzone.instances = [];

// Returns the dropzone for given element if any
Dropzone.forElement = function (element) {
	if (typeof element === "string") {
		element = document.querySelector(element);
	}
	if ((element != null ? element.dropzone : undefined) == null) {
		throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
	}
	return element.dropzone;
};

// Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.
Dropzone.autoDiscover = true;

// Looks for all .dropzone elements and creates a dropzone for them
Dropzone.discover = function () {
	var dropzones = void 0;
	if (document.querySelectorAll) {
		dropzones = document.querySelectorAll(".dropzone");
	} else {
		dropzones = [];
		// IE :(
		var checkElements = function checkElements(elements) {
			return function () {
				var result = [];
				var _iteratorNormalCompletion32 = true;
				var _didIteratorError32 = false;
				var _iteratorError32 = undefined;

				try {
					for (var _iterator32 = elements[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
						var el = _step32.value;

						if (/(^| )dropzone($| )/.test(el.className)) {
							result.push(dropzones.push(el));
						} else {
							result.push(undefined);
						}
					}
				} catch (err) {
					_didIteratorError32 = true;
					_iteratorError32 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion32 && _iterator32.return) {
							_iterator32.return();
						}
					} finally {
						if (_didIteratorError32) {
							throw _iteratorError32;
						}
					}
				}

				return result;
			}();
		};
		checkElements(document.getElementsByTagName("div"));
		checkElements(document.getElementsByTagName("form"));
	}

	return function () {
		var result = [];
		var _iteratorNormalCompletion33 = true;
		var _didIteratorError33 = false;
		var _iteratorError33 = undefined;

		try {
			for (var _iterator33 = dropzones[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
				var dropzone = _step33.value;

				// Create a dropzone unless auto discover has been disabled for specific element
				if (Dropzone.optionsForElement(dropzone) !== false) {
					result.push(new Dropzone(dropzone));
				} else {
					result.push(undefined);
				}
			}
		} catch (err) {
			_didIteratorError33 = true;
			_iteratorError33 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion33 && _iterator33.return) {
					_iterator33.return();
				}
			} finally {
				if (_didIteratorError33) {
					throw _iteratorError33;
				}
			}
		}

		return result;
	}();
};

// Since the whole Drag'n'Drop API is pretty new, some browsers implement it,
// but not correctly.
// So I created a blacklist of userAgents. Yes, yes. Browser sniffing, I know.
// But what to do when browsers *theoretically* support an API, but crash
// when using it.
//
// This is a list of regular expressions tested against navigator.userAgent
//
// ** It should only be used on browser that *do* support the API, but
// incorrectly **
//
Dropzone.blacklistedBrowsers = [
// The mac os and windows phone version of opera 12 seems to have a problem with the File drag'n'drop API.
/opera.*(Macintosh|Windows Phone).*version\/12/i];

// Checks if the browser is supported
Dropzone.isBrowserSupported = function () {
	var capableBrowser = true;

	if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
		if (!("classList" in document.createElement("a"))) {
			capableBrowser = false;
		} else {
			// The browser supports the API, but may be blacklisted.
			var _iteratorNormalCompletion34 = true;
			var _didIteratorError34 = false;
			var _iteratorError34 = undefined;

			try {
				for (var _iterator34 = Dropzone.blacklistedBrowsers[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
					var regex = _step34.value;

					if (regex.test(navigator.userAgent)) {
						capableBrowser = false;
						continue;
					}
				}
			} catch (err) {
				_didIteratorError34 = true;
				_iteratorError34 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion34 && _iterator34.return) {
						_iterator34.return();
					}
				} finally {
					if (_didIteratorError34) {
						throw _iteratorError34;
					}
				}
			}
		}
	} else {
		capableBrowser = false;
	}

	return capableBrowser;
};

Dropzone.dataURItoBlob = function (dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob
	return new Blob([ab], { type: mimeString });
};

// Returns an array without the rejected item
var without = function without(list, rejectedItem) {
	return list.filter(function (item) {
		return item !== rejectedItem;
	}).map(function (item) {
		return item;
	});
};

// abc-def_ghi -> abcDefGhi
var camelize = function camelize(str) {
	return str.replace(/[\-_](\w)/g, function (match) {
		return match.charAt(1).toUpperCase();
	});
};

// Creates an element from string
Dropzone.createElement = function (string) {
	var div = document.createElement("div");
	div.innerHTML = string;
	return div.childNodes[0];
};

// Tests if given element is inside (or simply is) the container
Dropzone.elementInside = function (element, container) {
	if (element === container) {
		return true;
	} // Coffeescript doesn't support do/while loops
	while (element = element.parentNode) {
		if (element === container) {
			return true;
		}
	}
	return false;
};

Dropzone.getElement = function (el, name) {
	var element = void 0;
	if (typeof el === "string") {
		element = document.querySelector(el);
	} else if (el.nodeType != null) {
		element = el;
	}
	if (element == null) {
		throw new Error('Invalid `' + name + '` option provided. Please provide a CSS selector or a plain HTML element.');
	}
	return element;
};

Dropzone.getElements = function (els, name) {
	var el = void 0,
	    elements = void 0;
	if (els instanceof Array) {
		elements = [];
		try {
			var _iteratorNormalCompletion35 = true;
			var _didIteratorError35 = false;
			var _iteratorError35 = undefined;

			try {
				for (var _iterator35 = els[Symbol.iterator](), _step35; !(_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done); _iteratorNormalCompletion35 = true) {
					el = _step35.value;

					elements.push(this.getElement(el, name));
				}
			} catch (err) {
				_didIteratorError35 = true;
				_iteratorError35 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion35 && _iterator35.return) {
						_iterator35.return();
					}
				} finally {
					if (_didIteratorError35) {
						throw _iteratorError35;
					}
				}
			}
		} catch (e) {
			elements = null;
		}
	} else if (typeof els === "string") {
		elements = [];
		var _iteratorNormalCompletion36 = true;
		var _didIteratorError36 = false;
		var _iteratorError36 = undefined;

		try {
			for (var _iterator36 = document.querySelectorAll(els)[Symbol.iterator](), _step36; !(_iteratorNormalCompletion36 = (_step36 = _iterator36.next()).done); _iteratorNormalCompletion36 = true) {
				el = _step36.value;

				elements.push(el);
			}
		} catch (err) {
			_didIteratorError36 = true;
			_iteratorError36 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion36 && _iterator36.return) {
					_iterator36.return();
				}
			} finally {
				if (_didIteratorError36) {
					throw _iteratorError36;
				}
			}
		}
	} else if (els.nodeType != null) {
		elements = [els];
	}

	if (elements == null || !elements.length) {
		throw new Error('Invalid `' + name + '` option provided. Please provide a CSS selector, a plain HTML element or a list of those.');
	}

	return elements;
};

// Asks the user the question and calls accepted or rejected accordingly
//
// The default implementation just uses `window.confirm` and then calls the
// appropriate callback.
Dropzone.confirm = function (question, accepted, rejected) {
	if (window.confirm(question)) {
		return accepted();
	} else if (rejected != null) {
		return rejected();
	}
};

// Validates the mime type like this:
//
// https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
Dropzone.isValidFile = function (file, acceptedFiles) {
	if (!acceptedFiles) {
		return true;
	} // If there are no accepted mime types, it's OK
	acceptedFiles = acceptedFiles.split(",");

	var mimeType = file.type;
	var baseMimeType = mimeType.replace(/\/.*$/, "");

	var _iteratorNormalCompletion37 = true;
	var _didIteratorError37 = false;
	var _iteratorError37 = undefined;

	try {
		for (var _iterator37 = acceptedFiles[Symbol.iterator](), _step37; !(_iteratorNormalCompletion37 = (_step37 = _iterator37.next()).done); _iteratorNormalCompletion37 = true) {
			var validType = _step37.value;

			validType = validType.trim();
			if (validType.charAt(0) === ".") {
				if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
					return true;
				}
			} else if (/\/\*$/.test(validType)) {
				// This is something like a image/* mime type
				if (baseMimeType === validType.replace(/\/.*$/, "")) {
					return true;
				}
			} else {
				if (mimeType === validType) {
					return true;
				}
			}
		}
	} catch (err) {
		_didIteratorError37 = true;
		_iteratorError37 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion37 && _iterator37.return) {
				_iterator37.return();
			}
		} finally {
			if (_didIteratorError37) {
				throw _iteratorError37;
			}
		}
	}

	return false;
};

// Augment jQuery
if (typeof jQuery !== 'undefined' && jQuery !== null) {
	jQuery.fn.dropzone = function (options) {
		return this.each(function () {
			return new Dropzone(this, options);
		});
	};
}

if (typeof module !== 'undefined' && module !== null) {
	module.exports = Dropzone;
} else {
	window.Dropzone = Dropzone;
}

// Dropzone file status codes
Dropzone.ADDED = "added";

Dropzone.QUEUED = "queued";
// For backwards compatibility. Now, if a file is accepted, it's either queued
// or uploading.
Dropzone.ACCEPTED = Dropzone.QUEUED;

Dropzone.UPLOADING = "uploading";
Dropzone.PROCESSING = Dropzone.UPLOADING; // alias

Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";

/*

 Bugfix for iOS 6 and 7
 Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
 based on the work of https://github.com/stomita/ios-imagefile-megapixel

 */

// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
var detectVerticalSquash = function detectVerticalSquash(img) {
	var iw = img.naturalWidth;
	var ih = img.naturalHeight;
	var canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = ih;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	var _ctx$getImageData = ctx.getImageData(1, 0, 1, ih),
	    data = _ctx$getImageData.data;

	// search image edge pixel position in case it is squashed vertically.


	var sy = 0;
	var ey = ih;
	var py = ih;
	while (py > sy) {
		var alpha = data[(py - 1) * 4 + 3];

		if (alpha === 0) {
			ey = py;
		} else {
			sy = py;
		}

		py = ey + sy >> 1;
	}
	var ratio = py / ih;

	if (ratio === 0) {
		return 1;
	} else {
		return ratio;
	}
};

// A replacement for context.drawImage
// (args are for source and destination).
var drawImageIOSFix = function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
	var vertSquashRatio = detectVerticalSquash(img);
	return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

// Based on MinifyJpeg
// Source: http://www.perry.cz/files/ExifRestorer.js
// http://elicon.blog57.fc2.com/blog-entry-206.html

var ExifRestore = function () {
	function ExifRestore() {
		_classCallCheck(this, ExifRestore);
	}

	_createClass(ExifRestore, null, [{
		key: 'initClass',
		value: function initClass() {
			this.KEY_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		}
	}, {
		key: 'encode64',
		value: function encode64(input) {
			var output = '';
			var chr1 = undefined;
			var chr2 = undefined;
			var chr3 = '';
			var enc1 = undefined;
			var enc2 = undefined;
			var enc3 = undefined;
			var enc4 = '';
			var i = 0;
			while (true) {
				chr1 = input[i++];
				chr2 = input[i++];
				chr3 = input[i++];
				enc1 = chr1 >> 2;
				enc2 = (chr1 & 3) << 4 | chr2 >> 4;
				enc3 = (chr2 & 15) << 2 | chr3 >> 6;
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
				if (!(i < input.length)) {
					break;
				}
			}
			return output;
		}
	}, {
		key: 'restore',
		value: function restore(origFileBase64, resizedFileBase64) {
			if (!origFileBase64.match('data:image/jpeg;base64,')) {
				return resizedFileBase64;
			}
			var rawImage = this.decode64(origFileBase64.replace('data:image/jpeg;base64,', ''));
			var segments = this.slice2Segments(rawImage);
			var image = this.exifManipulation(resizedFileBase64, segments);
			return 'data:image/jpeg;base64,' + this.encode64(image);
		}
	}, {
		key: 'exifManipulation',
		value: function exifManipulation(resizedFileBase64, segments) {
			var exifArray = this.getExifArray(segments);
			var newImageArray = this.insertExif(resizedFileBase64, exifArray);
			var aBuffer = new Uint8Array(newImageArray);
			return aBuffer;
		}
	}, {
		key: 'getExifArray',
		value: function getExifArray(segments) {
			var seg = undefined;
			var x = 0;
			while (x < segments.length) {
				seg = segments[x];
				if (seg[0] === 255 & seg[1] === 225) {
					return seg;
				}
				x++;
			}
			return [];
		}
	}, {
		key: 'insertExif',
		value: function insertExif(resizedFileBase64, exifArray) {
			var imageData = resizedFileBase64.replace('data:image/jpeg;base64,', '');
			var buf = this.decode64(imageData);
			var separatePoint = buf.indexOf(255, 3);
			var mae = buf.slice(0, separatePoint);
			var ato = buf.slice(separatePoint);
			var array = mae;
			array = array.concat(exifArray);
			array = array.concat(ato);
			return array;
		}
	}, {
		key: 'slice2Segments',
		value: function slice2Segments(rawImageArray) {
			var head = 0;
			var segments = [];
			while (true) {
				var length;
				if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 218) {
					break;
				}
				if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 216) {
					head += 2;
				} else {
					length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
					var endPoint = head + length + 2;
					var seg = rawImageArray.slice(head, endPoint);
					segments.push(seg);
					head = endPoint;
				}
				if (head > rawImageArray.length) {
					break;
				}
			}
			return segments;
		}
	}, {
		key: 'decode64',
		value: function decode64(input) {
			var output = '';
			var chr1 = undefined;
			var chr2 = undefined;
			var chr3 = '';
			var enc1 = undefined;
			var enc2 = undefined;
			var enc3 = undefined;
			var enc4 = '';
			var i = 0;
			var buf = [];
			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				console.warn('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
			while (true) {
				enc1 = this.KEY_STR.indexOf(input.charAt(i++));
				enc2 = this.KEY_STR.indexOf(input.charAt(i++));
				enc3 = this.KEY_STR.indexOf(input.charAt(i++));
				enc4 = this.KEY_STR.indexOf(input.charAt(i++));
				chr1 = enc1 << 2 | enc2 >> 4;
				chr2 = (enc2 & 15) << 4 | enc3 >> 2;
				chr3 = (enc3 & 3) << 6 | enc4;
				buf.push(chr1);
				if (enc3 !== 64) {
					buf.push(chr2);
				}
				if (enc4 !== 64) {
					buf.push(chr3);
				}
				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
				if (!(i < input.length)) {
					break;
				}
			}
			return buf;
		}
	}]);

	return ExifRestore;
}();

ExifRestore.initClass();

/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */

// @win window reference
// @fn function reference
var contentLoaded = function contentLoaded(win, fn) {
	var done = false;
	var top = true;
	var doc = win.document;
	var root = doc.documentElement;
	var add = doc.addEventListener ? "addEventListener" : "attachEvent";
	var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
	var pre = doc.addEventListener ? "" : "on";
	var init = function init(e) {
		if (e.type === "readystatechange" && doc.readyState !== "complete") {
			return;
		}
		(e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) {
			return fn.call(win, e.type || e);
		}
	};

	var poll = function poll() {
		try {
			root.doScroll("left");
		} catch (e) {
			setTimeout(poll, 50);
			return;
		}
		return init("poll");
	};

	if (doc.readyState !== "complete") {
		if (doc.createEventObject && root.doScroll) {
			try {
				top = !win.frameElement;
			} catch (error) {}
			if (top) {
				poll();
			}
		}
		doc[add](pre + "DOMContentLoaded", init, false);
		doc[add](pre + "readystatechange", init, false);
		return win[add](pre + "load", init, false);
	}
};

// As a single function to be able to write tests.
Dropzone._autoDiscoverFunction = function () {
	if (Dropzone.autoDiscover) {
		return Dropzone.discover();
	}
};
contentLoaded(window, Dropzone._autoDiscoverFunction);

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
	if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
		return transform(obj, methodName);
	} else {
		return undefined;
	}
}

var DeploymentLog = function (_React$Component) {
	_inherits(DeploymentLog, _React$Component);

	function DeploymentLog(props) {
		_classCallCheck(this, DeploymentLog);

		var _this45 = _possibleConstructorReturn(this, (DeploymentLog.__proto__ || Object.getPrototypeOf(DeploymentLog)).call(this, props));

		_this45.state = { items: [], nonce: 0 };
		return _this45;
	}

	_createClass(DeploymentLog, [{
		key: 'tick',
		value: function tick() {
			var items = [];
			var component = this;
			var applicationId =  $("#application_id").val();

			axios.get("/deploy_histories?q[application_id]=" + applicationId).then(function (histories) {
				items = histories.data.map(function (item) {
					return { version: item.bundle_name, timestamp: new Date(item.CreatedAt) };
				});

				component.setState(function (prevState) {
					return {
						nonce: prevState.nonce + 1,
						items: items };
				});
			}).catch(function (error) {
				console.log(error);
			});
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this46 = this;

			this.interval = setInterval(function () {
				return _this46.tick();
			}, 5000);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			clearInterval(this.interval);
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'list-group mb-3', id: 'deploymentlog' },
				React.createElement(
					'h6',
					{ className: 'list-group-header' },
					'Deployment Log'
				),
				React.createElement(LogItem, { items: this.state.items })
			);
		}
	}]);

	return DeploymentLog;
}(React.Component);

var LogItem = function (_React$Component2) {
	_inherits(LogItem, _React$Component2);

	function LogItem() {
		_classCallCheck(this, LogItem);

		return _possibleConstructorReturn(this, (LogItem.__proto__ || Object.getPrototypeOf(LogItem)).apply(this, arguments));
	}

	_createClass(LogItem, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				this.props.items.map(function (item) {
					return React.createElement(
						'a',
						{ key: item.version, className: 'list-group-item list-group-item-action justify-content-between d-flex', href: '#' },
						React.createElement(
							'span',
							null,
							item.version
						),
						React.createElement(
							'span',
							{ className: 'text-muted' },
							item.timestamp.toGMTString()
						)
					);
				})
			);
		}
	}]);

	return LogItem;
}(React.Component);

ReactDOM.render(React.createElement(DeploymentLog, null), document.getElementById('deploymentlog'));
}();
