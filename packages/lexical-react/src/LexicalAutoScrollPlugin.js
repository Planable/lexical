'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.AutoScrollPlugin = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var lexical_1 = require('lexical');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function AutoScrollPlugin(_a) {
  var scrollRef = _a.scrollRef;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, useLayoutEffect_1['default'])(
    function () {
      return editor.registerUpdateListener(function (_a) {
        var tags = _a.tags,
          editorState = _a.editorState;
        var scrollElement = scrollRef.current;
        if (scrollElement === null || !tags.has('scroll-into-view')) {
          return;
        }
        var selection = editorState.read(function () {
          return (0, lexical_1.$getSelection)();
        });
        if (
          !(0, lexical_1.$isRangeSelection)(selection) ||
          !selection.isCollapsed()
        ) {
          return;
        }
        var anchorElement = editor.getElementByKey(selection.anchor.key);
        if (anchorElement === null) {
          return;
        }
        var scrollRect = scrollElement.getBoundingClientRect();
        var rect = anchorElement.getBoundingClientRect();
        if (rect.bottom > scrollRect.bottom) {
          anchorElement.scrollIntoView(false);
        } else if (rect.top < scrollRect.top) {
          anchorElement.scrollIntoView();
        }
      });
    },
    [editor, scrollRef],
  );
  return null;
}
exports.AutoScrollPlugin = AutoScrollPlugin;
