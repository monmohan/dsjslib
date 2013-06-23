var rtrie = require('../src/RWayTrie.js'), assert = require('assert');
(function () {
    var trie = new rtrie(128); //ascii

    function setup() {
        trie.insert('a', 'some_value').insert('abc', 10).insert('abcd', 20).insert('abb', 100)
            .insert('k', 1).insert('averylongkey', [1, 2, 3])
            .insert('kplus', {foo:'bar'}).insert('kpplus', {foo:'bar'});
    }

    function testSearch() {
        assert.strictEqual(trie.search('k'), 1, 'Failed');
        assert.strictEqual(trie.search('abc'), 10, 'Failed');
        assert.strictEqual(trie.search('abcd'), 20, 'Failed');
        assert.strictEqual(trie.search('ab'), null, 'Failed');
        assert.deepEqual(trie.search('averylongkey'), [1, 2, 3], 'Search Failed');
    }

    function testKeyset() {
        console.log(trie.keyset());
        assert.deepEqual(trie.keyset(), ['a', 'abb', 'abc', 'abcd', 'averylongkey', 'k', 'kplus', 'kpplus'], 'keyset failed');
    }
    function testUnicode(){
       var t=new rtrie(400);
        var unicode1="\u0100unicode",unicode2="\u0170latin"
        t.insert(unicode1,"latin1").insert("asciikey","ascii").insert(unicode2,"latinext2");
        console.log(t.keyset());
        assert.deepEqual(t.keyset(),["asciikey",unicode1,unicode2],"key listing failed")
        assert.deepEqual(t.search(unicode2),"latinext2");
    }
    function testDelete(){
        var dt=new rtrie(128);
        dt.insert("abc",10);
        dt.delete("abc");
        assert.deepEqual(dt.keyset(),[]);
        assert.strictEqual(dt.search("abc"),null);
        dt.insert("abc",10).insert("abcd",20);
        dt.delete("abcd");
        assert.deepEqual(dt.keyset(),["abc"]);
        assert.strictEqual(dt.search("abcd"),null);
        assert.strictEqual(dt.search("abc"),10);
        dt.insert("ab",20).insert("ad",30);
        dt.delete("ad");
        assert.deepEqual(dt.keyset(),["ab","abc"]);
        assert.strictEqual(dt.search("ad"),null);
        assert.strictEqual(dt.search("abc"),10);
        assert.strictEqual(dt.search("ab"),20);

    }
    setup()
    testSearch()
    testKeyset()
    testUnicode()
    testDelete()

})();