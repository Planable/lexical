/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var history=require("@lexical/history"),d=require("react"),f=require("@lexical/dragon"),g=require("@lexical/rich-text"),h=require("@lexical/utils");function k(a,b,c=1E3){let e=d.useMemo(()=>b||history.createEmptyHistoryState(),[b]);d.useEffect(()=>history.registerHistory(a,e,c),[c,a,e])}function l(a,b,c=1E3){return k(a,b,c)}var m="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?d.useLayoutEffect:d.useEffect;
function n(a,b){m(()=>h.mergeRegister(g.registerRichText(a,b),f.registerDragonSupport(a)),[a])}exports.useLexicalRichText=function(a,b,c){n(a,c);l(a,b)}
