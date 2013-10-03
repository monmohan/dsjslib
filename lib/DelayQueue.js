(function () {
    "use strict";
    var PriorityQueue = require('./PriorityQueue');

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
        this._waiters = [];
    }

    DelayQueue.prototype = new PriorityQueue();
    var _super = PriorityQueue.prototype;

    DelayQueue.prototype.poll = function () {
        var head = this.peek();
        return head && this._delayFn(head) <= 0 ?
            _super.poll.call(this) : null;
    };


    DelayQueue.prototype.take = function (callback) {
        var head = this.peek(),
            dq = this,
            timeLeft = head ? this._delayFn(head) : 0;
        if (timeLeft > 0) {
            setTimeout(function () {
                dq.take(callback);
            }, timeLeft);
        } else {
            head = _super.poll.call(dq);
            setTimeout(function () {
                callback(head);
            }, 0);
        }
    };

    module.exports = DelayQueue;

}());