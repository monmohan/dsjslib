#!/bin/sh
NODE=/opt/node/bin/node
JSDOC=/opt/node/node_modules/jsdoc/jsdoc.js
SRC_ROOT=/depot/dsjs
#gen jsdoc
$NODE $JSDOC $SRC_ROOT/lib -c $SRC_ROOT/build/jsdocs-conf.json $SRC_ROOT/README.md 
cd $SRC_ROOT
tar --exclude=.idea --exclude=dsjs.iml --exclude=.git -cvzf dsjslib.tar.gz .
