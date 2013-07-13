var skiplist = require('../src/SkipList.js'), assert = require('assert'),util=require('util');
(function(){
    function testInsert(){
        var skl=new skiplist();
        skl.put(10,"simple").put(20,"simple").put(15,"simple");
        console.log(util.inspect(skl,{depth:null, colors:true}))

    }
    testInsert()

})();