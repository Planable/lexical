'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.BlockWithAlignableContents = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var LexicalDecoratorBlockNode_1 = require('@lexical/react/LexicalDecoratorBlockNode');
var useLexicalNodeSelection_1 = require('@lexical/react/useLexicalNodeSelection');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var React = require('react');
var react_1 = require('react');
function BlockWithAlignableContents(_a) {
  var children = _a.children,
    format = _a.format,
    nodeKey = _a.nodeKey,
    className = _a.className;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var _b = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey),
    isSelected = _b[0],
    setSelected = _b[1],
    clearSelection = _b[2];
  var ref = (0, react_1.useRef)(null);
  var onDelete = (0, react_1.useCallback)(
    function (event) {
      if (
        isSelected &&
        (0, lexical_1.$isNodeSelection)((0, lexical_1.$getSelection)())
      ) {
        event.preventDefault();
        editor.update(function () {
          var node = (0, lexical_1.$getNodeByKey)(nodeKey);
          if ((0, lexical_1.$isDecoratorNode)(node) && node.isTopLevel()) {
            node.remove();
          }
          setSelected(false);
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey, setSelected],
  );
  (0, react_1.useEffect)(
    function () {
      return (0, utils_1.mergeRegister)(
        editor.registerCommand(
          lexical_1.FORMAT_ELEMENT_COMMAND,
          function (formatType) {
            if (isSelected) {
              var selection = (0, lexical_1.$getSelection)();
              if ((0, lexical_1.$isNodeSelection)(selection)) {
                var node = (0, lexical_1.$getNodeByKey)(nodeKey);
                if (
                  (0, LexicalDecoratorBlockNode_1.$isDecoratorBlockNode)(node)
                ) {
                  node.setFormat(formatType);
                }
              } else if ((0, lexical_1.$isRangeSelection)(selection)) {
                var nodes = selection.getNodes();
                for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                  var node = nodes_1[_i];
                  if (
                    (0, LexicalDecoratorBlockNode_1.$isDecoratorBlockNode)(node)
                  ) {
                    node.setFormat(formatType);
                  } else {
                    var element = (0,
                    utils_1.$getNearestBlockElementAncestorOrThrow)(node);
                    element.setFormat(formatType);
                  }
                }
              }
              return true;
            }
            return false;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          lexical_1.CLICK_COMMAND,
          function (event) {
            event.preventDefault();
            if (event.target === ref.current) {
              if (!event.shiftKey) {
                clearSelection();
              }
              setSelected(!isSelected);
              return true;
            }
            return false;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          lexical_1.KEY_DELETE_COMMAND,
          onDelete,
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          lexical_1.KEY_BACKSPACE_COMMAND,
          onDelete,
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
      );
    },
    [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected],
  );
  return (
    <div
      className={[className.base, isSelected ? className.focus : null]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
      style={{
        textAlign: format ? format : undefined,
      }}>
      {children}
    </div>
  );
}
exports.BlockWithAlignableContents = BlockWithAlignableContents;
