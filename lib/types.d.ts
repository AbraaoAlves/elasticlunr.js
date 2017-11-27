import { Index } from "./indexr";
import { Configuration } from "./configuration";
import { DocumentStore } from "./document_store";
import { EventEmitter } from "./event_emitter";
import { InvertedIndex } from "./inverted_indexr";
import { Pipeline } from "./pipeline";
import { stemmer } from "./stemmer";
import { trimmer } from "./trimmer";
import { utils } from "./utils";
import { addStopWords, clearStopWords, defaultStopWords, resetStopWords, StopWordFilter } from "./stop_word_filter";
export interface Elasticlunr {
    (config: Function): Index;
    version: string;
    Configuration: typeof Configuration;
    DocumentStore: typeof DocumentStore;
    EventEmitter: typeof EventEmitter;
    Index: typeof Index;
    InvertedIndex: typeof InvertedIndex;
    Pipeline: typeof Pipeline;
    stemmer: typeof stemmer;
    trimmer: typeof trimmer;
    utils: typeof utils;
    addStopWords: typeof addStopWords;
    clearStopWords: typeof clearStopWords;
    defaultStopWords: typeof defaultStopWords;
    resetStopWords: typeof resetStopWords;
    stopWordFilter: StopWordFilter;
}
