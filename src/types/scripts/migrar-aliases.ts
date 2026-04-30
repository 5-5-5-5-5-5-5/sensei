// SPDX-License-Identifier: MIT

export type AliasRule =
  | {
      alias: string;
      kind: 'exact';
      targetPath: string;
    }
  | {
      aliasPrefix: string;
      kind: 'wildcard';
      targetPrefix: string;
    };
