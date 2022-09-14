'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.ListPlugin = void 0;
var list_1 = require('@lexical/list');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var react_1 = require('react');
var useList_1 = require('./shared/useList');
function ListPlugin() {
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      if (!editor.hasNodes([list_1.ListNode, list_1.ListItemNode])) {
        throw new Error(
          'ListPlugin: ListNode and/or ListItemNode not registered on editor',
        );
      }
    },
    [editor],
  );
  (0, useList_1.useList)(editor);
  return null;
}
exports.ListPlugin = ListPlugin;
