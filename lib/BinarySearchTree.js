(function () {
    var isNode = typeof module === 'object' && module.exports;
    /*node or non-node environment*/

    var util = isNode && require('util'),
        debug = isNode ? require("./logger").DEBUG : typeof this.console === "object";

    /**
     * Implementation of a Binary Search Tree Data structure
     * @param compareFn  optional , fn(a.b) return 1 if b>a, -1 if b<a, 0 otherwise
     * @constructor
     */
    function BinarySearchTree(compareFn) {
        this.root = null;
        /**
         *
         * @param key
         * @param parent
         * @param leftChild
         * @param rightChild
         * @return {Object}
         */
        this.mkNode_ = function (key, val, parent, leftChild, rightChild) {
            return {key : key,
                parent : parent || null,
                leftChild : leftChild || null,
                rightChild : rightChild || null,
                height : 0,
                value : val,
                isLeftChild : function () {
                    return this.parent && this.parent.leftChild === this
                },
                isRightChild : function () {
                    return this.parent && this.parent.rightChild === this
                },
                /**
                 * function to display the tree using Node util class
                 * @return {*}
                 */
                inspect : function () {
                    return util && util.inspect({key : this.key, h : this.height,
                        L : this.leftChild, R : this.rightChild, p : (this.parent ? this.parent.key : null)}, {depth : null, colors : true});
                }

            }
        }
        this._compFn = function (node, key) {
            return compareFn ? compareFn.call(this, node.key, key)
                : (node.key < key ? 1 : node.key > key ? -1 : 0);

        }
        /**
         * Private method to find successor node
         * @param item
         * @param node
         * @return {*}
         */
        var successorNode = function (node) {
            if (node && !node.parent) {
                return minNode(node.rightChild);
            }
            if (node && node.isLeftChild()) {
                //go to the right child if right child is not null
                //descend and get the min of left tree
                return node.rightChild ? minNode(node.rightChild) : node.parent;

            }

            if (node && node.isRightChild()) {
                if (node.rightChild) {
                    return minNode(node.rightChild);
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
        /**
         * Return the successor key value pair
         * @param item
         * @return {*}
         */
        this.successor = function (item) {
            var node = this.get(item, this.root);
            var sc = successorNode(node);
            return sc && {key : sc.key, value : sc.value}

        }

        /**
         * Private method to return min node in tree
         * @param m
         * @return {*}
         */
        var minNode = function (m) {
            while (m.leftChild) {
                m = m.leftChild;
            }
            return m;
        }

        /**
         * Public method - find min key
         * @return {*}
         */
        this.min = function () {
            var mNode = minNode(this.root);
            return mNode && {key : mNode.key, value : mNode.value};

        }
        /**
         * Private return max node in tree
         * @param max
         * @return {*}
         */
        var maxNode = function (max) {
            while (max.rightChild) {
                max = max.rightChild;
            }
            return max;
        }
        /**
         * Public return max key
         * @return {*}
         */
        this.max = function () {
            var mNode = maxNode(this.root);
            return mNode && {key : mNode.key, value : mNode.value};

        }

        /**
         * Private method to find predecessor node
         * @param node
         * @return {*}
         */
        var predecessorNode = function (node) {
            //if the node is the right child
            if (node && node.isRightChild()) {
                //go to the left child if left child is not null
                //descend and get the max of left tree
                return node.leftChild ? maxNode(node.leftChild) : node.parent;
            }
            //if the node is the left child
            if (node && node === node.parent.leftChild) {

                if (node.leftChild) {
                    return maxNode(node.leftChild);
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
        /**
         * Public method to find predecessor key
         * @param key
         * @return {*}
         */
        this.predecessor = function (key) {
            var node = this.get(key, this.root);
            var pNode = predecessorNode(node)
            return pNode && {key : pNode.key, value : pNode.value}
        }


    }


    BinarySearchTree.prototype.put = function (key, value) {
        if (!this.root) {
            this.root = this.mkNode_(key, value);
            return this
        }

        var cNode = this.root;
        var pNode = null;
        var isLeft = false;
        while (cNode) {
            pNode = cNode;
            if (this._compFn(cNode, key) == -1) {
                cNode = cNode.leftChild;
                isLeft = true;
            } else if (this._compFn(cNode, key) == 1) {
                cNode = cNode.rightChild;
                isLeft = false;
            } else {//replace
                cNode.value = value;
                break;
            }
        }
        //cNode should be null now
        var iNode = cNode;
        if (!cNode) {
            iNode = this.mkNode_(key, value, pNode);
            pNode[isLeft ? "leftChild" : "rightChild"] = iNode;
            this.reCalcHeight(iNode);
        }
        var tree = this;
        return {
            put : function (key, value) {
                return tree.put(key, value);
            },
            node : iNode

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
                    console.log(n.key);
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
    BinarySearchTree.prototype.get = function (key, node) {
        if (typeof key === 'undefined' || key === null)return null;
        var retKV = (typeof node === "undefined");
        if (retKV)node = this.root;
        var compFn = this._compFn;
        return recFind(key, node);
        function recFind(key, node) {
            if (!node) return null;
            if (compFn(node, key) === -1) return recFind(key, node.leftChild);
            if (compFn(node, key) === 1) return recFind(key, node.rightChild);
            if (compFn(node, key) === 0)return retKV ? {key : node.key, value : node.value} : node;
        }

    }


    BinarySearchTree.prototype.delete = function (item) {
        var node = this.get(item, this.root), p;
        if (node) {
            var num = node.leftChild ? (node.rightChild ? 2 : 1) : (node.rightChild ? 1 : 0);
            switch (num) {
                case 0:
                    p = node.parent;
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
                    var nextL = this.successor(node.key);
                    this.delete(nextL.key);
                    node.key = nextL.key;
                    node.value = nextL.value;
            }


        }

    }

    BinarySearchTree.prototype.checkInvariants = function (node) {
        if (typeof node === 'undefined') node = this.root;
        if (!node) return;
        var lc = node.leftChild, rc = node.rightChild;
        if (debug) {
            console.log(util.format("lc=%s, rc=%s, node=%s",
                lc ? lc.key : "null", rc ? rc.key : "null", node.key))
        }
        var ok = (!lc || this._compFn(node, lc.key) == -1) &&
            (!rc || this._compFn(node, rc.key) == 1);

        if (!ok) throw new Error("Invariant check failed at node " + node + " key=" + node.key)
        this.checkInvariants(lc);
        this.checkInvariants(rc);
    }

    BinarySearchTree.prototype.inspect = function () {
        return util.inspect(this.root, {depth : null, colors : true})
    }

    BinarySearchTree.prototype.entrySet = function () {
        var entries = [];
        this.traverse(this.root, function (node) {
            entries.push({key : node.key, value : node.value})
        });
        return entries;
    }
    /**
     * Export the Type so that new instances can be created
     * @type {Function}
     */
    if (isNode) {
        module.exports = BinarySearchTree;//node
    } else {
        this.BinarySearchTree = BinarySearchTree;//global for non node env
    }

}())
