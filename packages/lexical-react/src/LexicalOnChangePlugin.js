'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.OnChangePlugin = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function OnChangePlugin(_a) {
  var // TODO 0.5 flip to true
    _b = _a.ignoreHistoryMergeTagChange,
    // TODO 0.5 flip to true
    ignoreHistoryMergeTagChange = _b === void 0 ? false : _b,
    _c = _a.ignoreInitialChange,
    ignoreInitialChange = _c === void 0 ? true : _c,
    _d = _a.ignoreSelectionChange,
    ignoreSelectionChange = _d === void 0 ? false : _d,
    onChange = _a.onChange;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, useLayoutEffect_1['default'])(
    function () {
      if (onChange) {
        return editor.registerUpdateListener(function (_a) {
          var editorState = _a.editorState,
            dirtyElements = _a.dirtyElements,
            dirtyLeaves = _a.dirtyLeaves,
            prevEditorState = _a.prevEditorState,
            tags = _a.tags;
          if (
            (ignoreSelectionChange &&
              dirtyElements.size === 0 &&
              dirtyLeaves.size === 0) ||
            (ignoreHistoryMergeTagChange && tags.has('history-merge'))
          ) {
            return;
          }
          if (ignoreInitialChange && prevEditorState.isEmpty()) {
            return;
          }
          onChange(editorState, editor);
        });
      }
    },
    [
      editor,
      ignoreHistoryMergeTagChange,
      ignoreInitialChange,
      ignoreSelectionChange,
      onChange,
    ],
  );
  return null;
}
exports.OnChangePlugin = OnChangePlugin;
