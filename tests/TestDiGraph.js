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
    function testShortestPathObjects(){
        var dg=new DiGraph({'directed':true});
        var hyd={objectid:1,name:'HYD'},
            ams={objectid:2,name:'AMS'},
            ld= {objectid:3,name:'LONDON'},
            be={objectid:4,name:'BERLIN'},
            ny={objectid:5,name:'NY'},
            nj={objectid:6,name:'NJ'},
            ch={objectid:7,name:'CHICAGO'};
        dg.addEdge(hyd,ams);
        dg.addEdge(ams,ld);
        dg.addEdge(ld,ny);
        dg.addEdge(ny,nj);
        dg.addEdge(nj,ch);
        dg.addEdge(hyd,be);
        dg.addEdge(be,ams);
        dg.addEdge(hyd,ld);
        var path=dg.getShortestPath(hyd,ch);
        assert.deepEqual(path,[ { objectid: 7, name: 'CHICAGO' },
            { objectid: 6, name: 'NJ' },
            { objectid: 5, name: 'NY' },
            { objectid: 3, name: 'LONDON' },
            { objectid: 1, name: 'HYD' } ]);
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

    function testTopologicalSortObj(){
        var buildHouse=new DiGraph({'directed':true});
        var i=0;
        function Job(desc){
            this.desc=desc;
            this.id=i++;
            this.objectid=function(){
                return this.id;
            }
        }
        var f=new Job("foundation");
        var ind=new Job("somethingelse"); //doesn't depend on any thing
        var w=new Job("walls");
        var win=new Job("windows");
        var d=new Job("doors");
        var wi=new Job("wires");
        var li=new Job("lights");
        var fu=new Job("furniture");
        var fo=new Job("floor");
        var de=new Job("decorations");
        console.log(f.objectid())

        buildHouse.addEdge(fu,fo);
        buildHouse.addEdge(wi,w);
        buildHouse.addEdge(w,f);
        buildHouse.addEdge(li,wi);
        buildHouse.addEdge(fo,w);
        buildHouse.addEdge(win,w);
        buildHouse.addEdge(d,w);
        buildHouse.addEdge(de,li);
        buildHouse.addEdge(ind);

        var ro=buildHouse.topsort();
        console.log(ro);
        assert.deepEqual(buildHouse.hasCycles(),false);

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
    testShortestPathObjects();
    testTopologicalSort();
    testTopologicalSortObj();
    testCycleDetection();

})();