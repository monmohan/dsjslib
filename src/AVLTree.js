var BinarySearchTree=require("./BinarySearchTree.js")
var AVLTree=function(){

}

AVLTree.prototype=new BinarySearchTree();
var avl=new AVLTree();
avl.insert(41).insert(13).insert(35).insert(16).insert(12).insert(27).insert(65).insert(51);
avl.prettyPrint();