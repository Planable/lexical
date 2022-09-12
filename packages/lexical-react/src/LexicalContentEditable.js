'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.ContentEditable = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var React = require('react');
var react_1 = require('react');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function ContentEditable(_a) {
  var ariaActiveDescendantID = _a.ariaActiveDescendantID,
    ariaAutoComplete = _a.ariaAutoComplete,
    ariaControls = _a.ariaControls,
    ariaDescribedBy = _a.ariaDescribedBy,
    ariaExpanded = _a.ariaExpanded,
    ariaLabel = _a.ariaLabel,
    ariaLabelledBy = _a.ariaLabelledBy,
    ariaMultiline = _a.ariaMultiline,
    ariaOwneeID = _a.ariaOwneeID,
    ariaRequired = _a.ariaRequired,
    autoCapitalize = _a.autoCapitalize,
    autoComplete = _a.autoComplete,
    autoCorrect = _a.autoCorrect,
    className = _a.className,
    id = _a.id,
    _b = _a.role,
    role = _b === void 0 ? 'textbox' : _b,
    _c = _a.spellCheck,
    spellCheck = _c === void 0 ? true : _c,
    style = _a.style,
    tabIndex = _a.tabIndex,
    testid = _a.testid;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var _d = (0, react_1.useState)(false),
    isEditable = _d[0],
    setEditable = _d[1];
  var ref = (0, react_1.useCallback)(
    function (rootElement) {
      editor.setRootElement(rootElement);
    },
    [editor],
  );
  (0, useLayoutEffect_1['default'])(
    function () {
      setEditable(editor.isEditable());
      return editor.registerEditableListener(function (currentIsEditable) {
        setEditable(currentIsEditable);
      });
    },
    [editor],
  );
  return (
    <div
      aria-activedescendant={!isEditable ? null : ariaActiveDescendantID}
      aria-autocomplete={!isEditable ? null : ariaAutoComplete}
      aria-controls={!isEditable ? null : ariaControls}
      aria-describedby={ariaDescribedBy}
      aria-expanded={
        !isEditable ? null : role === 'combobox' ? !!ariaExpanded : null
      }
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiline={ariaMultiline}
      aria-owns={!isEditable ? null : ariaOwneeID}
      aria-required={ariaRequired}
      autoCapitalize={
        autoCapitalize !== undefined ? String(autoCapitalize) : undefined
      }
      // @ts-ignore This is a valid attribute
      autoComplete={autoComplete}
      autoCorrect={autoCorrect !== undefined ? String(autoCorrect) : undefined}
      className={className}
      contentEditable={isEditable}
      data-testid={testid}
      id={id}
      ref={ref}
      role={!isEditable ? undefined : role}
      spellCheck={spellCheck}
      style={style}
      tabIndex={tabIndex}
    />
  );
}
exports.ContentEditable = ContentEditable;
