var skiplist = require('../src/SkipList.js'), assert = require('assert'),util=require('util');
(function(){
    function testInsertAndSearch(){
        var skl=new skiplist();
        skl.put(10,"simple").put(20,"20").put(15,"<><")
            .put(90,"ne").put(35,"three5").put(19,"nineteen");
        console.log(skl.get(35))

    }
    testInsertAndSearch()

})();