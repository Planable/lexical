'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.CharacterLimitPlugin = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var React = require('react');
var react_1 = require('react');
var useCharacterLimit_1 = require('./shared/useCharacterLimit');
var CHARACTER_LIMIT = 5;
var textEncoderInstance = null;
function textEncoder() {
  if (window.TextEncoder === undefined) {
    return null;
  }
  if (textEncoderInstance === null) {
    textEncoderInstance = new window.TextEncoder();
  }
  return textEncoderInstance;
}
function utf8Length(text) {
  var currentTextEncoder = textEncoder();
  if (currentTextEncoder === null) {
    // http://stackoverflow.com/a/5515960/210370
    var m = encodeURIComponent(text).match(/%[89ABab]/g);
    return text.length + (m ? m.length : 0);
  }
  return currentTextEncoder.encode(text).length;
}
function CharacterLimitPlugin(_a) {
  var _b = _a.charset,
    charset = _b === void 0 ? 'UTF-16' : _b;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var _c = (0, react_1.useState)(0),
    remainingCharacters = _c[0],
    setRemainingCharacters = _c[1];
  var characterLimitProps = (0, react_1.useMemo)(
    function () {
      return {
        remainingCharacters: setRemainingCharacters,
        strlen: function (text) {
          if (charset === 'UTF-8') {
            return utf8Length(text);
          } else if (charset === 'UTF-16') {
            return text.length;
          } else {
            throw new Error('Unrecognized charset');
          }
        },
      };
    },
    [charset],
  );
  (0, useCharacterLimit_1.useCharacterLimit)(
    editor,
    CHARACTER_LIMIT,
    characterLimitProps,
  );
  return (
    <span
      className={'characters-limit '.concat(
        remainingCharacters < 0 ? 'characters-limit-exceeded' : '',
      )}>
      {remainingCharacters}
    </span>
  );
}
exports.CharacterLimitPlugin = CharacterLimitPlugin;
