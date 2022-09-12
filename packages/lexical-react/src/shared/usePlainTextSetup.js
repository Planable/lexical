'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.usePlainTextSetup = void 0;
var dragon_1 = require('@lexical/dragon');
var plain_text_1 = require('@lexical/plain-text');
var utils_1 = require('@lexical/utils');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function usePlainTextSetup(editor, initialEditorState) {
  (0, useLayoutEffect_1['default'])(
    function () {
      return (0, utils_1.mergeRegister)(
        (0, plain_text_1.registerPlainText)(editor, initialEditorState),
        (0, dragon_1.registerDragonSupport)(editor),
      );
      // We only do this for init
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [editor],
  );
}
exports.usePlainTextSetup = usePlainTextSetup;
