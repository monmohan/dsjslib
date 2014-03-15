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
        if (toVertex)adjEdges.push(toVertex);


    }

    DiGraph.prototype.getShortestPath = function (fromVertex, toVertex) {
        return _shortPathUnweighted.call(this, fromVertex, toVertex);

    }
    function _adjListFn (vertex) {
        return this._adjList[vertex] || [];

    }


    DiGraph.prototype.traverseQ = function (vertexVisitCallback, thisArg, startVertex) {
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
                    _adjListFn.call(this,vertex).every(function (v) {
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
        this.traverseQ(function (v, p) {
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
            this.traverseQ(function (v, p) {
                console.log("visiting " + v + " parent=" + p);
                return true
            })
        }

        function listVerticesBFS() {
            var vertices = [];
            this.traverseQ(function (v, p) {
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
        var parent = Object.create(null),
            topSortOrder = [];
        for (var vertex in this._adjList) {
            if (!(vertex in parent)) {
                _DFS.call(this, vertex, parent, topSortOrder);
                parent[vertex] = null;
                topSortOrder.push(vertex);
            }
        }
        return topSortOrder;

    }

    var _DFS = function (v, parent, topSortOrder) {
        var list = _adjListFn.call(this,v),
            that = this;
        list.forEach(function (child) {
            if (!(child in parent)) {
                _DFS.call(that, child, parent, topSortOrder);
                parent[child] = v;
                topSortOrder.push(child);
            }
        });

    }


    module.exports = DiGraph;

})();