/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var b=require("@lexical/text"),d=require("@lexical/utils"),e=require("react"),f="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?e.useLayoutEffect:e.useEffect;function g(a){return a.getEditorState().read(b.$canShowPlaceholderCurry(a.isComposing(),a.isEditable()))}
function h(a){let [k,l]=e.useState(()=>g(a));f(()=>{function c(){let m=g(a);l(m)}c();return d.mergeRegister(a.registerUpdateListener(()=>{c()}),a.registerEditableListener(()=>{c()}))},[a]);return k}exports.useLexicalCanShowPlaceholder=function(a){return h(a)}
