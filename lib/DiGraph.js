(function () {
    "use strict";

    function DiGraph(options) {
        this._directed = options && options.directed;
        this._adjList = Object.create(null);
        this._vertices = Object.create(null);
    }


    DiGraph.prototype.addEdge = function (fromVertex, toVertex, weight) {
        _addEdge.call(this, fromVertex, toVertex, weight);
        if (!this._directed) {
            _addEdge.call(this, toVertex, fromVertex, weight)
        }
    }

    function _objToId(o) {
        var objid;
        switch (typeof o) {
            case 'number':
            case 'string':
                objid = o;
                break;
            case 'object':
                objid = o['objectid'];
                break;
            default :
                break;

        }
        objid = typeof objid === 'function' ? objid.call(o) : objid;
        if (objid === undefined || objid === null) {
            throw new Error("Cannot get id for the vertex: The vertex being added should be a number or" +
                " a string or an object with a property called objectid.\n The property can " +
                "be a number/string type or a function which returns a number/string");
        }
        return objid;

    }

    var _addEdge = function (fromVertex, toVertex) {
        var frvid = _objToId(fromVertex),
            tovid = toVertex && _objToId(toVertex);

        var adjEdges = this._adjList[frvid];
        if (!adjEdges) {
            adjEdges = [];
            this._adjList[frvid] = adjEdges;
            this._vertices[frvid] = fromVertex;
        }
        if (!(tovid === undefined || tovid === null)) {
            adjEdges.push(tovid);
            if (!this._vertices[tovid])this._vertices[tovid] = toVertex;
        }


    }

    DiGraph.prototype.getShortestPath = function (fromVertex, toVertex) {
        return _shortPathUnweighted.call(this, fromVertex, toVertex);

    }
    function _adjListFn(vertex) {
        return (vertex && this._adjList[_objToId(vertex)]) || [];

    }


    DiGraph.prototype.traverseBFS = function (vertexVisitCallback, thisArg, startVertex) {
        var queue = [], vertex, parent = {};
        var graph = this, list = this._adjList;
        if (startVertex) {
            var t = Object.create(null);
            t[_objToId(startVertex)] = _adjListFn.call(this)[startVertex];
        }
        for (var v1 in list) {
            if (!parent.hasOwnProperty(v1)) {
                queue.push(v1);
                parent[v1] = null;
                vertexVisitCallback.call(thisArg || graph, graph._vertices[v1], null);
                while ((vertex = queue.shift())) {
                    _adjListFn.call(this, vertex).every(function (v) {
                        if (!parent.hasOwnProperty(v)) {
                            (function (p) {
                                parent[v] = p;
                            }(vertex));

                            if (vertexVisitCallback.call(thisArg || graph, graph._vertices[v], graph._vertices[vertex])) {
                                queue.push(v);
                            } else {
                                return false;
                            }

                        }
                        return true;
                    }, graph)
                }
            }
        }
    }


    function _shortPathUnweighted(v1, v2) {
        var parent = {},
            graph = this;
        this.traverseBFS(function (v, p) {
            parent[_objToId(v)] = p;
            return _objToId(v) !== _objToId(v2);
        }, this, v1);

        var p = parent[_objToId(v2)],
            path = [v2];

        while (p) {
            path.push(p);
            p = parent[_objToId(p)];
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
            err = null;
        this.traverseDFS(function (child, parent) {
            topSortOrder.push(child);
            return true;
        }, function () {
            err = new Error("Not an Acylic Graph");
            return false;
        });
        if (err)throw err;
        return topSortOrder;

    }

    DiGraph.prototype.hasCycles = function () {
        var cycle = false,
            graph = this;
        this.traverseDFS(null, function (g, fromNode, toNode, pathMap) {
            if (!graph._directed) {
                cycle = pathMap[_objToId(fromNode)] !== _objToId(toNode);//not immediate parent
            } else {
                cycle = true;
            }
            return !cycle;
        });

        return cycle;

    }


    DiGraph.prototype.traverseDFS = function (vertexVisitCallback, cycleDetectCallback, thisArg) {
        var child2ParentMap = Object.create(null),
            graph = this;
        Object.keys(graph._adjList).every(function (vertex) {
            if (!(vertex in child2ParentMap)) {
                child2ParentMap[vertex] = null;
                var pathMap = Object.create(null);
                pathMap[vertex] = null;
                (function visitChild(v) {
                    var edges = _adjListFn.call(graph, graph._vertices[v]);
                    edges.every(function (child) {
                        if (!(child in child2ParentMap)) {
                            child2ParentMap[child] = v;
                            pathMap[child] = v;
                            visitChild(child);

                            return vertexVisitCallback ? vertexVisitCallback.call(thisArg || graph, graph._vertices[child],
                                graph._vertices[v]) : true;

                        }
                        if (child in pathMap) {
                            //back edge
                            return cycleDetectCallback ? cycleDetectCallback.call(thisArg || graph, graph._vertices[child],
                                graph._vertices[v], pathMap) : true;

                        }
                        return true;
                    });
                })(vertex);
                vertexVisitCallback ? vertexVisitCallback.call(thisArg || graph, graph._vertices[vertex], null) : true
            }
            return true;

        });

    }


    module.exports = DiGraph;

})();