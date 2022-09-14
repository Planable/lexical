'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useHistory = void 0;
var history_1 = require('@lexical/history');
var react_1 = require('react');
function useHistory(editor, externalHistoryState, delay) {
  if (delay === void 0) {
    delay = 1000;
  }
  var historyState = (0, react_1.useMemo)(
    function () {
      return externalHistoryState || (0, history_1.createEmptyHistoryState)();
    },
    [externalHistoryState],
  );
  (0, react_1.useEffect)(
    function () {
      return (0, history_1.registerHistory)(editor, historyState, delay);
    },
    [delay, editor, historyState],
  );
}
exports.useHistory = useHistory;
