'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.CheckListPlugin = void 0;
var list_1 = require('@lexical/list');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var react_1 = require('react');
function CheckListPlugin() {
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  (0, react_1.useEffect)(function () {
    return (0, utils_1.mergeRegister)(
      editor.registerCommand(
        list_1.INSERT_CHECK_LIST_COMMAND,
        function () {
          (0, list_1.insertList)(editor, 'check');
          return true;
        },
        lexical_1.COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        lexical_1.KEY_ARROW_DOWN_COMMAND,
        function (event) {
          return handleArrownUpOrDown(event, editor, false);
        },
        lexical_1.COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        lexical_1.KEY_ARROW_UP_COMMAND,
        function (event) {
          return handleArrownUpOrDown(event, editor, true);
        },
        lexical_1.COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        lexical_1.KEY_ESCAPE_COMMAND,
        function (event) {
          var activeItem = getActiveCheckListItem();
          if (activeItem != null) {
            var rootElement = editor.getRootElement();
            if (rootElement != null) {
              rootElement.focus();
            }
            return true;
          }
          return false;
        },
        lexical_1.COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        lexical_1.KEY_SPACE_COMMAND,
        function (event) {
          var activeItem = getActiveCheckListItem();
          if (activeItem != null && editor.isEditable()) {
            editor.update(function () {
              var listItemNode = (0, lexical_1.$getNearestNodeFromDOMNode)(
                activeItem,
              );
              if ((0, list_1.$isListItemNode)(listItemNode)) {
                event.preventDefault();
                listItemNode.toggleChecked();
              }
            });
            return true;
          }
          return false;
        },
        lexical_1.COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        lexical_1.KEY_ARROW_LEFT_COMMAND,
        function (event) {
          return editor.getEditorState().read(function () {
            var selection = (0, lexical_1.$getSelection)();
            if (
              (0, lexical_1.$isRangeSelection)(selection) &&
              selection.isCollapsed()
            ) {
              var anchor = selection.anchor;
              var isElement = anchor.type === 'element';
              if (isElement || anchor.offset === 0) {
                var anchorNode = anchor.getNode();
                var elementNode = (0, utils_1.$findMatchingParent)(
                  anchorNode,
                  function (node) {
                    return (
                      (0, lexical_1.$isElementNode)(node) && !node.isInline()
                    );
                  },
                );
                if (
                  (0, list_1.$isListItemNode)(elementNode) &&
                  (isElement || elementNode.getFirstDescendant() === anchorNode)
                ) {
                  var domNode = editor.getElementByKey(elementNode.__key);
                  if (domNode != null && document.activeElement !== domNode) {
                    domNode.focus();
                    event.preventDefault();
                    return true;
                  }
                }
              }
            }
            return false;
          });
        },
        lexical_1.COMMAND_PRIORITY_LOW,
      ),
      listenPointerDown(),
    );
  });
  return null;
}
exports.CheckListPlugin = CheckListPlugin;
var listenersCount = 0;
function listenPointerDown() {
  if (listenersCount++ === 0) {
    document.addEventListener('click', handleClick);
    document.addEventListener('pointerdown', handlePointerDown);
  }
  return function () {
    if (--listenersCount === 0) {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('pointerdown', handlePointerDown);
    }
  };
}
function handleCheckItemEvent(event, callback) {
  var target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  // Ignore clicks on LI that have nested lists
  var firstChild = target.firstChild;
  if (
    firstChild != null &&
    firstChild instanceof HTMLElement &&
    (firstChild.tagName === 'UL' || firstChild.tagName === 'OL')
  ) {
    return;
  }
  var parentNode = target.parentNode;
  // @ts-ignore internal field
  if (!parentNode || parentNode.__lexicalListType !== 'check') {
    return;
  }
  var pageX = event.pageX;
  var rect = target.getBoundingClientRect();
  if (
    target.dir === 'rtl'
      ? pageX < rect.right && pageX > rect.right - 20
      : pageX > rect.left && pageX < rect.left + 20
  ) {
    callback();
  }
}
function handleClick(event) {
  handleCheckItemEvent(event, function () {
    var domNode = event.target;
    var editor = findEditor(domNode);
    if (editor != null && editor.isEditable()) {
      editor.update(function () {
        if (event.target) {
          var node = (0, lexical_1.$getNearestNodeFromDOMNode)(domNode);
          if ((0, list_1.$isListItemNode)(node)) {
            domNode.focus();
            node.toggleChecked();
          }
        }
      });
    }
  });
}
function handlePointerDown(event) {
  handleCheckItemEvent(event, function () {
    // Prevents caret moving when clicking on check mark
    event.preventDefault();
  });
}
function findEditor(target) {
  var node = target;
  while (node) {
    // @ts-ignore internal field
    if (node.__lexicalEditor) {
      // @ts-ignore internal field
      return node.__lexicalEditor;
    }
    node = node.parentNode;
  }
  return null;
}
function getActiveCheckListItem() {
  var activeElement = document.activeElement;
  return activeElement != null &&
    activeElement.tagName === 'LI' &&
    activeElement.parentNode != null &&
    // @ts-ignore internal field
    activeElement.parentNode.__lexicalListType === 'check'
    ? activeElement
    : null;
}
function findCheckListItemSibling(node, backward) {
  var sibling = backward ? node.getPreviousSibling() : node.getNextSibling();
  var parent = node;
  // Going up in a tree to get non-null sibling
  while (sibling == null && (0, list_1.$isListItemNode)(parent)) {
    // Get li -> parent ul/ol -> parent li
    parent = parent.getParentOrThrow().getParent();
    if (parent != null) {
      sibling = backward
        ? parent.getPreviousSibling()
        : parent.getNextSibling();
    }
  }
  // Going down in a tree to get first non-nested list item
  while ((0, list_1.$isListItemNode)(sibling)) {
    var firstChild = backward
      ? sibling.getLastChild()
      : sibling.getFirstChild();
    if (!(0, list_1.$isListNode)(firstChild)) {
      return sibling;
    }
    sibling = backward ? firstChild.getLastChild() : firstChild.getFirstChild();
  }
  return null;
}
function handleArrownUpOrDown(event, editor, backward) {
  var activeItem = getActiveCheckListItem();
  if (activeItem != null) {
    editor.update(function () {
      var listItem = (0, lexical_1.$getNearestNodeFromDOMNode)(activeItem);
      if (!(0, list_1.$isListItemNode)(listItem)) {
        return;
      }
      var nextListItem = findCheckListItemSibling(listItem, backward);
      if (nextListItem != null) {
        nextListItem.selectStart();
        var dom_1 = editor.getElementByKey(nextListItem.__key);
        if (dom_1 != null) {
          event.preventDefault();
          setTimeout(function () {
            dom_1.focus();
          }, 0);
        }
      }
    });
  }
  return false;
}
