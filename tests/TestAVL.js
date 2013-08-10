var AVL = require("../lib/AVLTree.js"), assert = require('assert');

(function () {
    var bt = new AVL();

    function testInsertWithRebalance() {
        console.log("INSERT AND AVL BALANCE")
        bt.put(16, "some val").put(7, 'seven').put(25, 'sVal').put(26, 'sVal').put(39, 'sVal')
            .put(13, 'sVal').put(15, 'sVal').put(29, 'sVal').put(35, 'thirtyFive').put(12, 'sVal')
            .put(55, { complex:'55' }).put(11, 'sVal').put(24, "chowbees");
        assert.doesNotThrow(function () {
                bt.checkInvariants(bt.root);
            },
            "AVL Tree property violated")
        assert.strictEqual(bt.get(15).key, 15);
        assert.strictEqual(bt.get(16).value, "some val");
        assert.strictEqual(bt.successor(15).key, 16);
        assert.strictEqual(bt.predecessor(35).key, 29);
        assert.strictEqual(bt.min().key, 7);
        assert.strictEqual(bt.max().key, 55);
        bt.put(16, "replaced")
        //check all values are present and its still binary search tree
        assert.deepEqual(bt.entrySet(), [
            { key:7, value:'seven' },
            { key:11, value:'sVal' },
            { key:12, value:'sVal' },
            { key:13, value:'sVal' },
            { key:15, value:'sVal' },
            { key:16, value:'replaced' },
            { key:24, value:'chowbees' },
            { key:25, value:'sVal' },
            { key:26, value:'sVal' },
            { key:29, value:'sVal' },
            { key:35, value:'thirtyFive' },
            { key:39, value:'sVal' },
            { key:55, value:{ complex:'55' } }
        ])
    }

    function testDelete() {
        var bt = new AVL();
        var i = 49;
        var entrySet = []
        while (i > -1) {
            bt.put(i, i + "_val");
            entrySet[i] = {'key':i, 'value':(i + "_val")};
            if (i % 5 == 0) {
                bt.checkInvariants();
            }
            i--;

        }
        assert.deepEqual(bt.entrySet(), entrySet)
        i = 49;
        //delete everything and check for invariants
        while (i > -1) {
            bt.delete(i);
            entrySet.splice(i, 1);
            i--;
            if (i % 5 == 0) {
                bt.checkInvariants();
                console.log(bt.entrySet());
                assert.deepEqual(bt.entrySet(), entrySet)
            }
        }
        console.log('------')
        console.log(bt.entrySet());
        //bt.delete(49)
        assert.deepEqual(bt.entrySet(), entrySet)
        console.log(bt.root)
        assert.doesNotThrow(function () {
            bt.checkInvariants();
        }, "AVL Tree property violated")


    }

    function testAVLCompfn(){
        var compFn=function(obj1,obj2){
            return obj2.k>obj1.k?1:(obj2.k===obj1.k)?0:-1;
        }
        var objkey, avl=new AVL(compFn);
        var i= 0, sometext='JavaScript also contains a conditional ' +
            'operator that assigns a value to a variable based on some condition';
        var keys=sometext.split(/\s/);
        while(i<20){
            objkey={'k':keys[i%keys.length],'v':'somevalue'};
            avl.put(objkey,"someobjvalue"+i);
            i++;
        }
        avl.checkInvariants(avl.root)
        assert.deepEqual(avl.entrySet(),[ { key: { k: 'JavaScript', v: 'somevalue' },
            value: 'someobjvalue17' },
            { key: { k: 'a', v: 'somevalue' }, value: 'someobjvalue11' },
            { key: { k: 'also', v: 'somevalue' }, value: 'someobjvalue18' },
            { key: { k: 'assigns', v: 'somevalue' },
                value: 'someobjvalue7' },
            { key: { k: 'based', v: 'somevalue' }, value: 'someobjvalue13' },
            { key: { k: 'condition', v: 'somevalue' },
                value: 'someobjvalue16' },
            { key: { k: 'conditional', v: 'somevalue' },
                value: 'someobjvalue4' },
            { key: { k: 'contains', v: 'somevalue' },
                value: 'someobjvalue19' },
            { key: { k: 'on', v: 'somevalue' }, value: 'someobjvalue14' },
            { key: { k: 'operator', v: 'somevalue' },
                value: 'someobjvalue5' },
            { key: { k: 'some', v: 'somevalue' }, value: 'someobjvalue15' },
            { key: { k: 'that', v: 'somevalue' }, value: 'someobjvalue6' },
            { key: { k: 'to', v: 'somevalue' }, value: 'someobjvalue10' },
            { key: { k: 'value', v: 'somevalue' }, value: 'someobjvalue9' },
            { key: { k: 'variable', v: 'somevalue' },
                value: 'someobjvalue12' } ]
        );

    }


    testInsertWithRebalance();
    testDelete()
    testAVLCompfn();


})();
