util = require("util")
/**
 * A BTree of degree N, Can have a maximum of 2*N -1 keys and a
 * minimum of N-1 keys
 * @param degree
 * @constructor
 */
function BTree(degree) {
    if (!degree) throw new Error("degree must be specified for creating a BTree");
    this.degree = degree;
    this.mkNode = function (keys, childPtrs, isLeaf, n) {
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
            }
        }


    }

    this.root = this.mkNode();
}

BTree.prototype.search = function (key, node) {
    if (!node)return;
    var next, found;
    for (var i = 0; i < node.n; i++) {
        if (key === node.keys[i]) {
            found = true;
            break;

        } else if (!node.isLeaf && key < node.keys[i]) {
            next = node.cPtrs[i];
            break;
        }
    }
    if (found) return {'node':node, 'index':i};
    if (node.isLeaf && !found) return;
    return this.search(key, node.cPtrs[i]);

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
        return that.mkNode(sKeys, sPtr, node.isLeaf, (end - st))
    }


}

BTree.prototype.inspectNode = function (node) {
    if (!node) return;
    var that = this;
    //helper to log child pointers
    if (node.cPtrs) {
        node.cPtrs.inspect = function () {
            return this.reduce(
                function (lastVal, ptr, idx) {
                    return (lastVal + "index:" + idx + that.inspectNode(ptr) + "\n")
                }, "")
        }
    }
    return util.inspect(node, {colors:true});
}


BTree.prototype.insert = function (key, node) {
    if (!node)node = this.root;
    var keys, i, cPtr;
    //Handle Root is full
    if (this.root === node) {
        if (node.isFull()) {
            //create a new empty node
            var newroot = this.mkNode();
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
        for (i = 0; i < node.n; i++) {
            if (key < node.keys[i]) {
                break;
            }
        }
        node.keys.splice(i, 0, key);
        node.n++;

    } else {
        //find the child node pointer
        for (i = 0; i < node.n; i++) {
            if (key < node.keys[i]) {
                break;
            }
        }
        cPtr = node.cPtrs[i];
        if (cPtr.isFull()) {
            node = this.splitChild(node, cPtr, i);
            this.insert(key, node);
        } else {
            this.insert(key, cPtr);
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
    for (var i = 0; i < node.n; i++) {
        if (key === node.keys[i]) {
            keyFound = true;
            break;
        }
        if (key < node.keys[i]) {
            break;
        }
    }

    if (keyFound) {
        deleteInternalNode(key, node, i);
    } else {
        descendTreeForDeletion(key, node, i);
    }
    function deleteFromLeafNode(key, node) {
        for (var i = 0; i < node.n; i++) {
            if (key === node.keys[i]) {
                break;
            }
        }
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
            var sucPred = child.keys[child.n - 1];
            //recursively delete and replace
            that.delete(sucPred, child);
            node.keys[i] = sucPred;
            return;
        }
    }

    function descendTreeForDeletion(key, node, i) {
        var child = node.cPtrs[i];
        var sibling = node.cPtrs[i + 1], minKeys = that.degree - 1, sibIsRt = true;
        if (i == node.n) {
            sibling = node.cPtrs[i - 1];
            sibIsRt = false;
        }
        if (child.n === minKeys) {
            if (sibling.n == minKeys) {
                //deletion is descending such that both child nodes have degree-1 nodes
                //merge with parent
                merge(sibIsRt ? child : sibling, node, i, sibIsRt ? sibling : child);
                var merged = sibIsRt ? child : sibling;
                if (node == that.root && node.keys.length == 0) {
                    that.root = merged
                }
                return that.delete(key, merged);
            } else/*sibling has more keys*/{
                child.keys.splice(sibIsRt ? child.n : 0, 0, node.keys[i]);
                child.n++;
                if (!sibling.isLeaf) {
                    child.cPtrs.splice(sibIsRt ? child.n : 0, 0, sibIsRt ? sibling.cPtrs[0] : sibling.cPtrs[sibling.n]);
                    sibling.cPtrs.splice(sibIsRt ? 0 : sibling.n, 1);
                }
                node.keys[i] = sibIsRt ? sibling.keys[0] : sibling.keys[sibling.n - 1];
                sibling.keys.splice(sibIsRt ? 0 : sibling.n, 1);
                sibling.n--;
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

module.exports = BTree;

