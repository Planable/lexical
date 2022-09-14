/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var b=require("react"),g=require("react-dom"),l="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?b.useLayoutEffect:b.useEffect;
function m(a){let [e,h]=b.useState(()=>a.getDecorators());l(()=>a.registerDecoratorListener(d=>{g.flushSync(()=>{h(d)})}),[a]);b.useEffect(()=>{h(a.getDecorators())},[a]);return b.useMemo(()=>{let d=[],k=Object.keys(e);for(let f=0;f<k.length;f++){var c=k[f];let n=e[c];c=a.getElementByKey(c);null!==c&&d.push(g.createPortal(n,c))}return d},[e,a])}exports.useLexicalDecorators=function(a){return m(a)}
