Data Structures and Utilities
----------------------------
* [LRU Cache with Stats] (#lru-node-cache)
* [AVL Tree] (#avl-tree) - Sorted Map backed by AVL Tree 
* [Skip List] (#skip-list) - Sorted Map backed by Skip List
* [BTree] (#btree)
* [Multi Way Trie] (#rwaytrie) - Map optimized for prefix searching on String keys 
* [Ternary Search Trie] (#tstrie) - Map optimized for prefix searching on String keys

<a name='lru-node-cahe'/>
###Cache [LRU Cache with stats]

[Reference: Google Guava https://code.google.com/p/guava-libraries/]

In-memory LRU cache implementation for Node, inspired by Google Guava Loading Cache .
The cache is much simpler since it doesn't have to deal with concurrent threads, but other functionality of Guava
cache are captured like
- Auto loader function
- Removal listener
- Auto expiry After Write (TTL)
- Max Size and weight
- Cache Stats recording

For usage and overview see wiki: https://github.com/monmohan/dsjslib/wiki/LRU-Cache-Feature-and-usage-overview

**API**

```js
/**
* Get value for key, NOTE: ** This is ASYNChronous and result is available from callback function**
* Automatically load the value if not present and an auto loader function is configured
* callback is called with two arguments (error,result) . 
* error contains any error reported by auto loader,
* or
* any error while creating the entry in cache,
* otherwise its null. 
* result contains the result from the cache 
* which in turn may have been received from the autoloader, if the entry had expired or was not present .
* If no autoloader is configured 
* or 
* the entry was present in cache, 
* the callback is called immediately with the result in cache
*/
cache.get(key, callback)

//Get value for key as present in cache, No attempt to load the key will be done
//even if a loader is configured

cache.getIfPresent(key)

//Add a key value 
cache.put(key,value)

//Invalidate a key, If a removal listener is configured, it will be invoked with key value pair
//and removal cause as 'explicit'
cache.invalidate(key)

//Invalidate all keys in cache, removal listeners are not invoked
cache.invalidateAll()

//Gets statistics of cache usage
cache.stats returns an object {'hitCount':<number>,
                               'missCount':<number>,
                               'reqeustCount':<number>}


```



<a name='avl-tree'/>
###AVL Tree [Map]

Extends BinarySearchTree (see src/BinarySearchTree.js) to provide a Map like functionality 
backed by a balanced Tree. All functionality of BinarySearchTree is available. 
In addition Tree is height balanced by rotation whenever an insert is done
See rotate(), reBalance() and checkAVLProperty() functions for explanation. 
Caller doesn't need to invoke these functions, 
they are internally used when an insert or delete violates the AVL property of the tree

```js
//Create and AVLTree (extends a BinarySearchTree)
var AVLTree = require("dsjslib").AVLTree
var avl=new AVLTree([compareFn]) //optional compare fn to sort the keys

//Insert a key value. It also re-balances the tree
avl.put(key,value)

//Get a value for key
avl.get(key)


//Remove key vallue, also rebalances the tree
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


<a name='skip-list'/>
###SkipList [Map]

[Ref - http://ocw.mit.edu Lecture on skip-lists]
```js
//Create a Skip List
//Optional compare function to order the keys. If not provided, a natural ordering is
//assumed.

var SkipList = require("dsjslib").SkipList
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

<a name='btree'/>
###BTree

[Ref - Introduction to Algorithms By Cormen et al.]
```js
Creates a BTree of degree K .
Any node in the Tree can have a maximum of 2*K-1 keys  and a minimum of K-1 keys.

var BTree = require("dsjslib").BTree

var btree=new BTree(K) 

//Inserts a key and splits nodes as required
btree.put(key,value)

//Search by key
btree.get(key)

//Deletes a key and re-joins nodes and/or reduces the height of tree as required
btree.delete(key)

//Check various BTree invariants -- For sanity testing
1. Except root all nodes have degree -1 <keys<2*degree-1
2. Child keys are less than corresponding parent key 
   (and greater than predecessor parent key)

btree.checkInvariants()

```

Known Limitations: Currently only supports Numeric or String keys (uses < > for natural ordering).
                         

<a name='rwaytrie'/>
###RWayTrie [Map optimized for String keys]

[Reference: Algorithms, 4th Edition by Robert Sedgewick and Kevin Wayne]

Data structure supporting String keys, for fast retrieval of values associated with string keys.
In comparison to a Map, has additional (fast) functions like list of keys with prefix
and listing all keys in sorted order. For large R the space requirement 
for this DS is impractical (although in javascript arrays are sparse so its not the same)
, TernarySearchTrie can be more practical alternative.

```js
// Creates a RWayTrie of alphabet size R .
//For example if you know that the keys are made of ASCII chars only, R=128. 
//Each node in this trie will have an array of size R. 

var RWayTrie = require("dsjslib").RWayTrie
var rTrie=new RWayTrie(R) 

// Inserts a key and set its value as val
rTrie.put(key,val) 

//Search for a key and return associated value or null
rTrie.get(key) 

//Deletes a key 
rTrie.delete(key) 

//Return a list of all key, value pairs in sorted order (of keys)
rTrie.entrySet() 

//Return a list of all key, value pairs where
//keys start with given prefix_chars
rTrie.keysWithPrefix(prefix_chars) 
```

Known Limitations: None

<a name='tstrie'/>
###TernarySearchTrie [Map optimized for String keys]

[Reference: Algorithms, 4th Edition by Robert Sedgewick and Kevin Wayne]

Data structure supporting String keys, for fast retrieval of 
values associated with  string and provide prefix searches.
Functions are same as RWayTrie

```js
//Creates a TernarySearchTrie
var TernarySearchTrie = require("dsjslib").TernarySearchTrie
var tst=new TernarySearchTrie() 

//Insert a key value pair into the Trie
tst.put(key,val) 

//Search for key and return associated value or null
tst.get(key) 

//Deletes a key and associated value
tst.delete(key) 

//Return a list of all key, value pairs where
//keys start with given prefix_chars
tst.keysWithPrefix(prefix_chars)                                      
```
Known Limitations: None




