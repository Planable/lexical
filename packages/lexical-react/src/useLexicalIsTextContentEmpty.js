'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalIsTextContentEmpty = void 0;
var text_1 = require('@lexical/text');
var react_1 = require('react');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function useLexicalIsTextContentEmpty(editor, trim) {
  var _a = (0, react_1.useState)(
      editor
        .getEditorState()
        .read(
          (0, text_1.$isRootTextContentEmptyCurry)(editor.isComposing(), trim),
        ),
    ),
    isEmpty = _a[0],
    setIsEmpty = _a[1];
  (0, useLayoutEffect_1['default'])(
    function () {
      return editor.registerUpdateListener(function (_a) {
        var editorState = _a.editorState;
        var isComposing = editor.isComposing();
        var currentIsEmpty = editorState.read(
          (0, text_1.$isRootTextContentEmptyCurry)(isComposing, trim),
        );
        setIsEmpty(currentIsEmpty);
      });
    },
    [editor, trim],
  );
  return isEmpty;
}
exports.useLexicalIsTextContentEmpty = useLexicalIsTextContentEmpty;
