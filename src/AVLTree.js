var BST = require("./BinarySearchTree.js")
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

module.exports = AVLTree;