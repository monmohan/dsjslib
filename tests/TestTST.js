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
        tst.put("abc", 20).put("abcd", 30)
        tst.put("abce", 40)
        tst.put("abcm", 50)
            .put("abcmp", 60).put("aaj", 70).put("xyz", 80);
        tst.delete("abcd");
        assert.strictEqual(tst.get("xyz"), 80)
        assert.strictEqual(tst.get("abc"), 20)
        assert.strictEqual(tst.get("abcd"), null)
        assert.strictEqual(tst.get("abce"), 40)
        assert.strictEqual(tst.get("abcm"), 50)
        assert.strictEqual(tst.get("abcmp"), 60)
        assert.strictEqual(tst.get("aaj"), 70)
    }

    testSearchAndInsert()
    testDelete()
})()