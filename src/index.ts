import { init } from './elasticlunr';
import { Config, Configuration } from './configuration';
import { DocumentStore } from './document_store';
import { EventEmitter } from './event_emitter';
import { Index } from './indexr';
import { InvertedIndex } from './inverted_indexr';
import { Pipeline } from './pipeline';
import { stemmer } from './stemmer';
import { trimmer } from './trimmer';
import { utils } from './utils';
import {
  addStopWords, clearStopWords, defaultStopWords, 
  resetStopWords, stopWordFilter, StopWordFilter
} from './stop_word_filter';

import { SortedSet } from './sorted_set';
import { Elasticlunr } from './types';

const elasticlunr =<Elasticlunr> init as Elasticlunr;

elasticlunr.Configuration = Configuration;
elasticlunr.DocumentStore = DocumentStore;
elasticlunr.EventEmitter = EventEmitter;
elasticlunr.Index = Index;
elasticlunr.InvertedIndex = InvertedIndex;
elasticlunr.Pipeline = Pipeline;
elasticlunr.stemmer = stemmer;
elasticlunr.trimmer = trimmer;
elasticlunr.utils = utils;
elasticlunr.addStopWords = addStopWords;
elasticlunr.clearStopWords = clearStopWords;
elasticlunr.defaultStopWords = defaultStopWords;
elasticlunr.resetStopWords = resetStopWords;
elasticlunr.stopWordFilter = stopWordFilter;
elasticlunr.version = '@VERSION';

export = elasticlunr;

// only used this to make elasticlunr.js compatible with lunr-languages
// this is a trick to define a global alias of elasticlunr
((global: any) => {
  global.lunr = elasticlunr;

  /**
   * sorted_set.js is added only to make elasticlunr.js compatible with lunr-languages.
   * if elasticlunr.js support different languages by default, this will make elasticlunr.js
   * much bigger that not good for browser usage.
   */
  global.lunr.SortedSet = SortedSet;
})(this);
