'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.LexicalNestedComposer = void 0;
var LexicalCollaborationContext_1 = require('@lexical/react/LexicalCollaborationContext');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var React = require('react');
var react_1 = require('react');
var invariant_1 = require('shared/invariant');
function LexicalNestedComposer(_a) {
  var initialEditor = _a.initialEditor,
    children = _a.children,
    initialNodes = _a.initialNodes,
    initialTheme = _a.initialTheme,
    skipCollabChecks = _a.skipCollabChecks;
  var wasCollabPreviouslyReadyRef = (0, react_1.useRef)(false);
  var parentContext = (0, react_1.useContext)(
    LexicalComposerContext_1.LexicalComposerContext,
  );
  if (parentContext == null) {
    (0, invariant_1['default'])(
      false,
      'Unexpected parent context null on a nested composer',
    );
  }
  var composerContext = (0, react_1.useMemo)(
    function () {
      var parentEditor = parentContext[0],
        parentContextContext = parentContext[1];
      var composerTheme =
        initialTheme || parentContextContext.getTheme() || undefined;
      var context = (0, LexicalComposerContext_1.createLexicalComposerContext)(
        parentContext,
        composerTheme,
      );
      if (composerTheme !== undefined) {
        initialEditor._config.theme = composerTheme;
      }
      initialEditor._parentEditor = parentEditor;
      if (!initialNodes) {
        var parentNodes = (initialEditor._nodes = new Map(parentEditor._nodes));
        for (
          var _i = 0, parentNodes_1 = parentNodes;
          _i < parentNodes_1.length;
          _i++
        ) {
          var _a = parentNodes_1[_i],
            type = _a[0],
            entry = _a[1];
          initialEditor._nodes.set(type, {
            klass: entry.klass,
            transforms: new Set(),
          });
        }
      } else {
        for (
          var _b = 0, initialNodes_1 = initialNodes;
          _b < initialNodes_1.length;
          _b++
        ) {
          var klass = initialNodes_1[_b];
          var type = klass.getType();
          initialEditor._nodes.set(type, {
            klass: klass,
            transforms: new Set(),
          });
        }
      }
      initialEditor._config.namespace = parentEditor._config.namespace;
      return [initialEditor, context];
    },
    // We only do this for init
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // If collaboration is enabled, make sure we don't render the children
  // until the collaboration subdocument is ready.
  var _b = (0, LexicalCollaborationContext_1.useCollaborationContext)(),
    isCollabActive = _b.isCollabActive,
    yjsDocMap = _b.yjsDocMap;
  var isCollabReady =
    skipCollabChecks ||
    wasCollabPreviouslyReadyRef.current ||
    yjsDocMap.has(initialEditor.getKey());
  (0, react_1.useEffect)(
    function () {
      if (isCollabReady) {
        wasCollabPreviouslyReadyRef.current = true;
      }
    },
    [isCollabReady],
  );
  return (
    <LexicalComposerContext_1.LexicalComposerContext.Provider
      value={composerContext}>
      {!isCollabActive || isCollabReady ? children : null}
    </LexicalComposerContext_1.LexicalComposerContext.Provider>
  );
}
exports.LexicalNestedComposer = LexicalNestedComposer;
