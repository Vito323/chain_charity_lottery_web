'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type NodeTermHintProps = {
  /** 弹层内标题 */
  title: string;
  /** 说明正文 */
  hint: string;
  /** 图标按钮的无障碍名称 */
  ariaLabel: string;
};

/**
 * 字段说明：点击展开（Portal 固定定位，不被父级 overflow 裁剪），点遮罩或 Escape 关闭。
 */
export function NodeTermHint({ title, hint, ariaLabel }: NodeTermHintProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(null);

  const updatePosition = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const maxW = 280;
    const panelWidth = Math.min(maxW, Math.max(200, window.innerWidth - 16));
    let left = r.left;
    if (left + panelWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - panelWidth - 8);
    }
    if (left < 8) left = 8;
    setBox({ top: r.bottom + 6, left, width: panelWidth });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setBox(null);
      return;
    }
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onScrollResize = () => updatePosition();
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    return () => {
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (btnRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.('[data-node-hint-panel]')) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen((v) => !v);
  };

  const portal =
    open &&
    box &&
    typeof document !== 'undefined' &&
    createPortal(
      <>
        <div
          className="fixed inset-0 bg-black/40"
          style={{ zIndex: 10040 }}
          aria-hidden
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        />
        <div
          data-node-hint-panel
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed rounded-xl border border-white/15 bg-[#0f172a]/98 px-3.5 py-3 text-xs leading-relaxed text-white/95 shadow-2xl backdrop-blur-md"
          style={{ top: box.top, left: box.left, width: box.width, zIndex: 10050 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-1.5 text-[13px] font-semibold text-white">{title}</div>
          <p className="text-white/88">{hint}</p>
        </div>
      </>,
      document.body
    );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={ariaLabel}
        className="ml-0.5 inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-white/55 outline-none ring-white/30 hover:bg-white/10 hover:text-white/95 focus-visible:ring-2 cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M12 16v-5M12 8h.01"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {portal}
    </>
  );
}
