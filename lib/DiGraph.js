(function () {
    "use strict";

    var _hasCycles = false;

    function DiGraph(options) {
        this._directed = options && options.directed;
        this._adjList = Object.create(null);
    }


    DiGraph.prototype.addEdge = function (fromVertex, toVertex, weight) {
        _addEdge.call(this, fromVertex, toVertex, weight);
        if (!this._directed) {
            _addEdge.call(this, toVertex, fromVertex, weight)
        }
    }

    var _addEdge = function (fromVertex, toVertex) {
        var adjEdges = this._adjList[fromVertex]
        if (!adjEdges) {
            adjEdges = [];
            this._adjList[fromVertex] = adjEdges;
        }
        if (toVertex)adjEdges.push(toVertex);


    }

    DiGraph.prototype.getShortestPath = function (fromVertex, toVertex) {
        return _shortPathUnweighted.call(this, fromVertex, toVertex);

    }
    function _adjListFn(vertex) {
        return this._adjList[vertex] || [];

    }


    DiGraph.prototype.traverseBFS = function (vertexVisitCallback, thisArg, startVertex) {
        var queue = [], vertex, parent = {};
        var that = this, list = this._adjList;
        if (startVertex) {
            var t = Object.create(null);
            t[startVertex] = _adjListFn.call(this)[startVertex];
        }
        for (var v1 in list) {
            if (!parent.hasOwnProperty(v1)) {
                queue.push(v1);
                parent[v1] = null;
                vertexVisitCallback.call(thisArg || that, v1, null);
                while ((vertex = queue.shift())) {
                    _adjListFn.call(this, vertex).every(function (v) {
                        if (!parent.hasOwnProperty(v)) {
                            (function (p) {
                                parent[v] = p;
                            }(vertex));

                            if (vertexVisitCallback.call(thisArg || that, v, vertex)) {
                                queue.push(v);
                            } else {
                                return false;
                            }

                        }
                        return true;
                    }, that)
                }
            }
        }
    }


    function _shortPathUnweighted(v1, v2) {
        var parent = {};
        this.traverseBFS(function (v, p) {
            parent[v] = p;
            return v !== v2;
        }, this, v1);

        var p = parent[v2],
            path = [v2];

        while (p) {
            path.push(p);
            p = parent[p];
        }
        return path;

    }

    DiGraph.prototype.utils = function () {
        function printBFSTraversal() {
            this.traverseBFS(function (v, p) {
                console.log("visiting " + v + " parent=" + p);
                return true
            })
        }

        function listVerticesBFS() {
            var vertices = [];
            this.traverseBFS(function (v, p) {
                vertices.push(v);
                return true
            })
            return vertices;
        }

        var util = {};
        util.printBFSTraversal = printBFSTraversal.bind(this);
        util.listVerticesBFS = listVerticesBFS.bind(this);
        return util;

    }

    DiGraph.prototype.topsort = function () {
        if (!this._directed)throw new Error("Not a Directed Graph");
        var topSortOrder = [],
            err=null;
        this.traverseDFS(function (child, parent) {
            topSortOrder.push(child);
            return true;
        },function(){
            err=new Error("Not an Acylic Graph");
            return false;
        });
        if(err)throw err;
        return topSortOrder;

    }

    DiGraph.prototype.hasCycles = function () {
        var cycle=false;
        this.traverseDFS(null,function(){
            cycle=true;
            return false;
        });

        return cycle;

    }


    DiGraph.prototype.traverseDFS = function (vertexVisitCallback,cycleDetectCallback,thisArg) {
        var child2ParentMap = Object.create(null),
            graph = this;
        Object.keys(graph._adjList).every(function (vertex) {
            if (!(vertex in child2ParentMap)) {
                child2ParentMap[vertex] = null;
                var pathMap=Object.create(null);
                pathMap[vertex]=null;
                (function visitChild(v) {
                    var edges = _adjListFn.call(graph, v);
                    edges.every(function (child) {
                        if (!(child in child2ParentMap)) {
                            child2ParentMap[child] = v;
                            pathMap[child]=v;
                            visitChild(child);
                            return (vertexVisitCallback && vertexVisitCallback.call(thisArg || graph, child, v)) || true;
                        }
                        if(child in pathMap){
                            //back edge
                            return (cycleDetectCallback && cycleDetectCallback.call(thisArg||graph,child,v,pathMap))|| true;
                        }
                        return true;
                    });
                })(vertex);
                return vertexVisitCallback && vertexVisitCallback.call(thisArg || graph, vertex, null);
            }
            return true;

        });

    }


    module.exports = DiGraph;

})();