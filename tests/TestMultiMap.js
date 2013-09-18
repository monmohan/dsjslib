var MultiMap = require('../lib/MultiMap.js'),TreeMultiMap = require('../lib/TreeMultiMap.js'), assert = require('assert');
(function () {
    'use strict';
    var testText='Fixed length arrays are limited in capacity, but it is not true ' +
        'that items need to be copied towards the head of the queue. The simple trick of turning ' +
        'the array into a closed circle and letting the head and tail drift around endlessly in that circle makes it ' +
        'unnecessary to ever move items stored in the array. If n is the size of the array, then computing ' +
        'indices modulo n will turn the array into a circle. This is still the conceptually simplest way to ' +
        'construct a queue in a high level language, but it does admittedly slow things down a little, because the ' +
        'array indices must be compared to zero and the array size, which is comparable to the time taken to check ' +
        'whether an array index is out of bounds, which some languages do, but this will certainly be the method of ' +
        'choice for a quick and dirty implementation, or for any high level language that does not have pointer syntax. ' +
        'The array size must be declared ahead of time, but some implementations simply double the declared array size ' +
        'hen overflow occurs. Most modern languages with objects or pointers can implement or come with libraries for ' +
        'dynamic lists. Such data structures may have not specified fixed capacity limit besides memory constraints. ' +
        'Queue overflow results from trying to add an element ' +
        'onto a full queue and queue underflow happens when trying to remove an element from an empty queue.',
        keys=testText.split(/\s/);

    function testMultiMap() {
        var m = new MultiMap();

        keys.forEach(function(k){
            m.put(k,'T'); //create a bogus value to count the number of occurrences
        });
        assert.equal(m.entries().length,keys.length);
        assert.equal(m.get('array').length,7);
        assert.equal(m.get('overflow').length,2);
        assert.equal(m.get('queue').length,3);
        assert.equal(m.get('queue.').length,2);
        assert.equal(m.get('Queue').length,1);
        m.remove('queue.','R');
        assert.equal(m.get('queue.').length,2);
        m.remove('queue.','T');
        assert.equal(m.get('queue.').length,1);
        m.remove('overflow');
        assert.equal(m.hasKey('overflow'),false);
        assert.equal(m.entries().length,keys.length-3);



    }

    function testTreeMultiMap() {
        var m = new TreeMultiMap();
        var i= 0,
            testVs=[],
            v;
        keys.forEach(function(k){
            v='T'+(i++);
            m.put(k,v); //create a bogus value to count the number of occurrences
            if(k==='is'){
                testVs.push(v);
            }
        });
        assert.equal(m.entries().length,keys.length);
        assert.equal(m.get('array').length,7);
        assert.equal(m.get('to').length,8);
        var expectedOrder=[];
        m.entries().forEach(function(e){
            expectedOrder.push(e.key);
        });

        assert.deepEqual(keys.sort(),expectedOrder);
        m.remove('to');
        assert.equal(m.hasKey('to'),false);
        m.get('to').push('random');
        assert.deepEqual(m.get('to'),['random']);
        assert.equal(m.get('is').length,5);
        assert.deepEqual(m.get('is'),testVs);
        assert.deepEqual(m.remove('is','N'),[]);
        assert.deepEqual(m.remove('is',testVs[2] ),[testVs[2]]);
        testVs.splice(2,1);
        testVs.push('x');
        assert.deepEqual(m.get('is').length,4);
        var result=m.get('is');
        result.push('x');
        assert.deepEqual(result,testVs);
    }

    testMultiMap();
    testTreeMultiMap();


}());