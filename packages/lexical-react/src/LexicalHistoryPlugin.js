'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
exports.__esModule = true;
exports.HistoryPlugin = exports.createEmptyHistoryState = void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var useHistory_1 = require('./shared/useHistory');
var history_1 = require('@lexical/history');
__createBinding(exports, history_1, 'createEmptyHistoryState');
function HistoryPlugin(_a) {
  var externalHistoryState = _a.externalHistoryState;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, useHistory_1.useHistory)(editor, externalHistoryState);
  return null;
}
exports.HistoryPlugin = HistoryPlugin;
