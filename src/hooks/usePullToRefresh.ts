'use client';

import { useCallback, useRef, useState } from 'react';

const PULL_THRESHOLD = 72;

export function usePullToRefresh(onRefresh: () => Promise<void>, enabled: boolean) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);

  const canPull = useCallback(() => {
    if (!enabled || refreshing) return false;
    return typeof window !== 'undefined' && window.scrollY <= 0;
  }, [enabled, refreshing]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!canPull()) return;
      startYRef.current = e.touches[0]?.clientY ?? 0;
      pullingRef.current = true;
    },
    [canPull]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pullingRef.current || !canPull()) return;
      const delta = (e.touches[0]?.clientY ?? 0) - startYRef.current;
      if (delta > 0) setPullDistance(Math.min(delta * 0.45, 96));
      else setPullDistance(0);
    },
    [canPull]
  );

  const onTouchEnd = useCallback(async () => {
    if (!pullingRef.current) return;
    pullingRef.current = false;
    if (pullDistance >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setPullDistance(0);
  }, [onRefresh, pullDistance, refreshing]);

  const indicatorVisible = pullDistance > 8 || refreshing;

  return {
    pullDistance,
    refreshing,
    indicatorVisible,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
