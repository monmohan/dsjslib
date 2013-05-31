util = require("util")
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
    var that = this;
    var cPtr = [], degIdx = this.degree - 1,
        fullIdx = 2 * this.degree - 1;
    var subNode1 = subNode(child, 0, degIdx);
    var subNode2 = subNode(child, (degIdx + 1), fullIdx);
    p.keys.splice(splitIdx,0,child.keys[degIdx]);
    p.cPtrs.splice(splitIdx,1,subNode1,subNode2);
    p.n = p.n + 1;
    return p;

    function subNode(node, st, end) {
        var sKeys = [], sPtr = [];
        sKeys = node.keys.slice(st, end);
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
    if (this.root === node/*isRoot*/) {
        if (node.isFull()) {
            //create a new empty node
            var newroot = this.mkNode();
            newroot.cPtrs[0] = node;
            newroot.isLeaf = false;
            this.root = this.splitChild(newroot, node, 0);
            node = this.root;
        }
    }
    if (node.isLeaf) {
        for (i = 0; i < node.n; i++) {
            if (key < node.keys[i]) {
                break;
            }
        }
        node.keys.splice(i, 0, key);
        node.n++;

    } else {
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


module.exports = BTree;

