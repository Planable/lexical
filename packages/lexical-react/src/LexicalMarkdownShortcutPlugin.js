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
exports.MarkdownShortcutPlugin = exports.DEFAULT_TRANSFORMERS = void 0;
var markdown_1 = require('@lexical/markdown');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var LexicalHorizontalRuleNode_1 = require('@lexical/react/LexicalHorizontalRuleNode');
var react_1 = require('react');
var HR = {
  dependencies: [LexicalHorizontalRuleNode_1.HorizontalRuleNode],
  export: function (node) {
    return (0, LexicalHorizontalRuleNode_1.$isHorizontalRuleNode)(node)
      ? '***'
      : null;
  },
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: function (parentNode, _1, _2, isImport) {
    var line = (0, LexicalHorizontalRuleNode_1.$createHorizontalRuleNode)();
    // TODO: Get rid of isImport flag
    if (isImport || parentNode.getNextSibling() != null) {
      parentNode.replace(line);
    } else {
      parentNode.insertBefore(line);
    }
    line.selectNext();
  },
  type: 'element',
};
exports.DEFAULT_TRANSFORMERS = __spreadArray(
  [HR],
  markdown_1.TRANSFORMERS,
  true,
);
function MarkdownShortcutPlugin(_a) {
  var _b = _a.transformers,
    transformers = _b === void 0 ? exports.DEFAULT_TRANSFORMERS : _b;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      return (0, markdown_1.registerMarkdownShortcuts)(editor, transformers);
    },
    [editor, transformers],
  );
  return null;
}
exports.MarkdownShortcutPlugin = MarkdownShortcutPlugin;
