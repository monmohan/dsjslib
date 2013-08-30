/**
 * Guava style LRU cache
 * @param cachespec
 *
 * @constructor
 */
(function(){
"use strict";
function Cache(cachespec) {
    this._configure(cachespec);
    this._init();
}

Cache.prototype._REMOVAL_CAUSE_I = 'explicit';
Cache.prototype._REMOVAL_CAUSE_C = 'capacity';
Cache.prototype._REMOVAL_CAUSE_E = 'expired';

Cache.prototype._configure = function (inSpec) {
    this._spec = {};
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

    this._spec = {
        'loaderFn' : (typeof inSpec.loaderFunction === 'function') && inSpec.loaderFunction,
        'expiresAfterWrite'/*miliseconds*/ : (typeof inSpec.expiresAfterWrite === 'number') ? inSpec.expiresAfterWrite * 1000 :
            null,
        'recordStats' : inSpec.recordStats,
        'maxSize' : maxSize,
        'maxWeight' : maxWeight,
        'weighFn' : weighFn,
        "onRemove" : typeof inSpec.onRemove === 'function' && inSpec.onRemove //listener for entry removal
    };
};

Cache.prototype._init = function () {
    this._headEntry = Object.create(Entry.prototype);
    this._tailEntry = this._headEntry;
    this.size = 0;
    this.weight = 0;
    this._cache = Object.create(null);
    Object.defineProperty(this,'stats',{
        value:{'hitCount' : 0, 'missCount' : 0, 'requestCount' : 0},
        configurable:true});

};

function Entry(key, value, prev, next) {
    this.key = key;
    this.setValue(value);
    this.prev = prev;
    this.next = next;
    this.writeTime = Date.now();
}

Entry.prototype.setValue = function (v) {
    //we can allow falsey values except undefined and null
    if (v === undefined || v === null) {
        throw new Error('Illegal value for key ' + v);
    }
    this.value = v;

};

Entry.prototype.moveToHead = function (cache) {
    var head = cache._headEntry;
    this.next = head;
    head.prev = this;
    cache._headEntry = this;

};

Entry.prototype.remove = function (cache) {
    var ePrev = this.prev,
        next = this.next;
    if (ePrev) {
        ePrev.next = next;
        next.prev = ePrev;
    } else/*removing head*/{
        cache._headEntry = this.next;
        delete next.prev;
    }
    if (!next.next) {
        //move tail
        cache._tailEntry = next;
    }
    this.next = this.prev = null;

};

Entry.prototype.isExpired = function (cache) {
    var exp = cache._spec.expiresAfterWrite,
        now = Date.now();
    return (exp && exp > 0) && ((now - this.writeTime) > exp);

};

Entry.prototype.forEach = function (traversalFn) {
    var entry = this;
    while (entry) {
        traversalFn.call(this, entry);
        entry = entry.next;
    }
};


Cache.prototype.put = function (key, value) {
    var exists = this._cache[key];
    if (!exists) {
        this._createEntry(key, value);
    } else {
        exists.setValue(value);
        exists.writeTime = Date.now();
        this._promoteEntry(exists);
    }


};

Cache.prototype._createEntry = function (key, value) {
    var entry = new Entry(key, value);
    this._cleanup();
    this._cache[key] = entry;
    this._updateCacheSize(entry, true);
    entry.moveToHead(this);
    return entry;
};

Cache.prototype._updateCacheSize = function (entry, incr) {
    var w, s;
    if (this._spec.maxWeight) {
        w = this._spec.weighFn.apply(this, [entry.key, entry.value]);
        this.weight += incr ? w : -w;
    }
    this.size += incr ? 1 : -1;

};

Cache.prototype._promoteEntry = function (entry) {
    if (entry.prev/*is not head entry already*/) {
        entry.remove(this);
        entry.moveToHead(this);
    }
};

/**
 *
 * @param key
 * @return {*}
 */
Cache.prototype.get = function (key, nl/*suppress loading*/) {
    this.stats.requestCount++;
    var entry = this._cache[key],
        ret;
    if (entry) {
        if (!entry.isExpired(this)) {
            this._promoteEntry(entry);
            ret = entry.value;
            this.stats.hitCount++;
        } else {
            if (this._spec.loaderFn && !nl) {
                ret=this._spec.loaderFn.apply(this/*use cache object as this*/, [key]);
                entry.setValue(ret);
                this._promoteEntry(entry);
                this._notify(entry, this._REMOVAL_CAUSE_E);
            } else {
                this._rmEntry(entry, this._REMOVAL_CAUSE_E);
            }

        }
    } else {
        if (this._spec.loaderFn && !nl) {
            ret=this._spec.loaderFn.apply(this/*use cache object as this*/, [key]);
            this._createEntry(key,ret);
        }
        this.stats.missCount++;
    }
    return ret;
};

Cache.prototype.getIfPresent = function (key) {
    return this.get(key, true);

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
    entry.remove(this);
    this._updateCacheSize(entry, false);
    delete this._cache[entry.key];
    this._notify(entry, cause);

};

/**
 * Invalidate all entries
 * Doesn't clean the stats
 */
Cache.prototype.invalidateAll = function () {
    delete this._headEntry;
    delete this._tailEntry;
    delete this._cache;
    this._init();

};

/**
 * Clean if a write will take the cache beyond max size or weight
 * @private
 */
Cache.prototype._cleanup = function () {
    var lruEntry = this._tailEntry;
    while (lruEntry && this._canReap()) {
        if (lruEntry.prev) {
            this._rmEntry(lruEntry.prev, this._REMOVAL_CAUSE_C);
            lruEntry = lruEntry.prev;
        }
    }

};

/**
 * Can we remove entries
 * @return {*}
 * @private
 */
Cache.prototype._canReap = function () {
    return (this._spec.maxSize && this.size >= this._spec.maxSize) ||
        (this._spec.maxWeight && this.weight > this._spec.maxWeight);
} ;


module.exports = Cache;
}());




