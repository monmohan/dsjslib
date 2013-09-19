(function () {
    "use strict";
    function PriorityQueue(compareFn) {
        this._queue = [];
    }

    var _compare = function (c1, c2) {
        return c1 > c2 ? 1 : c1 < c2 ? -1 : 0;

    };

    PriorityQueue.prototype.size = function () {
        return this._queue.length;
    };

    PriorityQueue.prototype.offer = function (obj) {
        var idx = this._queue.length;
        this._queue.push(obj);
        siftUp.apply(this, [obj, idx]);

    };

    PriorityQueue.prototype.poll = function () {
        var obj = this._queue[0];
        if (this._queue.length > 1) {
            this._queue[0] = this._queue.pop();
            siftDown.apply(this, [this._queue[0], 0]);
        } else {
            obj = this._queue.pop();
        }
        return obj;
    };

    PriorityQueue.prototype.peek = function () {
        return this._queue[0];
    };

    var siftUp = function (item, idx) {
        while (idx > 0) {
            var pIdx = (idx - 1) >>> 1,
                parent = this._queue[pIdx];
            if (_compare(item, parent) > 0) {
                this._queue[pIdx] = item;
                this._queue[idx] = parent;
                siftUp.call(this, item, idx = pIdx);
            } else {
                break;
            }
        }
    };

    var siftDown = function (item, idx) {
        var half = this.size() >>> 1;
        while (idx < half) {
            var nextIdx = 2 * idx + 1,
                child = this._queue[nextIdx],
                right = this._queue[nextIdx + 1];
            if (right && _compare(right, child) > 0) {
                child = right;
                nextIdx = nextIdx + 1;
            }

            if (_compare(child, item) > 0) {
                this._queue[nextIdx] = item;
                this._queue[idx] = child;
            } else {
                break;
            }

            siftDown.call(this, item, idx = nextIdx);
        }
    };
    module.exports = PriorityQueue;
}());