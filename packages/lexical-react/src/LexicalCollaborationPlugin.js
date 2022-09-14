'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.CollaborationPlugin = void 0;
var LexicalCollaborationContext_1 = require('@lexical/react/LexicalCollaborationContext');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var react_1 = require('react');
var useYjsCollaboration_1 = require('./shared/useYjsCollaboration');
function CollaborationPlugin(_a) {
  var id = _a.id,
    providerFactory = _a.providerFactory,
    shouldBootstrap = _a.shouldBootstrap,
    username = _a.username,
    initialEditorState = _a.initialEditorState;
  var collabContext = (0,
  LexicalCollaborationContext_1.useCollaborationContext)(username);
  var yjsDocMap = collabContext.yjsDocMap,
    name = collabContext.name,
    color = collabContext.color;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(
    function () {
      collabContext.isCollabActive = true;
      return function () {
        // Reseting flag only when unmount top level editor collab plugin. Nested
        // editors (e.g. image caption) should unmount without affecting it
        if (editor._parentEditor == null) {
          collabContext.isCollabActive = false;
        }
      };
    },
    [collabContext, editor],
  );
  var provider = (0, react_1.useMemo)(
    function () {
      return providerFactory(id, yjsDocMap);
    },
    [id, providerFactory, yjsDocMap],
  );
  var _b = (0, useYjsCollaboration_1.useYjsCollaboration)(
      editor,
      id,
      provider,
      yjsDocMap,
      name,
      color,
      shouldBootstrap,
      initialEditorState,
    ),
    cursors = _b[0],
    binding = _b[1];
  collabContext.clientID = binding.clientID;
  (0, useYjsCollaboration_1.useYjsHistory)(editor, binding);
  (0, useYjsCollaboration_1.useYjsFocusTracking)(editor, provider, name, color);
  return cursors;
}
exports.CollaborationPlugin = CollaborationPlugin;
