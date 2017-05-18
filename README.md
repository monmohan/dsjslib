[dsjslib](https://github.com/monmohan/dsjslib)
=======================================
This is a collection of different data structures and utilities, implemented in JavaScript.
Its written and tested using Node.js which is also the target platform.

### [API Documentation >>](http://monmohan.github.io/dsjslib)


Overview
----------------
* New
    * [Bloom Filter](http://monmohan.github.io/dsjslib/BloomFilter.html) - Probabilistic data structure to test whether an element is a member of a set.

* Maps
    * Sorted Maps:  Maps sorted according to natural ordering of keys or by comparator function provided at creation time.
    Two different backing stores are available
        * [AVLTree](http://monmohan.github.io/dsjslib/AVLTree.html)
        * [Skip List](http://monmohan.github.io/dsjslib/SkipList.html)
    * Tries Map optimized for prefix searching on string keys
        * [Multi Way Trie](http://monmohan.github.io/dsjslib/RWayTrie.html)
        * [Ternary Search Trie](http://monmohan.github.io/dsjslib/TernarySearchTrie.html)
    * Multi-Valued Map supporting multiple values for a key
        * [MultiMap](http://monmohan.github.io/dsjslib/MultiMap.html)
        * [TreeMultiMap](http://monmohan.github.io/dsjslib/TreeMultiMap.html) - In addition, Map is sorted on keys. Uses AVLTree as backing store
* Queues
    * [Linked Deque](http://monmohan.github.io/dsjslib/LinkedDeque.html) - An optionally capacity constrained deque based on linked nodes
    * [Priority Queue](http://monmohan.github.io/dsjslib/PriorityQueue.html) - Priority Queue based on a Binary Heap
    * [Delay Queue](http://monmohan.github.io/dsjslib/DelayQueue.html) - Queue of 'Delayed' items, item can only be taken when its delay has expired.
        For example usage see [wiki: DelayQueue-for-Scheduled-Task-Management](https://github.com/monmohan/dsjslib/wiki/Example:-DelayQueue-for-Scheduled-Task-Management)

* Utilities
    * [LRU Cache with Stats](http://monmohan.github.io/dsjslib/Cache.html) Google Guava inspired LRU cache. [Reference: Google Guava](https://code.google.com/p/guava-libraries/). In-memory LRU cache implementation for Node,
    inspired by Google Guava Loading Cache .  The cache is simpler since it doesn't have to deal with concurrent threads, but other functionality of Guava
    cache are captured like
           - Auto loader function
           - Removal listener
           - Auto expiry After Write (TTL)
           - Max Size and weight
           - Cache Stats recording
    For usage and overview see wiki: https://github.com/monmohan/dsjslib/wiki/LRU-Cache-Feature-and-usage-overview

    * [BitSet](http://monmohan.github.io/dsjslib/BitSet.html) - An array of bits with operations to set, examine and clear individual bits
    * [CircularBuffer](http://monmohan.github.io/dsjslib/CircularBuffer.html) - A data structure that uses a single, fixed-size buffer as if it were connected end-to-end.
    When the buffer is filled, new data is written starting at the beginning of the buffer and overwriting the old.
    * [Bloom Filter](http://monmohan.github.io/dsjslib/BloomFilter.html) - Probabilistic data structure to test whether an element is a member of a set.
    * [BTree](http://monmohan.github.io/dsjslib/BTree.html) - Self balancing generalized Search Tree


Installation
-------------------------
```js
    npm install dsjslib
```
**Current version 0.6.14 is stable and thoroughly tested on Node v0.10**
