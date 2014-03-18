var DiGraph = require("../lib/DiGraph.js"), util = require("util"), assert = require('assert');
(function () {
      function simpleTest(){
        var udg=new DiGraph();
          udg.addEdge(1,2);
          udg.addEdge(1,3);
          udg.addEdge(2,3);
          udg.utils().printBFSTraversal();
          udg.addEdge(2,4);
          udg.addEdge(4,5);
          udg.addEdge(1,5);
          var path=udg.getShortestPath(1,5);
          assert.deepEqual(path,['5','1']);
          console.log(path);
      }

    function testShortestPathDirected(){
        var dg=new DiGraph({'directed':true});
        dg.addEdge("A","B");
        dg.addEdge("A","C");
        dg.addEdge("B","C");
        dg.addEdge("B","E");
        dg.addEdge("C","D");
        dg.addEdge("E","F");
        dg.addEdge("D","A");
        dg.addEdge("D","G");
        dg.addEdge("D","F");
        dg.addEdge("F","G");
        assert.deepEqual(dg.utils().listVerticesBFS(),[ 'A', 'B', 'C', 'E', 'D', 'F', 'G' ]);
        var path=dg.getShortestPath("A","F");
        assert.deepEqual(path,[ 'F', 'E', 'B', 'A' ]);
        console.log(path);
    }

    function testTopologicalSort(){
        var getReady=new DiGraph({'directed':true});
        getReady.addEdge("PANTS","UNDPANTS");
        getReady.addEdge("BELT","PANTS");
        getReady.addEdge("SHIRT","UNDSHIRT");
        getReady.addEdge("JACKET","SHIRT");
        getReady.addEdge("BELT","SHIRT");//should be tucked in
        getReady.addEdge("TIE","SHIRT");
        getReady.addEdge("PEN","SHIRT");
        getReady.addEdge("WATCH");
        getReady.addEdge("SHOES","SOCKS");
        getReady.addEdge("SHOES","PANTS");
        var ro=getReady.topsort();
        console.log(ro);
        assert.deepEqual(ro,[ 'UNDPANTS',
            'PANTS',
            'UNDSHIRT',
            'SHIRT',
            'BELT',
            'JACKET',
            'TIE',
            'PEN',
            'WATCH',
            'SOCKS',
            'SHOES' ]);
        assert.deepEqual(getReady.hasCycles(),false);

    }
    function testCycleDetection(){
       var cyclic=new DiGraph({'directed':true});
        cyclic.addEdge(1,2);
        cyclic.addEdge(2,3);
        cyclic.addEdge(3,4);
        cyclic.addEdge(3,5);
        cyclic.addEdge(6);
        cyclic.addEdge(7,8);
        cyclic.addEdge(4,1);
        assert.deepEqual(cyclic.hasCycles(),true);
        var undir=new DiGraph({'directed':true});
        undir.addEdge(1,2);
        undir.addEdge(2,3);
        undir.addEdge(3,4);
        undir.addEdge(4,5);
        assert.deepEqual(undir.hasCycles(),false);
        undir.addEdge(1,5);
        assert.deepEqual(undir.hasCycles(),true);



    }

    simpleTest();
    testShortestPathDirected();
    testTopologicalSort();
    testCycleDetection();

})();