/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var a=require("@lexical/link"),d=require("@lexical/react/LexicalComposerContext"),e=require("lexical"),f=require("react");
exports.LinkPlugin=function(){let [b]=d.useLexicalComposerContext();f.useEffect(()=>{if(!b.hasNodes([a.LinkNode]))throw Error("LinkPlugin: LinkNode not registered on editor");},[b]);f.useEffect(()=>b.registerCommand(a.TOGGLE_LINK_COMMAND,c=>{if("string"===typeof c||null===c)a.toggleLink(c);else{let {url:g,target:h,rel:k}=c;a.toggleLink(g,{rel:k,target:h})}return!0},e.COMMAND_PRIORITY_EDITOR),[b]);return null}
