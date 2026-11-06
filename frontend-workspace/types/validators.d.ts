export const patterns: Readonly<{ email: RegExp; mobileCN: RegExp; positiveInteger: RegExp }>;
export function isEmail(value: unknown): boolean;
export function isMobileCN(value: unknown): boolean;
export function isPositiveInteger(value: unknown): boolean;
