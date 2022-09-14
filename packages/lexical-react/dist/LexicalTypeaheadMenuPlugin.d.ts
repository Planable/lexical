/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {LexicalEditor, NodeKey, TextNode} from 'lexical';
import {MutableRefObject, ReactPortal} from 'react';
export declare type QueryMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};
export declare type Resolution = {
  match: QueryMatch;
  getRect: () => ClientRect;
};
export declare const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
export declare class TypeaheadOption {
  key: string;
  ref?: MutableRefObject<HTMLElement | null>;
  constructor(key: string);
  setRefElement(element: HTMLElement | null): void;
}
export declare type MenuRenderFn<TOption extends TypeaheadOption> = (
  anchorElement: HTMLElement | null,
  itemProps: {
    selectedIndex: number | null;
    selectOptionAndCleanUp: (option: TOption) => void;
    setHighlightedIndex: (index: number) => void;
  },
  matchingString: string,
) => ReactPortal | JSX.Element | null;
export declare function useBasicTypeaheadTriggerMatch(
  trigger: string,
  {
    minLength,
    maxLength,
  }: {
    minLength?: number;
    maxLength?: number;
  },
): TriggerFn;
export declare type TypeaheadMenuPluginArgs<TOption extends TypeaheadOption> = {
  onQueryChange: (matchingString: string | null) => void;
  onSelectOption: (
    option: TOption,
    textNodeContainingQuery: TextNode | null,
    closeMenu: () => void,
    matchingString: string,
  ) => void;
  options: Array<TOption>;
  menuRenderFn: MenuRenderFn<TOption>;
  triggerFn: TriggerFn;
};
export declare type TriggerFn = (
  text: string,
  editor: LexicalEditor,
) => QueryMatch | null;
export declare function LexicalTypeaheadMenuPlugin<
  TOption extends TypeaheadOption,
>({
  options,
  onQueryChange,
  onSelectOption,
  menuRenderFn,
  triggerFn,
}: TypeaheadMenuPluginArgs<TOption>): JSX.Element | null;
declare type NodeMenuPluginArgs<TOption extends TypeaheadOption> = {
  onSelectOption: (
    option: TOption,
    textNodeContainingQuery: TextNode | null,
    closeMenu: () => void,
    matchingString: string,
  ) => void;
  options: Array<TOption>;
  nodeKey: NodeKey | null;
  onClose: () => void;
  menuRenderFn: MenuRenderFn<TOption>;
};
export declare function LexicalNodeMenuPlugin<TOption extends TypeaheadOption>({
  options,
  nodeKey,
  onClose,
  onSelectOption,
  menuRenderFn,
}: NodeMenuPluginArgs<TOption>): JSX.Element | null;
export {};
