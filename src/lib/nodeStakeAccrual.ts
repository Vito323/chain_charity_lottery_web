
const MONTHS_PER_CYCLE = 6;

function addCalendarMonths(dt: Date, months: number): Date {
  const totalMonthIndex = dt.getFullYear() * 12 + dt.getMonth() + months;
  const newYear = Math.floor(totalMonthIndex / 12);
  const newMonthIndex = totalMonthIndex % 12;
  const day = dt.getDate();
  const lastDayOfNewMonth = new Date(newYear, newMonthIndex + 1, 0).getDate();
  const newDay = day > lastDayOfNewMonth ? lastDayOfNewMonth : day;
  return new Date(
    newYear,
    newMonthIndex,
    newDay,
    dt.getHours(),
    dt.getMinutes(),
    dt.getSeconds(),
    dt.getMilliseconds()
  );
}

export function completedNaturalMonths(start: Date, now: Date): number {
  if (now.getTime() < start.getTime()) return 0;
  let m = 0;
  for (;;) {
    const boundary = addCalendarMonths(start, m + 1);
    if (boundary.getTime() > now.getTime()) break;
    m++;
  }
  return m;
}

function splitTotalIntoMonths(total: number, parts: number): number[] {
  if (parts <= 0) return [];
  if (total <= 0) return Array(parts).fill(0);
  const base = Math.floor(total / parts);
  const rem = total % parts;
  return Array.from({ length: parts }, (_, i) => base + (i === parts - 1 ? rem : 0));
}

function monthlyUsdSeries(reward: number): number[] {
  const totalPerCycle = Math.floor(reward / MONTHS_PER_CYCLE);
  return splitTotalIntoMonths(totalPerCycle, MONTHS_PER_CYCLE);
}

function monthlyTokenSeries(stakeAmount: number): number[] {
  const totalPerCycle = Math.floor(stakeAmount / MONTHS_PER_CYCLE);
  return splitTotalIntoMonths(totalPerCycle, MONTHS_PER_CYCLE);
}

function accruedInIncompleteMonthDouble(
  amountForMonth: number,
  monthStart: Date,
  monthEnd: Date,
  now: Date
): number {
  if (amountForMonth <= 0) return 0;
  if (now.getTime() < monthStart.getTime()) return 0;
  const totalUs = monthEnd.getTime() - monthStart.getTime();
  if (totalUs <= 0) return 0;
  if (now.getTime() >= monthEnd.getTime()) return amountForMonth;
  const elapsedUs = now.getTime() - monthStart.getTime();
  if (elapsedUs <= 0) return 0;
  const acc = (amountForMonth * elapsedUs) / totalUs;
  return Math.min(amountForMonth, acc);
}

export function accruedUsdDouble(stakeTimestampSec: number, reward: number, now: Date): number {
  if (reward <= 0 || stakeTimestampSec <= 0) return 0;
  const start = new Date(stakeTimestampSec * 1000);
  if (now.getTime() < start.getTime()) return 0;
  const monthly = monthlyUsdSeries(reward);
  const m = completedNaturalMonths(start, now);
  let sum = 0;
  for (let i = 0; i < m; i++) {
    sum += monthly[i % MONTHS_PER_CYCLE];
  }
  const monthStart = addCalendarMonths(start, m);
  const monthEnd = addCalendarMonths(start, m + 1);
  sum += accruedInIncompleteMonthDouble(
    monthly[m % MONTHS_PER_CYCLE],
    monthStart,
    monthEnd,
    now
  );
  return Math.round(sum * 100) / 100;
}

export function accruedReleasedTokenDouble(
  stakeTimestampSec: number,
  stakeAmount: number,
  now: Date
): number {
  if (stakeAmount <= 0 || stakeTimestampSec <= 0) return 0;
  const start = new Date(stakeTimestampSec * 1000);
  if (now.getTime() < start.getTime()) return 0;
  const monthly = monthlyTokenSeries(stakeAmount);
  const m = completedNaturalMonths(start, now);
  let sum = 0;
  for (let i = 0; i < m; i++) {
    sum += monthly[i % MONTHS_PER_CYCLE];
  }
  const monthStart = addCalendarMonths(start, m);
  const monthEnd = addCalendarMonths(start, m + 1);
  sum += accruedInIncompleteMonthDouble(
    monthly[m % MONTHS_PER_CYCLE],
    monthStart,
    monthEnd,
    now
  );
  return Math.round(sum * 100) / 100;
}

export function nextReleaseAt(stakeTimestampSec: number, now: Date): Date | null {
  if (stakeTimestampSec <= 0) return null;
  const start = new Date(stakeTimestampSec * 1000);
  let boundary = addCalendarMonths(start, MONTHS_PER_CYCLE);
  while (boundary.getTime() <= now.getTime()) {
    boundary = addCalendarMonths(boundary, MONTHS_PER_CYCLE);
  }
  return boundary;
}
