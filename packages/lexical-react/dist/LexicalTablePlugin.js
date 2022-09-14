/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var e=require("@lexical/react/LexicalComposerContext"),f=require("@lexical/table"),k=require("lexical"),m=require("react");
exports.TablePlugin=function(){let [d]=e.useLexicalComposerContext();m.useEffect(()=>{if(!d.hasNodes([f.TableNode,f.TableCellNode,f.TableRowNode]))throw Error("Minified Lexical error #10; visit https://lexical.dev/docs/error?code=10 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.");return d.registerCommand(f.INSERT_TABLE_COMMAND,({columns:a,rows:c,includeHeaders:g})=>{var b=k.$getSelection();if(!k.$isRangeSelection(b))return!0;let h=b.focus;
b=h.getNode();null!==b&&(a=f.$createTableNodeWithDimensions(Number(c),Number(a),g),k.$isRootNode(b)?(c=b.getChildAtIndex(h.offset),null!==c?c.insertBefore(a):b.append(a),a.insertBefore(k.$createParagraphNode())):b.getTopLevelElementOrThrow().insertAfter(a),a.insertAfter(k.$createParagraphNode()),a.getFirstChildOrThrow().getFirstChildOrThrow().select());return!0},k.COMMAND_PRIORITY_EDITOR)},[d]);m.useEffect(()=>{let a=new Map;return d.registerMutationListener(f.TableNode,c=>{for(let [g,b]of c)"created"===
b?d.update(()=>{var h=d.getElementByKey(g);let l=k.$getNodeByKey(g);h&&l&&(h=f.applyTableHandlers(l,h,d),a.set(g,h))}):"destroyed"===b&&(c=a.get(g),void 0!==c&&(c.removeListeners(),a.delete(g)))})},[d]);return null}
