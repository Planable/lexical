'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useList = void 0;
var list_1 = require('@lexical/list');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var react_1 = require('react');
function useList(editor) {
  (0, react_1.useEffect)(
    function () {
      return (0, utils_1.mergeRegister)(
        editor.registerCommand(
          lexical_1.INDENT_CONTENT_COMMAND,
          function () {
            (0, list_1.indentList)();
            return false;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          lexical_1.OUTDENT_CONTENT_COMMAND,
          function () {
            (0, list_1.outdentList)();
            return false;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          list_1.INSERT_ORDERED_LIST_COMMAND,
          function () {
            (0, list_1.insertList)(editor, 'number');
            return true;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          list_1.INSERT_UNORDERED_LIST_COMMAND,
          function () {
            (0, list_1.insertList)(editor, 'bullet');
            return true;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          list_1.REMOVE_LIST_COMMAND,
          function () {
            (0, list_1.removeList)(editor);
            return true;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          lexical_1.INSERT_PARAGRAPH_COMMAND,
          function () {
            var hasHandledInsertParagraph = (0,
            list_1.$handleListInsertParagraph)();
            if (hasHandledInsertParagraph) {
              return true;
            }
            return false;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
      );
    },
    [editor],
  );
}
exports.useList = useList;
