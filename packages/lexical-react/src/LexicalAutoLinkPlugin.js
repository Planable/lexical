'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.AutoLinkPlugin = void 0;
var link_1 = require('@lexical/link');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var react_1 = require('react');
var invariant_1 = require('shared/invariant');
function findFirstMatch(text, matchers) {
  for (var i = 0; i < matchers.length; i++) {
    var match = matchers[i](text);
    if (match) {
      return match;
    }
  }
  return null;
}
function isPreviousNodeValid(node) {
  var previousNode = node.getPreviousSibling();
  if ((0, lexical_1.$isElementNode)(previousNode)) {
    previousNode = previousNode.getLastDescendant();
  }
  return (
    previousNode === null ||
    (0, lexical_1.$isLineBreakNode)(previousNode) ||
    ((0, lexical_1.$isTextNode)(previousNode) &&
      previousNode.getTextContent().endsWith(' '))
  );
}
function isNextNodeValid(node) {
  var nextNode = node.getNextSibling();
  if ((0, lexical_1.$isElementNode)(nextNode)) {
    nextNode = nextNode.getFirstDescendant();
  }
  return (
    nextNode === null ||
    (0, lexical_1.$isLineBreakNode)(nextNode) ||
    ((0, lexical_1.$isTextNode)(nextNode) &&
      nextNode.getTextContent().startsWith(' '))
  );
}
function handleLinkCreation(node, matchers, onChange) {
  var _a, _b;
  var nodeText = node.getTextContent();
  var nodeTextLength = nodeText.length;
  var text = nodeText;
  var textOffset = 0;
  var lastNode = node;
  var match;
  while ((match = findFirstMatch(text, matchers)) && match !== null) {
    var matchOffset = match.index;
    var offset = textOffset + matchOffset;
    var matchLength = match.length;
    // Previous node is valid if any of:
    // 1. Space before same node
    // 2. Space in previous simple text node
    // 3. Previous node is LineBreakNode
    var contentBeforeMatchIsValid = void 0;
    if (offset > 0) {
      contentBeforeMatchIsValid = nodeText[offset - 1] === ' ';
    } else {
      contentBeforeMatchIsValid = isPreviousNodeValid(node);
    }
    // Next node is valid if any of:
    // 1. Space after same node
    // 2. Space in next simple text node
    // 3. Next node is LineBreakNode
    var contentAfterMatchIsValid = void 0;
    if (offset + matchLength < nodeTextLength) {
      contentAfterMatchIsValid = nodeText[offset + matchLength] === ' ';
    } else {
      contentAfterMatchIsValid = isNextNodeValid(node);
    }
    if (contentBeforeMatchIsValid && contentAfterMatchIsValid) {
      var middleNode = void 0;
      if (matchOffset === 0) {
        (_a = lastNode.splitText(matchLength)),
          (middleNode = _a[0]),
          (lastNode = _a[1]);
      } else {
        (_b = lastNode.splitText(matchOffset, matchOffset + matchLength)),
          (middleNode = _b[1]),
          (lastNode = _b[2]);
      }
      var nodeFormat = node.__format;
      var linkNode = (0, link_1.$createAutoLinkNode)(match.url);
      linkNode.append(
        (0, lexical_1.$createTextNode)(match.text).setFormat(nodeFormat),
      );
      middleNode.replace(linkNode);
      onChange(match.url, null);
    }
    var iterationOffset = matchOffset + matchLength;
    text = text.substring(iterationOffset);
    textOffset += iterationOffset;
  }
}
function handleLinkEdit(linkNode, matchers, onChange) {
  // Check children are simple text
  var children = linkNode.getChildren();
  var childrenLength = children.length;
  for (var i = 0; i < childrenLength; i++) {
    var child = children[i];
    if (!(0, lexical_1.$isTextNode)(child) || !child.isSimpleText()) {
      replaceWithChildren(linkNode);
      onChange(null, linkNode.getURL());
      return;
    }
  }
  // Check text content fully matches
  var text = linkNode.getTextContent();
  var match = findFirstMatch(text, matchers);
  if (match === null || match.text !== text) {
    replaceWithChildren(linkNode);
    onChange(null, linkNode.getURL());
    return;
  }
  // Check neighbors
  if (!isPreviousNodeValid(linkNode) || !isNextNodeValid(linkNode)) {
    replaceWithChildren(linkNode);
    onChange(null, linkNode.getURL());
    return;
  }
  var url = linkNode.getURL();
  if (match !== null && url !== match.url) {
    linkNode.setURL(match.url);
    onChange(match.url, url);
  }
}
// Bad neighbours are edits in neighbor nodes that make AutoLinks incompatible.
// Given the creation preconditions, these can only be simple text nodes.
function handleBadNeighbors(textNode, onChange) {
  var previousSibling = textNode.getPreviousSibling();
  var nextSibling = textNode.getNextSibling();
  var text = textNode.getTextContent();
  if ((0, link_1.$isAutoLinkNode)(previousSibling) && !text.startsWith(' ')) {
    replaceWithChildren(previousSibling);
    onChange(null, previousSibling.getURL());
  }
  if ((0, link_1.$isAutoLinkNode)(nextSibling) && !text.endsWith(' ')) {
    replaceWithChildren(nextSibling);
    onChange(null, nextSibling.getURL());
  }
}
function replaceWithChildren(node) {
  var children = node.getChildren();
  var childrenLength = children.length;
  for (var j = childrenLength - 1; j >= 0; j--) {
    node.insertAfter(children[j]);
  }
  node.remove();
  return children.map(function (child) {
    return child.getLatest();
  });
}
function useAutoLink(editor, matchers, onChange) {
  (0, react_1.useEffect)(
    function () {
      if (!editor.hasNodes([link_1.AutoLinkNode])) {
        (0, invariant_1['default'])(
          false,
          'LexicalAutoLinkPlugin: AutoLinkNode not registered on editor',
        );
      }
      var onChangeWrapped = function (url, prevUrl) {
        if (onChange) {
          onChange(url, prevUrl);
        }
      };
      return (0, utils_1.mergeRegister)(
        editor.registerNodeTransform(lexical_1.TextNode, function (textNode) {
          var parent = textNode.getParentOrThrow();
          if ((0, link_1.$isAutoLinkNode)(parent)) {
            handleLinkEdit(parent, matchers, onChangeWrapped);
          } else if (!(0, link_1.$isLinkNode)(parent)) {
            if (textNode.isSimpleText()) {
              handleLinkCreation(textNode, matchers, onChangeWrapped);
            }
            handleBadNeighbors(textNode, onChangeWrapped);
          }
        }),
        editor.registerNodeTransform(link_1.AutoLinkNode, function (linkNode) {
          handleLinkEdit(linkNode, matchers, onChangeWrapped);
        }),
      );
    },
    [editor, matchers, onChange],
  );
}
function AutoLinkPlugin(_a) {
  var matchers = _a.matchers,
    onChange = _a.onChange;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  useAutoLink(editor, matchers, onChange);
  return null;
}
exports.AutoLinkPlugin = AutoLinkPlugin;
