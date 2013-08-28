var cache = require('../lib/Cache.js'), assert = require('assert');
(function(){
    var c=new cache({'maximumSize':6}),
        res;

    function testPutAndGet() {
        for (var i = 0; i < 6; i++) {
            c.put('k' + i, 'v' + i);
        }
        for (i = 1; i < 4; i++) {
            res = c.get('k2');//repeated lookup
            assert.deepEqual(res, 'v2');
        }
        matchEntriesInOrder([ 'k2', 'k5', 'k4', 'k3', 'k1', 'k0', undefined ])

    }

    function testLRU() {
        for (var i = 1; i < 4; i++) {
            c.get('k' + i);//lookup few to move them to head
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

    function testMixed(){
        c=new cache({'maximumSize':20,
            'weigherFunction':function(key){return 10}
        ,'expiresAfterWrite':10,'maximumWeight':1000})

    }

    function testCacheclear(){
        c.invalidateAll();
        assert.equal(c.size,0);
        c.get('something');//shouldn't throw error
        c.put('new','value');
        assert.deepEqual(c.get('new'),'value');
        matchEntriesInOrder(['new',undefined]);

    }

    function testWriteExpiry(){
        c=new cache({'maximumSize':100,'expiresAfterWrite':10});

        c.put('expirethiskey','expirewrite');
        c.put('expirethiskey2','expirewrite2');
        assert.deepEqual(c.get('expirethiskey'),'expirewrite');
        setTimeout(function(){
            assert.deepEqual(c.get('expirethiskey'),'expirewrite');
            assert.deepEqual(c.get('expirethiskey2'),'expirewrite2');
            matchEntriesInOrder(['expirethiskey2','expirethiskey',undefined]);
        },1);

        setTimeout(function(){
            assert.equal(c.get('expirethiskey'),undefined)
            assert.equal(c.get('expirethiskey2'),undefined)
            assert.equal(c.size,0)
        },150);

    }

    function testStats(){
        var ch=new cache({'maximumSize':100,"loaderFunction":function(key){
            if(parseInt(key.substring(1,key.length))<15)
                return "value"+key;

        },'recordStats':1})
        //load keys
        for (var i = 1; i < 11; i++) {
            ch.get('k' + i);
        }
        console.log(ch.stats)
        //access few
        for (i = 1; i < 11; i+=2) {
            ch.get('k' + i);
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
        assert.deepEq(ch.stats)
        console.log(ch.size);
    }

    function matchEntriesInOrder(expected){
        var entries=[];
        c._headEntry.forEach(function(e){
            entries.push(e.key);
        })
        console.log(entries);
        assert.deepEqual(entries,expected);
    }

    testPutAndGet()
    testLRU()
    testRedundantPut()
    testCacheclear()
    testWriteExpiry()
    testStats()


}())