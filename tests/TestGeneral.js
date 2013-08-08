(function()
{var foo={
    main:function(i){
        console.log('main called'+i)
    },
    prop:'val',
    fn2:function(x){
        console.log('fn2 called')
    },
    objprop:{'k':1,'v':'v'}
}

var common={
    intercepted:function (obj, iFn, thisArg) {
        function createMask(oldFn, iFn) {
            return function () {
                var mask = iFn.apply(thisArg || obj, Array.prototype.slice.apply(arguments));
                if (mask) {
                    oldFn.apply(obj, Array.prototype.slice.apply(arguments));
                }
            };
        }

        for (var fn in obj) {
            if (obj.hasOwnProperty(fn) && typeof obj[fn] === 'function'
                && typeof obj[fn].mask !== 'function'/*single mask only*/) {
                obj[fn] = createMask(obj[fn], iFn);
                obj[fn].mask = iFn;
            }

        }

    },
    test:function(i1,i2){
        console.log('interceptor called '+i1+i2)
        return true
    }

}
    common.intercepted(foo,common.test,common);
foo.main('a','b');
foo.fn2(11,12);
    common.intercepted(foo,common.test,common);
    foo.main('a','b');
    foo.fn2(11,12);
})();