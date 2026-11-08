var TernarySearchTrie = require('../lib/TernarySearchTrie.js'), assert = require('assert');

(function () {
    function check(keys, removals) {
        var trie = new TernarySearchTrie(), expected = {};
        keys.forEach(function (key) {
            expected[key] = key + '-value';
            trie.put(key, expected[key]);
        });

        removals.forEach(function (removed) {
            trie.delete(removed);
            delete expected[removed];
            keys.forEach(function (key) {
                assert.strictEqual(trie.get(key), expected[key] || null,
                    'get(' + key + ') after deleting ' + removed + ' from ' + keys.join(','));
            });
            var entries = trie.entrySet().sort(function (a, b) {
                return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
            });
            assert.deepEqual(entries, Object.keys(expected).sort().map(function (key) {
                return { key: key, value: expected[key] };
            }));
        });
    }

    // The successor is the immediate right child, with different combinations
    // of equal and greater children. The left subtree must also survive.
    check(['b', 'a', 'c'], ['b', 'c', 'a']);
    check(['b', 'a', 'c', 'd'], ['b', 'c', 'd', 'a']);
    check(['b', 'a', 'c', 'ca'], ['b', 'c', 'ca', 'a']);
    check(['b', 'a', 'c', 'ca', 'd'], ['b', 'c', 'ca', 'd', 'a']);

    // A deeper successor can own both equal and greater subtrees too.
    check(['m', 'a', 'z', 'p', 'pa', 'q'], ['m', 'p', 'pa', 'q', 'z', 'a']);
    check(['m', 'a', 'z', 'p', 'q'], ['m', 'p', 'q', 'z', 'a']);
    check(['xm', 'xa', 'xz', 'xp', 'xpa', 'xq'], ['xm', 'xp', 'xpa', 'xq', 'xz', 'xa']);

    // Pruning the last suffix or sibling must retain an ancestor's own value.
    check(['a', 'ab'], ['ab', 'a']);
    check(['a', 'b'], ['b', 'a']);
    check(['abc', 'abd', 'ab'], ['missing', 'abd', 'abc', 'ab', 'ab']);
}());
