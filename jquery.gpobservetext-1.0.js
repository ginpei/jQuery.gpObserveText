/**
 * jQuery.gpObserveText 1.0
 * http://ginpen.com/jquery/gpobservetext/
 * https://github.com/ginpei/jQuery.gpObserveText
 *
 * Copyright (c) 2011 Takanashi Ginpei
 * http://ginpen.com
 *
 * Released under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
    try {
        if (window.com.ginpen.gpObserveText) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }

    var gpObserveText = com.ginpen.gpObserveText = {
        /**
         * The version of this applycation.
         * @type String
         */
        VERSION: '1.0',

        /**
         * Common settings.
         * @type Object
         */
        settings: {
            interval: 100
        },

        /**
         * Init target
         * @param {HtmlElement} $el The target.
         * @param {Function} [listener] Event listener.
         */
        exec: function($el, listener) {
            if (listener && this._isCommand(listener)) {
                var command = listener;
                this.runCommand($el, command);
            }
            else {
                this.startObserving($el);
                $el.bind('textchange', listener);
            }
        },

        /**
         * Return true if param is not listener function.
         * @param {*} param The value specified by user.
         * @returns {Boolean}
         */
        _isCommand: function(param) {
            return !$.isFunction(param);
        },

        /**
         * Run command.
         * @param {HtmlElement} $el
         * @param {String} command
         */
        runCommand: function($el, command) {
            switch (command) {
                case 'destroy':
                    this.stopObserving($el);
                    break;
            }
        },

        /**
         * Start observing.
         * @param {HtmlElement} $el
         */
        startObserving: function($el) {
            if (this._isObserved($el)) {
                return;
            }

            $el.data('gpObserveText.lastValue', $el.val());
            this._observe($el);
        },

        _observe: function($el) {
            $el.data('gpObserveText.timer', setTimeout(function() {
                if (gpObserveText._isChanged($el)) {
                    gpObserveText._fire($el);
                }
                if (gpObserveText._isObserved($el)) {
                    gpObserveText._observe($el);
                }
            }, gpObserveText.settings.interval));
        },

        /**
         * Return true if the element is observed.
         * @param {HtmlElement} $el
         * @returns {Boolean}
         */
        _isObserved: function($el) {
            return !!$el.data('gpObserveText.timer');
        },

        /**
         * Clean up.
         * @param {HtmlElement} $el
         */
        stopObserving: function($el) {
            clearTimeout($el.data('gpObserveText.timer'));
            $el.removeData('gpObserveText.timer');
            $el.removeData('gpObserveText.lastValue');
        },

        /**
         * Return true if value is changed.
         * @param {HtmlElement} $el
         * @returns {Boolean}
         */
        _isChanged: function($el) {
            return $el.val() != $el.data('gpObserveText.lastValue');
        },

        /**
         * Fire event.
         * @param {HtmlElement} $el
         */
        _fire: function($el) {
            var value = $el.val();
            $el.trigger('textchange', $el.data('gpObserveText.lastValue'));
            $el.data('gpObserveText.lastValue', value);
        },

        banpei: null
    };

    // jQuery method interface
    $.fn.gpObserveText = function(settings) {
        return this.each(function(i, el) {
            gpObserveText.exec($(el), settings);
        });
    };

    // Alias for common settings.
    $.fn.gpObserveText.settings = gpObserveText.settings;
}(jQuery));
