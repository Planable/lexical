/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {Binding} from '@lexical/yjs';
import type {EditorState, LexicalEditor} from 'lexical';
import type {Doc} from 'yjs';
import {WebsocketProvider} from 'y-websocket';
export declare type InitialEditorStateType =
  | null
  | string
  | EditorState
  | ((editor: LexicalEditor) => void);
export declare function useYjsCollaboration(
  editor: LexicalEditor,
  id: string,
  provider: WebsocketProvider,
  docMap: Map<string, Doc>,
  name: string,
  color: string,
  shouldBootstrap: boolean,
  initialEditorState?: InitialEditorStateType,
): [JSX.Element, Binding];
export declare function useYjsFocusTracking(
  editor: LexicalEditor,
  provider: WebsocketProvider,
  name: string,
  color: string,
): void;
export declare function useYjsHistory(
  editor: LexicalEditor,
  binding: Binding,
): () => void;
