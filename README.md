Data Structures and Utilities
----------------------------
* [LRU Cache with Stats] (#lru-node-cache) - Google Guava inspired LRU cache
* [AVL Tree] (#avl-tree) - Sorted Map backed by AVL Tree 
* [Priority Queue] (#priority-queue) - Priority Queue based on a Binary Heap
* [Delay Queue] (#delay-queue) - Queue of 'Delayed' items, item can only be taken when its delay has expired.
* [Skip List] (#skip-list) - Sorted Map backed by Skip List
* [BTree] (#btree)
* [Multi Way Trie] (#rwaytrie) - Map optimized for prefix searching on String keys 
* [Ternary Search Trie] (#tstrie) - Map optimized for prefix searching on String keys
* [MultiMap] (#multi-map) - Map supporting multiple values for a key
* [TreeMultiMap] (#tree-multi-map) - Sorted Map (sorted on keys), supporting multiple values for a key

<a name='lru-node-cahe'/>
###Cache [LRU Cache with stats]

[Reference: Google Guava https://code.google.com/p/guava-libraries/]

In-memory LRU cache implementation for Node, inspired by Google Guava Loading Cache .
The cache is simpler since it doesn't have to deal with concurrent threads, but other functionality of Guava
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
* callback is called with two arguments (error,result) . error contains any error reported by auto loader,
* or any error while creating the entry in cache, otherwise its null. result contains the result
* from the cache, which in turn may have been received from the autoloader, if the entry had expired
* or was not present. If no autoloader is configured or the entry was present in cache, the callback is called 
* with the result in cache. In conformance to async laws, the callback is still asynchronous and 
* not called immediately. For synchronouse get, see getSync()
*/
cache.get(key, callback)

/**
* Get value for key, NOTE: ** This is SYNChronous and result is returned by the function itself**
* Automatically load the value if not present and an auto loader function is configured.
* In this case, we assume that autoloader will also be calling the cache callback synchronously
* Returns result contains the result from the cache, which in turn may have been 
* received from the autoloader, if the entry had expired or was not present. 
*/
cache.getSync(key)

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
they are internally used when an insert or delete violates the AVL property of the tree.
The keys are ordered based on the natural ordering or an optional compare function.
The compare function takes the form
```js
 myCompFn(arg1, arg2)

```
and returns a negative integer, zero, or a positive integer as 
the first argument is greater than, equal to, or less than the second.

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


<a name='multi-map'/>
###MultiMap 
####[Map supporting multiple values for single key]

[Reference: https://code.google.com/p/guava-libraries/wiki/NewCollectionTypesExplained#Multimap]

A Map supporting arbitrary multiple values with a single key

```js
//Creates a MultiMap
var MultiMap = require("dsjslib").MultiMap
var mm=new MultiMap() 

//Insert a key value pair into the Map.
//If the key is already present, the value will be added to the existing list,
//otherwise, an array is created and the value is added to the array

mm.put(key,val) 

//Search for key and return associated value array or empty array
//This method never returns null even if the key is not present
//Any changes made to the returned array modify the underlying array in the MultiMap as well

mm.get(key) 

//Test if a key is present in Map or not. This doesn't modify the Map to create empty array if
//the key was not present.
mm.hasKey(key)

//If a value is provided, only that value is removed from the list
//If value is not provided, key and all values are deleted from the MultiMap

mm.delete(key, [value]) 

//Return a list of all key, value pairs.
//The key value pairs are returned as objects {'key':<K>,'value':<V>}
//Note that for keys associated with multiple values there is one object per value returned in the entry
//for example for key1->val1,val2,val3 , the entries will be
//[{'key':key1,'value':val1},{'key':key1,'value':val2},{'key':key1,'value':val3}]

mm.entries()
```
Known Limitations: None

<a name='tree-multi-map'/>
###TreeMultiMap 
####[Sorted (on keys) Map supporting multiple values for single key]

[Reference: https://code.google.com/p/guava-libraries/wiki/NewCollectionTypesExplained#Multimap]

A Map supporting arbitrary multiple values with a single key. In addition the Map is sorted on keys dynamically.
This Map is backed by an AVLTree Map

```js
//Creates a TreeMultiMap
var TreeMultiMap = require("dsjslib").TreeMultiMap
var mm=new TreeMultiMap([compareFn]) 

//@see MultiMap
mm.put(key,val) 

//@see MultiMap
mm.get(key) 

//@see MultiMap
mm.hasKey(key)

//@see MultiMap
mm.remove(key, [value]) 

//Return a list of all key, value pairs. In addition, the returned list is sorted on keys
//The key value pairs are returned as objects {'key':<K>,'value':<V>}
//Note that for keys associated with multiple values there is one object per value returned in the entry
//for example for key1->val1,val2,val3 , the entries will be
//[{'key':key1,'value':val1},{'key':key1,'value':val2},{'key':key1,'value':val3}]
mm.entries()
```

<a name='priority-queue'/>
###PriorityQueue 
####[A Priority Queue based on Binary Heap]

[Reference: http://docs.oracle.com/javase/7/docs/api/java/util/PriorityQueue.html]

A queue backed by a Binary Heap. Basic queue operation offer and poll run in O(lgn) time.
The elements in this queue are ordered according to their natural ordering or 
based on the compare function provided. The compare function takes the form
```js
 myCompFn(arg1, arg2)

```
and returns a negative integer, zero, or a positive integer as 
the first argument is greater than, equal to, or less than the second.

```js
//Creates a PriorityQueue
var PriorityQueue = require("dsjslib").PriorityQueue
var pq=new PriorityQueue([compareFn]) 


//Insert the object in queue. Re-heapifies the queue.
pq.offer(obj) 

//Returns and removes the element at the head of the queue . Re-heapifies the queue..
//The head of this queue is the maximum element 
//with respect to the specified ordering. If multiple elements 
//are tied for max value, the head is one of those elements -- ties are broken arbitrarily.
pq.poll() 

//Get the head of the queue without removing it from the queue
pq.peek() 

//Returns array of elements in the queue. Ordering of those elements in undefined
pq.entries()

//Cleanup and remove all elements from the queue
pq.clear()

//Returns the number of elements in the queue
pq.size()


```

<a name='delay-queue'/>
###DelayQueue 
####[Queue of 'Delayed' items, item can only be taken when its delay has expired]

[Reference: http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/DelayQueue.html]

The head of the queue is that Delayed item whose delay expired furthest in the past. 
If no delay has expired there is no head and poll() will return null. 
Expiration occurs when the supplied delayFn(item) returns a value less than or equal to zero. 
Even though unexpired items cannot be removed using take() or poll(), they are otherwise treated as normal item. 
For example, the size method returns the count of both expired and unexpired items. 
This queue does not permit null items.

This queue requires a delay function while construction
```js
 someDelayFn(item)

```
The function should return a negative integer, zero, or a positive integer depending on how much time remains
before the item is expired. The argument to the function is the item for which delay is being queried


```js
//Creates a DelayQueue
var DelayQueue = require("dsjslib").DelayQueue
var dq=new DelayQueue(delayFn) 


//Insert the object in queue. Re-heapifies the queue on delay order
dq.offer(obj) 

//Returns and removes the element at the head of the queue . Re-heapifies the queue..
//The head of this queue is the element whose delay expires furthest in the past
//if there is no such element with negative or zero expired delay, this method returns null
dq.poll()


//Retrieve and remove the head of queue when it expires. Unlike poll() which returns immediately with either null
//or the head element (if its expires), this method registers the user callback which will be invoked when 
//the an item is available i.e. delay has expired. The callback is asynchronous 

dq.take(calback)

//Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty. Unlike poll, 
//if no expired item is available in the queue, this method returns the item that will expire next, if one exists
dq.peek() 

//Returns array of elements in the queue. Ordering of those elements in undefined
dq.entries()

//Cleanup and remove all elements from the queue
dq.clear()

//Returns the number of elements in the queue
dq.size()


```



