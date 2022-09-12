'use strict';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
exports.__esModule = true;
exports.useYjsHistory =
  exports.useYjsFocusTracking =
  exports.useYjsCollaboration =
    void 0;
var utils_1 = require('@lexical/utils');
var yjs_1 = require('@lexical/yjs');
var lexical_1 = require('lexical');
var React = require('react');
var react_1 = require('react');
var react_dom_1 = require('react-dom');
function useYjsCollaboration(
  editor,
  id,
  provider,
  docMap,
  name,
  color,
  shouldBootstrap,
  initialEditorState,
) {
  var isReloadingDoc = (0, react_1.useRef)(false);
  var _a = (0, react_1.useState)(docMap.get(id)),
    doc = _a[0],
    setDoc = _a[1];
  var binding = (0, react_1.useMemo)(
    function () {
      return (0, yjs_1.createBinding)(editor, provider, id, doc, docMap);
    },
    [editor, provider, id, docMap, doc],
  );
  var connect = (0, react_1.useCallback)(
    function () {
      provider.connect();
    },
    [provider],
  );
  var disconnect = (0, react_1.useCallback)(
    function () {
      try {
        provider.disconnect();
      } catch (e) {
        // Do nothing
      }
    },
    [provider],
  );
  (0, react_1.useEffect)(
    function () {
      var root = binding.root;
      var awareness = provider.awareness;
      var onStatus = function (_a) {
        var status = _a.status;
        editor.dispatchCommand(yjs_1.CONNECTED_COMMAND, status === 'connected');
      };
      var onSync = function (isSynced) {
        if (
          shouldBootstrap &&
          isSynced &&
          // TODO: check if isEmpty and root have some elem
          // root.isEmpty() &&
          // root._xmlText._length === 0 &&
          isReloadingDoc.current === false
        ) {
          initializeEditor(editor, initialEditorState);
        }
        isReloadingDoc.current = false;
      };
      var onAwarenessUpdate = function () {
        (0, yjs_1.syncCursorPositions)(binding, provider);
      };
      var onYjsTreeChanges = function (
        // The below `any` type is taken directly from the vendor types for YJS.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events,
        transaction,
      ) {
        if (transaction.origin !== binding) {
          (0, yjs_1.syncYjsChangesToLexical)(binding, provider, events);
        }
      };
      (0, yjs_1.initLocalState)(
        provider,
        name,
        color,
        document.activeElement === editor.getRootElement(),
      );
      var onProviderDocReload = function (ydoc) {
        clearEditorSkipCollab(editor, binding);
        setDoc(ydoc);
        docMap.set(id, ydoc);
        isReloadingDoc.current = true;
      };
      provider.on('reload', onProviderDocReload);
      provider.on('status', onStatus);
      provider.on('sync', onSync);
      awareness.on('update', onAwarenessUpdate);
      // This updates the local editor state when we recieve updates from other clients
      root.getSharedType().observeDeep(onYjsTreeChanges);
      var removeListener = editor.registerUpdateListener(function (_a) {
        var prevEditorState = _a.prevEditorState,
          editorState = _a.editorState,
          dirtyLeaves = _a.dirtyLeaves,
          dirtyElements = _a.dirtyElements,
          normalizedNodes = _a.normalizedNodes,
          tags = _a.tags;
        if (tags.has('skip-collab') === false) {
          (0, yjs_1.syncLexicalUpdateToYjs)(
            binding,
            provider,
            prevEditorState,
            editorState,
            dirtyElements,
            dirtyLeaves,
            normalizedNodes,
            tags,
          );
        }
      });
      connect();
      return function () {
        if (isReloadingDoc.current === false) {
          disconnect();
        }
        provider.off('sync', onSync);
        provider.off('status', onStatus);
        provider.off('reload', onProviderDocReload);
        awareness.off('update', onAwarenessUpdate);
        root.getSharedType().unobserveDeep(onYjsTreeChanges);
        docMap['delete'](id);
        removeListener();
      };
    },
    [
      binding,
      color,
      connect,
      disconnect,
      docMap,
      editor,
      id,
      name,
      provider,
      shouldBootstrap,
    ],
  );
  var cursorsContainer = (0, react_1.useMemo)(
    function () {
      var ref = function (element) {
        binding.cursorsContainer = element;
      };
      return (0, react_dom_1.createPortal)(<div ref={ref} />, document.body);
    },
    [binding],
  );
  (0, react_1.useEffect)(
    function () {
      return editor.registerCommand(
        yjs_1.TOGGLE_CONNECT_COMMAND,
        function (payload) {
          if (connect !== undefined && disconnect !== undefined) {
            var shouldConnect = payload;
            if (shouldConnect) {
              // eslint-disable-next-line no-console
              console.log('Collaboration connected!');
              connect();
            } else {
              // eslint-disable-next-line no-console
              console.log('Collaboration disconnected!');
              disconnect();
            }
          }
          return true;
        },
        lexical_1.COMMAND_PRIORITY_EDITOR,
      );
    },
    [connect, disconnect, editor],
  );
  return [cursorsContainer, binding];
}
exports.useYjsCollaboration = useYjsCollaboration;
function useYjsFocusTracking(editor, provider, name, color) {
  (0, react_1.useEffect)(
    function () {
      return (0, utils_1.mergeRegister)(
        editor.registerCommand(
          lexical_1.FOCUS_COMMAND,
          function (payload) {
            (0, yjs_1.setLocalStateFocus)(provider, name, color, true);
            return true;
          },
          lexical_1.COMMAND_PRIORITY_EDITOR,
        ),
        editor.registerCommand(
          lexical_1.BLUR_COMMAND,
          function (payload) {
            (0, yjs_1.setLocalStateFocus)(provider, name, color, false);
            return true;
          },
          lexical_1.COMMAND_PRIORITY_EDITOR,
        ),
      );
    },
    [color, editor, name, provider],
  );
}
exports.useYjsFocusTracking = useYjsFocusTracking;
function useYjsHistory(editor, binding) {
  var undoManager = (0, react_1.useMemo)(
    function () {
      return (0, yjs_1.createUndoManager)(
        binding,
        binding.root.getSharedType(),
      );
    },
    [binding],
  );
  (0, react_1.useEffect)(function () {
    var undo = function () {
      undoManager.undo();
    };
    var redo = function () {
      undoManager.redo();
    };
    return (0, utils_1.mergeRegister)(
      editor.registerCommand(
        lexical_1.UNDO_COMMAND,
        function () {
          undo();
          return true;
        },
        lexical_1.COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        lexical_1.REDO_COMMAND,
        function () {
          redo();
          return true;
        },
        lexical_1.COMMAND_PRIORITY_EDITOR,
      ),
    );
  });
  var clearHistory = (0, react_1.useCallback)(
    function () {
      undoManager.clear();
    },
    [undoManager],
  );
  return clearHistory;
}
exports.useYjsHistory = useYjsHistory;
function initializeEditor(editor, initialEditorState) {
  editor.update(
    function () {
      var root = (0, lexical_1.$getRoot)();
      if (root.isEmpty()) {
        if (initialEditorState) {
          switch (typeof initialEditorState) {
            case 'string': {
              var parsedEditorState =
                editor.parseEditorState(initialEditorState);
              editor.setEditorState(parsedEditorState, {tag: 'collaboration'});
              break;
            }
            case 'object': {
              editor.setEditorState(initialEditorState, {tag: 'collaboration'});
              break;
            }
            case 'function': {
              editor.update(
                function () {
                  var root1 = (0, lexical_1.$getRoot)();
                  if (root1.isEmpty()) {
                    initialEditorState(editor);
                  }
                },
                {tag: 'collaboration'},
              );
              break;
            }
          }
        } else {
          var paragraph = (0, lexical_1.$createParagraphNode)();
          root.append(paragraph);
          var activeElement = document.activeElement;
          if (
            (0, lexical_1.$getSelection)() !== null ||
            (activeElement !== null &&
              activeElement === editor.getRootElement())
          ) {
            paragraph.select();
          }
        }
      }
    },
    {
      tag: 'history-merge',
    },
  );
}
function clearEditorSkipCollab(editor, binding) {
  // reset editor state
  editor.update(
    function () {
      var root = (0, lexical_1.$getRoot)();
      root.clear();
      root.select();
    },
    {
      tag: 'skip-collab',
    },
  );
  if (binding.cursors == null) {
    return;
  }
  var cursors = binding.cursors;
  if (cursors == null) {
    return;
  }
  var cursorsContainer = binding.cursorsContainer;
  if (cursorsContainer == null) {
    return;
  }
  // reset cursors in dom
  var cursorsArr = Array.from(cursors.values());
  for (var i = 0; i < cursorsArr.length; i++) {
    var cursor = cursorsArr[i];
    var selection = cursor.selection;
    if (selection && selection.selections != null) {
      var selections = selection.selections;
      for (var j = 0; j < selections.length; j++) {
        cursorsContainer.removeChild(selections[i]);
      }
    }
  }
}
