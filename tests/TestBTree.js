var btree = require("../src/BTree.js"), util = require("util");
(function () {
    var bt = new btree(2);

    function testInsert() {
        bt = new btree(3);
        bt.insert(10).insert(30).insert(20).insert(40).insert(55);//cause root split
        bt.insert(5)
        bt.insert(11)
        bt.insert(6);
        bt.insert(50).insert(65).insert(15).insert(22).insert(24).insert(26);
        console.log(bt.inspect());
    }

    function testDelete() {
        bt = new btree(3);
        bt.insert(10).insert(30).insert(20).insert(40).insert(55);//cause root split
        bt.insert(5)
        bt.insert(11)
        bt.insert(6);
        bt.insert(50).insert(65).insert(15)
        bt.insert(22).insert(24).insert(26).insert(27).insert(28).insert(29);
        bt.delete(20);
        bt.delete(26);
        bt.delete(6);
        console.log(bt.inspect());
    }

    function testSearch(){
        console.log("*test search*")
        bt = new btree(4);
        bt.insert(10).insert(30).insert(20).insert(40).insert(55);//cause root split
        bt.insert(5)
        bt.insert(11)
        bt.insert(6);
        bt.insert(50).insert(65).insert(15)
        var n=bt.search(30,bt.root);
        console.log(n);
    }

    (function runTests() {
        testInsert()
        testDelete()
        testSearch()
    })();

})();