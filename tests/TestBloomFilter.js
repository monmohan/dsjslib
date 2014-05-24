var assert = require('assert'), BloomFilter = require('../lib/BloomFilter.js'), logger = require('../lib/logger.js');
;
(function () {
    logger.setLogLevel(logger.Levels.debug);
    function testBloomRepeatedHash() {
        var b = new BloomFilter();
        var someKey = 'someran#$@#junk--\u03B1Greek';
        for (var x = 1; x < 1000; x++) {
            b.put(someKey);
            assert.deepEqual(b.mightContain(someKey), true);
        }

        for (x = 1; x < 100; x++) {
            b.put(someKey + x);
            assert.deepEqual(b.mightContain(someKey), true);
        }


    }

    function testBloomSmall() {
        var b = new BloomFilter({expectedInsertions : 30,
            falsePosPercent : 0.03});
        for (var x = 1; x < 10; x++) {
            b.put(Math.random());
        }
        var num_conflict = 0;
        for (x = 2; x < 100; x++) {
            if (b.mightContain(x)) {
                num_conflict++;
            }
        }
        console.log(num_conflict);
        //shouldn't be more than 1
        assert.equal(num_conflict > 1, false);


    }

    function testBloomComplexObjects() {
        var b = new BloomFilter({expectedInsertions : 300,
            falsePosPercent : 0.03});
        var arr = []
        for (var x = 1; x < 100; x++) {
            arr.push(x);
            b.put(arr);
        }
        var carr = []
        for (x = 1; x < 100; x++) {
            carr.push(x);
            assert.equal(b.mightContain(carr), true);
        }
        var obj = {
            id : "100", stringify : function () {
                return this.id + " is key";
            }

        }
        b.put(obj);
        assert.equal(b.mightContain(obj.toString()), false);
        assert.equal(b.mightContain(obj), true);
        b.put({});
        assert.equal(b.mightContain({}), true);


    }

    function testVeryLargeFilter() {
        //can't be bigger than 2^31

        var b = new BloomFilter({expectedInsertions : 100000000000000000000000000
            });
        var arr = []
        assert.equal(b.m,0x7fffffff);
        for (var x = 1; x < 10; x++) {
            arr.push(x);
            b.put(x);
            assert.equal(b.mightContain(x), true);
        }

        assert.equal(b.mightContain("asdasewd"), false);
    }

    testBloomRepeatedHash();
    testBloomSmall();
    testBloomComplexObjects();
    testVeryLargeFilter();

}());