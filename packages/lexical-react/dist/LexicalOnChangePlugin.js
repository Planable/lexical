/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var c=require("@lexical/react/LexicalComposerContext"),g=require("react"),h="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?g.useLayoutEffect:g.useEffect;
exports.OnChangePlugin=function({ignoreHistoryMergeTagChange:d=!1,ignoreInitialChange:e=!0,ignoreSelectionChange:f=!1,onChange:a}){let [b]=c.useLexicalComposerContext();h(()=>{if(a)return b.registerUpdateListener(({editorState:k,dirtyElements:l,dirtyLeaves:m,prevEditorState:n,tags:p})=>{f&&0===l.size&&0===m.size||d&&p.has("history-merge")||e&&n.isEmpty()||a(k,b)})},[b,d,e,f,a]);return null}
