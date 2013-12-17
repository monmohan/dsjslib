(function () {
    "use strict";
    var PriorityQueue = require('./PriorityQueue');

    /**
     * @class DelayQueue
     * @classdesc Queue of 'Delayed' items, item can only be taken when its delay has expired
     * The head of the queue is that Delayed item whose delay expired furthest in the past.
     * If no delay has expired there is no head and poll() will return null.
     * Expiration occurs when the supplied delayFn(item) returns a value less than or equal to zero.
     * Even though unexpired items cannot be removed using take() or poll(), they are otherwise treated as normal item.
     * For example, the size method returns the count of both expired and unexpired items.
     * This queue does not permit null items.
     * This queue requires a delay function while construction
     * [Reference: DelayQueue in Oracle JDK](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/DelayQueue.html)
     * @augments PriorityQueue
     * @param delayFn  {DelayQueue~userDelayFn} A user provided delay function
     * @desc
     * ####Example
     * ```js
     * var DelayQueue = require("dsjslib").DelayQueue
     * var dq=new DelayQueue(function(task){
     *     return task.schedule - Date.now();
     * })
     * ```
     */
    function DelayQueue(delayFn) {
        if (typeof delayFn !== 'function') {
            throw new Error('A delay function must be provided to construct' +
                'a DelayQueue');
        }
        this._delayFn = delayFn;
        PriorityQueue.call(this, function (inQ, objToAdd) {
            var dInQ = delayFn.call(null, inQ),
                dObjToAdd = delayFn.call(null, objToAdd);
            return dInQ > dObjToAdd ?
                1 : dInQ < dObjToAdd ?
                -1 : 0;

        });

    }

    DelayQueue.prototype = new PriorityQueue();
    var _super = PriorityQueue.prototype;

    /**
     * Returns and removes the element at the head of the queue . Re-heapifies the queue..
     * The head of this queue is the element whose delay expires furthest in the past
     * if there is no such element with negative or zero expired delay, this method returns null
     * @memberOf DelayQueue
     * @instance
     * @returns {*} Element whose delay expires furthest in the past
     */
    DelayQueue.prototype.poll = function () {
        var head = this.peek();
        return head && this._delayFn(head) <= 0 ?
            _super.poll.call(this) : null;
    };

    /**
     * Retrieve and remove the head of queue when it expires. Unlike poll() which returns immediately with either null
     * or the head element (if it has expired), this method registers the user callback which will be invoked when
     * the an item is available i.e. delay has expired.
     * @memberOf DelayQueue
     * @instance
     * @param callback {DelayQueue~onAvailableCb}
     */
    DelayQueue.prototype.take = function (callback) {
        var head = this.peek(),
            dq = this,
            timeLeft = head ? this._delayFn(head) : 0;
        if (timeLeft > 0) {
            setTimeout(function () {
                dq.take(callback);
            }, timeLeft);
        } else {
            var err = null;
            try {
                head = _super.poll.call(dq);
            } catch (e) {
                err = e;
            }
            setTimeout(function () {
                callback(err, head);
            }, 0);
        }
    };

    module.exports = DelayQueue;

    /**
     * A user provided delay function for ordering of elements in queue
     * @callback DelayQueue~userDelayFn
     * @param queueElement {*}
     * @returns The function should return a negative integer, zero, or a positive integer depending on how much time remains
     * before the item is expired. The argument to the function is the item for which delay is being queried
     */

    /**
     * The callback is asynchronous and takes two arguments err and item
     * err contains any error encountered and item is the head object once its available.
     * @callback DelayQueue~onAvailableCb
     * @param err {Error} if any, null otherwise
     * @param item {*} head element once available
     */

}());