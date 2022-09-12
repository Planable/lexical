'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalPlainText = void 0;
var DEPRECATED_useLexicalHistory_1 = require('./DEPRECATED_useLexicalHistory');
var usePlainTextSetup_1 = require('./shared/usePlainTextSetup');
function useLexicalPlainText(editor, externalHistoryState, initialEditorState) {
  (0, usePlainTextSetup_1.usePlainTextSetup)(editor, initialEditorState);
  (0, DEPRECATED_useLexicalHistory_1.useLexicalHistory)(
    editor,
    externalHistoryState,
  );
}
exports.useLexicalPlainText = useLexicalPlainText;
