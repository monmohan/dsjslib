(function () {
    "use strict";
    var isNode = typeof module === 'object' && module.exports,
        util = isNode && require("util");


    /**
     * @class SkipList
     * @classdesc Implementation of a Sorted Map backed by a Skip List
     * [Ref - Lecture on skip-lists](http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-046j-introduction-to-algorithms-sma-5503-fall-2005/video-lectures/lecture-12-skip-lists/)
     * @param compareFn {userCompareFn=} User provided comparator for keys.
     * If not provided, a natural ordering is assumed
     * @desc
     * ####Example
     * * ```js
     * var SkipList = require("dsjslib").SkipList
     * var skl=new SkipList([compareFn])
     * ```
     */
    function SkipList(compareFn) {
        this.compareFn = function (node, key) {
            if (node.isMin) {
                return 1;
            }//everything is greater
            if (node.isMax) {
                return -1;
            }//everything is smaller
            return compareFn ? compareFn.call(this, node.key, key)
                : (node.key < key ? 1 : node.key > key ? -1 : 0);

        };
        this.top_ = mkList();

    }

    var Node = {
        'key' : null,
        'value' : null,
        'next' : null,
        'prev' : null,
        'down' : null,
        insert : function (k, v, down) {
            var node = Object.create(Node);
            node.key = k;
            node.value = v;
            this.prev.next = node;
            node.prev = this.prev;
            node.next = this;
            this.prev = node;
            node.down = down;
            return node;

        }
    };

    function mkList() {
        var minNode = Object.create(Node);
        minNode.isMin = true;
        var node2 = Object.create(Node);
        node2.isMax = true;
        minNode.next = node2;
        node2.prev = minNode;
        return minNode;

    }

    /**
     * Internal -  start from top list
     * keep descending to the bottom list and insert the key value pair
     * Randomly (event of probability 1/2 roughly)
     * insert the key in the upper lists on the way back (function recursion unwind)
     *
     * @param key
     * @param value
     * @param currentList
     * @return {*}
     * @private
     */
    SkipList.prototype.insert_ = function (key, value, currentList) {
        var cur = currentList, down;
        while (cur && this.compareFn(cur, key) > 0) {
            cur = cur.next;
        }
        //replace key
        if (this.compareFn(cur, key) === 0) {
            while (cur) {
                cur.key = key;
                cur.value = value;
                cur = cur.down;
            }
            return;
        }

        if (cur.prev.down) {
            down = this.insert_(key, value, cur.prev.down);
        }

        return (!currentList.down/*bottom list*/) ?
            cur.insert(key, value)
            : (down && ((Math.random() * 100) < 50)) ?
            cur.insert(key, value, down) : null;


    };

    /**
     * Add a key value pair, if the key exists value is replaced
     * @memberOf SkipList.prototype
     * @param key {*}
     * @param value {*}
     * @returns {SkipList} this
     */
    SkipList.prototype.put = function (key, value) {
        var topNode = this.insert_(key, value, this.top_);
        while (((Math.random() * 100) < 50) && topNode) {
            var newList = mkList();
            newList.down = this.top_;
            this.top_ = newList;
            topNode = this.insert_(key, value, this.top_);
        }
        return this;
    };

    /**
     * Get value for the key
     * @memberOf SkipList.prototype
     * @param key to search for {*}
     * @returns {Object} {key:<key>,value:<value>} if key exists, null otherwise
     */
    SkipList.prototype.get = function (key) {
        return this.search_(key, this.top_);
    };

    /**
     *
     * @param key
     * @param list
     * @return {*}
     * @private
     */
    SkipList.prototype.search_ = function (key, list) {
        var cur = list;
        while (cur && this.compareFn(cur, key) > 0) {
            cur = cur.next;
        }
        if (this.compareFn(cur, key) === 0) {
            return {'key' : key, 'value' : cur.value};
        } else if (cur.prev.down) {
            return this.search_(key, cur.prev.down);
        }

    };

    /**
     * Remove key and all nodes representing the key
     * @memberOf SkipList.prototype
     * @param key {*}
     */
    SkipList.prototype.delete = function (key) {
        return delNode_.call(this,key, this.top_);
    };

    var delNode_ = function (key, currentList) {
        var cur = currentList, down;
        while (cur && this.compareFn(cur, key) > 0) {
            cur = cur.next;
        }
        //remove node
        if (this.compareFn(cur, key) === 0) {
            while (cur) {
                cur.prev.next = cur.next;
                cur.next.prev = cur.prev;
                cur = cur.down;
            }
            return true;
        }
        return (currentList.down) ? delNode_.call(this,key, cur.prev.down) : false;

    };
    /**
     * Get all entries(sorted). They are returned as key value pair objects
     * @memberOf SkipList.prototype
     * @returns {Array} Array of objects {key:<K>,value:<V>}
     */
    SkipList.prototype.entrySet = function () {
        var baseList = this.top_, entries = [], node;
        while (baseList.down) {
            baseList = baseList.down;
        }
        node = baseList.next;
        while (node && node.key/*don't list boundary nodes*/) {
            entries.push({'key' : node.key, 'value' : node.value});
            node = node.next;
        }
        return entries;
    };
    /**
     * function to print lists by level
     * @return {*}
     * @private
     */
    SkipList.prototype.inspect_ = function () {
        if (!util) {
            return;
        }
        var all = [], cur = this.top_;
        var i = 0, keys, n;
        while (cur) {
            n = cur.next;
            keys = [];
            while (n) {
                keys.push({'k' : n.key || '',
                    'v' : n.value || ( n.isMin ? '-*' : '+*')});
                n = n.next;
            }
            all.push(keys);
            cur = cur.down;
        }
        return util.inspect(all);
    };

    if (isNode) {
        module.exports = SkipList;
    } else {
        this.SkipList = SkipList;
    }
}());


