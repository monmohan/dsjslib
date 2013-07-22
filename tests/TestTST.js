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

    function testDelete() {
        var tst = new tstrie();
        var para="This example shows us the power of closures. As you can see, we store i at the outer scope of the object" +
            " we actually operate on. " +
            "It seems kind of trivial but it is one of those features of " +
            "JavaScript it really pays off to understand as it allows us to implement all sorts of" +
            " nifty little patterns such as this quite easily.";
        var keys=para.split(/\s/);
        var keyValSet={},val;

        keys.forEach(function(key){
            val=key+'-value';
            tst.put(key,val);
            keyValSet[key]=val;
        })
        keys.forEach(function(key){
            assert.deepEqual(tst.get(key),keyValSet[key]);
        })

        var i= 0,deleted=[];
        while(i<keys.length){
            console.log('--Deleting-- '+i)
            var nkey=keys.shift();
            keyValSet[nkey]=null;
            tst.delete(nkey);
            deleted.push(nkey);
            deleted.forEach(function(dKey){
                assert.deepEqual(tst.get(dKey),null);
            });
            keys.forEach(function(key){
                assert.deepEqual(tst.get(key),keyValSet[key]);
            })
           i++;
        }

    }

    testSearchAndInsert()
    testDelete()
})()