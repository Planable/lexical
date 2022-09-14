'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalEditor = void 0;
var react_1 = require('react');
var DEPRECATED_useLexicalCanShowPlaceholder_1 = require('./DEPRECATED_useLexicalCanShowPlaceholder');
function useLexicalEditor(editor) {
  var showPlaceholder = (0,
  DEPRECATED_useLexicalCanShowPlaceholder_1.useLexicalCanShowPlaceholder)(
    editor,
  );
  var rootElementRef = (0, react_1.useCallback)(
    function (rootElement) {
      editor.setRootElement(rootElement);
    },
    [editor],
  );
  return [rootElementRef, showPlaceholder];
}
exports.useLexicalEditor = useLexicalEditor;
