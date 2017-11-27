"use strict";
var elasticlunr_1 = require("./elasticlunr");
var configuration_1 = require("./configuration");
var document_store_1 = require("./document_store");
var event_emitter_1 = require("./event_emitter");
var indexr_1 = require("./indexr");
var inverted_indexr_1 = require("./inverted_indexr");
var pipeline_1 = require("./pipeline");
var stemmer_1 = require("./stemmer");
var trimmer_1 = require("./trimmer");
var utils_1 = require("./utils");
var stop_word_filter_1 = require("./stop_word_filter");
var sorted_set_1 = require("./sorted_set");
var elasticlunr = elasticlunr_1.init;
elasticlunr.Configuration = configuration_1.Configuration;
elasticlunr.DocumentStore = document_store_1.DocumentStore;
elasticlunr.EventEmitter = event_emitter_1.EventEmitter;
elasticlunr.Index = indexr_1.Index;
elasticlunr.InvertedIndex = inverted_indexr_1.InvertedIndex;
elasticlunr.Pipeline = pipeline_1.Pipeline;
elasticlunr.stemmer = stemmer_1.stemmer;
elasticlunr.trimmer = trimmer_1.trimmer;
elasticlunr.utils = utils_1.utils;
elasticlunr.addStopWords = stop_word_filter_1.addStopWords;
elasticlunr.clearStopWords = stop_word_filter_1.clearStopWords;
elasticlunr.defaultStopWords = stop_word_filter_1.defaultStopWords;
elasticlunr.resetStopWords = stop_word_filter_1.resetStopWords;
elasticlunr.stopWordFilter = stop_word_filter_1.stopWordFilter;
elasticlunr.version = '@VERSION';
// only used this to make elasticlunr.js compatible with lunr-languages
// this is a trick to define a global alias of elasticlunr
(function (global) {
    global.lunr = elasticlunr;
    /**
     * sorted_set.js is added only to make elasticlunr.js compatible with lunr-languages.
     * if elasticlunr.js support different languages by default, this will make elasticlunr.js
     * much bigger that not good for browser usage.
     */
    global.lunr.SortedSet = sorted_set_1.SortedSet;
})(this);
module.exports = elasticlunr;
