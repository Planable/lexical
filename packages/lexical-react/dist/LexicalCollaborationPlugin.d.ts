/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {Doc} from 'yjs';
import {WebsocketProvider} from 'y-websocket';
import {InitialEditorStateType} from './LexicalComposer';
export declare function CollaborationPlugin({
  id,
  providerFactory,
  shouldBootstrap,
  username,
  initialEditorState,
}: {
  id: string;
  providerFactory: (
    id: string,
    yjsDocMap: Map<string, Doc>,
  ) => WebsocketProvider;
  shouldBootstrap: boolean;
  username?: string;
  initialEditorState?: InitialEditorStateType;
}): JSX.Element;
