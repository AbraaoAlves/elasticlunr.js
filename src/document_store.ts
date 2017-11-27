/*!
 * elasticlunr.DocumentStore
 * Copyright (C) @YEAR Wei Song
 */

export type DocRef = number | string; 
export interface SerialisedData {
  docs: any;
  length: number;
  docInfo: any;
  save: boolean;
}

export class DocumentStore<T extends any> {
  private _save: boolean;
  public docs: {[index :string]: T};
  public docInfo: any;
  public length: number;

  /**
   * elasticlunr.DocumentStore is a simple key-value document store used for storing sets of tokens for
   * documents stored in index.
   *
   * elasticlunr.DocumentStore store original JSON format documents that you could build search snippet by this original JSON document.
   *
   * user could choose whether original JSON format document should be store, if no configuration then document will be stored defaultly.
   * If user care more about the index size, user could select not store JSON documents, then this will has some defects, such as user
   * could not use JSON document to generate snippets of search results.
   *
   * @param {Boolean} save If the original JSON document should be stored.
   * @constructor
   * @module
   */
  constructor(save?: boolean) {
    if (save === null || save === undefined) {
      this._save = true;
    } else {
      this._save = save;
    }

    this.docs = {} as any;
    this.docInfo = {};
    this.length = 0;
  }

  /**
   * Loads a previously serialised document store
   *
   * @param {Object} serialisedData The serialised document store to load.
   * @return {DocumentStore}
   */
  static load(serialisedData: SerialisedData) {
    var store = new DocumentStore();
  
    store.length = serialisedData.length;
    store.docs = serialisedData.docs;
    store.docInfo = serialisedData.docInfo;
    store._save = serialisedData.save;
  
    return store;
  }

  /**
   * check if current instance store the original doc
   *
   * @return {Boolean}
   */
  isDocStored() {
    return this._save;
  };
  
  /**
   * Stores the given doc in the document store against the given id.
   * If docRef already exist, then update doc.
   *
   * Document is store by original JSON format, then you could use original document to generate search snippets.
   *
   * @param {Integer|String} docRef The key used to store the JSON format doc.
   * @param {Object} doc The JSON format doc.
   */
  addDoc(docRef: DocRef, doc: any) {
    if (!this.hasDoc(docRef)) this.length++;
  
    if (this._save === true) {
      this.docs[docRef] = clone(doc);
    } else {
      this.docs[docRef] = null;
    }
  };
  
  /**
   * Retrieves the JSON doc from the document store for a given key.
   *
   * If docRef not found, return null.
   * If user set not storing the documents, return null.
   *
   * @param {Integer|String} docRef The key to lookup and retrieve from the document store.
   * @return {Object}
   * @memberOf DocumentStore
   */
  getDoc(docRef: DocRef) {
    if (this.hasDoc(docRef) === false) return null;
    return this.docs[docRef];
  };
  
  /**
   * Checks whether the document store contains a key (docRef).
   *
   * @param {Integer|String} docRef The id to look up in the document store.
   * @return {Boolean}
   * @memberOf DocumentStore
   */
  hasDoc(docRef: DocRef) {
    return docRef in this.docs;
  }
  
  /**
   * Removes the value for a key in the document store.
   *
   * @param {Integer|String} docRef The id to remove from the document store.
   * @memberOf DocumentStore
   */
  removeDoc(docRef: DocRef) {
    if (!this.hasDoc(docRef)) return;
  
    delete this.docs[docRef];
    delete this.docInfo[docRef];
    this.length--;
  }
  
  /**
   * Add field length of a document's field tokens from pipeline results.
   * The field length of a document is used to do field length normalization even without the original JSON document stored.
   *
   * @param {Integer|String} docRef document's id or reference
   * @param {String} fieldName field name
   * @param {Integer} length field length
   */
  addFieldLength(docRef: DocRef, fieldName: string, length: number) {
    if (docRef === null || docRef === undefined) return;
    if (this.hasDoc(docRef) == false) return;
  
    if (!this.docInfo[docRef]) this.docInfo[docRef] = {};
    this.docInfo[docRef][fieldName] = length;
  }
  
  /**
   * Update field length of a document's field tokens from pipeline results.
   * The field length of a document is used to do field length normalization even without the original JSON document stored.
   *
   * @param {Integer|String} docRef document's id or reference
   * @param {String} fieldName field name
   * @param {Integer} length field length
   */
  updateFieldLength(docRef?: DocRef, fieldName?: string, length?: number) {
    if (docRef === null || docRef === undefined) return;
    if (this.hasDoc(docRef) == false) return;
  
    this.addFieldLength(docRef, fieldName, length);
  }
  
  /**
   * get field length of a document by docRef
   *
   * @param {Integer|String} docRef document id or reference
   * @param {String} fieldName field name
   * @return {Integer} field length
   */
  getFieldLength(docRef?: DocRef, fieldName?: string) {
    if (docRef === null || docRef === undefined) return 0;
  
    if (!(docRef in this.docs)) return 0;
    if (!(fieldName in this.docInfo[docRef])) return 0;
    return this.docInfo[docRef][fieldName];
  }
  
  /**
   * Returns a JSON representation of the document store used for serialisation.
   *
   * @return {Object} JSON format
   * @memberOf DocumentStore
   */
  toJSON() {
    return {
      docs: this.docs,
      docInfo: this.docInfo,
      length: this.length,
      save: this._save
    };
  }
}

/**
 * Cloning object
 *
 * @param {Object} object in JSON format
 * @return {Object} copied object
 */
function clone(obj) {
  if (null === obj || "object" !== typeof obj) return obj;

  var copy = obj.constructor();

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }

  return copy;
}
