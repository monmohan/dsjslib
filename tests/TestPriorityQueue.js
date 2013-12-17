var PriorityQueue = require('../lib/PriorityQueue.js'), assert = require('assert'), fs = require('fs');
(function () {

    function testOffer() {
        var pq = new PriorityQueue();
        pq.offer(10).offer(20).offer(30).offer(40);
        assert.deepEqual(pq._queue, [ 40, 30, 20, 10 ]);
        assert.equal(pq.size(), 4);
        return pq;
    }

    function testPoll() {
        var pq = new PriorityQueue();
        for (var i = 0; i < 50; i++) {
            pq.offer(i);

        }
        for (i = 49; i >= 10; i--) {
            assert.equal(pq.poll(), i);
            assert.equal(pq.size(), i, 'test failed - size mismatch');
        }

        for (i = 9; i >= 0; i--) {
            assert.equal(pq.peek(), 9);
            assert.equal(pq.size(), 10, 'test failed - size mismatch');
        }
        //clean and check
        for (i = 0; i < 10; i++) {
            pq.poll();
        }
        assert.equal(pq.size(), 0);
        assert.deepEqual(pq._queue, []);
    }

    function testRandom() {
        var testText1 = 'Fixed length arrays are limited in capacity, but it is not true',
            testText2 = 'unnecessary to ever move items stored in the array. If n is the size of the array, then computing ' +
                'indices modulo n will turn the array into a circle',
            pq = new PriorityQueue(/*reverse the compare to make it min heap*/
                function (existing, toAdd) {
                    return existing > toAdd ? 1 : existing < toAdd ? -1 : 0;
                }),
            arr1 = testText1.split(/\s/),
            arr2 = testText2.split(/\s/);


        arr1.forEach(function (o) {
            pq.offer(o);
        });
        arr1 = arr1.sort();

        for (var i = 0; i < 5; i++) {
            assert.equal(pq.poll(), arr1[0], 'comparison failed at index ' + i);
            arr1.shift();
        }

        arr2.forEach(function (o) {
            pq.offer(o);
        });

        arr1 = (arr1.concat(arr2)).sort();
        var num = arr1.length;
        for (i = 0; i < num; i++) {
            assert.equal(pq.poll(), arr1[0], 'comparison failed at index ' + i);
            arr1.shift();
        }
        assert.equal(pq.size(), 0, 'size mismatch');
        assert.deepEqual(pq._queue, []);

        //add one more for sanity
        pq.offer("foo");
        assert.deepEqual(pq.peek(), "foo");
        assert.deepEqual(pq.poll(), "foo");
        assert.equal(pq.size(), 0);
    }

    testOffer();
    testPoll();
    testRandom();
}());