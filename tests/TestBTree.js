var btree = require("../src/BTree.js"), util = require("util"),assert=require('assert');;
(function () {

    function testInsert() {
        var bt = new btree(3);
        bt.put(10).put(30).put(20).put(40).put(55);//cause root split
        bt.put(5)
        bt.put(11)
        bt.put(6);
        bt.put(50).put(65).put(15).put(22).put(24).put(26);
        console.log(bt.inspect());
        bt.checkInvariants(bt.root);
    }

    function testDelete() {
        var bt = new btree(3);
        bt.put(10).put(30,"avalue").put(20).put(40).put(55);//cause root split
        bt.put(5)
        bt.put(11,"eleven")
        bt.put(6);
        bt.put(50).put(65).put(15)
        bt.put(22).put(24).put(26).put(27).put(28).put(29);
        bt.delete(20);
        bt.delete(26);
        bt.delete(6);
        bt.checkInvariants(bt.root);
        assert.strictEqual(bt.get(20),undefined);
        assert.strictEqual(bt.get(26),undefined);
        assert.strictEqual(bt.get(6),undefined);
        assert.notStrictEqual(bt.get(11),"eleven")
        assert.notStrictEqual(bt.get(30),"avalue")
    }


    /**
     * Test replace and merge of node
     */
    function testDeleteNonInternalNode(){
        var b=new btree(3);
        b.put(10).put(20).put(15).put(35).put(18).put(22);
        b.put(99).put(98).put(97).put(96).put(95);
        b.put(94)
        b.delete(98)
        b.delete(94)
        b.delete(22)
        console.log(b.inspect());
        b.delete(10)
        console.log(b.inspect());
        b.checkInvariants(b.root)
        assert.strictEqual(b.get(10),undefined);
        assert.strictEqual(b.get(22),undefined);
        assert.strictEqual(b.get(94),undefined);
        assert.strictEqual(b.get(98),undefined);
        assert.notStrictEqual(b.get(15),null)
    }

    function testDeleteInternalNode(){
        var b=new btree(3);
        b.put(10).put(20).put(15).put(35).put(18).put(22);
        b.put(99).put(98).put(97).put(96).put(95);
        b.put(94)
        console.log(b.inspect());
        b.delete(35)
        b.delete(94)
        b.delete(97)
        console.log(b.inspect());
    }

    function testMultiLevelTree(){
        var b=new btree(3);
        for(var i=0;i<31;i++){
            b.put(i);
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
        bt.put(10).put(30,{some:"some",obj:"obj"}).put(20).put(40).put(55);//cause root split
        bt.put(5)
        bt.put(11)
        bt.put(6);
        bt.put(50).put(65).put(15)
        console.log(bt.inspect());
        var n=bt.get(30);
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