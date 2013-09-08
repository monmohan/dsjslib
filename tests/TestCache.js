var cache = require('../lib/Cache.js'), assert = require('assert'), fs = require('fs');
(function () {
    var c = new cache({'maximumSize' : 6}),
        res;

    function matchEntriesInOrder(expected, cache) {
        var entries = [],
            c_ = cache || c;
        c_._headEntry.forEach(function (e) {
            entries.push(e.key);
        })
        console.log(entries);
        assert.deepEqual(entries, expected);
    }

    //TESTS ----------------
    function testPutAndGet() {
        for (var i = 0; i < 6; i++) {
            c.put('k' + i, 'v' + i);
        }
        for (i = 1; i < 4; i++) {
            c.get('k2', function (err, result) {
                assert.deepEqual(result, 'v2');
            });//repeated lookup

        }
        matchEntriesInOrder([ 'k2', 'k5', 'k4', 'k3', 'k1', 'k0', undefined ])

    }

    function testLRU() {
        for (var i = 1; i < 4; i++) {
            c.get('k' + i, function (err, v) {/*ignore*/
            });//lookup few to move them to head
        }
        matchEntriesInOrder([ 'k3', 'k2', 'k1', 'k5', 'k4', 'k0', undefined ])
        c.invalidate('k5');
        matchEntriesInOrder([ 'k3', 'k2', 'k1', 'k4', 'k0', undefined ]);
        return i;
    }


    function testRedundantPut() {
//add more elements
        for (var i = 5; i < 20; i++) {
            c.put('k' + i, 'v' + i);
        }
        matchEntriesInOrder([ 'k19', 'k18', 'k17', 'k16', 'k15', 'k14', undefined ])
        for (i = 5; i < 20; i++) {
            c.put('k20', 'v20');//repeatedly put
        }
        matchEntriesInOrder([ 'k20', 'k19', 'k18', 'k17', 'k16', 'k15', undefined ]);
    }


    function testCacheclear() {
        c.invalidateAll();
        assert.equal(c.size, 0);
        c.get('something');//shouldn't throw error
        c.put('new', 'value');
        c.get('new', function (err, res) {
            assert.deepEqual(res, 'value');
        });
        matchEntriesInOrder(['new', undefined]);

    }

    function testWriteExpiry() {
        var cwexp = new cache({'maximumSize' : 100,
            'expiresAfterWrite' : 5, 'onRemove' : function (k, v, c) {
                console.log(Array.prototype.slice.call(arguments).join());
                assert.ok(k === 'expirethiskey' || k === 'expirethiskey2')
                assert.ok(v === 'expirewrite' || v === 'expirewrite2')
                assert.equal(c, 'expired');
            }});

        cwexp.put('expirethiskey', 'expirewrite');
        cwexp.put('expirethiskey2', 'expirewrite2');
        cwexp.get('expirethiskey', function (err, res) {
            assert.deepEqual(res, 'expirewrite');
        });
        setTimeout(function () {
            cwexp.get('expirethiskey', function (err, res) {
                assert.deepEqual(res, 'expirewrite');
            });

            cwexp.get('expirethiskey2', function (err, res) {
                assert.deepEqual(res, 'expirewrite2');
            });

            matchEntriesInOrder(['expirethiskey2', 'expirethiskey', undefined], cwexp);
        }, 1);

        setTimeout(function () {
            cwexp.get('expirethiskey', function (err, res) {
                assert.deepEqual(res, undefined);
            });

            cwexp.get('expirethiskey', function (err, res) {
                assert.deepEqual(res, undefined);
            }); //get on expired key should not puke

            cwexp.get('expirethiskey2', function (err, res) {
                assert.deepEqual(res, undefined);
            });

            assert.equal(cwexp.size, 0);
        }, 8000);

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