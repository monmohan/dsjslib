(function () {
    "use strict";
    /**
     * Implementation of a Ternary Search Trie
     * @class TernarySearchTrie
     * @classdesc
     * Data structure supporting String keys, for fast retrieval of
     * values associated with  string and provide prefix searches.
     * @desc
     * #### Example -
     * ```js
     * var TernarySearchTrie = require("dsjslib").TernarySearchTrie
     * var tst=new TernarySearchTrie()
     * ```
     */
    function TernarySearchTrie() {
        this.mkNode_ = function (ch, val, lt, gt, eq) {
            return {c : ch || null, l : lt || null, g : gt || null,
                e : eq || null, v : val || null};
        };
        this.root = null;
    }

    TernarySearchTrie.prototype.getNode_ = function (node, key, pos) {
        if (!node) {
            return null;
        }
        var path = key.charAt(pos) === node.c ? 'e' : key.charAt(pos) > node.c ? 'g' : 'l';
        var isEq = path === 'e';
        var nextNode = node[path];
        return (pos === key.length - 1) ?
            (isEq ? node : nextNode ? this.getNode_(nextNode, key, pos) : null)
            : this.getNode_(nextNode, key, isEq ? ++pos : pos);

    };

    /**
     * @memberOf TernarySearchTrie.prototype
     * @see {@link RWayTrie#get}
     */
    TernarySearchTrie.prototype.get = function (key) {
        var node = this.getNode_(this.root, key, 0);
        return node && node.v;

    };

    /**
     * Similar to BST delete but with some additional twist
     * A node with a equal child pointer can't be deleted but
     * the value is set to null. Also deletion may propagate up the chain
     * @param parent
     * @param node
     * @param path
     * @param isKey
     * @return {*}
     * @private
     */
    TernarySearchTrie.prototype.deleteNode_ = function (parent, node, path) {
        if (!node) {
            return null;
        }
        var continueDel = false;
        if (node.e) {
            node.v = null;
            return;
        }
        var numChild = node.l ? (node.g ? 2 : 1) : (node.g ? 1 : 0);
        switch (numChild) {
            case(0):
                if (!parent) {
                    this.root = null;
                }
                else {
                    parent[path] = null;
                    continueDel = true;
                }

                break;
            case(1):
                var child = node.l || node.g;
                if (!parent) {
                    this.root = child;
                } else {
                    parent[path] = child;
                }
                continueDel = false;
                break;
            case(2):
                var rChild = node.g;
                var p = node;
                var suc = rChild;
                while (suc.l) {
                    p = suc;
                    suc = suc.l;
                }
                this.deleteNode_(p, suc, 'l');
                node.e = suc.e;
                node.c = suc.c;
                node.v = suc.v;
        }

        return continueDel;

    };

    TernarySearchTrie.prototype.recDelete_ = function (parent, node, path, key, pos) {
        if (!node) {
            return null;
        }
        var nextPath = key.charAt(pos) === node.c ? 'e' : key.charAt(pos) > node.c ? 'g' : 'l';
        var isEq = nextPath === 'e';
        var nextNode = node[nextPath];
        var continueDel = (pos === key.length - 1 ?
            (isEq ? this.deleteNode_(parent, node, path)
                : this.recDelete_(node, nextNode, nextPath, key, pos)) :
            this.recDelete_(node, nextNode, nextPath, key, isEq ? ++pos : pos));

        return continueDel && this.deleteNode_(parent, node, path);


    };

    /**
     * @memberOf TernarySearchTrie.prototype
     * @see {@link RWayTrie#delete}
     * @function delete
     */
    TernarySearchTrie.prototype['delete'] = function (key) {
        this.recDelete_(null, this.root, null, key, 0);

    };

    TernarySearchTrie.prototype.putNode_ = function (node, key, val, pos) {
        var ch = key.charAt(pos);
        var path = ch === node.c ? 'e' : ch > node.c ? 'g' : 'l';
        var isEq = path === 'e';
        var recNode = node[path];
        if (isEq && pos === (key.length - 1)) {
            node.v = val;
            return this;//no need to recurse, the chars already exist
        }

        if (recNode) {
            this.putNode_(recNode, key, val, isEq ? ++pos : pos);
        } else {/*make and insert nodes*/
            var inserted = this.mkNode_(key.charAt(isEq ? ++pos : pos));
            node[path] = inserted;
            pos++;
            while (pos < key.length) {
                inserted.e = this.mkNode_(key.charAt(pos));
                inserted = inserted.e;
                pos++;
            }
            if (pos === key.length) {
                inserted.v = val;
            }
        }

        return this;
    };

    /**
     * @memberOf TernarySearchTrie.prototype
     * @see {@link RWayTrie#put}
     */
    TernarySearchTrie.prototype.put = function (key, val) {
        if (!this.root) {
            this.root = this.mkNode_(key.charAt(0));
        }
        return this.putNode_(this.root, key, val, 0);

    };

    TernarySearchTrie.prototype.keysWithPrefix_ = function (startAtNode, prefix, keys, nEqKeyPath) {
        if (!startAtNode) {
            return;
        }
        if (startAtNode.v) {
            keys.push({'key' : prefix, 'value' : startAtNode.v});
        }

        var nodes = [startAtNode.l, startAtNode.e, startAtNode.g];

        if (nodes[0])this.keysWithPrefix_(nodes[0], nEqKeyPath + nodes[0].c, keys, nEqKeyPath);
        if (nodes[1])this.keysWithPrefix_(nodes[1], prefix + nodes[1].c, keys, nEqKeyPath + startAtNode.c);
        if (nodes[2])this.keysWithPrefix_(nodes[2], nEqKeyPath + nodes[2].c, keys, nEqKeyPath);

    };

    /**
     * @memberOf TernarySearchTrie.prototype
     * @see {@link RWayTrie#keysWithPrefix}
     */
    TernarySearchTrie.prototype.keysWithPrefix = function (prefix) {
        var keys = [], node = this.getNode_(this.root, prefix, 0);
        if (!node) {
            return keys;
        }
        if (!node.e) {
            return [
                {'key' : prefix, 'value' : node.v}
            ];
        }
        this.keysWithPrefix_(node.e, prefix + node.e.c, keys, prefix);
        return keys;
    };

    /**
     * @memberOf TernarySearchTrie.prototype
     * @see {@link RWayTrie#entrySet}
     */
    TernarySearchTrie.prototype.entrySet = function () {
        var that = this, keys = [];
        if (this.root) {
            var superNode = this.mkNode_('', '', null, null, this.root);
            this.keysWithPrefix_(superNode.e, superNode.e.c, keys, '');
        }
        return keys;
    };

    module.exports = TernarySearchTrie;

}());