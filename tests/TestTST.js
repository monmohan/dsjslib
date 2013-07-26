var tstrie = require('../src/TernarySearchTrie.js'), assert = require('assert'), util = require('util');
(function () {
    function testSearchAndInsert() {
        var tst = new tstrie();
        tst.put("abc", 20).put("z", 30).put("ab", {x:"someObj"}).put("averylongkey", "somevalue");
        assert.strictEqual(tst.get("abc"), 20)
        assert.strictEqual(tst.get("z"), 30)
        assert.deepEqual(tst.get("ab"), {x:"someObj"})
        assert.deepEqual(tst.get("averylongkey"), "somevalue")

    }

    function testMulti() {
        var tst = new tstrie();
        var para = "This example shows us the power of closures clearly. As you can see, we store i at the outer scope of the object" +
            " we actually operate on. opening " +
            "It seems kind of trivial but it is one of those features of trade " +
            "JavaScript it really pays off to understand as it allows us to implement all sorts of" +
            " nifty nice little patterns such as this quite easily.";
        var keys = para.split(/\s/);
        var keyValSet = {}, val;

        keys.forEach(function (key) {
            val = key + '-value';
            tst.put(key, val);
            keyValSet[key] = val;
        })
        keys.forEach(function (key) {
            assert.deepEqual(tst.get(key), keyValSet[key]);
        })

        function testDelete() {
            var i = 0, deleted = [];
            while (i < keys.length) {
                console.log('--Deleting-- ' + i)
                var nkey = keys.shift();
                keyValSet[nkey] = null;
                tst.delete(nkey);
                deleted.push(nkey);
                deleted.forEach(function (dKey) {
                    assert.deepEqual(tst.get(dKey), null);
                });
                keys.forEach(function (key) {
                    assert.deepEqual(tst.get(key), keyValSet[key]);
                })
                i++;
            }
        }

        function testEntrySet() {
            var entries=tst.entrySet();
            entries.forEach(function (entry) {
                var k=entry.key;var v=entry.value;
                assert.deepEqual(keyValSet[k],v);
            })
        }
        function testPrefix(){
            var prefix=tst.keysWithPrefix('a');
            assert.deepEqual(prefix,[ { key: 'at', value: 'at-value' },
                { key: 'actually', value: 'actually-value' },
                { key: 'as', value: 'as-value' },
                { key: 'all', value: 'all-value' },
                { key: 'allows', value: 'allows-value' } ]
            )
        }
        function testNegative(){
            assert.doesNotThrow(function(){tst.keysWithPrefix('ox')})
            assert.doesNotThrow(function(){tst.keysWithPrefix('a')})
            assert.deepEqual(tst.keysWithPrefix('ox'),[])
            assert.deepEqual(tst.keysWithPrefix('operate'),[{key:'operate','value':keyValSet['operate']}])
        }
        testEntrySet()
        testPrefix()
        testNegative()
        testDelete()
    }


    testSearchAndInsert()
    testMulti()

})()