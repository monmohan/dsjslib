(function(){
    "use strict";
    var isNode = typeof module === 'object' && module.exports;
    var LEVEL={
        debug:2,
        error:1,
        info:0
    }
    var logLevel=LEVEL.info;
    if(isNode){
        exports.isDebugEnabled=function(){
            return logLevel===LEVEL.debug;
        }

        exports.setLogLevel=function(level){
            if(level && typeof level=='number' && level>=0 && level<=2){
               logLevel=level;
            }
        }
        exports.Levels=LEVEL;
    }


})();

