'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalEditorEvents = void 0;
var useEditorEvents_1 = require('./shared/useEditorEvents');
function useLexicalEditorEvents(events, editor) {
  (0, useEditorEvents_1.useEditorEvents)(events, editor);
}
exports.useLexicalEditorEvents = useLexicalEditorEvents;
