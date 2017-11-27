/*!
 * elasticlunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

import { utils } from "./utils";

export interface Tokenizer {
  (str?: string) : any[];
  seperator: RegExp;
  defaultSeperator: RegExp;
  setSeperator: (set: RegExp) => void;
  resetSeperator: () => void;
  getSeperator: () => RegExp;
}

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
export const tokenizer: Tokenizer = function (str?: string) {
  if (!arguments.length || str === null || str === undefined) return [];
  if (Array.isArray(str)) {
    var arr = str.filter(function(token) {
      if (token === null || token === undefined) {
        return false;
      }

      return true;
    });

    arr = arr.map(function (t) {
      return utils.toString(t).toLowerCase();
    });

    var out = [];
    arr.forEach(function(item) {
      var tokens = item.split(tokenizer.seperator);
      out = out.concat(tokens);
    }, this);

    return out;
  }

  return str.toString().trim().toLowerCase().split(tokenizer.seperator);
} as Tokenizer;

/**
 * Default string seperator.
 */
tokenizer.defaultSeperator = /[\s\-]+/;

/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `elasticlunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see elasticlunr.tokenizer
 */
tokenizer.seperator = tokenizer.defaultSeperator;

/**
 * Set up customized string seperator
 *
 * @param {Object} sep The customized seperator that you want to use to tokenize a string.
 */
tokenizer.setSeperator = (sep: RegExp) => {
  if (sep !== null && sep !== undefined && typeof(sep) === 'object') {
    tokenizer.seperator = sep;
  }
}

/**
 * Reset string seperator
 *
 */
tokenizer.resetSeperator = () => {
  tokenizer.seperator = tokenizer.defaultSeperator;
}

/**
 * Get string seperator
 *
 */
tokenizer.getSeperator = () => tokenizer.seperator;
