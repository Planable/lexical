'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useLexicalComposerContext =
  exports.createLexicalComposerContext =
  exports.LexicalComposerContext =
    void 0;
var react_1 = require('react');
var invariant_1 = require('shared/invariant');
exports.LexicalComposerContext = (0, react_1.createContext)(null);
function createLexicalComposerContext(parent, theme) {
  var parentContext = null;
  if (parent != null) {
    parentContext = parent[1];
  }
  function getTheme() {
    if (theme != null) {
      return theme;
    }
    return parentContext != null ? parentContext.getTheme() : null;
  }
  return {
    getTheme: getTheme,
  };
}
exports.createLexicalComposerContext = createLexicalComposerContext;
function useLexicalComposerContext() {
  var composerContext = (0, react_1.useContext)(exports.LexicalComposerContext);
  if (composerContext == null) {
    (0, invariant_1['default'])(
      false,
      'LexicalComposerContext.useLexicalComposerContext: cannot find a LexicalComposerContext',
    );
  }
  return composerContext;
}
exports.useLexicalComposerContext = useLexicalComposerContext;
