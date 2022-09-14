/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {InitialEditorStateType} from '@lexical/plain-text';
export declare function PlainTextPlugin({
  contentEditable,
  placeholder,
  initialEditorState,
}: {
  contentEditable: JSX.Element;
  initialEditorState?: InitialEditorStateType;
  placeholder: JSX.Element | string;
}): JSX.Element;
