var tstrie = require('../src/TernarySearchTrie.js'), assert = require('assert'),util=require('util');
(function(){
    function testSearchAndInsert(){
        var tst=new tstrie();
        tst.put("abc",20).put("z",30).put("ab",{x:"someObj"}).put("averylongkey","somevalue");
        assert.strictEqual(tst.get("abc"),20)
        assert.strictEqual(tst.get("z"),30)
        assert.deepEqual(tst.get("ab"),{x:"someObj"})
        assert.deepEqual(tst.get("averylongkey"),"somevalue")

    }
     testSearchAndInsert()
})()