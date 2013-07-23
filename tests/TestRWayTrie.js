var rtrie = require('../src/RWayTrie.js'), assert = require('assert');
(function () {
    var trie = new rtrie(128); //ascii

    function setup() {
        trie.put('a', 'some_value').put('abc', 10).put('abcd', 20).put('abb', 100)
            .put('k', 1).put('averylongkey', [1, 2, 3])
            .put('kplus', {foo:'bar'}).put('kpplus', {foo:'bar'});
    }

    function testSearch() {
        assert.strictEqual(trie.get('k'), 1);
        assert.strictEqual(trie.get('abc'), 10, 'Failed');
        assert.strictEqual(trie.get('abcd'), 20, 'Failed');
        assert.strictEqual(trie.get('ab'), null, 'Failed');
        assert.deepEqual(trie.get('averylongkey'), [1, 2, 3], 'Search Failed');
    }

    function testKeyset() {
        console.log(trie.keyset());
        assert.deepEqual(trie.keyset(), ['a', 'abb', 'abc', 'abcd', 'averylongkey', 'k', 'kplus', 'kpplus'], 'keyset failed');
    }

    function testUnicode() {
        var t = new rtrie(400);
        var unicode1 = "\u0100unicode", unicode2 = "\u0170latin"
        t.put(unicode1, "latin1").put("asciikey", "ascii").put(unicode2, "latinext2");
        console.log(t.keyset());
        assert.deepEqual(t.keyset(), ["asciikey", unicode1, unicode2], "key listing failed")
        assert.deepEqual(t.get(unicode2), "latinext2");
    }

    function testDelete() {
        var dt = new rtrie(128);
        dt.put("abc", 10);
        dt.delete("abc");
        assert.deepEqual(dt.keyset(), []);
        assert.strictEqual(dt.get("abc"), null);
        dt.put("abc", 10).put("abcd", 20);
        dt.delete("abcd");
        assert.deepEqual(dt.keyset(), ["abc"]);
        assert.strictEqual(dt.get("abcd"), null);
        assert.strictEqual(dt.get("abc"), 10);
        dt.put("ab", 20).put("ad", 30);
        dt.delete("ad");
        assert.deepEqual(dt.keyset(), ["ab", "abc"]);
        assert.strictEqual(dt.get("ad"), null);
        assert.strictEqual(dt.get("abc"), 10);
        assert.strictEqual(dt.get("ab"), 20);

    }
    function testRandom(){
        var tst = new rtrie(128);
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

    setup()
    testSearch()
    testKeyset()
    testUnicode()
    testDelete()
    testRandom()

})();