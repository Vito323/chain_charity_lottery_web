import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import './style.css';

interface CoversProps {
  images: string[];
  isLoading?: boolean;
}

const Covers = ({ images, isLoading = false }: CoversProps) => {
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
      newStates[index] = true; // 标记为已处理，避免重复显示错误状态
      return newStates;
    });
  };

  // 添加手动点击处理函数作为备用方案
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
    <div className="swiper-container">
      <div className="swiper-slide-content">
        <div className="image-skeleton">
          <div className="skeleton-shimmer"></div>
          <div className="skeleton-text">Loading...</div>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="swiper-container">
      <div className="swiper-slide-content">
        <div className="empty-state">
          <div className="empty-icon">📷</div>
          <div className="empty-text">No Images</div>
          <div className="empty-subtitle">This project has no uploaded images yet</div>
        </div>
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
    <div className="swiper-container">
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
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          console.log(swiper);
        }}
        onNavigationNext={() => console.log('next navigation')}
        onNavigationPrev={() => console.log('prev navigation')}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide-content">
              {!imageLoadStates[index] && (
                <div className="image-loading">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading...</div>
                </div>
              )}
              <Image
                src={image}
                alt={`Project Image ${index + 1}`}
                width={800}
                height={354}
                className={`swiper-image ${imageLoadStates[index] ? 'loaded' : 'loading'}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imageLoadStates[index] ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
                priority={index === 0}
                unoptimized
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <>
          <button 
            className="swiper-button-prev-custom"
            onClick={handlePrevClick}
            type="button"
          >
            <i className="ti-angle-left"></i>
          </button>
          <button 
            className="swiper-button-next-custom"
            onClick={handleNextClick}
            type="button"
          >
            <i className="ti-angle-right"></i>
          </button>
        </>
      )}
    </div>
  );
}

export default Covers;