Tree Datastructures implemented in JavaScript
==========
Binary Search Tree
------------------------
All functions : insert, delete, find, successor, predecessor, traversal, min, max
```
var bst=new BinarySearchTree()
bst.insert(key) -insert a key
bst.find(key) -search
bst.delete(key) -delete a key
bst.predecessor(key) - predecessor 
bst.successor(key) - successor
bst.traverse([node],callbackfn) - inorder traversal of the tree. callbackfn called for every node visited
bst.min([startAtNode]) - if start node not given, starts at root
bst.max([startAtNode]) - if start node not given, starts at root
bst.checkInvariants([startAtNode]) - Validates the tree starting at given node (root otherwise)
```
```
print the tree starting at root (requires util module from Node.js)
console.log(bst.root)
```
AVL Tree
--------------------------
Extends BinarySearchTree. All functionality of BinarySearchTree is available. In addition Tree is height balanced
by rotation when an insert or delete is done
See rotate(), reBalance() and checkAVLProperty() functions for explanation. They need not be used directly but are invoked
when an insert or delete violates the AVL property of the tree
```
var avl=new AVLTree() 
avl.insert(key) -insert a key
avl.find(key) -search
avl.delete(key) -delete a key
avl.predecessor(key) - predecessor 
avl.successor(key) - successor
avl.traverse([node],callbackfn) - inorder traversal of the tree. callbackfn called for every node visited
avl.min([startAtNode]) - if start node not given, starts at root
avl.max([startAtNode]) - if start node not given, starts at root
avl.checkInvariants([startAtNode]) - Validates the tree starting at given node (root otherwise). Validates BST as well as AVL proeprties
```
```
print the tree starting at root (requires util module from Node.js)
console.log(avl.root)
```
