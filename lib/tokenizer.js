"use strict";
/*!
 * elasticlunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
/**
 * A function for splitting a string into tokens.
 * Currently English is supported as default.
 * Uses `elasticlunr.tokenizer.seperator` to split strings, you could change
 * the value of this property to set how you want strings are split into tokens.
 * IMPORTANT: use elasticlunr.tokenizer.seperator carefully, if you are not familiar with
 * text process, then you'd better not change it.
 *
 * @module
 * @param {String} str The string that you want to tokenize.
 * @see elasticlunr.tokenizer.seperator
 * @return {Array}
 */
exports.tokenizer = function (str) {
    if (!arguments.length || str === null || str === undefined)
        return [];
    if (Array.isArray(str)) {
        var arr = str.filter(function (token) {
            if (token === null || token === undefined) {
                return false;
            }
            return true;
        });
        arr = arr.map(function (t) {
            return utils_1.utils.toString(t).toLowerCase();
        });
        var out = [];
        arr.forEach(function (item) {
            var tokens = item.split(exports.tokenizer.seperator);
            out = out.concat(tokens);
        }, this);
        return out;
    }
    return str.toString().trim().toLowerCase().split(exports.tokenizer.seperator);
};
/**
 * Default string seperator.
 */
exports.tokenizer.defaultSeperator = /[\s\-]+/;
/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `elasticlunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see elasticlunr.tokenizer
 */
exports.tokenizer.seperator = exports.tokenizer.defaultSeperator;
/**
 * Set up customized string seperator
 *
 * @param {Object} sep The customized seperator that you want to use to tokenize a string.
 */
exports.tokenizer.setSeperator = function (sep) {
    if (sep !== null && sep !== undefined && typeof (sep) === 'object') {
        exports.tokenizer.seperator = sep;
    }
};
/**
 * Reset string seperator
 *
 */
exports.tokenizer.resetSeperator = function () {
    exports.tokenizer.seperator = exports.tokenizer.defaultSeperator;
};
/**
 * Get string seperator
 *
 */
exports.tokenizer.getSeperator = function () { return exports.tokenizer.seperator; };
