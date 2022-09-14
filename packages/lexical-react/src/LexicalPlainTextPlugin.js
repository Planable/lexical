'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.PlainTextPlugin = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var React = require('react');
var warnOnlyOnce_1 = require('shared/warnOnlyOnce');
var useCanShowPlaceholder_1 = require('./shared/useCanShowPlaceholder');
var useDecorators_1 = require('./shared/useDecorators');
var usePlainTextSetup_1 = require('./shared/usePlainTextSetup');
var deprecatedInitialEditorStateWarning = (0, warnOnlyOnce_1['default'])(
  '`initialEditorState` on `PlainTextPlugin` is deprecated and will be removed soon. Use the `initialConfig.editorState` prop on the `LexicalComposer` instead.',
);
function PlainTextPlugin(_a) {
  var contentEditable = _a.contentEditable,
    placeholder = _a.placeholder,
    initialEditorState = _a.initialEditorState;
  if (
    __DEV__ &&
    deprecatedInitialEditorStateWarning &&
    initialEditorState !== undefined
  ) {
    deprecatedInitialEditorStateWarning();
  }
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var showPlaceholder = (0, useCanShowPlaceholder_1.useCanShowPlaceholder)(
    editor,
  );
  var decorators = (0, useDecorators_1.useDecorators)(editor);
  (0, usePlainTextSetup_1.usePlainTextSetup)(editor, initialEditorState);
  return (
    <>
      {contentEditable}
      {showPlaceholder && placeholder}
      {decorators}
    </>
  );
}
exports.PlainTextPlugin = PlainTextPlugin;
