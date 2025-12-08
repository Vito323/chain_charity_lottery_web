'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import 'swiper/css';
import 'swiper/css/navigation';

interface CoversProps {
  images: string[];
  isLoading?: boolean;
}

const Covers = ({ images, isLoading = false }: CoversProps) => {
  const t = useTranslations('projectDetail.cover');
  const tCommon = useTranslations('common');
  const swiperRef = useRef<SwiperType | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<boolean[]>([]);

  // 初始化图片加载状态
  useEffect(() => {
    setImageLoadStates(new Array(images.length).fill(false));
  }, [images]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.update();
        if (swiperRef.current.navigation) {
          swiperRef.current.navigation.init();
          swiperRef.current.navigation.update();
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [images]);

  // 处理图片加载完成
  const handleImageLoad = (index: number) => {
    setImageLoadStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  // 处理图片加载错误
  const handleImageError = (index: number) => {
    setImageLoadStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  // 添加手动点击处理函数
  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // Loading state component
  const LoadingSkeleton = () => (
    <div className="w-full h-96 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-center">
      <div className="text-white/60">{tCommon('status.loading')}</div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="w-full h-96 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-center">
      <div className="text-center">
        <i className="ti-camera text-4xl text-white/40 mb-2"></i>
        <div className="text-white/60">{t('noImages')}</div>
      </div>
    </div>
  );

  // Show skeleton screen when loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show empty state when no image data
  if (!images || images.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative group">
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-4">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={false}
          loop={false}
          watchSlidesProgress={true}
          allowTouchMove={true}
          touchRatio={1}
          threshold={5}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                <Image
                  src={image}
                  alt={`${tCommon('images.projectImage')} ${index + 1}`}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{
                    opacity: imageLoadStates[index] ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  priority={index === 0}
                  unoptimized
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 自定义导航按钮 */}
        {images.length > 1 && (
          <>
            <button 
              className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              onClick={handlePrevClick}
              type="button"
            >
              <i className="ti-angle-left text-lg"></i>
            </button>
            <button 
              className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              onClick={handleNextClick}
              type="button"
            >
              <i className="ti-angle-right text-lg"></i>
            </button>
          </>
        )}
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20" />
    </div>
  );
};

export default Covers;
