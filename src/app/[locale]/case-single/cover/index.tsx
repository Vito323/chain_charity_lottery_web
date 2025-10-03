import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
// Import custom styles
import './style.css';

const Covers = () => {
  // 图片数据
  const images = [
    {
      src: '/images/case/img-1.png',
      alt: 'Case Study 1'
    },
    {
      src: '/images/case/img-2.png',
      alt: 'Case Study 2'
    },
    {
      src: '/images/case/img-3.png',
      alt: 'Case Study 3'
    }
  ];

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
          console.log(swiper);
          // 强制更新 Swiper 尺寸
          // setTimeout(() => {
          //   swiper.updateSize();
          //   swiper.updateSlides();
          //   swiper.updateProgress();
          // }, 100);
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide-content">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="swiper-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <>
          <button className="swiper-button-prev-custom slick-arrow slick-prev">
            <i className="ti-angle-left"></i>
          </button>
          <button className="swiper-button-next-custom slick-arrow slick-next">
            <i className="ti-angle-right"></i>
          </button>
        </>
      )}
    </div>
  );
}

export default Covers;