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
    DiGraph.prototype._adjListFn = function (vertex) {
        return this._adjList[vertex] || [];

    }


    DiGraph.prototype.traverse = function (vertexVisitCallback, thisArg, startVertex) {
        var queue = [], vertex, parent = {};
        var that = this, list = this._adjList;
        if (startVertex) {
            var t = Object.create(null);
            t[startVertex] = this._adjListFn[startVertex];
        }
        for (var v1 in list) {
            if (!parent.hasOwnProperty(v1)) {
                queue.push(v1);
                parent[v1] = null;
                vertexVisitCallback.call(thisArg || that, v1, null);
                while ((vertex = queue.shift())) {
                    this._adjListFn(vertex).every(function (v) {
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
            this.traverse(function (v, p) {
                console.log("visiting " + v + " parent=" + p);
                return true
            })
        }

        function listVerticesBFS() {
            var vertices = [];
            this.traverse(function (v, p) {
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


    module.exports = DiGraph;

})();