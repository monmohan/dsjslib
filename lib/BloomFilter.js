(function () {
    "use strict";
    var BitSet = require('../lib/BitSet.js'),
        crypto = require('crypto'),
        isNode = ( typeof module === 'object' && module.exports),
        util = isNode && require("util"),
        isDbg = isNode ? require("./logger").isDebugEnabled : function () {
        },
        _MAX_VAL_SUPPORTED = 0x7fffffff;

    /**
     * @class BloomFilter
     * @classdesc Bloom Filter is a probabilistic data structure used to test if an element is
     * a member of a set or not. False positives are possible but false negatives or not
     * i.e. if the answer to mightContain(e) is false, then the element is definetly not
     * in the set. But if the answer is true, then the element may still not be in the set
     * [For more details see] (http://billmill.org/bloomfilter-tutorial/)
     *
     * @param config {Object=} with below properties
     * {
     *     expectedInsertions:<tells the number of expected insertions in the filter, default is 1024>
     *     falsePosPercent:<acceptable false positive rate, default is 0.03>
     *     hashGenerator:<optional Hash Generator, by default
     *     the library provides a MD5 based hash generation. The hash generation uses node's crypto library.
     *     A single 128 bit hash is created which is then used to create different hashes.
     *     [See Less Hashing, Same Performance] (http://www.eecs.harvard.edu/~kirsch/pubs/bbbf/esa06.pdf)
     * }
     *
     */
    function BloomFilter(config) {
        var numInsert = config.expectedInsertions,
            falsePosPercent = config.falsePosPercent;
        this.hashGenerator = config.hashGenerator || MD5HashGen;

        this.n = typeof numInsert === 'number' ?
            Math.round(numInsert) : 1024;
        this.fpp = (falsePosPercent < 0 || falsePosPercent > 1) ? 0.05 : falsePosPercent;
        this.m = Math.round((-1 * this.n * Math.log(this.fpp)) / (Math.log(2) * Math.log(2)));
        if (this.m > _MAX_VAL_SUPPORTED)this.m = _MAX_VAL_SUPPORTED;
        this.k = Math.max(1, Math.round((this.m / this.n) * Math.log(2)));
        this.buckets = new BitSet(this.m);

        if (isDbg()) {
            console.log(util.format("Constructed Bloom Filter, Expected Insertions=%d\n" +
                "FalsePositivePercent=%d\n" +
                "Hash Generator function=%s\n" +
                "Number of hashes needed per object=%d\n" +
                "Number of hash buckets=%d\n", this.n, this.fpp, this.hashGenerator.name, this.k, this.m));
        }
    }


    /**
     *
     * @memberOf BloomFilter.prototype
     * @instance
     * @param obj {*} element to add to the filter
     * The element being added is first "stringified" and then added to the filter.
     * If the element is an string, it is used as is.
     * If the element is a Number, it is converted to string.
     * If the element is an Array, all elements of the array are recursively "stringified" and joined.
     * If the element is an Object, it is checked if the object contains a function "stringify", if yes
     * that function is invoked and the resulting string is used.
     * For all other cases, default toString() is used.
     */
    BloomFilter.prototype.put = function (obj) {
        var hashes = this.hashGenerator(obj, this.k);
        hashes.forEach(function (h) {
            var bucket_idx = (h & _MAX_VAL_SUPPORTED) % this.m;
            this.buckets.set(bucket_idx);
        }, this);

    }

    /**
     * @memberOf BloomFilter.prototype
     * @instance
     * @param obj {*} element to check for presence
     * @return {Boolean} true if all hashes of object are present in the Set, false otherwise
     */
    BloomFilter.prototype.mightContain = function (obj) {
        var hashes = this.hashGenerator(obj, this.k),
            bk = this.buckets,
            match = true;
        hashes.every(function (h) {
            var bucket_idx = (h & 0x7fffffff) % this.m;
            match = match && bk.get(bucket_idx);
            return match;
        }, this);

        return match;
    }

    function stringify(obj) {
        var strRep = "";
        if (typeof obj === 'string')return obj;
        if (typeof obj === 'number')return (obj + "");
        if (obj instanceof Array) {
            strRep = obj.reduce(function (prev, val) {
                return prev + stringify(val);
            }, "");

        } else {
            if (obj['stringify'] && (typeof obj['stringify'] === 'function')) {
                strRep += obj.stringify();
            } else {
                strRep += obj;
            }
        }

        return strRep;
    }

    /**
     * Default hash generator used for K hashes of an object being
     * added to BloomFilter
     * @param obj
     * @param numHashes
     * @return {Array} of hashes
     */
    function MD5HashGen(obj, numHashes) {
        var md5Hash = crypto.createHash('md5'),
            hashes = [],
            strRep = stringify(obj);
        if (isDbg())console.log("string rep >> " + strRep);
        md5Hash.update(Buffer(strRep));
        var digBuf = md5Hash.digest();
        var h1 = digBuf.readUInt32BE(8),
            h2 = digBuf.readUInt32BE(12),
            hn;
        for (var i = 1; i <= numHashes; i++) {
            hn = h1 + i * h2;
            hashes.push(hn);
        }
        if (isDbg())console.log("hashes >>" + hashes);
        return hashes;
    }


    function RSHash(buffer) {
        var hash = 0;
        for (var i; i < buffer.length; i++) {
            hash = hash * 31 + buffer[i];
        }

    }


    module.exports = BloomFilter;

    /**
     * A user provided hash generation function
     * @callback BloomFilter~config.hashGenerator
     * @param object {*}
     * @param numHashes The number of hashes to be returned for the object
     * @returns Array The function should return an array of integers , each representing a different
     * hash value of the same object
     */


}());