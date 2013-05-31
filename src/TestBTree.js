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

    function testInsert(){
        bt=new btree(2);
        bt.insert(10).insert(30).insert(20).insert(40);//cause root split
        bt.insert(5)
        bt.insert(11)
        bt.insert(6);
        bt.insert(50).insert(65);
        console.log(bt.inspectNode(bt.root));

    }

    (function runTests() {
        setup();
        //testSplitRoot()
        testInsert()
    })();

})();