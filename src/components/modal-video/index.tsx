"use client";
import React, { useEffect } from "react";
import { useTranslations } from 'next-intl';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoModalProps {
  videoId?: string;
  videoUrl?: string;
  channel?: 'youtube' | 'vimeo' | 'url';
}

const VideoModal: React.FC<VideoModalProps> = ({ 
  videoId = "iSbzh0r9IV4",
  videoUrl,
  channel = 'youtube'
}) => {
  const tCommon = useTranslations('common');
  const [isOpen, setIsOpen] = React.useState(false);
  
  // 构建视频 URL
  const getVideoUrl = (): string => {
    if (videoUrl) return videoUrl;
    if (channel === 'youtube') {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    if (channel === 'vimeo') {
      return `https://vimeo.com/${videoId}`;
    }
    return videoUrl || '';
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // ESC 键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  return (
    <div className="relative">
      {/* 视频播放按钮 */}
      <button 
        onClick={handleOpenModal}
        aria-label={tCommon('accessibility.playVideo')}
        type="button"
        className="group relative w-16 h-16 bg-white/80 hover:bg-white border-2 border-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
      >
        {/* 波纹效果 - 多个同心圆，更慢更自然 */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{animationDuration: '3s'}}></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
        
        {/* 播放图标 */}
        <div className="relative z-10 flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-300 ml-1" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        
        {/* 悬停时的光晕效果 */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20 blur-md"></div>
      </button>
      
      {/* 自定义视频模态框 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-9998"
              onClick={handleBackdropClick}
            />
            
            {/* 模态框内容 */}
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative w-full max-w-5xl pointer-events-auto"
              >
                {/* 关闭按钮 */}
                <button
                  onClick={handleCloseModal}
                  aria-label="Close video"
                  className="absolute cursor-pointer -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-linear-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500/50 z-10"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* 视频容器 */}
                <div className="relative w-full bg-linear-to-br from-gray-900/90 to-black/90 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
                  <div className="relative pt-[56.25%] bg-black rounded-t-2xl">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <ReactPlayer
                      src={getVideoUrl()}
                      playing={isOpen}
                      controls={true}
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoModal;
