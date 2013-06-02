var AVL = require("./AVLTree.js");

(function () {
    var bt = new AVL();

    function testInsertWithRebalance() {
        console.log("INSERT AND AVL BALANCE")
        bt.insert(16).insert(7).insert(25).insert(26).insert(39)
            .insert(13).insert(15).insert(29).insert(35).insert(12).insert(55).insert(11);
        bt.checkInvariants(bt.root);

    }

    function testRotate() {
        console.log(bt.root)
        bt.rotate(bt.search(39), 'r');
        console.log(bt.root)
        bt.rotate(bt.search(29), 'l');
        console.log(bt.root)

    }

    testInsertWithRebalance();
    console.log(bt.root)
    //testRotate();
    //bt.checkInvariants(bt.root,true);

})();
