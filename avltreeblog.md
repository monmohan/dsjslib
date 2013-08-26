#Sorted Maps in JavaScript
JavaScript objects themselves can serve as Maps. 
There are caveats there as well, [see here](http://www.less-broken.com/blog/2010/12/lightweight-javascript-dictionaries.html), but by and large
one can use plain Objects as Maps in JavaScript

**However a JavaScript object by default can't be used as a ordered Map (ordered on keys)** . 
ECMAScript specification doesn't define any explicit ordering of keys (while enumerating or otherwise). Most Browsers iterate over
properties in the order they were created.

**Sorted Maps** are a data structure available in other languages (example *TreeMap* class in java collections)
Note that the ordering happens on **dynamic data set**. This means that the ordering is maintained irrespective of new
insertions or deletions to the Map. Compare that to say using **JavaScript Array sort() which is static** i.e additions/deletions
of elements in the array will not maintain order or require repeated sorts to maintain order (which would roughly be O(N*logN) cost everytime)
This structure can be used in applications where the need is to
- automatically maintain a sorted order of objects
- the set of objects can dynamically grow or shrink
- able to iterate through the sorted list of objects
- able to lookup the objects based on some key

In this article, we will discuss in detail about AVL Tree implementation in JavaScript which can be used create a sorted Map on dynamic data set.
It is taken from [**dsjslib**](http://monmohan.github.io/dsjslib), a collection of some standard data structures (like sorted map) not available in JavaScript. 

AVLTree in dsjslib is a Sorted Map with O(log N) access time for insert, delete and find operations . Also provides listing the sorted keys and values in O(N) time. 

The article assumes some familiarity with Binary Search Tree data structure


###Quick Look at Binary Search Trees (BST)
A binary search tree is a binary (each node has maximum of two children) tree with the additional property that for each node, the key is greater than the key of its left child and less than the key of its right child. A simple but powerful data structure. 
Below is a binary search tree built from the following sequence of keys – 
15, 11, 21, 17, 13, 9
 
![Basic Tree](http://monmohan.github.io/dsjslib/images/avltree/avl_bal_1.png "Binary Search Tree")

BST allow insert, delete and search of a key in order of height of the tree (O(h)). Searching basically involves comparing key in each node and then deciding to go left (if key is less than the node or right if key is greater) .. This means that the number of comparisons would less than or equal to the longest path from root to leaf (or in other words the height of the tree). So as long as the height of the tree is kept small we are good.

BUT In simple BSTs height depends on the sequence of keys being inserted.

Here is a BST for following sequence of keys 9, 11, 13, 15, 17, 21

![Basic Tree](http://monmohan.github.io/dsjslib/images/avltree/basic_bst.png "Binary Search Tree")

**It’s not a tree anymore but a linked list !! ..** 
Now insert, delete and search take order of number of elements in the tree.

###AVLTree - A balanced search Tree
Unlike a simple binary search tree, an AVL tree introduces additional constraints which force it to be a balanced tree after every operation - so, there are no worst case scenarios as you get in a binary tree. 

We will discuss the AVLTree implementation in dsjslib.

So lets take the same example and see what we can do to avoid a tree becoming a linked list. Lets start building a BST and add 9, 11, 13

![Basic Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_1.png "Binary Search Tree")
 
At this stage, what if **we pull 9 node down and make 11 the root**, the tree looks like

![Basic Tree](http://monmohan.github.io/dsjslib/images/avltree/threenodes.png "Binary Search Tree")

**Its still a binary search tree and also one in which the height of the tree is less than the earlier .**
This is the idea behind AVL Trees to rotate the tree at certain nodes on insertion and deletion and maintain low height in the tree which guarantees O(logN) performance.


###Maintaining the balance
AVLTrees maintain balance in similar way i.e. rotating the tree

####Formal Notions

1.	Height of a node is defined as following
	- Non-existent nodes have height -1
	- Leaf nodes have height 0
	- A non-leaf node height = Max{leftNodeHeight,rightNodeHeight}+1
Example depicted below
 
![Basic Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_v1.png "Tree with Height")

2.	The AVL Tree node invariant says that for any node, the difference between the left and right subtree height can’t be more than 1. This leads to maintaining the height 
O(log Number of nodes)


Steps are

1. After insertion or deletion find the node where violation occurs


2. Once we have the node which was inserted (or parent of the node deleted), move up the tree checking the height difference until we a find node where violation occurs (height difference between subtrees is more than 1).

3. In dsjslib.AVLTree , this is taken care by the function checkAVLProperty(node). This function is invoked post insertion or deletion of a node

```

	AVLTree.prototype.put = function (key, value) {	//do simple BST insert
    var ins = BST.prototype.put.call(this, key, value);
 	try {
	//find where is the violation
        this.checkAVLProperty(ins.node);
    } catch (vErr) {
	//rebalance the tree at that node
        this.rebalance(vErr);
    }
    return ins;}

```

And checking AVLProperty involves checking the difference in height between left and right subtree recursively


```

	AVLTree.prototype.checkAVLProperty = function (node) {if (!node) return;
    var lc = node.leftChild, rc = node.rightChild;

    var hdiff = (rc ? rc.height : -1) - (lc ? lc.height : -1);
    if (Math.abs(hdiff) > 1) {
        if (log.DEBUG)console.log("AVL Height violation at Node key" + node.key);
        throw {'node':node, 'hdiff':hdiff};
    }
    this.checkAVLProperty(node.parent);}

```

####Fixing the Balance

Once we have found the node where violation occurs we need to fix that. There are 4 cases to consider

1. *Right-Right heavy*

![AVL Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_v1.png "Right-Right Heavy") 

   The node where the violation occurs (9, shown in Red) is right heavy. Its right child height is more than its left child height) AND the child (11) is also right heavy.	 
   This can be fixed by **single LEFT rotation at violated node (9)**

![AVL Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_v1_fx.png "Right-Right Heavy Fixed by Left rotation") 
 
2. *Left-Left heavy*

	Symmetrical to right-right heavy case and right rotation at violated node fixes it


3. *Right-Left heavy*

	This case is little bit trickier. In this case (shown below), the violated node is right heavy but the right child is left heavy (its left child height is -1, right child height is 0 which is greater than -1)

	![AVL Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_v2.png "Right-Left Heavy") 

	Lets see if we can fix this by applying our earlier knowledge and rotating left at violated node .


	#####TRY 1 , FAILS

	![AVL Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_v2_fail.png "Right-Left Heavy Single rotation fail") 

 
	We can see that it doesn’t fix the problem. Now the violation occurs at the new parent i.e 11

	These cases are fixed by two rotations
	
	i.	First rotate right at the left heavy child(11)

	![AVL Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_v2_fix1.png "Right-Left Heavy Single rotation fail")
 
	ii.	Now this is a know case of right-right heavy, lets rotate left at the violated node to balance it
	
	![AVL Tree](http://monmohan.github.io/dsjslib/images/avltree/tree_avl_v2_fix2.png "Right-Left Heavy Single rotation fail") 

4. *Left-Right heavy*

	Is symmetric to case c) above and in this case the violated node is left heavy but its left child is right heavy. Applying the same logic as above, it will be fixed by, first a left rotation of the left child and then a right rotation at the violated node.

#####Implementation of Rotation
```
	
	AVLTree.prototype.rebalance = function (vError)	//find the balance at node where violation occurs

    var balance = vError.hdiff, vNode = vError.node, rc = vNode.rightChild, lc = vNode.leftChild;	
    var rcrc = rc && rc.rightChild, rclc = rc && rc.leftChild;

	//find the balance at child node 
    var childBalance = (rcrc ? rcrc.height : -1) - (rclc ? rclc.height : -1);

	//Decide if its a two rotation or single rotation case
    var zigzag = balance > 1 ? childBalance < 0 : childBalance > 0;
 
    if (zigzag/*two rotation case*/) {
		
		//first rotate at child node
        this.rotate(balance > 1 ? vNode.rightChild : vNode.leftChild, childBalance > 0 ? 'l' : 'r')
    }
    //now rotate again at violated node
    this.rotate(vNode, balance > 1 ? 'l' : 'r');
}
```


##Summary	

* *dsjslib.AVLTree* provides support for an ordered map (ordered on keys).
*  The time complexity for put(K,V), get(K), delete(K) is O(logN) where N is the number of keys.
*  Also supports listing of ordered pairs {key:k,value:v} in O(N)
*  This would be much more efficient than using plain JavaScript objects and always sorting on demand 
*  Check out the [**dsjslib**](http://monmohan.github.io/dsjslib) and the [**github repository**](http://github.com/monmohan/dsjslib) for more info.

 
