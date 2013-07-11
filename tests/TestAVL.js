var AVL = require("../src/AVLTree.js"),assert=require('assert');

(function () {
    var bt = new AVL();

    function testInsertWithRebalance() {
        console.log("INSERT AND AVL BALANCE")
        bt.put(16,"some val").put(7).put(25).put(26).put(39)
            .put(13).put(15).put(29).put(35).put(12).put(55).put(11);
        assert.doesNotThrow(function(){bt.checkInvariants(bt.root);},
            "AVL Tree property violated")
        assert.strictEqual(bt.get(15).key,15);
        assert.strictEqual(bt.get(16).value,"some val");
        assert.strictEqual(bt.successor(15).key,16);
        assert.strictEqual(bt.predecessor(35).key,29);
        assert.strictEqual(bt.min().key,7);
        assert.strictEqual(bt.max().key,55);
        console.log(bt.root);
    }

    testInsertWithRebalance();



})();
