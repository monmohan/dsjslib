var BinarySearchTree = require("../src/BinarySearchTree.js"),assert=require('assert');
(function () {
    var bt = new BinarySearchTree();

    function testInsert() {
        console.log("INSERT AND TRAVERSE")
        bt.insert(16).insert(7).insert(25).insert(26).insert(39)
            .insert(13).insert(15).insert(29).insert(35).insert(12).insert(55).insert(11);
        assert.strictEqual(bt.search(29).item,29);
        assert.strictEqual(bt.search(7).item,7);
        assert.strictEqual(bt.search(16).item,16);
        assert.strictEqual(bt.search(12).item,12);
        
        bt.traverse(function (node) {
            console.log(node.item)
        });

    }

    function testMinMax() {
        console.log("FIND min max")
        assert.strictEqual(bt.min().item,7);
        assert.strictEqual(bt.max().item,55);
    }

    
    function testSuccPre() {
        console.log("SUCCESSOR AND PREDECESSOR")
        assert.strictEqual(bt.successor(26).item,29);
        assert.strictEqual(bt.successor(55),null);
        assert.strictEqual(bt.successor(12).item,13);
        assert.strictEqual(bt.predecessor(11).item,7);
        assert.strictEqual(bt.predecessor(7),null);
        assert.strictEqual(bt.predecessor(35).item,29);
    }

    function testDel() {
        console.log("DELETE")
        bt.delete(29);
        assert.strictEqual(bt.search(29),null);
        bt.delete(13);
        assert.strictEqual(bt.search(13),null);

    }

    (function testBSTfuncs() {
        testInsert();
        testMinMax();
        testSuccPre();
        testDel();
        //pretty print the tree
        console.log(bt.root);
    })();


})();




