function Class1() {
    this.outer = 1
    this.SubClass = function () {
        this.inner = 1;
    }
    var mkNode = function (foo) {
        return {'insert':function () {
            return mkNode(foo)
        }, "x":foo}
    }
    var obj = mkNode("beta");
    console.log(obj.insert())
}

(function () {
    var o = new Class1();
    var i = new o.SubClass();

})();