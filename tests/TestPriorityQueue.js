var PriorityQueue = require('../lib/PriorityQueue.js'), assert = require('assert'), fs = require('fs');
(function () {

    function testOffer() {
        var pq = new PriorityQueue();
        pq.offer(10);
        pq.offer(20);
        pq.offer(30);
        pq.offer(40);
        console.log(pq);
        console.log(pq.size());
    }

    function testPoll() {
        var pq = new PriorityQueue();
        pq.offer(10);
        pq.offer(20);
        pq.offer(30);
        pq.offer(40);
        console.log(pq);
        console.log(pq.size());
        pq.poll();
        console.log(pq.poll())
        console.log(pq);
        console.log(pq.size());
        pq.poll();
        console.log(pq.poll())
        console.log(pq);
        console.log(pq.size());
        console.log(pq.poll())
    }

    testOffer();
    testPoll();
}());