/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var d=require("@lexical/react/LexicalComposerContext"),h=require("react"),l=require("@lexical/text"),m=require("@lexical/utils"),n=require("react-dom"),p=require("@lexical/dragon"),q=require("@lexical/plain-text"),r="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?h.useLayoutEffect:h.useEffect;function t(a){return a.getEditorState().read(l.$canShowPlaceholderCurry(a.isComposing(),a.isEditable()))}
function u(a){let [c,f]=h.useState(()=>t(a));r(()=>{function b(){let g=t(a);f(g)}b();return m.mergeRegister(a.registerUpdateListener(()=>{b()}),a.registerEditableListener(()=>{b()}))},[a]);return c}
function v(a){let [c,f]=h.useState(()=>a.getDecorators());r(()=>a.registerDecoratorListener(b=>{n.flushSync(()=>{f(b)})}),[a]);h.useEffect(()=>{f(a.getDecorators())},[a]);return h.useMemo(()=>{let b=[],g=Object.keys(c);for(let k=0;k<g.length;k++){var e=g[k];let w=c[e];e=a.getElementByKey(e);null!==e&&b.push(n.createPortal(w,e))}return b},[c,a])}function x(a,c){r(()=>m.mergeRegister(q.registerPlainText(a,c),p.registerDragonSupport(a)),[a])}
exports.PlainTextPlugin=function({contentEditable:a,placeholder:c,initialEditorState:f}){let [b]=d.useLexicalComposerContext(),g=u(b),e=v(b);x(b,f);return h.createElement(h.Fragment,null,a,g&&c,e)}
