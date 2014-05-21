var assert = require('assert'), BloomFilter=require('../lib/BloomFilter.js');
(function () {
    var b=new BloomFilter({expectedInsertions:10,falsePosPercent:0.03});
    console.log(b.k);
    console.log(b.m);

    b.put('a');
    b.put('b');
    console.log(b.mightContain('a'));
    console.log(b.mightContain('b'));

}());