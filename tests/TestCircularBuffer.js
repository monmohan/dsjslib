var CircularBuffer = require('../lib/CircularBuffer.js'), assert = require('assert');
(function () {

    function testInvariants(){
        var cb=new CircularBuffer(5);
        assert.deepEqual(cb.size(),0);
        assert.deepEqual(cb.isEmpty(),true);
        cb.add(1);
        cb.add(2);
        cb.add(3);
        cb.add(4);
        cb.add(5);
        assert.deepEqual(cb.size(),5);
        assert.deepEqual(cb.isFull(),true);
        cb.remove();
        assert.deepEqual(cb.size(),4);
        cb.remove();
        assert.deepEqual(cb.size(),3);
        cb.remove();
        assert.deepEqual(cb.size(),2);
        assert.deepEqual(cb.isFull(),false);
        cb.remove();
        assert.deepEqual(cb.size(),1);
        cb.remove();
        assert.deepEqual(cb.size(),0);
        assert.deepEqual(cb.isEmpty(),true);
        assert.deepEqual(cb.isFull(),false);
        cb.add(1);
        cb.add(2).add(3).add(4).add(5);
        cb.clear();
        assert.deepEqual(cb.size(),0);
        cb.add(6).add(7);
        assertGets(cb,0,1,[6,7])
        assert.deepEqual(cb.isFull(),false);
        cb=new CircularBuffer();
        assert.deepEqual(cb._capacity,32);
        assert.deepEqual(cb.isEmpty(),true);

    }

    function addTest(){
        var cb=new CircularBuffer(3);
        cb.add(1);
        cb.add(2);
        console.log(cb);
        assertAll(cb,2,0,2,[1,2],3)
        cb.add(3);
        assertGets(cb,0,2,[1,2,3]);
        assertAll(cb,3,0,0);
        cb.add(4);
        cb.add(5);
        assertGets(cb,0,2,[3,4,5]);
        assertAll(cb,3,2,2);

    }

    function addAndRemoveTest(){
        var cb=new CircularBuffer(3);
        cb.add(1);
        cb.add(2);
        cb.remove();
        assertAll(cb,1,1,2,[,2],3)
        cb.add(3)
        cb.add(4)

        assertAll(cb,3,1,1);
        assertGets(cb,0,2,[2,3,4]);
        cb.remove();
        cb.remove();
        console.log(cb);
        assertAll(cb,1,0,1);
        assertGets(cb,0,0,[4]);

    }

    function assertAll(cb,size,st,end,buf,capacity){
        buf && assert.deepEqual(cb._buf,buf);
        capacity && assert.deepEqual(cb._capacity,capacity);
        assert.deepEqual(cb._st,st);
        assert.deepEqual(cb._end,end);
        assert.deepEqual(cb.size(),size);

    }

    function assertGets(cb,idxFrom,idxTo,values){
        var i=0;
        while(idxFrom<=idxTo){
            assert.deepEqual(cb.get(idxFrom),values[i]);
            idxFrom++;
            i++;
        }
    }
    testInvariants()
    addTest();
    addAndRemoveTest();
}());