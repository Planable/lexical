'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexical = void 0;
var lexical_1 = require('lexical');
var react_1 = require('react');
var DEPRECATED_useLexicalEditor_1 = require('./DEPRECATED_useLexicalEditor');
function useLexical(editorConfig) {
  var editor = (0, react_1.useMemo)(
    function () {
      return (0, lexical_1.createEditor)(editorConfig);
    }, // Init
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  var _a = (0, DEPRECATED_useLexicalEditor_1.useLexicalEditor)(editor),
    rootElementRef = _a[0],
    showPlaceholder = _a[1];
  return [editor, rootElementRef, showPlaceholder];
}
exports.useLexical = useLexical;
