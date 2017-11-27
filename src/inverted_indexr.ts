/*!
 * elasticlunr.InvertedIndex
 * Copyright (C) @YEAR Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

export type Root = { [index: string]: any; docs: any; df: number };

export class InvertedIndex {
  root: Root;

  /**
   * elasticlunr.InvertedIndex is used for efficiently storing and
   * lookup of documents that contain a given token.
   *
   * @constructor
   */
  constructor() {
    this.root = { docs: {}, df: 0 };
  }

  /**
   * Loads a previously serialised inverted index.
   *
   * @param {Object} serialisedData The serialised inverted index to load.
   * @return {elasticlunr.InvertedIndex}
   */
  static load(serialisedData: any) {
    var idx = new this;
    idx.root = serialisedData.root;

    return idx;
  }

  /**
   * Adds a {token: tokenInfo} pair to the inverted index.
   * If the token already exist, then update the tokenInfo.
   *
   * tokenInfo format: { ref: 1, tf: 2}
   * tokenInfor should contains the document's ref and the tf(token frequency) of that token in
   * the document.
   *
   * By default this function starts at the root of the current inverted index, however
   * it can start at any node of the inverted index if required.
   *
   * @param {String} token 
   * @param {Object} tokenInfo format: { ref: 1, tf: 2}
   * @param {Object} root An optional node at which to start looking for the
   * correct place to enter the doc, by default the root of this elasticlunr.InvertedIndex
   * is used.
   * @memberOf InvertedIndex
   */
  addToken(token: string, tokenInfo: any, root: Root) {
    var root = root || this.root,
      idx = 0;

    while (idx <= token.length - 1) {
      var key = token[idx];

      if (!(key in root)) root[key] = { docs: {}, df: 0 };
      idx += 1;
      root = root[key];
    }

    var docRef = tokenInfo.ref;
    if (!root.docs[docRef]) {
      // if this doc not exist, then add this doc
      root.docs[docRef] = { tf: tokenInfo.tf };
      root.df += 1;
    } else {
      // if this doc already exist, then update tokenInfo
      root.docs[docRef] = { tf: tokenInfo.tf };
    }
  }

  /**
   * Checks whether a token is in this elasticlunr.InvertedIndex.
   * 
   *
   * @param {String} token The token to be checked
   * @return {Boolean}
   * @memberOf InvertedIndex
   */
  hasToken(token: string) {
    if (!token) return false;

    var node = this.root;

    for (var i = 0; i < token.length; i++) {
      if (!node[token[i]]) return false;
      node = node[token[i]];
    }

    return true;
  }

  /**
   * Retrieve a node from the inverted index for a given token.
   * If token not found in this InvertedIndex, return null.
   * 
   *
   * @param {String} token The token to get the node for.
   * @return {Object}
   * @see InvertedIndex.prototype.get
   * @memberOf InvertedIndex
   */
  getNode(token: string) {
    if (!token) return null;

    var node = this.root;

    for (var i = 0; i < token.length; i++) {
      if (!node[token[i]]) return null;
      node = node[token[i]];
    }

    return node;
  }

  /**
   * Retrieve the documents of a given token.
   * If token not found, return {}.
   *
   *
   * @param {String} token The token to get the documents for.
   * @return {Object}
   * @memberOf InvertedIndex
   */
  getDocs(token: string) {
    var node = this.getNode(token);
    if (node == null) {
      return {};
    }

    return node.docs;
  }

  /**
   * Retrieve term frequency of given token in given docRef.
   * If token or docRef not found, return 0.
   *
   *
   * @param {String} token The token to get the documents for.
   * @param {String|Integer} docRef
   * @return {Integer}
   * @memberOf InvertedIndex
   */
  getTermFrequency(token: string, docRef: string | number) {
    var node = this.getNode(token);

    if (node == null) {
      return 0;
    }

    if (!(docRef in node.docs)) {
      return 0;
    }

    return node.docs[docRef].tf as number;
  }

  /**
   * Retrieve the document frequency of given token.
   * If token not found, return 0.
   *
   *
   * @param {String} token The token to get the documents for.
   * @return {Integer}
   * @memberOf InvertedIndex
   */
  getDocFreq(token: string) {
    var node = this.getNode(token);

    if (node == null) {
      return 0;
    }

    return node.df;
  }

  /**
   * Remove the document identified by document's ref from the token in the inverted index.
   *
   *
   * @param {String} token Remove the document from which token.
   * @param {String} ref The ref of the document to remove from given token.
   * @memberOf InvertedIndex
   */
  removeToken(token: string, ref: string) {
    if (!token) return;
    var node = this.getNode(token);

    if (node == null) return;

    if (ref in node.docs) {
      delete node.docs[ref];
      node.df -= 1;
    }
  }

  /**
   * Find all the possible suffixes of given token using tokens currently in the inverted index.
   * If token not found, return empty Array.
   *
   * @param {String} token The token to expand.
   * @return {Array}
   * @memberOf InvertedIndex
   */
  expandToken(token: string, memo?: any[], root?: Root) {
    if (token == null || token == '') return [];
    var memo = memo || [];

    if (root == void 0) {
      root = this.getNode(token);
      if (root == null) return memo;
    }

    if (root.df > 0) memo.push(token);

    for (var key in root) {
      if (key === 'docs') continue;
      if (key === 'df') continue;
      this.expandToken(token + key, memo, root[key]);
    }

    return memo;
  }

  /**
   * Returns a representation of the inverted index ready for serialisation.
   *
   * @return {Object}
   * @memberOf InvertedIndex
   */
  toJSON() {
    return {
      root: this.root
    };
  }
}

