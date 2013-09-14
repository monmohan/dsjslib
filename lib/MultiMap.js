(function () {
    "use strict";
    /**
     * MultiMap, a map from key --> [values]
     * @constructor
     */
    function MultiMap() {
        this._mmap = Object.create(null);
        this.size = 0;
    }

    MultiMap.prototype.put = function (key, value) {
        var values = this._mmap[key],
            success = true;
        values = values || [];
        try {
            _add(values, value);
            this._mmap[key] = values;
            this.size++;

        } catch (Err) {
            success = false;
        }
        return success;

    };

    var _add = function (col, value) {
        col.push(value);
    };

    MultiMap.prototype.get = function (key) {
        return this._mmap[key];
    };

    MultiMap.prototype.remove = function (key, value) {
        var values = this._mmap[key],
            index;
        if (values) {
            values.every(function (v, i) {
                if (v === value) {
                    index = i;
                    return false;
                }
                return true;
            });
        }
        return index && values.splice(index, 1);

    };

    MultiMap.prototype.entries = function () {
        var entries = [];

        Object.keys(this._mmap).forEach(function (k) {
            entries.push({'key' : k, 'values' : this._mmap[k]});
        }, this);

        return entries;

    }
    module.exports = MultiMap;
}());