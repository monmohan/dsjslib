/**
 * @module dsjslib
 */
exports.BTree=require('./BTree.js');
exports.AVLTree=require('./AVLTree.js');
exports.BinarySearchTree=require('./BinarySearchTree.js');
exports.RWayTrie=require('./RWayTrie.js');
exports.SkipList=require('./SkipList.js');
exports.TernarySearchTrie=require('./TernarySearchTrie.js');
exports.Cache=require('./Cache.js');
exports.PriorityQueue=require('./PriorityQueue.js');
exports.DelayQueue=require('./DelayQueue.js');
exports.MultiMap=require('./MultiMap.js');
exports.TreeMultiMap=require('./TreeMultiMap.js');
exports.BitSet=require('./BitSet.js');
exports.CircularBuffer=require('./CircularBuffer.js');
exports.DiGraph=require('./DiGraph.js');

/** GLOBAL DEFS**/
/**
 * A user supplied callback function used to order elements in the collection.
 * @callback userCompareFn
 * @type Function
 * @param arg1 {*} element existing in collection
 * @param arg2 {*} element to be added
 * @returns Should return negative integer, zero, or a positive integer as
 * the first argument is greater than, equal to, or less than the second
 */

