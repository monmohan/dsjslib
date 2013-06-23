/**
 * R - is the alphabet size. For example when its known that string keys are made of ASCII chars
 * R can be set to  128.
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
    if (!(typeof key === 'string'))throw new Error("Only String keys are supported");
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
            var prefix = String.fromCharCode(i);
            keysWithPrefix(e, (collect + prefix));

        })

    }

    return keys;
}

RWayTrie.prototype.delete = function (key) {
    return delKey(key, this.root, 0);
    function delKey(key, node, pos) {
        var ptr = key.charCodeAt(pos);
        if (pos == key.length) {
            node.val = null;
            return node;
        }
        if (!node.cPtrs[ptr])return null;
        var ret = delKey(key, node.cPtrs[ptr], ++pos);
        if (ret && !ret.cPtrs.some(
            function (e) {
                return e
            }) &&
            !ret.val) {
            node.cPtrs.splice(ptr, 1);
            ret = null;
            return node;
        }
        return null;

    }
}


module.exports = RWayTrie;