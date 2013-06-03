var util = require('util'), log = require("./logger");
/**
 * Implementation of a Binary Search Tree Data structure
 * @constructor
 */
function BinarySearchTree() {
    this.root = null;
    /**
     *
     * @param item
     * @param parent
     * @param leftChild
     * @param rightChild
     * @return {Object}
     */
    this.mkNode = function (item, parent, leftChild, rightChild) {
        return {item:item,
            parent:parent || null,
            leftChild:leftChild || null,
            rightChild:rightChild || null,
            height:0,
            isLeftChild:function () {
                return this.parent && this.parent.leftChild === this
            },
            isRightChild:function () {
                return this.parent && this.parent.rightChild === this
            },
            /**
             * function to display the tree using Node util class
             * @return {*}
             */
            inspect:function () {
                return util.inspect({item:this.item, h:this.height,
                    L:this.leftChild, R:this.rightChild, p:(this.parent ? this.parent.item : null)},{depth:null,colors:true});
            }

        }
    }

}


BinarySearchTree.prototype.insert = function (obj) {
    if (!this.root) {
        this.root = this.mkNode(obj);
        return this
    }

    var cNode = this.root;
    var pNode = null;
    var isLeft = false;
    while (cNode) {
        pNode = cNode;
        if (obj < cNode.item) {
            cNode = cNode.leftChild;
            isLeft = true;
        } else {
            cNode = cNode.rightChild;
            isLeft = false;
        }
    }
    //cNode should be null now
    var iNode = this.mkNode(obj, pNode);
    pNode[isLeft ? "leftChild" : "rightChild"] = iNode;
    this.reCalcHeight(iNode);
    var tree = this;
    return {
        insert:function (obj) {
            return tree.insert(obj);
        },
        node:iNode

    };
}

BinarySearchTree.prototype.reCalcHeight = function (pNode) {
    while (pNode) {
        pNode.height = Math.max((pNode.leftChild ? pNode.leftChild.height : -1),
            (pNode.rightChild ? pNode.rightChild.height : -1)) + 1;
        pNode = pNode.parent;
    }
};
/**
 * Inorder traversal, apply provided function on each  visited node
 * @param obj
 * @return {*}
 */
BinarySearchTree.prototype.traverse = function (node, fn) {
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 1) {
        if (Object.prototype.toString.call(args[0]) === '[object Function]') {
            console.log('initializing node to root');
            node = this.root;
            fn = args[0];
        } else {
            fn = function (n) {
                console.log(n.item);
            }
        }
    }

    if (!node)return;
    this.traverse(node.leftChild, fn);
    fn(node);
    this.traverse(node.rightChild, fn);

}
/**
 *
 * @param key
 */
BinarySearchTree.prototype.search = function (key, node) {
    if (typeof node === "undefined")node = this.root;
    if (!node) return null;

    if (key < node.item) return this.search(key, node.leftChild);
    if (key > node.item) return this.search(key, node.rightChild);
    if (key == node.item)return node;

}

BinarySearchTree.prototype.min = function (node) {
    node = (typeof node === 'undefined') ? this.root : node;
    var min = node;
    while (min.leftChild) {
        min = min.leftChild;
    }
    return min;

}

BinarySearchTree.prototype.max = function (node) {
    node = (typeof node === 'undefined') ? this.root : node;
    var max = node;
    while (max.rightChild) {
        max = max.rightChild;
    }
    return max;

}


BinarySearchTree.prototype.successor = function (item) {
    var node = this.search(item);

    if (node && node === node.parent.leftChild) {
        //go to the right child if right child is not null
        //descend and get the min of left tree
        var rc = node.rightChild;
        if (rc) {
            return this.min(rc);
        } else {
            return node.parent;
        }
    }

    if (node && node === node.parent.rightChild) {
        rc = node.rightChild;
        if (rc) {
            return this.min(rc);
        } else {
            var p = node.parent;
            var sp = p ? p.parent : null;
            while (sp && sp.leftChild !== p) {
                node = p;
                p = node.parent;
                sp = p ? p.parent : null;

            }
            return sp;
        }
    }


}

BinarySearchTree.prototype.predecessor = function (item) {
    var node = this.search(item);
    //if the node is the right child
    if (node && node === node.parent.rightChild) {
        //go to the left child if left child is not null
        //descend and get the max of left tree
        var lc = node.leftChild;
        if (lc) {
            return this.max(lc);
        } else {
            return node.parent;
        }
    }
    //if the node is the left child
    if (node && node === node.parent.leftChild) {
        lc = node.leftChild;
        if (lc) {
            return this.max(rc);
        } else {
            var p = node.parent;
            var sp = p ? p.parent : null;
            while (sp && sp.rightChild !== p) {
                node = p;
                p = node.parent;
                sp = p ? p.parent : null;

            }
            return sp;
        }
    }


}

BinarySearchTree.prototype.delete = function (item) {
    var node = this.search(item);
    if (node) {
        var num = node.leftChild ? (node.rightChild ? 2 : 1) : (node.rightChild ? 1 : 0);
        switch (num) {
            case 0:
                var p = node.parent;
                if (p) {
                    var lc = p.leftChild === node;
                    p[lc ? "leftChild" : "rightChild"] = null;
                    node = null;
                }
                break;
            case 1:
                //single subtree
                p = node.parent;
                if (p) {
                    lc = p.leftChild === node;
                    var child = node.leftChild || node.rightChild;
                    child.parent = p;
                    p[lc ? "leftChild" : "rightChild"] = child;
                    node = null;
                } else {
                    //root
                    child = node.leftChild || node.rightChild;
                    lc = node.leftChild === child;
                    child.parent = null;
                }
                break;
            case 2:
                var nextL = this.successor(node.item);
                var temp = nextL.item;
                this.delete(nextL.item);
                node.item = temp;
        }


    }

}

BinarySearchTree.prototype.checkInvariants = function (node) {
    if (typeof node === 'undefined') node = this.root;
    if (!node) return;
    var lc = node.leftChild, rc = node.rightChild;
    if (log.DEBUG) {
        console.log(util.format("lc=%s, rc=%s, node=%s",
            lc ? lc.item : "null", rc ? rc.item : "null", node.item))
    }
    var ok = (!lc || lc.item < node.item) &&
        (!rc || rc.item > node.item);

    if (!ok) throw new Error("Invariant check failed at node " + node + " key=" + node.item)
    this.checkInvariants(lc);
    this.checkInvariants(rc);
}

BinarySearchTree.prototype.inspect=function(){
    return util.inspect(this.root,{depth:null,colors:true})
}
/**
 * Export the Type so that new instances can be created
 * @type {Function}
 */
module.exports = BinarySearchTree;
