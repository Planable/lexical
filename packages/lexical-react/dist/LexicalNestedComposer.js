/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var b=require("@lexical/react/LexicalCollaborationContext"),e=require("@lexical/react/LexicalComposerContext"),m=require("react");
exports.LexicalNestedComposer=function({initialEditor:a,children:n,initialNodes:k,initialTheme:p,skipCollabChecks:q}){let l=m.useRef(!1),f=m.useContext(e.LexicalComposerContext);if(null==f)throw Error("Minified Lexical error #9; visit https://lexical.dev/docs/error?code=9 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.");let w=m.useMemo(()=>{const [g,r]=f;var c=p||r.getTheme()||void 0;const t=e.createLexicalComposerContext(f,c);void 0!==
c&&(a._config.theme=c);a._parentEditor=g;if(k)for(var d of k)c=d.getType(),a._nodes.set(c,{klass:d,transforms:new Set});else{d=a._nodes=new Map(g._nodes);for(const [u,v]of d)a._nodes.set(u,{klass:v.klass,transforms:new Set})}a._config.namespace=g._config.namespace;return[a,t]},[]),{isCollabActive:x,yjsDocMap:y}=b.useCollaborationContext(),h=q||l.current||y.has(a.getKey());m.useEffect(()=>{h&&(l.current=!0)},[h]);return m.createElement(e.LexicalComposerContext.Provider,{value:w},!x||h?n:null)}
