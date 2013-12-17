dsjslib
----------------------------
* [LRU Cache with Stats] (#lru-node-cache) - Google Guava inspired LRU cache
* [AVL Tree] (#avl-tree) - Sorted Map backed by AVL Tree 
* [Priority Queue] (#priority-queue) - Priority Queue based on a Binary Heap
* [Delay Queue] (#delay-queue) - Queue of 'Delayed' items, item can only be taken when its delay has expired.
* [Linked Deque] (#linked-deque) - An optionally capacity constrained deque based on linked nodes
* [BitSet] (#bit-set) - An array of bits with operations to set, examine and clear individual bits
* [Skip List] (#skip-list) - Sorted Map backed by Skip List
* [BTree] (#btree) - Self balancing generalized Search Tree
* [Multi Way Trie] (#rwaytrie) - Map optimized for prefix searching on String keys 
* [Ternary Search Trie] (#tstrie) - Map optimized for prefix searching on String keys
* [MultiMap] (#multi-map) - Map supporting multiple values for a key
* [TreeMultiMap] (#tree-multi-map) - Sorted Map (sorted on keys), supporting multiple values for a key

**Current version 0.6.5 is stable and thoroughly tested on Node v0.10**

<a name='lru-node-cache'/>
###Cache
[LRU Cache with stats]

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


<a name='avl-tree'/>
###AVL Tree [Map]

Extends BinarySearchTree (see src/BinarySearchTree.js) to provide a Map like functionality 
backed by a balanced Tree. All functionality of BinarySearchTree is available. 
In addition Tree is height balanced by rotation whenever an insert is done
See rotate(), reBalance() and checkAVLProperty() functions for explanation. 
Caller doesn't need to invoke these functions, 
they are internally used when an insert or delete violates the AVL property of the tree.
The keys are ordered based on the natural ordering or an optional compare function.


<a name='skip-list'/>
###SkipList [Map]

[Ref - http://ocw.mit.edu Lecture on skip-lists]

<a name='btree'/>
###BTree

[Ref - Introduction to Algorithms By Cormen et al.]

**Known Limitations:**
Currently only supports Numeric or String keys (uses < > for natural ordering).
Its more of an academic implementation at this point because all nodes are always in memory. A more robust/practical
implementation which loads data from disk as required will be added soon.
                         

<a name='rwaytrie'/>
###RWayTrie [Map optimized for String keys]

[Reference: Algorithms, 4th Edition by Robert Sedgewick and Kevin Wayne]

Data structure supporting String keys, for fast retrieval of values associated with string keys.
In comparison to a Map, has additional (fast) functions like list of keys with prefix
and listing all keys in sorted order. For large R the space requirement 
for this DS is impractical (although in javascript arrays are sparse so its not the same)
, TernarySearchTrie can be more practical alternative.

<a name='tstrie'/>
###TernarySearchTrie [Map optimized for String keys]

[Reference: Algorithms, 4th Edition by Robert Sedgewick and Kevin Wayne]

Data structure supporting String keys, for fast retrieval of 
values associated with  string and provide prefix searches.
Functions are same as RWayTrie

<a name='multi-map'/>
###MultiMap 
####[Map supporting multiple values for single key]

[Reference: https://code.google.com/p/guava-libraries/wiki/NewCollectionTypesExplained#Multimap]

A Map supporting arbitrary multiple values with a single key


<a name='tree-multi-map'/>
###TreeMultiMap 
####[Sorted (on keys) Map supporting multiple values for single key]

[Reference: https://code.google.com/p/guava-libraries/wiki/NewCollectionTypesExplained#Multimap]

A Map supporting arbitrary multiple values with a single key. In addition the Map is sorted on keys dynamically.
This Map is backed by an AVLTree Map

<a name='priority-queue'/>
###PriorityQueue 
####[A Priority Queue based on Binary Heap]

[Reference: http://docs.oracle.com/javase/7/docs/api/java/util/PriorityQueue.html]

A queue backed by a Binary Heap. Basic queue operation offer and poll run in O(lgn) time.
The elements in this queue are ordered according to their natural ordering or 
based on the compare function provided.

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

For example usage see wiki - 

https://github.com/monmohan/dsjslib/wiki/Example:-DelayQueue-for-Scheduled-Task-Management

<a name='linked-deque'/>
###LinkedDeque
####[An optionally-bounded deque based on linked nodes.]

[Reference: http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/LinkedBlockingDeque.html]

A Deque using linked nodes instead of standard javascript Array. In addition the Deque can be
optionally capacity constrained, if unspecified, the value is set to Number.MAX_VALUE.
Standard javascript Array's shift, unshift, push and pop operations are implemented for linked nodes.


<a name='bit-set'/>
###BitSet
####[A fixed (at construction time) size Bit Array, emulates an array of booleans but with much lesser space]

[Reference: http://en.wikipedia.org/wiki/Bit_array]

This class implements an vector of bits. The size is given at creation time.
Each component of the bit set has a boolean value. The bits of a BitSet are indexed by nonnegative integers.
Individual indexed bits can be examined, set, or cleared. By default, all bits in the set initially
have the value false.



