import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import './style.css';

const Covers = ({ images }: { images: string[] }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  

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
              <Image
                src={image}
                alt={'thumbnail'}
                width={800}
                height={354}
                className="swiper-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                priority={index === 0}
                unoptimized
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