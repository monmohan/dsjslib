/**
 * Created with IntelliJ IDEA.
 * User: msingh
 * Date: 29/4/13
 * Time: 7:26 PM
 * To change this template use File | Settings | File Templates.
 */
function mkNode(item, parent, leftChild, rightChild) {
    return {item:item,
        parent:parent || null,
        leftChild:leftChild || null,
        rightChild:rightChild || null
    }
}

var BinarySearchTree = function () {
    this.root = null;
};

BinarySearchTree.prototype.insert = function (obj) {
    if (!this.root) {
        this.root = mkNode(obj);
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
    pNode[isLeft ? "leftChild" : "rightChild"] = mkNode(obj, pNode);

    return this;
}
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
        }else{
           fn=function(n){
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

BinarySearchTree.prototype.delete=function(item){
    var node = this.search(item);
    if(node){
        var num= node.leftChild?(node.rightChild?2:1):(node.rightChild?1:0);
        switch (num){
            case 0:
                var p=node.parent;
                if(p){
                    var lc= p.leftChild === node;
                    p[lc?"leftChild":"rightChild"]=null;
                    node=null;
                }
                break;
            case 1:
                //single subtree
                p=node.parent;
                if(p){
                    lc= p.leftChild === node;
                    var child=node.leftChild || node.rightChild;
                    child.parent=p;
                    p[lc?"leftChild":"rightChild"]=child;
                    node=null;
                } else{
                    //root
                    child=node.leftChild || node.rightChild;
                    lc= node.leftChild === child;
                    child.parent=null;
                }
            break;
            case 2:
                var nextL=this.successor(node.item);
                var temp=nextL.item;
                this.delete(nextL.item);
                node.item=temp;
        }


    }

}

var test = function () {
    var bt = new BinarySearchTree();
    function testInsert(){
        console.log("INSERT AND TRAVERSE")
        bt.insert(16).insert(7).insert(25).insert(26).insert(39)
            .insert(13).insert(15).insert(29).insert(35).insert(12).insert(55).insert(11);
        bt.traverse( function (node) {
            console.log(node.item )
        });

    }
    testInsert()
    function testMinMax() {
        console.log("FIND min max")
        console.log("min " + bt.min().item);
        console.log("min " + bt.max().item);
    }
    testMinMax();
    function testSearch() {
        console.log("SEARCH")
        var f = bt.search(29);
        console.log("node " + f+" "+f?f.item:"");
    }
    testSearch();
    function testSuccPre() {
        console.log("SUCCESSOR AND PREDECESSOR")
        console.log("successor of 26 = " + bt.successor(26).item);
        console.log("pre of 11 = " + bt.predecessor(11).item);
    }
    function testDel() {
        console.log("DELETE")
        bt.delete(29);
        bt.traverse(
            function (node) {
                console.log(node.item )
            }
        );
        bt.delete(13);
        bt.traverse( function (node) {
            console.log(node.item )
        });
    }
    testSuccPre();

    testDel();
};

test();
