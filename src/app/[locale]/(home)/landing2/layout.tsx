import type { Metadata } from "next";
import './landing2-globals.css';

export const metadata: Metadata = {
  title: "Stalwart AI - 高性能区块链生态系统",
  description: "专注于使用人工智能管理数字资产的高性能区块链生态系统，基于 Cosmos SDK 构建。",
};

export default function Landing2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
