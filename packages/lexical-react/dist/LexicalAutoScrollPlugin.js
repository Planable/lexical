/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var e=require("@lexical/react/LexicalComposerContext"),f=require("lexical"),h=require("react"),k="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?h.useLayoutEffect:h.useEffect;
exports.AutoScrollPlugin=function({scrollRef:g}){let [d]=e.useLexicalComposerContext();k(()=>d.registerUpdateListener(({tags:a,editorState:c})=>{var b=g.current;null!==b&&a.has("scroll-into-view")&&(a=c.read(()=>f.$getSelection()),f.$isRangeSelection(a)&&a.isCollapsed()&&(a=d.getElementByKey(a.anchor.key),null!==a&&(b=b.getBoundingClientRect(),c=a.getBoundingClientRect(),c.bottom>b.bottom?a.scrollIntoView(!1):c.top<b.top&&a.scrollIntoView())))}),[d,g]);return null}
