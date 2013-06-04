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
```
```
print the tree starting at root (requires util module from Node.js)
console.log(bst.root)
```
--------------------------
Functions added to auto height-balance the tree on insertion
TODO
##############
B-Tree
