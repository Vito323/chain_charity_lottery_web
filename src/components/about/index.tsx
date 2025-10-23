"use client";
import "./style.css";
import VideoModal from "../modal-video";
import Link from "next/link";
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

const About = () => {
  const { elementRef: sectionRef } = useScrollAnimation({
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2
  });

  const { containerRef: textContentRef } = useStaggeredAnimation('.wpo-about-text > *', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.3
  });

  const { elementRef: imageRef } = useScrollAnimation({
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out"
  });

  return (
    <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="wpo-about-area section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 colsm-12">
            <div ref={textContentRef as React.RefObject<HTMLDivElement>} className="wpo-about-text">
              <div className="wpo-section-title">
                <span>What We Do?</span>
                <h2>We Are In A Mission To Help The Helpless</h2>
              </div>
              <p>
              Every life deserves a chance, and every person deserves dignity. Our mission is built on a simple, yet profound principle: to be the reliable bridge between urgent need and effective action. We stand in the gap, committing our resources, time, and heart to the most vulnerable communities—from providing essential medical care and educational support to delivering immediate disaster relief.
              </p>
              <p>
              The scale of global challenges is vast, but so is the power of collective generosity. We can&apos;t do this alone. By joining our mission, whether through donation, volunteering, or spreading the word, you become an indispensable force in this change.{" "}
              </p>
              <div className="btns">
                <Link
                  href="/project"
                  className="theme-btn"
                  // onClick={ClickHandler}
                >
                  Donate Now
                </Link>
                <ul>
                  <li className="video-holder">
                    <VideoModal />
                  </li>
                  <li className="video-text">Watch Our Video</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 colsm-12">
            <div ref={imageRef as React.RefObject<HTMLDivElement>} className="wpo-about-img-3">
              <img src={"/images/about3.png"} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
