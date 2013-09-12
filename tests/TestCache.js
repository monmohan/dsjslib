var cache = require('../lib/Cache.js'), assert = require('assert'), fs = require('fs');
(function () {

    function matchEntriesInOrder(expected, cache, limit, queue) {
        var entries = [],
            c_ = cache ,
            q = queue || c_._accessQueue;
        var num = 0;
        q.head.forEach(function (e) {
            if (limit) {
                if (num < limit) {
                    entries.push(e.key);
                    num++;
                }
            } else {
                entries.push(e.key);
            }

        }, q);
        console.log(entries);
        assert.deepEqual(entries, expected);
    }

    //TESTS ----------------
    function testPutAndGet() {
        var c = new cache({'maximumSize' : 6}),
            res;

        for (var i = 0; i < 6; i++) {
            c.put('k' + i, 'v' + i);
        }
        for (i = 1; i < 4; i++) {
            c.get('k2', function (err, result) {
                assert.deepEqual(result, 'v2');
            });//repeated lookup

        }
        matchEntriesInOrder([ 'k2', 'k5', 'k4', 'k3', 'k1', 'k0', undefined ], c)

    }

    function testLRU() {
        var c = new cache({'maximumSize' : 6}),
            res;
        for (var i = 0; i < 6; i++) {
            c.put('k' + i, 'v' + i);
        }

        for (i = 1; i < 4; i++) {
            c.get('k' + i, function (err, v) {/*ignore*/
            });//lookup few to move them to head
        }
        matchEntriesInOrder([ 'k3', 'k2', 'k1', 'k5', 'k4', 'k0', undefined ], c);
        c.invalidate('k5');
        matchEntriesInOrder([ 'k3', 'k2', 'k1', 'k4', 'k0', undefined ], c);
        return i;
    }


    function testRedundantPut() {
        var c = new cache({'maximumSize' : 6}),
            res;
        //add more elements
        for (var i = 1; i < 20; i++) {
            c.put('k' + i, 'v' + i);
        }
        matchEntriesInOrder([ 'k19', 'k18', 'k17', 'k16', 'k15', 'k14', undefined ], c)
        for (i = 5; i < 20; i++) {
            c.put('k20', 'v20');//repeatedly put
        }
        matchEntriesInOrder([ 'k20', 'k19', 'k18', 'k17', 'k16', 'k15', undefined ], c);
    }


    function testCacheclear() {
        var c = new cache({'maximumSize' : 6}),
            res;

        c.invalidateAll();
        assert.equal(c.size, 0);
        c.get('something');//shouldn't throw error
        c.put('new', 'value');
        c.get('new', function (err, res) {
            assert.deepEqual(res, 'value');
        });
        matchEntriesInOrder(['new', undefined], c);

    }

    function testWriteExpiry() {
        var cwexp = new cache({'maximumSize' : 100,
            'expiresAfterWrite' : 5, 'onRemove' : function (k, v, c) {
                console.log(Array.prototype.slice.call(arguments).join());
                var i = parseInt(k.substring(5, k.length), 10);
                assert.ok(k === keys[i]);
                assert.ok(v === values[i]);
                //assert.equal(c, 'expired');
            }});


        var keys = [], values = [];
        for (var i = 0; i < 100; i++) {
            keys.push("exkey" + i);
            values.push("value" + i);
            cwexp.put("exkey" + i, "value" + i);
        }

        assert.equal(cwexp.size, 100);

        for (i = 0; i < 100; i += 10) {
            var k = keys[i];
            cwexp.get(k, function (err, res) {
                assert.deepEqual(res, values[parseInt(k.substring(5, k.length), 10)]);
            });

        }

        matchEntriesInOrder([ 'exkey90',
            'exkey80',
            'exkey70',
            'exkey60',
            'exkey50',
            'exkey40',
            'exkey30',
            'exkey20',
            'exkey10',
            'exkey0' ], cwexp, 10);

        assert.equal(cwexp.size, 100);
        //write queue remains unchanged
        matchEntriesInOrder([ 'exkey99',
            'exkey98',
            'exkey97',
            'exkey96',
            'exkey95',
            'exkey94',
            'exkey93',
            'exkey92',
            'exkey91',
            'exkey90' ]
            , cwexp, 10, cwexp._writeQueue);

        //invalidate
        cwexp.invalidate('exkey96');
        matchEntriesInOrder([ 'exkey99',
            'exkey98',
            'exkey97',
            'exkey95',
            'exkey94',
            'exkey93',
            'exkey92',
            'exkey91',
            'exkey90',
            'exkey89']
            , cwexp, 10, cwexp._writeQueue);
        cwexp.put('exkey10', 'value10');//touch to move it ahead in write queue
        matchEntriesInOrder(["exkey10", "exkey99", "exkey98", "exkey97", "exkey95", "exkey94", "exkey93", "exkey92", "exkey91", "exkey90"]
            , cwexp, 10, cwexp._writeQueue);
        //invalidate a common entry
        cwexp.invalidate('exkey10');
        matchEntriesInOrder(["exkey99", "exkey98", "exkey97", "exkey95", "exkey94", "exkey93", "exkey92", "exkey91", "exkey90", 'exkey89']
            , cwexp, 10, cwexp._writeQueue);
        matchEntriesInOrder([ 'exkey90',
            'exkey80',
            'exkey70',
            'exkey60',
            'exkey50',
            'exkey40',
            'exkey30',
            'exkey20',
            'exkey0', "exkey99" ], cwexp, 10, cwexp._accessQueue);

        assert.equal(cwexp.size, 98);

        setTimeout(function () {
            cwexp.get('exkey70', function (err, res) {
                assert.deepEqual(res, 'value70');
            });

            cwexp.get('exkey7', function (err, res) {
                assert.deepEqual(res, 'value7');
            });
            cwexp.put('exkey15', 'value15');
            assert.equal(cwexp.size, 98);
        }, 1);

        setTimeout(function () {
            cwexp.put('exkey12', 'value12');
            cwexp.put('exkey90', 'value90');
            cwexp.get('exkey12');
            assert.equal(cwexp.size, 2/*recently added ones*/);
            matchEntriesInOrder(["exkey90", "exkey12", undefined], cwexp, null, cwexp._writeQueue);
            matchEntriesInOrder(["exkey12", "exkey90", undefined], cwexp, null, cwexp._accessQueue);
        }, 10000);

    }

    function testStats() {
        var ch = new cache({'maximumSize' : 100, "loaderFunction" : function (key, callback) {
            if (parseInt(key.substring(1, key.length)) < 15) {
                callback(null, "value" + key);
            }

        }, 'recordStats' : true});
        //load keys
        for (var i = 1; i < 11; i++) {
            var key = 'k' + i;
            (function () {
                ch.get(key, function (err, r) {
                    console.log(key);
                    assert.deepEqual(r, "value" + key);
                });
            }());
        }
        console.log(ch.stats);
        //access few
        for (i = 1; i < 11; i += 2) {
            ch.get('k' + i, function (err, r) {
                assert.deepEqual(r, "value" + 'k' + i);
            });
        }
        console.log(ch.stats)
        //access unknown values
        for (i = 11; i < 20; i++) {
            try {
                ch.get('k' + i);
            } catch (e) {
                //ignore
            }
        }
        console.log(ch.stats);
        assert.deepEqual(ch.stats, {"hitCount" : 5, "missCount" : 19, "requestCount" : 24})
        assert.deepEqual(ch.size, 14);
    }

    function testMaxWeight() {
        assert.throws(function () {
            new cache({'maximumSize' : 20,
                'weigherFunction' : function (key) {
                    return 10
                }, 'expiresAfterWrite' : 10, 'maximumWeight' : 1000})
        });
        assert.throws(function () {
            new cache({
                'werFunction' : function (key) {
                    return 10
                }, 'expiresAfterWrite' : 5, 'maximumWeight' : 1000})
        });
        var chmx = new cache({
            'weigherFunction' : function (key, value) {
                return 50
            }, 'expiresAfterWrite' : 4, 'maximumWeight' : 1000,
            'loaderFunction' : function (k, callback) {
                callback(null, k + 'val');
            }, 'recordStats' : true});

        for (var i = 1; i < 21; i++) {
            chmx.get('k' + i);
        }
        for (var j = 0; j < 4; j++) {
            for (i = 20; i > 0; i--) {
                chmx.get('k' + i);
            }
        }
        //put should still work
        chmx.put("k7", 100);

        matchEntriesInOrder(["k7", "k1", "k2", "k3", "k4", "k5", "k6", "k8", "k9", "k10",
            "k11", "k12", "k13", "k14", "k15", "k16", "k17", "k18", "k19", "k20", undefined], chmx)
        assert.deepEqual(chmx.stats, { hitCount : 80, missCount : 20, requestCount : 100 })

        //max weight comes into play
        for (i = 100; i > 80; i--) {
            chmx.get('k' + i);
        }

        matchEntriesInOrder(["k81", "k82", "k83", "k84", "k85", "k86", "k87", "k88", "k89",
            "k90", "k91", "k92", "k93", "k94", "k95", "k96", "k97", "k98", "k99", "k100", "k7", undefined], chmx)

        setTimeout(function () {
            //max weight comes into play
            assert.equal(chmx.size, 21);
            for (i = 100; i > 80; i--) {
                chmx.getIfPresent('k' + i);

            }
            assert.equal(chmx.size, 1);
            matchEntriesInOrder(['k7', undefined], chmx);
            chmx.getIfPresent('k7');
            assert.equal(chmx.size, 0);
            matchEntriesInOrder([undefined], chmx);
            //now populate
            for (i = 85; i > 80; i--) {
                chmx.get('k' + i);
            }
            assert.equal(chmx.size, 5);
            matchEntriesInOrder(["k81", "k82", "k83", "k84", "k85", undefined], chmx);
            //now remove
            for (i = 81; i <= 85; i += 2) {
                chmx.invalidate('k' + i);
            }
            matchEntriesInOrder(["k82", "k84", undefined], chmx)

        }, 5000);
    }

    function testRemoval() {
        var chr = new cache({'maximumSize' : 10, 'onRemove' : function (key, value, cause) {
            console.log(key + ' was evicted' + 'because of ' + cause + ' value=' + value);
            assert.equal(cause, 'capacity')
        }})

        for (var i = 1; i <= 12; i += 1) {
            chr.put('k' + i, 'v' + i);
        }

        chr = new cache({'maximumSize' : 10, 'onRemove' : function (key, value, cause) {
            console.log(key + ' was evicted' + 'because of ' + cause + ' value=' + value);
            assert.equal(cause, 'explicit');
        }})
        for (i = 1; i <= 5; i += 1) {
            chr.put('k' + i, 'v' + i);
        }
        chr.invalidate('k3');
        matchEntriesInOrder(["k5", "k4", "k2", "k1", undefined], chr);
        chr.invalidate('k5');
        matchEntriesInOrder(["k4", "k2", "k1", undefined], chr);


    }

    function testRandom() {
        var keys;
        var i = 0;
        var evictions = 0,
            rCache = new cache({
                'maximumSize' : 1200,
                'loaderFunction' : function (k, callback) {
                    var v = keys[(++i) % 2000];
                    if (!v) {
                        console.log('no v for i=' + i);
                    }
                    return callback(null, v);

                },
                'onRemove' : function (k, v, c) {
                    evictions++;
                }
            });

        keys = fs.readFile('/depot/dsjs/tests/resources/largetextfile.txt', function (err, data) {
            if (err) {
                throw err;
            }
            keys = ("" + data).match(/\S+/g);
            keys.forEach(function (k) {
                rCache.get(k, function (err, v) {
                    assert.ok(v);
                });
            });

            console.log(rCache.get('Downloaded'));
            assert.equal(rCache.size, 1200);
            assert.equal(evictions, 454);

        });

    }

    function testExpensiveCacheLoader() {
        var sCache = new cache({
            'maximumSize' : 100,
            'loaderFunction' : function (key, callback) {
                //slow need to load from file
                fs.readFile('/depot/dsjs/tests/resources/largetextfile.txt', "utf-8", function (err, data) {
                    //cache file content
                    if (key === 'k1') {
                        callback(null, data.match(/Tesla/g)[0]);
                    } else if (key === 'k2') {
                        callback(null, data.match(/Colorado/g)[0]);
                    } else if (key === 'k3') {
                        callback(null, data.match(/flying machine has completely/g));
                    } else {
                        callback(new Error('Unkown Key'), null);
                    }

                });
            }
        });

        sCache.get('k1', function (e, v) {

            assert.deepEqual(v, "Tesla");
        });
        sCache.get('k2', function (e, v) {
            assert.deepEqual(v, "Colorado");
        });
        sCache.get('k3', function (e, v) {
            assert.deepEqual(v, ["flying machine has completely"]);
        });

    }

    testPutAndGet()
    testLRU()
    testRedundantPut()
    testCacheclear()
    testWriteExpiry()
    testStats()
    testMaxWeight()
    testRemoval()
    testRandom()
    testExpensiveCacheLoader();


}())