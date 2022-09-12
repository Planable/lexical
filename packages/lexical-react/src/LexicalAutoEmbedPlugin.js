'use strict';
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
exports.LexicalAutoEmbedPlugin =
  exports.AutoEmbedOption =
  exports.INSERT_EMBED_COMMAND =
  exports.URL_MATCHER =
    void 0;
var link_1 = require('@lexical/link');
var LexicalComposerContext_1 = require('@lexical/react/LexicalComposerContext');
var LexicalTypeaheadMenuPlugin_1 = require('@lexical/react/LexicalTypeaheadMenuPlugin');
var utils_1 = require('@lexical/utils');
var lexical_1 = require('lexical');
var react_1 = require('react');
var React = require('react');
var ReactDOM = require('react-dom');
exports.URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
exports.INSERT_EMBED_COMMAND = (0, lexical_1.createCommand)();
var AutoEmbedOption = /** @class */ (function (_super) {
  __extends(AutoEmbedOption, _super);
  function AutoEmbedOption(title, options) {
    var _this = _super.call(this, title) || this;
    _this.title = title;
    _this.icon = options.icon;
    _this.onSelect = options.onSelect.bind(_this);
    return _this;
  }
  return AutoEmbedOption;
})(LexicalTypeaheadMenuPlugin_1.TypeaheadOption);
exports.AutoEmbedOption = AutoEmbedOption;
function LexicalAutoEmbedPlugin(_a) {
  var embedConfigs = _a.embedConfigs,
    onOpenEmbedModalForConfig = _a.onOpenEmbedModalForConfig,
    getMenuOptions = _a.getMenuOptions,
    MenuComponent = _a.menuComponent;
  var editor = (0, LexicalComposerContext_1.useLexicalComposerContext)()[0];
  var _b = (0, react_1.useState)(null),
    nodeKey = _b[0],
    setNodeKey = _b[1];
  var _c = (0, react_1.useState)(null),
    activeEmbedConfig = _c[0],
    setActiveEmbedConfig = _c[1];
  var reset = (0, react_1.useCallback)(function () {
    setNodeKey(null);
    setActiveEmbedConfig(null);
  }, []);
  var checkIfLinkNodeIsEmbeddable = (0, react_1.useCallback)(
    function (key) {
      editor.getEditorState().read(function () {
        var linkNode = (0, lexical_1.$getNodeByKey)(key);
        if ((0, link_1.$isLinkNode)(linkNode)) {
          var embedConfigMatch = embedConfigs.find(function (embedConfig) {
            return embedConfig.parseUrl(linkNode.__url);
          });
          if (embedConfigMatch != null) {
            setActiveEmbedConfig(embedConfigMatch);
            setNodeKey(linkNode.getKey());
          }
        }
      });
    },
    [editor, embedConfigs],
  );
  (0, react_1.useEffect)(
    function () {
      var listener = function (nodeMutations, _a) {
        var updateTags = _a.updateTags,
          dirtyLeaves = _a.dirtyLeaves;
        for (
          var _i = 0, nodeMutations_1 = nodeMutations;
          _i < nodeMutations_1.length;
          _i++
        ) {
          var _b = nodeMutations_1[_i],
            key = _b[0],
            mutation = _b[1];
          if (
            mutation === 'created' &&
            updateTags.has('paste') &&
            dirtyLeaves.size === 1
          ) {
            checkIfLinkNodeIsEmbeddable(key);
          } else if (key === nodeKey) {
            reset();
          }
        }
      };
      return utils_1.mergeRegister.apply(
        void 0,
        [link_1.LinkNode, link_1.AutoLinkNode].map(function (Klass) {
          return editor.registerMutationListener(Klass, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            return listener.apply(void 0, args);
          });
        }),
      );
    },
    [checkIfLinkNodeIsEmbeddable, editor, embedConfigs, nodeKey, reset],
  );
  (0, react_1.useEffect)(
    function () {
      return editor.registerCommand(
        exports.INSERT_EMBED_COMMAND,
        function (embedConfigType) {
          var embedConfig = embedConfigs.find(function (_a) {
            var type = _a.type;
            return type === embedConfigType;
          });
          if (embedConfig) {
            onOpenEmbedModalForConfig(embedConfig);
            return true;
          }
          return false;
        },
        lexical_1.COMMAND_PRIORITY_EDITOR,
      );
    },
    [editor, embedConfigs, onOpenEmbedModalForConfig],
  );
  var embedLinkViaActiveEmbedConfig = (0, react_1.useCallback)(
    function () {
      if (activeEmbedConfig != null && nodeKey != null) {
        var linkNode_1 = editor.getEditorState().read(function () {
          var node = (0, lexical_1.$getNodeByKey)(nodeKey);
          if ((0, link_1.$isLinkNode)(node)) {
            return node;
          }
          return null;
        });
        if ((0, link_1.$isLinkNode)(linkNode_1)) {
          var result_1 = activeEmbedConfig.parseUrl(linkNode_1.__url);
          if (result_1 != null) {
            editor.update(function () {
              activeEmbedConfig.insertNode(editor, result_1);
            });
            if (linkNode_1.isAttached()) {
              editor.update(function () {
                linkNode_1.remove();
              });
            }
          }
        }
      }
    },
    [activeEmbedConfig, editor, nodeKey],
  );
  var options = (0, react_1.useMemo)(
    function () {
      return activeEmbedConfig != null && nodeKey != null
        ? getMenuOptions(
            activeEmbedConfig,
            embedLinkViaActiveEmbedConfig,
            reset,
          )
        : [];
    },
    [
      activeEmbedConfig,
      embedLinkViaActiveEmbedConfig,
      getMenuOptions,
      nodeKey,
      reset,
    ],
  );
  var onSelectOption = (0, react_1.useCallback)(
    function (selectedOption, targetNode, closeMenu) {
      editor.update(function () {
        selectedOption.onSelect(targetNode);
        closeMenu();
      });
    },
    [editor],
  );
  return nodeKey != null ? (
    <LexicalTypeaheadMenuPlugin_1.LexicalNodeMenuPlugin
      nodeKey={nodeKey}
      onClose={reset}
      onSelectOption={onSelectOption}
      options={options}
      menuRenderFn={function (anchorElement, _a) {
        var selectedIndex = _a.selectedIndex,
          selectOptionAndCleanUp = _a.selectOptionAndCleanUp,
          setHighlightedIndex = _a.setHighlightedIndex;
        return anchorElement && nodeKey != null
          ? ReactDOM.createPortal(
              <MenuComponent
                options={options}
                selectedItemIndex={selectedIndex}
                onOptionClick={function (option, index) {
                  setHighlightedIndex(index);
                  selectOptionAndCleanUp(option);
                }}
                onOptionMouseEnter={function (index) {
                  setHighlightedIndex(index);
                }}
              />,
              anchorElement,
            )
          : null;
      }}
    />
  ) : null;
}
exports.LexicalAutoEmbedPlugin = LexicalAutoEmbedPlugin;
