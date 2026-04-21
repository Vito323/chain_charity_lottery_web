import { parseUnits } from "ethers";

/** 与 `useTranslations('common')` 的键路径一致（不含 `common.` 前缀） */
export function isCommonMessageKey(msg: string): boolean {
  const k = msg.trim();
  return (
    k.startsWith("errors.") ||
    k.startsWith("wallet.") ||
    k.startsWith("validation.")
  );
}

/** 将后端返回的余额字符串尽量转为 wei（优先按人类可读小数解析，失败则按整数字符串当作 wei） */
export function userApiBalanceToWei(balance: string, decimals: number): bigint {
  const s = (balance || "0").trim();
  if (!s) return BigInt(0);
  try {
    return parseUnits(s, decimals);
  } catch {
    try {
      return BigInt(s);
    } catch {
      return BigInt(0);
    }
  }
}

/** 将钱包 / ethers 错误映射为 common 命名空间下的 message key */
export function mapEthersWriteErrorToCommonKey(e: unknown): string | null {
  const err = e as {
    code?: number | string;
    message?: string;
    shortMessage?: string;
    data?: { message?: string };
  };
  const inner = `${err?.message ?? ""} ${err?.shortMessage ?? ""} ${
    err?.data?.message ?? ""
  }`.toLowerCase();
  const c = err?.code;
  if (
    c === "ACTION_REJECTED" ||
    c === 4001 ||
    c === "4001" ||
    inner.includes("user rejected") ||
    inner.includes("user denied") ||
    inner.includes("rejected the request")
  ) {
    return "wallet.transactionRejected";
  }
  if (
    inner.includes("insufficient funds") ||
    inner.includes("insufficient balance") ||
    inner.includes("exceeds the balance") ||
    inner.includes("transfer amount exceeds balance")
  ) {
    return "errors.insufficientFunds";
  }
  if (
    inner.includes("invalid hexlify") ||
    inner.includes("invalid arrayify") ||
    inner.includes("invalid byteslike")
  ) {
    return "errors.invalidSignatureFormat";
  }
  if (inner.includes("not node owner")) {
    return "errors.notNodeOwner";
  }
  return null;
}
