/**
 * Guava style LRU cache with
 * recording statistics
 * @param cachespec
 * @constructor
 */
function Cache(cachespec) {
    var default_capacity = Number.MAX_VALUE;
    this._cachespec = {
        'maximumSize' : cachespec.maximumSize || default_capacity,
        'loaderFunction' : cachespec.loaderFunction || null,
        'expiresAfterWrite' : cachespec.expiresAfterWrite || -1,
        'recordStats' : cachespec.recordStats
    };

    this._init();
}

Cache.prototype._init = function () {
    this._headEntry = new Entry();
    this._tailEntry = this._headEntry;
    this.size = 0;
    this._cache = Object.create(null);

}

function Entry(key, value, prev, next) {
    this.key = key;
    this.value = value;
    this.prev = prev;
    this.next = next;
    this.writeTime = Date.now();
}

Entry.prototype.moveToHead = function (cache) {
    var head = cache._headEntry;
    this.next = head;
    head.prev = this;
    cache._headEntry = this;

}
Entry.prototype.remove = function (cache) {
    var ePrev = this.prev,
        next = this.next;
    if (ePrev) {
        ePrev.next = this.next;
        this.next.prev = ePrev;
    }
    if (!next.next) {
        //move tail
        cache._tailEntry = next;
    }
    this.next = this.prev = null;

}

Entry.prototype.isExpired = function (cache) {
    var exp = cache._cachespec.expiresAfterWrite,
        now = Date.now;
    return (exp && exp > 0) && ((now - this.writeTime) > exp)

}
Entry.prototype.forEach = function (traversalFn) {
    var entry = this;
    while (entry) {
        traversalFn.call(this, entry);
        entry = entry.next;
    }
}


Cache.prototype.put = function (key, value) {
    var entry = new Entry(key, value),
        exists = this._cache[key];
    if (!exists) {
        this._cleanup();
        this._cache[key] = entry;
        this.size++
        entry.moveToHead(this);
    } else {
        exists.value = value;
        if (exists.prev)exists.moveToHead(this);
    }


}

Cache.prototype.get = function (key) {
    var entry = this._cache[key],
        ret;
    if (entry) {
        if (entry.prev/*is not head entry already*/) {
            entry.remove();
            entry.moveToHead(this);
        }
        ret = entry.value;
    }
    return ret;
}

Cache.prototype.invalidate = function (key) {
    var entry = this._cache[key];
    this._rmEntry(entry)

}
Cache.prototype._rmEntry = function (entry) {
    entry.remove(this);
    this.size--;
    delete this._cache[entry.key];

}

Cache.prototype.invalidateAll = function () {
    delete this._headEntry;
    delete this._tailEntry;
    delete this._cache;
    this._init();

}

Cache.prototype._cleanup = function () {
    var lruEntry = this._tailEntry;
    while (lruEntry && (this.size >= this._cachespec.maximumSize)) {
        if (lruEntry.prev) {
            this._rmEntry(lruEntry.prev);
            lruEntry = lruEntry.prev;
        }
    }

}

module.exports = Cache;





