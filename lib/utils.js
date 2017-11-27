"use strict";
/*!
 * elasticlunr.utils
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A namespace containing utils for the rest of the elasticlunr library
 */
exports.utils = {
    /**
     * Print a warning message to the console.
     *
     * @param {String} message The message to be printed.
     * @memberOf Utils
     */
    warn: (function (global) {
        return function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (global.console && console.warn) {
                console.warn.apply(console, [message].concat(args));
            }
        };
    })(this),
    /**
     * Convert an object to string.
     *
     * In the case of `null` and `undefined` the function returns
     * an empty string, in all other cases the result of calling
     * `toString` on the passed object is returned.
     *
     * @param {object} obj The object to convert to a string.
     * @return {String} string representation of the passed object.
     * @memberOf Utils
     */
    toString: function (obj) {
        if (obj === void 0 || obj === null) {
            return '';
        }
        return obj.toString();
    },
};
