This is a collection of data structures, implemented in JavaScript. Its written and tested using
Node.js but the dependencies are mostly peripheral (e.g util for logging and assert module for testing). 
So the code can be used in Browser as well with minor changes.



AVL Tree [Map]
--------------------------
Extends BinarySearchTree (see src/BinarySearchTree.js) to provide a Map like functionality 
backed by a balanced Tree. All functionality of BinarySearchTree is available. 
In addition Tree is height balanced by rotation whenever an insert is done
See rotate(), reBalance() and checkAVLProperty() functions for explanation. 
Caller doesn't need to invoke these functions, they are internally usedd when an insert or delete violates the AVL property of the tree

```js
//Create and AVLTree (extends a BinarySearchTree)
var avl=new AVLTree() 

//Insert a key value. It also rebalances the tree
avl.put(key,value)

//Get a value for key
avl.get(key)


//Renove key vallue, also rebalances the tree
avl.delete(key)

//Predecessor and Successor
avl.predecessor(key)  avl.successor(key) 


//Inorder traversal of the tree. callbackfn called for every node visited
avl.traverse([node],callbackfn)

//Min and Max - if start node not given, starts at root
avl.min([startAtNode]) avl.max([startAtNode])

// Validates the tree starting at given node (root otherwise). 
// Validates BST as well as AVL proeprties
avl.checkInvariants([startAtNode])
                                     
```
```js
//Print the tree starting at root (requires util module from Node.js)
console.log(avl.root)
```
Known Limitations: Currently only supports Numeric or String keys (uses < > for comparison),



SkipList [Map]
----------------------
[Ref - http://ocw.mit.edu Lecture on skip-lists]
```js
//Create a Skip List
//Optional compare function to order the keys. If not provided, a natural ordering is
//assumed.

var skl=new SkipList(compareFn)

//Add a key value
skl.put(k,v)

//Search for a key
skl.get(k)

//delete a key and its associated value
skl.delete(k)

//Get all entries(sorted). They are returned as key value pair objects
skl.entrySet()


```


BTree
----------------------
[Ref - Introduction to Algorithms By Coremen et al.]
```js
Creates a BTree of degree K .
Any node in the Tree can have a maximum of 2*K-1 keys  and a minimum of K-1 keys.
var btree=new BTree(K) 

//Inserts a key and splits nodes as required
btree.put(key,value)

//Search by key
btree.get(key)

//Deletes a key and re-joins nodes and/or reduces the height of tree as required
btree.delete(key)

//Check various BTree invariants -- For sanity testing
1. Except root all nodes have degree -1 <keys<2*degree-1
2. Child keys are less than corresponding parent key (and greater than predecessor parent key)

btree.checkInvariants()

```

Known Limitations: Currently only supports Numeric or String keys (uses < > for natural ordering).
                         

RWayTrie [Map optimized for String keys]
----------------------
[Reference: Algorithms, 4th Edition by Robert Sedgewick and Kevin Wayne]

Data structure supporting String keys, for fast retrieval of values associated with string keys.
In comparison to a Map, has additional (fast) functions like list of keys with prefix
and listing all keys in sorted order. For large R the space requirement for this DS is impractical,
TernarySearchTrie should be used instead.

```js
var rTrie=new RWayTrie(R) - Creates a RWayTrie of alphabet size R . For example if you know that 
the keys are made of ASCII chars only, R=128. Each node in this trie will have an array of size R. 

rTrie.put(key,val) - Inserts a key and set its value as val
rTrie.get(key) - Search for a key and return associated value or null
rTrie.delete(key) - Deletes a key 
rTrie.keyset() - Return a list of all keys in sorted order
```

Known Limitations: None

TernarySearchTrie [Map optimized for String keys]
------------------------------
[Reference: Algorithms, 4th Edition by Robert Sedgewick and Kevin Wayne]

Data structure supporting String keys, for fast retrieval of values associated with 
string keys BUT have much less space requirement than RWayTrie. Functions are same 
as RWayTrie

```js
var tst=new TernarySearchTrie() - Creates a TernarySearchTrie
tst.put(key,val) - insert a key value pair into the Trie
tst.get(key) -- Search for key and return associated value or null
tst.delete(key) -- Deletes a key and associated value
```
Known Limitations: keyset() TBD
