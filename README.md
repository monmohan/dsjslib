dsjslib
=======================================
This is a collection of different data structures and utilities, implemented in JavaScript.
Its written and tested using Node.js which is also the target platform.

* <h3>Maps</h3>
    * <h4>Sorted Maps</h4> Maps sorted according to natural ordering of keys or by comparator function provided at creation time.
    Two different backing stores are available
        * [AVLTree](#avl-tree)
        * [Skip List](#skip-list)
    * <h4>Tries</h4> Map optimized for prefix searching on string keys
        * [Multi Way Trie](#rwaytrie)
        * [Ternary Search Trie](#tstrie)
    * <h4>Multi-Valued</h4> Map supporting multiple values for a key
        * [MultiMap](#multi-map)
        * [TreeMultiMap](#tree-multi-map) - In addition, Map is sorted on keys. Uses AVLTree as backing store
* <h3>Queues</h3>
    * <h4>[Linked Deque](#linked-deque)</h4> - An optionally capacity constrained deque based on linked nodes
    * <h4>[Priority Queue](#priority-queue)</h4> - Priority Queue based on a Binary Heap
    * <h4>[Delay Queue](#delay-queue)</h4> - Queue of 'Delayed' items, item can only be taken when its delay has expired.
        For example usage see [wiki](https://github.com/monmohan/dsjslib/wiki/Example:-DelayQueue-for-Scheduled-Task-Management)

* <h3>Utilities</h3>
    * <h4>LRU Cache with Stats</h4> Google Guava inspired LRU cache. [Reference: Google Guava](https://code.google.com/p/guava-libraries/]. In-memory LRU cache implementation for Node,
    inspired by Google Guava Loading Cache .  The cache is simpler since it doesn't have to deal with concurrent threads, but other functionality of Guava
    cache are captured like
           - Auto loader function
           - Removal listener
           - Auto expiry After Write (TTL)
           - Max Size and weight
           - Cache Stats recording
    For usage and overview see wiki: https://github.com/monmohan/dsjslib/wiki/LRU-Cache-Feature-and-usage-overview

    * <h4>[BitSet](#bit-set)</h4> - An array of bits with operations to set, examine and clear individual bits
    * <h4>[BTree](#btree)</h4> - Self balancing generalized Search Tree



**Current version 0.6.5 is stable and thoroughly tested on Node v0.10**








