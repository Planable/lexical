'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useRichTextSetup = void 0;
var dragon_1 = require('@lexical/dragon');
var rich_text_1 = require('@lexical/rich-text');
var utils_1 = require('@lexical/utils');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function useRichTextSetup(editor, initialEditorState) {
  (0, useLayoutEffect_1['default'])(
    function () {
      return (0, utils_1.mergeRegister)(
        (0, rich_text_1.registerRichText)(editor, initialEditorState),
        (0, dragon_1.registerDragonSupport)(editor),
      );
      // We only do this for init
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [editor],
  );
}
exports.useRichTextSetup = useRichTextSetup;
