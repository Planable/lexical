'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null',
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
exports.$isHorizontalRuleNode =
  exports.$createHorizontalRuleNode =
  exports.HorizontalRuleNode =
  exports.INSERT_HORIZONTAL_RULE_COMMAND =
    void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var useLexicalNodeSelection_1 = require('@lexical/react/useLexicalNodeSelection');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var React = require('react');
var react_1 = require('react');
exports.INSERT_HORIZONTAL_RULE_COMMAND = (0, lexical_1.createCommand)();
function HorizontalRuleComponent(_a) {
  var nodeKey = _a.nodeKey;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var hrRef = (0, react_1.useRef)(null);
  var _b = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey),
    isSelected = _b[0],
    setSelected = _b[1],
    clearSelection = _b[2];
  var onDelete = (0, react_1.useCallback)(
    function (payload) {
      if (
        isSelected &&
        (0, lexical_1.$isNodeSelection)((0, lexical_1.$getSelection)())
      ) {
        var event_1 = payload;
        event_1.preventDefault();
        var node = (0, lexical_1.$getNodeByKey)(nodeKey);
        if ($isHorizontalRuleNode(node)) {
          node.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected],
  );
  (0, react_1.useEffect)(
    function () {
      return (0, utils_1.mergeRegister)(
        editor.registerCommand(
          lexical_1.CLICK_COMMAND,
          function (event) {
            var hrElem = hrRef.current;
            if (event.target === hrElem) {
              if (!event.shiftKey) {
                clearSelection();
              }
              setSelected(!isSelected);
              return true;
            }
            return false;
          },
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          lexical_1.KEY_DELETE_COMMAND,
          onDelete,
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          lexical_1.KEY_BACKSPACE_COMMAND,
          onDelete,
          lexical_1.COMMAND_PRIORITY_LOW,
        ),
      );
    },
    [clearSelection, editor, isSelected, onDelete, setSelected],
  );
  return <hr ref={hrRef} className={isSelected ? 'selected' : undefined} />;
}
var HorizontalRuleNode = /** @class */ (function (_super) {
  __extends(HorizontalRuleNode, _super);
  function HorizontalRuleNode() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  HorizontalRuleNode.getType = function () {
    return 'horizontalrule';
  };
  HorizontalRuleNode.clone = function (node) {
    return new HorizontalRuleNode(node.__key);
  };
  HorizontalRuleNode.importJSON = function (serializedNode) {
    return $createHorizontalRuleNode();
  };
  HorizontalRuleNode.prototype.exportJSON = function () {
    return {
      type: 'horizontalrule',
      version: 1,
    };
  };
  HorizontalRuleNode.prototype.createDOM = function () {
    var div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  };
  HorizontalRuleNode.prototype.getTextContent = function () {
    return '\n';
  };
  HorizontalRuleNode.prototype.isTopLevel = function () {
    return true;
  };
  HorizontalRuleNode.prototype.updateDOM = function () {
    return false;
  };
  HorizontalRuleNode.prototype.decorate = function () {
    return <HorizontalRuleComponent nodeKey={this.__key} />;
  };
  return HorizontalRuleNode;
})(lexical_1.DecoratorNode);
exports.HorizontalRuleNode = HorizontalRuleNode;
function $createHorizontalRuleNode() {
  return new HorizontalRuleNode();
}
exports.$createHorizontalRuleNode = $createHorizontalRuleNode;
function $isHorizontalRuleNode(node) {
  return node instanceof HorizontalRuleNode;
}
exports.$isHorizontalRuleNode = $isHorizontalRuleNode;
