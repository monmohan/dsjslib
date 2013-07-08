var btree = require("../src/BTree.js"), util = require("util"),assert=require('assert');;
(function () {

    function testInsert() {
        var bt = new btree(3);
        bt.insert(10).insert(30).insert(20).insert(40).insert(55);//cause root split
        bt.insert(5)
        bt.insert(11)
        bt.insert(6);
        bt.insert(50).insert(65).insert(15).insert(22).insert(24).insert(26);
        console.log(bt.inspect());
        bt.checkInvariants(bt.root);
    }

    function testDelete() {
        var bt = new btree(3);
        bt.insert(10).insert(30,"avalue").insert(20).insert(40).insert(55);//cause root split
        bt.insert(5)
        bt.insert(11,"eleven")
        bt.insert(6);
        bt.insert(50).insert(65).insert(15)
        bt.insert(22).insert(24).insert(26).insert(27).insert(28).insert(29);
        bt.delete(20);
        bt.delete(26);
        bt.delete(6);
        bt.checkInvariants(bt.root);
        assert.strictEqual(bt.search(20),undefined);
        assert.strictEqual(bt.search(26),undefined);
        assert.strictEqual(bt.search(6),undefined);
        assert.notStrictEqual(bt.search(11),"eleven")
        assert.notStrictEqual(bt.search(30),"avalue")
    }


    /**
     * Test replace and merge of node
     */
    function testDeleteNonInternalNode(){
        var b=new btree(3);
        b.insert(10).insert(20).insert(15).insert(35).insert(18).insert(22);
        b.insert(99).insert(98).insert(97).insert(96).insert(95);
        b.insert(94)
        b.delete(98)
        b.delete(94)
        b.delete(22)
        console.log(b.inspect());
        b.delete(10)
        console.log(b.inspect());
        b.checkInvariants(b.root)
        assert.strictEqual(b.search(10),undefined);
        assert.strictEqual(b.search(22),undefined);
        assert.strictEqual(b.search(94),undefined);
        assert.strictEqual(b.search(98),undefined);
        assert.notStrictEqual(b.search(15),null)
    }

    function testDeleteInternalNode(){
        var b=new btree(3);
        b.insert(10).insert(20).insert(15).insert(35).insert(18).insert(22);
        b.insert(99).insert(98).insert(97).insert(96).insert(95);
        b.insert(94)
        console.log(b.inspect());
        b.delete(35)
        b.delete(94)
        b.delete(97)
        console.log(b.inspect());
    }

    function testMultiLevelTree(){
        var b=new btree(3);
        for(var i=0;i<31;i++){
            b.insert(i);
        }
        console.log(b.inspect());
        b.delete(17)
        console.log(b.inspect());
        b.checkInvariants(b.root);
        console.log("BTree Invariant check passed")
    }

    function testSearch(){
        console.log("*test search*")
        var bt = new btree(2);
        bt.insert(10).insert(30,{some:"some",obj:"obj"}).insert(20).insert(40).insert(55);//cause root split
        bt.insert(5)
        bt.insert(11)
        bt.insert(6);
        bt.insert(50).insert(65).insert(15)
        console.log(bt.inspect());
        var n=bt.search(30);
        console.log(n);
        assert.deepEqual(n.key,30)
        assert.deepEqual(n.value,{some:"some",obj:"obj"})
    }

    (function runTests() {
        testInsert()
        testMultiLevelTree()
        testDelete()
        testDeleteNonInternalNode()
        testDeleteInternalNode()
        testSearch()
    })();

})();