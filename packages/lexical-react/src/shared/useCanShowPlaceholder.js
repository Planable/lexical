'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useCanShowPlaceholder = void 0;
var text_1 = require('@lexical/text');
var utils_1 = require('@lexical/utils');
var react_1 = require('react');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function canShowPlaceholderFromCurrentEditorState(editor) {
  var currentCanShowPlaceholder = editor
    .getEditorState()
    .read(
      (0, text_1.$canShowPlaceholderCurry)(
        editor.isComposing(),
        editor.isEditable(),
      ),
    );
  return currentCanShowPlaceholder;
}
function useCanShowPlaceholder(editor) {
  var _a = (0, react_1.useState)(function () {
      return canShowPlaceholderFromCurrentEditorState(editor);
    }),
    canShowPlaceholder = _a[0],
    setCanShowPlaceholder = _a[1];
  (0, useLayoutEffect_1['default'])(
    function () {
      function resetCanShowPlaceholder() {
        var currentCanShowPlaceholder =
          canShowPlaceholderFromCurrentEditorState(editor);
        setCanShowPlaceholder(currentCanShowPlaceholder);
      }
      resetCanShowPlaceholder();
      return (0, utils_1.mergeRegister)(
        editor.registerUpdateListener(function () {
          resetCanShowPlaceholder();
        }),
        editor.registerEditableListener(function () {
          resetCanShowPlaceholder();
        }),
      );
    },
    [editor],
  );
  return canShowPlaceholder;
}
exports.useCanShowPlaceholder = useCanShowPlaceholder;
