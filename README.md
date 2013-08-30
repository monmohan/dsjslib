Cache [LRU Cache with stats]
------------------------------
[Reference: Google Guava https://code.google.com/p/guava-libraries/]

In-memory cache implementation for Node, inspired by Google Guava Loading Cache .
The cache is much simpler since it doesn't have to deal with concurrent threads, but other functionality of Guava
cache are captured e.g auto loader function, removal listener, stats recording etc.

```js

var Cache = require("dsjslib").Cache

//General format
var cache = new Cache(cacheSpecObject)

//Create a cache of maximum size 100, entries set to expire after 60 seconds post write
var cache=new Cache(
/*Cache spec object*/{
'maximumSize':100,
'expiresAfterWrite':60
})

//Create a cache of maximum size 100, entries set to expire after 60 seconds post write, 
//and a caller provided automatic loader function to load the value in Cache if not present.
//myloader function should take an argument  (key) and return the value to be stored for the key.
//undefined and null values can't be stored and an error will be raised 

var cache=new Cache(
/*Cache spec object*/{
'maximumSize':100,
'expiresAfterWrite':60,
'loaderFunction':myLoaderFn
})



//Create a cache with max size, TTL, auto loader function and also adds a removal listener. 
//The function specified by the 'onRemove' property is called when an entry is evicted. 
//THis function takes three arguments key, value, cause . 
//Cause can be one of 'expired', 'capacity' or 'explicit'

var cache=new Cache(
/*Cache spec object*/{
'maximumSize':100,
'expiresAfterWrite':60,
'loaderFunction':myloader,
'onRemove':removeListenerFn
})


//Creates a Cache with capacity based on maximum weight instead of number of entries
//maximumWeight specifies the capacity and weigherFunction would be invoked to get 
// the weight of key, value. 
//Note that eviction strategy for Cache can max weight or max size but not both
//TTL (expireAfterWrite) can be used with both capacity strategies

var cache=new Cache(
/*Cache spec object*/{
'maximumWeight':1000,
'weigherFunction':myWeigherFn,
'loaderFunction':myloader,
'onRemove':removeListenerFn
})

//Record stats of the cache
//Hit, Miss and request counts are recorded
var cache=new Cache(
/*Cache spec object*/{
'maximumSize':100,
.................
'recordStats':true
})

```
**API**

```js
//Get value for key,
//Automatically load the value if not present and an auto loader function is configured
cache.get(key)

//Get value for key as present in cache, not attempt to load the key will be done
//even if a loader is configured

cache.getIfPresent(key)

//Add a key value 
cache.put(key,value)

//Invalidate a key, If a removal listener is configured, it will be invoked with key value pair
//and removal cause as 'explicit'
cache.inavlidate(key)

//Invalidate all keys in cache, removal listeners are not invoked
cache.inavlidateAll()

//Gets statistics of cache usage
cache.stats returns an object {'hitCount':<number>,'missCount':<number>,'reqeustCount':<number>}


```



AVL Tree [Map]
--------------------------
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


SkipList [Map]
----------------------
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


BTree
----------------------
[Ref - Introduction to Algorithms By Coremen et al.]
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
                         

RWayTrie [Map optimized for String keys]
----------------------
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

TernarySearchTrie [Map optimized for String keys]
------------------------------
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




