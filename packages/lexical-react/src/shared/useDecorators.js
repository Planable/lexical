'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useDecorators = void 0;
var react_1 = require('react');
var react_dom_1 = require('react-dom');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
function useDecorators(editor) {
  var _a = (0, react_1.useState)(function () {
      return editor.getDecorators();
    }),
    decorators = _a[0],
    setDecorators = _a[1];
  // Subscribe to changes
  (0, useLayoutEffect_1['default'])(
    function () {
      return editor.registerDecoratorListener(function (nextDecorators) {
        (0, react_dom_1.flushSync)(function () {
          setDecorators(nextDecorators);
        });
      });
    },
    [editor],
  );
  (0, react_1.useEffect)(
    function () {
      // If the content editable mounts before the subscription is added, then
      // nothing will be rendered on initial pass. We can get around that by
      // ensuring that we set the value.
      setDecorators(editor.getDecorators());
    },
    [editor],
  );
  // Return decorators defined as React Portals
  return (0, react_1.useMemo)(
    function () {
      var decoratedPortals = [];
      var decoratorKeys = Object.keys(decorators);
      for (var i = 0; i < decoratorKeys.length; i++) {
        var nodeKey = decoratorKeys[i];
        var reactDecorator = decorators[nodeKey];
        var element = editor.getElementByKey(nodeKey);
        if (element !== null) {
          decoratedPortals.push(
            (0, react_dom_1.createPortal)(reactDecorator, element),
          );
        }
      }
      return decoratedPortals;
    },
    [decorators, editor],
  );
}
exports.useDecorators = useDecorators;
