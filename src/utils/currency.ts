/**
 * 货币格式化工具函数
 */

/**
 * 格式化美金金额，添加千分位逗号
 * @param amount 金额（数字或字符串）
 * @param currency 货币符号，默认为 '$'
 * @param decimals 小数位数，默认为 0
 * @returns 格式化后的货币字符串
 * 
 * @example
 * formatCurrency(1234567) // "$1,234,567"
 * formatCurrency(1234567.89, '$', 2) // "$1,234,567.89"
 * formatCurrency("1500000") // "$1,500,000"
 */
export function formatCurrency(
  amount: number | string,
  currency: string = '$',
  decimals: number = 0
): string {
  // 转换为数字
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // 检查是否为有效数字
  if (isNaN(numAmount)) {
    return `${currency}0`;
  }
  
  // 使用 Intl.NumberFormat 进行格式化
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `${currency}${formatter.format(numAmount)}`;
}

/**
 * 格式化美金金额，自动处理小数位
 * @param amount 金额（数字或字符串）
 * @param currency 货币符号，默认为 '$'
 * @returns 格式化后的货币字符串（整数不显示小数位，小数保留2位）
 * 
 * @example
 * formatCurrencyAuto(1234567) // "$1,234,567"
 * formatCurrencyAuto(1234567.89) // "$1,234,567.89"
 * formatCurrencyAuto(1500000.5) // "$1,500,000.5"
 */
export function formatCurrencyAuto(
  amount: number | string,
  currency: string = '$'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `${currency}0`;
  }
  
  // 判断是否为整数
  const isInteger = numAmount % 1 === 0;
  const decimals = isInteger ? 0 : 2;
  
  return formatCurrency(numAmount, currency, decimals);
}

/**
 * 解析货币字符串为数字
 * @param currencyString 货币字符串，如 "$1,234,567.89"
 * @returns 解析后的数字
 * 
 * @example
 * parseCurrency("$1,234,567.89") // 1234567.89
 * parseCurrency("1,500,000") // 1500000
 */
export function parseCurrency(currencyString: string): number {
  // 移除货币符号和逗号
  const cleanString = currencyString.replace(/[$,]/g, '');
  return parseFloat(cleanString) || 0;
}

/**
 * 格式化大数字为缩写形式（如 K, M, B）
 * @param amount 金额
 * @param currency 货币符号，默认为 '$'
 * @param decimals 小数位数，默认为 1
 * @returns 格式化后的缩写字符串
 * 
 * @example
 * formatCurrencyCompact(1234567) // "$1.2M"
 * formatCurrencyCompact(1500) // "$1.5K"
 * formatCurrencyCompact(1500000000) // "$1.5B"
 */
export function formatCurrencyCompact(
  amount: number | string,
  currency: string = '$',
  decimals: number = 1
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `${currency}0`;
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: decimals,
  });
  
  // 替换默认的 USD 符号为自定义符号
  return formatter.format(numAmount).replace('US$', currency);
}

/**
 * 验证金额字符串格式
 * @param amountString 金额字符串
 * @returns 是否为有效的金额格式
 * 
 * @example
 * isValidCurrency("$1,234.56") // true
 * isValidCurrency("1234567") // true
 * isValidCurrency("invalid") // false
 */
export function isValidCurrency(amountString: string): boolean {
  // 移除货币符号和空格
  const cleanString = amountString.replace(/[$,\s]/g, '');
  
  // 检查是否为有效数字
  const num = parseFloat(cleanString);
  return !isNaN(num) && num >= 0;
}

/**
 * 比较两个货币字符串的大小
 * @param currency1 第一个货币字符串
 * @param currency2 第二个货币字符串
 * @returns 比较结果：1 (currency1 > currency2), -1 (currency1 < currency2), 0 (相等)
 * 
 * @example
 * compareCurrency("$1,500", "$1,200") // 1
 * compareCurrency("$800", "$1,200") // -1
 * compareCurrency("$1,200", "$1,200") // 0
 */
export function compareCurrency(currency1: string, currency2: string): number {
  const num1 = parseCurrency(currency1);
  const num2 = parseCurrency(currency2);
  
  if (num1 > num2) return 1;
  if (num1 < num2) return -1;
  return 0;
}
