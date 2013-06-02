var BST = require("./BinarySearchTree.js"), util = require("util"), log = require("./logger");

function AVLTree() {
}
AVLTree.prototype = new BST();
AVLTree.prototype.rotate = function (node, rL) {
    if (!rL || !node)return "Insufficient parameters";

    switch (rL) {
        case 'r':
            if (node.leftChild) {
                var mvChild = node.leftChild.rightChild;
                parentChild(node.parent, node.leftChild, node.isLeftChild() ? 'l' : 'r');
                parentChild(node.leftChild, node, 'r');
                parentChild(node, mvChild, 'l');
                this.reCalcHeight(node);
            }
            break;
        case 'l':
            if (node.rightChild) {
                mvChild = node.rightChild.leftChild;
                parentChild(node.parent, node.rightChild, node.isRightChild() ? 'r' : 'l');
                parentChild(node.rightChild, node, 'l');
                parentChild(node, mvChild, 'r');
                this.reCalcHeight(node);
            }
    }

    function parentChild(par, ch, rL) {
        if (par)par[rL === 'r' ? "rightChild" : "leftChild"] = ch;
        if (ch)ch.parent = par;
    }

}
AVLTree.prototype.rebalance = function (vNode, iNode) {
    var islc = iNode.isLeftChild();
    var p = iNode.parent;
    var zigzag = false;
    while (vNode !== p) {
        zigzag = islc != p.isLeftChild();
        if (zigzag) {
            this.rotate(p, p.isLeftChild() ? 'l' : 'r');
            break;
        }
        p = p.parent;
    }
    //re-balance single rotation case
    this.rotate(vNode, iNode.isLeftChild() ? 'r' : 'l');

}

AVLTree.prototype.insert = function (item) {
    var ins = BST.prototype.insert.call(this, item);
    console.log("inserting item " + item);
    try {
        this.checkAVLProperty(ins.node);
    } catch (vNode) {
        this.rebalance(vNode, ins.node);
    }
    return ins;
}

AVLTree.prototype.checkInvariants = function (node) {
    if (typeof node === "undefined")node = this.root;
    BST.prototype.checkInvariants.call(this, node);
    if (!node) return;
    var lc = node.leftChild, rc = node.rightChild;
    if (log.DEBUG) {
        console.log("Checking AVL Invariants");
        console.log(util.format("lc(h)=%s, rc(h)=%s, node=%s",
            lc ? lc.item + "(" + lc.height + ")" : "null(-1)",
            rc ? rc.item + "(" + rc.height + ")" : "null(-1)",
            node.item + "(" + node.height + ")"))
    }
    var hdiff = Math.abs((lc ? lc.height : -1) - (rc ? rc.height : -1));
    if (hdiff > 1) throw new Error("Invariant check failed at node " + node + " key=" + node.item)
    this.checkInvariants(lc);
    this.checkInvariants(rc);


}


AVLTree.prototype.checkAVLProperty = function (node) {
    if (!node) return;
    var lc = node.leftChild, rc = node.rightChild;
    var hdiff = Math.abs((lc ? lc.height : -1) - (rc ? rc.height : -1));
    if (hdiff > 1) {
        if (log.DEBUG)console.log("AVL Height violation at Node key" + node.item);
        throw node;
    }
    this.checkAVLProperty(node.parent);


}
module.exports = AVLTree;