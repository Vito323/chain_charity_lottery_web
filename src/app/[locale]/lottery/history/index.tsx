

'use client';

import React from 'react';
import { formatCurrency } from '@/utils/currency';
import './style.css';

// 历史开奖结果数据类型
interface LotteryHistoryItem {
  id: string;
  drawDate: string;
  txHash: string;
  winningDNA: string;
  prizeAmount: string;
}

// 缺省数据（使用数字格式，通过formatCurrency函数格式化显示）
const defaultHistoryData: LotteryHistoryItem[] = [
  {
    id: '1',
    drawDate: '2024-02-10',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    winningDNA: '05 12 23 31 45 50',
    prizeAmount: formatCurrency(1050200)
  },
  {
    id: '2',
    drawDate: '2024-02-03',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    winningDNA: '11 19 28 33 41 49',
    prizeAmount: formatCurrency(980500)
  },
  {
    id: '3',
    drawDate: '2024-01-27',
    txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    winningDNA: '02 08 15 29 38 44',
    prizeAmount: formatCurrency(1530000)
  },
  {
    id: '4',
    drawDate: '2024-01-20',
    txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    winningDNA: '07 14 21 35 42 48',
    prizeAmount: formatCurrency(2100000)
  },
  {
    id: '5',
    drawDate: '2024-01-13',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    winningDNA: '03 16 24 37 43 46',
    prizeAmount: formatCurrency(850750)
  }
];

const LotteryHistory = () => {
  // 这里可以添加状态管理和数据获取逻辑
  const [historyData] = React.useState<LotteryHistoryItem[]>(defaultHistoryData);
  const [isLoading] = React.useState(false);
  const [error] = React.useState<string | null>(null);
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  // 截断交易哈希显示
  const truncateTxHash = (hash: string) => {
    if (hash.length <= 20) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  // 复制交易哈希到剪贴板
  const copyTxHash = async (txHash: string) => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopiedHash(txHash);
      // 2秒后清除复制状态
      setTimeout(() => {
        setCopiedHash(null);
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="lottery-history-page">
      <div className="history-container">
        {/* 页面标题 */}
        <h1 className="history-title">Lottery History</h1>

        {/* 加载状态 */}
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="error-state">
            <p className="error-text">Failed to load: {error}</p>
          </div>
        )}

        {/* 历史记录表格 */}
        {!isLoading && !error && historyData.length > 0 && (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Draw Date</th>
                  <th>Tx Hash</th>
                  <th>Winning DNA</th>
                  <th>Prize Pool</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item) => (
                  <tr key={item.id}>
                    <td className="date-column">{item.drawDate}</td>
                    <td 
                      className={`tx-hash-column ${copiedHash === item.txHash ? 'copied' : ''}`}
                      title={item.txHash}
                      onClick={() => copyTxHash(item.txHash)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="tx-hash-content">
                        <span>{truncateTxHash(item.txHash)}</span>
                        {copiedHash === item.txHash ? (
                          <svg className="copy-icon copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        ) : (
                          <svg className="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="dna-column">{item.winningDNA}</td>
                    <td className="prize-column">{item.prizeAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !error && historyData.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h3 className="empty-text">No lottery history available</h3>
            <p className="empty-subtitle">Check back later for the latest draw results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryHistory;