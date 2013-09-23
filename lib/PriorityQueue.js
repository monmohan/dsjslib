(function () {
    "use strict";
    function PriorityQueue(compareFn) {
        this._queue = [];
        this._compFn =
            typeof compareFn === 'function' ? function (inQ, objToAdd) {
                return compareFn.call(null, inQ, objToAdd);
            } : function (inQ, objToAdd) {
                return (inQ < objToAdd ? 1 : inQ > objToAdd ? -1 : 0);
            };

    }


    PriorityQueue.prototype.size = function () {
        return this._queue.length;
    };

    PriorityQueue.prototype.offer = function (obj) {
        var idx = this._queue.length;
        this._queue.push(obj);
        siftUp.apply(this._queue, [obj, idx, this._compFn]);
        return this;

    };

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

    PriorityQueue.prototype.clear = function () {
        this._queue = [];
    };

    PriorityQueue.prototype.entries = function () {
        return this._queue.slice(0);
    };

    module.exports = PriorityQueue;

}());