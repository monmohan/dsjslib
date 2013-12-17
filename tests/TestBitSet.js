var BitSet = require('../lib/BitSet.js'), assert = require('assert'), fs = require('fs');
(function () {
    function testBasic() {
        var bs = new BitSet(32);
        bs.set(15);
        assert.equal(bs.get(15), true, 'setting bit failed');
        assert.equal(bs.get(19), false, 'wrong value set');
        assert.equal(bs.size, 32, 'wrong size');
        assert.throws(function () {
            bs.set(-1);
        });
        assert.equal(bs.get(19), false, 'wrong value set');
        bs.clear(19);
        assert.equal(bs.get(19), false, 'clearing problem');
        bs.set(19);
        assert.equal(bs.get(19), true, 'set after clear failed');

    }

    function testLargeBitSet() {
        var bs = new BitSet(200);
        bs.set(156);
        assert.equal(bs.get(156), true, 'setting bit failed');
        bs.clear(156);
        assert.equal(bs.get(156), false, 'clearing bit failed');

        assert.equal(bs.size, 200, 'wrong size');
        bs.set(32);
        assert.equal(bs.get(32), true, 'setting bit failed');
        bs.clear(32);
        assert.equal(bs.get(32), false, 'clearing bit failed');
        assert.throws(function () {
            bs.set(235);
        });
        assert.doesNotThrow(function () {
            bs.get(235);
        });
        assert.equal(bs.get(235), false, 'wrong value set');

    }

    function testCardinality() {
        var bs = new BitSet(64);
        bs.set(10);
        bs.set(2);
        assert.equal(bs.cardinality(), 2, 'wrong cardinality');
        bs = new BitSet(1000);
        for (var i = 0; i < 20; i++) {
            bs.set(i * 10);
        }
        assert.equal(bs.cardinality(), 20, 'wrong cardinality');
        //clear a few
        for (i = 0; i < 20; i++) {
            bs.clear(i * 20);
        }
        assert.equal(bs.cardinality(), 10, 'wrong cardinality after clearing');

    }

    function testAnd() {
        var bs = new BitSet(64);
        var bs2=new BitSet(64);
        bs.set(10);
        assert.equal(bs.get(10), true, 'wrong value set');
        bs.and(bs2);
        assert.equal(bs.get(10), false, 'wrong value set');
        assert.equal(bs.get(64), false, 'Error in And');
        bs.set(31);
        bs.set(11);
        bs2.set(31);
        bs2.set(11);
        bs.and(bs2);
        assert.equal(bs.get(31), true, 'wrong value after And');
        assert.equal(bs.get(11), true, 'wrong value after And');
        bs = new BitSet(200);
        bs2=new BitSet(16);
        bs.set(31);
        bs.set(11);
        bs2.set(11);
        bs.and(bs2);
        assert.equal(bs.get(31), false, 'wrong value after And');
        assert.equal(bs.get(11), true, 'wrong value after And');
        assert.equal(bs.size, 200, 'wrong size after And');
        assert.equal(bs.cardinality(), 1, 'wrong cardinality after clearing');


    }

    function testFlip(){
        var bs = new BitSet(64);
        bs.set(10);
        assert.equal(bs.get(10), true, 'wrong value set');
        bs.flip(10);
        assert.equal(bs.get(10), false, 'wrong value set');
        bs.flip(10);
        assert.equal(bs.get(10), true, 'wrong value set');


    }

    testBasic();
    testLargeBitSet();
    testCardinality();
    testAnd();
    testFlip();


})();