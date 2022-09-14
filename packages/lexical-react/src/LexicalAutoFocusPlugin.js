'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.AutoFocusPlugin = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var react_1 = require('react');
function AutoFocusPlugin(_a) {
  var defaultSelection = _a.defaultSelection;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      editor.focus(
        function () {
          // If we try and move selection to the same point with setBaseAndExtent, it won't
          // trigger a re-focus on the element. So in the case this occurs, we'll need to correct it.
          // Normally this is fine, Selection API !== Focus API, but fore the intents of the naming
          // of this plugin, which should preserve focus too.
          var activeElement = document.activeElement;
          var rootElement = editor.getRootElement();
          if (
            !rootElement.contains(activeElement) ||
            rootElement !== null ||
            activeElement === null
          ) {
            // Note: preventScroll won't work in Webkit.
            rootElement.focus({preventScroll: true});
          }
        },
        {defaultSelection: defaultSelection},
      );
    },
    [defaultSelection, editor],
  );
  return null;
}
exports.AutoFocusPlugin = AutoFocusPlugin;
