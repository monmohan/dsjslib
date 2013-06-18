/**
 *
 * @constructor
 */
function RWayTrie(R) {
    if (!R || !(typeof R === "number")) {
        throw new Error("Inavlid argument, R should be integer")
    }
    this.R = R;
    this.mkNode = function (value) {
        return {
            cPtrs:[],
            val:value || null
        }
    }
    this.root = this.mkNode();

}

RWayTrie.prototype.insert = function (key, val) {
    if (!val)throw new Error("Null values are not supported");
    var that = this;
    return insKey(key, val, this.root, 0);
    function insKey(key, val, node, pos) {
        if (pos === key.length) {
            node.val = val;
            return that;
        }
        var ptr = key.charCodeAt(pos);
        if (ptr > that.R) throw new Error("Character out of range " + ptr + " " + key.charAt(pos));
        if (!node.cPtrs[ptr])node.cPtrs[ptr] = that.mkNode();
        return insKey(key, val, node.cPtrs[ptr], ++pos);

    }
}

RWayTrie.prototype.search = function (key) {
    return findKey(key, this.root, 0);
    function findKey(key, node, pos) {
        var ptr = key.charCodeAt(pos);
        if (pos == key.length) {
            return node.val;
        }
        if (!node.cPtrs[ptr])return null;
        return findKey(key, node.cPtrs[ptr], ++pos);

    }
}

RWayTrie.prototype.keyset = function () {
    var keys = [];
    keysWithPrefix(this.root, "");
    function keysWithPrefix(node, collect) {
        if (node.val) {
            keys.push(collect);
        }
        node.cPtrs.forEach(function (e, i, arr) {
            collect += String.fromCharCode(i);
            keysWithPrefix(e, collect);

        })
        collect = "";
    }

    return keys;
}


module.exports = RWayTrie;