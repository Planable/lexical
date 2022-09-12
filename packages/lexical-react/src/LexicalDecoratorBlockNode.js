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
exports.$isDecoratorBlockNode = exports.DecoratorBlockNode = void 0;
var lexical_1 = require('lexical');
var DecoratorBlockNode = /** @class */ (function (_super) {
  __extends(DecoratorBlockNode, _super);
  function DecoratorBlockNode(format, key) {
    var _this = _super.call(this, key) || this;
    _this.__format = format || '';
    return _this;
  }
  DecoratorBlockNode.prototype.exportJSON = function () {
    return {
      format: this.__format || '',
      type: 'decorator-block',
      version: 1,
    };
  };
  DecoratorBlockNode.prototype.createDOM = function () {
    return document.createElement('div');
  };
  DecoratorBlockNode.prototype.updateDOM = function () {
    return false;
  };
  DecoratorBlockNode.prototype.setFormat = function (format) {
    var self = this.getWritable();
    self.__format = format;
  };
  return DecoratorBlockNode;
})(lexical_1.DecoratorNode);
exports.DecoratorBlockNode = DecoratorBlockNode;
function $isDecoratorBlockNode(node) {
  return node instanceof DecoratorBlockNode;
}
exports.$isDecoratorBlockNode = $isDecoratorBlockNode;
