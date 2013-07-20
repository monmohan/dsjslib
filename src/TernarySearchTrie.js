/**
 *
 * @constructor
 */
function TernarySearchTrie() {
    this.mkNode_ = function (ch, val, lt, gt, eq) {
        return {c:ch || null, l:lt || null, g:gt || null,
            e:eq || null, v:val || null};
    }
    this.root = null;
}

TernarySearchTrie.prototype.getNode_ = function (node, key, pos) {
    if (!node) return null;
    var path = key.charAt(pos) === node.c ? 'e' : key.charAt(pos) > node.c ? 'g' : 'l';
    var isEq = path === 'e';
    var nextNode = node[path];
    return (pos == key.length - 1) ?
        (isEq ? node : nextNode ? this.getNode_(nextNode, key, pos) : null)
        : this.getNode_(nextNode, key, isEq ? ++pos : pos);

}


TernarySearchTrie.prototype.get = function (key) {
    var node = this.getNode_(this.root, key, 0);
    return node && node.v;

}

TernarySearchTrie.prototype.deleteNode_ = function (parent, node, path, isKey) {
    if (!node) return null;
    if (!parent) return (this.root = null)
    var continueDel = false;
    if (!node.e) {
        var numChild = node.l ? (node.g ? 2 : 1) : (node.g ? 1 : 0);
        switch (numChild) {
            case(0):
                if (isKey || !node.v) {
                    parent[path] = null;
                    continueDel = true;
                }
                break;
            case(1):
                parent[path] = node.l || node.g;
                continueDel = false;
                break;
            case(2):
                var rChild = node.g;
                var suc = rChild;
                while (suc.l) {
                    suc = suc.l;
                }
                var temp = suc;
                this.deleteNode_(suc);
                node.e = suc.e;
                node.c = suc.c;
        }
    }
    return continueDel;

}

TernarySearchTrie.prototype.recDelete_ = function (parent, node, path, key, pos) {
    if (!node) return null;
    if (pos === key.length - 1)return this.deleteNode_(parent, node, path, true);
    var recNode = key.charAt(pos) === node.c ? node.e : key.charAt(pos) > node.c ? node.g : node.l;
    path = key.charAt(pos) === node.c ? 'e' : key.charAt(pos) > node.c ? 'g' : 'l';
    var continueDel = this.recDelete_(node, recNode, path, key, ++pos);
    if (continueDel)return this.deleteNode_(parent, node, path);


}

TernarySearchTrie.prototype.delete = function (key) {
    this.recDelete_(null, this.root, null, key, 0);

}
TernarySearchTrie.prototype.putNode_ = function (node, key, val, pos) {
    var ch = key.charAt(pos);
    var path = ch === node.c ? 'e' : ch > node.c ? 'g' : 'l';
    var isEq = path === 'e';
    var recNode = node[path];
    if (isEq && pos == key.length - 1) {
        node.v = val;
        return this;//no need to recurse, the chars already exist
    }

    if (recNode) {
        this.putNode_(recNode, key, val, isEq ? ++pos : pos)
    } else {/*make and insert nodes*/
        var inserted = this.mkNode_(key.charAt(isEq ? ++pos : pos));
        node[path] = inserted;
        pos++;
        while (pos < key.length) {
            inserted.e = this.mkNode_(key.charAt(pos));
            inserted = inserted.e;
            pos++;
        }
        if (pos == key.length) {
            inserted.v = val;
        }
    }

    return this;
}

TernarySearchTrie.prototype.put = function (key, val) {
    if (!this.root)this.root = this.mkNode_(key.charAt(0))
    return this.putNode_(this.root, key, val, 0);

}

module.exports = TernarySearchTrie;