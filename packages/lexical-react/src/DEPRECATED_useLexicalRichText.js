'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalRichText = void 0;
var DEPRECATED_useLexicalHistory_1 = require('./DEPRECATED_useLexicalHistory');
var useRichTextSetup_1 = require('./shared/useRichTextSetup');
function useLexicalRichText(editor, externalHistoryState, initialEditorState) {
  (0, useRichTextSetup_1.useRichTextSetup)(editor, initialEditorState);
  (0, DEPRECATED_useLexicalHistory_1.useLexicalHistory)(
    editor,
    externalHistoryState,
  );
}
exports.useLexicalRichText = useLexicalRichText;
