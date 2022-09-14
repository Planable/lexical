/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var d=require("@lexical/react/LexicalComposerContext"),f=require("lexical"),l=require("react"),m="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?l.useLayoutEffect:l.useEffect;let n={tag:"history-merge"};
function p(b,a){if(null!==a&&void 0!==a&&null!==a)switch(typeof a){case "string":let e=b.parseEditorState(a);b.setEditorState(e,n);break;case "object":b.setEditorState(a,n);break;case "function":b.update(()=>{f.$getRoot().isEmpty()&&a(b)},n)}}
exports.LexicalComposer=function({initialConfig:b,children:a}){let e=l.useMemo(()=>{const {theme:c,namespace:g,editor__DEPRECATED:q,nodes:r,onError:t,editorState:u}=b,v=d.createLexicalComposerContext(null,c);let h=q||null;if(null===h){const k=f.createEditor({editable:!1,namespace:g,nodes:r,onError:w=>t(w,k),theme:c});p(k,u);h=k}return[h,v]},[]);m(()=>{let c=b.editable,[g]=e;g.setEditable(void 0!==c?c:!0)},[]);return l.createElement(d.LexicalComposerContext.Provider,{value:e},a)}
