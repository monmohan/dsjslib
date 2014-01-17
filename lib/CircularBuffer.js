(function () {
    "use strict";
    /**
     * @class CircularBuffer
     * @classdesc Implementation of a CircularBuffer
     * The term circular buffer (also called a ring or cyclic buffer) refers to an area in memory
     * which is used to store incoming data.
     * When the buffer is filled, new data is written starting at the beginning of the buffer and overwriting the old.
     * [Reference: CircularBuffer in Boost](http://www.boost.org/doc/libs/1_55_0/doc/html/circular_buffer.html)
     * @param capacity {Number=} default is 32
     */
    function CircularBuffer(capacity) {
        this._capacity = typeof capacity === 'number'
            && capacity !== 0 ? capacity : 32;
        this._end = 0;
        this._st = -1;
        this._buf = [];
    }

    /**
     * Add data to buffer. This will overwrite older items
     * if the buffer is full
     * @memberOf CircularBuffer
     * @instance
     * @param obj Item being added , null and undefined are not supported
     * @returns this {CircularBuffer}
     */
    CircularBuffer.prototype.add = function (obj) {
        if (obj === undefined || obj === null)throw new Error("Null/Undefined values are not supported");
        this._buf[this._end] = obj;
        if (this._end === this._st || this._st === -1) {
            //advance head
            this._st++;
            this._st %= this._capacity;
        }
        this._end++;
        this._end %= this._capacity;
        return this;
    }
    /**
     * Remove the least recent item from the buffer
     * @memberOf CircularBuffer
     * @instance
     */
    CircularBuffer.prototype.remove = function () {
        var obj = this._buf[this._st],
            sz = this.size();
        switch (sz) {
            case 0:
                break;
            case 1:
                delete this._buf[this._st];
                this._st = -1;
                break;
            default:
                delete this._buf[this._st];
                this._st++;
                this._st %= this._capacity;

        }
        return obj;

    }

    /**
     * Get the item at given index. Returns null if no
     * item exists at given index.
     * @memberOf CircularBuffer
     * @param index {Number} index to fetch
     * @return {*}  item at given index
     */
    CircularBuffer.prototype.get = function (index) {
        if (index >= this.size())return null;
        return this._buf[(this._st + index) % this._capacity];

    }

    /**
     * Return the total number of items in the buffer.
     * this will always be <=  buffer capacity
     * @memberOf CircularBuffer
     * @instance
     * @returns {Number} count of items in buffer
     */
    CircularBuffer.prototype.size = function () {
        return this._st === -1 ? 0 :
            this._end > this._st ? this._end - this._st :
                (this._capacity - this._st) + this._end;

    }

    /**
     * Check if the buffer is full
     * @memberOf CircularBuffer
     * @instance
     * @returns {boolean} True if buffer is full
     */
    CircularBuffer.prototype.isFull = function () {
        return this.size() === this._capacity;
    }

    /**
     * Check if the buffer is empty
     * @memberOf CircularBuffer
     * @instance
     * @returns {boolean} True if buffer is empty
     */
    CircularBuffer.prototype.isEmpty = function () {
        return this.size() === 0;
    }

    /**
     * Clear the contents of this buffer
     * @memberOf CircularBuffer
     * @instance
     *
     */
    CircularBuffer.prototype.clear = function () {
        this._st = -1;
        this._end = 0;
    }

    /**
     * Get all buffer entries
     * @memberOf CircularBuffer
     * @instance
     * @returns {Array} Array of all entries in Buffer
     */
    CircularBuffer.prototype.entries = function () {
        var start = this._st,
            end= (this._end || this._capacity)-1,
            entries = [];
        while (start != -1 && start <= end) {
            entries.push(this._buf[start++]);
        }
        return entries;
    }

    /**
     * Get the first element
     *
     * @memberOf CircularBuffer
     * @instance
     * @return {*}  first element, null if buffer is empty
     */
    CircularBuffer.prototype.front = function () {
        return this.get(0);

    }

    /**
     * Get the last element
     *
     * @memberOf CircularBuffer
     * @instance
     * @return {*}  last element, null if buffer is empty
     */
    CircularBuffer.prototype.back = function () {
        return this.isEmpty()?null:
            this._buf[(this._end || this._capacity)-1];


    }


    module.exports = CircularBuffer;

})();