'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
exports.__esModule = true;
exports.TreeView = void 0;
var link_1 = require('@lexical/link');
var mark_1 = require('@lexical/mark');
var lexical_1 = require('lexical');
var React = require('react');
var react_1 = require('react');
var NON_SINGLE_WIDTH_CHARS_REPLACEMENT = Object.freeze({
  '\t': '\\t',
  '\n': '\\n',
});
var NON_SINGLE_WIDTH_CHARS_REGEX = new RegExp(
  Object.keys(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).join('|'),
  'g',
);
var SYMBOLS = Object.freeze({
  ancestorHasNextSibling: '|',
  ancestorIsLastChild: ' ',
  hasNextSibling: '├',
  isLastChild: '└',
  selectedChar: '^',
  selectedLine: '>',
});
function TreeView(_a) {
  var timeTravelButtonClassName = _a.timeTravelButtonClassName,
    timeTravelPanelSliderClassName = _a.timeTravelPanelSliderClassName,
    timeTravelPanelButtonClassName = _a.timeTravelPanelButtonClassName,
    viewClassName = _a.viewClassName,
    timeTravelPanelClassName = _a.timeTravelPanelClassName,
    editor = _a.editor;
  var _b = (0, react_1.useState)([]),
    timeStampedEditorStates = _b[0],
    setTimeStampedEditorStates = _b[1];
  var _c = (0, react_1.useState)(''),
    content = _c[0],
    setContent = _c[1];
  var _d = (0, react_1.useState)(false),
    timeTravelEnabled = _d[0],
    setTimeTravelEnabled = _d[1];
  var playingIndexRef = (0, react_1.useRef)(0);
  var treeElementRef = (0, react_1.useRef)(null);
  var inputRef = (0, react_1.useRef)(null);
  var _e = (0, react_1.useState)(false),
    isPlaying = _e[0],
    setIsPlaying = _e[1];
  (0, react_1.useEffect)(
    function () {
      setContent(generateContent(editor.getEditorState()));
      return editor.registerUpdateListener(function (_a) {
        var editorState = _a.editorState;
        var compositionKey = editor._compositionKey;
        var treeText = generateContent(editor.getEditorState());
        var compositionText =
          compositionKey !== null && 'Composition key: '.concat(compositionKey);
        setContent([treeText, compositionText].filter(Boolean).join('\n\n'));
        if (!timeTravelEnabled) {
          setTimeStampedEditorStates(function (currentEditorStates) {
            return __spreadArray(
              __spreadArray([], currentEditorStates, true),
              [[Date.now(), editorState]],
              false,
            );
          });
        }
      });
    },
    [timeTravelEnabled, editor],
  );
  var totalEditorStates = timeStampedEditorStates.length;
  (0, react_1.useEffect)(
    function () {
      if (isPlaying) {
        var timeoutId_1;
        var play_1 = function () {
          var currentIndex = playingIndexRef.current;
          if (currentIndex === totalEditorStates - 1) {
            setIsPlaying(false);
            return;
          }
          var currentTime = timeStampedEditorStates[currentIndex][0];
          var nextTime = timeStampedEditorStates[currentIndex + 1][0];
          var timeDiff = nextTime - currentTime;
          timeoutId_1 = setTimeout(function () {
            playingIndexRef.current++;
            var index = playingIndexRef.current;
            var input = inputRef.current;
            if (input !== null) {
              input.value = String(index);
            }
            editor.setEditorState(timeStampedEditorStates[index][1]);
            play_1();
          }, timeDiff);
        };
        play_1();
        return function () {
          clearTimeout(timeoutId_1);
        };
      }
    },
    [timeStampedEditorStates, isPlaying, editor, totalEditorStates],
  );
  (0, react_1.useEffect)(
    function () {
      var element = treeElementRef.current;
      if (element !== null) {
        // @ts-ignore Internal field
        element.__lexicalEditor = editor;
        return function () {
          // @ts-ignore Internal field
          element.__lexicalEditor = null;
        };
      }
    },
    [editor],
  );
  return (
    <div className={viewClassName}>
      {!timeTravelEnabled && totalEditorStates > 2 && (
        <button
          onClick={function () {
            var rootElement = editor.getRootElement();
            if (rootElement !== null) {
              rootElement.contentEditable = 'false';
              playingIndexRef.current = totalEditorStates - 1;
              setTimeTravelEnabled(true);
            }
          }}
          className={timeTravelButtonClassName}
          type="button">
          Time Travel
        </button>
      )}
      <pre ref={treeElementRef}>{content}</pre>
      {timeTravelEnabled && (
        <div className={timeTravelPanelClassName}>
          <button
            className={timeTravelPanelButtonClassName}
            onClick={function () {
              setIsPlaying(!isPlaying);
            }}
            type="button">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <input
            className={timeTravelPanelSliderClassName}
            ref={inputRef}
            onChange={function (event) {
              var editorStateIndex = Number(event.target.value);
              var timeStampedEditorState =
                timeStampedEditorStates[editorStateIndex];
              if (timeStampedEditorState) {
                playingIndexRef.current = editorStateIndex;
                editor.setEditorState(timeStampedEditorState[1]);
              }
            }}
            type="range"
            min="1"
            max={totalEditorStates - 1}
          />
          <button
            className={timeTravelPanelButtonClassName}
            onClick={function () {
              var rootElement = editor.getRootElement();
              if (rootElement !== null) {
                rootElement.contentEditable = 'true';
                var index = timeStampedEditorStates.length - 1;
                var timeStampedEditorState = timeStampedEditorStates[index];
                editor.setEditorState(timeStampedEditorState[1]);
                var input = inputRef.current;
                if (input !== null) {
                  input.value = String(index);
                }
                setTimeTravelEnabled(false);
                setIsPlaying(false);
              }
            }}
            type="button">
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
exports.TreeView = TreeView;
function printRangeSelection(selection) {
  var res = '';
  var formatText = printFormatProperties(selection);
  res += ': range '.concat(
    formatText !== '' ? '{ '.concat(formatText, ' }') : '',
  );
  var anchor = selection.anchor;
  var focus = selection.focus;
  var anchorOffset = anchor.offset;
  var focusOffset = focus.offset;
  res += '\n  \u251C anchor { key: '
    .concat(anchor.key, ', offset: ')
    .concat(anchorOffset === null ? 'null' : anchorOffset, ', type: ')
    .concat(anchor.type, ' }');
  res += '\n  \u2514 focus { key: '
    .concat(focus.key, ', offset: ')
    .concat(focusOffset === null ? 'null' : focusOffset, ', type: ')
    .concat(focus.type, ' }');
  return res;
}
function printObjectSelection(selection) {
  // _node can be null, add default
  return ': node\n  \u2514 ['.concat(
    Array.from(selection._nodes || []).join(', '),
    ']',
  );
}
function printGridSelection(selection) {
  return ': grid\n  \u2514 { grid: '
    .concat(selection.gridKey, ', anchorCell: ')
    .concat(selection.anchor.key, ', focusCell: ')
    .concat(selection.focus.key, ' }');
}
function generateContent(editorState) {
  var res = ' root\n';
  var selectionString = editorState.read(function () {
    var selection = (0, lexical_1.$getSelection)();
    visitTree((0, lexical_1.$getRoot)(), function (node, indent) {
      var nodeKey = node.getKey();
      var nodeKeyDisplay = '('.concat(nodeKey, ')');
      var typeDisplay = node.getType() || '';
      var isSelected = node.isSelected();
      var idsDisplay = (0, mark_1.$isMarkNode)(node)
        ? ' id: [ '.concat(node.getIDs().join(', '), ' ] ')
        : '';
      res += ''
        .concat(isSelected ? SYMBOLS.selectedLine : ' ', ' ')
        .concat(indent.join(' '), ' ')
        .concat(nodeKeyDisplay, ' ')
        .concat(typeDisplay, ' ')
        .concat(idsDisplay, ' ')
        .concat(printNode(node), '\n');
      res += printSelectedCharsLine({
        indent: indent,
        isSelected: isSelected,
        node: node,
        nodeKeyDisplay: nodeKeyDisplay,
        selection: selection,
        typeDisplay: typeDisplay,
      });
    });
    return selection === null
      ? ': null'
      : (0, lexical_1.$isRangeSelection)(selection)
      ? printRangeSelection(selection)
      : (0, lexical_1.$isGridSelection)(selection)
      ? printGridSelection(selection)
      : printObjectSelection(selection);
  });
  return res + '\n selection' + selectionString;
}
function visitTree(currentNode, visitor, indent) {
  if (indent === void 0) {
    indent = [];
  }
  var childNodes = currentNode.getChildren();
  var childNodesLength = childNodes.length;
  childNodes.forEach(function (childNode, i) {
    visitor(
      childNode,
      indent.concat(
        i === childNodesLength - 1
          ? SYMBOLS.isLastChild
          : SYMBOLS.hasNextSibling,
      ),
    );
    if ((0, lexical_1.$isElementNode)(childNode)) {
      visitTree(
        childNode,
        visitor,
        indent.concat(
          i === childNodesLength - 1
            ? SYMBOLS.ancestorIsLastChild
            : SYMBOLS.ancestorHasNextSibling,
        ),
      );
    }
  });
}
function normalize(text) {
  return Object.entries(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).reduce(function (
    acc,
    _a,
  ) {
    var key = _a[0],
      value = _a[1];
    return acc.replace(new RegExp(key, 'g'), String(value));
  },
  text);
}
// TODO Pass via props to allow customizability
function printNode(node) {
  if ((0, lexical_1.$isTextNode)(node)) {
    var text = node.getTextContent(true);
    var title =
      text.length === 0 ? '(empty)' : '"'.concat(normalize(text), '"');
    var properties = printAllTextNodeProperties(node);
    return [
      title,
      properties.length !== 0 ? '{ '.concat(properties, ' }') : null,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  } else if ((0, link_1.$isLinkNode)(node)) {
    var link = node.getURL();
    var title =
      link.length === 0 ? '(empty)' : '"'.concat(normalize(link), '"');
    var properties = printAllLinkNodeProperties(node);
    return [
      title,
      properties.length !== 0 ? '{ '.concat(properties, ' }') : null,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  } else {
    return '';
  }
}
var FORMAT_PREDICATES = [
  function (node) {
    return node.hasFormat('bold') && 'Bold';
  },
  function (node) {
    return node.hasFormat('code') && 'Code';
  },
  function (node) {
    return node.hasFormat('italic') && 'Italic';
  },
  function (node) {
    return node.hasFormat('strikethrough') && 'Strikethrough';
  },
  function (node) {
    return node.hasFormat('subscript') && 'Subscript';
  },
  function (node) {
    return node.hasFormat('superscript') && 'Superscript';
  },
  function (node) {
    return node.hasFormat('underline') && 'Underline';
  },
];
var DETAIL_PREDICATES = [
  function (node) {
    return node.isDirectionless() && 'Directionless';
  },
  function (node) {
    return node.isUnmergeable() && 'Unmergeable';
  },
];
var MODE_PREDICATES = [
  function (node) {
    return node.isToken() && 'Token';
  },
  function (node) {
    return node.isSegmented() && 'Segmented';
  },
  function (node) {
    return node.isInert() && 'Inert';
  },
];
function printAllTextNodeProperties(node) {
  return [
    printFormatProperties(node),
    printDetailProperties(node),
    printModeProperties(node),
  ]
    .filter(Boolean)
    .join(', ');
}
function printAllLinkNodeProperties(node) {
  return [printTargetProperties(node), printRelProperties(node)]
    .filter(Boolean)
    .join(', ');
}
function printDetailProperties(nodeOrSelection) {
  var str = DETAIL_PREDICATES.map(function (predicate) {
    return predicate(nodeOrSelection);
  })
    .filter(Boolean)
    .join(', ')
    .toLocaleLowerCase();
  if (str !== '') {
    str = 'detail: ' + str;
  }
  return str;
}
function printModeProperties(nodeOrSelection) {
  var str = MODE_PREDICATES.map(function (predicate) {
    return predicate(nodeOrSelection);
  })
    .filter(Boolean)
    .join(', ')
    .toLocaleLowerCase();
  if (str !== '') {
    str = 'mode: ' + str;
  }
  return str;
}
function printFormatProperties(nodeOrSelection) {
  var str = FORMAT_PREDICATES.map(function (predicate) {
    return predicate(nodeOrSelection);
  })
    .filter(Boolean)
    .join(', ')
    .toLocaleLowerCase();
  if (str !== '') {
    str = 'format: ' + str;
  }
  return str;
}
function printTargetProperties(node) {
  var str = node.getTarget();
  // TODO Fix nullish on LinkNode
  if (str != null) {
    str = 'target: ' + str;
  }
  return str;
}
function printRelProperties(node) {
  var str = node.getRel();
  // TODO Fix nullish on LinkNode
  if (str != null) {
    str = 'rel: ' + str;
  }
  return str;
}
function printSelectedCharsLine(_a) {
  var indent = _a.indent,
    isSelected = _a.isSelected,
    node = _a.node,
    nodeKeyDisplay = _a.nodeKeyDisplay,
    selection = _a.selection,
    typeDisplay = _a.typeDisplay;
  // No selection or node is not selected.
  if (
    !(0, lexical_1.$isTextNode)(node) ||
    !(0, lexical_1.$isRangeSelection)(selection) ||
    !isSelected ||
    (0, lexical_1.$isElementNode)(node)
  ) {
    return '';
  }
  // No selected characters.
  var anchor = selection.anchor;
  var focus = selection.focus;
  if (
    node.getTextContent() === '' ||
    (anchor.getNode() === selection.focus.getNode() &&
      anchor.offset === focus.offset)
  ) {
    return '';
  }
  var _b = $getSelectionStartEnd(node, selection),
    start = _b[0],
    end = _b[1];
  if (start === end) {
    return '';
  }
  var selectionLastIndent =
    indent[indent.length - 1] === SYMBOLS.hasNextSibling
      ? SYMBOLS.ancestorHasNextSibling
      : SYMBOLS.ancestorIsLastChild;
  var indentionChars = __spreadArray(
    __spreadArray([], indent.slice(0, indent.length - 1), true),
    [selectionLastIndent],
    false,
  );
  var unselectedChars = Array(start + 1).fill(' ');
  var selectedChars = Array(end - start).fill(SYMBOLS.selectedChar);
  var paddingLength = typeDisplay.length + 3; // 2 for the spaces around + 1 for the double quote.
  var nodePrintSpaces = Array(nodeKeyDisplay.length + paddingLength).fill(' ');
  return (
    [
      SYMBOLS.selectedLine,
      indentionChars.join(' '),
      __spreadArray(
        __spreadArray(
          __spreadArray([], nodePrintSpaces, true),
          unselectedChars,
          true,
        ),
        selectedChars,
        true,
      ).join(''),
    ].join(' ') + '\n'
  );
}
function $getSelectionStartEnd(node, selection) {
  var _a, _b, _c, _d;
  var anchor = selection.anchor;
  var focus = selection.focus;
  var textContent = node.getTextContent(true);
  var textLength = textContent.length;
  var start = -1;
  var end = -1;
  // Only one node is being selected.
  if (anchor.type === 'text' && focus.type === 'text') {
    var anchorNode = anchor.getNode();
    var focusNode = focus.getNode();
    if (
      anchorNode === focusNode &&
      node === anchorNode &&
      anchor.offset !== focus.offset
    ) {
      (_a =
        anchor.offset < focus.offset
          ? [anchor.offset, focus.offset]
          : [focus.offset, anchor.offset]),
        (start = _a[0]),
        (end = _a[1]);
    } else if (node === anchorNode) {
      (_b = anchorNode.isBefore(focusNode)
        ? [anchor.offset, textLength]
        : [0, anchor.offset]),
        (start = _b[0]),
        (end = _b[1]);
    } else if (node === focusNode) {
      (_c = focusNode.isBefore(anchorNode)
        ? [focus.offset, textLength]
        : [0, focus.offset]),
        (start = _c[0]),
        (end = _c[1]);
    } else {
      // Node is within selection but not the anchor nor focus.
      (_d = [0, textLength]), (start = _d[0]), (end = _d[1]);
    }
  }
  // Account for non-single width characters.
  var numNonSingleWidthCharBeforeSelection = (
    textContent.slice(0, start).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
  ).length;
  var numNonSingleWidthCharInSelection = (
    textContent.slice(start, end).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
  ).length;
  return [
    start + numNonSingleWidthCharBeforeSelection,
    end +
      numNonSingleWidthCharBeforeSelection +
      numNonSingleWidthCharInSelection,
  ];
}
