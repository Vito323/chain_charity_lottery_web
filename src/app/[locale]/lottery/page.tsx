"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import LotteryContent from "./content";
import LotteryHistory from "./history";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { getLotteryConfig, getLotteryHistory, type LotteryConfig, type LotteryHistory as LotteryHistoryType } from "@/service/lottery";

// 模块级别的防抖锁，防止短时间内多次挂载导致的重复调用
let lastConfigInitTime = 0;
let lastHistoryInitTime = 0;
const INIT_DEBOUNCE_MS = 200; // 200ms内的多次挂载只执行一次

export default function LotteryPage() {
  // 彩票配置状态
  const [lotteryConfig, setLotteryConfig] = useState<LotteryConfig>({
    nextDrawTime: 0,
    nextDrawLotteryTotal: '',
    nextDrawTimeString: ''
  });
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  // 历史记录状态
  const [historyData, setHistoryData] = useState<LotteryHistoryType[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  // 使用 ref 跟踪请求是否正在进行，避免重复调用
  const isConfigRequestingRef = useRef(false);
  const isHistoryRequestingRef = useRef(false);
  const hasConfigInitializedRef = useRef(false);
  const hasHistoryInitializedRef = useRef(false);

  // 获取彩票配置
  const fetchLotteryConfig = useCallback(async () => {
    if (isConfigRequestingRef.current) {
      return;
    }

    try {
      isConfigRequestingRef.current = true;
      setConfigLoading(true);
      setConfigError(null);
      const res = await getLotteryConfig();
      if (res.ok) {
        setLotteryConfig(res.data);
      } else {
        setConfigError(res.msg || 'Failed to load lottery config');
      }
    } catch (err) {
      console.error('Failed to fetch lottery config:', err);
      setConfigError('Failed to load lottery config');
    } finally {
      setConfigLoading(false);
      isConfigRequestingRef.current = false;
    }
  }, []);

  // 获取历史记录（支持分页）
  const fetchLotteryHistory = useCallback(async (page: number = 1, pageSize: number = PAGE_SIZE, append: boolean = false) => {
    if (isHistoryRequestingRef.current && !append) {
      return;
    }

    try {
      if (!append) {
        isHistoryRequestingRef.current = true;
        setHistoryLoading(true);
      }
      setHistoryError(null);
      const response = await getLotteryHistory(page, pageSize);
      
      if (response.ok) {
        if (response.data && Array.isArray(response.data)) {
          if (append) {
            // 追加数据
            setHistoryData((prev) => [...prev, ...response.data]);
            // 如果返回的数据少于 pageSize，说明没有更多数据了
            setHasMore(response.data.length === pageSize);
          } else {
            // 替换数据（刷新或首次加载）
            setHistoryData(response.data);
            setHasMore(response.data.length === pageSize);
            setCurrentPage(1);
          }
        } else {
          console.warn('Invalid data format from lottery history API:', response.data);
          if (!append) {
            setHistoryData([]);
          }
          setHasMore(false);
        }
      } else {
        const errorMsg = response.msg || response.code || 'Failed to load history';
        console.error('Failed to fetch lottery history:', errorMsg);
        setHistoryError(errorMsg);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to fetch lottery history:', err);
      setHistoryError('Failed to load history');
      setHasMore(false);
    } finally {
      if (!append) {
        setHistoryLoading(false);
        isHistoryRequestingRef.current = false;
      }
    }
  }, []);

  // 组件挂载时获取配置
  useEffect(() => {
    // const now = Date.now();
    // if (now - lastConfigInitTime < INIT_DEBOUNCE_MS || hasConfigInitializedRef.current) {
    //   return;
    // }

    // console.log('页面挂载时获取配置');
    // hasConfigInitializedRef.current = true;
    // lastConfigInitTime = now;
    // fetchLotteryConfig();

    // return () => {
    //   setTimeout(() => {
    //     hasConfigInitializedRef.current = false;
    //   }, INIT_DEBOUNCE_MS);
    // };
    fetchLotteryConfig()
  }, []);

  // 组件挂载时获取历史记录
  useEffect(() => {
    fetchLotteryHistory(1, PAGE_SIZE, false);
  }, [fetchLotteryHistory]);

  // 加载更多历史记录
  const handleLoadMore = useCallback(async (page: number, pageSize: number) => {
    await fetchLotteryHistory(page, pageSize, true);
    setCurrentPage(page);
  }, [fetchLotteryHistory]);

  // 刷新历史记录（倒计时结束后调用，从第1页开始）
  const handleRefreshHistory = useCallback(() => {
    fetchLotteryHistory(1, PAGE_SIZE, false);
    // 触发刷新事件，通知历史记录组件重置分页
    window.dispatchEvent(new Event('lotteryHistoryRefresh'));
  }, [fetchLotteryHistory]);

  // 监听开奖完成事件，刷新数据
  // useEffect(() => {
  //   const handleDrawComplete = () => {
  //     fetchLotteryConfig();
  //     fetchLotteryHistory();
  //   };

  //   window.addEventListener('lotteryDrawComplete', handleDrawComplete);

  //   return () => {
  //     window.removeEventListener('lotteryDrawComplete', handleDrawComplete);
  //   };
  // }, [fetchLotteryConfig, fetchLotteryHistory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0b1020] pt-24"
    >
      <Header />
      
      {/* Lottery Content Section */}
      <div id="lottery-content">
        <LotteryContent
          lotteryConfig={lotteryConfig}
          loading={configLoading}
          onRefresh={fetchLotteryConfig}
          onDrawComplete={handleRefreshHistory}
        />
      </div>

      {/* Lottery History Section */}
      <div id="lottery-history">
        <LotteryHistory
          historyData={historyData}
          isLoading={historyLoading}
          error={historyError}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefreshHistory}
          hasMore={hasMore}
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
}
