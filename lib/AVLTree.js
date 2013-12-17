(function () {
    "use strict";
    var isNode = typeof module === 'object' && module.exports;
    /*node or non-node environment*/
    var BST = isNode ? require("./BinarySearchTree.js") : this.BinarySearchTree/*attach to global for non-node*/,
        util = isNode && require("util"),
        debug = isNode ? require("./logger").DEBUG : typeof this.console === "object";

    /**
     * @class AVLTree
     * @classdesc
     * Extends BinarySearchTree (see src/BinarySearchTree.js) to provide a Map like functionality
     * backed by a balanced Tree. All functionality of BinarySearchTree is available.
     * In addition Tree is height balanced by rotation whenever an insert is done
     * See rotate(), reBalance() and checkAVLProperty() functions for explanation.
     * Caller doesn't need to invoke these functions,
     * they are internally used when an insert or delete violates the AVL property of the tree.
     * The keys are ordered based on the natural ordering or an optional compare function.
     * @augments BinarySearchTree
     * @param compFn {userCompareFn=} external compare function for ordering keys
     * @desc
     * #### Example -
     * ```js
     * var AVLTree = require("dsjslib").AVLTree
     * var avl=new AVLTree(function(k1,k2){...})
     * ```
     */
    function AVLTree(compFn) {
        BST.call(this, compFn);
    }

    AVLTree.prototype = new BST();
    /**
     * Rotate a node
     * @access private
     * @param node
     * @param rL
     * @return {String}
     */
    AVLTree.prototype.rotate = function (node, rL) {
        if (!rL || !node) {
            return "Insufficient parameters";
        }
        var tree = this,
            mvChild;
        switch (rL) {
            case 'r':
                if (node.leftChild) {
                    mvChild = node.leftChild.rightChild;
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
            if (par) {
                par[rL === 'r' ? "rightChild" : "leftChild"] = ch;
            } else { //we are rotating at the root
                tree.root = ch;
            }

            if (ch) {
                ch.parent = par;
            }
        }

    };
    /**
     * @access private
     * @param vError
     */
    AVLTree.prototype.rebalance = function (vError) {
        var balance = vError.hdiff, vNode = vError.node;
        var child = balance > 1/*right heavy*/ ? vNode.rightChild : vNode.leftChild;
        //+ve, right heavy, -ve left heavy
        var childBalance = this._nodeHeight(child);
        /**
         * node is right heavy but child is left heavy and vice-versa
         * @type {Boolean}
         */
        var zigzag = balance > 1 ? childBalance < 0 : childBalance > 0;
        if (zigzag/*Requires double rotation*/) {
            //rotate on child first
            this.rotate(child, childBalance > 0 ? 'l' : 'r');
        }
        //rotation on node where violation occurs
        this.rotate(vNode, balance > 1 ? 'l' : 'r');

    };
    /**
     * Insert a key value. It also re-balances the tree
     * @memberof AVLTree.prototype
     * @instance
     * @param key {*}
     * @param value {*}
     * @returns {Object} A closure on the the tree. Calling put() again on this object will
     * insert key value pair in the tree. This is to support easy chaining of put() method.
     * tree.put(k1,v1).put(k2,v2) ...
     */
    AVLTree.prototype.put = function (key, value) {
        var ins = BST.prototype.put.call(this, key, value);
        try {
            this.checkAVLProperty(ins.node);
        } catch (vErr) {
            this.rebalance(vErr);
        }
        return ins;
    };


    /**
     * Delete a key value pair from the Map. Also re-balances the tree
     * @memberof AVLTree.prototype
     * @instance
     * @function delete
     * @param key {*}
     */
    AVLTree.prototype['delete'] = function (key) {
        var node = this.get(key, this.root), p, cNode/*node where violation check should start*/;
        if (node) {
            var num = node.leftChild ? (node.rightChild ? 2 : 1) : (node.rightChild ? 1 : 0);
            switch (num) {
                case 0:
                    p = node.parent;
                    if (p) {
                        var lc = p.leftChild === node;
                        p[lc ? "leftChild" : "rightChild"] = null;
                        node = null;
                        cNode = p;
                    } else {
                        //root
                        this.root = null;
                    }

                    break;
                case 1:
                    //single subtree, the sibling can't have a subtree because
                    // it would have violated the AVL height diff invariant
                    var child = node.leftChild || node.rightChild;
                    node.key = child.key;
                    node.value = child.value;
                    node.leftChild = node.rightChild = null;
                    cNode = node;
                    break;
                case 2:
                    var nextL = this.successor(node.key);
                    var temp = nextL;
                    this['delete'](nextL.key);
                    node.key = temp.key;
                    node.value = temp.value;
            }

            this.reCalcHeight(cNode);
            try {
                this.checkAVLProperty(cNode);
            } catch (vErr) {
                this.rebalance(vErr);
            }

        }

    };

    /**
     * Validates the tree starting at given node (root otherwise)
     * Validates BST as well as AVL properties.
     * @memberof AVLTree.prototype
     * @instance
     * @param node {Object=} Starting node, if not provided start at root
     */
    AVLTree.prototype.checkInvariants = function (node) {
        if (typeof node === "undefined") {
            node = this.root;
        }
        if (!node) return;
        var lc = node.leftChild, rc = node.rightChild;
        if (debug) {
            console.log("Checking AVL Invariants");
            console.log(util && util.format("lc(h)=%s, rc(h)=%s, node=%s",
                lc ? lc.key + "(" + lc.height + ")" : "null(-1)",
                rc ? rc.key + "(" + rc.height + ")" : "null(-1)",
                node.key + "(" + node.height + ")"))
        }
        var hdiff = Math.abs((lc ? lc.height : -1) - (rc ? rc.height : -1));
        if (hdiff > 1) {
            throw new Error("Invariant check failed at node " + node + " key=" + node.key);
        }
        this.checkInvariants(lc);
        this.checkInvariants(rc);


    };


    AVLTree.prototype._nodeHeight = function (node) {
        var lc = node.leftChild, rc = node.rightChild;
        return (rc ? rc.height : -1) - (lc ? lc.height : -1);

    };

    AVLTree.prototype.checkAVLProperty = function (node) {
        if (!node) return;
        var hdiff = this._nodeHeight(node);
        if (Math.abs(hdiff) > 1) {
            if (debug) {
                console.log("AVL Height violation at Node key" + node.key);
            }
            throw {'node' : node, 'hdiff' : hdiff};
        }
        this.checkAVLProperty(node.parent);


    };
    /**
     * Export the Type so that new instances can be created
     * @type {Function}
     */
    if (isNode) {
        module.exports = AVLTree;//node env
    } else {
        this.AVLTree = AVLTree;//attach to global for non node env
    }
}());