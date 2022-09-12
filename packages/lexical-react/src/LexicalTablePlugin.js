'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.TablePlugin = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var table_1 = require('@lexical/table');
var lexical_1 = require('lexical');
var react_1 = require('react');
var invariant_1 = require('shared/invariant');
function TablePlugin() {
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      if (
        !editor.hasNodes([
          table_1.TableNode,
          table_1.TableCellNode,
          table_1.TableRowNode,
        ])
      ) {
        (0, invariant_1['default'])(
          false,
          'TablePlugin: TableNode, TableCellNode or TableRowNode not registered on editor',
        );
      }
      return editor.registerCommand(
        table_1.INSERT_TABLE_COMMAND,
        function (_a) {
          var columns = _a.columns,
            rows = _a.rows,
            includeHeaders = _a.includeHeaders;
          var selection = (0, lexical_1.$getSelection)();
          if (!(0, lexical_1.$isRangeSelection)(selection)) {
            return true;
          }
          var focus = selection.focus;
          var focusNode = focus.getNode();
          if (focusNode !== null) {
            var tableNode = (0, table_1.$createTableNodeWithDimensions)(
              Number(rows),
              Number(columns),
              includeHeaders,
            );
            if ((0, lexical_1.$isRootNode)(focusNode)) {
              var target = focusNode.getChildAtIndex(focus.offset);
              if (target !== null) {
                target.insertBefore(tableNode);
              } else {
                focusNode.append(tableNode);
              }
              tableNode.insertBefore((0, lexical_1.$createParagraphNode)());
            } else {
              var topLevelNode = focusNode.getTopLevelElementOrThrow();
              topLevelNode.insertAfter(tableNode);
            }
            tableNode.insertAfter((0, lexical_1.$createParagraphNode)());
            var firstCell = tableNode
              .getFirstChildOrThrow()
              .getFirstChildOrThrow();
            firstCell.select();
          }
          return true;
        },
        lexical_1.COMMAND_PRIORITY_EDITOR,
      );
    },
    [editor],
  );
  (0, react_1.useEffect)(
    function () {
      var tableSelections = new Map();
      return editor.registerMutationListener(
        table_1.TableNode,
        function (nodeMutations) {
          var _loop_1 = function (nodeKey, mutation) {
            if (mutation === 'created') {
              editor.update(function () {
                var tableElement = editor.getElementByKey(nodeKey);
                var tableNode = (0, lexical_1.$getNodeByKey)(nodeKey);
                if (tableElement && tableNode) {
                  var tableSelection = (0, table_1.applyTableHandlers)(
                    tableNode,
                    tableElement,
                    editor,
                  );
                  tableSelections.set(nodeKey, tableSelection);
                }
              });
            } else if (mutation === 'destroyed') {
              var tableSelection = tableSelections.get(nodeKey);
              if (tableSelection !== undefined) {
                tableSelection.removeListeners();
                tableSelections['delete'](nodeKey);
              }
            }
          };
          for (
            var _i = 0, nodeMutations_1 = nodeMutations;
            _i < nodeMutations_1.length;
            _i++
          ) {
            var _a = nodeMutations_1[_i],
              nodeKey = _a[0],
              mutation = _a[1];
            _loop_1(nodeKey, mutation);
          }
        },
      );
    },
    [editor],
  );
  return null;
}
exports.TablePlugin = TablePlugin;
