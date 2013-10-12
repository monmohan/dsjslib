(function () {
    "use strict";
    function LinkedDeque(capacity) {
        this._capacity = typeof capacity === 'number' ? capacity : Number.MAX_VALUE;
        this.tail = this.head = null;
        this._size = 0;
    }

    function QEntry(prev, obj, next) {
        if (typeof obj === 'undefined' || obj === null) {
            throw new Error('Null or Undefined values are not supported');
        }
        this.item = obj;
        this.prev = prev;
        this.next = next;
    }

    LinkedDeque.prototype.unshift =
        LinkedDeque.prototype.offerFirst = function (item) {
            if (this._size >= this._capacity)return false;
            var head = this.head,
                entry = new QEntry(null, item, head);
            if (!this.tail) {
                this.tail = entry;
            } else {
                head.prev = entry;
            }
            this.head = entry;
            this._size++;
            return true;
        };

    LinkedDeque.prototype.push =
        LinkedDeque.prototype.offerLast = function (item) {
            if (this._size >= this._capacity)return false;
            var tail = this.tail,
                entry = new QEntry(tail, item, null);
            if (!this.head) {
                this.head = entry;
            } else {
                tail.next = entry;
            }
            this.tail = entry;
            this._size++;
            return true;
        };

    LinkedDeque.prototype.shift =
        LinkedDeque.prototype.pollFirst = function () {
            if (this._size <= 0)return null;
            var ret = this.head,
                next = ret.next;
            if (!next) {
                this.head = this.tail = null;
            } else {
                next.prev = null;
                ret.next = null;
            }
            this.head = next;
            this._size--;
            return ret.item;
        };

    LinkedDeque.prototype.pop =
        LinkedDeque.prototype.pollLast = function () {
            if (this._size <= 0)return null;
            var ret = this.tail,
                prev = ret.prev;
            if (!prev) {
                this.head = this.tail = null;
            } else {
                prev.next = null;
                ret.prev = null;
            }
            this.tail = prev;
            this._size--;
            return ret.item;
        };

    LinkedDeque.prototype.toArray = function () {
        var head = this.head,
            arr = [];
        while (head) {
            arr.push(head.item);
            head = head.next;
        }
        return arr;
    };

    LinkedDeque.prototype.size = function () {
        return this._size;
    };


    module.exports=LinkedDeque;

}());