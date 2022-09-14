'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalAutoFormatter = void 0;
var markdown_1 = require('@lexical/markdown');
var react_1 = require('react');
function useLexicalAutoFormatter(editor) {
  (0, react_1.useEffect)(
    function () {
      return (0, markdown_1.registerMarkdownShortcuts)(
        editor,
        markdown_1.TRANSFORMERS,
      );
    },
    [editor],
  );
}
exports.useLexicalAutoFormatter = useLexicalAutoFormatter;
