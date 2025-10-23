"use client";
import "./style.scss";
import Image from "next/image";
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

const OurTeam = () => {
  const { elementRef: sectionRef } = useScrollAnimation({
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2
  });

  const { containerRef: headerRef } = useStaggeredAnimation('.title-line, .slogan', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.3
  });

  const { containerRef: speakersRef } = useStaggeredAnimation('.speaker-item', {
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.5
  });

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="our-speakers speakers-home-two">
      <div className="bg-img"></div>
      {/* <span className="title-position title-position-left">Speakers</span>
      <span className="title-position title-position-right">Experts</span> */}
      <div className="container">
        <div ref={headerRef as React.RefObject<HTMLDivElement>}>
          <h2 className="title-line">Our Team</h2>
          <p className="slogan">
            They possess the secret knowledge and interesting experience of
            creating a digital product.
          </p>
        </div>
        <div ref={speakersRef as React.RefObject<HTMLDivElement>} className="our-speakers-cover">
          <div className="speaker-item">
            <div className="speaker-item-img">
              <Image
                className="lazy"
                src="/images/speaker-3.jpg"
                alt="Team Member A"
                width={300}
                height={300}
                priority
              />
            </div>
            <div className="speaker-item-content">
              <h3>A</h3>
              <div className="prof">CEO, IT Metrix</div>
              <p>Team Member Introduction</p>
              {/* <ul className="soc-link">
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-behance"></i>
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="#"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
              </ul> */}
            </div>
          </div>
          <div className="speaker-item">
            <div className="speaker-item-img">
              <Image
                className="lazy"
                src="/images/speaker-3.jpg"
                alt="Team Member B"
                width={300}
                height={300}
              />
            </div>
            <div className="speaker-item-content">
              <h3>B</h3>
              <div className="prof">CEO, IT Metrix</div>
              <p>Team Member Introduction</p>
              <ul className="soc-link">
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-behance"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="speaker-item">
            <div className="speaker-item-img">
              <Image
                className="lazy"
                src="/images/speaker-3.jpg"
                alt="Team Member C"
                width={300}
                height={300}
              />
            </div>
            <div className="speaker-item-content">
              <h3>C</h3>
              <div className="prof">CEO, IT Metrix</div>
              <p>Team Member Introduction</p>
              <ul className="soc-link">
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-behance"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="speaker-item">
            <div className="speaker-item-img">
              <Image
                className="lazy"
                src="/images/speaker-3.jpg"
                alt="Team Member D"
                width={300}
                height={300}
              />
            </div>
            <div className="speaker-item-content">
              <h3>D</h3>
              <div className="prof">CEO, IT Metrix</div>
              <p>Team Member Introduction</p>
              <ul className="soc-link">
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-behance"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
