Tree Datastructures implemented in JavaScript
==========
Binary Search Tree
------------------------

```
//create a binary tree
var bst=new BinarySearchTree()

//Insert a key
bst.insert(key)

//Find a key
bst.find(key)

//Delete a key
bst.delete(key)

//Predecessor and Successor
bst.predecessor(key) 
bst.successor(key) 

//Inorder traversal of the tree. callbackfn called for every node visited
bst.traverse([node],callbackfn) 

//Min and Max - if start node not given, starts at root
bst.min([startAtNode]) 
bst.max([startAtNode]) 

//Run this to validate the tree. Useful for testing
bst.checkInvariants([startAtNode]) - Validates the tree starting at given node (root otherwise)
```
```
print the tree starting at root (Requires util module from Node.js)
console.log(bst.root)
```
AVL Tree
--------------------------
Extends BinarySearchTree. 
All functionality of BinarySearchTree is available. 
In addition Tree is height balanced by rotation whenever an insert or delete is done
See rotate(), reBalance() and checkAVLProperty() functions for explanation. 
Caller doesn't need to invoke these functions, they are internally usedd when an insert or delete violates the AVL property of the tree

```
//Create and AVLTree (extends a BinarySearchTree)
var avl=new AVLTree() 

//Insert and delete. They also rebalance the tree
avl.insert(key)
avl.delete(key)

// Validates the tree starting at given node (root otherwise). 
// Validates BST as well as AVL proeprties
avl.checkInvariants([startAtNode])
                                     
```
```
//Print the tree starting at root (requires util module from Node.js)
console.log(avl.root)
```

BTree
----------------------
```
var btree=new BTree(K) - Creates a BTree of degree K . Any node in the Tree can have a maximum of 2*K-1 keys 
                         and a minimum of K-1 keys.
avl.insert(key) - Inserts a key and splits nodes as required
avl.find(key) - Search for a key
avl.delete(key) - Deletes a key and re-joins nodes and/or reduces the height of tree as required
```
For explanation of insert and delete algos, see Chpater 18 from Introduction to Algorithms By Coremen et al.
                         
