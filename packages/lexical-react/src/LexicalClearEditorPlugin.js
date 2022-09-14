'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.ClearEditorPlugin = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var lexical_1 = require('lexical');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function ClearEditorPlugin(_a) {
  var onClear = _a.onClear;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, useLayoutEffect_1['default'])(
    function () {
      return editor.registerCommand(
        lexical_1.CLEAR_EDITOR_COMMAND,
        function (payload) {
          editor.update(function () {
            if (onClear == null) {
              var root = (0, lexical_1.$getRoot)();
              var selection = (0, lexical_1.$getSelection)();
              var paragraph = (0, lexical_1.$createParagraphNode)();
              root.clear();
              root.append(paragraph);
              if (selection !== null) {
                paragraph.select();
              }
            } else {
              onClear();
            }
          });
          return true;
        },
        lexical_1.COMMAND_PRIORITY_EDITOR,
      );
    },
    [editor, onClear],
  );
  return null;
}
exports.ClearEditorPlugin = ClearEditorPlugin;
