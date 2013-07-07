var AVL = require("../src/AVLTree.js"),assert=require('assert');

(function () {
    var bt = new AVL();

    function testInsertWithRebalance() {
        console.log("INSERT AND AVL BALANCE")
        bt.insert(16,"some val").insert(7).insert(25).insert(26).insert(39)
            .insert(13).insert(15).insert(29).insert(35).insert(12).insert(55).insert(11);
        assert.doesNotThrow(function(){bt.checkInvariants(bt.root);},
            "AVL Tree property violated")
        assert.strictEqual(bt.search(15).key,15);
        assert.strictEqual(bt.successor(15).key,16);
        assert.strictEqual(bt.predecessor(35).key,29);
        assert.strictEqual(bt.min().key,7);
        assert.strictEqual(bt.max().key,55);
        console.log(bt.root);
    }

    testInsertWithRebalance();



})();
