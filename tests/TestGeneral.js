/*var Benchmark=require('/opt/node/node_modules/benchmark/benchmark.js');
var avl=require('/depot/dsjs/lib/AVLTree.js');
var plainObj={};
var tree=new avl();

var i=0;
var limit = 10000;
var putTree=function(){

        tree.put(++i,i);


}

var putPlainObj=function(){
    //tree[++i]=i;
    plainObj[++i]=i;

}

var bm=new Benchmark(
    'test2', putTree,{'maxTime':3}
    );

    bm.on('complete',
    function(){
        console.log(this.options);
        console.log(this.times);
        console.log(this.cycles);
        console.log(this.count);
        console.log(i);
    });
bm.run();*/
/*
(function(){
    var async=require('/opt/node/node_modules/async/lib/async.js');
    var fs=require('fs');
    function func1(callback){
        fs.readFile('/depot/dsjs/tests/resources/largetextfile.txt', function (err, data) {
            console.log(data);
            console.log('one was called');
            callback(null, 'one');

        });
        }
        function func2(callback){
            console.log('two was called');
            callback(null, 'two');
        }
    async.series([func1,func2],
        function(err, results){
            console.log(results);
        });


    console.log("bar");
}());*/
(function(){
    var fs=require('fs');
        fs.readFile('/depot/dsjs/tests/resources/largetextfile.txt', "utf-8",function (err, data) {


            console.log(data.match(/Tesla/g)[0]);

        });


}());
