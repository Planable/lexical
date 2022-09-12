/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var a=require("@lexical/react/LexicalComposerContext"),h=require("@lexical/react/LexicalDecoratorBlockNode"),m=require("@lexical/react/useLexicalNodeSelection"),n=require("@lexical/utils"),u=require("lexical"),v=require("react");
exports.BlockWithAlignableContents=function({children:w,format:p,nodeKey:g,className:q}){let [d]=a.useLexicalComposerContext(),[e,k,r]=m.useLexicalNodeSelection(g),t=v.useRef(null),l=v.useCallback(b=>{e&&u.$isNodeSelection(u.$getSelection())&&(b.preventDefault(),d.update(()=>{const c=u.$getNodeByKey(g);u.$isDecoratorNode(c)&&c.isTopLevel()&&c.remove();k(!1)}));return!1},[d,e,g,k]);v.useEffect(()=>n.mergeRegister(d.registerCommand(u.FORMAT_ELEMENT_COMMAND,b=>{if(e){var c=u.$getSelection();if(u.$isNodeSelection(c)){var f=
u.$getNodeByKey(g);h.$isDecoratorBlockNode(f)&&f.setFormat(b)}else if(u.$isRangeSelection(c)){c=c.getNodes();for(f of c)h.$isDecoratorBlockNode(f)?f.setFormat(b):n.$getNearestBlockElementAncestorOrThrow(f).setFormat(b)}return!0}return!1},u.COMMAND_PRIORITY_LOW),d.registerCommand(u.CLICK_COMMAND,b=>{b.preventDefault();return b.target===t.current?(b.shiftKey||r(),k(!e),!0):!1},u.COMMAND_PRIORITY_LOW),d.registerCommand(u.KEY_DELETE_COMMAND,l,u.COMMAND_PRIORITY_LOW),d.registerCommand(u.KEY_BACKSPACE_COMMAND,
l,u.COMMAND_PRIORITY_LOW)),[r,d,e,g,l,k]);return v.createElement("div",{className:[q.base,e?q.focus:null].filter(Boolean).join(" "),ref:t,style:{textAlign:p?p:void 0}},w)}
