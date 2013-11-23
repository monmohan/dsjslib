var BitSet = require('../lib/BitSet.js'), assert = require('assert'), fs = require('fs');
(function(){
    function testBasic(){
       var bs=new BitSet();
       bs.set(15);
       assert.equal(bs.get(15),true,'setting bit failed');
       assert.equal(bs.get(19),false,'wrong value set');
       assert.equal(bs.size(),32,'wrong size');

    }

    function testLargeBitSet(){
        var bs=new BitSet(200);
        bs.set(156);
        assert.equal(bs.get(156),true,'setting bit failed');
        assert.equal(bs.get(19),false,'wrong value set');
        assert.equal(bs.size(),224,'wrong size');
        bs.set(32);
        assert.equal(bs.get(32),true,'setting bit failed');
        assert.throws(function(){bs.set(235);});
        assert.doesNotThrow(function(){bs.get(235);});
        assert.equal(bs.get(235),false,'wrong value set');

    }
    testBasic();
    testLargeBitSet();


})();