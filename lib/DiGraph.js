(function () {
    "use strict";

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
        adjEdges.push(toVertex);


    }

    DiGraph.prototype.getShortestPath = function (fromVertex, toVertex) {
        return _shortPathUnweighted.call(this, fromVertex, toVertex);

    }


    DiGraph.prototype.traverse = function (vertexVisitCallback, thisArg, startVertex) {
        var queue = [], vertex, parent = {};
        var that = this, list = this._adjList;
        if(startVertex){
            var t=Object.create(null);
            t[startVertex]=this._adjList[startVertex];
            list=t;
        }
        for (var v1 in list) {
            if (!parent.hasOwnProperty(v1)) {
                queue.push(v1);
                parent[v1] = null;
                while ((vertex = queue.shift())) {
                    this._adjList[vertex].every(function (v) {
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
        this.traverse(function (v, p) {
            parent[v] = p;
            return v!==v2;
        }, this, v1);

        var p = parent[v2],
            path = [];

        while (p) {
            path.push(p);
            p = parent[p];
        }
        return path;

    }

    DiGraph.prototype.print = function () {
        this.traverse(function (v, p) {
            console.log(v + " parent=" + p);
            return true
        });
    }

    module.exports = DiGraph;

})();