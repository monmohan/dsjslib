var BinarySearchTree = require("../src/BinarySearchTree.js"),assert=require('assert');
(function () {
    var bt = new BinarySearchTree();

    function testInsert() {
        console.log("INSERT AND TRAVERSE")
        bt.insert(16,"sVal").insert(7,"seven").insert(25,"sVal").insert(26,"sVal").insert(39,"sVal")
            .insert(13,"sVal").insert(15,"sVal").insert(29,"zzz")
            .insert(35,"sVal").insert(12,"sVal").insert(55,{complex:"55"}).insert(11,"sVal");
        assert.strictEqual(bt.search(29).value,"zzz");
        assert.strictEqual(bt.search(7).key,7);
        assert.strictEqual(bt.search(16).key,16);
        assert.strictEqual(bt.search(12).key,12);
        
        bt.traverse(function (node) {
            console.log(node.item)
        });

    }

    function testMinMax() {
        console.log("FIND min max")
        assert.strictEqual(bt.min().key,7);
        assert.strictEqual(bt.min().value,"seven");
        assert.strictEqual(bt.max().key,55);
        assert.deepEqual(bt.max().value,{complex:"55"});
    }

    
    function testSuccPre() {
        console.log("SUCCESSOR AND PREDECESSOR")
        assert.strictEqual(bt.successor(26).key,29);
        assert.strictEqual(bt.successor(55),null);
        assert.strictEqual(bt.successor(12).key,13);
        assert.strictEqual(bt.predecessor(11).key,7);
        assert.strictEqual(bt.predecessor(7),null);
        assert.strictEqual(bt.predecessor(35).key,29);
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




