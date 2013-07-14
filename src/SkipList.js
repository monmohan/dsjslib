/**
 * Created with IntelliJ IDEA.
 * User: msingh
 * Date: 11/7/13
 * Time: 11:52 AM
 * To change this template use File | Settings | File Templates.
 */
function SkipList(compareFn) {
    this.mkList_ = function () {
        this.mkNode_ = function (key, value) {
            return {'key':key, 'value':value, 'next':null, 'prev':null, 'down':null}
        }
        var node1 = this.mkNode_();
        node1.isMin = true;
        var node2 = this.mkNode_();
        node2.isMax = true;
        node1.next = node2;
        node2.prev = node1;
        return node1;
    }
    this.compareFn = function (node, key) {
        if (node.isMin)return 1;//everything is greater
        if (node.isMax)return -1;//everything is smaller
        if (compareFn) {
            return compareFn.call(node.key, key)
        } else {
            return (node.key < key ? 1 : node.key > key ? -1 : 0)
        }
    }
    this.top_ = this.mkList_();

}


SkipList.prototype.insert_ = function (key, value, list, recurse, depth,down) {
    var cur = list;
    while (cur && this.compareFn(cur, key) > 0) {
        cur = cur.next;
    }

    if (recurse && cur.prev.down) {
        this.insert_(key, value, cur.prev.down, true, ++depth);
    } else {
        //insert
        var node = this.mkNode_(key,value);
        cur.prev.next = node;
        node.prev = cur.prev;
        node.next = cur;
        cur.prev = node;
        node.down=down;
        //flip a coin
        if (Math.random() * 100 > 50) {
            if (depth == 0) {
                this.top_ = this.mkList_();
                this.top_.down = list;
                this.insert_(key, value, this.top_, false, 0,node);
            }

        }

    }

}

/**
 * Add a key value pair
 * @param key
 * @param value
 * @return {*}
 */
SkipList.prototype.put = function (key, value) {
     this.insert_(key,value,this.top_,true,0);
    return this;
}

/**
 *
 * @param key
 */
SkipList.prototype.get=function(key){
     return this.search_(key,this.top_);
}


SkipList.prototype.search_=function(key,list){
    var cur = list;
    while (cur && this.compareFn(cur, key) > 0) {
        cur = cur.next;
    }
    if(this.compareFn(cur,key)===0){
        return {'key':key,'value':cur.value}
    }else if(cur.prev.down){
        return this.search_(key,cur.prev.down)
    }

}

module.exports = SkipList;



