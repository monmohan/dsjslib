[dsjslib](https://github.com/monmohan/dsjslib)
=======================================
This is a collection of different data structures and utilities, implemented in JavaScript.
Its written and tested using Node.js which is also the target platform.

###[API Documentation >>](http://monmohan.github.io/dsjslib)


Overview
----------------

* <h3>Maps</h3>
    * <h4>Sorted Maps</h4> Maps sorted according to natural ordering of keys or by comparator function provided at creation time.
    Two different backing stores are available
        * [AVLTree](http://monmohan.github.io/dsjslib/AVLTree.html)
        * [Skip List](http://monmohan.github.io/dsjslib/SkipList.html)
    * <h4>Tries</h4> Map optimized for prefix searching on string keys
        * [Multi Way Trie](http://monmohan.github.io/dsjslib/RWayTrie.html)
        * [Ternary Search Trie](http://monmohan.github.io/dsjslib/TernarySearchTrie.html)
    * <h4>Multi-Valued</h4> Map supporting multiple values for a key
        * [MultiMap](http://monmohan.github.io/dsjslib/MultiMap.html)
        * [TreeMultiMap](http://monmohan.github.io/dsjslib/TreeMultiMap.html) - In addition, Map is sorted on keys. Uses AVLTree as backing store
* <h3>Queues</h3>
    * <h4>[Linked Deque](http://monmohan.github.io/dsjslib/LinkedDeque.html)</h4> - An optionally capacity constrained deque based on linked nodes
    * <h4>[Priority Queue](http://monmohan.github.io/dsjslib/PriorityQueue.html)</h4> - Priority Queue based on a Binary Heap
    * <h4>[Delay Queue](http://monmohan.github.io/dsjslib/DelayQueue.html)</h4> - Queue of 'Delayed' items, item can only be taken when its delay has expired.
        For example usage see [wiki: DelayQueue-for-Scheduled-Task-Management](https://github.com/monmohan/dsjslib/wiki/Example:-DelayQueue-for-Scheduled-Task-Management)

* <h3>Utilities</h3>
    * <h4>[LRU Cache with Stats](http://monmohan.github.io/dsjslib/Cache.html)</h4> Google Guava inspired LRU cache. [Reference: Google Guava](https://code.google.com/p/guava-libraries/]. In-memory LRU cache implementation for Node,
    inspired by Google Guava Loading Cache .  The cache is simpler since it doesn't have to deal with concurrent threads, but other functionality of Guava
    cache are captured like
           - Auto loader function
           - Removal listener
           - Auto expiry After Write (TTL)
           - Max Size and weight
           - Cache Stats recording
    For usage and overview see wiki: https://github.com/monmohan/dsjslib/wiki/LRU-Cache-Feature-and-usage-overview

    * <h4>[BitSet](http://monmohan.github.io/dsjslib/BitSet.html)</h4> - An array of bits with operations to set, examine and clear individual bits
    * <h4>[CircularBuffer](http://monmohan.github.io/dsjslib/CircularBuffer.html)</h4> - A data structure that uses a single, fixed-size buffer as if it were connected end-to-end. When the buffer is filled,
                                                                                 new data is written starting at the beginning of the buffer and overwriting the old.
    * <h4>[BTree](http://monmohan.github.io/dsjslib/BTree.html)</h4> - Self balancing generalized Search Tree


Installation
-------------------------
```js
    npm install dsjslib
```
**Current version 0.6.6 is stable and thoroughly tested on Node v0.10**








