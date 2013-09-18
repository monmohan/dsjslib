(function () {
    "use strict";
    var MultiMap = require('./MultiMap.js'), AVLTree = require('./AVLTree.js');

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