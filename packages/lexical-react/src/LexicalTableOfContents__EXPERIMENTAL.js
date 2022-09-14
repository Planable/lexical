'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
exports.__esModule = true;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var rich_text_1 = require('@lexical/rich-text');
var lexical_1 = require('lexical');
var react_1 = require('react');
function $insertHeadingIntoTableOfContents(
  prevHeading,
  newHeading,
  currentTableOfContents,
) {
  if (newHeading === null) {
    return currentTableOfContents;
  }
  var newEntry = [
    newHeading.getKey(),
    newHeading.getTextContent(),
    newHeading.getTag(),
  ];
  var newTableOfContents = [];
  if (prevHeading === null) {
    newTableOfContents = __spreadArray(
      [newEntry],
      currentTableOfContents,
      true,
    );
  } else {
    for (var i = 0; i < currentTableOfContents.length; i++) {
      var key = currentTableOfContents[i][0];
      newTableOfContents.push(currentTableOfContents[i]);
      if (key === prevHeading.getKey() && key !== newHeading.getKey()) {
        newTableOfContents.push(newEntry);
      }
    }
  }
  return newTableOfContents;
}
function $deleteHeadingFromTableOfContents(key, currentTableOfContents) {
  var newTableOfContents = [];
  for (
    var _i = 0, currentTableOfContents_1 = currentTableOfContents;
    _i < currentTableOfContents_1.length;
    _i++
  ) {
    var heading = currentTableOfContents_1[_i];
    if (heading[0] !== key) {
      newTableOfContents.push(heading);
    }
  }
  return newTableOfContents;
}
function $updateHeadingInTableOfContents(heading, currentTableOfContents) {
  var newTextContent = heading.getTextContent();
  var newTableOfContents = [];
  for (
    var _i = 0, currentTableOfContents_2 = currentTableOfContents;
    _i < currentTableOfContents_2.length;
    _i++
  ) {
    var oldHeading = currentTableOfContents_2[_i];
    if (oldHeading[0] === heading.getKey()) {
      newTableOfContents.push([
        heading.getKey(),
        newTextContent,
        heading.getTag(),
      ]);
    } else {
      newTableOfContents.push(oldHeading);
    }
  }
  return newTableOfContents;
}
function LexicalTableOfContentsPlugin(_a) {
  var children = _a.children;
  var _b = (0, react_1.useState)([]),
    tableOfContents = _b[0],
    setTableOfContents = _b[1];
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      // Set table of contents initial state
      var currentTableOfContents = [];
      editor.getEditorState().read(function () {
        var root = (0, lexical_1.$getRoot)();
        var rootChildren = root.getChildren();
        for (
          var _i = 0, rootChildren_1 = rootChildren;
          _i < rootChildren_1.length;
          _i++
        ) {
          var child = rootChildren_1[_i];
          if ((0, rich_text_1.$isHeadingNode)(child)) {
            currentTableOfContents.push([
              child.getKey(),
              child.getTextContent(),
              child.getTag(),
            ]);
          }
        }
        setTableOfContents(currentTableOfContents);
      });
      // Listen to updates to heading mutations and update state
      var removeHeaderMutationListener = editor.registerMutationListener(
        rich_text_1.HeadingNode,
        function (mutatedNodes) {
          editor.getEditorState().read(function () {
            for (
              var _i = 0, mutatedNodes_1 = mutatedNodes;
              _i < mutatedNodes_1.length;
              _i++
            ) {
              var _a = mutatedNodes_1[_i],
                nodeKey = _a[0],
                mutation = _a[1];
              if (mutation === 'created') {
                var newHeading = (0, lexical_1.$getNodeByKey)(nodeKey);
                if (newHeading !== null) {
                  var prevHeading = newHeading.getPreviousSibling();
                  while (
                    prevHeading &&
                    !(0, rich_text_1.$isHeadingNode)(prevHeading)
                  ) {
                    prevHeading = prevHeading.getPreviousSibling();
                  }
                  currentTableOfContents = $insertHeadingIntoTableOfContents(
                    prevHeading,
                    newHeading,
                    currentTableOfContents,
                  );
                  setTableOfContents(currentTableOfContents);
                }
              } else if (mutation === 'destroyed') {
                currentTableOfContents = $deleteHeadingFromTableOfContents(
                  nodeKey,
                  currentTableOfContents,
                );
                setTableOfContents(currentTableOfContents);
              }
            }
          });
        },
      );
      // Listen to text node mutation updates
      var removeTextNodeMutationListener = editor.registerMutationListener(
        lexical_1.TextNode,
        function (mutatedNodes) {
          editor.getEditorState().read(function () {
            for (
              var _i = 0, mutatedNodes_2 = mutatedNodes;
              _i < mutatedNodes_2.length;
              _i++
            ) {
              var _a = mutatedNodes_2[_i],
                nodeKey = _a[0],
                mutation = _a[1];
              if (mutation === 'updated') {
                var currNode = (0, lexical_1.$getNodeByKey)(nodeKey);
                if (currNode !== null) {
                  var parentNode = currNode.getParentOrThrow();
                  if ((0, rich_text_1.$isHeadingNode)(parentNode)) {
                    currentTableOfContents = $updateHeadingInTableOfContents(
                      parentNode,
                      currentTableOfContents,
                    );
                    setTableOfContents(currentTableOfContents);
                  }
                }
              }
            }
          });
        },
      );
      return function () {
        removeHeaderMutationListener();
        removeTextNodeMutationListener();
      };
    },
    [editor],
  );
  return children(tableOfContents, editor);
}
exports['default'] = LexicalTableOfContentsPlugin;
