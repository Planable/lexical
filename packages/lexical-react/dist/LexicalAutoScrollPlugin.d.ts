/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
declare type Props = Readonly<{
  scrollRef: {
    current: HTMLElement | null;
  };
}>;
export declare function AutoScrollPlugin({
  scrollRef,
}: Props): JSX.Element | null;
export {};
