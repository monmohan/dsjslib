(function () {
    "use strict";
    /**
     * @class MultiMap
     * @classdesc A Map supporting arbitrary multiple values with a single key.
     * (key --> [values])
     */
    function MultiMap() {
        this._mmap = {
            'wrapped' : Object.create(null),
            'get' : function (k) {
                return this.wrapped[k];
            },
            'set' : function (k, v) {
                this.wrapped[k] = v;
            },
            'delete' : function (k) {
                delete this.wrapped[k];
            },
            'keys' : function () {
                return Object.keys(this.wrapped);
            }

        };
        this.size = 0;
    }

    /**
     * Insert a key value pair into the Map.
     * If the key is already present, the value will be added to the existing list,
     * otherwise, an array is created and the value is added to the array
     * @memberOf MultiMap.prototype
     * @instance
     * @param key {String|Number}
     * @param value {*}
     * @returns {MultiMap} this
     */
    MultiMap.prototype.put = function (key, value) {
        var values = this._mmap.get(key);
        values = values || [];
        values.push(value);
        this._mmap.set(key, values);
        this.size++;
        return this;

    };

    /**
     * Search for key and return associated value array or empty array
     * This method never returns null even if the key is not present
     * Any changes made to the returned array modify the underlying array in the MultiMap as well
     * @memberOf MultiMap.prototype
     * @param key
     * @return {Array} associated value Array
     */
    MultiMap.prototype.get = function (key) {
        if (!this._mmap.get(key)) {
            this._mmap.set(key, []);

        }
        return this._mmap.get(key);

    };
    /**
     * If a value is provided, only that value is removed from the list
     * If value is not provided, key and all values are deleted from the MultiMap
     * @memberOf MultiMap.prototype
     * @param key {String|Number}
     * @param value {*}
     * @return {Array} last value associated with the key
     */
    MultiMap.prototype.remove = function (key, value) {
        var values = this._mmap.get(key),
            index = null,
            lasVal;
        if (values) {
            if (typeof value !== 'undefined') {
                values.every(function (v, i) {
                    if (v === value) {
                        index = i;
                        return false;
                    }
                    return true;
                });
                lasVal = index !== null ? values.splice(index, 1) : [];
            } else {
                this._mmap['delete'](key);
                lasVal = values;
            }
        }
        return lasVal;

    };

    /**
     * Test if a key is present in Map or not. This doesn't modify the Map to create empty array if
     * the key was not present.
     * @memberOf MultiMap.prototype
     * @param key
     * @returns {Boolean} true if key is present, false otherwise
     */
    MultiMap.prototype.hasKey = function (key) {
        var v = this._mmap.get(key);
        return (typeof v !== 'undefined') && v !== null;
    };

    /**
     * Return a list of all key, value pairs.
     * The key value pairs are returned as objects {'key':<K>,'value':<V>}
     * Note that for keys associated with multiple values there is one object per value returned in the entry
     * for example for key1->val1,val2,val3 , the entries will be
     * [{'key':key1,'value':val1},{'key':key1,'value':val2},{'key':key1,'value':val3}]
     * @memberOf MultiMap.prototype
     * @instance
     * @returns {Array} Array of objects  {'key':<K>,'value':<V>}
     */
    MultiMap.prototype.entries = function () {
        var entries = [];

        this._mmap.keys().forEach(function (k) {
            this._mmap.get(k).forEach(function (v) {
                entries.push({'key' : k, 'value' : v});
            });

        }, this);

        return entries;

    };
    module.exports = MultiMap;
}());