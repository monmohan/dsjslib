var rtrie=require("../src/RWayTrie.js"),assert=require("assert");
(function(){
    var trie=new rtrie(128); //ascii
    trie.insert("abc",10).insert("abcd",20).insert("abb",100)
        .insert("k",1).insert("averylongkey",[1,2,3])
        .insert("kplus",{foo:"bar"}).insert("kpplus",{foo:"bar"});

    assert.strictEqual(trie.search("k"),1,"Failed");
    assert.strictEqual(trie.search("abc"),10,"Failed");
    assert.strictEqual(trie.search("abcd"),20,"Failed");
    assert.strictEqual(trie.search("ab"),null,"Failed");
    console.log(trie.search("averylongkey"));
    console.log(trie.keyset());

})();