(function () {
    "use strict";
    /**
     * MultiMap, a map from key --> [values]
     * @constructor
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


    MultiMap.prototype.put = function (key, value) {
        var values = this._mmap.get(key);
        values = values || [];
        values.push(value);
        this._mmap.set(key, values);
        this.size++;
        return this;

    };


    MultiMap.prototype.get = function (key) {
        if (!this._mmap.get(key)) {
            this._mmap.set(key, []);

        }
        return this._mmap.get(key);

    };

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

    MultiMap.prototype.hasKey = function (key) {
        var v = this._mmap.get(key);
        return (typeof v !== 'undefined') && v !== null;
    };


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