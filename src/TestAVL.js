var AVL = require("./AVLTree.js");

(function () {
    var bt = new AVL();

    function testInsertWithRebalance() {
        console.log("INSERT AND AVL BALANCE")
        bt.insert(16).insert(7).insert(25).insert(26).insert(39)
            .insert(13).insert(15).insert(29).insert(35).insert(12).insert(55).insert(11);
        bt.checkInvariants(bt.root);

    }
    function testRotate(){
        bt.printByLevel();
        bt.rotate(bt.search(39), 'r');
        bt.printByLevel();
        bt.rotate(bt.search(29), 'l');
        bt.printByLevel();

    }

    testInsertWithRebalance();
    bt.printByLevel();
    //testRotate();
    //bt.checkInvariants(bt.root,true);

})();
