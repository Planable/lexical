'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalNodeSelection = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var lexical_1 = require('lexical');
var react_1 = require('react');
function isNodeSelected(editor, key) {
  return editor.getEditorState().read(function () {
    var node = (0, lexical_1.$getNodeByKey)(key);
    if (node === null) {
      return false;
    }
    return node.isSelected();
  });
}
function useLexicalNodeSelection(key) {
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var _a = (0, react_1.useState)(function () {
      return isNodeSelected(editor, key);
    }),
    isSelected = _a[0],
    setIsSelected = _a[1];
  (0, react_1.useEffect)(
    function () {
      return editor.registerUpdateListener(function () {
        setIsSelected(isNodeSelected(editor, key));
      });
    },
    [editor, key],
  );
  var setSelected = (0, react_1.useCallback)(
    function (selected) {
      editor.update(function () {
        var selection = (0, lexical_1.$getSelection)();
        if (!(0, lexical_1.$isNodeSelection)(selection)) {
          selection = (0, lexical_1.$createNodeSelection)();
          (0, lexical_1.$setSelection)(selection);
        }
        if (selected) {
          selection.add(key);
        } else {
          selection['delete'](key);
        }
      });
    },
    [editor, key],
  );
  var clearSelected = (0, react_1.useCallback)(
    function () {
      editor.update(function () {
        var selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isNodeSelection)(selection)) {
          selection.clear();
        }
      });
    },
    [editor],
  );
  return [isSelected, setSelected, clearSelected];
}
exports.useLexicalNodeSelection = useLexicalNodeSelection;
