(function () {
    /**
     * @class RWayTrie
     * @classdesc Data structure supporting String keys, for fast retrieval of values associated with string keys.
     * In comparison to a Map, has additional (fast) functions like list of keys with prefix
     * and listing all keys in sorted order. For large R the space requirement
     * for this DS is impractical (although in javascript arrays are sparse so its not the same)
     * , {@link TernarySearchTrie} can be more practical alternative.
     * [Reference: Algorithms, 4th Edition by Robert Sedgewick and Kevin Wayne]
     * @param R {Number} R is the alphabet size. For example when its known that string keys are made of ASCII chars
     * R can be set to  128.
     * @desc
     * #### Example -
     * ```js
     * var RWayTrie = require("dsjslib").RWayTrie
     * var rtrie=new RWayTrie(128)
     * ```
     */
    function RWayTrie(R) {
        if (!R || typeof R !== "number") {
            throw new Error("Invalid argument, R should be integer")
        }
        this.R = R;
        this.mkNode_ = function (value) {
            return {
                cPtrs : [],
                val : value || null
            }
        }
        this.root = this.mkNode_();

    }

    RWayTrie.prototype.putNode_ = function (key, val, node, pos) {
        if (pos === key.length) {
            node.val = val;
            return this;
        }
        var ptr = key.charCodeAt(pos);
        if (ptr > this.R) throw new Error("Character out of range " + ptr + " " + key.charAt(pos));
        if (!node.cPtrs[ptr])node.cPtrs[ptr] = this.mkNode_();
        return this.putNode_(key, val, node.cPtrs[ptr], ++pos);

    }
    /**
     * Insert a key value pair
     * @memberOf RWayTrie.prototype
     * @param key {String}
     * @param val {*}
     * @returns {RWayTrie} this
     */
    RWayTrie.prototype.put = function (key, val) {
        if (!(typeof key === 'string'))throw new Error("Only String keys are supported");
        if (!val)throw new Error("Null values are not supported");
        return this.putNode_(key, val, this.root, 0);
    }

    RWayTrie.prototype.getNode_ = function (key, node, pos) {
        var ptr = key.charCodeAt(pos);
        if (pos == key.length) {
            return node;
        }
        if (!node.cPtrs[ptr])return null;
        return this.getNode_(key, node.cPtrs[ptr], ++pos);

    }

    /**
     * Get value for a given key
     * @memberOf RWayTrie.prototype
     * @param key
     * @returns {*} value or null if key is not found
     */
    RWayTrie.prototype.get = function (key) {
        var node = this.getNode_(key, this.root, 0);
        return node && node.val;
    }

    /**
     * Return a list of all key, value pairs where
     * keys start with given prefix chars
     * @memberOf RWayTrie.prototype
     * @param prefix {String}
     * @return {Array} Array of objects {key:<key starting with prefix>,value:<v>}
     */
    RWayTrie.prototype.keysWithPrefix = function (prefix) {
        var keys = [];
        var startAtNode = this.getNode_(prefix, this.root, 0);
        if (startAtNode)this.keysWithPrefix_(startAtNode, prefix, keys);
        return keys;

    }


    /**
     *
     * @param node
     * @param collect
     * @param keys
     * @private
     */
    RWayTrie.prototype.keysWithPrefix_ = function (node, collect, keys) {
        if (node.val) {
            keys.push({key : collect, 'value' : node.val});
        }
        var that = this;
        node.cPtrs.forEach(function (e, i, arr) {
            var prefix = String.fromCharCode(i);
            that.keysWithPrefix_(e, (collect + prefix), keys);

        })

    }

    /**
     * Return a sorted list of all key value pairs
     * @memberOf RWayTrie.prototype
     * @returns {Array} Array of objects {key:<key >,value:<v>}
     */
    RWayTrie.prototype.entrySet = function () {
        var keys = [];
        this.keysWithPrefix_(this.root, "", keys);
        return keys;
    }

    RWayTrie.prototype.deleteNode_ = function (key, node, pos) {
        var ptr = key.charCodeAt(pos);
        if (pos === key.length) {
            node.val = null;
            return node;
        }
        if (!node.cPtrs[ptr])return null;
        var ret = this.deleteNode_(key, node.cPtrs[ptr], ++pos);
        if (ret && !ret.cPtrs.some(
            function (e) {
                return e
            }) &&
            !ret.val) {
            node.cPtrs.slice(ptr, 1);
            ret = null;
            return node;
        }
        return null;

    }
    /**
     * Delete a key value pair
     * @memberOf RWayTrie.prototype
     * @param key {String}
     */
    RWayTrie.prototype.delete = function (key) {
        return this.deleteNode_(key, this.root, 0);

    }


    module.exports = RWayTrie;
}());