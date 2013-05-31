var BinarySearchTree = require("./BinarySearchTree.js");
(function () {
    var bt = new BinarySearchTree();

    function testInsert() {
        console.log("INSERT AND TRAVERSE")
        bt.insert(16).insert(7).insert(25).insert(26).insert(39)
            .insert(13).insert(15).insert(29).insert(35).insert(12).insert(55).insert(11);
        bt.traverse(function (node) {
            console.log(node.item)
        });

    }

    function testMinMax() {
        console.log("FIND min max")
        console.log("min " + bt.min().item);
        console.log("min " + bt.max().item);
    }

    function testSearch() {
        console.log("SEARCH")
        var f = bt.search(29);
        console.log("node " + f + " " + f ? f.item : "");
    }

    function testSuccPre() {
        console.log("SUCCESSOR AND PREDECESSOR")
        console.log("successor of 26 = " + bt.successor(26).item);
        console.log("pre of 11 = " + bt.predecessor(11).item);
    }

    function testDel() {
        console.log("DELETE")
        bt.delete(29);
        bt.traverse(
            function (node) {
                console.log(node.item)
            }
        );
        bt.delete(13);
        bt.traverse(function (node) {
            console.log(node.item)
        });
    }

    (function testBSTfuncs() {
        testInsert();
        testMinMax();
        testSearch();
        testSuccPre();
        testDel();
        bt.printByLevel();
        bt = null;//tear down
    })();



})();




