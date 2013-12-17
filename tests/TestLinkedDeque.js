(function(){
    var LinkedDeque = require('../lib/LinkedDeque.js'), assert = require('assert');
    function testBasic(){
        var ldq=new LinkedDeque();
        ldq.offerFirst(10);
        ldq.offerFirst(30);
        ldq.offerFirst(20);
        ldq.offerFirst(40);
        ldq.offerLast(50);
        ldq.push(60);
        ldq.unshift(1);
        assert.equal(ldq.size(),7);
        console.log(ldq);
        console.log(ldq.toArray());
        assert.deepEqual(ldq.toArray(),[1, 40, 20, 30, 10, 50,60 ]);
        assert.deepEqual(ldq.pop(),60);
        assert.deepEqual(ldq.shift(),1);

    }


    function testCapacity(){
        var ldq=new LinkedDeque(5);
        ldq.offerFirst(10);
        ldq.offerFirst(30);
        ldq.offerFirst(20);
        assert.equal(true,ldq.offerFirst(40));
        assert.equal(true,ldq.offerLast(50));
        assert.equal(false,ldq.push(60));
        assert.equal(false,ldq.unshift(1));
        assert.equal(ldq.size(),5);
        console.log(ldq.toArray());
        var sz=ldq.size();
        while(sz>0){
           ldq.pollFirst();
           sz--;
        }
        console.log(ldq);

    }

    function testClear(){
        var ldq=new LinkedDeque(10);
        ldq.offerFirst(10);
        ldq.offerLast(30);
        ldq.offerFirst(20);
        assert.equal(true,ldq.offerFirst({'value':40}));
        assert.equal(true,ldq.offerLast(50));
        assert.equal(true,ldq.push("60"));
        assert.equal(ldq.size(),6);
        console.log(ldq.toArray());
        ldq.clear();
        assert.equal(ldq.size(),0);
        assert.equal(ldq._head,null);
        assert.equal(ldq._tail,null);


    }
    testBasic();
    testCapacity();
    testClear();

}());