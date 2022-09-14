/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {LexicalNode} from 'lexical';
import {TypeaheadOption} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {LexicalCommand, LexicalEditor} from 'lexical';
import * as React from 'react';
export declare type EmbedMatchResult = {
  url: string;
  id: string;
};
export interface EmbedConfig {
  type: string;
  parseUrl: (text: string) => EmbedMatchResult | null;
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => void;
}
export declare const URL_MATCHER: RegExp;
export declare const INSERT_EMBED_COMMAND: LexicalCommand<EmbedConfig['type']>;
export declare type EmbedMenuProps = {
  selectedItemIndex: number | null;
  onOptionClick: (option: AutoEmbedOption, index: number) => void;
  onOptionMouseEnter: (index: number) => void;
  options: Array<AutoEmbedOption>;
};
export declare type EmbedMenuComponent = React.ComponentType<EmbedMenuProps>;
export declare class AutoEmbedOption extends TypeaheadOption {
  title: string;
  icon?: JSX.Element;
  onSelect: (targetNode: LexicalNode | null) => void;
  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      onSelect: (targetNode: LexicalNode | null) => void;
    },
  );
}
declare type LexicalAutoEmbedPluginProps<TEmbedConfig extends EmbedConfig> = {
  embedConfigs: Array<TEmbedConfig>;
  onOpenEmbedModalForConfig: (embedConfig: TEmbedConfig) => void;
  menuComponent: EmbedMenuComponent;
  getMenuOptions: (
    activeEmbedConfig: TEmbedConfig,
    embedFn: () => void,
    dismissFn: () => void,
  ) => Array<AutoEmbedOption>;
};
export declare function LexicalAutoEmbedPlugin<
  TEmbedConfig extends EmbedConfig,
>({
  embedConfigs,
  onOpenEmbedModalForConfig,
  getMenuOptions,
  menuComponent: MenuComponent,
}: LexicalAutoEmbedPluginProps<TEmbedConfig>): JSX.Element | null;
export {};
