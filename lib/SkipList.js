util = require("util")
/**
 * Skip List
 *
 * @param compareFn -Optional compare function for keys. If not provided, natural ordering is assumed.
 *                   The function takes two arguments, 1) a key in iteration and 2) the key being
 *                   inserted. Should return 1 if 2nd arg is greater than first,-1 if 2nd arg is less than
 *                   first and zero otherwise. If not provided
 * @constructor
 */
function SkipList(compareFn) {
    this.List_ = function () {
        function Node_(key, value) {
            return {'key':key, 'value':value,
                'next':null, 'prev':null, 'down':null,
                insert:function (k, v, down) {
                    var node = Node_(k, v);
                    this.prev.next = node;
                    node.prev = this.prev;
                    node.next = this;
                    this.prev = node;
                    node.down = down;
                    return node;

                }}
        }

        var minNode = Node_();
        minNode.isMin = true;
        var node2 = Node_();
        node2.isMax = true;
        minNode.next = node2;
        node2.prev = minNode;
        return minNode;

    }
    this.compareFn = function (node, key) {
        if (node.isMin)return 1;//everything is greater
        if (node.isMax)return -1;//everything is smaller
        return compareFn ? compareFn.call(this,node.key, key)
            : (node.key < key ? 1 : node.key > key ? -1 : 0);

    }
    this.top_ = this.List_();

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
    if (this.compareFn(cur, key) == 0) {
        while (cur) {
            cur.key = key;
            cur.value = value;
            cur = cur.down
        }
        return;
    }

    if (cur.prev.down) {
        down = this.insert_(key, value, cur.prev.down);
    }

    return (!currentList.down/*bottom list*/)
        ? cur.insert(key, value)
        : (down && ((Math.random() * 100) < 50))
        ? cur.insert(key, value, down) : null;


}

/**
 * Add a key value pair, if the key exists value is replaced
 * @param key
 * @param value
 * @return {*}
 */
SkipList.prototype.put = function (key, value) {
    var topNode = this.insert_(key, value, this.top_);
    while (((Math.random() * 100) < 50) && topNode) {
        var newList = this.List_();
        newList.down = this.top_;
        this.top_ = newList;
        topNode = this.insert_(key, value, this.top_);
    }
    return this;
}

/**
 *
 * @param key to search for
 * @return {key:<key>,value:<value>}- object returned
 */
SkipList.prototype.get = function (key) {
    return this.search_(key, this.top_);
}

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
        return {'key':key, 'value':cur.value}
    } else if (cur.prev.down) {
        return this.search_(key, cur.prev.down)
    }

}

/**
 * remove key and all nodes representing the key
 * @param key
 */
SkipList.prototype.delete = function (key) {
    return this.delNode_(key, this.top_)
}

SkipList.prototype.delNode_ = function (key, currentList) {
    var cur = currentList, down;
    while (cur && this.compareFn(cur, key) > 0) {
        cur = cur.next;
    }
    //remove node
    if (this.compareFn(cur, key) == 0) {
        while (cur) {
            cur.prev.next = cur.next;
            cur.next.prev = cur.prev;
            cur = cur.down;
        }
        return true;
    }
    return (currentList.down) ? this.delNode_(key, cur.prev.down) : false;

}

SkipList.prototype.entrySet = function () {
    var baseList = this.top_, entries = [], node;
    while (baseList.down) {
        baseList = baseList.down;
    }
    node = baseList.next;
    while (node && node.key/*don't list boundary nodes*/) {
        entries.push({'key':node.key, 'value':node.value})
        node = node.next;
    }
    return entries;
}
/**
 * function to print lists by level
 * @return {*}
 * @private
 */
SkipList.prototype.inspect_ = function () {
    var all = [], cur = this.top_;
    var i = 0, keys, n;
    while (cur) {
        n = cur.next;
        keys = [];
        while (n) {
            keys.push({'k':n.key || '',
                'v':n.value || ( n.isMin ? '-*' : '+*')});
            n = n.next;
        }
        all.push(keys);
        cur = cur.down;
    }
    return util.inspect(all);
}

module.exports = SkipList;



