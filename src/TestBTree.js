var btree = require("./BTree.js"), util = require("util");
(function () {
    var bt = new btree(2);

    function setup() {
        bt.root.keys = [5, 10, 15];
        bt.root.cPtrs[0] = bt.mkNode();
        bt.root.cPtrs[0].keys = [1, 2]
        bt.root.cPtrs[0].n = 2;
        bt.root.cPtrs[1] = bt.mkNode();
        bt.root.cPtrs[1].keys = [6, 7]
        bt.root.cPtrs[1].n = 2;
        bt.root.cPtrs[2] = bt.mkNode();
        bt.root.cPtrs[2].keys = [11, 12]
        bt.root.cPtrs[2].n = 2;
        bt.root.cPtrs[3] = bt.mkNode();
        bt.root.cPtrs[3].keys = [16, 17]
        bt.root.cPtrs[3].n = 2;
        bt.root.n = 3;
        bt.root.isLeaf = false;
        //console.log(bt.inspectNode(bt.root));
    }

    function testSearch() {
        var f = bt.search(10, bt.root);
        console.log(util.inspect(f));
    }

    function testSplitRoot() {
        //split root
        var nr = bt.mkNode();
        nr.cPtrs[0] = bt.root;
        nr.isLeaf = false;
        bt.root = bt.splitChild(nr, bt.root, 0);
        //console.log(bt.inspectNode(bt.root))
    }

    function testInsert() {
        bt = new btree(3);
        bt.insert(10).insert(30).insert(20).insert(40).insert(55);//cause root split
        bt.insert(5)
        bt.insert(11)
        bt.insert(6);
        bt.insert(50).insert(65).insert(15).insert(22).insert(24).insert(26);
        console.log(bt.inspectNode(bt.root));

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
        console.log(bt.inspectNode(bt.root));
    }

    (function runTests() {
        //setup();
        //testSplitRoot()
        //testInsert()
        testDelete()
    })();

})();