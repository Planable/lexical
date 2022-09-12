'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useEditorEvents = void 0;
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function getTarget(eventName, rootElement) {
  return eventName === 'selectionchange' ||
    eventName === 'keyup' ||
    eventName === 'pointerup' ||
    eventName === 'pointercancel'
    ? rootElement.ownerDocument
    : rootElement;
}
function isRootEditable(editor) {
  var rootElement = editor.getRootElement();
  return rootElement !== null && rootElement.contentEditable === 'true';
}
function useEditorEvents(events, editor) {
  (0, useLayoutEffect_1['default'])(
    function () {
      var create = [];
      var destroy = [];
      var _loop_1 = function (i) {
        var _a = events[i],
          eventName = _a[0],
          handler = _a[1];
        var handlerWrapper = function (event) {
          if (isRootEditable(editor)) {
            handler(event, editor);
          }
        };
        create.push(function (rootElement) {
          getTarget(eventName, rootElement).addEventListener(
            eventName,
            handlerWrapper,
          );
        });
        destroy.push(function (rootElement) {
          getTarget(eventName, rootElement).removeEventListener(
            eventName,
            handlerWrapper,
          );
        });
      };
      for (var i = 0; i < events.length; i++) {
        _loop_1(i);
      }
      return editor.registerRootListener(function (
        rootElement,
        prevRootElement,
      ) {
        if (prevRootElement !== null) {
          destroy.forEach(function (fn) {
            return fn(prevRootElement);
          });
        }
        if (rootElement !== null) {
          create.forEach(function (fn) {
            return fn(rootElement);
          });
        }
      });
    },
    [editor, events],
  );
}
exports.useEditorEvents = useEditorEvents;
