'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
exports.__esModule = true;
exports.LexicalNodeMenuPlugin =
  exports.LexicalTypeaheadMenuPlugin =
  exports.useBasicTypeaheadTriggerMatch =
  exports.TypeaheadOption =
  exports.PUNCTUATION =
    void 0;
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var react_1 = require('react');
var React = require('react');
var useLayoutEffect_1 = require('shared/useLayoutEffect');
exports.PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
var TypeaheadOption = /** @class */ (function () {
  function TypeaheadOption(key) {
    this.key = key;
    this.ref = {current: null};
    this.setRefElement = this.setRefElement.bind(this);
  }
  TypeaheadOption.prototype.setRefElement = function (element) {
    this.ref = {current: element};
  };
  return TypeaheadOption;
})();
exports.TypeaheadOption = TypeaheadOption;
var scrollIntoViewIfNeeded = function (target) {
  var container = document.getElementById('typeahead-menu');
  if (container) {
    var containerRect = container.getBoundingClientRect();
    var targetRect = target.getBoundingClientRect();
    if (targetRect.bottom > containerRect.bottom) {
      target.scrollIntoView(false);
    } else if (targetRect.top < containerRect.top) {
      target.scrollIntoView();
    }
  }
};
function getTextUpToAnchor(selection) {
  var anchor = selection.anchor;
  if (anchor.type !== 'text') {
    return null;
  }
  var anchorNode = anchor.getNode();
  if (!anchorNode.isSimpleText()) {
    return null;
  }
  var anchorOffset = anchor.offset;
  return anchorNode.getTextContent().slice(0, anchorOffset);
}
function tryToPositionRange(leadOffset, range) {
  var domSelection = window.getSelection();
  if (domSelection === null || !domSelection.isCollapsed) {
    return false;
  }
  var anchorNode = domSelection.anchorNode;
  var startOffset = leadOffset;
  var endOffset = domSelection.anchorOffset;
  if (anchorNode == null || endOffset == null) {
    return false;
  }
  try {
    range.setStart(anchorNode, startOffset);
    range.setEnd(anchorNode, endOffset);
  } catch (error) {
    return false;
  }
  return true;
}
function getQueryTextForSearch(editor) {
  var text = null;
  editor.getEditorState().read(function () {
    var selection = (0, lexical_1.$getSelection)();
    if (!(0, lexical_1.$isRangeSelection)(selection)) {
      return;
    }
    text = getTextUpToAnchor(selection);
  });
  return text;
}
/**
 * Walk backwards along user input and forward through entity title to try
 * and replace more of the user's text with entity.
 */
function getFullMatchOffset(documentText, entryText, offset) {
  var triggerOffset = offset;
  for (var i = triggerOffset; i <= entryText.length; i++) {
    if (documentText.substr(-i) === entryText.substr(0, i)) {
      triggerOffset = i;
    }
  }
  return triggerOffset;
}
/**
 * Split Lexical TextNode and return a new TextNode only containing matched text.
 * Common use cases include: removing the node, replacing with a new node.
 */
function splitNodeContainingQuery(editor, match) {
  var _a;
  var selection = (0, lexical_1.$getSelection)();
  if (
    !(0, lexical_1.$isRangeSelection)(selection) ||
    !selection.isCollapsed()
  ) {
    return null;
  }
  var anchor = selection.anchor;
  if (anchor.type !== 'text') {
    return null;
  }
  var anchorNode = anchor.getNode();
  if (!anchorNode.isSimpleText()) {
    return null;
  }
  var selectionOffset = anchor.offset;
  var textContent = anchorNode.getTextContent().slice(0, selectionOffset);
  var characterOffset = match.replaceableString.length;
  var queryOffset = getFullMatchOffset(
    textContent,
    match.matchingString,
    characterOffset,
  );
  var startOffset = selectionOffset - queryOffset;
  if (startOffset < 0) {
    return null;
  }
  var newNode;
  if (startOffset === 0) {
    newNode = anchorNode.splitText(selectionOffset)[0];
  } else {
    (_a = anchorNode.splitText(startOffset, selectionOffset)),
      (newNode = _a[1]);
  }
  return newNode;
}
function isSelectionOnEntityBoundary(editor, offset) {
  if (offset !== 0) {
    return false;
  }
  return editor.getEditorState().read(function () {
    var selection = (0, lexical_1.$getSelection)();
    if ((0, lexical_1.$isRangeSelection)(selection)) {
      var anchor = selection.anchor;
      var anchorNode = anchor.getNode();
      var prevSibling = anchorNode.getPreviousSibling();
      return (
        (0, lexical_1.$isTextNode)(prevSibling) && prevSibling.isTextEntity()
      );
    }
    return false;
  });
}
function startTransition(callback) {
  if (React.startTransition) {
    React.startTransition(callback);
  } else {
    callback();
  }
}
function LexicalPopoverMenu(_a) {
  var _this = this;
  var close = _a.close,
    editor = _a.editor,
    anchorElement = _a.anchorElement,
    resolution = _a.resolution,
    options = _a.options,
    menuRenderFn = _a.menuRenderFn,
    onSelectOption = _a.onSelectOption;
  var _b = (0, react_1.useState)(null),
    selectedIndex = _b[0],
    setHighlightedIndex = _b[1];
  (0, react_1.useEffect)(
    function () {
      setHighlightedIndex(0);
    },
    [resolution.match.matchingString],
  );
  var selectOptionAndCleanUp = (0, react_1.useCallback)(
    function (selectedEntry) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          editor.update(function () {
            var textNodeContainingQuery = splitNodeContainingQuery(
              editor,
              resolution.match,
            );
            onSelectOption(
              selectedEntry,
              textNodeContainingQuery,
              close,
              resolution.match.matchingString,
            );
          });
          return [2 /*return*/];
        });
      });
    },
    [close, editor, resolution.match, onSelectOption],
  );
  var updateSelectedIndex = (0, react_1.useCallback)(
    function (index) {
      var rootElem = editor.getRootElement();
      if (rootElem !== null) {
        rootElem.setAttribute(
          'aria-activedescendant',
          'typeahead-item-' + index,
        );
        setHighlightedIndex(index);
      }
    },
    [editor],
  );
  (0, react_1.useEffect)(
    function () {
      return function () {
        var rootElem = editor.getRootElement();
        if (rootElem !== null) {
          rootElem.removeAttribute('aria-activedescendant');
        }
      };
    },
    [editor],
  );
  (0, useLayoutEffect_1['default'])(
    function () {
      if (options === null) {
        setHighlightedIndex(null);
      } else if (selectedIndex === null) {
        updateSelectedIndex(0);
      }
    },
    [options, selectedIndex, updateSelectedIndex],
  );
  (0, react_1.useEffect)(
    function () {
      return (0, utils_1.mergeRegister)(
        editor.registerCommand(
          lexical_1.KEY_ARROW_DOWN_COMMAND,
          function (payload) {
            var event = payload;
            if (options !== null && options.length && selectedIndex !== null) {
              var newSelectedIndex =
                selectedIndex !== options.length - 1 ? selectedIndex + 1 : 0;
              updateSelectedIndex(newSelectedIndex);
              var option = options[newSelectedIndex];
              if (option.ref != null && option.ref.current) {
                scrollIntoViewIfNeeded(option.ref.current);
              }
              event.preventDefault();
              event.stopImmediatePropagation();
            }
            return true;
          },
          lexical_1.COMMAND_PRIORITY_NORMAL,
        ),
        editor.registerCommand(
          lexical_1.KEY_ARROW_UP_COMMAND,
          function (payload) {
            var event = payload;
            if (options !== null && options.length && selectedIndex !== null) {
              var newSelectedIndex =
                selectedIndex !== 0 ? selectedIndex - 1 : options.length - 1;
              updateSelectedIndex(newSelectedIndex);
              var option = options[newSelectedIndex];
              if (option.ref != null && option.ref.current) {
                scrollIntoViewIfNeeded(option.ref.current);
              }
              event.preventDefault();
              event.stopImmediatePropagation();
            }
            return true;
          },
          lexical_1.COMMAND_PRIORITY_NORMAL,
        ),
        editor.registerCommand(
          lexical_1.KEY_ESCAPE_COMMAND,
          function (payload) {
            var event = payload;
            event.preventDefault();
            event.stopImmediatePropagation();
            close();
            return true;
          },
          lexical_1.COMMAND_PRIORITY_NORMAL,
        ),
        editor.registerCommand(
          lexical_1.KEY_TAB_COMMAND,
          function (payload) {
            var event = payload;
            if (
              options === null ||
              selectedIndex === null ||
              options[selectedIndex] == null
            ) {
              return false;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            selectOptionAndCleanUp(options[selectedIndex]);
            return true;
          },
          lexical_1.COMMAND_PRIORITY_NORMAL,
        ),
        editor.registerCommand(
          lexical_1.KEY_ENTER_COMMAND,
          function (event) {
            if (
              options === null ||
              selectedIndex === null ||
              options[selectedIndex] == null
            ) {
              return false;
            }
            if (event !== null) {
              event.preventDefault();
              event.stopImmediatePropagation();
            }
            selectOptionAndCleanUp(options[selectedIndex]);
            return true;
          },
          lexical_1.COMMAND_PRIORITY_NORMAL,
        ),
      );
    },
    [
      selectOptionAndCleanUp,
      close,
      editor,
      options,
      selectedIndex,
      updateSelectedIndex,
    ],
  );
  var listItemProps = (0, react_1.useMemo)(
    function () {
      return {
        selectOptionAndCleanUp: selectOptionAndCleanUp,
        selectedIndex: selectedIndex,
        setHighlightedIndex: setHighlightedIndex,
      };
    },
    [selectOptionAndCleanUp, selectedIndex],
  );
  return menuRenderFn(
    anchorElement,
    listItemProps,
    resolution.match.matchingString,
  );
}
function useBasicTypeaheadTriggerMatch(trigger, _a) {
  var _b = _a.minLength,
    minLength = _b === void 0 ? 1 : _b,
    _c = _a.maxLength,
    maxLength = _c === void 0 ? 75 : _c;
  return (0, react_1.useCallback)(
    function (text) {
      var validChars = '[^' + trigger + exports.PUNCTUATION + '\\s]';
      var TypeaheadTriggerRegex = new RegExp(
        '(^|\\s|\\()(' +
          '[' +
          trigger +
          ']' +
          '((?:' +
          validChars +
          '){0,' +
          maxLength +
          '})' +
          ')$',
      );
      var match = TypeaheadTriggerRegex.exec(text);
      if (match !== null) {
        var maybeLeadingWhitespace = match[1];
        var matchingString = match[3];
        if (matchingString.length >= minLength) {
          return {
            leadOffset: match.index + maybeLeadingWhitespace.length,
            matchingString: matchingString,
            replaceableString: match[2],
          };
        }
      }
      return null;
    },
    [maxLength, minLength, trigger],
  );
}
exports.useBasicTypeaheadTriggerMatch = useBasicTypeaheadTriggerMatch;
function useAnchorElementRef(resolution) {
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var anchorElementRef = (0, react_1.useRef)(document.createElement('div'));
  (0, react_1.useEffect)(
    function () {
      var rootElement = editor.getRootElement();
      function positionMenu() {
        var containerDiv = anchorElementRef.current;
        containerDiv.setAttribute('aria-label', 'Typeahead menu');
        containerDiv.setAttribute('id', 'typeahead-menu');
        containerDiv.setAttribute('role', 'listbox');
        if (rootElement !== null && resolution !== null) {
          var _a = resolution.getRect(),
            left = _a.left,
            top_1 = _a.top,
            height = _a.height;
          containerDiv.style.top = ''.concat(
            top_1 + height + 5 + window.pageYOffset,
            'px',
          );
          containerDiv.style.left = ''.concat(left + window.pageXOffset, 'px');
          containerDiv.style.display = 'block';
          containerDiv.style.position = 'absolute';
          if (!containerDiv.isConnected) {
            document.body.append(containerDiv);
          }
          anchorElementRef.current = containerDiv;
          rootElement.setAttribute('aria-controls', 'typeahead-menu');
        }
      }
      if (resolution !== null) {
        positionMenu();
        window.addEventListener('resize', positionMenu);
        return function () {
          window.removeEventListener('resize', positionMenu);
          if (rootElement !== null) {
            rootElement.removeAttribute('aria-controls');
          }
        };
      }
    },
    [editor, resolution],
  );
  return anchorElementRef;
}
function LexicalTypeaheadMenuPlugin(_a) {
  var options = _a.options,
    onQueryChange = _a.onQueryChange,
    onSelectOption = _a.onSelectOption,
    menuRenderFn = _a.menuRenderFn,
    triggerFn = _a.triggerFn;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var _b = (0, react_1.useState)(null),
    resolution = _b[0],
    setResolution = _b[1];
  var anchorElementRef = useAnchorElementRef(resolution);
  (0, react_1.useEffect)(
    function () {
      var activeRange = document.createRange();
      var previousText = null;
      var updateListener = function () {
        editor.getEditorState().read(function () {
          var range = activeRange;
          var selection = (0, lexical_1.$getSelection)();
          var text = getQueryTextForSearch(editor);
          if (
            !(0, lexical_1.$isRangeSelection)(selection) ||
            !selection.isCollapsed() ||
            text === previousText ||
            text === null ||
            range === null
          ) {
            setResolution(null);
            return;
          }
          previousText = text;
          var match = triggerFn(text, editor);
          onQueryChange(match ? match.matchingString : null);
          if (
            match !== null &&
            !isSelectionOnEntityBoundary(editor, match.leadOffset)
          ) {
            var isRangePositioned = tryToPositionRange(match.leadOffset, range);
            if (isRangePositioned !== null) {
              startTransition(function () {
                return setResolution({
                  getRect: function () {
                    return range.getBoundingClientRect();
                  },
                  match: match,
                });
              });
              return;
            }
          }
          setResolution(null);
        });
      };
      var removeUpdateListener = editor.registerUpdateListener(updateListener);
      return function () {
        activeRange = null;
        removeUpdateListener();
      };
    },
    [editor, triggerFn, onQueryChange, resolution],
  );
  var closeTypeahead = (0, react_1.useCallback)(function () {
    setResolution(null);
  }, []);
  return resolution === null || editor === null ? null : (
    <LexicalPopoverMenu
      close={closeTypeahead}
      resolution={resolution}
      editor={editor}
      anchorElement={anchorElementRef.current}
      options={options}
      menuRenderFn={menuRenderFn}
      onSelectOption={onSelectOption}
    />
  );
}
exports.LexicalTypeaheadMenuPlugin = LexicalTypeaheadMenuPlugin;
function LexicalNodeMenuPlugin(_a) {
  var options = _a.options,
    nodeKey = _a.nodeKey,
    onClose = _a.onClose,
    onSelectOption = _a.onSelectOption,
    menuRenderFn = _a.menuRenderFn;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var _b = (0, react_1.useState)(null),
    resolution = _b[0],
    setResolution = _b[1];
  var anchorElementRef = useAnchorElementRef(resolution);
  (0, react_1.useEffect)(
    function () {
      if (nodeKey && resolution == null) {
        editor.update(function () {
          var node = (0, lexical_1.$getNodeByKey)(nodeKey);
          var domElement = editor.getElementByKey(nodeKey);
          if (node != null && domElement != null) {
            var text_1 = node.getTextContent();
            startTransition(function () {
              return setResolution({
                getRect: function () {
                  return domElement.getBoundingClientRect();
                },
                match: {
                  leadOffset: text_1.length,
                  matchingString: text_1,
                  replaceableString: text_1,
                },
              });
            });
          }
        });
      } else if (nodeKey == null && resolution != null) {
        setResolution(null);
      }
    },
    [editor, nodeKey, resolution],
  );
  return resolution === null || editor === null ? null : (
    <LexicalPopoverMenu
      close={onClose}
      resolution={resolution}
      editor={editor}
      anchorElement={anchorElementRef.current}
      options={options}
      menuRenderFn={menuRenderFn}
      onSelectOption={onSelectOption}
    />
  );
}
exports.LexicalNodeMenuPlugin = LexicalNodeMenuPlugin;
