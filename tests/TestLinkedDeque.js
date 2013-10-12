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
        console.log(ldq);
        console.log(ldq.toArray());
        assert.deepEqual(ldq.toArray(),[1, 40, 20, 30, 10, 50,60 ]);
        assert.deepEqual(ldq.pop(),60);
        assert.deepEqual(ldq.shift(),1);

    }
    testBasic();

}());