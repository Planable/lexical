'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalTextEntity = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var text_1 = require('@lexical/text');
var utils_1 = require('@lexical/utils');
var react_1 = require('react');
function useLexicalTextEntity(getMatch, targetNode, createNode) {
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      return utils_1.mergeRegister.apply(
        void 0,
        (0, text_1.registerLexicalTextEntity)(
          editor,
          getMatch,
          targetNode,
          createNode,
        ),
      );
    },
    [createNode, editor, getMatch, targetNode],
  );
}
exports.useLexicalTextEntity = useLexicalTextEntity;
