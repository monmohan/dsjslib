(function () {
    "use strict";
    var MultiMap = require('./MultiMap.js'), AVLTree = require('./AVLTree.js');

    /**
     * @class TreeMultiMap
     * @classdesc A Map supporting arbitrary multiple values with a single key. In addition the Map is sorted on keys dynamically.
     * This Map is backed by an {@link AVLTree}
     * [Reference: MultiMap in Google Guava libraries](https://code.google.com/p/guava-libraries/wiki/NewCollectionTypesExplained#Multimap)
     * @augments MultiMap
     * @param orderFn {userCompareFn} Function to provide custom ordering of keys
     * @desc
     * #### Example -
     * ```js
     * var TreeMultiMap = require("dsjslib").TreeMultiMap
     * var tmap=new TreeMultiMap(function(k1,k2){return k1-k2})
     * ```
     */
    function TreeMultiMap(orderFn) {
        this._mmap = {
            'wrapped' : new AVLTree(orderFn),
            'get' : function (key) {
                var vObj = this.wrapped.get(key);
                return vObj && vObj.value;
            },
            'set' : function (k, v) {
                this.wrapped.put(k, v);
            },
            'delete' : function (k) {
                this.wrapped['delete'](k);
            }

        };
    }

    TreeMultiMap.prototype = new MultiMap();

    /**
     * Return a list of all key, value pairs. In addition, the returned list is sorted on keys
     * The key value pairs are returned as objects {'key':<K>,'value':<V>}
     * Note that for keys associated with multiple values there is one object per value returned in the entry
     * for example for key1->val1,val2,val3 , the entries will be
     * [{'key':key1,'value':val1},{'key':key1,'value':val2},{'key':key1,'value':val3}]
     * @memberOf TreeMultiMap.prototype
     * @instance
     * @returns {Array} Array of objects {'key':<K>,'value':<V>}
     */
    TreeMultiMap.prototype.entries = function () {
        var entries = [];
        this._mmap.wrapped.traverse(this._mmap.wrapped.root, function (node) {
            node.value.forEach(function (v) {
                entries.push({'key' : node.key, 'value' : v});
            });

        });
        return entries;
    };

    module.exports = TreeMultiMap;


})();