'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.LexicalComposer = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var lexical_1 = require('lexical');
var react_1 = require('react');
var React = require('react');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
var HISTORY_MERGE_OPTIONS = {tag: 'history-merge'};
function LexicalComposer(_a) {
  var initialConfig = _a.initialConfig,
    children = _a.children;
  var composerContext = (0, react_1.useMemo)(
    function () {
      var theme = initialConfig.theme,
        namespace = initialConfig.namespace,
        initialEditor = initialConfig.editor__DEPRECATED,
        nodes = initialConfig.nodes,
        onError = initialConfig.onError,
        initialEditorState = initialConfig.editorState;
      var context = (0, LexicalComposerContext_1.createLexicalComposerContext)(
        null,
        theme,
      );
      var editor = initialEditor || null;
      if (editor === null) {
        var newEditor_1 = (0, lexical_1.createEditor)({
          editable: false,
          namespace: namespace,
          nodes: nodes,
          onError: function (error) {
            return onError(error, newEditor_1);
          },
          theme: theme,
        });
        initializeEditor(newEditor_1, initialEditorState);
        editor = newEditor_1;
      }
      return [editor, context];
    },
    // We only do this for init
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  (0, useLayoutEffect_1['default'])(function () {
    var isEditable = initialConfig.editable;
    var editor = composerContext[0];
    editor.setEditable(isEditable !== undefined ? isEditable : true);
    // We only do this for init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <LexicalComposerContext_1.LexicalComposerContext.Provider
      value={composerContext}>
      {children}
    </LexicalComposerContext_1.LexicalComposerContext.Provider>
  );
}
exports.LexicalComposer = LexicalComposer;
function initializeEditor(editor, initialEditorState) {
  if (initialEditorState === null) {
    return;
  } else if (initialEditorState === undefined) {
    // TODO Uncomment in 0.4
    // editor.update(() => {
    //   const root = $getRoot();
    //   if (root.isEmpty()) {
    //     const paragraph = $createParagraphNode();
    //     root.append(paragraph);
    //     const activeElement = document.activeElement;
    //     if (
    //       $getSelection() !== null ||
    //       (activeElement !== null && activeElement === editor.getRootElement())
    //     ) {
    //       paragraph.select();
    //     }
    //   }
    // }, HISTORY_MERGE_OPTIONS);
  } else if (initialEditorState !== null) {
    switch (typeof initialEditorState) {
      case 'string': {
        var parsedEditorState = editor.parseEditorState(initialEditorState);
        editor.setEditorState(parsedEditorState, HISTORY_MERGE_OPTIONS);
        break;
      }
      case 'object': {
        editor.setEditorState(initialEditorState, HISTORY_MERGE_OPTIONS);
        break;
      }
      case 'function': {
        editor.update(function () {
          var root = (0, lexical_1.$getRoot)();
          if (root.isEmpty()) {
            initialEditorState(editor);
          }
        }, HISTORY_MERGE_OPTIONS);
        break;
      }
    }
  }
}
