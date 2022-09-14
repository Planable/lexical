/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var a=require("react");let b=[["Cat","255,165,0"],["Dog","0,200,55"],["Rabbit","160,0,200"],["Frog","0,172,200"],["Fox","197,200,0"],["Hedgehog","31,200,0"],["Pigeon","200,0,0"],["Squirrel","200,0,148"],["Bear","255,235,0"],["Tiger","86,255,0"],["Leopard","0,255,208"],["Zebra","0,243,255"],["Wolf","0,102,255"],["Owl","147,0,255"],["Gull","255,0,153"],["Squid","0,220,255"]],c=b[Math.floor(Math.random()*b.length)],d=a.createContext({clientID:0,color:c[1],isCollabActive:!1,name:c[0],yjsDocMap:new Map});
exports.CollaborationContext=d;exports.useCollaborationContext=function(e){let f=a.useContext(d);null!=e&&(f.name=e);return f}
