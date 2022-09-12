/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var b=require("react"),f=require("@lexical/text"),g=require("@lexical/utils"),h="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?b.useLayoutEffect:b.useEffect;function k(a){return a.getEditorState().read(f.$canShowPlaceholderCurry(a.isComposing(),a.isEditable()))}
function l(a){let [c,d]=b.useState(()=>k(a));h(()=>{function e(){let m=k(a);d(m)}e();return g.mergeRegister(a.registerUpdateListener(()=>{e()}),a.registerEditableListener(()=>{e()}))},[a]);return c}exports.useLexicalEditor=function(a){let c=l(a);return[b.useCallback(d=>{a.setRootElement(d)},[a]),c]}
