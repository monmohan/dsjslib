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
            assert.deepEqual(c.getSync('k2'), 'v2');//repeated lookup

        }
        matchEntriesInOrder([ 'k2', 'k5', 'k4', 'k3', 'k1', 'k0', undefined ], c);
        //test async
        c.get('k5', function (e, r) {
            assert.deepEqual(r, 'v5');//repeated lookup
        });
        //change the value before callback was fired to make sure its async
        //c.put('k5','Newv5');


    }

    function testLRU() {
        var c = new cache({'maximumSize' : 6}),
            res;
        for (var i = 0; i < 6; i++) {
            c.put('k' + i, 'v' + i);
        }

        for (i = 1; i < 4; i++) {
            c.getSync('k' + i);//lookup few to move them to head
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
        c.getSync('something');//shouldn't throw error
        c.put('new', 'value');
        c.getSync('new');
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
            assert.deepEqual(cwexp.getSync(k), values[parseInt(k.substring(5, k.length), 10)]);

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
            assert.deepEqual(cwexp.getSync('exkey70'), 'value70');
            assert.deepEqual(cwexp.getSync('exkey7'), 'value7');
            cwexp.put('exkey15', 'value15');
            assert.equal(cwexp.size, 98);
        }, 1);

        setTimeout(function () {
            cwexp.put('exkey12', 'value12');
            cwexp.put('exkey90', 'value90');
            cwexp.getSync('exkey12');
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
                var r = ch.getSync(key);
                console.log(key);
                assert.deepEqual(r, "value" + key);

            }());
        }
        console.log(ch.stats);
        //access few
        for (i = 1; i < 11; i += 2) {
            var r = ch.getSync('k' + i);
            assert.deepEqual(r, "value" + 'k' + i);

        }
        console.log(ch.stats);
        //access unknown values
        for (i = 11; i < 20; i++) {
            if (i < 15) {
                assert.doesNotThrow(
                    function () {
                        ch.getSync('k' + i);
                    }
                );
            } else {
                assert.throws(
                    function () {
                        ch.getSync('k' + i)
                    }

                    , /null/);
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
            chmx.getSync('k' + i);
        }
        for (var j = 0; j < 4; j++) {
            for (i = 20; i > 0; i--) {
                chmx.getSync('k' + i);
            }
        }
        //put should still work
        chmx.put("k7", 100);

        matchEntriesInOrder(["k7", "k1", "k2", "k3", "k4", "k5", "k6", "k8", "k9", "k10",
            "k11", "k12", "k13", "k14", "k15", "k16", "k17", "k18", "k19", "k20", undefined], chmx)
        assert.deepEqual(chmx.stats, { hitCount : 80, missCount : 20, requestCount : 100 })

        //max weight comes into play
        for (i = 100; i > 80; i--) {
            chmx.getSync('k' + i);
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
                chmx.getSync('k' + i);
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

    function testAsyncGet() {
        var keys = [];
        var i = 0,
            evictions = 0,
            rCache = new cache({
                'maximumSize' : 20,
                'loaderFunction' : function (k, callback) {
                    fs.open('/depot/dsjs/tests/resources/largetextfile.txt', 'r', function (error, fd) {
                        var buffer = new Buffer(1000);
                        fs.read(fd, buffer, 0, buffer.length, 0, function (e, bytesRead, buffer) {
                            var data = buffer.toString("utf8", 0, buffer.length);
                            var values = data.match(/\S+/g);
                            fs.close(fd);
                            callback(error, values[k]);

                        });
                    });

                },
                'onRemove' : function (k, v, c) {
                    evictions++;
                }
            });

        var done = false;
        for (i = 0; i < 50; i++) {
            (function () {
                var key = i;
                rCache.get(key, function (err, v) {
                    keys[key] = v;
                    if (key === 49) {
                        assert.equal(rCache.size, 20);
                        assert.equal(evictions, 30);

                    }
                });
            }());
        }


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

    function testAsyncNegative() {
        var sCache = new cache({
            'maximumSize' : 5,
            'loaderFunction' : function (key, callback) {
                //slow need to load from file
                fs.readFile('/depot/dsjs/tests/resources/largetextfile.txt', "utf-8", function (err, data) {
                    callback(err, data);
                });
            },
            'expiresAfterWrite' : 200

        });
        sCache.get('x', function (e, r) {
            console.log('1 called back ' + (r && r.substring(0, 5)));
        });
        sCache.get('x', function (e, r) {
            console.log('2 called back ' + (r && r.substring(0, 5)));
        });
        sCache.get('y', function (e, r) {
            console.log('y1 called back ' + (r && r.substring(0, 10)));
        });

        sCache.get('x', function (e, r) {
            console.log('3 called back ' + (r && r.substring(0, 5)));
        });


        assert.deepEqual(sCache.getIfPresent('x'), undefined);
        setTimeout(function () {
            assert.deepEqual(sCache.size, 2);
            assert.deepEqual(sCache.stats, { hitCount : 0, missCount : 5, requestCount : 5 });
            matchEntriesInOrder(["y", "x", undefined], sCache);
            sCache.get('y', function (e, r) {
                assert.deepEqual(r.substring(0, 10), 'Oliver Nic');
            });

            sCache.get('x', function (e, r) {
                assert.deepEqual(r.substring(0, 5), 'Olive');
                matchEntriesInOrder(["x", "y", undefined], sCache);
                assert.deepEqual(sCache.size, 2);
                assert.deepEqual(sCache.stats, { hitCount : 2, missCount : 5, requestCount : 7 });
            });

        }, 10000);


        /*setTimeout(function () {
         console.log(sCache.size);
         console.log(sCache.stats);
         matchEntriesInOrder(["y","x", undefined], sCache);
         }, 22000); */


    }

    testPutAndGet();
    testLRU();
    testRedundantPut();
    testCacheclear();
    testWriteExpiry();
    testStats();
    testMaxWeight();
    testRemoval();
    testAsyncGet();
    testExpensiveCacheLoader();
    testAsyncNegative();


}())