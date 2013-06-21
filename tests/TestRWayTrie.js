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
        trie=new rtrie(400);
        var unicode1="\u0100unicode",unicode2="\u0170latin"
        trie.insert(unicode1,"latin1").insert("asciikey","ascii").insert(unicode2,"latinext2");
        console.log(trie.keyset());
        assert.deepEqual(trie.keyset(),["asciikey",unicode1,unicode2],"key listing failed")
        assert.deepEqual(trie.search(unicode2),"latinext2");
    }
    setup()
    testSearch()
    testKeyset()
    testUnicode()

})();