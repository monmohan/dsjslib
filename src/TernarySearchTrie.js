/**
 *
 * @constructor
 */
function TernarySearchTrie() {
    this.mkNode = function (lt, gt, eq, val,char) {
        return {c:char||null,l:lt || null, g:gt|| null, e:eq|| null, v:val || null};
    }
    this.root = this.mkNode();
}

TernarySearchTrie.prototype.search = function (key) {
    return recFind(this.root,key,0);
      function recFind(node,key,pos){
          if(!node) return null;
          if(pos===key.length-1)return node.v;
          var recNode=key.charAt(pos)===node.c?node.e:key.charAt(pos)>node.c?node.g:node.l;
          return recFind(recNode,key,++pos);

      }
}

TernarySearchTrie.prototype.insert = function (key,val) {
    var that=this;
    return recIns(this.root,key,val,0);
    function recIns(node,key,val,pos){
        if(!node.c){
            node.c=key.charAt(pos);
        }
        if(pos===key.length-1){
            node.v=val
            return that;
        }

        var recNode=key.charAt(pos)===node.c?(node.e || (node.e=that.mkNode()))
            :key.charAt(pos)>node.c?(node.g||(node.g=that.mkNode())):(node.l || (node.l=that.mkNode()));
        return recIns(recNode,key,val,++pos);

    }
}

module.exports=TernarySearchTrie