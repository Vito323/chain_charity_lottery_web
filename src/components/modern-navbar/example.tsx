/**
 * Modern Navbar 使用示例
 * 
 * 这个文件展示了如何在项目中使用 ModernNavbar 组件
 * 替换现有的 Header 组件
 */

import React from 'react';
import ModernNavbar from './index';

// 示例 1: 基本使用
export const BasicExample = () => {
  return (
    <div className="app-layout">
      <ModernNavbar />
      <main className="main-content">
        <div className="container">
          <h1>欢迎使用 Modern Navbar</h1>
          <p>这是一个现代化的导航栏组件示例。</p>
        </div>
      </main>
    </div>
  );
};

// 示例 2: 在 Next.js Layout 中使用
export const LayoutExample = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      <main className="pt-20"> {/* 添加顶部间距避免被固定导航栏遮挡 */}
        {children}
      </main>
    </div>
  );
};

// 示例 3: 自定义样式包装
export const CustomStyledExample = () => {
  return (
    <div className="custom-app">
      <style jsx>{`
        .custom-app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .main-content {
          padding-top: 80px;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .content-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 600px;
          margin: 0 20px;
        }
        
        .content-card h1 {
          color: #1e293b;
          font-size: 2.5rem;
          margin-bottom: 20px;
          font-weight: 700;
        }
        
        .content-card p {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.6;
        }
      `}</style>
      
      <ModernNavbar />
      <main className="main-content">
        <div className="content-card">
          <h1>Modern Navbar 示例</h1>
          <p>
            这个导航栏组件具有现代化的设计风格，流畅的动画效果，
            以及完美的响应式支持。它完全兼容 Next.js 路由系统，
            并提供了出色的用户体验。
          </p>
        </div>
      </main>
    </div>
  );
};

export default BasicExample;
