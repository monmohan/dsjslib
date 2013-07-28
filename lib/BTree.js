util = require("util")
/**
 * A BTree of degree N,
 * Can have a
 * maximum of 2*N -1 keys
 * and
 * minimum of N-1 keys per Node
 * Root is allowed to have less than minimum no. of keys
 * @param degree
 * @constructor
 */
function BTree(degree) {
    if (!degree) throw new Error("degree must be specified for creating a BTree");
    this.degree = degree;
    this.mkNode_ = function (keys, childPtrs, isLeaf, n) {
        return {
            keys:keys || []/*Array of item objects in this node,
             max size = 2*degree -1
             min size = degree -1
             */,
            cPtrs:childPtrs || []/*Pointers to child nodes*/,
            isLeaf:(typeof isLeaf === "undefined" ? true : isLeaf),
            n:n || 0/*number of keys*/,
            isFull:function () {
                return this.n === 2 * degree - 1
            },
            /* First index of keys where fn returns true*/
            indexOf:function (callBkFn) {
                for (var i = 0; i < this.n; i++) {
                    if (callBkFn.call(this, this.keys[i].key))break;
                }
                return i;
            }
        }


    }

    this.root = this.mkNode_();
}

BTree.prototype.get = function (key, node) {
    var res = recSearch(key, node || this.root);
    return res && res.node.keys[res.index];
    function recSearch(key, node) {
        if (!node)return;
        var found;
        var index = node.indexOf(function (k) {
            found = key == k;
            return found || (!this.isLeaf && key < k)
        })
        if (found) return {'node':node, 'index':index};
        if (node.isLeaf && !found) return;
        return recSearch(key, node.cPtrs[index]);
    }

}

BTree.prototype.splitChild = function (p, child, splitIdx) {
    var that = this, cPtr = [], degIdx = this.degree - 1, fullIdx = 2 * this.degree - 1;
    var subNode1 = subNode(child, 0, degIdx);
    var subNode2 = subNode(child, (degIdx + 1), fullIdx);
    p.keys.splice(splitIdx, 0, child.keys[degIdx]);
    p.cPtrs.splice(splitIdx, 1, subNode1, subNode2);
    p.n++;
    return p;

    function subNode(node, st, end) {
        var sKeys = node.keys.slice(st, end), sPtr = [];
        if (!node.isLeaf) {
            sPtr = node.cPtrs.slice(st, end);
            sPtr[end - st] = node.cPtrs[end];
        }
        return that.mkNode_(sKeys, sPtr, node.isLeaf, (end - st))
    }


}

BTree.prototype.inspect = function (node) {
    if (arguments.length == 0)node = this.root;
    if (!node) return;
    var that = this;
    //helper to log child pointers
    if (node.cPtrs && !node.cPtrs.inspect) {
        node.cPtrs.inspect = function () {
            return this.reduce(
                function (lastVal, ptr, idx) {
                    return (lastVal + "index:" + idx + that.inspect(ptr) + "\n")
                }, "")
        }
    }
    return util.inspect(node, {colors:true});
}


BTree.prototype.put = function (key, value, node) {
    if (!node)node = this.root;
    var keys, i, cPtr;
    //Handle Root is full
    if (this.root === node) {
        if (node.isFull()) {
            //create a new empty node
            var newroot = this.mkNode_();
            newroot.cPtrs[0] = node;
            newroot.isLeaf = false;
            this.root = this.splitChild(newroot, node, 0);
            node = this.root;
        }
    }
    /**
     * Insert if its a leaf node,
     * if we have reached here, all full nodes must
     * have been split by now
     */
    if (node.isLeaf) {
        i = node.indexOf(function (k) {
            return key < k;
        })
        node.keys.splice(i, 0, {"key":key, "value":value});
        node.n++;

    } else {
        //find the child node pointer
        i = node.indexOf(function (k) {
            return key < k;
        })
        cPtr = node.cPtrs[i];
        if (cPtr.isFull()) {
            node = this.splitChild(node, cPtr, i);
            this.put(key, value, node);
        } else {
            this.put(key, value, cPtr);
        }

    }
    return this;

}
BTree.prototype.delete = function (key, node) {
    var that = this;
    if (!node) node = this.root;
    if (node.isLeaf) {
        return deleteFromLeafNode(key, node);
    }
    var keyFound = false;
    var i = node.indexOf(function (k) {
        keyFound = key == k;
        return keyFound || (key < k);
    })

    if (keyFound) {
        deleteInternalNode(key, node, i);
    } else {
        descendTreeForDeletion(key, node, i);
    }
    function deleteFromLeafNode(key, node) {
        var i = node.indexOf(function (k) {
            return key == k;
        })
        node.keys.splice(i, 1);
        node.n--;

    }

    function deleteInternalNode(key, node, i) {
        //deleting from an internal node
        var child1 = node.cPtrs[i], child2 = node.cPtrs[i + 1], child;
        child = child1.n >= that.degree ? child1 : child2.n >= that.degree ? child2 : null;
        if (!child) {//both children are less than degree number of keys
            merge(child1, node, i, child2);
            return that.delete(key, node);
        } else {
            var sucPred = child === child1 ? child.keys[child.n - 1] : child.keys[0];
            //recursively delete and replace
            that.delete(sucPred.key, child);
            node.keys[i] = sucPred;
            return;
        }
    }

    function descendTreeForDeletion(key, node, i) {
        var child = node.cPtrs[i];
        var rightSib = node.cPtrs[i + 1], leftSib = node.cPtrs[i - 1], minKeys = that.degree - 1;

        if (child.n === minKeys) {
            if ((!rightSib || rightSib.n === minKeys) && (!leftSib || leftSib.n === minKeys)) {
                //deletion is descending such that all sibling nodes have degree-1 nodes
                //merge the left sibling, parent key and right sibling and use the merged node for deletion
                merge((rightSib ? child : leftSib), node, (rightSib ? i : i - 1), (rightSib ? rightSib : child));
                var merged = rightSib ? child : rightSib;
                if (node == that.root && node.keys.length == 0) {
                    that.root = merged
                }
                return that.delete(key, merged);
            } else/*
             One of the right/left sibling has more keys. Move the parent key to the child with degree-1 keys
             Pick a key (last from left sibling, first from right sibling) and then move that to the evacuated
             parent. recurse for deletion starting from the parent node
             */
            {
                var sib = (rightSib && rightSib.n > minKeys) ? rightSib : leftSib, pIdx = sib === rightSib ? i : i - 1,
                    sibIdx = sib === rightSib ? 0 : sib.n - 1;
                child.keys.splice(sib === rightSib ? child.n : 0, 0, node.keys[pIdx]);
                child.n++;
                if (!sib.isLeaf) {
                    child.cPtrs.splice(sib === rightSib ? child.n : 0, 0, sib === rightSib ? sib.cPtrs[0] : sib.cPtrs[sib.n]);
                    sib.cPtrs.splice(sib == rightSib ? 0 : sib.n, 1);
                }
                node.keys[pIdx] = sib.keys[sibIdx];
                sib.keys.splice(sibIdx, 1);
                sib.n--;
                return that.delete(key, child);
            }
        } else {
            //node which is being descended to has more keys
            return that.delete(key, child);
        }


    }

    function merge(node1, parent, index, node2) {
        node1.keys.push(parent.keys[index]);
        if (node2) {
            node1.keys = node1.keys.concat(node2.keys);
            node1.cPtrs.concat(node2.cPtrs);
            node1.n += node2.n
            node2.keys = [], node2.cPtrs = [], node2.n = 0;
        }
        node1.n += 1;
        parent.keys.splice(index, 1);
        parent.cPtrs.splice(index, 2, node1);
        parent.n--;

    }


}

BTree.prototype.checkInvariants = function (node) {
    var that = this, minKeysAllowed = (this.degree - 1);
    var isRoot = node === this.root;
    console.log("isRoot=" + isRoot + " Key Length=" + node.n);
    if (!isRoot && !node.n >= minKeysAllowed) {
        throw new Error("Node " + node + "has less than min keys allowed");
    }
    var children = []
    node.cPtrs.forEach(function (ptr, idx, cPtrs) {
        if (idx == node.keys.length) {
            if (!ptr.keys.every(function (kv) {
                console.log("child key=" + kv.key +
                    " GT parent key=" + node.keys[idx - 1].key
                );
                return kv.key > node.keys[idx - 1].key;
            }))throw new Error("child" + ptr + " keys not greater than parent node key" + node)
        } else {
            if (!ptr.keys.every(function (kv) {
                console.log("child key=" + kv +
                    " LT parent key=" + node.keys[idx]
                );
                return kv["key"] < node.keys[idx]["key"];
            }))throw new Error("child" + ptr + " keys not less than parent node key" + node)
        }
        children.push(ptr);

    })
    children.forEach(function (child) {
        that.checkInvariants(child);
    })

}

module.exports = BTree;

