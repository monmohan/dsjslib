var MultiMap = require('../lib/MultiMap.js'), assert = require('assert');
(function () {
    'use strict';
    function testBasic() {
        var m = new MultiMap();
        m.put('a', 'b');
        m.put('a', 'c');
        m.put('b', 'c');
        assert.deepEqual(m.entries(), [
            { key : 'a', values : [ 'b', 'c' ] },
            { key : 'b', values : [ 'c' ] }
        ]
        )
    }

    testBasic()

}());