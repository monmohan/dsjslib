var AVL = require("../src/AVLTree.js"),assert=require('assert');

(function () {
    var bt = new AVL();

    function testInsertWithRebalance() {
        console.log("INSERT AND AVL BALANCE")
        bt.put(16,"some val").put(7,'seven').put(25,'sVal').put(26,'sVal').put(39,'sVal')
            .put(13,'sVal').put(15,'sVal').put(29,'sVal').put(35,'thirtyFive').put(12,'sVal')
            .put(55,{ complex: '55' }).put(11,'sVal').put(24,"chowbees");
        assert.doesNotThrow(function(){bt.checkInvariants(bt.root);},
            "AVL Tree property violated")
        assert.strictEqual(bt.get(15).key,15);
        assert.strictEqual(bt.get(16).value,"some val");
        assert.strictEqual(bt.successor(15).key,16);
        assert.strictEqual(bt.predecessor(35).key,29);
        assert.strictEqual(bt.min().key,7);
        assert.strictEqual(bt.max().key,55);
        bt.put(16,"replaced")
        //check all values are present and its still binary search tree
        assert.deepEqual(bt.entrySet(),[ { key: 7, value: 'seven' },
            { key: 11, value: 'sVal' },
            { key: 12, value: 'sVal' },
            { key: 13, value: 'sVal' },
            { key: 15, value: 'sVal' },
            { key: 16, value: 'replaced' },
            { key: 24, value: 'chowbees' },
            { key: 25, value: 'sVal' },
            { key: 26, value: 'sVal' },
            { key: 29, value: 'sVal' },
            { key: 35, value: 'thirtyFive' },
            { key: 39, value: 'sVal' },
            { key: 55, value: { complex: '55' } } ])
    }

    function testDelete(){
        var bt=new AVL();
        var i=0;
        while(i<30){
           bt.put(i,i+"_val");
           i++;

        }
        assert.doesNotThrow(function(){bt.checkInvariants();},
            "AVL Tree property violated")

    }

    testInsertWithRebalance();
    testDelete()



})();
