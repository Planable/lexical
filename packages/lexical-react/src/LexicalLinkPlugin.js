'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.LinkPlugin = void 0;
var link_1 = require('@lexical/link');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var lexical_1 = require('lexical');
var react_1 = require('react');
function LinkPlugin() {
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      if (!editor.hasNodes([link_1.LinkNode])) {
        throw new Error('LinkPlugin: LinkNode not registered on editor');
      }
    },
    [editor],
  );
  (0, react_1.useEffect)(
    function () {
      return editor.registerCommand(
        link_1.TOGGLE_LINK_COMMAND,
        function (payload) {
          if (typeof payload === 'string' || payload === null) {
            (0, link_1.toggleLink)(payload);
          } else {
            var url = payload.url,
              target = payload.target,
              rel = payload.rel;
            (0, link_1.toggleLink)(url, {rel: rel, target: target});
          }
          return true;
        },
        lexical_1.COMMAND_PRIORITY_EDITOR,
      );
    },
    [editor],
  );
  return null;
}
exports.LinkPlugin = LinkPlugin;
