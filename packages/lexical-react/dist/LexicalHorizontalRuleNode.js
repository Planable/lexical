/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var a=require("@lexical/react/LexicalComposerContext"),d=require("@lexical/react/useLexicalNodeSelection"),h=require("@lexical/utils"),n=require("lexical"),p=require("react");let q=n.createCommand();
function r({nodeKey:b}){let [f]=a.useLexicalComposerContext(),l=p.useRef(null),[e,g,m]=d.useLexicalNodeSelection(b),k=p.useCallback(c=>{e&&n.$isNodeSelection(n.$getSelection())&&(c.preventDefault(),c=n.$getNodeByKey(b),t(c)&&c.remove(),g(!1));return!1},[e,b,g]);p.useEffect(()=>h.mergeRegister(f.registerCommand(n.CLICK_COMMAND,c=>c.target===l.current?(c.shiftKey||m(),g(!e),!0):!1,n.COMMAND_PRIORITY_LOW),f.registerCommand(n.KEY_DELETE_COMMAND,k,n.COMMAND_PRIORITY_LOW),f.registerCommand(n.KEY_BACKSPACE_COMMAND,
k,n.COMMAND_PRIORITY_LOW)),[m,f,e,k,g]);return p.createElement("hr",{ref:l,className:e?"selected":void 0})}
class u extends n.DecoratorNode{static getType(){return"horizontalrule"}static clone(b){return new u(b.__key)}static importJSON(){return v()}exportJSON(){return{type:"horizontalrule",version:1}}createDOM(){let b=document.createElement("div");b.style.display="contents";return b}getTextContent(){return"\n"}isTopLevel(){return!0}updateDOM(){return!1}decorate(){return p.createElement(r,{nodeKey:this.__key})}}function v(){return new u}function t(b){return b instanceof u}
exports.$createHorizontalRuleNode=v;exports.$isHorizontalRuleNode=t;exports.HorizontalRuleNode=u;exports.INSERT_HORIZONTAL_RULE_COMMAND=q
