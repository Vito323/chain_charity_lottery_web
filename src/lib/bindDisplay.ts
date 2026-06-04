/** 与 App `MeBindScreen` 展示逻辑对齐 */

export function parseReferrerField(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === 'string') {
    const trimmed = data.trim();
    return trimmed === '' ? null : trimmed;
  }
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const value =
      obj.id ??
      obj.address ??
      obj.referrer ??
      obj.referrerId ??
      obj.nodeId ??
      obj.name;
    if (value != null) return String(value);
  }
  return String(data);
}

export function isReferrerUnbound(value: string | null | undefined): boolean {
  if (value == null || value.trim() === '') return true;
  const normalized = value.trim().toLowerCase();
  if (normalized === '0x0') return true;
  if (normalized.startsWith('0x')) {
    const hex = normalized.slice(2);
    if (!hex || /^0+$/.test(hex)) return true;
  }
  return false;
}

export function shortenMiddle(value: string, head: number, tail: number): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function shortenAddress(value: string): string {
  if (!value.startsWith('0x') || value.length < 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function displayReferrer(
  value: string | null | undefined,
  labels: { unbound: string }
): string {
  if (isReferrerUnbound(value)) return labels.unbound;
  const v = value!;
  if (v.startsWith('0x') && v.length >= 10) return shortenAddress(v);
  if (v.length > 16) return shortenMiddle(v, 6, 4);
  return v;
}

export function displayNodeId(
  value: string | null | undefined,
  labels: { none: string }
): string {
  if (value == null || value.trim() === '') return labels.none;
  return shortenMiddle(value.trim(), 8, 8);
}

export function canCopyBindValue(
  rawValue: string | null | undefined,
  displayValue: string,
  labels: { unbound: string; none: string }
): boolean {
  if (rawValue == null || rawValue.trim() === '') return false;
  if (displayValue === labels.unbound || displayValue === labels.none) return false;
  if (isReferrerUnbound(rawValue)) return false;
  return true;
}
