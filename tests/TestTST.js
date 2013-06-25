var tstrie = require('../src/TernarySearchTrie.js'), assert = require('assert'),util=require('util');
(function(){
    function testSearchAndInsert(){
        var tst=new tstrie();
        tst.insert("abc",20).insert("z",30).insert("ab",{x:"someObj"}).insert("averylongkey","somevalue");
        assert.strictEqual(tst.search("abc"),20)
        assert.strictEqual(tst.search("z"),30)
        assert.deepEqual(tst.search("ab"),{x:"someObj"})
        assert.deepEqual(tst.search("averylongkey"),"somevalue")

    }
     testSearchAndInsert()
})()