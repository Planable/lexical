'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.mergePrevious = exports.useCharacterLimit = void 0;
var overflow_1 = require('@lexical/overflow');
var text_1 = require('@lexical/text');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var react_1 = require('react');
var invariant_1 = require('shared/invariant');
function useCharacterLimit(editor, maxCharacters, optional) {
  if (optional === void 0) {
    optional = Object.freeze({});
  }
  var _a = optional.strlen,
    strlen =
      _a === void 0
        ? function (input) {
            return input.length;
          }
        : _a,
    // UTF-16
    _b = optional.remainingCharacters,
    // UTF-16
    remainingCharacters =
      _b === void 0
        ? function () {
            return;
          }
        : _b;
  (0, react_1.useEffect)(
    function () {
      if (!editor.hasNodes([overflow_1.OverflowNode])) {
        (0, invariant_1['default'])(
          false,
          'useCharacterLimit: OverflowNode not registered on editor',
        );
      }
    },
    [editor],
  );
  (0, react_1.useEffect)(
    function () {
      var text = editor.getEditorState().read(text_1.$rootTextContent);
      var lastComputedTextLength = 0;
      return (0, utils_1.mergeRegister)(
        editor.registerTextContentListener(function (currentText) {
          text = currentText;
        }),
        editor.registerUpdateListener(function (_a) {
          var dirtyLeaves = _a.dirtyLeaves;
          var isComposing = editor.isComposing();
          var hasDirtyLeaves = dirtyLeaves.size > 0;
          if (isComposing || !hasDirtyLeaves) {
            return;
          }
          var textLength = strlen(text);
          var textLengthAboveThreshold =
            textLength > maxCharacters ||
            (lastComputedTextLength !== null &&
              lastComputedTextLength > maxCharacters);
          var diff = maxCharacters - textLength;
          remainingCharacters(diff);
          if (lastComputedTextLength === null || textLengthAboveThreshold) {
            var offset_1 = findOffset(text, maxCharacters, strlen);
            editor.update(
              function () {
                $wrapOverflowedNodes(offset_1);
              },
              {
                tag: 'history-merge',
              },
            );
          }
          lastComputedTextLength = textLength;
        }),
      );
    },
    [editor, maxCharacters, remainingCharacters, strlen],
  );
}
exports.useCharacterLimit = useCharacterLimit;
function findOffset(text, maxCharacters, strlen) {
  // @ts-ignore This is due to be added in a later version of TS
  var Segmenter = Intl.Segmenter;
  var offsetUtf16 = 0;
  var offset = 0;
  if (typeof Segmenter === 'function') {
    var segmenter = new Segmenter();
    var graphemes = segmenter.segment(text);
    for (var _i = 0, graphemes_1 = graphemes; _i < graphemes_1.length; _i++) {
      var grapheme = graphemes_1[_i].segment;
      var nextOffset = offset + strlen(grapheme);
      if (nextOffset > maxCharacters) {
        break;
      }
      offset = nextOffset;
      offsetUtf16 += grapheme.length;
    }
  } else {
    var codepoints = Array.from(text);
    var codepointsLength = codepoints.length;
    for (var i = 0; i < codepointsLength; i++) {
      var codepoint = codepoints[i];
      var nextOffset = offset + strlen(codepoint);
      if (nextOffset > maxCharacters) {
        break;
      }
      offset = nextOffset;
      offsetUtf16 += codepoint.length;
    }
  }
  return offsetUtf16;
}
function $wrapOverflowedNodes(offset) {
  var dfsNodes = (0, utils_1.$dfs)();
  var dfsNodesLength = dfsNodes.length;
  var accumulatedLength = 0;
  for (var i = 0; i < dfsNodesLength; i += 1) {
    var node = dfsNodes[i].node;
    if ((0, overflow_1.$isOverflowNode)(node)) {
      var previousLength = accumulatedLength;
      var nextLength = accumulatedLength + node.getTextContentSize();
      if (nextLength <= offset) {
        var parent_1 = node.getParent();
        var previousSibling = node.getPreviousSibling();
        var nextSibling = node.getNextSibling();
        $unwrapNode(node);
        var selection = (0, lexical_1.$getSelection)();
        // Restore selection when the overflow children are removed
        if (
          (0, lexical_1.$isRangeSelection)(selection) &&
          (!selection.anchor.getNode().isAttached() ||
            !selection.focus.getNode().isAttached())
        ) {
          if ((0, lexical_1.$isTextNode)(previousSibling)) {
            previousSibling.select();
          } else if ((0, lexical_1.$isTextNode)(nextSibling)) {
            nextSibling.select();
          } else if (parent_1 !== null) {
            parent_1.select();
          }
        }
      } else if (previousLength < offset) {
        var descendant = node.getFirstDescendant();
        var descendantLength =
          descendant !== null ? descendant.getTextContentSize() : 0;
        var previousPlusDescendantLength = previousLength + descendantLength;
        // For simple text we can redimension the overflow into a smaller and more accurate
        // container
        var firstDescendantIsSimpleText =
          (0, lexical_1.$isTextNode)(descendant) && descendant.isSimpleText();
        var firstDescendantDoesNotOverflow =
          previousPlusDescendantLength <= offset;
        if (firstDescendantIsSimpleText || firstDescendantDoesNotOverflow) {
          $unwrapNode(node);
        }
      }
    } else if ((0, lexical_1.$isLeafNode)(node)) {
      var previousAccumulatedLength = accumulatedLength;
      accumulatedLength += node.getTextContentSize();
      if (
        accumulatedLength > offset &&
        !(0, overflow_1.$isOverflowNode)(node.getParent())
      ) {
        var previousSelection = (0, lexical_1.$getSelection)();
        var overflowNode = void 0;
        // For simple text we can improve the limit accuracy by splitting the TextNode
        // on the split point
        if (
          previousAccumulatedLength < offset &&
          (0, lexical_1.$isTextNode)(node) &&
          node.isSimpleText()
        ) {
          var _a = node.splitText(offset - previousAccumulatedLength),
            overflowedText = _a[1];
          overflowNode = $wrapNode(overflowedText);
        } else {
          overflowNode = $wrapNode(node);
        }
        if (previousSelection !== null) {
          (0, lexical_1.$setSelection)(previousSelection);
        }
        mergePrevious(overflowNode);
      }
    }
  }
}
function $wrapNode(node) {
  var overflowNode = (0, overflow_1.$createOverflowNode)();
  node.insertBefore(overflowNode);
  overflowNode.append(node);
  return overflowNode;
}
function $unwrapNode(node) {
  var children = node.getChildren();
  var childrenLength = children.length;
  for (var i = 0; i < childrenLength; i++) {
    node.insertBefore(children[i]);
  }
  node.remove();
  return childrenLength > 0 ? children[childrenLength - 1] : null;
}
function mergePrevious(overflowNode) {
  var previousNode = overflowNode.getPreviousSibling();
  if (!(0, overflow_1.$isOverflowNode)(previousNode)) {
    return;
  }
  var firstChild = overflowNode.getFirstChild();
  var previousNodeChildren = previousNode.getChildren();
  var previousNodeChildrenLength = previousNodeChildren.length;
  if (firstChild === null) {
    overflowNode.append.apply(overflowNode, previousNodeChildren);
  } else {
    for (var i = 0; i < previousNodeChildrenLength; i++) {
      firstChild.insertBefore(previousNodeChildren[i]);
    }
  }
  var selection = (0, lexical_1.$getSelection)();
  if ((0, lexical_1.$isRangeSelection)(selection)) {
    var anchor = selection.anchor;
    var anchorNode = anchor.getNode();
    var focus_1 = selection.focus;
    var focusNode = anchor.getNode();
    if (anchorNode.is(previousNode)) {
      anchor.set(overflowNode.getKey(), anchor.offset, 'element');
    } else if (anchorNode.is(overflowNode)) {
      anchor.set(
        overflowNode.getKey(),
        previousNodeChildrenLength + anchor.offset,
        'element',
      );
    }
    if (focusNode.is(previousNode)) {
      focus_1.set(overflowNode.getKey(), focus_1.offset, 'element');
    } else if (focusNode.is(overflowNode)) {
      focus_1.set(
        overflowNode.getKey(),
        previousNodeChildrenLength + focus_1.offset,
        'element',
      );
    }
  }
  previousNode.remove();
}
exports.mergePrevious = mergePrevious;
