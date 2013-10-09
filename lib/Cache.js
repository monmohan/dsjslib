/**
 * Guava style LRU cache
 * @param cachespec
 *
 * @constructor
 */
(function () {
    "use strict";
    function Cache(cachespec) {
        var that = this;

        function configure(inSpec) {
            var maxWeight = inSpec.maximumWeight,
                weighFn = inSpec.weigherFunction,
                maxSize = inSpec.maximumSize,
                isMaxW = typeof maxWeight === 'number' && maxWeight > -1,
                isWFn = typeof weighFn === 'function';

            if ((!isMaxW && isWFn) || (isMaxW && !isWFn)) {
                throw new Error("Maximum weight or weight function has illegal values");
            }
            if (isMaxW && isWFn && typeof maxSize === 'number' && maxSize > -1) {
                throw new Error('Both max weight and size can\'t be configured');
            }

            that._spec = {
                'loaderFn' : (typeof inSpec.loaderFunction === 'function') && inSpec.loaderFunction,
                'expiresAfterWrite'/*miliseconds*/ : (typeof inSpec.expiresAfterWrite === 'number') ? inSpec.expiresAfterWrite * 1000 :
                    null,
                'recordStats' : inSpec.recordStats,
                'maxSize' : maxSize,
                'maxWeight' : maxWeight,
                'weighFn' : weighFn,
                "onRemove" : typeof inSpec.onRemove === 'function' && inSpec.onRemove //listener for entry removal
            };
        }

        configure(cachespec);
        _init.apply(this);

    }

    Cache.prototype._REMOVAL_CAUSE_I = 'explicit';
    Cache.prototype._REMOVAL_CAUSE_C = 'capacity';
    Cache.prototype._REMOVAL_CAUSE_E = 'expired';



    var _init = function () {
        this._accessQueue = new Queue('A');
        this._writeQueue = this._spec.expiresAfterWrite ? (new Queue('W')) : null;
        var accessCleanup = cleanupQ(this._REMOVAL_CAUSE_C, this._canReap, this._accessQueue, this),
            writeCleanup = cleanupQ(this._REMOVAL_CAUSE_E, this.isExpired, this._writeQueue, this);

        this._cleanup = function (condition) {
            accessCleanup(condition);
            writeCleanup(this._writeQueue);

        };
        this.size = 0;
        this.weight = 0;
        this._cache = Object.create(null);
        Object.defineProperty(this, 'stats', {
            value : {'hitCount' : 0, 'missCount' : 0, 'requestCount' : 0},
            configurable : true});

        function cleanupQ(cause, cleanupFn, queue, cache) {
            if (queue) {
                return (function (prefnarg) {
                    if (prefnarg) {
                        var lruEntry = queue.tail.prev(queue),
                            next = null;

                        while (lruEntry && cleanupFn.apply(cache, [lruEntry])) {
                            if (lruEntry) {
                                next = lruEntry.prev(queue);
                                cache._rmEntry(lruEntry, cause);
                                lruEntry = next;
                            }
                        }
                    }

                }).bind(queue);
            } else {
                return function () {
                };
            }

        }


    };

    function Queue(type) {
        this.tail = this.head = Object.create(Entry.prototype);
        this.type = type;
    }

    function Entry(key, value, loading, onLoadCb) {
        this.key = key;
        this.loading = loading;
        if (!loading) {
            this.setValue(value);
        }
        this.onLoad = onLoadCb ? [onLoadCb] : [];
        this.writeTime = Date.now();
    }

    Entry.prototype.setValue = function (v) {
        //we can allow falsey values except undefined and null
        if (v === undefined || v === null) {
            throw new Error('Illegal value for key ' + v);
        }
        this.value = v;
        this.writeTime = Date.now();

    };

    Entry.prototype.moveToHead = function (queues) {
        var entry = this;
        queues.forEach(function (queue) {
            if (queue) {
                var head = queue.head;
                entry.next(queue, head);
                head.prev(queue, entry);
                queue.head = entry;
            }
        });

    };

    Entry.prototype.next = function (queue, e) {
        var next = 'next' + queue.type;
        if (typeof e !== 'undefined') {
            this[next] = e;
        }
        return this[next];
    };

    Entry.prototype.prev = function (queue, e) {
        var prev = 'prev' + queue.type;
        if (typeof e !== 'undefined') {
            this[prev] = e;
        }
        return this[prev];
    };


    Entry.prototype.remove = function (queue) {
        if (queue) {
            var ePrev = this.prev(queue),
                eNext = this.next(queue);
            if (ePrev) {
                ePrev.next(queue, eNext);
                eNext.prev(queue, ePrev);
            } else/*removing head*/{
                eNext.prev(queue, null);
                queue.head = eNext;
            }
            if (!eNext.next(queue)) {
                //move tail
                queue.tail = eNext;
            }
            this.next(queue, null);
            this.prev(queue, null);
        }

    };

    Entry.prototype.promote = function () {
        var entry = this;
        var queues = Array.prototype.slice.call(arguments);
        queues.forEach(function (queue) {
            if (queue && entry.prev(queue)/*is not head entry already*/) {
                entry.remove(queue);
                entry.moveToHead([queue]);
            }
        });
    };


    Entry.prototype.forEach = function (traversalFn, queue) {
        var entry = this;
        while (entry) {
            traversalFn.call(this, entry);
            entry = entry.next(queue);
        }
    };


    Cache.prototype.put = function (key, value) {
        var exists = this._cache[key];
        if (!exists) {
            this._createEntry(key, value);
        } else {
            exists.setValue(value);
            exists.writeTime = Date.now();
            exists.promote(this._accessQueue, this._writeQueue);
            this._cleanup(false);
        }


    };

    Cache.prototype._createEntry = function (key, value, loading, calback) {
        var entry = new Entry(key, value, loading, calback);
        this._cleanup(true);
        this._cache[key] = entry;
        this._updateCacheSize(entry, true);
        entry.moveToHead([this._accessQueue, this._writeQueue]);
        return entry;
    };


    Cache.prototype.isExpired = function (entry) {
        var exp = this._spec.expiresAfterWrite,
            now = Date.now();
        return !entry.loading &&
            (exp && exp > 0) &&
            ((now - entry.writeTime) > exp);

    };


    Cache.prototype._updateCacheSize = function (entry, incr) {
        var w, s;
        if (this._spec.maxWeight) {
            w = this._spec.weighFn.apply(this, [entry.key, entry.value]);
            this.weight += incr ? w : -w;
        }
        this.size += incr ? 1 : -1;

    };

    /**
     *
     * @param key
     * @return {*}
     */
    Cache.prototype.get = function (key, callback) {
        callback = callback || function () {
        };
        this.stats.requestCount++;
        var cache = this;
        process.nextTick(function () {
            _asyncGet.call(cache, key, callback);
        });

    };

    var _asyncLoad = function (cache, onLoad, key) {
        var loaderFn = cache._spec.loaderFn,
            err;
        if (loaderFn) {
            loaderFn.apply(null, [key, function (error, result) {
                onLoad(cache, error, result);

            }]);

        }
    };

    var _onLoad = function (cache, err, result) {
        if (!err) {
            try {
                this.setValue(result);
                this.promote(cache._accessQueue, cache._writeQueue);
                this.onLoad.forEach(function (callback) {
                    callback.apply(null, [err, result]);
                });
                this.onLoad = [];
                this.loading = false;
            } catch (e) {
                err = e;
            }
        }
        if (err) {
            this.onLoad.forEach(function (callback) {
                callback.apply(null, [err, result]);
            });
            cache._rmEntry(this);
        }

    };


    function _asyncGet(key, callback) {
        /*jshint validthis:true */
        var cache = this,
            entry = this._cache[key];
        if (entry) {
            if (entry.loading) {
                //record miss, register callback and return
                cache.stats.missCount++;
                entry.onLoad.push(callback);
                return;
            }
            if (!this.isExpired(entry)) {
                entry.promote(this._accessQueue);
                cache.stats.hitCount++;
                callback.apply(null, [null, entry.value]);

            } else {
                cache.stats.missCount++;
                cache._notify(entry, cache._REMOVAL_CAUSE_E);
                entry.loading = true;
                entry.onLoad.push(callback);
                _asyncLoad(cache, _onLoad.bind(entry), key);

            }
        } else {
            cache.stats.missCount++;
            entry = cache._createEntry(key, null, true, callback);
            _asyncLoad(cache, _onLoad.bind(entry), key);
        }
    }

    function _syncLoad(cache, onLoad, key) {
        var err,
            result = null,
            loaderFn = cache._spec.loaderFn;
        if (loaderFn) {
            loaderFn.apply(null, [key, function (e, r) {
                err = e;
                result = r;
            }]);
            onLoad(err, result);
        }
        return result;
    }


    /**
     *
     * @param key
     * @return {*}
     */
    Cache.prototype.getSync = function (key) {
        var suppressLoad = arguments.length > 2 && arguments[2];
        this.stats.requestCount++;
        var entry = this._cache[key],
            ret,
            cache = this;
        if (entry) {
            if (!this.isExpired(entry)) {
                entry.promote(this._accessQueue);
                ret = entry.value;
                this.stats.hitCount++;
            } else {
                this.stats.missCount++;
                if (!suppressLoad) {
                    ret = _syncLoad(cache, function (err, result) {
                        if (err)throw err;
                        cache._notify(entry, cache._REMOVAL_CAUSE_E);
                        entry.setValue(result);
                        entry.promote(cache._accessQueue, cache._writeQueue);

                    }, key);
                } else {
                    this._rmEntry(entry, this._REMOVAL_CAUSE_E);

                }

            }
        } else {
            this.stats.missCount++;
            if (!suppressLoad) {
                ret = _syncLoad(cache, function (err, result) {
                    if (err)throw err;
                    cache._createEntry(key, result);

                }, key);

            }

        }

        return ret;
    };


    Cache.prototype.getIfPresent = function (key) {
        return this.getSync(key, null, true);

    };

    /**
     * Invalidate value associated with the key
     * the given key(and associated value pair) is removed from cache
     * @param key
     */
    Cache.prototype.invalidate = function (key) {
        var entry = this._cache[key];
        this._rmEntry(entry, this._REMOVAL_CAUSE_I);

    };

    Cache.prototype._notify = function (entry, cause) {
        if (this._spec.onRemove) {
            this._spec.onRemove.apply(null, [entry.key, entry.value, cause]);
        }

    };

    /**
     * Remove a cache entry
     * @param entry
     * @private
     */
    Cache.prototype._rmEntry = function (entry, cause) {
        entry.remove(this._accessQueue);
        entry.remove(this._writeQueue);
        this._updateCacheSize(entry, false);
        delete this._cache[entry.key];
        if (cause) {
            this._notify(entry, cause);
        }


    };

    /**
     * Invalidate all entries
     * Doesn't clean the stats
     */
    Cache.prototype.invalidateAll = function () {
        delete this._accessQueue;
        delete this._writeQueue;
        delete this._cache;
        _init.apply(this);

    };


    /**
     * Can we remove entries
     * @return {*}
     * @private
     */
    Cache.prototype._canReap = function () {
        return (this._spec.maxSize && this.size >= this._spec.maxSize) ||
            (this._spec.maxWeight && this.weight > this._spec.maxWeight);
    };


    module.exports = Cache;
}());




