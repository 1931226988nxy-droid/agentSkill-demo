export type TreeKey = string | number;
export interface TreeFieldNames {
  label?: string;
  value?: string;
  children?: string;
}
export interface TreeNode extends Record<string, unknown> {
  title: string;
  key: TreeKey;
  value: TreeKey;
  children?: TreeNode[];
}
export function listToTree<T extends object>(
  items: T[],
  options?: { idKey?: string; parentKey?: string; childrenKey?: string },
): Array<T & Record<string, unknown>>;
export function normalizeTree(
  nodes: Record<string, unknown>[] | null | undefined,
  fieldNames?: TreeFieldNames,
): TreeNode[];
export function filterTree<T extends object>(
  nodes: T[],
  keyword: unknown,
  options?: { labelKey?: string; childrenKey?: string },
): T[];
export interface KeyedTreeNode {
  key: TreeKey;
  children?: KeyedTreeNode[];
}
export function getTreeKeys(nodes: KeyedTreeNode[] | null | undefined): TreeKey[];
export function findTreeNode<T extends object>(
  nodes: T[],
  value: unknown,
  valueKey?: string,
): T | undefined;
export function validateFile(
  file: Pick<File, 'name' | 'type' | 'size'>,
  options?: { accept?: string; maxSizeMB?: number },
): { valid: boolean; error: string };
export function safeFileName(name?: unknown): string;
export function getDownloadName(contentDisposition?: string | null, fallback?: string): string;
export function downloadBlob(blob: Blob, filename?: string): void;
export function formatBytes(value: unknown): string;
export function formatDate(
  value: string | number | Date | null | undefined,
  options?: { dateOnly?: boolean; locale?: string; timeZone?: string },
): string;
export function cloneQuery<T>(value: T): T;
export type Debounced<F extends (...args: any[]) => unknown> = ((
  this: ThisParameterType<F>,
  ...args: Parameters<F>
) => void) & { cancel(): void };
export function debounce<F extends (...args: any[]) => unknown>(
  fn: F,
  delay?: number,
): Debounced<F>;
