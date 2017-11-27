/**
 * sorted_set.js is added only to make elasticlunr.js compatible with lunr-languages.
 * if elasticlunr.js support different languages by default, this will make elasticlunr.js
 * much bigger that not good for browser usage.
 */


/*!
 * lunr.SortedSet
 * Copyright (C) @YEAR Oliver Nightingale
 */

export class SortedSet {
  length: number;
  elements: any[];

  /**
   * lunr.SortedSets are used to maintain an array of uniq values in a sorted
   * order.
   *
   * @constructor
   */
  constructor() {
    this.length = 0
    this.elements = []
  }

  /**
   * Loads a previously serialised sorted set.
   *
   * @param {Array} serialisedData The serialised set to load.
   * @returns {lunr.SortedSet}
   * @memberOf SortedSet
   */
  static load(serialisedData: any[]) {
    var set = new this

    set.elements = serialisedData
    set.length = serialisedData.length

    return set
  }


  /**
   * Inserts new items into the set in the correct position to maintain the
   * order.
   *
   * @param {Object} The objects to add to this set.
   * @memberOf SortedSet
   */
  add(...args: any[]) {
    var i, element

    for (i = 0; i < args.length; i++) {
      element = args[i]
      if (~this.indexOf(element)) continue
      this.elements.splice(this.locationFor(element), 0, element)
    }

    this.length = this.elements.length
  }

  /**
   * Converts this sorted set into an array.
   *
   * @returns {Array}
   * @memberOf SortedSet
   */
  toArray() {
    return this.elements.slice()
  }

  /**
   * Creates a new array with the results of calling a provided function on every
   * element in this sorted set.
   *
   * Delegates to Array.prototype.map and has the same signature.
   *
   * @param {Function} fn The function that is called on each element of the
   * set.
   * @param {Object} ctx An optional object that can be used as the context
   * for the function fn.
   * @returns {Array}
   * @memberOf SortedSet
   */
  map(fn: (item:any) => void, ctx: any) {
    return this.elements.map(fn, ctx)
  }

  /**
   * Executes a provided function once per sorted set element.
   *
   * Delegates to Array.prototype.forEach and has the same signature.
   *
   * @param {Function} fn The function that is called on each element of the
   * set.
   * @param {Object} ctx An optional object that can be used as the context
   * @memberOf SortedSet
   * for the function fn.
   */
  forEach(fn: (item:any) => void, ctx: any) {
    return this.elements.forEach(fn, ctx)
  }

  /**
   * Returns the index at which a given element can be found in the
   * sorted set, or -1 if it is not present.
   *
   * @param {Object} elem The object to locate in the sorted set.
   * @returns {Number}
   * @memberOf SortedSet
   */
  indexOf(elem: any) {
    var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

    while (sectionLength > 1) {
      if (pivotElem === elem) return pivot

      if (pivotElem < elem) start = pivot
      if (pivotElem > elem) end = pivot

      sectionLength = end - start
      pivot = start + Math.floor(sectionLength / 2)
      pivotElem = this.elements[pivot]
    }

    if (pivotElem === elem) return pivot

    return -1
  }

  /**
   * Returns the position within the sorted set that an element should be
   * inserted at to maintain the current order of the set.
   *
   * This function assumes that the element to search for does not already exist
   * in the sorted set.
   *
   * @param {Object} elem The elem to find the position for in the set
   * @returns {Number}
   * @memberOf SortedSet
   */
  locationFor(elem: any) {
    var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

    while (sectionLength > 1) {
      if (pivotElem < elem) start = pivot
      if (pivotElem > elem) end = pivot

      sectionLength = end - start
      pivot = start + Math.floor(sectionLength / 2)
      pivotElem = this.elements[pivot]
    }

    if (pivotElem > elem) return pivot
    if (pivotElem < elem) return pivot + 1
  }

  /**
   * Creates a new lunr.SortedSet that contains the elements in the intersection
   * of this set and the passed set.
   *
   * @param {lunr.SortedSet} otherSet The set to intersect with this set.
   * @returns {lunr.SortedSet}
   * @memberOf SortedSet
   */
  intersect(otherSet: SortedSet) {
    var intersectSet = new SortedSet,
      i = 0, j = 0,
      a_len = this.length, b_len = otherSet.length,
      a = this.elements, b = otherSet.elements

    while (true) {
      if (i > a_len - 1 || j > b_len - 1) break

      if (a[i] === b[j]) {
        intersectSet.add(a[i])
        i++ , j++
        continue
      }

      if (a[i] < b[j]) {
        i++
        continue
      }

      if (a[i] > b[j]) {
        j++
        continue
      }
    };

    return intersectSet;
  }

  /**
   * Makes a copy of this set
   *
   * @returns {SortedSet}
   * @memberOf SortedSet
   */
  clone() {
    var clone = new SortedSet()

    clone.elements = this.toArray()
    clone.length = clone.elements.length

    return clone
  }

  /**
   * Creates a new lunr.SortedSet that contains the elements in the union
   * of this set and the passed set.
   *
   * @param {SortedSet} otherSet The set to union with this set.
   * @returns {SortedSet}
   * @memberOf SortedSet
   */
  union(otherSet: SortedSet) {
    var longSet, shortSet, unionSet

    if (this.length >= otherSet.length) {
      longSet = this, shortSet = otherSet
    } else {
      longSet = otherSet, shortSet = this
    }

    unionSet = longSet.clone()

    for (var i = 0, shortSetElements = shortSet.toArray(); i < shortSetElements.length; i++) {
      unionSet.add(shortSetElements[i])
    }

    return unionSet
  }

  /**
   * Returns a representation of the sorted set ready for serialisation.
   *
   * @returns {Array}
   * @memberOf SortedSet
   */
  toJSON() {
    return this.toArray()
  }
}