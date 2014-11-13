var BinarySearchTree = require("../lib/BinarySearchTree.js"), assert = require('assert');
(function () {
    var bt = new BinarySearchTree();

    function testInsert() {
        console.log("INSERT AND TRAVERSE")
        bt.put(16, "sVal").put(7, "seven").put(25, "sVal").put(26, "sVal").put(39, "sVal")
            .put(13, "sVal").put(15, "sVal").put(29, "zzz").put(24, "chowbees")
            .put(35, "thirtyFive").put(12, "sVal").put(55, {complex:"55"}).put(11, "sVal");
        assert.strictEqual(bt.get(29).value, "zzz");
        bt.put(29, "newvalfor29")
        assert.strictEqual(bt.get(29).value, "newvalfor29");
        assert.strictEqual(bt.get(7).key, 7);
        assert.strictEqual(bt.get(16).key, 16);
        assert.strictEqual(bt.get(12).key, 12);

        bt.traverse(function (node) {
            console.log(node.key)
        });

    }

    function testMinMax() {
        console.log("FIND min max")
        assert.strictEqual(bt.min().key, 7);
        assert.strictEqual(bt.min().value, "seven");
        assert.strictEqual(bt.max().key, 55);
        assert.deepEqual(bt.max().value, {complex:"55"});
		console.log("Test min/max on empty tree");
		var emp=new BinarySearchTree();
		emp.min();
		emp.max();
    }


    function testSuccPre() {
        console.log("SUCCESSOR AND PREDECESSOR")
        assert.strictEqual(bt.successor(16).key, 24);
        assert.strictEqual(bt.successor(26).key, 29);
        assert.strictEqual(bt.successor(55), null);
        assert.strictEqual(bt.successor(12).key, 13);
        assert.strictEqual(bt.predecessor(11).key, 7);
        assert.strictEqual(bt.predecessor(7), null);
        assert.strictEqual(bt.predecessor(35).key, 29);
    }

    function testSuccPreBounds() {
        // add values in order
        var bt = new BinarySearchTree();
        bt.put(1, "first").put(2, 'last');
        assert.deepEqual(bt.successor(1), { key:2, value:'last' });
        assert(bt.successor(2) === null);
        assert.deepEqual(bt.predecessor(2), { key:1, value:'first' });
        assert(bt.predecessor(1) === null);

        // add values in reverse order
        bt = new BinarySearchTree();
        bt.put(2, 'last').put(1, "first");
        assert.deepEqual(bt.successor(1), { key:2, value:'last' });
        assert(bt.successor(2) === null);
        assert.deepEqual(bt.predecessor(2), { key:1, value:'first' });
        assert(bt.predecessor(1) === null);
    }

    function testDel() {
        console.log("DELETE")
        bt.delete(29);
        assert.strictEqual(bt.get(29), null);
        bt.delete(13);
        assert.strictEqual(bt.get(13), null);
        bt.delete(16);
        assert.strictEqual(bt.get(16), null);
        bt.put(16, "some new value");

    }

    function testEntrySet() {
        assert.deepEqual(bt.entrySet(), [
            { key:7, value:'seven' },
            { key:11, value:'sVal' },
            { key:12, value:'sVal' },
            { key:15, value:'sVal' },
            { key:16, value:'some new value' },
            { key:24, value:'chowbees' },
            { key:25, value:'sVal' },
            { key:26, value:'sVal' },
            { key:35, value:'thirtyFive' },
            { key:39, value:'sVal' },
            { key:55, value:{ complex:'55' } }
        ])
    }

    function testBSTCompfn(){
        var compFn=function(obj1,obj2){
          return obj2.k>obj1.k?1:(obj2.k===obj1.k)?0:-1;
        }
        var objkey, bst=new BinarySearchTree(compFn);
        var i= 0, sometext='JavaScript also contains a conditional ' +
            'operator that assigns a value to a variable based on some condition';
        var keys=sometext.split(/\s/);
        while(i<20){
          objkey={'k':keys[i%keys.length],'v':'somevalue'};
          bst.put(objkey,"someobjvalue"+i);
          i++;
        }
        var sorted=[];
        bst.traverse(function (node) {
          sorted.push(node.key);
        });
        console.log(sorted);
        assert.deepEqual(sorted,[ { k: 'JavaScript', v: 'somevalue' },
            { k: 'a', v: 'somevalue' },
            { k: 'also', v: 'somevalue' },
            { k: 'assigns', v: 'somevalue' },
            { k: 'based', v: 'somevalue' },
            { k: 'condition', v: 'somevalue' },
            { k: 'conditional', v: 'somevalue' },
            { k: 'contains', v: 'somevalue' },
            { k: 'on', v: 'somevalue' },
            { k: 'operator', v: 'somevalue' },
            { k: 'some', v: 'somevalue' },
            { k: 'that', v: 'somevalue' },
            { k: 'to', v: 'somevalue' },
            { k: 'value', v: 'somevalue' },
            { k: 'variable', v: 'somevalue' } ]
        )
        assert.deepEqual(bst.get({ k: 'on', v: 'somevalue' }).value,'someobjvalue14');
    }


    (function testBSTfuncs() {
        testInsert();
        testMinMax();
        testSuccPre();
        testSuccPreBounds();
        testDel();
        //pretty print the tree
        console.log(bt.root);
        testEntrySet();
        bt.checkInvariants();
        testBSTCompfn();
    })();


})();




