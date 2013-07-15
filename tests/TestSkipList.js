var skiplist = require('../src/SkipList.js'), assert = require('assert'),util=require('util');
(function(){
    function testInsertAndSearch(){
        var skl=new skiplist();
        skl.put(10,"simple").put(20,"20").put(15,"<><")
            .put(90,"ne").put(35,"oldvalue").put(19,"nineteen")
            .put(30,"ss").put(45,"f").put(57,"57");
        console.log(skl.inspect_())
        skl.put(35,"newvalue")
        console.log(skl.get(35))

    }
    testInsertAndSearch()

})();