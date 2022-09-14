/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var c=require("lexical"),f=require("react"),g=require("@lexical/text"),h=require("@lexical/utils"),k="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?f.useLayoutEffect:f.useEffect;function l(a){return a.getEditorState().read(g.$canShowPlaceholderCurry(a.isComposing(),a.isEditable()))}
function m(a){let [b,d]=f.useState(()=>l(a));k(()=>{function e(){let n=l(a);d(n)}e();return h.mergeRegister(a.registerUpdateListener(()=>{e()}),a.registerEditableListener(()=>{e()}))},[a]);return b}function p(a){let b=m(a);return[f.useCallback(d=>{a.setRootElement(d)},[a]),b]}exports.useLexical=function(a){let b=f.useMemo(()=>c.createEditor(a),[]),[d,e]=p(b);return[b,d,e]}
