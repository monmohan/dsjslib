var skiplist = require('../lib/SkipList.js'), assert = require('assert'), util = require('util');
(function () {

    var skl = new skiplist();
    skl.put(10, "simple").put(20, "20").put(15, "<><")
        .put(90, "ne").put(35, "oldvalue").put(19, "nineteen")
        .put(30, "ss").put(45, "f").put(57, "57");

    console.log("Initial Skip List")
    console.log(skl.inspect_())
    assert.deepEqual(skl.entrySet(),
        [
            { key:10, value:'simple' },
            { key:15, value:'<><' },
            { key:19, value:'nineteen' },
            { key:20, value:'20' },
            { key:30, value:'ss' },
            { key:35, value:'oldvalue' },
            { key:45, value:'f' },
            { key:57, value:'57' },
            { key:90, value:'ne' }
        ]
    )

    skl.put(35, "newvalue")
    skl.put(90, "newvalue2")
    skl.put(19, "newvalue3")
    skl.put(57, "57")
    console.log("Replaced")
    console.log(skl.inspect_())

    assert.strictEqual(skl.get(35).value, "newvalue")
    assert.strictEqual(skl.get(90).value, "newvalue2")
    assert.strictEqual(skl.get(19).value, "newvalue3")
    assert.strictEqual(skl.get(19).key, 19)
    assert.strictEqual(skl.get(57).key, 57)
    assert.strictEqual(skl.get(57).value, "57")
    assert.strictEqual(skl.delete(35), true)
    assert.strictEqual(skl.delete(90), true)
    assert.strictEqual(skl.delete(45), true)
    assert.strictEqual(skl.delete(135), false)
    assert.strictEqual(skl.delete(29), false)
    assert.strictEqual(skl.delete(57), true)
    console.log("Deleted..")
    console.log(skl.entrySet())
    function testSkipListCompfn(){
        var compFn=function(obj1,obj2){
            return obj2.k>obj1.k?1:(obj2.k===obj1.k)?0:-1;
        }
        var objkey, skl=new skiplist(compFn);
        var i= 0, sometext='JavaScript also contains a conditional ' +
            'operator that assigns a value to a variable based on some condition';
        var keys=sometext.split(/\s/);
        while(i<20){
            objkey={'k':keys[i%keys.length],'v':'somevalue'};
            skl.put(objkey,"someobjvalue"+i);
            i++;
        }

        assert.deepEqual(skl.entrySet(),[ { key: { k: 'JavaScript', v: 'somevalue' },
            value: 'someobjvalue17' },
            { key: { k: 'a', v: 'somevalue' }, value: 'someobjvalue11' },
            { key: { k: 'also', v: 'somevalue' }, value: 'someobjvalue18' },
            { key: { k: 'assigns', v: 'somevalue' },
                value: 'someobjvalue7' },
            { key: { k: 'based', v: 'somevalue' }, value: 'someobjvalue13' },
            { key: { k: 'condition', v: 'somevalue' },
                value: 'someobjvalue16' },
            { key: { k: 'conditional', v: 'somevalue' },
                value: 'someobjvalue4' },
            { key: { k: 'contains', v: 'somevalue' },
                value: 'someobjvalue19' },
            { key: { k: 'on', v: 'somevalue' }, value: 'someobjvalue14' },
            { key: { k: 'operator', v: 'somevalue' },
                value: 'someobjvalue5' },
            { key: { k: 'some', v: 'somevalue' }, value: 'someobjvalue15' },
            { key: { k: 'that', v: 'somevalue' }, value: 'someobjvalue6' },
            { key: { k: 'to', v: 'somevalue' }, value: 'someobjvalue10' },
            { key: { k: 'value', v: 'somevalue' }, value: 'someobjvalue9' },
            { key: { k: 'variable', v: 'somevalue' },
                value: 'someobjvalue12' } ]
        );
        console.log(skl.entrySet());
    }
    testSkipListCompfn();

})();