var DiGraph = require("../lib/DiGraph.js"), util = require("util"), assert = require('assert');
(function () {
      function simpleTest(){
        var udg=new DiGraph();
          udg.addEdge(1,2);
          udg.addEdge(1,3);
          udg.addEdge(2,3);
          udg.print();
          udg.addEdge(2,4);
          udg.addEdge(4,5);
          udg.addEdge(1,5);
          var path=udg.getShortestPath(1,5);
          console.log(path);
      }
    simpleTest()

})();