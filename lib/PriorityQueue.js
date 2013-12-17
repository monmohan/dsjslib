(function () {
    "use strict";
    /**
     * @class PriorityQueue
     * @classdesc A queue backed by a Binary Heap. Basic queue operation offer and poll run in O(lgn) time.
     * The elements in this queue are ordered according to their natural ordering or
     * based on the compare function provided.
     * [Reference: PriorityQueue in Oracle JDK](http://docs.oracle.com/javase/7/docs/api/java/util/PriorityQueue.html)
     * @param compareFn {userCompareFn=} optional external ordering function for priority of elements
     * @desc
     * #### Example -
     * ```js
     * var PriorityQueue = require("dsjslib").PriorityQueue
     * var pq=new PriorityQueue(function(w1,w2){
     *      return w1.weight - w2.weight;
     * })
     * ```
     */
    function PriorityQueue(compareFn) {
        this._queue = [];
        this._compFn =
            typeof compareFn === 'function' ? function (inQ, objToAdd) {
                return compareFn.call(null, inQ, objToAdd);
            } : function (inQ, objToAdd) {
                return (inQ < objToAdd ? 1 : inQ > objToAdd ? -1 : 0);
            };

    }

    /**
     * @memberOf PriorityQueue.prototype
     * @instance
     * @returns {Number} number of elements in the queue
     */
    PriorityQueue.prototype.size = function () {
        return this._queue.length;
    };

    /**
     * @memberOf PriorityQueue.prototype
     * @instance
     * @param obj Insert the object in queue. Re-heapifies the queue.
     * @return {PriorityQueue} this
     */
    PriorityQueue.prototype.offer = function (obj) {
        var idx = this._queue.length;
        this._queue.push(obj);
        siftUp.apply(this._queue, [obj, idx, this._compFn]);
        return this;

    };

    /**
     * Returns and removes the element at the head of the queue
     * @memberOf PriorityQueue.prototype
     * @instance
     * @return {*} Returns and removes the element at the head of the queue . Re-heapifies the queue..
     * The head of this queue is the maximum element with respect to the specified ordering. If multiple elements
     * are tied for max value, the head is one of those elements -- ties are broken arbitrarily.
     */
    PriorityQueue.prototype.poll = function () {
        var obj = this._queue[0];
        if (this._queue.length > 1) {
            this._queue[0] = this._queue.pop();
            siftDown.apply(this._queue, [this._queue[0], 0, this._compFn]);
        } else {
            obj = this._queue.pop();
        }
        return obj;
    };

    /**
     * Returns, without removing, the element at the head of the queue
     * @memberOf PriorityQueue.prototype
     * @instance
     * @return {*} Returns the element at the head of the queue .
     * The head of this queue is the maximum element with respect to the specified ordering. If multiple elements
     * are tied for max value, the head is one of those elements -- ties are broken arbitrarily.
     */
    PriorityQueue.prototype.peek = function () {
        return this._queue[0];
    };

    var siftUp = function (item, idx, compFn) {
        while (idx > 0) {
            var pIdx = (idx - 1) >>> 1,
                parent = this[pIdx];
            if (compFn(parent, item) > 0) {
                this[pIdx] = item;
                this[idx] = parent;
                idx = pIdx;
            } else {
                break;
            }
        }
    };

    var siftDown = function (item, idx, compFn) {
        var half = this.length >>> 1;
        while (idx < half) {
            var nextIdx = 2 * idx + 1,
                child = this[nextIdx],
                right = this[nextIdx + 1];
            if (right && compFn(child, right) > 0) {
                child = right;
                nextIdx = nextIdx + 1;
            }

            if (compFn(item, child) > 0) {
                this[nextIdx] = item;
                this[idx] = child;
            } else {
                break;
            }

            idx = nextIdx;
        }
    };

    /**
     * Cleanup and remove all elements from the queue
     * @memberOf PriorityQueue.prototype
     * @instance
     */
    PriorityQueue.prototype.clear = function () {
        this._queue = [];
    };

    /**
     * @memberOf PriorityQueue.prototype
     * @instance
     * @return {Array} Returns array of elements in the queue.
     * Ordering of those elements in undefined
     */
    PriorityQueue.prototype.entries = function () {
        return this._queue.slice(0);
    };

    module.exports = PriorityQueue;

}());